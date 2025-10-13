package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.UserStoryDTO;
import com.springboot.TomaTask.service.UserStoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-stories")
public class UserStoryController {
    private final UserStoryService userStoryService;

    public UserStoryController(UserStoryService userStoryService) {
        this.userStoryService = userStoryService;
    }

    @GetMapping
    public ResponseEntity<List<UserStoryDTO>> getAllUserStories() {
        return ResponseEntity.ok(userStoryService.getAllUserStories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserStoryDTO> getUserStoryById(@PathVariable String id) {
        return ResponseEntity.ok(userStoryService.getUserStoryById(id));
    }

    @PostMapping
    public ResponseEntity<UserStoryDTO> createUserStory(@RequestBody UserStoryDTO userStoryDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userStoryService.createUserStory(userStoryDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserStoryDTO> updateUserStory(@PathVariable String id, @RequestBody UserStoryDTO userStoryDTO) {
        return ResponseEntity.ok(userStoryService.updateUserStory(id, userStoryDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserStory(@PathVariable String id) {
        userStoryService.deleteUserStory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sprint/{sprintId}")
    public ResponseEntity<List<UserStoryDTO>> getUserStoriesBySprintId(@PathVariable String sprintId) {
        return ResponseEntity.ok(userStoryService.getUserStoriesBySprintId(sprintId));
    }
}
