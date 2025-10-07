package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.UserRole;
import com.springboot.TomaTask.repository.UserRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
@Transactional
public class UserRoleService {

    private final UserRoleRepository userRoleRepository;

    public UserRoleService(UserRoleRepository userRoleRepository) {
        this.userRoleRepository = userRoleRepository;
    }

    /**
     * Creates a new UserRole.
     *
     * @param userRole the role to be created
     * @return the persisted UserRole entity
     */
    public UserRole createUserRole(UserRole userRole) {
        return userRoleRepository.save(userRole);
    }

    /**
     * Retrieves all user roles.
     *
     * @return a list of UserRole entities
     */
    public List<UserRole> getAllUserRoles() {
        return userRoleRepository.findAll();
    }

    /**
     * Retrieves a UserRole by its ID.
     *
     * @param id the role ID
     * @return the found UserRole entity
     * @throws EntityNotFoundException if the role is not found
     */
    public UserRole getUserRoleById(String id) {
        return userRoleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User role not found with ID: " + id));
    }

    /**
     * Updates an existing UserRole.
     *
     * @param id the ID of the role to update
     * @param updatedRole the updated role data
     * @return the updated UserRole entity
     * @throws EntityNotFoundException if the role is not found
     */
    public UserRole updateUserRole(String id, UserRole updatedRole) {
        UserRole existingRole = getUserRoleById(id);
        existingRole.setRole(updatedRole.getRole());
        return userRoleRepository.save(existingRole);
    }

    /**
     * Deletes a UserRole by its ID.
     *
     * @param id the role ID
     * @throws EntityNotFoundException if the role is not found
     */
    public void deleteUserRole(String id) {
        UserRole existingRole = getUserRoleById(id);
        userRoleRepository.delete(existingRole);
    }
}
