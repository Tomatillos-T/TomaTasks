package com.springboot.TomaTask.mapper;

import com.springboot.TomaTask.dto.UserStoryDTO;
import com.springboot.TomaTask.model.UserStory;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserStoryMapper {

    public static UserStoryDTO toDTO(UserStory userStory) {
        return toDTOWithNested(userStory, false);
    }

    public static UserStoryDTO toDTOWithNested(UserStory userStory, boolean includeNested) {
        if (userStory == null) {
            return null;
        }

        UserStoryDTO dto = new UserStoryDTO();
        dto.setId(userStory.getId());
        dto.setName(userStory.getName());
        dto.setWeight(userStory.getWeight());
        dto.setDescription(userStory.getDescription());
        dto.setStatus(userStory.getStatus());
        dto.setCreatedAt(userStory.getCreatedAt());
        dto.setUpdatedAt(userStory.getUpdatedAt());

        if (userStory.getSprint() != null) {
            dto.setSprintId(userStory.getSprint().getId());
        }

        if (includeNested) {
            if (userStory.getTasks() != null && !userStory.getTasks().isEmpty()) {
                dto.setTasks(userStory.getTasks().stream()
                        .map(TaskMapper::toDTO)
                        .collect(Collectors.toSet()));
            }

            if (userStory.getAcceptanceCriteria() != null && !userStory.getAcceptanceCriteria().isEmpty()) {
                dto.setAcceptanceCriteria(userStory.getAcceptanceCriteria().stream()
                        .map(AcceptanceCriteriaMapper::toDTO)
                        .collect(Collectors.toSet()));
            }
        }

        return dto;
    }

    public static UserStory toEntity(UserStoryDTO dto) {
        if (dto == null) {
            return null;
        }

        UserStory userStory = new UserStory();
        userStory.setName(dto.getName());
        userStory.setWeight(dto.getWeight());
        userStory.setDescription(dto.getDescription());
        userStory.setStatus(dto.getStatus());

        return userStory;
    }

    public static UserStory toEntityWithId(UserStoryDTO dto) {
        UserStory userStory = toEntity(dto);
        if (dto != null && dto.getId() != null) {
            userStory.setId(dto.getId());
        }
        return userStory;
    }

    public static Set<UserStoryDTO> toDTOSet(Set<UserStory> userStories) {
        if (userStories == null) {
            return new HashSet<>();
        }
        return userStories.stream()
                .map(UserStoryMapper::toDTO)
                .collect(Collectors.toSet());
    }

    public static List<UserStoryDTO> toDTOList(List<UserStory> userStories) {
        if (userStories == null) {
            return new java.util.ArrayList<>();
        }
        return userStories.stream()
                .map(UserStoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    public static Set<UserStory> toEntitySet(Set<UserStoryDTO> dtos) {
        if (dtos == null) {
            return new HashSet<>();
        }
        return dtos.stream()
                .map(UserStoryMapper::toEntity)
                .collect(Collectors.toSet());
    }
}
