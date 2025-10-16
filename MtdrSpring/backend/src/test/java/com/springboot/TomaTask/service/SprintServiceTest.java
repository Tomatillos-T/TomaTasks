/*package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.Sprint;
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

    @InjectMocks
    private SprintService sprintService;

    private Sprint sprint1;
    private Sprint sprint2;

    @BeforeEach
    void setUp() {
        sprint1 = new Sprint("Sprint 1 desc", "active", LocalDate.of(2025, 10, 1), "project-1");
        sprint2 = new Sprint("Sprint 2 desc", "planning", LocalDate.of(2025, 9, 20), "project-2");
    }

    @Test
    void testGetAllSprints() {
        when(sprintRepository.findAll()).thenReturn(Arrays.asList(sprint1, sprint2));

        List<Sprint> result = sprintService.getAllSprints();

        assertEquals(2, result.size());
        verify(sprintRepository, times(1)).findAll();
    }

    @Test
    void testGetSprintById_Found() {
        when(sprintRepository.findById("1")).thenReturn(Optional.of(sprint1));

        Sprint result = sprintService.getSprintById("1");

        assertEquals("Sprint 1 desc", result.getDescription());
        verify(sprintRepository).findById("1");
    }

    @Test
    void testGetSprintById_NotFoundThrowsException() {
        when(sprintRepository.findById("99")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            sprintService.getSprintById("99")
        );

        assertEquals("Sprint no encontrado", ex.getMessage());
        verify(sprintRepository).findById("99");
    }

    @Test
    void testCreateSprint_Success() {
        when(sprintRepository.save(sprint1)).thenReturn(sprint1);

        Sprint result = sprintService.createSprint(sprint1);

        assertEquals("Sprint 1 desc", result.getDescription());
        verify(sprintRepository).save(sprint1);
    }

    @Test
    void testUpdateSprint_Success() {
        when(sprintRepository.findById("1")).thenReturn(Optional.of(sprint1));
        when(sprintRepository.save(any(Sprint.class))).thenReturn(sprint1);

        sprint1.setDescription("Updated desc");
        Sprint updated = sprintService.updateSprint("1", sprint1);

        assertEquals("Updated desc", updated.getDescription());
        verify(sprintRepository).save(sprint1);
    }

    @Test
    void testUpdateSprint_NotFoundThrowsException() {
        when(sprintRepository.findById("99")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            sprintService.updateSprint("99", sprint2)
        );

        assertEquals("Sprint no encontrado", ex.getMessage());
        verify(sprintRepository, never()).save(any());
    }

    @Test
    void testDeleteSprint() {
        doNothing().when(sprintRepository).deleteById("1");

        sprintService.deleteSprint("1");

        verify(sprintRepository).deleteById("1");
    }
}
*/