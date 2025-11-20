package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.DashboardResponseDTO;
import com.springboot.TomaTask.dto.DeveloperMetricDTO;
import com.springboot.TomaTask.dto.SprintHoursDTO;
import com.springboot.TomaTask.dto.TaskReportDTO;
import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.service.DashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * GET /api/dashboard/user?sprintId={id}
     * Returns personal KPIs for the logged-in user
     * Access: ROLE_DEVELOPER, ROLE_ADMIN
     */
    @GetMapping("/user")
    @PreAuthorize("hasAnyRole('DEVELOPER', 'ADMIN')")
    public ResponseEntity<DashboardResponseDTO> getUserDashboard(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(required = false) String sprintId) {

        DashboardResponseDTO response = dashboardService.getUserKpis(currentUser.getId(), sprintId);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/dashboard/manager?sprintId={id}
     * Returns team-wide KPIs for all users
     * Access: ROLE_ADMIN only
     */
    @GetMapping("/manager")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardResponseDTO> getManagerDashboard(
            @RequestParam(required = false) String sprintId) {

        DashboardResponseDTO response = dashboardService.getManagerKpis(sprintId);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/dashboard/charts/total-hours-by-sprint
     * Gráfica 1: Total hours worked per sprint
     * Access: ROLE_ADMIN only
     */
    @GetMapping("/charts/total-hours-by-sprint")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SprintHoursDTO>> getTotalHoursBySprint() {
        List<SprintHoursDTO> data = dashboardService.getTotalHoursBySprint();
        return ResponseEntity.ok(data);
    }

    /**
     * GET /api/dashboard/charts/hours-by-developer-sprint
     * Gráfica 2: Hours worked by developer per sprint
     * Access: ROLE_ADMIN only
     */
    @GetMapping("/charts/hours-by-developer-sprint")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DeveloperMetricDTO>> getHoursByDeveloperSprint() {
        List<DeveloperMetricDTO> data = dashboardService.getHoursByDeveloperPerSprint();
        return ResponseEntity.ok(data);
    }

    /**
     * GET /api/dashboard/charts/tasks-by-developer-sprint
     * Gráfica 3: Tasks completed by developer per sprint
     * Access: ROLE_ADMIN only
     */
    @GetMapping("/charts/tasks-by-developer-sprint")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DeveloperMetricDTO>> getTasksByDeveloperSprint() {
        List<DeveloperMetricDTO> data = dashboardService.getTasksByDeveloperPerSprint();
        return ResponseEntity.ok(data);
    }

    /**
     * GET /api/dashboard/charts/last-sprint-tasks-report
     * Report: Tasks completed in the last sprint, sorted by developer
     * Access: ROLE_ADMIN only
     */
    @GetMapping("/charts/last-sprint-tasks-report")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TaskReportDTO>> getLastSprintTasksReport() {
        List<TaskReportDTO> data = dashboardService.getLastSprintTasksReport();
        return ResponseEntity.ok(data);
    }
}
