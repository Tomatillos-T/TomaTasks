package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.ProjectDTO;
import com.springboot.TomaTask.service.ProjectService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

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

    private ProjectDTO projectDTO1;
    private ProjectDTO projectDTO2;

    @BeforeEach
    void setUp() {
        projectDTO1 = new ProjectDTO();
        projectDTO1.setName("TomaTask");
        projectDTO1.setStatus("active");
        projectDTO1.setStartDate(LocalDate.of(2025, 10, 1));

        projectDTO2 = new ProjectDTO();
        projectDTO2.setName("Data Migration");
        projectDTO2.setStatus("planning");
        projectDTO2.setStartDate(LocalDate.of(2025, 9, 20));
    }

    @Test
    void testGetAllProjects() {
        when(projectService.getAllProjects()).thenReturn(Arrays.asList(projectDTO1, projectDTO2));

        ResponseEntity<List<ProjectDTO>> response = projectController.getAllProjects();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertEquals("TomaTask", response.getBody().get(0).getName());
        verify(projectService, times(1)).getAllProjects();
    }

    @Test
    void testGetProjectById() {
        when(projectService.getProjectById("1")).thenReturn(projectDTO1);

        ResponseEntity<ProjectDTO> response = projectController.getProjectById("1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("TomaTask", response.getBody().getName());
        verify(projectService, times(1)).getProjectById("1");
    }

    @Test
    void testCreateProject() {
        when(projectService.createProject(any(ProjectDTO.class))).thenReturn(projectDTO1);

        ResponseEntity<ProjectDTO> response = projectController.createProject(projectDTO1);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("TomaTask", response.getBody().getName());
        verify(projectService, times(1)).createProject(projectDTO1);
    }

    @Test
    void testUpdateProject() {
        when(projectService.updateProject(eq("1"), any(ProjectDTO.class))).thenReturn(projectDTO2);

        ResponseEntity<ProjectDTO> response = projectController.updateProject("1", projectDTO2);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Data Migration", response.getBody().getName());
        verify(projectService, times(1)).updateProject(eq("1"), eq(projectDTO2));
    }

    @Test
    void testDeleteProject() {
        doNothing().when(projectService).deleteProject("1");

        ResponseEntity<Void> response = projectController.deleteProject("1");

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(projectService, times(1)).deleteProject("1");
    }
}
