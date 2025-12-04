package com.springboot.TomaTask.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO for GitHub branch information
 * Used to transfer branch data from GitHub API to frontend
 */
public class GitHubBranchDTO {
    private String name;
    private String sha;

    @JsonProperty("protected")
    private boolean isProtected;

    // Nested class for commit information
    public static class CommitInfo {
        private String sha;
        private String url;

        public CommitInfo() {
        }

        public CommitInfo(String sha, String url) {
            this.sha = sha;
            this.url = url;
        }

        public String getSha() {
            return sha;
        }

        public void setSha(String sha) {
            this.sha = sha;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }

    private CommitInfo commit;

    // Default constructor
    public GitHubBranchDTO() {
    }

    // Constructor with essential fields
    public GitHubBranchDTO(String name, String sha) {
        this.name = name;
        this.sha = sha;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSha() {
        return sha;
    }

    public void setSha(String sha) {
        this.sha = sha;
    }

    public boolean isProtected() {
        return isProtected;
    }

    public void setProtected(boolean isProtected) {
        this.isProtected = isProtected;
    }

    public CommitInfo getCommit() {
        return commit;
    }

    public void setCommit(CommitInfo commit) {
        this.commit = commit;
    }
}
