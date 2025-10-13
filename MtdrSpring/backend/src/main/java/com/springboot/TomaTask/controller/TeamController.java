package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.model.Team;
import com.springboot.TomaTask.model.Project;
import com.springboot.TomaTask.service.TeamService;
import com.springboot.TomaTask.service.ProjectService; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;
    private final ProjectService projectService;

    public TeamController(TeamService teamService, ProjectService projectService) {
        this.teamService = teamService;
        this.projectService = projectService;
    }

    @GetMapping
    public List<Team> getAllTeams() {

        return teamService.getAllTeams();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable String id) {
        Team team = teamService.getTeamById(id);
        return ResponseEntity.ok(team);
    }

    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody TeamRequest request) {
        Project project = projectService.getProjectById(request.getProjectId());

        Team team = new Team(
                request.getName(),
                request.getDescription(),
                request.getStatus(),
                project
        );

        Team createdTeam = teamService.createTeam(team);
        return ResponseEntity.ok(createdTeam);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable String id, @RequestBody TeamRequest request) {
        Team existingTeam = teamService.getTeamById(id);

        Project project = null;
        if (request.getProjectId() != null) {
            project = projectService.getProjectById(request.getProjectId());
        }

        Team teamDetails = new Team(
                request.getName(),
                request.getDescription(),
                request.getStatus(),
                project
        );

        Team updatedTeam = teamService.updateTeam(id, teamDetails);
        return ResponseEntity.ok(updatedTeam);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable String id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<Team> getTeamByProject(@PathVariable String projectId) {
        Project project = projectService.getProjectById(projectId);
        Team team = teamService.getTeamByProject(project);
        return ResponseEntity.ok(team);
    }


    // Clase interna para recibir solicitudes de creación/actualización
    public static class TeamRequest {
        private String name;
        private String description;
        private String status;
        private String projectId;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getProjectId() { return projectId; }
        public void setProjectId(String projectId) { this.projectId = projectId; }
    }
}
