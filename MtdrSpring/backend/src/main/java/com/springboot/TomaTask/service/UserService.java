package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository UserRepository;

    public List<User> findAll() {
        List<User> Users = UserRepository.findAll();
        return Users;
    }

    public ResponseEntity<User> getUserById(String id) {
        Optional<User> todoData = UserRepository.findById(id);
        if (todoData.isPresent()) {
            return new ResponseEntity<>(todoData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public User findByEmail(String email) {
        return UserRepository.findByEmail(email).orElse(null);
    }

    public boolean emailExsist(String email) {
        return UserRepository.findByEmail(email).isPresent();
    }

    public User addUser(User User) {
        return UserRepository.save(User);
    }

    public boolean deleteUser(String id) {
        try {
            UserRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public User updateUser(String id, User updatedUserData) {
        Optional<User> existingUserOpt = UserRepository.findById(id);

        if (existingUserOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + id);
        }

        User existingUser = existingUserOpt.get();

        // Update only mutable fields
        existingUser.setFirstName(updatedUserData.getFirstName());
        existingUser.setLastName(updatedUserData.getLastName());
        existingUser.setEmail(updatedUserData.getEmail());
        existingUser.setPhoneNumber(updatedUserData.getPhoneNumber());
        existingUser.setPassword(updatedUserData.getPassword());

        // updatedAt is automatically handled by @UpdateTimestamp
        return UserRepository.save(existingUser);
    }

}
