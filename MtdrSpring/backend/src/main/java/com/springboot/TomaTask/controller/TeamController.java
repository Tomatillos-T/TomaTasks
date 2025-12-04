package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.TeamDTO;
import com.springboot.TomaTask.dto.UserDTO;
import com.springboot.TomaTask.service.TeamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/without-project")
    public ResponseEntity<List<TeamDTO>> getTeamsWithoutProject() {
        return ResponseEntity.ok(teamService.getTeamsWithoutProject());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamDTO> getTeamById(@PathVariable String id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<Set<UserDTO>> getTeamMembers(@PathVariable String id) {
        return ResponseEntity.ok(teamService.getTeamMembers(id));
    }

    @PostMapping("/{teamId}/members/{userId}")
    public ResponseEntity<TeamDTO> addMemberToTeam(@PathVariable String teamId, @PathVariable String userId) {
        return ResponseEntity.ok(teamService.addMemberToTeam(teamId, userId));
    }

    @PostMapping("/{teamId}/members")
    public ResponseEntity<TeamDTO> addMembersToTeam(@PathVariable String teamId, @RequestBody Set<String> userIds) {
        return ResponseEntity.ok(teamService.addMembersToTeam(teamId, userIds));
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    public ResponseEntity<TeamDTO> removeMemberFromTeam(@PathVariable String teamId, @PathVariable String userId) {
        return ResponseEntity.ok(teamService.removeMemberFromTeam(teamId, userId));
    }

    @PostMapping
    public ResponseEntity<TeamDTO> createTeam(@RequestBody TeamDTO teamDTO) {
        TeamDTO createdTeam = teamService.createTeam(teamDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTeam);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamDTO> updateTeam(@PathVariable String id, @RequestBody TeamDTO teamDTO) {
        return ResponseEntity.ok(teamService.updateTeam(id, teamDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable String id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<TeamDTO> getTeamByProjectId(@PathVariable String projectId) {
        return ResponseEntity.ok(teamService.getTeamByProjectId(projectId));
    }
}
