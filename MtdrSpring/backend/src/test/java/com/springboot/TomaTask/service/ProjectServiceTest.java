package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.ProjectDTO;
import com.springboot.TomaTask.model.Project;
import com.springboot.TomaTask.repository.ProjectRepository;

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
public class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectService projectService;

    private Project project1;
    private Project project2;
    private ProjectDTO projectDTO1;
    private ProjectDTO projectDTO2;

    @BeforeEach
    void setUp() {
        project1 = new Project("TomaTask", "active", LocalDate.of(2025, 10, 1));
        project1.setDescription("Main project");

        project2 = new Project("Data Migration", "planning", LocalDate.of(2025, 9, 20));
        project2.setDescription("Migration project");

        projectDTO1 = new ProjectDTO();
        projectDTO1.setName("TomaTask");
        projectDTO1.setStatus("active");
        projectDTO1.setStartDate(LocalDate.of(2025, 10, 1));
        projectDTO1.setDescription("Main project");

        projectDTO2 = new ProjectDTO();
        projectDTO2.setName("Data Migration");
        projectDTO2.setStatus("planning");
        projectDTO2.setStartDate(LocalDate.of(2025, 9, 20));
        projectDTO2.setDescription("Migration project");
    }

    @Test
    void testGetAllProjects() {
        when(projectRepository.findAll()).thenReturn(Arrays.asList(project1, project2));

        List<ProjectDTO> result = projectService.getAllProjects();

        assertEquals(2, result.size());
        assertEquals("TomaTask", result.get(0).getName());
        verify(projectRepository, times(1)).findAll();
    }

    @Test
    void testGetProjectById_Found() {
        when(projectRepository.findById("1")).thenReturn(Optional.of(project1));

        ProjectDTO result = projectService.getProjectById("1");

        assertEquals("TomaTask", result.getName());
        verify(projectRepository, times(1)).findById("1");
    }

    @Test
    void testGetProjectById_NotFoundThrowsException() {
        when(projectRepository.findById("99")).thenReturn(Optional.empty());

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            projectService.getProjectById("99");
        });

        assertEquals("Project not found with ID: 99", thrown.getMessage());
        verify(projectRepository, times(1)).findById("99");
    }

    @Test
    void testCreateProject_Success() {
        when(projectRepository.save(any(Project.class))).thenReturn(project1);

        ProjectDTO result = projectService.createProject(projectDTO1);

        assertEquals("TomaTask", result.getName());
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void testCreateProject_ThrowsWhenNameMissing() {
        ProjectDTO invalid = new ProjectDTO();
        invalid.setName("");
        invalid.setStatus("active");
        invalid.setStartDate(LocalDate.now());

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            projectService.createProject(invalid);
        });

        assertEquals("Project name is required", thrown.getMessage());
        verify(projectRepository, never()).save(any());
    }

    @Test
    void testUpdateProject_Success() {
        when(projectRepository.findById("1")).thenReturn(Optional.of(project1));
        when(projectRepository.save(any(Project.class))).thenReturn(project1);

        projectDTO1.setDescription("Updated Description");
        ProjectDTO updated = projectService.updateProject("1", projectDTO1);

        assertEquals("Updated Description", updated.getDescription());
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void testUpdateProject_NotFoundThrowsException() {
        when(projectRepository.findById("99")).thenReturn(Optional.empty());

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            projectService.updateProject("99", projectDTO2);
        });

        assertEquals("Project not found with ID: 99", thrown.getMessage());
        verify(projectRepository, never()).save(any());
    }

    @Test
    void testDeleteProject() {
        doNothing().when(projectRepository).deleteById("1");

        projectService.deleteProject("1");

        verify(projectRepository, times(1)).deleteById("1");
    }
}
