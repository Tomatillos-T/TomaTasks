package com.springboot.TomaTask.mapper;

import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.model.Task;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class TaskMapper {

    public static TaskDTO toDTO(Task task) {
        return toDTOWithNested(task, false);
    }

    public static TaskDTO toDTOWithNested(Task task, boolean includeNested) {
        if (task == null) {
            return null;
        }

        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setName(task.getName());
        dto.setDescription(task.getDescription());
        dto.setTimeEstimate(task.getTimeEstimate());
        dto.setStatus(task.getStatus());
        dto.setStartDate(task.getStartDate());
        dto.setEndDate(task.getEndDate());
        dto.setDeliveryDate(task.getDeliveryDate());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());

        // Set IDs for relationships
        if (task.getUserStory() != null) {
            dto.setUserStoryId(task.getUserStory().getId());
            dto.setUserStoryName(task.getUserStory().getName());
        }

        if (task.getSprint() != null) {
            dto.setSprintId(task.getSprint().getId());
            dto.setSprintName(task.getSprint().getDescription());
        }

        if (task.getUser() != null) {
            dto.setAssigneeId(task.getUser().getId());
            dto.setAssigneeName(task.getUser().getName());
        }

        // Include nested objects if requested
        if (includeNested) {
            if (task.getUser() != null) {
                dto.setAssignee(UserMapper.toDTO(task.getUser()));
            }

            if (task.getSprint() != null) {
                dto.setSprint(SprintMapper.toDTOBasic(task.getSprint()));
            }

            if (task.getUserStory() != null) {
                dto.setUserStory(UserStoryMapper.toDTO(task.getUserStory()));
            }
        }

        return dto;
    }

    public static Task toEntity(TaskDTO dto) {
        if (dto == null) {
            return null;
        }

        Task task = new Task();
        task.setName(dto.getName());
        task.setDescription(dto.getDescription());
        task.setTimeEstimate(dto.getTimeEstimate());
        task.setStatus(dto.getStatus());
        task.setStartDate(dto.getStartDate());
        task.setEndDate(dto.getEndDate());
        task.setDeliveryDate(dto.getDeliveryDate());

        return task;
    }

    public static Set<TaskDTO> toDTOSet(Set<Task> tasks) {
        if (tasks == null) {
            return new HashSet<>();
        }
        return tasks.stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toSet());
    }

    public static List<TaskDTO> toDTOList(List<Task> tasks) {
        if (tasks == null) {
            return new java.util.ArrayList<>();
        }
        return tasks.stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    public static Set<Task> toEntitySet(Set<TaskDTO> dtos) {
        if (dtos == null) {
            return new HashSet<>();
        }
        return dtos.stream()
                .map(TaskMapper::toEntity)
                .collect(Collectors.toSet());
    }
}