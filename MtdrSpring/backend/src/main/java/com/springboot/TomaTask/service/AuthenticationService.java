package com.springboot.TomaTask.auth.service;

import com.springboot.TomaTask.auth.dto.LoginUserDto;
import com.springboot.TomaTask.auth.dto.RegisterUserDto;
import com.springboot.TomaTask.model.UserRole;
import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.repository.UserRepository;
import com.springboot.TomaTask.repository.UserRoleRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository userRepository; 
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            UserRoleRepository userRoleRepository 
    ) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.userRoleRepository = userRoleRepository;
    }

public User register(RegisterUserDto input) {
    User user = new User();
    user.setFirstName(input.getFirstName());
    user.setLastName(input.getLastName());
    user.setEmail(input.getEmail());
    user.setPhoneNumber(input.getPhoneNumber());
    user.setPassword(passwordEncoder.encode(input.getPassword()));

    UserRole assignedRole;

    if (input.getRoleId() != null) {
        assignedRole = userRoleRepository.findById(input.getRoleId())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
    } else {
        assignedRole = userRoleRepository.findAll().stream()
                .filter(r -> r.getRole().equals("USER"))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Rol por defecto no encontrado"));
    }

    user.setRole(assignedRole);

    return userRepository.save(user);
}


    public User authenticate(LoginUserDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
