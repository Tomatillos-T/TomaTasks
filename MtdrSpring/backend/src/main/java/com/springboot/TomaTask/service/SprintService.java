package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.SprintDTO;
import com.springboot.TomaTask.mapper.SprintMapper;
import com.springboot.TomaTask.model.Project;
import com.springboot.TomaTask.model.Sprint;
import com.springboot.TomaTask.repository.ProjectRepository;
import com.springboot.TomaTask.repository.SprintRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SprintService {
    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;

    public SprintService(SprintRepository sprintRepository,
                        ProjectRepository projectRepository) {
        this.sprintRepository = sprintRepository;
        this.projectRepository = projectRepository;
    }

    public List<SprintDTO> getAllSprints() {
        return SprintMapper.toDTOList(sprintRepository.findAll());
    }

    public SprintDTO getSprintById(String id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found with ID: " + id));
        return SprintMapper.toDTOWithNested(sprint, true);
    }

    public SprintDTO createSprint(SprintDTO sprintDTO) {
        Sprint sprint = SprintMapper.toEntity(sprintDTO);

        // Set Project
        if (sprintDTO.getProjectId() != null) {
            Project project = projectRepository.findById(sprintDTO.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found with ID: " + sprintDTO.getProjectId()));
            sprint.setProject(project);
        } else {
            throw new RuntimeException("Project ID is required");
        }

        Sprint savedSprint = sprintRepository.save(sprint);
        return SprintMapper.toDTOWithNested(savedSprint, true);
    }

    public SprintDTO updateSprint(String id, SprintDTO sprintDTO) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found with ID: " + id));

        sprint.setDescription(sprintDTO.getDescription());
        sprint.setStatus(sprintDTO.getStatus());
        sprint.setStartDate(sprintDTO.getStartDate());
        sprint.setEndDate(sprintDTO.getEndDate());
        sprint.setDeliveryDate(sprintDTO.getDeliveryDate());

        // Update Project
        if (sprintDTO.getProjectId() != null) {
            Project project = projectRepository.findById(sprintDTO.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found with ID: " + sprintDTO.getProjectId()));
            sprint.setProject(project);
        }

        Sprint updatedSprint = sprintRepository.save(sprint);
        return SprintMapper.toDTOWithNested(updatedSprint, true);
    }

    public void deleteSprint(String id) {
        sprintRepository.deleteById(id);
    }

    public List<SprintDTO> getSprintsByProjectId(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with ID: " + projectId));
        return SprintMapper.toDTOList(project.getSprints().stream().toList());
    }
}
