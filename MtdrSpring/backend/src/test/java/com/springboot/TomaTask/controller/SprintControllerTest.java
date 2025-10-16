/*package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.model.Sprint;
import com.springboot.TomaTask.service.SprintService;

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
public class SprintControllerTest {

    @Mock
    private SprintService sprintService;

    @InjectMocks
    private SprintController sprintController;

    private Sprint sprint1;
    private Sprint sprint2;

    @BeforeEach
    void setUp() {
        sprint1 = new Sprint("Sprint 1 desc", "active", LocalDate.of(2025, 10, 1), "project-1");
        sprint2 = new Sprint("Sprint 2 desc", "planning", LocalDate.of(2025, 9, 20), "project-2");
    }

    @Test
    void testGetAllSprints() {
        when(sprintService.getAllSprints()).thenReturn(Arrays.asList(sprint1, sprint2));

        List<Sprint> result = sprintController.getAllSprints();

        assertEquals(2, result.size());
        verify(sprintService).getAllSprints();
    }

    @Test
    void testGetSprintById() {
        when(sprintService.getSprintById("1")).thenReturn(sprint1);

        Sprint result = sprintController.getSprintById("1");

        assertEquals("Sprint 1 desc", result.getDescription());
        verify(sprintService).getSprintById("1");
    }

    @Test
    void testCreateSprint() {
        when(sprintService.createSprint(sprint1)).thenReturn(sprint1);

        Sprint result = sprintController.createSprint(sprint1);

        assertEquals("Sprint 1 desc", result.getDescription());
        verify(sprintService).createSprint(sprint1);
    }

    @Test
    void testUpdateSprint() {
        when(sprintService.updateSprint(eq("1"), any(Sprint.class))).thenReturn(sprint2);

        Sprint result = sprintController.updateSprint("1", sprint2);

        assertEquals("Sprint 2 desc", result.getDescription());
        verify(sprintService).updateSprint(eq("1"), any(Sprint.class));
    }

    @Test
    void testDeleteSprint() {
        doNothing().when(sprintService).deleteSprint("1");

        sprintController.deleteSprint("1");

        verify(sprintService).deleteSprint("1");
    }
}
*/