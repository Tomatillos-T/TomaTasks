package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.UserStoryDTO;
import com.springboot.TomaTask.model.Sprint;
import com.springboot.TomaTask.model.UserStory;
import com.springboot.TomaTask.repository.SprintRepository;
import com.springboot.TomaTask.repository.UserStoryRepository;

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
public class UserStoryServiceTest {

    @Mock
    private UserStoryRepository userStoryRepository;

    @Mock
    private SprintRepository sprintRepository;

    @InjectMocks
    private UserStoryService userStoryService;

    private UserStory us1;
    private UserStory us2;
    private UserStoryDTO usDTO1;
    private UserStoryDTO usDTO2;
    private Sprint sprint1;
    private Sprint sprint2;

    @BeforeEach
    void setUp() {
        sprint1 = new Sprint();
        sprint1.setDescription("Sprint 1");

        sprint2 = new Sprint();
        sprint2.setDescription("Sprint 2");

        us1 = new UserStory();
        us1.setName("UserStory 1");
        us1.setWeight(5);
        us1.setDescription("First user story");
        us1.setStatus("active");
        us1.setSprint(sprint1);

        us2 = new UserStory();
        us2.setName("UserStory 2");
        us2.setWeight(3);
        us2.setDescription("Second user story");
        us2.setStatus("planned");
        us2.setSprint(sprint2);

        usDTO1 = new UserStoryDTO();
        usDTO1.setName("UserStory 1");
        usDTO1.setWeight(5);
        usDTO1.setDescription("First user story");
        usDTO1.setStatus("active");
        usDTO1.setSprintId("1");

        usDTO2 = new UserStoryDTO();
        usDTO2.setName("UserStory 2");
        usDTO2.setWeight(3);
        usDTO2.setDescription("Second user story");
        usDTO2.setStatus("planned");
        usDTO2.setSprintId("2");
    }

    @Test
    void testGetAllUserStories() {
        when(userStoryRepository.findAll()).thenReturn(Arrays.asList(us1, us2));

        List<UserStoryDTO> result = userStoryService.getAllUserStories();

        assertEquals(2, result.size());
        verify(userStoryRepository).findAll();
    }

    @Test
    void testGetUserStoryById_Found() {
        when(userStoryRepository.findById("1")).thenReturn(Optional.of(us1));

        UserStoryDTO result = userStoryService.getUserStoryById("1");

        assertEquals("UserStory 1", result.getName());
        verify(userStoryRepository).findById("1");
    }

    @Test
    void testGetUserStoryById_NotFound() {
        when(userStoryRepository.findById("99")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            userStoryService.getUserStoryById("99")
        );

        assertEquals("UserStory not found with ID: 99", ex.getMessage());
    }

    @Test
    void testCreateUserStory_Success() {
        when(sprintRepository.findById("1")).thenReturn(Optional.of(sprint1));
        when(userStoryRepository.save(any(UserStory.class))).thenReturn(us1);

        UserStoryDTO result = userStoryService.createUserStory(usDTO1);

        assertEquals("UserStory 1", result.getName());
        verify(userStoryRepository).save(any(UserStory.class));
        verify(sprintRepository).findById("1");
    }

    @Test
    void testCreateUserStory_ThrowsWhenSprintIdMissing() {
        UserStoryDTO invalid = new UserStoryDTO();
        invalid.setName("Invalid US");
        invalid.setWeight(5);
        invalid.setDescription("Invalid user story");
        invalid.setStatus("active");

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            userStoryService.createUserStory(invalid)
        );

        assertEquals("Sprint ID is required", ex.getMessage());
        verify(userStoryRepository, never()).save(any());
    }

    @Test
    void testCreateUserStory_ThrowsWhenSprintNotFound() {
        when(sprintRepository.findById("invalid-sprint")).thenReturn(Optional.empty());

        usDTO1.setSprintId("invalid-sprint");

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            userStoryService.createUserStory(usDTO1)
        );

        assertEquals("Sprint not found with ID: invalid-sprint", ex.getMessage());
        verify(userStoryRepository, never()).save(any());
    }

    @Test
    void testUpdateUserStory_Success() {
        when(userStoryRepository.findById("1")).thenReturn(Optional.of(us1));
        when(sprintRepository.findById("1")).thenReturn(Optional.of(sprint1));
        when(userStoryRepository.save(any(UserStory.class))).thenReturn(us1);

        UserStoryDTO updates = new UserStoryDTO();
        updates.setName("Updated Name");
        updates.setWeight(8);
        updates.setDescription("Updated description");
        updates.setStatus("completed");
        updates.setSprintId("1");

        UserStoryDTO result = userStoryService.updateUserStory("1", updates);

        assertEquals("Updated Name", result.getName());
        verify(userStoryRepository).save(any(UserStory.class));
    }

    @Test
    void testUpdateUserStory_NotFoundThrowsException() {
        when(userStoryRepository.findById("99")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            userStoryService.updateUserStory("99", usDTO2)
        );

        assertEquals("UserStory not found with ID: 99", ex.getMessage());
        verify(userStoryRepository, never()).save(any());
    }

    @Test
    void testDeleteUserStory() {
        doNothing().when(userStoryRepository).deleteById("1");

        userStoryService.deleteUserStory("1");

        verify(userStoryRepository).deleteById("1");
    }
}
