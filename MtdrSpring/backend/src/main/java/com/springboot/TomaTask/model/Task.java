package com.springboot.TomaTask.model;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_story_id", nullable = false)
    private UserStory userStory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id", nullable = false)
    private Sprint sprint;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ===== Constructores =====
    public Task() {}

    public Task(String name, String status, UserStory userStory, Sprint sprint) {
        this.name = name;
        this.status = status;
        this.userStory = userStory;
        this.sprint = sprint;
    }

    public Task(String name, String description, String status, UserStory userStory, Sprint sprint) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.userStory = userStory;
        this.sprint = sprint;
    }

    public Task(String name, String description, String status, UserStory userStory,
                Sprint sprint, LocalDate startDate, LocalDate endDate, LocalDate deliveryDate) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.userStory = userStory;
        this.sprint = sprint;
        this.startDate = startDate;
        this.endDate = endDate;
        this.deliveryDate = deliveryDate;
    }

    // ===== Getters y Setters =====
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public UserStory getUserStory() { return userStory; }
    public void setUserStory(UserStory userStory) { this.userStory = userStory; }
    public Sprint getSprint() { return sprint; }
    public void setSprint(Sprint sprint) { this.sprint = sprint; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
