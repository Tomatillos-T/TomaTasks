package com.springboot.TomaTask.dto;

/**
 * DTO for task report in the last sprint
 * Used in "Reporte de Tareas terminadas (último Sprint)" table
 */
public class TaskReportDTO {
    private String taskId;
    private String taskName;
    private String developerName;
    private Integer estimatedHours;
    private Integer actualHours;
    private String status;

    public TaskReportDTO() {
    }

    public TaskReportDTO(String taskId, String taskName, String developerName,
                         Integer estimatedHours, Integer actualHours, String status) {
        this.taskId = taskId;
        this.taskName = taskName;
        this.developerName = developerName;
        this.estimatedHours = estimatedHours;
        this.actualHours = actualHours;
        this.status = status;
    }

    // Getters and Setters
    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getDeveloperName() {
        return developerName;
    }

    public void setDeveloperName(String developerName) {
        this.developerName = developerName;
    }

    public Integer getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(Integer estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    public Integer getActualHours() {
        return actualHours;
    }

    public void setActualHours(Integer actualHours) {
        this.actualHours = actualHours;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
