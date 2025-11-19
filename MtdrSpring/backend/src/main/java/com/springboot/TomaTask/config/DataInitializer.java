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
import com.springboot.TomaTask.model.Task.Priority;
import com.springboot.TomaTask.model.Task.Estimation;
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
                        PasswordEncoder passwordEncoder) {

                return args -> {
                        logger.info("🚀 Iniciando seeding de usuarios, proyectos, sprints, equipos y tareas...");

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

                        logger.info("✓ Usuarios insertados");

                        // ========== PROJECTS ==========
                        if (projectRepository.count() == 0) {
                                Project project1 = new Project(
                                                "TomaTask - Sistema de Gestión Ágil",
                                                "Plataforma Cloud Native para administración de proyectos con metodología Scrum/Agile, integración con Telegram y análisis con IA.",
                                                "EN_PROGRESO",
                                                LocalDate.of(2025, 9, 1),
                                                LocalDate.of(2025, 12, 15),
                                                null);

                                projectRepository.save(project1);
                                logger.info("✓ Proyectos insertados");

                                // ========== TEAMS ==========
                                Team fullStackTeam = new Team(
                                                "Equipo TomaTask",
                                                "Equipo de desarrollo full-stack para TomaTask",
                                                "ACTIVO",
                                                project1);
                                teamRepository.save(fullStackTeam);
                                logger.info("✓ Equipos insertados");

                                // Asignar usuarios al equipo
                                assignUser("kaled.enriquez@tomatask.com", fullStackTeam);
                                assignUser("cesar.martinez@tomatask.com", fullStackTeam);
                                assignUser("isaac.enriquez@tomatask.com", fullStackTeam);
                                assignUser("arthur.vigier@tomatask.com", fullStackTeam);
                                assignUser("ranferi.marquez@tomatask.com", fullStackTeam);
                                logger.info("✓ Usuarios asignados a equipos");

                                // ========== SPRINTS ==========
                                Sprint sprint1 = new Sprint(
                                                "Sprint 1 - Autenticación y Configuración Base",
                                                "FINALIZADO",
                                                LocalDate.of(2025, 9, 15),
                                                LocalDate.of(2025, 10, 5),
                                                LocalDate.of(2025, 10, 7),
                                                project1);

                                Sprint sprint2 = new Sprint(
                                                "Sprint 2 - Gestión de Proyectos y Equipos",
                                                "FINALIZADO",
                                                LocalDate.of(2025, 10, 8),
                                                LocalDate.of(2025, 10, 25),
                                                LocalDate.of(2025, 10, 27),
                                                project1);

                                Sprint sprint3 = new Sprint(
                                                "Sprint 3 - Gestión de Tareas y Features Avanzadas",
                                                "EN_PROGRESO",
                                                LocalDate.of(2025, 10, 28),
                                                LocalDate.of(2025, 11, 20),
                                                null,
                                                project1);

                                sprintRepository.save(sprint1);
                                sprintRepository.save(sprint2);
                                sprintRepository.save(sprint3);
                                logger.info("✓ Sprints insertados");

                                // ========== TASKS ==========

                                // Tasks para Sprint 1 - Autenticación
                                Task auth_task1 = new Task(
                                                "Implementar autenticación JWT en backend",
                                                8,
                                                "Configurar Spring Security con JWT para validación de credenciales y generación de tokens",
                                                Status.DONE,
                                                sprint1,
                                                kaledUser,
                                                LocalDate.of(2025, 9, 20),
                                                LocalDate.of(2025, 10, 5),
                                                LocalDate.of(2025, 10, 7));
                                auth_task1.setPriority(Priority.URGENT);
                                auth_task1.setEstimation(Estimation.M);
                                auth_task1.setTimeTaken(9);

                                Task auth_task2 = new Task(
                                                "Crear formulario de login en frontend",
                                                5,
                                                "Diseñar e implementar formulario de inicio de sesión con validación de campos",
                                                Status.DONE,
                                                sprint1,
                                                cesarUser,
                                                LocalDate.of(2025, 9, 22),
                                                LocalDate.of(2025, 10, 4),
                                                LocalDate.of(2025, 10, 6));
                                auth_task2.setPriority(Priority.HIGH);
                                auth_task2.setEstimation(Estimation.S);
                                auth_task2.setTimeTaken(5);

                                Task auth_task3 = new Task(
                                                "Implementar manejo de sesiones y logout",
                                                3,
                                                "Gestionar almacenamiento de token y funcionalidad de cierre de sesión",
                                                Status.DONE,
                                                sprint1,
                                                kaledUser,
                                                LocalDate.of(2025, 9, 25),
                                                LocalDate.of(2025, 10, 3),
                                                LocalDate.of(2025, 10, 5));
                                auth_task3.setPriority(Priority.MODERATE);
                                auth_task3.setEstimation(Estimation.S);
                                auth_task3.setTimeTaken(3);

                                taskRepository.save(auth_task1);
                                taskRepository.save(auth_task2);
                                taskRepository.save(auth_task3);

                                // Tasks para Sprint 2 - Proyectos
                                Task project_task1 = new Task(
                                                "Implementar CRUD de proyectos en backend",
                                                6,
                                                "Crear controllers, services y repositories para gestión de proyectos",
                                                Status.DONE,
                                                sprint2,
                                                cesarUser,
                                                LocalDate.of(2025, 10, 1),
                                                LocalDate.of(2025, 10, 8),
                                                LocalDate.of(2025, 10, 10));
                                project_task1.setPriority(Priority.HIGH);
                                project_task1.setEstimation(Estimation.M);
                                project_task1.setTimeTaken(7);

                                Task project_task2 = new Task(
                                                "Diseñar formulario de creación de proyectos",
                                                4,
                                                "Implementar formulario con validaciones y routing",
                                                Status.DONE,
                                                sprint2,
                                                kaledUser,
                                                LocalDate.of(2025, 10, 2),
                                                LocalDate.of(2025, 10, 6),
                                                LocalDate.of(2025, 10, 8));
                                project_task2.setPriority(Priority.HIGH);
                                project_task2.setEstimation(Estimation.S);
                                project_task2.setTimeTaken(4);

                                Task project_task3 = new Task(
                                                "Conectar frontend con API de proyectos",
                                                3,
                                                "Integrar formulario con endpoints del backend",
                                                Status.DONE,
                                                sprint2,
                                                kaledUser,
                                                LocalDate.of(2025, 10, 7),
                                                LocalDate.of(2025, 10, 10),
                                                LocalDate.of(2025, 10, 12));
                                project_task3.setPriority(Priority.MODERATE);
                                project_task3.setEstimation(Estimation.XS);
                                project_task3.setTimeTaken(2);

                                taskRepository.save(project_task1);
                                taskRepository.save(project_task2);
                                taskRepository.save(project_task3);

                                // Tasks para Sprint 2 - Gestión de Equipos
                                Task team_task1 = new Task(
                                                "Implementar CRUD de equipos en backend",
                                                8,
                                                "Desarrollar endpoints para crear, leer, actualizar y eliminar equipos",
                                                Status.DONE,
                                                sprint2,
                                                kaledUser,
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 22),
                                                LocalDate.of(2025, 10, 24));
                                team_task1.setPriority(Priority.HIGH);
                                team_task1.setEstimation(Estimation.M);
                                team_task1.setTimeTaken(9);

                                Task team_task2 = new Task(
                                                "Implementar gestión de miembros de equipo",
                                                5,
                                                "Funcionalidad para agregar y remover miembros del equipo",
                                                Status.DONE,
                                                sprint2,
                                                arthurUser,
                                                LocalDate.of(2025, 10, 18),
                                                LocalDate.of(2025, 10, 25),
                                                LocalDate.of(2025, 10, 27));
                                team_task2.setPriority(Priority.MODERATE);
                                team_task2.setEstimation(Estimation.S);
                                team_task2.setTimeTaken(6);

                                Task team_task3 = new Task(
                                                "Crear interfaz de gestión de equipos",
                                                6,
                                                "Diseñar página de equipos con tabla y formularios",
                                                Status.DONE,
                                                sprint2,
                                                kaledUser,
                                                LocalDate.of(2025, 11, 8),
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 14));
                                team_task3.setPriority(Priority.HIGH);
                                team_task3.setEstimation(Estimation.M);
                                team_task3.setTimeTaken(5);

                                taskRepository.save(team_task1);
                                taskRepository.save(team_task2);
                                taskRepository.save(team_task3);

                                // Tasks para Sprint 3 - Gestión de Tareas
                                Task task_mgmt1 = new Task(
                                                "Implementar CRUD de tareas con filtros",
                                                10,
                                                "Backend para crear, editar, eliminar tareas con soporte para búsqueda, filtrado, ordenamiento y paginación",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 5),
                                                LocalDate.of(2025, 10, 12),
                                                LocalDate.of(2025, 10, 14));
                                task_mgmt1.setPriority(Priority.URGENT);
                                task_mgmt1.setEstimation(Estimation.L);
                                task_mgmt1.setTimeTaken(12);

                                Task task_mgmt2 = new Task(
                                                "Agregar campos priority, estimation y timeTaken",
                                                4,
                                                "Extender modelo de tareas con nuevos campos y enums",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 1),
                                                LocalDate.of(2025, 11, 4),
                                                LocalDate.of(2025, 11, 6));
                                task_mgmt2.setPriority(Priority.HIGH);
                                task_mgmt2.setEstimation(Estimation.S);
                                task_mgmt2.setTimeTaken(4);

                                Task task_mgmt3 = new Task(
                                                "Implementar vista Kanban con drag and drop",
                                                8,
                                                "Crear tablero Kanban con columnas por estado y funcionalidad de arrastrar y soltar",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 22),
                                                LocalDate.of(2025, 10, 24));
                                task_mgmt3.setPriority(Priority.HIGH);
                                task_mgmt3.setEstimation(Estimation.M);
                                task_mgmt3.setTimeTaken(7);

                                Task task_mgmt4 = new Task(
                                                "Crear componentes de frontend para tareas",
                                                6,
                                                "Desarrollar CreateTaskModal, KanbanCard, Columns y adapters",
                                                Status.DONE,
                                                sprint3,
                                                kaledUser,
                                                LocalDate.of(2025, 10, 8),
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 17));
                                task_mgmt4.setPriority(Priority.HIGH);
                                task_mgmt4.setEstimation(Estimation.M);
                                task_mgmt4.setTimeTaken(6);

                                taskRepository.save(task_mgmt1);
                                taskRepository.save(task_mgmt2);
                                taskRepository.save(task_mgmt3);
                                taskRepository.save(task_mgmt4);

                                // Tasks para Sprint 3 - Telegram Integration
                                Task telegram_task1 = new Task(
                                                "Configurar bot de Telegram y webhook",
                                                6,
                                                "Configurar token del bot y endpoint webhook en Spring Boot",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 6),
                                                LocalDate.of(2025, 10, 10),
                                                LocalDate.of(2025, 10, 12));
                                telegram_task1.setPriority(Priority.HIGH);
                                telegram_task1.setEstimation(Estimation.M);
                                telegram_task1.setTimeTaken(7);

                                Task telegram_task2 = new Task(
                                                "Implementar generación de tokens en página de usuario",
                                                4,
                                                "Agregar funcionalidad para que usuarios generen tokens de Telegram",
                                                Status.DONE,
                                                sprint3,
                                                kaledUser,
                                                LocalDate.of(2025, 10, 7),
                                                LocalDate.of(2025, 10, 9),
                                                LocalDate.of(2025, 10, 11));
                                telegram_task2.setPriority(Priority.MODERATE);
                                telegram_task2.setEstimation(Estimation.S);
                                telegram_task2.setTimeTaken(3);

                                Task telegram_task3 = new Task(
                                                "Implementar comandos básicos del bot",
                                                8,
                                                "Desarrollar comandos para listar y gestionar tareas desde Telegram",
                                                Status.IN_PROGRESS,
                                                sprint3,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 12),
                                                null,
                                                LocalDate.of(2025, 11, 20));
                                telegram_task3.setPriority(Priority.MODERATE);
                                telegram_task3.setEstimation(Estimation.M);
                                telegram_task3.setTimeTaken(5);

                                Task telegram_task4 = new Task(
                                                "Crear suite de tests para bot de Telegram",
                                                5,
                                                "Implementar tests unitarios con Mockito para funcionalidad del bot",
                                                Status.DONE,
                                                sprint3,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 18),
                                                LocalDate.of(2025, 10, 22),
                                                LocalDate.of(2025, 10, 24));
                                telegram_task4.setPriority(Priority.LOW);
                                telegram_task4.setEstimation(Estimation.S);
                                telegram_task4.setTimeTaken(5);

                                taskRepository.save(telegram_task1);
                                taskRepository.save(telegram_task2);
                                taskRepository.save(telegram_task3);
                                taskRepository.save(telegram_task4);

                                // Tasks adicionales de infraestructura y features avanzadas
                                Task infrastructure1 = new Task(
                                                "Configurar Oracle Vector Search para RAG",
                                                13,
                                                "Implementar backend de RAG con Oracle Vector DB para análisis semántico de repositorio",
                                                Status.DONE,
                                                sprint3,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 20),
                                                LocalDate.of(2025, 11, 5),
                                                LocalDate.of(2025, 11, 7));
                                infrastructure1.setPriority(Priority.MODERATE);
                                infrastructure1.setEstimation(Estimation.XL);
                                infrastructure1.setTimeTaken(15);

                                Task infrastructure2 = new Task(
                                                "Implementar soporte Markdown en respuestas RAG",
                                                3,
                                                "Agregar renderizado de Markdown para respuestas del chatbot",
                                                Status.DONE,
                                                sprint3,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 25),
                                                LocalDate.of(2025, 10, 28),
                                                LocalDate.of(2025, 10, 30));
                                infrastructure2.setPriority(Priority.LOW);
                                infrastructure2.setEstimation(Estimation.XS);
                                infrastructure2.setTimeTaken(3);

                                Task infrastructure3 = new Task(
                                                "Configurar workflows de GitHub Actions",
                                                5,
                                                "Implementar workflows de build, lint y deploy automático",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 10),
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 17));
                                infrastructure3.setPriority(Priority.MODERATE);
                                infrastructure3.setEstimation(Estimation.M);
                                infrastructure3.setTimeTaken(6);

                                Task infrastructure4 = new Task(
                                                "Implementar DataTable con ordenamiento y filtros",
                                                6,
                                                "Crear componente DataTable reutilizable con TanStack Table",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 22),
                                                LocalDate.of(2025, 10, 27),
                                                LocalDate.of(2025, 10, 29));
                                infrastructure4.setPriority(Priority.MODERATE);
                                infrastructure4.setEstimation(Estimation.M);
                                infrastructure4.setTimeTaken(5);

                                taskRepository.save(infrastructure1);
                                taskRepository.save(infrastructure2);
                                taskRepository.save(infrastructure3);
                                taskRepository.save(infrastructure4);

                                logger.info("✓ Tareas insertadas");
                        }

                        logger.info("✅ Seeding finalizado exitosamente.");
                };
        }
}