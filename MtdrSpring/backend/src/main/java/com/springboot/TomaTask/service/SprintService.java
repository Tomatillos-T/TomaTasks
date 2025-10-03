package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.Sprint;
import com.springboot.TomaTask.model.Project;
import com.springboot.TomaTask.repository.ProjectRepository;
import com.springboot.TomaTask.repository.SprintRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SprintService {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;

    public SprintService(SprintRepository sprintRepository, ProjectRepository projectRepository) {
        this.sprintRepository = sprintRepository;
        this.projectRepository = projectRepository;
    }

    public List<Sprint> getAllSprints() {
        return sprintRepository.findAll();
    }

    public Sprint getSprintById(String id) {
        return sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint no encontrado"));
    }

    public Sprint createSprint(Sprint sprint) {
        if (sprint.getProject() != null && sprint.getProject().getId() != null) {
            Project project = projectRepository.findById(sprint.getProject().getId())
                    .orElseThrow(() -> new RuntimeException("Project no encontrado"));
            sprint.setProject(project);
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

        if (details.getProject() != null && details.getProject().getId() != null) {
            Project project = projectRepository.findById(details.getProject().getId())
                    .orElseThrow(() -> new RuntimeException("Project no encontrado"));
            sprint.setProject(project);
        }

        return sprintRepository.save(sprint);
    }

    public void deleteSprint(String id) {
        sprintRepository.deleteById(id);
    }
}
