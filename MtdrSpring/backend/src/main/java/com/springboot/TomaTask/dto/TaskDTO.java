package com.springboot.TomaTask.dto;

import java.time.LocalDate;
import com.springboot.TomaTask.model.Task.Status;

public class TaskDTO {
    private String id;
    private String name;
    private String description;
    private Integer timeEstimate;
    private Status status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate deliveryDate;

    private UserDTO user;
    private SprintDTO sprint;
    private UserStoryDTO userStory;

    public TaskDTO() {}

    public TaskDTO(String id, String name, String description, Integer timeEstimate, Status status,
                   LocalDate startDate, LocalDate endDate, LocalDate deliveryDate,
                   UserDTO user, SprintDTO sprint, UserStoryDTO userStory) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.timeEstimate = timeEstimate;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.deliveryDate = deliveryDate;
        this.user = user;
        this.sprint = sprint;
        this.userStory = userStory;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getTimeEstimate() { return timeEstimate; }
    public void setTimeEstimate(Integer timeEstimate) { this.timeEstimate = timeEstimate; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }

    public SprintDTO getSprint() { return sprint; }
    public void setSprint(SprintDTO sprint) { this.sprint = sprint; }

    public UserStoryDTO getUserStory() { return userStory; }
    public void setUserStory(UserStoryDTO userStory) { this.userStory = userStory; }
}
