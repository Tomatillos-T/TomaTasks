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
            if (userRoleRepository.count() == 0) {
                UserRole adminRole = new UserRole("ADMIN");
                UserRole userRole = new UserRole("USER");
                
                userRoleRepository.save(adminRole);
                userRoleRepository.save(userRole);
                
                System.out.println("✓ Roles inicializados: ADMIN y USER");
            } else {
                System.out.println("✓ Roles ya existentes en la base de datos");
            }
        };
    }
}