package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.UserStory;
import com.springboot.TomaTask.repository.UserStoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserStoryService {

    private final UserStoryRepository userStoryRepository;

    public UserStoryService(UserStoryRepository userStoryRepository) {
        this.userStoryRepository = userStoryRepository;
    }

    public List<UserStory> getAllUserStories() {
        return userStoryRepository.findAll();
    }

    public UserStory getUserStoryById(String id) {
        return userStoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserStory no encontrada"));
    }

    public UserStory createUserStory(UserStory userStory) {
        userStory.setCreatedAt(LocalDateTime.now());
        userStory.setUpdatedAt(LocalDateTime.now());
        return userStoryRepository.save(userStory);
    }

    public UserStory updateUserStory(String id, UserStory details) {
        UserStory us = getUserStoryById(id);

        us.setName(details.getName());
        us.setWeight(details.getWeight());
        us.setDescription(details.getDescription());
        us.setStatus(details.getStatus());
        us.setSprintId(details.getSprintId());
        us.setUpdatedAt(LocalDateTime.now());

        return userStoryRepository.save(us);
    }

    public void deleteUserStory(String id) {
        userStoryRepository.deleteById(id);
    }
}
