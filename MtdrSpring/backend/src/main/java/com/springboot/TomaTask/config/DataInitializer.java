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
import com.springboot.TomaTask.repository.*;

@Configuration
public class DataInitializer {
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initData(
            UserRoleRepository userRoleRepository,
            UserRepository userRepository,
            ProjectRepository projectRepository,
            SprintRepository sprintRepository,
            TaskRepository taskRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            logger.info("🚀 Iniciando seeding de roles, usuarios, proyectos, sprints y tareas...");

            // ========== ROLES ==========
            UserRole adminRole = userRoleRepository.findByRole("ADMIN")
                    .orElseGet(() -> userRoleRepository.save(new UserRole("ADMIN")));

            UserRole userRole = userRoleRepository.findByRole("USER")
                    .orElseGet(() -> userRoleRepository.save(new UserRole("USER")));

            // ========== USERS ==========
            User adminUser = userRepository.findByEmail("admin@tomatask.com")
                    .orElseGet(() -> userRepository.save(new User(
                            "Adrián", "Treviño", "admin@tomatask.com",
                            "+52 811-123-4567", passwordEncoder.encode("admin123"),
                            adminRole, null)));

            User developerUser = userRepository.findByEmail("maria@tomatask.com")
                    .orElseGet(() -> userRepository.save(new User(
                            "María", "García", "maria@tomatask.com",
                            "+52 811-765-4321", passwordEncoder.encode("user123"), userRole,
                            null)));

            // ========== PROJECTS ==========
            if (projectRepository.count() == 0) {
                Project project1 = new Project(
                        "Sistema de Gestión TomaTask",
                        "Plataforma para administración de tareas y roles empresariales.",
                        "EN_PROGRESO",
                        LocalDate.of(2025, 1, 15),
                        LocalDate.of(2025, 12, 31),
                        null, null);

                Project project2 = new Project(
                        "Portal de Clientes",
                        "Sitio web para clientes con autenticación y seguimiento de proyectos.",
                        "PLANIFICADO",
                        LocalDate.of(2025, 5, 1),
                        LocalDate.of(2026, 2, 28),
                        null, null);

                Project project3 = new Project(
                        "Aplicación Móvil TomaTask",
                        "Versión móvil del sistema con funcionalidades offline.",
                        "EN_PRUEBAS",
                        LocalDate.of(2024, 9, 1),
                        LocalDate.of(2025, 6, 30),
                        null, null);

                projectRepository.save(project1);
                projectRepository.save(project2);
                projectRepository.save(project3);

                logger.info("✓ Proyectos inicializados correctamente (3 insertados)");

                // ========== SPRINTS ==========
                Sprint sprint1 = new Sprint(
                        "Sprint 1 - Configuración inicial del backend",
                        "FINALIZADO",
                        LocalDate.of(2025, 1, 15),
                        LocalDate.of(2025, 1, 31),
                        LocalDate.of(2025, 2, 1),
                        project1.getId());

                Sprint sprint2 = new Sprint(
                        "Sprint 2 - Autenticación y permisos",
                        "EN_PROGRESO",
                        LocalDate.of(2025, 2, 1),
                        LocalDate.of(2025, 2, 20),
                        null,
                        project1.getId());

                Sprint sprint3 = new Sprint(
                        "Sprint 1 - Diseño de UI y prototipos",
                        "PLANIFICADO",
                        LocalDate.of(2025, 5, 1),
                        LocalDate.of(2025, 5, 20),
                        null,
                        project2.getId());

                Sprint sprint4 = new Sprint(
                        "Sprint 1 - Implementación offline",
                        "EN_PRUEBAS",
                        LocalDate.of(2024, 9, 5),
                        LocalDate.of(2024, 9, 30),
                        null,
                        project3.getId());

                sprintRepository.save(sprint1);
                sprintRepository.save(sprint2);
                sprintRepository.save(sprint3);
                sprintRepository.save(sprint4);

                logger.info("✓ Sprints inicializados correctamente (4 insertados)");

                // ========== TASKS ==========
                Task task1 = new Task(
                        "Configurar base de datos",
                        8,
                        "Crear esquema inicial y conexión con PostgreSQL",
                        Status.DONE,
                        null, sprint1, adminUser,
                        LocalDate.of(2025, 1, 15),
                        LocalDate.of(2025, 1, 20),
                        LocalDate.of(2025, 1, 20));

                Task task2 = new Task(
                        "Implementar modelo de usuarios",
                        12,
                        "Definir entidad User y relación con roles",
                        Status.DONE,
                        null, sprint1, adminUser,
                        LocalDate.of(2025, 1, 20),
                        LocalDate.of(2025, 1, 28),
                        LocalDate.of(2025, 1, 28));

                Task task3 = new Task(
                        "Diseñar endpoints de autenticación",
                        10,
                        "Agregar login y registro de usuarios",
                        Status.IN_PROGRESS,
                        null, sprint2, developerUser,
                        LocalDate.of(2025, 2, 1),
                        LocalDate.of(2025, 2, 10),
                        null);

                Task task4 = new Task(
                        "Integrar control de permisos",
                        7,
                        "Asignar roles ADMIN y USER en controladores",
                        Status.IN_PROGRESS,
                        null, sprint2, developerUser,
                        LocalDate.of(2025, 2, 11),
                        LocalDate.of(2025, 2, 20),
                        null);

                Task task5 = new Task(
                        "Diseñar mockups del portal",
                        6,
                        "Prototipos en Figma para vistas principales",
                        Status.PENDING,
                        null, sprint3, adminUser,
                        LocalDate.of(2025, 5, 1),
                        LocalDate.of(2025, 5, 10),
                        null);

                Task task6 = new Task(
                        "Implementar sincronización offline",
                        15,
                        "Permitir uso sin conexión y sincronización posterior",
                        Status.TESTING,
                        null, sprint4, null,
                        LocalDate.of(2024, 9, 5),
                        LocalDate.of(2024, 9, 25),
                        null);

                taskRepository.save(task1);
                taskRepository.save(task2);
                taskRepository.save(task3);
                taskRepository.save(task4);
                taskRepository.save(task5);
                taskRepository.save(task6);

                logger.info("✓ Tareas inicializadas correctamente (6 insertadas)");
            } else {
                logger.info("✓ Proyectos, sprints y tareas ya existentes en la base de datos");
            }

            logger.info("✅ Seeding completado correctamente.");
        };
    }
}
