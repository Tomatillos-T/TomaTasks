package com.springboot.TomaTask.dto;

import com.springboot.TomaTask.model.Task.Status;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskDTO {
    private String id;
    private String name;
    private String description;
    private Integer timeEstimate;
    private Status status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate deliveryDate;

    private String userStoryId;
    private String sprintId;
    private String assigneeId;

    private UserDTO assignee;
    private SprintDTO sprint;
    private UserStoryDTO userStory;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public TaskDTO() {}

    public TaskDTO(String id, String name, String description, Integer timeEstimate, Status status,
                   LocalDate startDate, LocalDate endDate, LocalDate deliveryDate) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.timeEstimate = timeEstimate;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.deliveryDate = deliveryDate;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getTimeEstimate() { return timeEstimate; }
    public void setTimeEstimate(Integer timeEstimate) { this.timeEstimate = timeEstimate; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }

    public String getUserStoryId() { return userStoryId; }
    public void setUserStoryId(String userStoryId) { this.userStoryId = userStoryId; }

    public String getSprintId() { return sprintId; }
    public void setSprintId(String sprintId) { this.sprintId = sprintId; }

    public String getAssigneeId() { return assigneeId; }
    public void setAssigneeId(String assigneeId) { this.assigneeId = assigneeId; }

    public UserDTO getAssignee() { return assignee; }
    public void setAssignee(UserDTO assignee) { this.assignee = assignee; }

    public SprintDTO getSprint() { return sprint; }
    public void setSprint(SprintDTO sprint) { this.sprint = sprint; }

    public UserStoryDTO getUserStory() { return userStory; }
    public void setUserStory(UserStoryDTO userStory) { this.userStory = userStory; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
