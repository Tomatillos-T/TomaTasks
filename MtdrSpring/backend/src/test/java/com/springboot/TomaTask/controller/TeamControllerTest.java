/*package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.model.Project;
import com.springboot.TomaTask.model.Team;
import com.springboot.TomaTask.service.ProjectService;
import com.springboot.TomaTask.service.TeamService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TeamControllerTest {

    @Mock
    private TeamService teamService;

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private TeamController teamController;

    private Project project1;
    private Team team1;

    @BeforeEach
    void setUp() {
        project1 = new Project("Project A", "active", null);
        team1 = new Team("Team 1", "Backend team", "active", project1);
    }

    @Test
    void testGetAllTeams() {
        when(teamService.getAllTeams()).thenReturn(Arrays.asList(team1));

        List<Team> result = teamController.getAllTeams();

        assertEquals(1, result.size());
        verify(teamService).getAllTeams();
    }

    @Test
    void testGetTeamById() {
        when(teamService.getTeamById("id1")).thenReturn(team1);

        ResponseEntity<Team> response = teamController.getTeamById("id1");

        assertEquals(team1, response.getBody());
        verify(teamService).getTeamById("id1");
    }

    @Test
    void testCreateTeam() {
        // Mock project lookup
        when(projectService.getProjectById("project-1")).thenReturn(project1);
        when(teamService.createTeam(any(Team.class))).thenReturn(team1);

        TeamController.TeamRequest request = new TeamController.TeamRequest();
        request.setName("Team 1");
        request.setDescription("Backend team");
        request.setStatus("active");
        request.setProjectId("project-1");

        ResponseEntity<Team> response = teamController.createTeam(request);

        assertEquals(team1, response.getBody());
        verify(projectService).getProjectById("project-1");
        verify(teamService).createTeam(any(Team.class));
    }

    @Test
    void testUpdateTeam() {
        when(teamService.getTeamById("id1")).thenReturn(team1);
        when(projectService.getProjectById("project-1")).thenReturn(project1);
        when(teamService.updateTeam(eq("id1"), any(Team.class))).thenReturn(team1);

        TeamController.TeamRequest request = new TeamController.TeamRequest();
        request.setName("Team 1 Updated");
        request.setDescription("Backend updated");
        request.setStatus("active");
        request.setProjectId("project-1");

        ResponseEntity<Team> response = teamController.updateTeam("id1", request);

        assertEquals(team1, response.getBody());
        verify(teamService).updateTeam(eq("id1"), any(Team.class));
    }

    @Test
    void testDeleteTeam() {
        doNothing().when(teamService).deleteTeam("id1");

        ResponseEntity<Void> response = teamController.deleteTeam("id1");

        assertEquals(204, response.getStatusCode().value());
        verify(teamService).deleteTeam("id1");
    }

    @Test
    void testGetTeamByProject() {
        when(projectService.getProjectById("project-1")).thenReturn(project1);
        when(teamService.getTeamByProject(project1)).thenReturn(team1);

        ResponseEntity<Team> response = teamController.getTeamByProject("project-1");

        assertEquals(team1, response.getBody());
        verify(projectService).getProjectById("project-1");
        verify(teamService).getTeamByProject(project1);
    }
}
*/