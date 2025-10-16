package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.PaginationRequestDTO;
import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.model.Task;
import com.springboot.TomaTask.service.TaskService;
import com.springboot.TomaTask.mapper.TaskMapper;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final TaskMapper taskMapper;

    public TaskController(TaskService taskService, TaskMapper taskMapper) {
        this.taskService = taskService;
        this.taskMapper = taskMapper;
    }

    // Obtener todas las tareas como DTOs
    @GetMapping
    public List<TaskDTO> getAllTasks() {
        return taskService.getAllTasks();
    }

    // Obtener todas las tareas paginadas como DTOs
    @PostMapping("/search")
    public Page<TaskDTO> searchTasks(@RequestBody PaginationRequestDTO request) {
        return taskService.searchTasks(request).map(taskMapper::toDTO);
    }

    // Obtener tarea por id como DTO
    @GetMapping("/{id}")
    public TaskDTO getTaskById(@PathVariable String id) {
        Task task = taskService.getTaskById(id);
        return taskMapper.toDTO(task);
    }

    // Crear tarea (recibe Task y devuelve DTO)
    @PostMapping
    public TaskDTO createTask(@RequestBody Task task) {
        Task savedTask = taskService.createTask(task);
        return taskMapper.toDTO(savedTask);
    }

    // Actualizar tarea (recibe Task y devuelve DTO)
    @PutMapping("/{id}")
    public TaskDTO updateTask(@PathVariable String id, @RequestBody Task taskDetails) {
        Task updatedTask = taskService.updateTask(id, taskDetails);
        return taskMapper.toDTO(updatedTask);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
    }
}
