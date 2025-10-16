package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.UserRoleDTO;
import com.springboot.TomaTask.mapper.UserRoleMapper;
import com.springboot.TomaTask.model.UserRole;
import com.springboot.TomaTask.repository.UserRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserRoleService {

    private final UserRoleRepository userRoleRepository;

    public UserRoleService(UserRoleRepository userRoleRepository) {
        this.userRoleRepository = userRoleRepository;
    }

    public UserRoleDTO createUserRole(UserRoleDTO userRoleDTO) {
        UserRole role = UserRoleMapper.toEntity(userRoleDTO);
        UserRole savedRole = userRoleRepository.save(role);
        return UserRoleMapper.toDTO(savedRole);
    }

    public List<UserRoleDTO> getAllUserRoles() {
        return userRoleRepository.findAll().stream()
                .map(UserRoleMapper::toDTO)
                .collect(Collectors.toList());
    }

    public UserRoleDTO getUserRoleById(String id) {
        UserRole role = userRoleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User role not found with ID: " + id));
        return UserRoleMapper.toDTO(role);
    }

    public UserRoleDTO updateUserRole(String id, UserRoleDTO updatedRoleDTO) {
        UserRole existingRole = userRoleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User role not found with ID: " + id));
        
        existingRole.setRole(updatedRoleDTO.getRole());
        UserRole updatedRole = userRoleRepository.save(existingRole);
        return UserRoleMapper.toDTO(updatedRole);
    }

    public void deleteUserRole(String id) {
        UserRole existingRole = userRoleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User role not found with ID: " + id));
        userRoleRepository.delete(existingRole);
    }
}
