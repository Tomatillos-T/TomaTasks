package com.springboot.TomaTask.mapper;

import com.springboot.TomaTask.dto.UserRoleDTO;
import com.springboot.TomaTask.model.UserRole;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserRoleMapper {

    public static UserRoleDTO toDTO(UserRole role) {
        if (role == null) {
            return null;
        }

        UserRoleDTO dto = new UserRoleDTO();
        dto.setId(role.getId());
        dto.setRole(role.getRole());

        return dto;
    }

    public static UserRole toEntity(UserRoleDTO dto) {
        if (dto == null) {
            return null;
        }

        UserRole role = new UserRole();
        role.setRole(dto.getRole());

        return role;
    }

    public static UserRole toEntityWithId(UserRoleDTO dto) {
        UserRole role = toEntity(dto);
        if (dto != null && dto.getId() != null) {
            role.setId(dto.getId());
        }
        return role;
    }

    public static Set<UserRoleDTO> toDTOSet(Set<UserRole> roles) {
        if (roles == null) {
            return new HashSet<>();
        }
        return roles.stream()
                .map(UserRoleMapper::toDTO)
                .collect(Collectors.toSet());
    }

    public static Set<UserRole> toEntitySet(Set<UserRoleDTO> dtos) {
        if (dtos == null) {
            return new HashSet<>();
        }
        return dtos.stream()
                .map(UserRoleMapper::toEntity)
                .collect(Collectors.toSet());
    }
}
