package com.springboot.TomaTask.dto;


public class TeamDTO {
    private String id;
    private String name;
    private String description;
    private String status;
    private String projectId;
    private Set<UserDTO> members;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

     // Constructors, Getters, Setters...

}