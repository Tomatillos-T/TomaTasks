package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.model.Project;
import com.springboot.TomaTask.service.ProjectService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProjectControllerTest {

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private ProjectController projectController;

    private Project project1;
    private Project project2;

    @BeforeEach
    void setUp() {
        project1 = new Project("TomaTask", "active", LocalDate.of(2025, 10, 1));
        project2 = new Project("Data Migration", "planning", LocalDate.of(2025, 9, 20));
    }

    @Test
    void testGetAllProjects() {
        when(projectService.getAllProjects()).thenReturn(Arrays.asList(project1, project2));

        List<Project> result = projectController.getAllProjects();

        assertEquals(2, result.size());
        assertEquals("TomaTask", result.get(0).getName());
        verify(projectService, times(1)).getAllProjects();
    }

    @Test
    void testGetProjectById() {
        when(projectService.getProjectById("1")).thenReturn(project1);

        Project result = projectController.getProjectById("1");

        assertEquals("TomaTask", result.getName());
        verify(projectService, times(1)).getProjectById("1");
    }

    @Test
    void testCreateProject() {
        when(projectService.createProject(any(Project.class))).thenReturn(project1);

        Project result = projectController.createProject(project1);

        assertEquals("TomaTask", result.getName());
        verify(projectService, times(1)).createProject(project1);
    }

    @Test
    void testUpdateProject() {
        when(projectService.updateProject(eq("1"), any(Project.class))).thenReturn(project2);

        Project result = projectController.updateProject("1", project2);

        assertEquals("Data Migration", result.getName());
        verify(projectService, times(1)).updateProject(eq("1"), eq(project2));
    }

    @Test
    void testDeleteProject() {
        doNothing().when(projectService).deleteProject("1");

        projectController.deleteProject("1");

        verify(projectService, times(1)).deleteProject("1");
    }
}
