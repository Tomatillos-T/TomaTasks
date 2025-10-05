package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.Project;
import com.springboot.TomaTask.model.Team;
import com.springboot.TomaTask.repository.ProjectRepository;
import com.springboot.TomaTask.repository.TeamRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;

    public ProjectService(ProjectRepository projectRepository, TeamRepository teamRepository) {
        this.projectRepository = projectRepository;
        this.teamRepository = teamRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project no encontrado"));
    }

    public Project createProject(Project project) {
        if (project.getTeam() != null && project.getTeam().getId() != null) {
            Team team = teamRepository.findById(project.getTeam().getId())
                    .orElseThrow(() -> new RuntimeException("Team no encontrado"));
            project.setTeam(team);
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

        if (details.getTeam() != null && details.getTeam().getId() != null) {
            Team team = teamRepository.findById(details.getTeam().getId())
                    .orElseThrow(() -> new RuntimeException("Team no encontrado"));
            project.setTeam(team);
        } else {
            project.setTeam(null);
        }

        return projectRepository.save(project);
    }

    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }
}
