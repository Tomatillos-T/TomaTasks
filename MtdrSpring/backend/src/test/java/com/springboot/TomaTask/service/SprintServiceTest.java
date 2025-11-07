package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.SprintDTO;
import com.springboot.TomaTask.model.Project;
import com.springboot.TomaTask.model.Sprint;
import com.springboot.TomaTask.repository.ProjectRepository;
import com.springboot.TomaTask.repository.SprintRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SprintServiceTest {

    @Mock
    private SprintRepository sprintRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private SprintService sprintService;

    private Sprint sprint1;
    private Sprint sprint2;
    private SprintDTO sprintDTO1;
    private SprintDTO sprintDTO2;
    private Project project1;
    private Project project2;

    @BeforeEach
    void setUp() {
        project1 = new Project("project-1");
        project2 = new Project("project-2");

        sprint1 = new Sprint();
        sprint1.setDescription("Sprint 1 desc");
        sprint1.setStatus("active");
        sprint1.setStartDate(LocalDate.of(2025, 10, 1));
        sprint1.setProject(project1);

        sprint2 = new Sprint();
        sprint2.setDescription("Sprint 2 desc");
        sprint2.setStatus("planning");
        sprint2.setStartDate(LocalDate.of(2025, 9, 20));
        sprint2.setProject(project2);

        sprintDTO1 = new SprintDTO();
        sprintDTO1.setDescription("Sprint 1 desc");
        sprintDTO1.setStatus("active");
        sprintDTO1.setStartDate(LocalDate.of(2025, 10, 1));
        sprintDTO1.setProjectId("project-1");

        sprintDTO2 = new SprintDTO();
        sprintDTO2.setDescription("Sprint 2 desc");
        sprintDTO2.setStatus("planning");
        sprintDTO2.setStartDate(LocalDate.of(2025, 9, 20));
        sprintDTO2.setProjectId("project-2");
    }

    @Test
    void testGetAllSprints() {
        when(sprintRepository.findAll()).thenReturn(Arrays.asList(sprint1, sprint2));

        List<SprintDTO> result = sprintService.getAllSprints();

        assertEquals(2, result.size());
        verify(sprintRepository, times(1)).findAll();
    }

    @Test
    void testGetSprintById_Found() {
        when(sprintRepository.findById("1")).thenReturn(Optional.of(sprint1));

        SprintDTO result = sprintService.getSprintById("1");

        assertEquals("Sprint 1 desc", result.getDescription());
        verify(sprintRepository).findById("1");
    }

    @Test
    void testGetSprintById_NotFoundThrowsException() {
        when(sprintRepository.findById("99")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            sprintService.getSprintById("99")
        );

        assertEquals("Sprint not found with ID: 99", ex.getMessage());
        verify(sprintRepository).findById("99");
    }

    @Test
    void testCreateSprint_Success() {
        when(projectRepository.findById("project-1")).thenReturn(Optional.of(project1));
        when(sprintRepository.save(any(Sprint.class))).thenReturn(sprint1);

        SprintDTO result = sprintService.createSprint(sprintDTO1);

        assertEquals("Sprint 1 desc", result.getDescription());
        verify(sprintRepository).save(any(Sprint.class));
        verify(projectRepository).findById("project-1");
    }

    @Test
    void testCreateSprint_ThrowsWhenProjectIdMissing() {
        SprintDTO invalid = new SprintDTO();
        invalid.setDescription("Sprint without project");
        invalid.setStatus("active");
        invalid.setStartDate(LocalDate.now());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            sprintService.createSprint(invalid)
        );

        assertEquals("Project ID is required", ex.getMessage());
        verify(sprintRepository, never()).save(any());
    }

    @Test
    void testCreateSprint_ThrowsWhenProjectNotFound() {
        when(projectRepository.findById("invalid-project")).thenReturn(Optional.empty());

        sprintDTO1.setProjectId("invalid-project");

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            sprintService.createSprint(sprintDTO1)
        );

        assertEquals("Project not found with ID: invalid-project", ex.getMessage());
        verify(sprintRepository, never()).save(any());
    }

    @Test
    void testUpdateSprint_Success() {
        when(sprintRepository.findById("1")).thenReturn(Optional.of(sprint1));
        when(projectRepository.findById("project-1")).thenReturn(Optional.of(project1));
        when(sprintRepository.save(any(Sprint.class))).thenReturn(sprint1);

        sprintDTO1.setDescription("Updated desc");
        SprintDTO updated = sprintService.updateSprint("1", sprintDTO1);

        assertEquals("Updated desc", updated.getDescription());
        verify(sprintRepository).save(any(Sprint.class));
    }

    @Test
    void testUpdateSprint_NotFoundThrowsException() {
        when(sprintRepository.findById("99")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            sprintService.updateSprint("99", sprintDTO2)
        );

        assertEquals("Sprint not found with ID: 99", ex.getMessage());
        verify(sprintRepository, never()).save(any());
    }

    @Test
    void testDeleteSprint() {
        doNothing().when(sprintRepository).deleteById("1");

        sprintService.deleteSprint("1");

        verify(sprintRepository).deleteById("1");
    }
}
