
package com.springboot.TomaTask.mapper;

import com.springboot.TomaTask.dto.SprintDTO;
import com.springboot.TomaTask.model.Sprint;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class SprintMapper {

    public static SprintDTO toDTO(Sprint sprint) {
        return toDTOWithNested(sprint, false);
    }

    public static SprintDTO toDTOBasic(Sprint sprint) {
        if (sprint == null) {
            return null;
        }

        SprintDTO dto = new SprintDTO();
        dto.setId(sprint.getId());
        dto.setDescription(sprint.getDescription());
        dto.setStatus(sprint.getStatus());
        dto.setStartDate(sprint.getStartDate());
        dto.setEndDate(sprint.getEndDate());
        dto.setDeliveryDate(sprint.getDeliveryDate());
        dto.setCreatedAt(sprint.getCreatedAt());
        dto.setUpdatedAt(sprint.getUpdatedAt());

        if (sprint.getProject() != null) {
            dto.setProjectId(sprint.getProject().getId());
        }

        return dto;
    }

    public static SprintDTO toDTOWithNested(Sprint sprint, boolean includeNested) {
        if (sprint == null) {
            return null;
        }

        SprintDTO dto = toDTOBasic(sprint);

        if (includeNested) {
            if (sprint.getTasks() != null && !sprint.getTasks().isEmpty()) {
                dto.setTasks(sprint.getTasks().stream()
                        .map(TaskMapper::toDTO)
                        .collect(Collectors.toSet()));
            }

            if (sprint.getUserStories() != null && !sprint.getUserStories().isEmpty()) {
                dto.setUserStories(sprint.getUserStories().stream()
                        .map(UserStoryMapper::toDTO)
                        .collect(Collectors.toSet()));
            }
        }

        return dto;
    }

    public static Sprint toEntity(SprintDTO dto) {
        if (dto == null) {
            return null;
        }

        Sprint sprint = new Sprint(dto.getId());
        sprint.setDescription(dto.getDescription());
        sprint.setStatus(dto.getStatus());
        sprint.setStartDate(dto.getStartDate());
        sprint.setEndDate(dto.getEndDate());
        sprint.setDeliveryDate(dto.getDeliveryDate());

        return sprint;
    }

    public static Set<SprintDTO> toDTOSet(Set<Sprint> sprints) {
        if (sprints == null) {
            return new HashSet<>();
        }
        return sprints.stream()
                .map(SprintMapper::toDTO)
                .collect(Collectors.toSet());
    }

    public static List<SprintDTO> toDTOList(List<Sprint> sprints) {
        if (sprints == null) {
            return new java.util.ArrayList<>();
        }
        return sprints.stream()
                .map(SprintMapper::toDTO)
                .collect(Collectors.toList());
    }

    public static Set<Sprint> toEntitySet(Set<SprintDTO> dtos) {
        if (dtos == null) {
            return new HashSet<>();
        }
        return dtos.stream()
                .map(SprintMapper::toEntity)
                .collect(Collectors.toSet());
    }
}
