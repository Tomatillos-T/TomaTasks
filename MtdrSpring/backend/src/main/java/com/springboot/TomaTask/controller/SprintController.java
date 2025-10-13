package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.model.Sprint;
import com.springboot.TomaTask.service.SprintService;
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
    public List<Sprint> getAllSprints() {
        return sprintService.getAllSprints();
    }

    @GetMapping("/{id}")
    public Sprint getSprintById(@PathVariable String id) {
        return sprintService.getSprintById(id);
    }

    @PostMapping
    public Sprint createSprint(@RequestBody Sprint sprint) {
        return sprintService.createSprint(sprint);
    }

    @PutMapping("/{id}")
    public Sprint updateSprint(@PathVariable String id, @RequestBody Sprint details) {
        return sprintService.updateSprint(id, details);
    }

    @DeleteMapping("/{id}")
    public void deleteSprint(@PathVariable String id) {
        sprintService.deleteSprint(id);
    }
}
