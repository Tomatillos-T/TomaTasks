package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.ProjectDTO;
import com.springboot.TomaTask.mapper.ProjectMapper;
import com.springboot.TomaTask.model.Project;
import com.springboot.TomaTask.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectDTO> getAllProjects() {
        return ProjectMapper.toDTOList(projectRepository.findAll());
    }

    public ProjectDTO getProjectById(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with ID: " + id));
        return ProjectMapper.toDTOWithNested(project, true);
    }

    public ProjectDTO createProject(ProjectDTO projectDTO) {
        if (projectDTO.getName() == null || projectDTO.getName().trim().isEmpty()) {
            throw new RuntimeException("Project name is required");
        }

        Project project = ProjectMapper.toEntity(projectDTO);
        Project savedProject = projectRepository.save(project);
        return ProjectMapper.toDTOWithNested(savedProject, true);
    }

    public ProjectDTO updateProject(String id, ProjectDTO projectDTO) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with ID: " + id));

        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDescription());
        project.setStatus(projectDTO.getStatus());
        project.setStartDate(projectDTO.getStartDate());
        project.setDeliveryDate(projectDTO.getDeliveryDate());
        project.setEndDate(projectDTO.getEndDate());

        Project updatedProject = projectRepository.save(project);
        return ProjectMapper.toDTOWithNested(updatedProject, true);
    }

    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }
}
