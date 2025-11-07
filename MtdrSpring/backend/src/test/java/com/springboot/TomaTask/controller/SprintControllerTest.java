package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.SprintDTO;
import com.springboot.TomaTask.service.SprintService;

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
public class SprintControllerTest {

    @Mock
    private SprintService sprintService;

    @InjectMocks
    private SprintController sprintController;

    private SprintDTO sprintDTO1;
    private SprintDTO sprintDTO2;

    @BeforeEach
    void setUp() {
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
        when(sprintService.getAllSprints()).thenReturn(Arrays.asList(sprintDTO1, sprintDTO2));

        ResponseEntity<List<SprintDTO>> response = sprintController.getAllSprints();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        verify(sprintService, times(1)).getAllSprints();
    }

    @Test
    void testGetSprintById() {
        when(sprintService.getSprintById("1")).thenReturn(sprintDTO1);

        ResponseEntity<SprintDTO> response = sprintController.getSprintById("1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Sprint 1 desc", response.getBody().getDescription());
        verify(sprintService, times(1)).getSprintById("1");
    }

    @Test
    void testCreateSprint() {
        when(sprintService.createSprint(any(SprintDTO.class))).thenReturn(sprintDTO1);

        ResponseEntity<SprintDTO> response = sprintController.createSprint(sprintDTO1);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Sprint 1 desc", response.getBody().getDescription());
        verify(sprintService, times(1)).createSprint(sprintDTO1);
    }

    @Test
    void testUpdateSprint() {
        when(sprintService.updateSprint(eq("1"), any(SprintDTO.class))).thenReturn(sprintDTO2);

        ResponseEntity<SprintDTO> response = sprintController.updateSprint("1", sprintDTO2);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Sprint 2 desc", response.getBody().getDescription());
        verify(sprintService, times(1)).updateSprint(eq("1"), eq(sprintDTO2));
    }

    @Test
    void testDeleteSprint() {
        doNothing().when(sprintService).deleteSprint("1");

        ResponseEntity<Void> response = sprintController.deleteSprint("1");

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(sprintService, times(1)).deleteSprint("1");
    }
}
