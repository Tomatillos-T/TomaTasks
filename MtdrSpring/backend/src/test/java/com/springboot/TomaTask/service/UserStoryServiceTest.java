/*package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.UserStory;
import com.springboot.TomaTask.repository.UserStoryRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserStoryServiceTest {

    @Mock
    private UserStoryRepository userStoryRepository;

    @InjectMocks
    private UserStoryService userStoryService;

    private UserStory us1;
    private UserStory us2;

    @BeforeEach
    void setUp() {
        us1 = new UserStory();
        us1.setName("UserStory 1");
        us1.setWeight(5);
        us1.setDescription("First user story");
        us1.setStatus("active");
        us1.setSprintId(1L);

        us2 = new UserStory();
        us2.setName("UserStory 2");
        us2.setWeight(3);
        us2.setDescription("Second user story");
        us2.setStatus("planned");
        us2.setSprintId(2L);
    }

    @Test
    void testGetAllUserStories() {
        when(userStoryRepository.findAll()).thenReturn(Arrays.asList(us1, us2));

        List<UserStory> result = userStoryService.getAllUserStories();

        assertEquals(2, result.size());
        verify(userStoryRepository).findAll();
    }

    @Test
    void testGetUserStoryById_Found() {
        when(userStoryRepository.findById("1")).thenReturn(Optional.of(us1));

        UserStory result = userStoryService.getUserStoryById("1");

        assertEquals("UserStory 1", result.getName());
        verify(userStoryRepository).findById("1");
    }

    @Test
    void testGetUserStoryById_NotFound() {
        when(userStoryRepository.findById("99")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            userStoryService.getUserStoryById("99")
        );

        assertEquals("UserStory no encontrada", ex.getMessage());
    }

    @Test
    void testCreateUserStory() {
        when(userStoryRepository.save(any(UserStory.class))).thenReturn(us1);

        UserStory result = userStoryService.createUserStory(us1);

        assertEquals("UserStory 1", result.getName());
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());
        verify(userStoryRepository).save(us1);
    }

    @Test
    void testUpdateUserStory() {
        when(userStoryRepository.findById("1")).thenReturn(Optional.of(us1));
        when(userStoryRepository.save(any(UserStory.class))).thenReturn(us1);

        UserStory updates = new UserStory();
        updates.setName("Updated Name");
        updates.setWeight(8);
        updates.setDescription("Updated description");
        updates.setStatus("completed");
        updates.setSprintId(1L);

        UserStory result = userStoryService.updateUserStory("1", updates);

        assertEquals("Updated Name", result.getName());
        assertEquals(8, result.getWeight());
        assertEquals("Updated description", result.getDescription());
        assertEquals("completed", result.getStatus());
        verify(userStoryRepository).save(us1);
    }

    @Test
    void testDeleteUserStory() {
        doNothing().when(userStoryRepository).deleteById("1");

        userStoryService.deleteUserStory("1");

        verify(userStoryRepository).deleteById("1");
    }
}
*/