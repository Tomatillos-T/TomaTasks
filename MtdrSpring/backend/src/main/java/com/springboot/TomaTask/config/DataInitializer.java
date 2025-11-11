package com.springboot.TomaTask.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.springboot.TomaTask.model.*;
import com.springboot.TomaTask.model.Task.Status;
import com.springboot.TomaTask.model.User.UserRole;
import com.springboot.TomaTask.repository.*;

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private void assignUser(String email, Team team) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setTeam(team);
            team.getMembers().add(user);
            userRepository.save(user);
        });
    }

    @Bean
    CommandLineRunner initData(
        ProjectRepository projectRepository,
        SprintRepository sprintRepository,
        TaskRepository taskRepository,
        TeamRepository teamRepository,
        PasswordEncoder passwordEncoder
    ) {

        return args -> {
            logger.info("🚀 Iniciando seeding de roles, usuarios, proyectos, sprints, equipos y tareas...");

            // ========== USERS ==========
            User adrianUser = userRepository.findByEmail("admin@tomatask.com")
                .orElseGet(() -> userRepository.save(new User(
                    "Adrián", "Treviño", "admin@tomatask.com",
                    "+52 811-123-4567", passwordEncoder.encode("admin123"),
                    UserRole.ROLE_ADMIN, null)));

            User kaledUser = userRepository.findByEmail("kaled.enriquez@tomatask.com")
                .orElseGet(() -> userRepository.save(new User(
                    "Kaled", "Enriquez", "kaled.enriquez@tomatask.com",
                    "+52 811-000-0001", passwordEncoder.encode("user123"),
                    UserRole.ROLE_DEVELOPER, null)));

            User cesarUser = userRepository.findByEmail("cesar.martinez@tomatask.com")
                .orElseGet(() -> userRepository.save(new User(
                    "César", "Martínez", "cesar.martinez@tomatask.com",
                    "+52 811-000-0002", passwordEncoder.encode("user123"),
                    UserRole.ROLE_DEVELOPER, null)));

            User isaacUser = userRepository.findByEmail("isaac.enriquez@tomatask.com")
                .orElseGet(() -> userRepository.save(new User(
                    "Isaac", "Enríquez", "isaac.enriquez@tomatask.com",
                    "+52 811-000-0003", passwordEncoder.encode("user123"),
                    UserRole.ROLE_DEVELOPER, null)));

            User arthurUser = userRepository.findByEmail("arthur.vigier@tomatask.com")
                .orElseGet(() -> userRepository.save(new User(
                    "Arthur", "Vigier", "arthur.vigier@tomatask.com",
                    "+52 811-000-0004", passwordEncoder.encode("user123"),
                    UserRole.ROLE_DEVELOPER, null)));

            User ranferiUser = userRepository.findByEmail("ranferi.marquez@tomatask.com")
                .orElseGet(() -> userRepository.save(new User(
                    "Ranferi", "Márquez", "ranferi.marquez@tomatask.com",
                    "+52 811-000-0005", passwordEncoder.encode("user123"),
                    UserRole.ROLE_DEVELOPER, null)));

            // ========== PROJECTS ==========
            if (projectRepository.count() == 0) {
                Project project1 = new Project(
                    "Sistema de Gestión TomaTask",
                    "Plataforma para administración de tareas y roles empresariales.",
                    "EN_PROGRESO",
                    LocalDate.of(2025, 1, 15),
                    LocalDate.of(2025, 12, 31),
                    null);

                Project project2 = new Project(
                    "Portal de Clientes",
                    "Sitio web para clientes con autenticación y seguimiento de proyectos.",
                    "PLANIFICADO",
                    LocalDate.of(2025, 5, 1),
                    LocalDate.of(2026, 2, 28),
                    null);

                Project project3 = new Project(
                    "Aplicación Móvil TomaTask",
                    "Versión móvil del sistema con funcionalidades offline.",
                    "EN_PRUEBAS",
                    LocalDate.of(2024, 9, 1),
                    LocalDate.of(2025, 6, 30),
                    null);

                projectRepository.save(project1);
                projectRepository.save(project2);
                projectRepository.save(project3);

                logger.info("✓ Proyectos insertados");

                // ========== TEAMS ==========
                Team team1 = new Team(
                    "Backend Team",
                    "Equipo encargado del desarrollo del backend",
                    "ACTIVO",
                    project1
                );
                teamRepository.save(team1);

                Team team2 = new Team(
                    "Frontend Team",
                    "Equipo encargado del desarrollo del frontend",
                    "ACTIVO",
                    project2
                );
                teamRepository.save(team2);

                Team team3 = new Team(
                    "Mobile Team",
                    "Equipo encargado del desarrollo móvil",
                    "ACTIVO",
                    project3
                );
                teamRepository.save(team3);

                logger.info("✓ Equipos insertados");

                // Asignar usuarios a equipos
                assignUser("kaled.enriquez@tomatask.com", team1);
                assignUser("cesar.martinez@tomatask.com", team1);
                assignUser("isaac.enriquez@tomatask.com", team2);
                assignUser("arthur.vigier@tomatask.com", team2);
                assignUser("ranferi.marquez@tomatask.com", team3);

                logger.info("✓ Usuarios asignados a equipos");

                // ========== SPRINTS ==========
                Sprint sprint1 = new Sprint(
                    "Sprint 1 - Configuración inicial del backend",
                    "FINALIZADO",
                    LocalDate.of(2025, 1, 15),
                    LocalDate.of(2025, 1, 31),
                    LocalDate.of(2025, 2, 1),
                    project1);

                Sprint sprint2 = new Sprint(
                    "Sprint 2 - Autenticación y permisos",
                    "EN_PROGRESO",
                    LocalDate.of(2025, 2, 1),
                    LocalDate.of(2025, 2, 20),
                    null,
                    project1);

                sprintRepository.save(sprint1);
                sprintRepository.save(sprint2);
                logger.info("✓ Sprints insertados");

                // ========== TASKS ==========
                Task task1 = new Task("HU01 - Diseño de UI", 3,
                    "Hacer wireframes de TomaTask project planner.",
                    Status.DONE, null, sprint2, kaledUser,
                    LocalDate.of(2025, 9, 22), LocalDate.of(2025, 9, 24), null);

                Task task2 = new Task("HU01 - Crear formulario de inicio de sesión", 2,
                    "Campo de contraseña e inicio de sesión.",
                    Status.DONE, null, sprint2, cesarUser,
                    LocalDate.of(2025, 9, 23), LocalDate.of(2025, 9, 25), null);

                taskRepository.save(task1);
                taskRepository.save(task2);

                logger.info("✓ Tareas insertadas");
            }

            logger.info("✅ Seeding finalizado.");
        };
    }
}