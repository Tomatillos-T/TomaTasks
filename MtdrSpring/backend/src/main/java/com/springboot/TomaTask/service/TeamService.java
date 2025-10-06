package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.Team;
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
        if (team.getProjectId() == null || team.getProjectId().trim().isEmpty()) {
            throw new RuntimeException("El projectId es obligatorio");
        }
        return teamRepository.save(team);
    }

    public Team updateTeam(String id, Team teamDetails) {
        Team team = getTeamById(id);

        team.setName(teamDetails.getName());
        team.setDescription(teamDetails.getDescription());
        team.setStatus(teamDetails.getStatus());
        team.setProjectId(teamDetails.getProjectId());

        return teamRepository.save(team);
    }

    public void deleteTeam(String id) {
        teamRepository.deleteById(id);
    }

    public List<Team> getTeamsByProjectId(String projectId) {
        return teamRepository.findByProjectId(projectId);
    }
}
