package com.springboot.TomaTask.dto;

import java.util.Map;

public class KpiDTO {
    private Double onTimeCompletionRate;
    private Long incompleteTasks;
    private Long lateDeliveries;
    private Map<String, Double> avgHoursByEstimation;
    private Double completionRate;
    private Long totalTasks;
    private Long completedTasks;
    private Long onTimeTasks;
    private Double totalInvestedHours;
    private Double totalExpectedHours;
    private Map<String, Double> avgExpectedHoursByEstimation;

    public KpiDTO() {
    }

    public KpiDTO(Double onTimeCompletionRate, Long incompleteTasks, Long lateDeliveries,
            Map<String, Double> avgHoursByEstimation, Double completionRate,
            Long totalTasks, Long completedTasks, Long onTimeTasks) {
        this.onTimeCompletionRate = onTimeCompletionRate;
        this.incompleteTasks = incompleteTasks;
        this.lateDeliveries = lateDeliveries;
        this.avgHoursByEstimation = avgHoursByEstimation;
        this.completionRate = completionRate;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.onTimeTasks = onTimeTasks;
    }

    // Getters and Setters
    public Double getOnTimeCompletionRate() {
        return onTimeCompletionRate;
    }

    public void setOnTimeCompletionRate(Double onTimeCompletionRate) {
        this.onTimeCompletionRate = onTimeCompletionRate;
    }

    public Long getIncompleteTasks() {
        return incompleteTasks;
    }

    public void setIncompleteTasks(Long incompleteTasks) {
        this.incompleteTasks = incompleteTasks;
    }

    public Long getLateDeliveries() {
        return lateDeliveries;
    }

    public void setLateDeliveries(Long lateDeliveries) {
        this.lateDeliveries = lateDeliveries;
    }

    public Map<String, Double> getAvgHoursByEstimation() {
        return avgHoursByEstimation;
    }

    public void setAvgHoursByEstimation(Map<String, Double> avgHoursByEstimation) {
        this.avgHoursByEstimation = avgHoursByEstimation;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    public Long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(Long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public Long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(Long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public Long getOnTimeTasks() {
        return onTimeTasks;
    }

    public void setOnTimeTasks(Long onTimeTasks) {
        this.onTimeTasks = onTimeTasks;
    }

    public Double getTotalInvestedHours() {
        return totalInvestedHours;
    }

    public void setTotalInvestedHours(Double totalInvestedHours) {
        this.totalInvestedHours = totalInvestedHours;
    }

    public Double getTotalExpectedHours() {
        return totalExpectedHours;
    }

    public void setTotalExpectedHours(Double totalExpectedHours) {
        this.totalExpectedHours = totalExpectedHours;
    }

    public Map<String, Double> getAvgExpectedHoursByEstimation() {
        return avgExpectedHoursByEstimation;
    }

    public void setAvgExpectedHoursByEstimation(Map<String, Double> avgExpectedHoursByEstimation) {
        this.avgExpectedHoursByEstimation = avgExpectedHoursByEstimation;
    }
}
