package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.UserStoryDTO;
import com.springboot.TomaTask.service.UserStoryService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
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

    private UserStoryDTO usDTO1;
    private UserStoryDTO usDTO2;

    @BeforeEach
    void setUp() {
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
        when(userStoryService.getAllUserStories()).thenReturn(Arrays.asList(usDTO1, usDTO2));

        ResponseEntity<List<UserStoryDTO>> response = userStoryController.getAllUserStories();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        verify(userStoryService, times(1)).getAllUserStories();
    }

    @Test
    void testGetUserStoryById() {
        when(userStoryService.getUserStoryById("1")).thenReturn(usDTO1);

        ResponseEntity<UserStoryDTO> response = userStoryController.getUserStoryById("1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("UserStory 1", response.getBody().getName());
        verify(userStoryService, times(1)).getUserStoryById("1");
    }

    @Test
    void testCreateUserStory() {
        when(userStoryService.createUserStory(any(UserStoryDTO.class))).thenReturn(usDTO1);

        ResponseEntity<UserStoryDTO> response = userStoryController.createUserStory(usDTO1);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("UserStory 1", response.getBody().getName());
        verify(userStoryService, times(1)).createUserStory(usDTO1);
    }

    @Test
    void testUpdateUserStory() {
        when(userStoryService.updateUserStory(eq("1"), any(UserStoryDTO.class))).thenReturn(usDTO2);

        ResponseEntity<UserStoryDTO> response = userStoryController.updateUserStory("1", usDTO2);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("UserStory 2", response.getBody().getName());
        verify(userStoryService, times(1)).updateUserStory(eq("1"), eq(usDTO2));
    }

    @Test
    void testDeleteUserStory() {
        doNothing().when(userStoryService).deleteUserStory("1");

        ResponseEntity<Void> response = userStoryController.deleteUserStory("1");

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(userStoryService, times(1)).deleteUserStory("1");
    }
}
