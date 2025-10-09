package com.springboot.TomaTask.dto;

public class SprintDTO {
    private String id;
    private String description;

    public SprintDTO() {}
    public SprintDTO(String id, String description) {
        this.id = id;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
