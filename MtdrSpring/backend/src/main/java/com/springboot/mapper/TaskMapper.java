package com.springboot.TomaTask.mapper;

import com.springboot.TomaTask.model.Task;
import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.dto.UserDTO;
import com.springboot.TomaTask.dto.SprintDTO;
import com.springboot.TomaTask.dto.UserStoryDTO;

public class TaskMapper {

    public static TaskDTO toDTO(Task task) {
        UserDTO userDTO = null;
        if (task.getUser() != null) {
            userDTO = new UserDTO(task.getUser().getID(), task.getUser().getName());
        }

        SprintDTO sprintDTO = null;
        if (task.getSprint() != null) {
            sprintDTO = new SprintDTO(task.getSprint().getId(), task.getSprint().getDescription());
        }

        UserStoryDTO userStoryDTO = null;
        if (task.getUserStory() != null) {
            userStoryDTO = new UserStoryDTO(task.getUserStory().getId(), task.getUserStory().getName());
        }

        return new TaskDTO(
                task.getId(),
                task.getName(),
                task.getDescription(),
                task.getTimeEstimate(),
                task.getStatus(),
                task.getStartDate(),
                task.getEndDate(),
                task.getDeliveryDate(),
                userDTO,
                sprintDTO,
                userStoryDTO
        );
    }
}
