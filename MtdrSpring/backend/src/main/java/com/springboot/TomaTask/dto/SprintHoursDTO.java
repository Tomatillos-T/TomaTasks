package com.springboot.TomaTask.dto;

/**
 * DTO for total hours worked per sprint
 * Used in "Horas Totales trabajadas por Sprint" chart
 */
public class SprintHoursDTO {
    private String sprintId;
    private String sprintName;
    private Double totalHours;

    public SprintHoursDTO() {
    }

    public SprintHoursDTO(String sprintId, String sprintName, Double totalHours) {
        this.sprintId = sprintId;
        this.sprintName = sprintName;
        this.totalHours = totalHours;
    }

    // Getters and Setters
    public String getSprintId() {
        return sprintId;
    }

    public void setSprintId(String sprintId) {
        this.sprintId = sprintId;
    }

    public String getSprintName() {
        return sprintName;
    }

    public void setSprintName(String sprintName) {
        this.sprintName = sprintName;
    }

    public Double getTotalHours() {
        return totalHours;
    }

    public void setTotalHours(Double totalHours) {
        this.totalHours = totalHours;
    }
}
