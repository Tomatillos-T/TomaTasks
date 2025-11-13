package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.TeamDTO;
import com.springboot.TomaTask.service.TeamService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TeamControllerTest {

    @Mock
    private TeamService teamService;

    @InjectMocks
    private TeamController teamController;

    private TeamDTO teamDTO1;
    private TeamDTO teamDTO2;
    private TeamDTO teamDTOWithoutProject;

    @BeforeEach
    void setUp() {
        teamDTO1 = new TeamDTO();
        teamDTO1.setName("Team 1");
        teamDTO1.setDescription("Backend team");
        teamDTO1.setStatus("active");
        teamDTO1.setProjectId("project-1");

        teamDTO2 = new TeamDTO();
        teamDTO2.setName("Team 2");
        teamDTO2.setDescription("Frontend team");
        teamDTO2.setStatus("planning");
        teamDTO2.setProjectId("project-2");

        teamDTOWithoutProject = new TeamDTO();
        teamDTOWithoutProject.setName("Unassigned Team");
        teamDTOWithoutProject.setDescription("Team without project");
        teamDTOWithoutProject.setStatus("active");
        teamDTOWithoutProject.setProjectId(null);
    }

    @Test
    void testGetAllTeams() {
        when(teamService.getAllTeams()).thenReturn(Arrays.asList(teamDTO1, teamDTO2));

        ResponseEntity<List<TeamDTO>> response = teamController.getAllTeams();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        verify(teamService, times(1)).getAllTeams();
    }

    @Test
    void testGetTeamById() {
        when(teamService.getTeamById("1")).thenReturn(teamDTO1);

        ResponseEntity<TeamDTO> response = teamController.getTeamById("1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Team 1", response.getBody().getName());
        verify(teamService, times(1)).getTeamById("1");
    }

    @Test
    void testCreateTeam() {
        when(teamService.createTeam(any(TeamDTO.class))).thenReturn(teamDTO1);

        ResponseEntity<TeamDTO> response = teamController.createTeam(teamDTO1);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Team 1", response.getBody().getName());
        verify(teamService, times(1)).createTeam(teamDTO1);
    }

    @Test
    void testCreateTeamWithoutProject() {
        when(teamService.createTeam(any(TeamDTO.class))).thenReturn(teamDTOWithoutProject);

        ResponseEntity<TeamDTO> response = assertDoesNotThrow(
                () -> teamController.createTeam(teamDTOWithoutProject));

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Unassigned Team", response.getBody().getName());
        assertNull(response.getBody().getProjectId());
        verify(teamService, times(1)).createTeam(teamDTOWithoutProject);
    }

    @Test
    void testUpdateTeam() {
        when(teamService.updateTeam(eq("1"), any(TeamDTO.class))).thenReturn(teamDTO2);

        ResponseEntity<TeamDTO> response = teamController.updateTeam("1", teamDTO2);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Team 2", response.getBody().getName());
        verify(teamService, times(1)).updateTeam(eq("1"), eq(teamDTO2));
    }

    @Test
    void testDeleteTeam() {
        doNothing().when(teamService).deleteTeam("1");

        ResponseEntity<Void> response = teamController.deleteTeam("1");

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(teamService, times(1)).deleteTeam("1");
    }
}
