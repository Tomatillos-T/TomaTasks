package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.Sprint;
import com.springboot.TomaTask.model.Task;
import com.springboot.TomaTask.model.UserStory;
import com.springboot.TomaTask.repository.SprintRepository;
import com.springboot.TomaTask.repository.TaskRepository;
import com.springboot.TomaTask.repository.UserStoryRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserStoryRepository userStoryRepository;
    private final SprintRepository sprintRepository;

    public TaskService(TaskRepository taskRepository,
                       UserStoryRepository userStoryRepository,
                       SprintRepository sprintRepository) {
        this.taskRepository = taskRepository;
        this.userStoryRepository = userStoryRepository;
        this.sprintRepository = sprintRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(String id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task no encontrada"));
    }

    // Crear task
    public Task createTask(Task task) {
        // Buscar las entidades relacionadas
        if (task.getUserStory() != null && task.getUserStory().getId() != null) {
            UserStory userStory = userStoryRepository.findById(task.getUserStory().getId())
                    .orElseThrow(() -> new RuntimeException("UserStory no encontrada"));
            task.setUserStory(userStory);
        }

        if (task.getSprint() != null && task.getSprint().getId() != null) {
            Sprint sprint = sprintRepository.findById(task.getSprint().getId())
                    .orElseThrow(() -> new RuntimeException("Sprint no encontrado"));
            task.setSprint(sprint);
        }

        return taskRepository.save(task);
    }

    // Actualizar task
    public Task updateTask(String id, Task taskDetails) {
        Task task = getTaskById(id);

        task.setName(taskDetails.getName());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setStartDate(taskDetails.getStartDate());
        task.setEndDate(taskDetails.getEndDate());
        task.setDeliveryDate(taskDetails.getDeliveryDate());

        if (taskDetails.getUserStory() != null && taskDetails.getUserStory().getId() != null) {
            UserStory userStory = userStoryRepository.findById(taskDetails.getUserStory().getId())
                    .orElseThrow(() -> new RuntimeException("UserStory no encontrada"));
            task.setUserStory(userStory);
        }

        if (taskDetails.getSprint() != null && taskDetails.getSprint().getId() != null) {
            Sprint sprint = sprintRepository.findById(taskDetails.getSprint().getId())
                    .orElseThrow(() -> new RuntimeException("Sprint no encontrado"));
            task.setSprint(sprint);
        }

        return taskRepository.save(task);
    }

    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }
}
