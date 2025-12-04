package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.PaginationRequestDTO;
import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.service.TaskService;
import com.springboot.TomaTask.mapper.TaskMapper;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    // Obtener todas las tareas paginadas como DTOs
    @PostMapping("/search")
    public ResponseEntity<Page<TaskDTO>> searchTasks(@RequestBody PaginationRequestDTO request) {
        Page<TaskDTO> dtoPage = taskService.searchTasks(request);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable String id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(taskDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable String id, @RequestBody TaskDTO taskDTO) {
        return ResponseEntity.ok(taskService.updateTask(id, taskDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sprint/{sprintId}")
    public ResponseEntity<List<TaskDTO>> getTasksBySprintId(@PathVariable String sprintId) {
        return ResponseEntity.ok(taskService.getTasksBySprintId(sprintId));
    }

    @GetMapping("/assignee/{assigneeId}")
    public ResponseEntity<List<TaskDTO>> getTasksByAssigneeId(@PathVariable String assigneeId) {
        return ResponseEntity.ok(taskService.getTasksByAssigneeId(assigneeId));
    }

    /**
     * Get all completed tasks for a specific sprint
     * @param sprintId the ID of the sprint
     * @return HTTP 200 with list of completed tasks (DONE status)
     */
    @GetMapping("/sprint/{sprintId}/completed")
    public ResponseEntity<List<TaskDTO>> getCompletedTasksBySprintId(@PathVariable String sprintId) {
        return ResponseEntity.ok(taskService.getCompletedTasksBySprintId(sprintId));
    }

    /**
     * Get all completed tasks for a specific user in a specific sprint
     * @param sprintId the ID of the sprint
     * @param userId the ID of the user (assignee)
     * @return HTTP 200 with list of completed tasks (DONE status) for the user in the sprint
     */
    @GetMapping("/sprint/{sprintId}/user/{userId}/completed")
    public ResponseEntity<List<TaskDTO>> getCompletedTasksBySprintAndUser(
            @PathVariable String sprintId,
            @PathVariable String userId) {
        return ResponseEntity.ok(taskService.getCompletedTasksBySprintIdAndUserId(sprintId, userId));
    }
}
