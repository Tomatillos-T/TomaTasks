package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.UserDTO;
import com.springboot.TomaTask.mapper.UserMapper;
import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserDTO> findAll() {
        return UserMapper.toDTOSet(userRepository.findAll().stream().collect(java.util.stream.Collectors.toSet()))
                .stream().collect(java.util.stream.Collectors.toList());
    }

    public ResponseEntity<UserDTO> getUserById(String id) {
        Optional<User> userData = userRepository.findById(id);
        if (userData.isPresent()) {
            return new ResponseEntity<>(UserMapper.toDTO(userData.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public User addUser(User user) {
        return userRepository.save(user);
    }

    public UserDTO addUserDTO(UserDTO userDTO) {
        User user = UserMapper.toEntity(userDTO);
        User savedUser = userRepository.save(user);
        return UserMapper.toDTO(savedUser);
    }

    public boolean deleteUser(String id) {
        try {
            userRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public User updateUser(String id, User updatedUserData) {
        Optional<User> existingUserOpt = userRepository.findById(id);

        if (existingUserOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + id);
        }

        User existingUser = existingUserOpt.get();
        existingUser.setFirstName(updatedUserData.getFirstName());
        existingUser.setLastName(updatedUserData.getLastName());
        existingUser.setEmail(updatedUserData.getEmail());
        existingUser.setPhoneNumber(updatedUserData.getPhoneNumber());
        existingUser.setPassword(updatedUserData.getPassword());

        return userRepository.save(existingUser);
    }

    @Transactional
    public UserDTO updateUserDTO(String id, UserDTO userDTO) {
        Optional<User> existingUserOpt = userRepository.findById(id);

        if (existingUserOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + id);
        }

        User existingUser = existingUserOpt.get();
        existingUser.setFirstName(userDTO.getFirstName());
        existingUser.setLastName(userDTO.getLastName());
        existingUser.setEmail(userDTO.getEmail());
        existingUser.setPhoneNumber(userDTO.getPhoneNumber());

        User updatedUser = userRepository.save(existingUser);
        return UserMapper.toDTO(updatedUser);
    }

    @Transactional
    public User generateTelegramToken(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        User user = userOpt.get();
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        user.setTelegramToken(token);
        return userRepository.save(user);
    }

    @Transactional
    public User validateTelegramToken(String token, String chatId) {
        Optional<User> userOpt = userRepository.findByTelegramToken(token);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid Telegram token");
        }

        User user = userOpt.get();
        user.setTelegramToken(null);

        return userRepository.save(user);
    }
}
