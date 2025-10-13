package com.springboot.TomaTask.mapper;

import com.springboot.TomaTask.dto.UserDTO;
import com.springboot.TomaTask.model.User;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public static UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());

        if (user.getRole() != null) {
            dto.setRole(UserRoleMapper.toDTO(user.getRole()));
        }

        if (user.getTeam() != null) {
            dto.setTeamId(user.getTeam().getId());
        }

        return dto;
    }

    public static User toEntity(UserDTO dto) {
        if (dto == null) {
            return null;
        }

        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());

        return user;
    }

    public static User toEntityWithId(UserDTO dto) {
        User user = toEntity(dto);
        if (dto != null && dto.getId() != null) {
            user.setId(dto.getId());
        }
        return user;
    }

    public static Set<UserDTO> toDTOSet(Set<User> users) {
        if (users == null) {
            return new HashSet<>();
        }
        return users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toSet());
    }

    public static Set<User> toEntitySet(Set<UserDTO> dtos) {
        if (dtos == null) {
            return new HashSet<>();
        }
        return dtos.stream()
                .map(UserMapper::toEntity)
                .collect(Collectors.toSet());
    }
}
