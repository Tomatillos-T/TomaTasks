package com.springboot.TomaTask.dto;

public class UserRoleDTO {
    private String id;
    private String role;

    public UserRoleDTO() {
    }

    public UserRoleDTO(String id, String role) {
        this.id = id;
        this.role = role;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
