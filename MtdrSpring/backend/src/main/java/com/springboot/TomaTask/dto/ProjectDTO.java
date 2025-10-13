package com.springboot.TomaTask.dto;

public class ProjectDTO {
    private String id;
    private String name;
    private String description;
    private String status;
    private LocalDate startDate;
    private LocalDate deliveryDate;
    private LocalDate endDate;
    private String teamId;
    private Set<SprintDTO> sprints;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors, Getters, Setters...
}