package com.springboot.TomaTask.config;

import com.springboot.TomaTask.model.UserRole;
import com.springboot.TomaTask.repository.UserRoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initRoles(UserRoleRepository userRoleRepository) {
        return args -> {
            // Crear rol USER si no existe
            if (userRoleRepository.findAll().stream().noneMatch(r -> r.getRole().equals("USER"))) {
                UserRole userRole = new UserRole("USER");
                userRoleRepository.save(userRole);
            }

            // Crear rol ADMIN si no existe
            if (userRoleRepository.findAll().stream().noneMatch(r -> r.getRole().equals("ADMIN"))) {
                UserRole adminRole = new UserRole("ADMIN");
                userRoleRepository.save(adminRole);
            }

            System.out.println("Roles inicializados correctamente");
        };
    }
}
