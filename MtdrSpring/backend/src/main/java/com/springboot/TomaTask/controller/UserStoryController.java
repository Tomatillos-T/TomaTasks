package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.model.UserStory;
import com.springboot.TomaTask.service.UserStoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-story")
public class UserStoryController {

    private final UserStoryService userStoryService;

    public UserStoryController(UserStoryService userStoryService) {
        this.userStoryService = userStoryService;
    }

    @GetMapping
    public List<UserStory> getAllUserStories() {
        return userStoryService.getAllUserStories();
    }

    @GetMapping("/{id}")
    public UserStory getUserStoryById(@PathVariable String id) {
        return userStoryService.getUserStoryById(id);
    }

    @PostMapping
    public UserStory createUserStory(@RequestBody UserStory userStory) {
        return userStoryService.createUserStory(userStory);
    }

    @PutMapping("/{id}")
    public UserStory updateUserStory(@PathVariable String id, @RequestBody UserStory details) {
        return userStoryService.updateUserStory(id, details);
    }

    @DeleteMapping("/{id}")
    public void deleteUserStory(@PathVariable String id) {
        userStoryService.deleteUserStory(id);
    }
}
