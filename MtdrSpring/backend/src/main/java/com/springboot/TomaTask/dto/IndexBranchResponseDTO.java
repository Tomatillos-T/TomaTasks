package com.springboot.TomaTask.dto;

/**
 * DTO for index branch response
 * Returns the status and details of the branch indexing operation
 */
public class IndexBranchResponseDTO {
    private String status;
    private int totalCommits;
    private String message;
    private String repositoryUrl;
    private String branch;

    // Default constructor
    public IndexBranchResponseDTO() {
    }

    // Constructor with essential fields
    public IndexBranchResponseDTO(String status, int totalCommits, String message) {
        this.status = status;
        this.totalCommits = totalCommits;
        this.message = message;
    }

    // Getters and Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getTotalCommits() {
        return totalCommits;
    }

    public void setTotalCommits(int totalCommits) {
        this.totalCommits = totalCommits;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRepositoryUrl() {
        return repositoryUrl;
    }

    public void setRepositoryUrl(String repositoryUrl) {
        this.repositoryUrl = repositoryUrl;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }
}
