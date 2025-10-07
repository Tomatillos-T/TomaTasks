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
        
        // Si se proporciona un rol, buscarlo por nombre
        if (input.getRole() != null && !input.getRole().isEmpty()) {
            String roleName = input.getRole().toUpperCase();
            assignedRole = userRoleRepository.findAll().stream()
                    .filter(r -> r.getRole().equals(roleName))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Rol '" + roleName + "' no encontrado"));
        } else {
            // Si no se proporciona rol, asignar USER por defecto
            assignedRole = userRoleRepository.findAll().stream()
                    .filter(r -> r.getRole().equals("USER"))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Rol por defecto USER no encontrado"));
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
