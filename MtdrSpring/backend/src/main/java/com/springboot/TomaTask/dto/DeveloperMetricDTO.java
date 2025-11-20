package com.springboot.TomaTask.dto;

import java.util.Map;

/**
 * DTO for developer metrics by sprint
 * Used in grouped bar charts for hours and tasks per developer per sprint
 */
public class DeveloperMetricDTO {
    private String developerId;
    private String developerName;
    private Map<String, Double> metricsBySprint; // Key: sprintName, Value: hours or tasks

    public DeveloperMetricDTO() {
    }

    public DeveloperMetricDTO(String developerId, String developerName, Map<String, Double> metricsBySprint) {
        this.developerId = developerId;
        this.developerName = developerName;
        this.metricsBySprint = metricsBySprint;
    }

    // Getters and Setters
    public String getDeveloperId() {
        return developerId;
    }

    public void setDeveloperId(String developerId) {
        this.developerId = developerId;
    }

    public String getDeveloperName() {
        return developerName;
    }

    public void setDeveloperName(String developerName) {
        this.developerName = developerName;
    }

    public Map<String, Double> getMetricsBySprint() {
        return metricsBySprint;
    }

    public void setMetricsBySprint(Map<String, Double> metricsBySprint) {
        this.metricsBySprint = metricsBySprint;
    }
}
