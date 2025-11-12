package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.TeamDTO;
import com.springboot.TomaTask.model.Project;
import com.springboot.TomaTask.model.Team;
import com.springboot.TomaTask.repository.ProjectRepository;
import com.springboot.TomaTask.repository.TeamRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TeamServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private TeamService teamService;

    private Project project1;
    private Project project2;
    private Team team1;
    private Team team2;
    private TeamDTO teamDTO1;
    private TeamDTO teamDTO2;

    @BeforeEach
    void setUp() {
        project1 = new Project("Project A", "active", null);
        project2 = new Project("Project B", "active", null);

        team1 = new Team();
        team1.setName("Team 1");
        team1.setDescription("Backend team");
        team1.setStatus("active");
        team1.setProject(project1);

        team2 = new Team();
        team2.setName("Team 2");
        team2.setDescription("Frontend team");
        team2.setStatus("planning");
        team2.setProject(project2);

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
    }

    @Test
    void testGetAllTeams() {
        when(teamRepository.findAll()).thenReturn(Arrays.asList(team1, team2));

        List<TeamDTO> result = teamService.getAllTeams();

        assertEquals(2, result.size());
        verify(teamRepository).findAll();
    }

    @Test
    void testGetTeamById_Found() {
        when(teamRepository.findById("id1")).thenReturn(Optional.of(team1));

        TeamDTO result = teamService.getTeamById("id1");

        assertEquals("Team 1", result.getName());
        verify(teamRepository).findById("id1");
    }

    @Test
    void testGetTeamById_NotFound() {
        when(teamRepository.findById("unknown")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> teamService.getTeamById("unknown"));
        assertEquals("Team not found with ID: unknown", ex.getMessage());
    }

    @Test
    void testCreateTeam_Success() {
        when(projectRepository.findById("project-1")).thenReturn(Optional.of(project1));
        when(teamRepository.findByProject(project1)).thenReturn(Optional.empty());
        when(teamRepository.save(any(Team.class))).thenReturn(team1);

        TeamDTO result = teamService.createTeam(teamDTO1);

        assertEquals("Team 1", result.getName());
        verify(teamRepository).save(any(Team.class));
        verify(projectRepository).findById("project-1");
    }

    @Test
    void testCreateTeam_WithoutName() {
        TeamDTO invalid = new TeamDTO();
        invalid.setName("");
        invalid.setDescription("desc");
        invalid.setStatus("active");
        invalid.setProjectId("project-1");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> teamService.createTeam(invalid));
        assertEquals("Team name is required", ex.getMessage());
        verify(teamRepository, never()).save(any());
    }

    @Test
    void testCreateTeam_WithoutProjectId() {
        TeamDTO invalid = new TeamDTO();
        invalid.setName("No Project");
        invalid.setDescription("desc");
        invalid.setStatus("active");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> teamService.createTeam(invalid));
        assertEquals("Project ID is required", ex.getMessage());
        verify(teamRepository, never()).save(any());
    }

    @Test
    void testCreateTeam_ProjectNotFound() {
        when(projectRepository.findById("invalid-project")).thenReturn(Optional.empty());

        teamDTO1.setProjectId("invalid-project");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> teamService.createTeam(teamDTO1));
        assertEquals("Project not found with ID: invalid-project", ex.getMessage());
        verify(teamRepository, never()).save(any());
    }

    @Test
    void testCreateTeam_ProjectAlreadyUsed() {
        when(projectRepository.findById("project-1")).thenReturn(Optional.of(project1));
        when(teamRepository.findByProject(project1)).thenReturn(Optional.of(team2));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> teamService.createTeam(teamDTO1));
        assertEquals("Project is already associated with a team", ex.getMessage());
        verify(teamRepository, never()).save(any());
    }

    @Test
    void testUpdateTeam_Success() {
        when(teamRepository.findById("id1")).thenReturn(Optional.of(team1));
        when(projectRepository.findById("project-2")).thenReturn(Optional.of(project2));
        when(teamRepository.findByProject(project2)).thenReturn(Optional.empty());
        when(teamRepository.save(any(Team.class))).thenReturn(team1);

        teamDTO1.setProjectId("project-2");
        TeamDTO updated = teamService.updateTeam("id1", teamDTO1);

        assertEquals("Team 1", updated.getName());
        verify(teamRepository).save(any(Team.class));
    }

    @Test
    void testUpdateTeam_NotFoundThrowsException() {
        when(teamRepository.findById("99")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            teamService.updateTeam("99", teamDTO2)
        );

        assertEquals("Team not found with ID: 99", ex.getMessage());
        verify(teamRepository, never()).save(any());
    }

    @Test
    void testDeleteTeam() {
        doNothing().when(teamRepository).deleteById("id1");

        teamService.deleteTeam("id1");

        verify(teamRepository).deleteById("id1");
    }

    @Test
    void testGetTeamByProjectId_Success() {
        when(projectRepository.findById("project-1")).thenReturn(Optional.of(project1));
        when(teamRepository.findByProject(project1)).thenReturn(Optional.of(team1));

        TeamDTO result = teamService.getTeamByProjectId("project-1");

        assertEquals("Team 1", result.getName());
        verify(teamRepository).findByProject(project1);
        verify(projectRepository).findById("project-1");
    }

    @Test
    void testGetTeamByProjectId_ProjectNotFound() {
        when(projectRepository.findById("invalid-project")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            teamService.getTeamByProjectId("invalid-project")
        );

        assertEquals("Project not found with ID: invalid-project", ex.getMessage());
    }

    @Test
    void testGetTeamByProjectId_TeamNotFound() {
        when(projectRepository.findById("project-1")).thenReturn(Optional.of(project1));
        when(teamRepository.findByProject(project1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            teamService.getTeamByProjectId("project-1")
        );

        assertEquals("No team found for this project", ex.getMessage());
    }
}
