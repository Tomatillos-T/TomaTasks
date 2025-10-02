package com.springboot.TomaTask.model;

import javax.persistence.*;
import java.time.LocalDateTime;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "acceptance_criteria")
public class AcceptanceCriteria {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "id", updatable = false, nullable = false, unique = true)
    private String id;

    @Column(length = 1000, nullable = false)
    private String description;

    @Column(nullable = false)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_story_id", nullable = false)
    private UserStory userStory;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ===== Constructores =====
    public AcceptanceCriteria() {}

    public AcceptanceCriteria(String description, String status, UserStory userStory) {
        this.description = description;
        this.status = status;
        this.userStory = userStory;
    }

    // ===== Getters y Setters =====
    public String getId() { return id; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public UserStory getUserStory() { return userStory; }
    public void setUserStory(UserStory userStory) { this.userStory = userStory; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
