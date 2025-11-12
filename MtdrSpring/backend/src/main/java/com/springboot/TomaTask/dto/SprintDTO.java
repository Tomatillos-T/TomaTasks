package com.springboot.TomaTask.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

public class SprintDTO {
    private String id;
    private String description;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate deliveryDate;
    private String projectId;
    private Set<TaskDTO> tasks;
    private Set<UserStoryDTO> userStories;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public SprintDTO() {}

    public SprintDTO(String id, String description) {
        this.id = id;
        this.description = description;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }

    public Set<TaskDTO> getTasks() { return tasks; }
    public void setTasks(Set<TaskDTO> tasks) { this.tasks = tasks; }

    public Set<UserStoryDTO> getUserStories() { return userStories; }
    public void setUserStories(Set<UserStoryDTO> userStories) { this.userStories = userStories; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
