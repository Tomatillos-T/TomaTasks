package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.mapper.TaskMapper;
import com.springboot.TomaTask.model.Sprint;
import com.springboot.TomaTask.model.Task;
import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.model.UserStory;
import com.springboot.TomaTask.repository.SprintRepository;
import com.springboot.TomaTask.repository.TaskRepository;
import com.springboot.TomaTask.repository.UserRepository;
import com.springboot.TomaTask.repository.UserStoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserStoryRepository userStoryRepository;
    private final SprintRepository sprintRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository,
                       UserStoryRepository userStoryRepository,
                       SprintRepository sprintRepository,
                       UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userStoryRepository = userStoryRepository;
        this.sprintRepository = sprintRepository;
        this.userRepository = userRepository;
    }

    public List<TaskDTO> getAllTasks() {
        return TaskMapper.toDTOList(taskRepository.findAll());
    }

    public TaskDTO getTaskById(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
        return TaskMapper.toDTOWithNested(task, true);
    }

    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = TaskMapper.toEntity(taskDTO);

        // Set UserStory
        if (taskDTO.getUserStoryId() != null) {
            UserStory userStory = userStoryRepository.findById(taskDTO.getUserStoryId())
                    .orElseThrow(() -> new RuntimeException("UserStory not found with ID: " + taskDTO.getUserStoryId()));
            task.setUserStory(userStory);
        }

        // Set Sprint
        if (taskDTO.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(taskDTO.getSprintId())
                    .orElseThrow(() -> new RuntimeException("Sprint not found with ID: " + taskDTO.getSprintId()));
            task.setSprint(sprint);
        }

        // Set Assignee
        if (taskDTO.getAssigneeId() != null) {
            User user = userRepository.findById(taskDTO.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + taskDTO.getAssigneeId()));
            task.setUser(user);
        }

        Task savedTask = taskRepository.save(task);
        return TaskMapper.toDTOWithNested(savedTask, true);
    }

    public TaskDTO updateTask(String id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));

        task.setName(taskDTO.getName());
        task.setDescription(taskDTO.getDescription());
        task.setTimeEstimate(taskDTO.getTimeEstimate());
        task.setStatus(taskDTO.getStatus());
        task.setStartDate(taskDTO.getStartDate());
        task.setEndDate(taskDTO.getEndDate());
        task.setDeliveryDate(taskDTO.getDeliveryDate());

        // Update UserStory
        if (taskDTO.getUserStoryId() != null) {
            UserStory userStory = userStoryRepository.findById(taskDTO.getUserStoryId())
                    .orElseThrow(() -> new RuntimeException("UserStory not found with ID: " + taskDTO.getUserStoryId()));
            task.setUserStory(userStory);
        }

        // Update Sprint
        if (taskDTO.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(taskDTO.getSprintId())
                    .orElseThrow(() -> new RuntimeException("Sprint not found with ID: " + taskDTO.getSprintId()));
            task.setSprint(sprint);
        }

        // Update Assignee
        if (taskDTO.getAssigneeId() != null) {
            User user = userRepository.findById(taskDTO.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + taskDTO.getAssigneeId()));
            task.setUser(user);
        } else {
            task.setUser(null);
        }

        Task updatedTask = taskRepository.save(task);
        return TaskMapper.toDTOWithNested(updatedTask, true);
    }

    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }

    public List<TaskDTO> getTasksBySprintId(String sprintId) {
        return TaskMapper.toDTOList(taskRepository.findBySprintId(sprintId));
    }

    public List<TaskDTO> getTasksByUserStoryId(String userStoryId) {
        return TaskMapper.toDTOList(taskRepository.findByUserStoryId(userStoryId));
    }

    public List<TaskDTO> getTasksByAssigneeId(String assigneeId) {
        return TaskMapper.toDTOList(taskRepository.findByUserId(assigneeId));
    }
}
