package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.Project;
import com.springboot.TomaTask.model.Team;
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

    @InjectMocks
    private TeamService teamService;

    private Project project1;
    private Project project2;
    private Team team1;
    private Team team2;

    @BeforeEach
    void setUp() {
        project1 = new Project("Project A", "active", null);
        project2 = new Project("Project B", "active", null);

        team1 = new Team("Team 1", "Backend team", "active", project1);
        team2 = new Team("Team 2", "Frontend team", "planning", project2);
    }

    @Test
    void testGetAllTeams() {
        when(teamRepository.findAll()).thenReturn(Arrays.asList(team1, team2));

        List<Team> result = teamService.getAllTeams();

        assertEquals(2, result.size());
        verify(teamRepository).findAll();
    }

    @Test
    void testGetTeamById_Found() {
        when(teamRepository.findById("id1")).thenReturn(Optional.of(team1));

        Team result = teamService.getTeamById("id1");

        assertEquals("Team 1", result.getName());
        verify(teamRepository).findById("id1");
    }

    @Test
    void testGetTeamById_NotFound() {
        when(teamRepository.findById("unknown")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> teamService.getTeamById("unknown"));
        assertEquals("Equipo no encontrado", ex.getMessage());
    }

    @Test
    void testCreateTeam_Success() {
        when(teamRepository.findByProject(project1)).thenReturn(Optional.empty());
        when(teamRepository.save(team1)).thenReturn(team1);

        Team result = teamService.createTeam(team1);

        assertEquals("Team 1", result.getName());
        verify(teamRepository).save(team1);
    }

    @Test
    void testCreateTeam_WithoutName() {
        Team invalid = new Team("", "desc", "active", project1);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> teamService.createTeam(invalid));
        assertEquals("El nombre del equipo es obligatorio", ex.getMessage());
        verify(teamRepository, never()).save(any());
    }

    @Test
    void testCreateTeam_WithoutProject() {
        Team invalid = new Team("No Project", "desc", "active", null);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> teamService.createTeam(invalid));
        assertEquals("El Project es obligatorio", ex.getMessage());
        verify(teamRepository, never()).save(any());
    }

    @Test
    void testCreateTeam_ProjectAlreadyUsed() {
        when(teamRepository.findByProject(project1)).thenReturn(Optional.of(team2));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> teamService.createTeam(team1));
        assertEquals("El Project ya está asociado a otro Team", ex.getMessage());
        verify(teamRepository, never()).save(any());
    }

    @Test
    void testUpdateTeam_Success() {
        when(teamRepository.findById("id1")).thenReturn(Optional.of(team1));
        when(teamRepository.findByProject(project2)).thenReturn(Optional.empty());
        when(teamRepository.save(any(Team.class))).thenReturn(team1);

        team1.setProject(project2);
        Team updated = teamService.updateTeam("id1", team1);

        assertEquals("Team 1", updated.getName());
        verify(teamRepository).save(team1);
    }

    @Test
    void testDeleteTeam() {
        doNothing().when(teamRepository).deleteById("id1");

        teamService.deleteTeam("id1");

        verify(teamRepository).deleteById("id1");
    }

    @Test
    void testGetTeamByProject_Success() {
        when(teamRepository.findByProject(project1)).thenReturn(Optional.of(team1));

        Team result = teamService.getTeamByProject(project1);

        assertEquals("Team 1", result.getName());
        verify(teamRepository).findByProject(project1);
    }

    @Test
    void testGetTeamByProject_NotFound() {
        when(teamRepository.findByProject(project1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> teamService.getTeamByProject(project1));
        assertEquals("No existe un Team asociado a este Project", ex.getMessage());
    }
}
