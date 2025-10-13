package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.SprintDTO;
import com.springboot.TomaTask.service.SprintService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sprints")
public class SprintController {
    private final SprintService sprintService;

    public SprintController(SprintService sprintService) {
        this.sprintService = sprintService;
    }

    @GetMapping
    public ResponseEntity<List<SprintDTO>> getAllSprints() {
        return ResponseEntity.ok(sprintService.getAllSprints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SprintDTO> getSprintById(@PathVariable String id) {
        return ResponseEntity.ok(sprintService.getSprintById(id));
    }

    @PostMapping
    public ResponseEntity<SprintDTO> createSprint(@RequestBody SprintDTO sprintDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sprintService.createSprint(sprintDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SprintDTO> updateSprint(@PathVariable String id, @RequestBody SprintDTO sprintDTO) {
        return ResponseEntity.ok(sprintService.updateSprint(id, sprintDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSprint(@PathVariable String id) {
        sprintService.deleteSprint(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<SprintDTO>> getSprintsByProjectId(@PathVariable String projectId) {
        return ResponseEntity.ok(sprintService.getSprintsByProjectId(projectId));
    }
}
