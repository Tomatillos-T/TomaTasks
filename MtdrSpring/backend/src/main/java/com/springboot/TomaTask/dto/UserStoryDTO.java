package com.springboot.TomaTask.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class UserStoryDTO {
    private String id;
    private String name;
    private Integer weight;
    private String description;
    private String status;
    private String sprintId;
    private Set<TaskDTO> tasks;
    private Set<AcceptanceCriteriaDTO> acceptanceCriteria;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UserStoryDTO() {
    }

    public UserStoryDTO(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public UserStoryDTO(String id, String name, Integer weight, String description,
                        String status, String sprintId, Set<TaskDTO> tasks,
                        Set<AcceptanceCriteriaDTO> acceptanceCriteria,
                        LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.description = description;
        this.status = status;
        this.sprintId = sprintId;
        this.tasks = tasks;
        this.acceptanceCriteria = acceptanceCriteria;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getWeight() { return weight; }
    public void setWeight(Integer weight) { this.weight = weight; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSprintId() { return sprintId; }
    public void setSprintId(String sprintId) { this.sprintId = sprintId; }

    public Set<TaskDTO> getTasks() { return tasks; }
    public void setTasks(Set<TaskDTO> tasks) { this.tasks = tasks; }

    public Set<AcceptanceCriteriaDTO> getAcceptanceCriteria() { return acceptanceCriteria; }
    public void setAcceptanceCriteria(Set<AcceptanceCriteriaDTO> acceptanceCriteria) { this.acceptanceCriteria = acceptanceCriteria; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
