package com.springboot.TomaTask.service;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.diff.DiffEntry;
import org.eclipse.jgit.diff.DiffFormatter;
import org.eclipse.jgit.lib.ObjectReader;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.treewalk.CanonicalTreeParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class RepositoryService {

    @Value("${repo.url}")
    private String repoUrl;

    @Value("${repo.branch:main}")
    private String branch;

    @Value("${repo.path:/tmp/repo}")
    private String repoPath;

    private Git git;

    public void cloneOrUpdateRepo() throws GitAPIException, IOException {
        File repoDir = new File(repoPath);
        
        if (repoDir.exists()) {
            git = Git.open(repoDir);
            git.pull().setRemoteBranchName(branch).call();
        } else {
            git = Git.cloneRepository()
                    .setURI(repoUrl)
                    .setDirectory(repoDir)
                    .setBranch(branch)
                    .call();
        }
    }

    public List<CommitInfo> getRecentCommits(int limit) throws GitAPIException {
        List<CommitInfo> commits = new ArrayList<>();
        Iterable<RevCommit> logs = git.log().setMaxCount(limit).call();
        
        for (RevCommit commit : logs) {
            commits.add(new CommitInfo(
                commit.getName(),
                commit.getFullMessage(),
                commit.getAuthorIdent().getName(),
                commit.getCommitTime()
            ));
        }
        
        return commits;
    }

    public String getCommitDiff(String commitId) throws IOException, GitAPIException {
        Repository repo = git.getRepository();
        RevCommit commit = git.getRepository().parseCommit(repo.resolve(commitId));
        RevCommit parent = commit.getParent(0);
        
        try (ObjectReader reader = repo.newObjectReader();
             ByteArrayOutputStream out = new ByteArrayOutputStream();
             DiffFormatter formatter = new DiffFormatter(out)) {
            
            CanonicalTreeParser oldTreeIter = new CanonicalTreeParser();
            oldTreeIter.reset(reader, parent.getTree());
            
            CanonicalTreeParser newTreeIter = new CanonicalTreeParser();
            newTreeIter.reset(reader, commit.getTree());
            
            formatter.setRepository(repo);
            List<DiffEntry> diffs = formatter.scan(oldTreeIter, newTreeIter);
            
            for (DiffEntry diff : diffs) {
                formatter.format(diff);
            }
            
            return out.toString();
        }
    }

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
