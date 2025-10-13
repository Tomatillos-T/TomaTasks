package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.UserRoleDTO;
import com.springboot.TomaTask.service.UserRoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/api/user-role")
public class UserRoleController {

    private final UserRoleService userRoleService;

    public UserRoleController(UserRoleService userRoleService) {
        this.userRoleService = userRoleService;
    }

    @PostMapping
    public ResponseEntity<UserRoleDTO> createUserRole(@RequestBody UserRoleDTO userRoleDTO) {
        UserRoleDTO createdRole = userRoleService.createUserRole(userRoleDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRole);
    }

    @GetMapping
    public ResponseEntity<List<UserRoleDTO>> getAllUserRoles() {
        return ResponseEntity.ok(userRoleService.getAllUserRoles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserRoleDTO> getUserRoleById(@PathVariable String id) {
        return ResponseEntity.ok(userRoleService.getUserRoleById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserRoleDTO> updateUserRole(
            @PathVariable String id,
            @RequestBody UserRoleDTO updatedRole) {
        return ResponseEntity.ok(userRoleService.updateUserRole(id, updatedRole));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserRole(@PathVariable String id) {
        userRoleService.deleteUserRole(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFoundException(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
