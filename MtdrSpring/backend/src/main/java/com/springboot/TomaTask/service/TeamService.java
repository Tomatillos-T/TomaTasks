package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.Project;
import com.springboot.TomaTask.model.Team;
import com.springboot.TomaTask.repository.ProjectRepository;
import com.springboot.TomaTask.repository.TeamRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final ProjectRepository projectRepository;

    public TeamService(TeamRepository teamRepository, ProjectRepository projectRepository) {
        this.teamRepository = teamRepository;
        this.projectRepository = projectRepository;
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team getTeamById(String id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
    }

    public Team createTeam(Team team) {
        if (team.getProject() != null && team.getProject().getId() != null) {
            Project existingProject = projectRepository.findById(team.getProject().getId())
                    .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

            if (existingProject.getTeam() != null) {
                throw new RuntimeException("Este proyecto ya está asignado a otro equipo.");
            }

            team.setProject(existingProject);
            existingProject.setTeam(team);
        }

        return teamRepository.save(team);
    }

    public Team updateTeam(String id, Team teamDetails) {
        Team team = getTeamById(id);
        team.setName(teamDetails.getName());
        team.setDescription(teamDetails.getDescription());
        team.setStatus(teamDetails.getStatus());

        if (teamDetails.getProject() != null && teamDetails.getProject().getId() != null) {
            Project existingProject = projectRepository.findById(teamDetails.getProject().getId())
                    .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
            team.setProject(existingProject);
        }

        return teamRepository.save(team);
    }

    public void deleteTeam(String id) {
        teamRepository.deleteById(id);
    }
}
