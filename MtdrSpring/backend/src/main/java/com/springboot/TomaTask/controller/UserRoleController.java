package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.model.UserRole;
import com.springboot.TomaTask.service.UserRoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/api/user-role")
public class UserRoleController {

    private final UserRoleService userRoleService;

    public UserRoleController(UserRoleService userRoleService) {
        this.userRoleService = userRoleService;
    }

    /**
     * Creates a new user role.
     */
    @PostMapping
    public ResponseEntity<UserRole> createUserRole(@RequestBody UserRole userRole) {
        UserRole createdRole = userRoleService.createUserRole(userRole);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRole);
    }

    /**
     * Retrieves all user roles.
     */
    @GetMapping
    public ResponseEntity<List<UserRole>> getAllUserRoles() {
        return ResponseEntity.ok(userRoleService.getAllUserRoles());
    }

    /**
     * Retrieves a specific user role by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserRole> getUserRoleById(@PathVariable String id) {
        return ResponseEntity.ok(userRoleService.getUserRoleById(id));
    }

    /**
     * Updates a user role by ID.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserRole> updateUserRole(
            @PathVariable String id,
            @RequestBody UserRole updatedRole
    ) {
        return ResponseEntity.ok(userRoleService.updateUserRole(id, updatedRole));
    }

    /**
     * Deletes a user role by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserRole(@PathVariable String id) {
        userRoleService.deleteUserRole(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Global exception handler for entity not found scenarios.
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFoundException(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
