package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.CreateUserRequest;
import com.springboot.TomaTask.dto.PaginationRequestDTO;
import com.springboot.TomaTask.dto.UserDTO;
import com.springboot.TomaTask.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @PostMapping("/search")
    public ResponseEntity<Page<UserDTO>> searchUsers(@RequestBody PaginationRequestDTO request) {
        Page<UserDTO> dtoPage = userService.searchUsers(request);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @GetMapping("/without-team")
    public ResponseEntity<List<UserDTO>> getUsersWithoutTeam() {
        return ResponseEntity.ok(userService.getUsersWithoutTeam());
    }

    @PostMapping
    public ResponseEntity<UserDTO> addUser(@RequestBody CreateUserRequest request) {
        try {
            UserDTO savedUser = userService.addUser(request);
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.set("location", savedUser.getId());
            responseHeaders.set("Access-Control-Expose-Headers", "location");
            return ResponseEntity.ok().headers(responseHeaders).body(savedUser);
        } catch (Exception e) {
            e.printStackTrace(); // Para ver el error
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO userDTO, @PathVariable String id) {
        try {
            UserDTO updatedUser = userService.updateUserDTO(id, userDTO);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Boolean> deleteUser(@PathVariable String id) {
        Boolean flag = userService.deleteUser(id);
        return new ResponseEntity<>(flag, flag ? HttpStatus.OK : HttpStatus.NOT_FOUND);
    }
}
