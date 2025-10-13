package com.springboot.TomaTask.service;

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

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
    }

    public Project createProject(Project project) {
        if (project.getName() == null || project.getName().trim().isEmpty()) {
            throw new RuntimeException("El nombre del proyecto es obligatorio");
        }
        return projectRepository.save(project);
    }

    public Project updateProject(String id, Project details) {
        Project project = getProjectById(id);

        project.setName(details.getName());
        project.setDescription(details.getDescription());
        project.setStatus(details.getStatus());
        project.setStartDate(details.getStartDate());
        project.setDeliveryDate(details.getDeliveryDate());
        project.setEndDate(details.getEndDate());

        return projectRepository.save(project);
    }

    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }
}
