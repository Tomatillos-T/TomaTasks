package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.Sprint;
import com.springboot.TomaTask.repository.SprintRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SprintService {

    private final SprintRepository sprintRepository;

    public SprintService(SprintRepository sprintRepository) {
        this.sprintRepository = sprintRepository;
    }

    public List<Sprint> getAllSprints() {
        return sprintRepository.findAll();
    }

    public Sprint getSprintById(String id) {
        return sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint no encontrado"));
    }

    public Sprint createSprint(Sprint sprint) {
        if (sprint.getProjectId() == null || sprint.getProjectId().isEmpty()) {
            throw new RuntimeException("El projectId es obligatorio");
        }
        return sprintRepository.save(sprint);
    }

    public Sprint updateSprint(String id, Sprint details) {
        Sprint sprint = getSprintById(id);

        sprint.setDescription(details.getDescription());
        sprint.setStatus(details.getStatus());
        sprint.setStartDate(details.getStartDate());
        sprint.setEndDate(details.getEndDate());
        sprint.setDeliveryDate(details.getDeliveryDate());
        sprint.setProjectId(details.getProjectId());

        return sprintRepository.save(sprint);
    }

    public void deleteSprint(String id) {
        sprintRepository.deleteById(id);
    }
}
