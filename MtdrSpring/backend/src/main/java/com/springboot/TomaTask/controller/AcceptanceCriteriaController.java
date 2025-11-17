package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.AcceptanceCriteriaDTO;
import com.springboot.TomaTask.service.AcceptanceCriteriaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/acceptance-criteria")
public class AcceptanceCriteriaController {

    private final AcceptanceCriteriaService acceptanceCriteriaService;

    public AcceptanceCriteriaController(AcceptanceCriteriaService acceptanceCriteriaService) {
        this.acceptanceCriteriaService = acceptanceCriteriaService;
    }

    @GetMapping
    public ResponseEntity<List<AcceptanceCriteriaDTO>> getAllAcceptanceCriteria() {
        return ResponseEntity.ok(acceptanceCriteriaService.getAllAcceptanceCriteria());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcceptanceCriteriaDTO> getAcceptanceCriteriaById(@PathVariable String id) {
        return ResponseEntity.ok(acceptanceCriteriaService.getAcceptanceCriteriaById(id));
    }

    @PostMapping
    public ResponseEntity<AcceptanceCriteriaDTO> createAcceptanceCriteria(@RequestBody AcceptanceCriteriaDTO criteriaDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(acceptanceCriteriaService.createAcceptanceCriteria(criteriaDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcceptanceCriteriaDTO> updateAcceptanceCriteria(
            @PathVariable String id,
            @RequestBody AcceptanceCriteriaDTO criteriaDTO) {
        return ResponseEntity.ok(acceptanceCriteriaService.updateAcceptanceCriteria(id, criteriaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAcceptanceCriteria(@PathVariable String id) {
        acceptanceCriteriaService.deleteAcceptanceCriteria(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user-story/{userStoryId}")
    public ResponseEntity<List<AcceptanceCriteriaDTO>> getAcceptanceCriteriaByUserStoryId(@PathVariable String userStoryId) {
        return ResponseEntity.ok(acceptanceCriteriaService.getAcceptanceCriteriaByUserStoryId(userStoryId));
    }
}
