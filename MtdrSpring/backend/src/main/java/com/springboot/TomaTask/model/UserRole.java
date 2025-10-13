package com.springboot.TomaTask.model;

import jakarta.persistence.*;
import java.util.Set;

import org.hibernate.annotations.GenericGenerator;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "user_role")
public class UserRole {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "id")
    private String id;

    @Column(nullable = false, unique = true)
    private String role;

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<User> users = new HashSet<>();

    public UserRole() {}

    public UserRole(String role) {
        this.role = role;
    }

    public String getId() { return id; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
