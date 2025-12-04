package com.springboot.TomaTask.dto;

/**
 * DTO for index branch request
 * Contains information needed to clone and index a specific branch from GitHub
 */
public class IndexBranchRequestDTO {
    private String owner;
    private String repo;
    private String branch;

    // Default constructor
    public IndexBranchRequestDTO() {
    }

    // Constructor with all fields
    public IndexBranchRequestDTO(String owner, String repo, String branch) {
        this.owner = owner;
        this.repo = repo;
        this.branch = branch;
    }

    // Getters and Setters
    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getRepo() {
        return repo;
    }

    public void setRepo(String repo) {
        this.repo = repo;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }
}
