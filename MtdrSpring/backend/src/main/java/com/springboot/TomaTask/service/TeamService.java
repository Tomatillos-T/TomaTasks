package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.TeamDTO;
import com.springboot.TomaTask.dto.UserDTO;
import com.springboot.TomaTask.mapper.TeamMapper;
import com.springboot.TomaTask.mapper.UserMapper;
import com.springboot.TomaTask.model.Project;
import com.springboot.TomaTask.model.Team;
import com.springboot.TomaTask.repository.ProjectRepository;
import com.springboot.TomaTask.repository.TeamRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class TeamService {
    private final TeamRepository teamRepository;
    private final ProjectRepository projectRepository;

    public TeamService(TeamRepository teamRepository,
            ProjectRepository projectRepository) {
        this.teamRepository = teamRepository;
        this.projectRepository = projectRepository;
    }

    public List<TeamDTO> getAllTeams() {
        return TeamMapper.toDTOList(teamRepository.findAll());
    }

    public TeamDTO getTeamById(String id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found with ID: " + id));
        return TeamMapper.toDTOWithNested(team, true); // Incluye members
    }

    public Set<UserDTO> getTeamMembers(String teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with ID: " + teamId));

        if (team.getMembers() == null || team.getMembers().isEmpty()) {
            return new HashSet<>();
        }

        return team.getMembers().stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toSet());
    }

    public TeamDTO createTeam(TeamDTO teamDTO) {
        if (teamDTO.getName() == null || teamDTO.getName().trim().isEmpty()) {
            throw new RuntimeException("Team name is required");
        }

        Team team = TeamMapper.toEntity(teamDTO);

        // Set Project (opcional)
        if (teamDTO.getProjectId() != null && !teamDTO.getProjectId().isBlank()) {
            Project project = projectRepository.findById(teamDTO.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found with ID: " + teamDTO.getProjectId()));

            // Validar que el proyecto no esté asignado a otro equipo
            if (teamRepository.findByProject(project).isPresent()) {
                throw new RuntimeException("Project is already associated with a team");
            }

            team.setProject(project);
        } else {
            team.setProject(null);
        }

        Team savedTeam = teamRepository.save(team);
        return TeamMapper.toDTOWithNested(savedTeam, true);
    }

    public TeamDTO updateTeam(String id, TeamDTO teamDTO) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found with ID: " + id));

        team.setName(teamDTO.getName());
        team.setDescription(teamDTO.getDescription());
        team.setStatus(teamDTO.getStatus());

        // Update Project
        if (teamDTO.getProjectId() != null) {
            Project project = projectRepository.findById(teamDTO.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found with ID: " + teamDTO.getProjectId()));

            // Check if the new project is already assigned to another team
            teamRepository.findByProject(project).ifPresent(existingTeam -> {
                if (!existingTeam.getId().equals(id)) {
                    throw new RuntimeException("Project is already associated with another team");
                }
            });

            team.setProject(project);
        }

        Team updatedTeam = teamRepository.save(team);
        return TeamMapper.toDTOWithNested(updatedTeam, true);
    }

    public void deleteTeam(String id) {
        teamRepository.deleteById(id);
    }

    public TeamDTO getTeamByProjectId(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with ID: " + projectId));
        Team team = teamRepository.findByProject(project)
                .orElseThrow(() -> new RuntimeException("No team found for this project"));
        return TeamMapper.toDTOWithNested(team, true);
    }
}
