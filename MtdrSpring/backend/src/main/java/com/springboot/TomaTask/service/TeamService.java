package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.Team;
import com.springboot.TomaTask.model.Project;
import com.springboot.TomaTask.repository.TeamRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team getTeamById(String id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
    }

    public Team createTeam(Team team) {
        if (team.getName() == null || team.getName().trim().isEmpty()) {
            throw new RuntimeException("El nombre del equipo es obligatorio");
        }

        Project project = team.getProject();
        if (project == null) {
            throw new RuntimeException("El Project es obligatorio");
        }

        // Verificar que el project no esté ya asociado a otro Team
        if (teamRepository.findByProject(project).isPresent()) {
            throw new RuntimeException("El Project ya está asociado a otro Team");
        }

        return teamRepository.save(team);
    }

    public Team updateTeam(String id, Team teamDetails) {
        Team team = getTeamById(id);

        team.setName(teamDetails.getName());
        team.setDescription(teamDetails.getDescription());
        team.setStatus(teamDetails.getStatus());

        Project project = teamDetails.getProject();
        if (project != null) {
            // Verificar que el nuevo Project no esté asociado a otro Team
            teamRepository.findByProject(project).ifPresent(existingTeam -> {
                if (!existingTeam.getId().equals(id)) {
                    throw new RuntimeException("El Project ya está asociado a otro Team");
                }
            });
            team.setProject(project);
        }

        return teamRepository.save(team);
    }

    public void deleteTeam(String id) {
        teamRepository.deleteById(id);
    }

    public Team getTeamByProject(Project project) {
        return teamRepository.findByProject(project)
                .orElseThrow(() -> new RuntimeException("No existe un Team asociado a este Project"));
    }
}
