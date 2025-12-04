package com.springboot.TomaTask.dto;

public class DashboardResponseDTO {
    private KpiDTO kpis;
    private String scope; // "user" or "manager"
    private String userId;
    private String sprintId;
    private String sprintName;
    private KpiDTO previousSprintKpis;

    public DashboardResponseDTO() {
    }

    public DashboardResponseDTO(KpiDTO kpis, String scope, String userId, String sprintId, String sprintName) {
        this.kpis = kpis;
        this.scope = scope;
        this.userId = userId;
        this.sprintId = sprintId;
        this.sprintName = sprintName;
    }

    public DashboardResponseDTO(KpiDTO kpis, String scope, String userId, String sprintId, String sprintName, KpiDTO previousSprintKpis) {
        this.kpis = kpis;
        this.scope = scope;
        this.userId = userId;
        this.sprintId = sprintId;
        this.sprintName = sprintName;
        this.previousSprintKpis = previousSprintKpis;
    }

    // Getters and Setters
    public KpiDTO getKpis() {
        return kpis;
    }

    public void setKpis(KpiDTO kpis) {
        this.kpis = kpis;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

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

    public KpiDTO getPreviousSprintKpis() {
        return previousSprintKpis;
    }

    public void setPreviousSprintKpis(KpiDTO previousSprintKpis) {
        this.previousSprintKpis = previousSprintKpis;
    }
}
