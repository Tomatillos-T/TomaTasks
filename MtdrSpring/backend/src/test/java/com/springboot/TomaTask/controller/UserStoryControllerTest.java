package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.model.UserStory;
import com.springboot.TomaTask.service.UserStoryService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserStoryControllerTest {

    @Mock
    private UserStoryService userStoryService;

    @InjectMocks
    private UserStoryController userStoryController;

    private UserStory us1;

    @BeforeEach
    void setUp() {
        us1 = new UserStory();
        us1.setName("UserStory 1");
        us1.setWeight(5);
        us1.setDescription("First user story");
        us1.setStatus("active");
        us1.setSprintId(1L);
    }

    @Test
    void testGetAllUserStories() {
        when(userStoryService.getAllUserStories()).thenReturn(Arrays.asList(us1));

        List<UserStory> result = userStoryController.getAllUserStories();

        assertEquals(1, result.size());
        verify(userStoryService).getAllUserStories();
    }

    @Test
    void testGetUserStoryById() {
        when(userStoryService.getUserStoryById("1")).thenReturn(us1);

        UserStory result = userStoryController.getUserStoryById("1");

        assertEquals("UserStory 1", result.getName());
        verify(userStoryService).getUserStoryById("1");
    }

    @Test
    void testCreateUserStory() {
        when(userStoryService.createUserStory(us1)).thenReturn(us1);

        UserStory result = userStoryController.createUserStory(us1);

        assertEquals("UserStory 1", result.getName());
        verify(userStoryService).createUserStory(us1);
    }

    @Test
    void testUpdateUserStory() {
        when(userStoryService.updateUserStory(eq("1"), any(UserStory.class))).thenReturn(us1);

        UserStory updates = new UserStory();
        updates.setName("Updated Name");

        UserStory result = userStoryController.updateUserStory("1", updates);

        assertEquals("UserStory 1", result.getName()); // returns the mock object
        verify(userStoryService).updateUserStory(eq("1"), any(UserStory.class));
    }

    @Test
    void testDeleteUserStory() {
        doNothing().when(userStoryService).deleteUserStory("1");

        userStoryController.deleteUserStory("1");

        verify(userStoryService).deleteUserStory("1");
    }
}
