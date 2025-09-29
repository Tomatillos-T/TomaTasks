package com.springboot.TomaTask.model;

import javax.persistence.*;

@Entity
@Table(name = "user_role")
public class UserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String role;

    // ===== Constructores =====
    public UserRole() {}

    public UserRole(String role) {
        this.role = role;
    }

    // ===== Getters y Setters =====
    public Long getId() { return id; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
