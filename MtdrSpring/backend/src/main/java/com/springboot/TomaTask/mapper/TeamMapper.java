
package com.springboot.TomaTask.mapper;

import com.springboot.TomaTask.dto.TeamDTO;
import com.springboot.TomaTask.model.Team;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class TeamMapper {

    public static TeamDTO toDTO(Team team) {
        return toDTOWithNested(team, false);
    }

    public static TeamDTO toDTOBasic(Team team) {
        if (team == null) {
            return null;
        }

        TeamDTO dto = new TeamDTO();
        dto.setId(team.getId());
        dto.setName(team.getName());
        dto.setDescription(team.getDescription());
        dto.setStatus(team.getStatus());
        dto.setCreatedAt(team.getCreatedAt());
        dto.setUpdatedAt(team.getUpdatedAt());

        if (team.getProject() != null) {
            dto.setProjectId(team.getProject().getId());
        }

        return dto;
    }

    public static TeamDTO toDTOWithNested(Team team, boolean includeNested) {
        if (team == null) {
            return null;
        }

        TeamDTO dto = toDTOBasic(team);

        if (includeNested && team.getMembers() != null && !team.getMembers().isEmpty()) {
            dto.setMembers(team.getMembers().stream()
                    .map(UserMapper::toDTO)
                    .collect(Collectors.toSet()));
        }

        return dto;
    }

    public static Team toEntity(TeamDTO dto) {
        if (dto == null) {
            return null;
        }

        Team team = new Team(dto.getId());
        team.setName(dto.getName());
        team.setDescription(dto.getDescription());
        team.setStatus(dto.getStatus());

        return team;
    }

    public static Set<TeamDTO> toDTOSet(Set<Team> teams) {
        if (teams == null) {
            return new HashSet<>();
        }
        return teams.stream()
                .map(TeamMapper::toDTO)
                .collect(Collectors.toSet());
    }

    public static List<TeamDTO> toDTOList(List<Team> teams) {
        if (teams == null) {
            return new java.util.ArrayList<>();
        }
        return teams.stream()
                .map(TeamMapper::toDTO)
                .collect(Collectors.toList());
    }

    public static Set<Team> toEntitySet(Set<TeamDTO> dtos) {
        if (dtos == null) {
            return new HashSet<>();
        }
        return dtos.stream()
                .map(TeamMapper::toEntity)
                .collect(Collectors.toSet());
    }
}
