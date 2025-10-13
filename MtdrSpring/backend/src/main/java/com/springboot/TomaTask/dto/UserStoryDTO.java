package com.springboot.TomaTask.dto;

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

    // Constructors, Getters, Setters...

    public UserStoryDTO() {}
    public UserStoryDTO(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
