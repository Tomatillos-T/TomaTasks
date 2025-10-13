package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.service.TaskService;
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

    @GetMapping("/user-story/{userStoryId}")
    public ResponseEntity<List<TaskDTO>> getTasksByUserStoryId(@PathVariable String userStoryId) {
        return ResponseEntity.ok(taskService.getTasksByUserStoryId(userStoryId));
    }

    @GetMapping("/assignee/{assigneeId}")
    public ResponseEntity<List<TaskDTO>> getTasksByAssigneeId(@PathVariable String assigneeId) {
        return ResponseEntity.ok(taskService.getTasksByAssigneeId(assigneeId));
    }
}
