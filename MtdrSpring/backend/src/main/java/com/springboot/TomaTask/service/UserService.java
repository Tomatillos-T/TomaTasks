package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;

import java.util.Base64;

@Service
public class UserService {

    @Autowired
    private UserRepository UserRepository;
    public List<User> findAll(){
        List<User> Users = UserRepository.findAll();
        return Users;
    }

    public ResponseEntity<User> getUserById(String id){
        Optional<User> todoData = UserRepository.findById(id);
        if (todoData.isPresent()){
            return new ResponseEntity<>(todoData.get(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public User addUser(User User){
        return UserRepository.save(User);
    }

    public boolean deleteUser(String id){
        try{
            UserRepository.deleteById(id);
            return true;
        }catch(Exception e){
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

    @Transactional
    public User generateTelegramToken(String userId) {
        Optional<User> userOpt = UserRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        User user = userOpt.get();

        // Generar un token seguro (32 bytes → 43 caracteres base64)
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        user.setTelegramToken(token);
        return UserRepository.save(user);
    }

    @Transactional
    public User validateTelegramToken(String token, String chatId) {
        Optional<User> userOpt = UserRepository.findByTelegramToken(token);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid Telegram token");
        }

        User user = userOpt.get();
        user.setTelegramToken(null);

        return UserRepository.save(user);
    }


}
