package com.springboot.TomaTask.mapper;

import com.springboot.TomaTask.dto.ProjectDTO;
import com.springboot.TomaTask.model.Project;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ProjectMapper {

    public static ProjectDTO toDTO(Project project) {
        return toDTOWithNested(project, false);
    }

    public static ProjectDTO toDTOBasic(Project project) {
        if (project == null) {
            return null;
        }

        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus());
        dto.setStartDate(project.getStartDate());
        dto.setDeliveryDate(project.getDeliveryDate());
        dto.setEndDate(project.getEndDate());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());

        if (project.getTeam() != null) {
            dto.setTeamId(project.getTeam().getId());
        }

        return dto;
    }

    public static ProjectDTO toDTOWithNested(Project project, boolean includeNested) {
        if (project == null) {
            return null;
        }

        ProjectDTO dto = toDTOBasic(project);

        if (includeNested && project.getSprints() != null && !project.getSprints().isEmpty()) {
            dto.setSprints(project.getSprints().stream()
                    .map(SprintMapper::toDTO)
                    .collect(Collectors.toSet()));
        }

        return dto;
    }

    public static Project toEntity(ProjectDTO dto) {
        if (dto == null) {
            return null;
        }

        Project project = new Project();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStatus(dto.getStatus());
        project.setStartDate(dto.getStartDate());
        project.setDeliveryDate(dto.getDeliveryDate());
        project.setEndDate(dto.getEndDate());

        return project;
    }

    public static Project toEntityWithId(ProjectDTO dto) {
        Project project = toEntity(dto);
        if (dto != null && dto.getId() != null) {
            project.setId(dto.getId());
        }
        return project;
    }

    public static Set<ProjectDTO> toDTOSet(Set<Project> projects) {
        if (projects == null) {
            return new HashSet<>();
        }
        return projects.stream()
                .map(ProjectMapper::toDTO)
                .collect(Collectors.toSet());
    }

    public static List<ProjectDTO> toDTOList(List<Project> projects) {
        if (projects == null) {
            return new java.util.ArrayList<>();
        }
        return projects.stream()
                .map(ProjectMapper::toDTO)
                .collect(Collectors.toList());
    }

    public static Set<Project> toEntitySet(Set<ProjectDTO> dtos) {
        if (dtos == null) {
            return new HashSet<>();
        }
        return dtos.stream()
                .map(ProjectMapper::toEntity)
                .collect(Collectors.toSet());
    }
}
