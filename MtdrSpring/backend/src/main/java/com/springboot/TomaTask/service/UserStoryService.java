package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.UserStoryDTO;
import com.springboot.TomaTask.mapper.UserStoryMapper;
import com.springboot.TomaTask.model.Sprint;
import com.springboot.TomaTask.model.UserStory;
import com.springboot.TomaTask.repository.SprintRepository;
import com.springboot.TomaTask.repository.UserStoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserStoryService {
    private final UserStoryRepository userStoryRepository;
    private final SprintRepository sprintRepository;

    public UserStoryService(UserStoryRepository userStoryRepository,
            SprintRepository sprintRepository) {
        this.userStoryRepository = userStoryRepository;
        this.sprintRepository = sprintRepository;
    }

    public List<UserStoryDTO> getAllUserStories() {
        return UserStoryMapper.toDTOList(userStoryRepository.findAll());
    }

    public UserStoryDTO getUserStoryById(String id) {
        UserStory userStory = userStoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserStory not found with ID: " + id));
        return UserStoryMapper.toDTOWithNested(userStory, true);
    }

    public UserStoryDTO createUserStory(UserStoryDTO userStoryDTO) {
        UserStory userStory = UserStoryMapper.toEntity(userStoryDTO);

        // Set Sprint
        if (userStoryDTO.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(userStoryDTO.getSprintId())
                    .orElseThrow(() -> new RuntimeException("Sprint not found with ID: " + userStoryDTO.getSprintId()));
            userStory.setSprint(sprint);
        } else {
            throw new RuntimeException("Sprint ID is required");
        }

        UserStory savedUserStory = userStoryRepository.save(userStory);
        return UserStoryMapper.toDTOWithNested(savedUserStory, true);
    }

    public UserStoryDTO updateUserStory(String id, UserStoryDTO userStoryDTO) {
        UserStory userStory = userStoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserStory not found with ID: " + id));

        userStory.setName(userStoryDTO.getName());
        userStory.setWeight(userStoryDTO.getWeight());
        userStory.setDescription(userStoryDTO.getDescription());
        userStory.setStatus(userStoryDTO.getStatus());

        // Update Sprint
        if (userStoryDTO.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(userStoryDTO.getSprintId())
                    .orElseThrow(() -> new RuntimeException("Sprint not found with ID: " + userStoryDTO.getSprintId()));
            userStory.setSprint(sprint);
        }

        UserStory updatedUserStory = userStoryRepository.save(userStory);
        return UserStoryMapper.toDTOWithNested(updatedUserStory, true);
    }

    public void deleteUserStory(String id) {
        userStoryRepository.deleteById(id);
    }

    public List<UserStoryDTO> getUserStoriesBySprintId(String sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found with ID: " + sprintId));
        return UserStoryMapper.toDTOList(sprint.getUserStories().stream().collect(Collectors.toList()));
    }
}
