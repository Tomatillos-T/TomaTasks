package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.model.Task;
import com.springboot.TomaTask.service.TaskService;
import com.springboot.TomaTask.mapper.TaskMapper;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Obtener todas las tareas como DTOs
    @GetMapping
    public List<TaskDTO> getAllTasks() {
        return taskService.getAllTasks();
    }

    // Obtener tarea por id como DTO
    @GetMapping("/{id}")
    public TaskDTO getTaskById(@PathVariable String id) {
        Task task = taskService.getTaskById(id);
        return TaskMapper.toDTO(task);
    }

    // Crear tarea (recibe Task y devuelve DTO)
    @PostMapping
    public TaskDTO createTask(@RequestBody Task task) {
        Task savedTask = taskService.createTask(task);
        return TaskMapper.toDTO(savedTask);
    }

    // Actualizar tarea (recibe Task y devuelve DTO)
    @PutMapping("/{id}")
    public TaskDTO updateTask(@PathVariable String id, @RequestBody Task taskDetails) {
        Task updatedTask = taskService.updateTask(id, taskDetails);
        return TaskMapper.toDTO(updatedTask);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
    }
}
