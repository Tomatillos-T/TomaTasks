package com.springboot.TomaTask.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

/**
 * DTO for GitHub repository information
 * Used to transfer repository data from GitHub API to frontend
 */
public class GitHubRepoDTO {
    private String name;

    @JsonProperty("full_name")
    private String fullName;

    private String owner;

    @JsonProperty("private")
    private boolean isPrivate;

    @JsonProperty("default_branch")
    private String defaultBranch;

    @JsonProperty("html_url")
    private String htmlUrl;

    private String description;
    private String language;

    @JsonProperty("stargazers_count")
    private int stargazersCount;

    // Default constructor
    public GitHubRepoDTO() {
    }

    /**
     * Jackson deserializer method to extract owner login from GitHub's owner object
     * GitHub API returns owner as: {"login": "username", "id": 123, "type": "User", ...}
     */
    @JsonProperty("owner")
    private void unpackOwner(Map<String, Object> ownerObject) {
        if (ownerObject != null && ownerObject.containsKey("login")) {
            this.owner = (String) ownerObject.get("login");
        }
    }

    // Constructor with essential fields
    public GitHubRepoDTO(String name, String fullName, String owner, boolean isPrivate, String defaultBranch, String htmlUrl) {
        this.name = name;
        this.fullName = fullName;
        this.owner = owner;
        this.isPrivate = isPrivate;
        this.defaultBranch = defaultBranch;
        this.htmlUrl = htmlUrl;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public void setPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public String getDefaultBranch() {
        return defaultBranch;
    }

    public void setDefaultBranch(String defaultBranch) {
        this.defaultBranch = defaultBranch;
    }

    public String getHtmlUrl() {
        return htmlUrl;
    }

    public void setHtmlUrl(String htmlUrl) {
        this.htmlUrl = htmlUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public int getStargazersCount() {
        return stargazersCount;
    }

    public void setStargazersCount(int stargazersCount) {
        this.stargazersCount = stargazersCount;
    }
}
