package com.springboot.TomaTask.service;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.diff.DiffEntry;
import org.eclipse.jgit.diff.DiffFormatter;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.ObjectReader;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.revwalk.RevWalk;
import org.eclipse.jgit.treewalk.CanonicalTreeParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class RepositoryService {

    private static final Logger logger = LoggerFactory.getLogger(RepositoryService.class);

    @Value("${repo.url}")
    private String repoUrl;

    @Value("${repo.branch:main}")
    private String branch;

    @Value("${repo.path:/tmp/repo}")
    private String repoPath;

    private Git git;
    private final VectorStoreService vectorStore;
    private final EmbeddingService embeddingService;
    private final ExecutorService executorService = Executors.newFixedThreadPool(4);

    public RepositoryService(VectorStoreService vectorStore, EmbeddingService embeddingService) {
        this.vectorStore = vectorStore;
        this.embeddingService = embeddingService;
    }

    /**
     * Clone or update repository
     */
    public void cloneOrUpdateRepo() throws GitAPIException, IOException {
        File repoDir = new File(repoPath);
        
        if (repoDir.exists()) {
            git = Git.open(repoDir);
            git.pull().setRemoteBranchName(branch).call();
            logger.info("Repository updated from remote");
        } else {
            git = Git.cloneRepository()
                    .setURI(repoUrl)
                    .setDirectory(repoDir)
                    .setBranch(branch)
                    .call();
            logger.info("Repository cloned successfully");
        }
    }

    /**
     * Get recent commits with caching
     */
    public List<CommitInfo> getRecentCommits(int limit) throws GitAPIException {
        // Try to get from cache first
        List<VectorStoreService.CommitMetadata> cached = vectorStore.getCachedCommits(limit);
        
        if (!cached.isEmpty() && cached.size() >= limit) {
            logger.info("Returning {} commits from cache", cached.size());
            return cached.stream()
                .map(c -> new CommitInfo(c.hash, c.message, c.author, c.timestamp))
                .toList();
        }

        // Fetch from git
        List<CommitInfo> commits = new ArrayList<>();
        Iterable<RevCommit> logs = git.log().setMaxCount(limit).call();
        
        for (RevCommit commit : logs) {
            CommitInfo info = new CommitInfo(
                commit.getName(),
                commit.getFullMessage(),
                commit.getAuthorIdent().getName(),
                commit.getCommitTime()
            );
            commits.add(info);
            
            // Cache commit metadata
            vectorStore.cacheCommit(
                commit.getName(),
                commit.getFullMessage(),
                commit.getAuthorIdent().getName(),
                commit.getCommitTime(),
                null // diff will be cached on first access
            );
        }
        
        logger.info("Fetched and cached {} commits from git", commits.size());
        return commits;
    }

    /**
     * Get commit diff with caching
     */
    public String getCommitDiff(String commitId) throws IOException {
        // Check cache first
        String cachedDiff = vectorStore.getCachedCommitDiff(commitId);
        if (cachedDiff != null && !cachedDiff.isEmpty()) {
            logger.debug("Returning cached diff for commit: {}", commitId);
            return cachedDiff;
        }

        if (git == null) {
            throw new IllegalStateException("Local repository not initialized");
        }

        Repository repo = git.getRepository();
        ObjectId commitObject = repo.resolve(commitId);
        if (commitObject == null) {
            throw new IllegalArgumentException("Commit not found: " + commitId);
        }

        String diff = generateDiff(repo, commitObject);
        
        // Cache the diff
        vectorStore.cacheCommit(commitId, null, null, 0, diff);
        
        return diff;
    }

    /**
     * Process commits and generate embeddings
     */
    public CompletableFuture<Void> processCommitsAsync(List<String> commitIds) {
        return CompletableFuture.runAsync(() -> {
            for (String commitId : commitIds) {
                try {
                    processCommit(commitId);
                } catch (Exception e) {
                    logger.error("Error processing commit {}: {}", commitId, e.getMessage(), e);
                }
            }
        }, executorService);
    }

    /**
     * Process a single commit
     */
    private void processCommit(String commitId) throws IOException {
        if (vectorStore.isCommitProcessed(commitId)) {
            logger.debug("Commit {} already processed, skipping", commitId);
            return;
        }

        logger.info("Processing commit: {}", commitId);
        
        String diff = getCommitDiff(commitId);
        if (diff == null || diff.isEmpty() || diff.equals("(No changes detected)")) {
            vectorStore.markCommitProcessed(commitId);
            return;
        }

        // Split diff into chunks for embedding
        List<String> chunks = chunkText(diff, 1000); // 1000 chars per chunk
        
        for (int i = 0; i < chunks.size(); i++) {
            String chunk = chunks.get(i);
            
            // Generate embedding
            float[] embedding = embeddingService.generateEmbedding(chunk);
            
            // Store in vector database
            String embeddingId = commitId + "_chunk_" + i;
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("chunk_count", chunks.size());
            metadata.put("chunk_size", chunk.length());
            
            vectorStore.storeEmbedding(
                embeddingId,
                commitId,
                null, // file path not available from diff
                i,
                chunk,
                embedding,
                metadata
            );
        }
        
        vectorStore.markCommitProcessed(commitId);
        logger.info("Processed commit {} with {} chunks", commitId, chunks.size());
    }

    /**
     * Chunk text into smaller pieces
     */
    private List<String> chunkText(String text, int chunkSize) {
        List<String> chunks = new ArrayList<>();
        
        if (text.length() <= chunkSize) {
            chunks.add(text);
            return chunks;
        }

        // Split by lines first to maintain context
        String[] lines = text.split("\n");
        StringBuilder currentChunk = new StringBuilder();
        
        for (String line : lines) {
            if (currentChunk.length() + line.length() + 1 > chunkSize) {
                if (currentChunk.length() > 0) {
                    chunks.add(currentChunk.toString());
                    currentChunk = new StringBuilder();
                }
                
                // If single line is too long, split it
                if (line.length() > chunkSize) {
                    for (int i = 0; i < line.length(); i += chunkSize) {
                        chunks.add(line.substring(i, Math.min(i + chunkSize, line.length())));
                    }
                } else {
                    currentChunk.append(line).append("\n");
                }
            } else {
                currentChunk.append(line).append("\n");
            }
        }
        
        if (currentChunk.length() > 0) {
            chunks.add(currentChunk.toString());
        }
        
        return chunks;
    }

    /**
     * Generate diff from commit
     */
    private String generateDiff(Repository repo, ObjectId commitObject) throws IOException {
        try (RevWalk revWalk = new RevWalk(repo)) {
            RevCommit commit = revWalk.parseCommit(commitObject);
            RevCommit parent = commit.getParentCount() > 0 ? 
                revWalk.parseCommit(commit.getParent(0)) : null;

            try (ObjectReader reader = repo.newObjectReader();
                 ByteArrayOutputStream out = new ByteArrayOutputStream();
                 DiffFormatter formatter = new DiffFormatter(out)) {

                CanonicalTreeParser oldTreeIter = new CanonicalTreeParser();
                if (parent != null) {
                    oldTreeIter.reset(reader, parent.getTree());
                }

                CanonicalTreeParser newTreeIter = new CanonicalTreeParser();
                newTreeIter.reset(reader, commit.getTree());

                formatter.setRepository(repo);
                List<DiffEntry> diffs = formatter.scan(oldTreeIter, newTreeIter);
                
                for (DiffEntry diff : diffs) {
                    formatter.format(diff);
                }

                String diffText = out.toString().trim();
                return diffText.isEmpty() ? "(No changes detected)" : diffText;
            }
        }
    }

    // Commit info class
    public static class CommitInfo {
        public String hash;
        public String message;
        public String author;
        public long timestamp;

        public CommitInfo(String hash, String message, String author, long timestamp) {
            this.hash = hash;
            this.message = message;
            this.author = author;
            this.timestamp = timestamp;
        }
    }
}
