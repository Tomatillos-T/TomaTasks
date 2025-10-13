package com.springboot.TomaTask.dto;

import java.time.LocalDateTime;

public class AcceptanceCriteriaDTO {
    private String id;
    private String description;
    private String status;
    private String userStoryId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AcceptanceCriteriaDTO() {
    }

    public AcceptanceCriteriaDTO(String id, String description, String status, String userStoryId,
                                 LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.description = description;
        this.status = status;
        this.userStoryId = userStoryId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getUserStoryId() { return userStoryId; }
    public void setUserStoryId(String userStoryId) { this.userStoryId = userStoryId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
