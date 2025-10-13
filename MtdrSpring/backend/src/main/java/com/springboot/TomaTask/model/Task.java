package com.springboot.TomaTask.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false, unique = true)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(name = "time_estimate")
    private Integer timeEstimate;

    public enum Status {
        TODO, IN_PROGRESS, DONE, PENDING, TESTING
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_story_id", nullable = false)
    private UserStory userStory;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id", nullable = false)
    private Sprint sprint;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User user;

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

    // Constructors
    public Task() {}

    public Task(String name, Integer timeEstimate, Status status, UserStory userStory, Sprint sprint) {
        this.name = name;
        this.timeEstimate = timeEstimate;
        this.status = status;
        this.userStory = userStory;
        this.sprint = sprint;
    }

    public Task(String name, Integer timeEstimate, String description, Status status, UserStory userStory,
                Sprint sprint, User user) {
        this.name = name;
        this.timeEstimate = timeEstimate;
        this.description = description;
        this.status = status;
        this.userStory = userStory;
        this.sprint = sprint;
        this.user = user;
    }

    public Task(String name, Integer timeEstimate, String description, Status status, UserStory userStory,
                Sprint sprint, User user, LocalDate startDate, LocalDate endDate, LocalDate deliveryDate) {
        this.name = name;
        this.timeEstimate = timeEstimate;
        this.description = description;
        this.status = status;
        this.userStory = userStory;
        this.sprint = sprint;
        this.user = user;
        this.startDate = startDate;
        this.endDate = endDate;
        this.deliveryDate = deliveryDate;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getTimeEstimate() { return timeEstimate; }
    public void setTimeEstimate(Integer timeEstimate) { this.timeEstimate = timeEstimate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public UserStory getUserStory() { return userStory; }
    public void setUserStory(UserStory userStory) { this.userStory = userStory; }

    public Sprint getSprint() { return sprint; }
    public void setSprint(Sprint sprint) { this.sprint = sprint; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
