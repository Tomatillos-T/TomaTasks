package com.springboot.mapper;

import com.springboot.TomaTask.model.Project;
import com.springboot.TomaTask.dto.ProjectDTO;

public class ProjectMapper {

    public static ProjectDTO toDTO(Project project) {
        if (project == null) return null;

        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus());
        dto.setStartDate(project.getStartDate());
        dto.setDeliveryDate(project.getDeliveryDate());
        dto.setEndDate(project.getEndDate());

        return dto;
    }

    public static Project toEntity(ProjectDTO dto) {
        if (dto == null) return null;

        Project project = new Project();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStatus(dto.getStatus());
        project.setStartDate(dto.getStartDate());
        project.setDeliveryDate(dto.getDeliveryDate());
        project.setEndDate(dto.getEndDate());

        return project;
    }
}
