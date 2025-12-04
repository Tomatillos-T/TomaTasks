package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.IndexBranchResponseDTO;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.diff.DiffEntry;
import org.eclipse.jgit.diff.DiffFormatter;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.ObjectReader;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.revwalk.RevWalk;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
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
     * Get recent commits with caching and pagination
     * PHASE 2 FIX (Problem A): Added repo and branch parameters for filtering
     */
    public List<CommitInfo> getRecentCommits(int limit, int offset, String repositoryUrl, String branchName)
            throws GitAPIException, IOException {

        // CRITICAL FIX: Check if specific repo requested but not indexed yet
        if (repositoryUrl != null && !repositoryUrl.isEmpty()) {
            // User is requesting a specific GitHub repository
            // Check if we have a Git instance and if it matches the requested repo
            if (this.git == null) {
                logger.warn("No repository indexed yet. User requested: {}", repositoryUrl);
                logger.info("Please index the repository first using 'Index Selected Branch' button");
                return new ArrayList<>(); // Return empty - repository not indexed
            }

            // Check if the current git instance matches the requested repository
            // The user passes "owner/repo" but we need to check if it matches our current git instance
            String currentRepoUrl = git.getRepository().getConfig().getString("remote", "origin", "url");
            if (currentRepoUrl != null) {
                // Extract owner/repo from current URL (e.g., "https://github.com/owner/repo.git" -> "owner/repo")
                String currentRepoName = extractRepoName(currentRepoUrl);
                if (!repositoryUrl.equalsIgnoreCase(currentRepoName)) {
                    logger.warn("Requested repository '{}' doesn't match currently indexed repository '{}'",
                               repositoryUrl, currentRepoName);
                    logger.info("Please index the repository '{}' first using 'Index Selected Branch' button", repositoryUrl);
                    return new ArrayList<>(); // Return empty - wrong repository
                }
            }
        }

        // Get or initialize the appropriate Git instance for the repo/branch
        Git repoGit = getGitInstance(repositoryUrl, branchName);

        long cachedCommitCount = vectorStore.getCachedCommitCount();

        // If this is the first request (offset=0) and git is initialized
        if (offset == 0 && repoGit != null) {
            // PHASE 2 FIX: Filter commits by specific branch if provided
            Iterable<RevCommit> logs;
            if (branchName != null && !branchName.isEmpty()) {
                // Get commits from specific branch only
                ObjectId branchId = repoGit.getRepository().resolve(branchName);
                if (branchId != null) {
                    logs = repoGit.log().add(branchId).call();
                    logger.info("Fetching commits from branch: {}", branchName);
                } else {
                    logger.warn("Branch {} not found, falling back to all branches", branchName);
                    logs = repoGit.log().all().call();
                }
            } else {
                // Original behavior: get all branches
                logs = repoGit.log().all().call();
            }

            // Count total commits in Git
            int totalGitCommits = 0;
            RevCommit firstCommit = null;
            for (RevCommit commit : logs) {
                if (firstCommit == null) {
                    firstCommit = commit;
                }
                totalGitCommits++;
            }

            // If cache is incomplete, fetch in batches
            if (cachedCommitCount < totalGitCommits) {
                logger.info("Cache has {} commits, Git has {}. Fetching incrementally...",
                    cachedCommitCount, totalGitCommits);

                // Fetch a larger initial batch (200 commits)
                int batchSize = 200;
                List<CommitInfo> commits = new ArrayList<>();

                // Re-create logs iterator with same filtering
                if (branchName != null && !branchName.isEmpty()) {
                    ObjectId branchId = repoGit.getRepository().resolve(branchName);
                    if (branchId != null) {
                        logs = repoGit.log().add(branchId).call();
                    } else {
                        logs = repoGit.log().all().call();
                    }
                } else {
                    logs = repoGit.log().all().call();
                }

                int count = 0;
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
                        null
                    );

                    count++;
                    // Stop after batch size for initial response
                    if (count >= batchSize) {
                        break;
                    }
                }

                logger.info("Fetched and cached {} commits (batch)", count);

                // Return first page immediately
                int endIndex = Math.min(limit, commits.size());
                return commits.subList(0, endIndex);
            }
        }

        // CRITICAL FIX: When branch is specified, ALWAYS fetch from Git, not cache
        // Cache doesn't have repo/branch columns, so it would return ALL commits mixed together
        if (branchName != null && !branchName.isEmpty() && repoGit != null) {
            logger.info("Branch-specific request ({}), fetching directly from Git (offset: {})", branchName, offset);

            // Fetch from Git with branch filtering
            Iterable<RevCommit> logs;
            ObjectId branchId = repoGit.getRepository().resolve(branchName);
            if (branchId != null) {
                logs = repoGit.log().add(branchId).call();
                logger.debug("Resolved branch {} to {}", branchName, branchId.getName());
            } else {
                logger.warn("Branch {} not found in repository, returning empty list", branchName);
                return new ArrayList<>(); // Return empty if branch doesn't exist
            }

            // Skip to offset and collect commits
            List<CommitInfo> commits = new ArrayList<>();
            int index = 0;
            int count = 0;
            for (RevCommit commit : logs) {
                if (index < offset) {
                    index++;
                    continue;
                }

                commits.add(new CommitInfo(
                    commit.getName(),
                    commit.getFullMessage(),
                    commit.getAuthorIdent().getName(),
                    commit.getCommitTime()
                ));

                count++;
                if (count >= limit) {
                    break;
                }
            }

            logger.info("Fetched {} commits from branch '{}' (offset: {})", commits.size(), branchName, offset);
            return commits;
        }

        // Get from cache ONLY when no branch specified (backward compatibility)
        List<VectorStoreService.CommitMetadata> cached = vectorStore.getCachedCommits(limit, offset);

        // If requesting beyond cache, fetch more from git
        if (cached.size() < limit && repoGit != null && offset > 0) {
            logger.info("Cache miss at offset {}. Fetching more commits...", offset);

            // Fetch the next batch
            int skip = (int) offset;
            List<CommitInfo> commits = new ArrayList<>();
            Iterable<RevCommit> logs = repoGit.log().all().call();

            int index = 0;
            int fetched = 0;
            for (RevCommit commit : logs) {
                if (index < skip) {
                    index++;
                    continue;
                }

                CommitInfo info = new CommitInfo(
                    commit.getName(),
                    commit.getFullMessage(),
                    commit.getAuthorIdent().getName(),
                    commit.getCommitTime()
                );
                commits.add(info);

                // Cache this commit
                vectorStore.cacheCommit(
                    commit.getName(),
                    commit.getFullMessage(),
                    commit.getAuthorIdent().getName(),
                    commit.getCommitTime(),
                    null
                );

                fetched++;
                if (fetched >= limit) {
                    break;
                }
            }

            logger.info("Fetched {} more commits from git at offset {}", fetched, offset);
            return commits;
        }

        logger.info("Returning {} commits from cache (offset: {})", cached.size(), offset);
        return cached.stream()
            .map(c -> new CommitInfo(c.hash, c.message, c.author, c.timestamp))
            .collect(java.util.stream.Collectors.toList());
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

    /**
     * Index a specific branch from a GitHub repository
     * Clones the repository using GitHub token, switches to branch, and indexes all commits
     *
     * @param githubToken GitHub personal access token for authentication
     * @param owner Repository owner (username or organization)
     * @param repo Repository name
     * @param branch Branch name to index
     * @return IndexBranchResponseDTO with status and statistics
     */
    public IndexBranchResponseDTO indexBranch(String githubToken, String owner, String repo, String branch) {
        try {
            // Construct GitHub repository URL
            String repoUrl = "https://github.com/" + owner + "/" + repo + ".git";

            // Create temporary directory for this repository
            String tempRepoPath = repoPath + "_" + owner + "_" + repo;
            File repoDir = new File(tempRepoPath);

            Git tempGit;

            // Clone or update repository with GitHub token authentication
            if (repoDir.exists()) {
                logger.info("Opening existing repository at: {}", tempRepoPath);
                tempGit = Git.open(repoDir);

                // Pull latest changes with authentication
                tempGit.pull()
                    .setRemoteBranchName(branch)
                    .setCredentialsProvider(new UsernamePasswordCredentialsProvider(githubToken, ""))
                    .call();

                logger.info("Repository updated from remote: {}", repoUrl);
            } else {
                logger.info("Cloning repository: {}", repoUrl);

                // Clone with authentication
                tempGit = Git.cloneRepository()
                    .setURI(repoUrl)
                    .setDirectory(repoDir)
                    .setBranch(branch)
                    .setCredentialsProvider(new UsernamePasswordCredentialsProvider(githubToken, ""))
                    .call();

                logger.info("Repository cloned successfully");
            }

            // Checkout the specified branch
            tempGit.checkout().setName(branch).call();
            logger.info("Switched to branch: {}", branch);

            // Get all commits from this branch
            Iterable<RevCommit> commits = tempGit.log().all().call();

            int totalCommits = 0;
            List<String> commitIds = new ArrayList<>();

            for (RevCommit commit : commits) {
                String commitId = commit.getName();
                commitIds.add(commitId);

                // Cache commit metadata
                vectorStore.cacheCommit(
                    commitId,
                    commit.getFullMessage(),
                    commit.getAuthorIdent().getName(),
                    commit.getCommitTime(),
                    null
                );

                totalCommits++;
            }

            logger.info("Indexed {} commits from branch '{}' of repository {}/{}",
                totalCommits, branch, owner, repo);

            // Start async processing of commits to generate embeddings
            processCommitsAsync(commitIds);

            // Set the current git instance to this repository for subsequent operations
            this.git = tempGit;

            // Create response
            IndexBranchResponseDTO response = new IndexBranchResponseDTO(
                "success",
                totalCommits,
                "Branch '" + branch + "' indexed successfully. Processing " + totalCommits + " commits in background."
            );
            response.setRepositoryUrl(repoUrl);
            response.setBranch(branch);

            return response;

        } catch (GitAPIException e) {
            logger.error("Git error while indexing branch: {}", e.getMessage(), e);
            return new IndexBranchResponseDTO(
                "error",
                0,
                "Git error: " + e.getMessage()
            );
        } catch (IOException e) {
            logger.error("IO error while indexing branch: {}", e.getMessage(), e);
            return new IndexBranchResponseDTO(
                "error",
                0,
                "IO error: " + e.getMessage()
            );
        }
    }

    /**
     * Helper method to extract owner/repo from full Git URL
     * Examples:
     *   "https://github.com/owner/repo.git" -> "owner/repo"
     *   "git@github.com:owner/repo.git" -> "owner/repo"
     *   "owner/repo" -> "owner/repo" (already in correct format)
     */
    private String extractRepoName(String gitUrl) {
        if (gitUrl == null || gitUrl.isEmpty()) {
            return "";
        }

        // Remove .git suffix if present
        String url = gitUrl.endsWith(".git") ? gitUrl.substring(0, gitUrl.length() - 4) : gitUrl;

        // Extract owner/repo from various URL formats
        if (url.contains("github.com/")) {
            // https://github.com/owner/repo or git@github.com:owner/repo
            int index = url.indexOf("github.com/");
            if (index != -1) {
                return url.substring(index + "github.com/".length());
            }
        } else if (url.contains("github.com:")) {
            // git@github.com:owner/repo
            int index = url.indexOf("github.com:");
            if (index != -1) {
                return url.substring(index + "github.com:".length());
            }
        }

        // Already in owner/repo format or unknown format
        return url;
    }

    /**
     * PHASE 2 FIX (Problem A): Get or initialize Git instance for specific repo/branch
     * This method returns the appropriate Git instance based on the provided parameters.
     * For backward compatibility, if no repo/branch is specified, it uses the default git instance.
     */
    private Git getGitInstance(String repositoryUrl, String branchName) throws IOException, GitAPIException {
        // If no specific repo/branch requested, use default git instance
        if ((repositoryUrl == null || repositoryUrl.isEmpty()) &&
            (branchName == null || branchName.isEmpty())) {
            if (this.git == null) {
                // Try to initialize default repository if not already done
                try {
                    cloneOrUpdateRepo();
                } catch (Exception e) {
                    logger.warn("Could not initialize default repository: {}", e.getMessage());
                }
            }
            return this.git;
        }

        // If repo/branch specified, check if current git instance matches
        // For now, we'll use the default git instance but check out the specific branch
        // In a full implementation, you would maintain a map of Git instances per repo
        if (this.git != null) {
            try {
                // Try to checkout the requested branch
                if (branchName != null && !branchName.isEmpty()) {
                    // Check if branch exists
                    ObjectId branchId = this.git.getRepository().resolve(branchName);
                    if (branchId != null) {
                        logger.debug("Using existing git instance for branch: {}", branchName);
                        return this.git;
                    }
                }
            } catch (Exception e) {
                logger.warn("Could not resolve branch {}: {}", branchName, e.getMessage());
            }
            return this.git;
        }

        // If git instance not initialized, try to initialize default
        try {
            cloneOrUpdateRepo();
            return this.git;
        } catch (Exception e) {
            logger.error("Could not initialize repository: {}", e.getMessage());
            return null;
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
