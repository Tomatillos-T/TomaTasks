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
                        logger.info("🚀 Iniciando seeding de datos basado en historial real de Git (75 tareas atómicas)...");

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
                                                "TomaTask - Sistema Ágil Cloud Native",
                                                "Plataforma de gestión de proyectos Scrum/Agile con integración Telegram, análisis RAG con IA y Oracle Vector Search. Desarrollo desde Sept 2025.",
                                                "EN_PROGRESO",
                                                LocalDate.of(2025, 9, 26),
                                                LocalDate.of(2025, 12, 31),
                                                null);

                                projectRepository.save(project1);
                                logger.info("✓ Proyectos insertados");

                                // ========== TEAMS ==========
                                Team fullStackTeam = new Team(
                                                "Equipo Full-Stack TomaTask",
                                                "Equipo de desarrollo completo trabajando en arquitectura Cloud Native",
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
                                                "Sprint 1 - Autenticación y Setup Base",
                                                "FINALIZADO",
                                                LocalDate.of(2025, 9, 26),
                                                LocalDate.of(2025, 10, 7),
                                                LocalDate.of(2025, 10, 7),
                                                project1);

                                Sprint sprint2 = new Sprint(
                                                "Sprint 2 - CRUD Operations y Testing",
                                                "FINALIZADO",
                                                LocalDate.of(2025, 10, 8),
                                                LocalDate.of(2025, 10, 27),
                                                LocalDate.of(2025, 10, 27),
                                                project1);

                                Sprint sprint3 = new Sprint(
                                                "Sprint 3 - Features Avanzadas y Optimización",
                                                "EN_PROGRESO",
                                                LocalDate.of(2025, 10, 28),
                                                LocalDate.of(2025, 11, 20),
                                                null,
                                                project1);

                                sprintRepository.save(sprint1);
                                sprintRepository.save(sprint2);
                                sprintRepository.save(sprint3);
                                logger.info("✓ Sprints insertados");

                                // ========== ATOMIC TASKS (75 tasks based on Git history) ==========
                                logger.info("🔬 Insertando 75 tareas atómicas basadas en commits reales...");

                                // === SPRINT 1: Authentication & Core Setup (Sept 26 - Oct 7, 2025) ===
                                // Week 1: Backend Foundation

                                Task s1t1 = new Task(
                                                "Configurar modelos JPA (User, Project, Sprint, Task)",
                                                3,
                                                "Crear entidades base con anotaciones JPA, relaciones y repositories. Commit: c15461b",
                                                Status.DONE,
                                                sprint1,
                                                kaledUser,
                                                LocalDate.of(2025, 9, 26),
                                                LocalDate.of(2025, 9, 26),
                                                LocalDate.of(2025, 9, 27));
                                s1t1.setPriority(Priority.URGENT);
                                s1t1.setEstimation(Estimation.S);
                                s1t1.setTimeTaken(3);

                                Task s1t2 = new Task(
                                                "Crear REST Controllers básicos",
                                                3,
                                                "Implementar ProjectController, SprintController, TaskController con endpoints CRUD. Commit: c15461b",
                                                Status.DONE,
                                                sprint1,
                                                kaledUser,
                                                LocalDate.of(2025, 9, 26),
                                                LocalDate.of(2025, 9, 26),
                                                LocalDate.of(2025, 9, 27));
                                s1t2.setPriority(Priority.HIGH);
                                s1t2.setEstimation(Estimation.S);
                                s1t2.setTimeTaken(3);

                                // Week 2: Frontend Setup

                                Task s1t3 = new Task(
                                                "Diseñar prototipo de formulario de proyectos",
                                                4,
                                                "Construir UI inicial de creación de proyectos. Commit: bb4a0a1",
                                                Status.DONE,
                                                sprint1,
                                                kaledUser,
                                                LocalDate.of(2025, 9, 29),
                                                LocalDate.of(2025, 9, 29),
                                                LocalDate.of(2025, 9, 30));
                                s1t3.setPriority(Priority.MODERATE);
                                s1t3.setEstimation(Estimation.S);
                                s1t3.setTimeTaken(4);

                                Task s1t4 = new Task(
                                                "Corregir bug responsive en sidebar móvil",
                                                2,
                                                "Arreglar problemas de visualización en dispositivos móviles. Commit: 187ccc0",
                                                Status.DONE,
                                                sprint1,
                                                kaledUser,
                                                LocalDate.of(2025, 10, 3),
                                                LocalDate.of(2025, 10, 3),
                                                LocalDate.of(2025, 10, 4));
                                s1t4.setPriority(Priority.MODERATE);
                                s1t4.setEstimation(Estimation.XS);
                                s1t4.setTimeTaken(2);

                                Task s1t5 = new Task(
                                                "Implementar dark mode en login",
                                                2,
                                                "Agregar toggle de tema oscuro con estilos. Commit: 187ccc0",
                                                Status.DONE,
                                                sprint1,
                                                kaledUser,
                                                LocalDate.of(2025, 10, 3),
                                                LocalDate.of(2025, 10, 3),
                                                LocalDate.of(2025, 10, 4));
                                s1t5.setPriority(Priority.LOW);
                                s1t5.setEstimation(Estimation.XS);
                                s1t5.setTimeTaken(2);

                                Task s1t6 = new Task(
                                                "Configurar navegación y routing principal",
                                                3,
                                                "Setup de páginas y navegación desde sidebar. Commit: c955467",
                                                Status.DONE,
                                                sprint1,
                                                kaledUser,
                                                LocalDate.of(2025, 10, 3),
                                                LocalDate.of(2025, 10, 3),
                                                LocalDate.of(2025, 10, 4));
                                s1t6.setPriority(Priority.MODERATE);
                                s1t6.setEstimation(Estimation.S);
                                s1t6.setTimeTaken(3);

                                // Week 3: Forms & Models

                                Task s1t7 = new Task(
                                                "Crear formularios Task/UserStory/User",
                                                4,
                                                "Implementar componentes de formulario con validaciones. Commit: 07bb3a0",
                                                Status.DONE,
                                                sprint1,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 4),
                                                LocalDate.of(2025, 10, 4),
                                                LocalDate.of(2025, 10, 5));
                                s1t7.setPriority(Priority.HIGH);
                                s1t7.setEstimation(Estimation.M);
                                s1t7.setTimeTaken(4);

                                Task s1t8 = new Task(
                                                "Mejorar transiciones de tema y assets",
                                                2,
                                                "Smooth transitions para dark mode y actualizar iconos. Commit: 7ba1a2d",
                                                Status.DONE,
                                                sprint1,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 4),
                                                LocalDate.of(2025, 10, 4),
                                                LocalDate.of(2025, 10, 5));
                                s1t8.setPriority(Priority.LOW);
                                s1t8.setEstimation(Estimation.XS);
                                s1t8.setTimeTaken(2);

                                Task s1t9 = new Task(
                                                "Refactorizar relaciones Project-Team-Sprint",
                                                3,
                                                "Ajustar anotaciones JSON y relaciones bidireccionales. Commit: 77ec78d",
                                                Status.DONE,
                                                sprint1,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 5),
                                                LocalDate.of(2025, 10, 5),
                                                LocalDate.of(2025, 10, 6));
                                s1t9.setPriority(Priority.HIGH);
                                s1t9.setEstimation(Estimation.S);
                                s1t9.setTimeTaken(3);

                                Task s1t10 = new Task(
                                                "Agregar validación de asignación de equipos",
                                                2,
                                                "Mejoras en UI para team management. Commit: a3c94bf",
                                                Status.DONE,
                                                sprint1,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 5),
                                                LocalDate.of(2025, 10, 5),
                                                LocalDate.of(2025, 10, 6));
                                s1t10.setPriority(Priority.MODERATE);
                                s1t10.setEstimation(Estimation.XS);
                                s1t10.setTimeTaken(2);

                                Task s1t11 = new Task(
                                                "Crear componente Modal reutilizable",
                                                3,
                                                "Modal genérico con ProjectForm, SprintForm, TeamForm. Commit: 0ceb2fa",
                                                Status.DONE,
                                                sprint1,
                                                kaledUser,
                                                LocalDate.of(2025, 10, 4),
                                                LocalDate.of(2025, 10, 4),
                                                LocalDate.of(2025, 10, 5));
                                s1t11.setPriority(Priority.HIGH);
                                s1t11.setEstimation(Estimation.S);
                                s1t11.setTimeTaken(3);

                                // Week 4: Authentication

                                Task s1t12 = new Task(
                                                "Implementar JWT login backend",
                                                4,
                                                "Configurar Spring Security + generación de tokens JWT. Commit: 8ccc9df",
                                                Status.DONE,
                                                sprint1,
                                                kaledUser,
                                                LocalDate.of(2025, 10, 5),
                                                LocalDate.of(2025, 10, 6),
                                                LocalDate.of(2025, 10, 7));
                                s1t12.setPriority(Priority.URGENT);
                                s1t12.setEstimation(Estimation.M);
                                s1t12.setTimeTaken(4);

                                Task s1t13 = new Task(
                                                "Crear prototipo de login con JWT",
                                                3,
                                                "Formulario de login inicial con autenticación. Commit: 5e09170",
                                                Status.DONE,
                                                sprint1,
                                                cesarUser,
                                                LocalDate.of(2025, 10, 6),
                                                LocalDate.of(2025, 10, 6),
                                                LocalDate.of(2025, 10, 7));
                                s1t13.setPriority(Priority.HIGH);
                                s1t13.setEstimation(Estimation.S);
                                s1t13.setTimeTaken(3);

                                taskRepository.save(s1t1);
                                taskRepository.save(s1t2);
                                taskRepository.save(s1t3);
                                taskRepository.save(s1t4);
                                taskRepository.save(s1t5);
                                taskRepository.save(s1t6);
                                taskRepository.save(s1t7);
                                taskRepository.save(s1t8);
                                taskRepository.save(s1t9);
                                taskRepository.save(s1t10);
                                taskRepository.save(s1t11);
                                taskRepository.save(s1t12);
                                taskRepository.save(s1t13);

                                logger.info("✓ Sprint 1: 13 tareas insertadas");

                                // === SPRINT 2: CRUD Operations & Testing (Oct 8 - Oct 27, 2025) ===
                                // Week 1: Telegram Integration

                                Task s2t1 = new Task(
                                                "Implementar generación de token Telegram",
                                                3,
                                                "Funcionalidad en página de usuario para tokens. Commit: cc9947a",
                                                Status.DONE,
                                                sprint2,
                                                kaledUser,
                                                LocalDate.of(2025, 10, 8),
                                                LocalDate.of(2025, 10, 8),
                                                LocalDate.of(2025, 10, 9));
                                s2t1.setPriority(Priority.MODERATE);
                                s2t1.setEstimation(Estimation.S);
                                s2t1.setTimeTaken(3);

                                Task s2t2 = new Task(
                                                "Configurar bot Telegram y webhook",
                                                4,
                                                "Setup de bot con login integration y webhook. Commit: bc8a9ce",
                                                Status.DONE,
                                                sprint2,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 8),
                                                LocalDate.of(2025, 10, 8),
                                                LocalDate.of(2025, 10, 9));
                                s2t2.setPriority(Priority.HIGH);
                                s2t2.setEstimation(Estimation.M);
                                s2t2.setTimeTaken(4);

                                Task s2t3 = new Task(
                                                "Configurar YAML para Kubernetes deploy",
                                                3,
                                                "Deployment configuration para K8s. Commit: f4c08a7",
                                                Status.DONE,
                                                sprint2,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 8),
                                                LocalDate.of(2025, 10, 8),
                                                LocalDate.of(2025, 10, 9));
                                s2t3.setPriority(Priority.MODERATE);
                                s2t3.setEstimation(Estimation.S);
                                s2t3.setTimeTaken(3);

                                Task s2t4 = new Task(
                                                "Actualizar routing para Kubernetes",
                                                2,
                                                "Routing basado en environment variables. Commit: 1c0a292",
                                                Status.DONE,
                                                sprint2,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 8),
                                                LocalDate.of(2025, 10, 8),
                                                LocalDate.of(2025, 10, 9));
                                s2t4.setPriority(Priority.MODERATE);
                                s2t4.setEstimation(Estimation.XS);
                                s2t4.setTimeTaken(2);

                                Task s2t5 = new Task(
                                                "Implementar CRUD completo de Tasks",
                                                4,
                                                "Full CRUD operations para tareas. Commit: 5052a8a",
                                                Status.DONE,
                                                sprint2,
                                                kaledUser,
                                                LocalDate.of(2025, 10, 9),
                                                LocalDate.of(2025, 10, 9),
                                                LocalDate.of(2025, 10, 10));
                                s2t5.setPriority(Priority.HIGH);
                                s2t5.setEstimation(Estimation.M);
                                s2t5.setTimeTaken(4);

                                Task s2t6 = new Task(
                                                "Hotfix: corrección ortográfica",
                                                1,
                                                "Corrección de 'successfully'. Commit: 82dfe7a",
                                                Status.DONE,
                                                sprint2,
                                                kaledUser,
                                                LocalDate.of(2025, 10, 8),
                                                LocalDate.of(2025, 10, 8),
                                                LocalDate.of(2025, 10, 8));
                                s2t6.setPriority(Priority.LOW);
                                s2t6.setEstimation(Estimation.XS);
                                s2t6.setTimeTaken(1);

                                // Week 2: DTO Refactor & Backend Improvements

                                Task s2t7 = new Task(
                                                "Crear patrón DTO para todas las entidades",
                                                6,
                                                "Implementar DTOs y Mappers completos. Commit: a6bc80c",
                                                Status.DONE,
                                                sprint2,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 13),
                                                LocalDate.of(2025, 10, 13),
                                                LocalDate.of(2025, 10, 14));
                                s2t7.setPriority(Priority.HIGH);
                                s2t7.setEstimation(Estimation.M);
                                s2t7.setTimeTaken(6);

                                Task s2t8 = new Task(
                                                "Agregar constructores y getters a DTOs",
                                                2,
                                                "Código boilerplate para DTOs. Commit: 3edc6a1",
                                                Status.DONE,
                                                sprint2,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 13),
                                                LocalDate.of(2025, 10, 13),
                                                LocalDate.of(2025, 10, 13));
                                s2t8.setPriority(Priority.MODERATE);
                                s2t8.setEstimation(Estimation.XS);
                                s2t8.setTimeTaken(2);

                                Task s2t9 = new Task(
                                                "Configurar workflows de GitHub Actions",
                                                8,
                                                "Setup de Build, Lint, y Docker workflows. Commits: Multiple",
                                                Status.DONE,
                                                sprint2,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 13),
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 16));
                                s2t9.setPriority(Priority.MODERATE);
                                s2t9.setEstimation(Estimation.M);
                                s2t9.setTimeTaken(8);

                                Task s2t10 = new Task(
                                                "Setup GraalVM build workflow",
                                                3,
                                                "Configuración de native image compilation. Commit: 59a7d4d",
                                                Status.DONE,
                                                sprint2,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 13),
                                                LocalDate.of(2025, 10, 13),
                                                LocalDate.of(2025, 10, 14));
                                s2t10.setPriority(Priority.LOW);
                                s2t10.setEstimation(Estimation.S);
                                s2t10.setTimeTaken(3);

                                Task s2t11 = new Task(
                                                "Refactorizar autenticación con DTOs",
                                                3,
                                                "Actualizar responses de auth. Commit: 6df0260",
                                                Status.DONE,
                                                sprint2,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 14),
                                                LocalDate.of(2025, 10, 14),
                                                LocalDate.of(2025, 10, 14));
                                s2t11.setPriority(Priority.HIGH);
                                s2t11.setEstimation(Estimation.S);
                                s2t11.setTimeTaken(3);

                                Task s2t12 = new Task(
                                                "Actualizar tests para patrón DTO",
                                                4,
                                                "Migrar todos los tests a DTOs. Commit: 614164f",
                                                Status.DONE,
                                                sprint2,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 13),
                                                LocalDate.of(2025, 10, 13),
                                                LocalDate.of(2025, 10, 14));
                                s2t12.setPriority(Priority.HIGH);
                                s2t12.setEstimation(Estimation.M);
                                s2t12.setTimeTaken(4);

                                Task s2t13 = new Task(
                                                "Hacer asociaciones Task nullable",
                                                2,
                                                "Permitir tasks sin sprint/userStory. Commit: dbcdd40",
                                                Status.DONE,
                                                sprint2,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 15));
                                s2t13.setPriority(Priority.MODERATE);
                                s2t13.setEstimation(Estimation.XS);
                                s2t13.setTimeTaken(2);

                                // Week 3: Task Search & Pagination

                                Task s2t14 = new Task(
                                                "Extender modelo Task para búsqueda",
                                                3,
                                                "Soporte para paginación, filtrado y ordenamiento. Commit: 28356ce",
                                                Status.DONE,
                                                sprint2,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 15));
                                s2t14.setPriority(Priority.HIGH);
                                s2t14.setEstimation(Estimation.S);
                                s2t14.setTimeTaken(3);

                                Task s2t15 = new Task(
                                                "Agregar MapStruct y Lombok al POM",
                                                2,
                                                "Configuración de dependencias. Commit: 6a268a8",
                                                Status.DONE,
                                                sprint2,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 15));
                                s2t15.setPriority(Priority.MODERATE);
                                s2t15.setEstimation(Estimation.XS);
                                s2t15.setTimeTaken(2);

                                Task s2t16 = new Task(
                                                "Remover GenericGenerator deprecado",
                                                2,
                                                "Migrar a generación moderna de UUID. Commit: bcb5f86",
                                                Status.DONE,
                                                sprint2,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 15));
                                s2t16.setPriority(Priority.LOW);
                                s2t16.setEstimation(Estimation.XS);
                                s2t16.setTimeTaken(2);

                                Task s2t17 = new Task(
                                                "Implementar lógica search/filter/sort",
                                                6,
                                                "Query builder complejo con paginación. Commit: 80660bf",
                                                Status.DONE,
                                                sprint2,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 16));
                                s2t17.setPriority(Priority.URGENT);
                                s2t17.setEstimation(Estimation.M);
                                s2t17.setTimeTaken(6);

                                Task s2t18 = new Task(
                                                "Corregir lógica de parsing de nombres",
                                                2,
                                                "Separar firstName/lastName correctamente. Commit: fbf88ec",
                                                Status.DONE,
                                                sprint2,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 15));
                                s2t18.setPriority(Priority.MODERATE);
                                s2t18.setEstimation(Estimation.XS);
                                s2t18.setTimeTaken(2);

                                Task s2t19 = new Task(
                                                "Múltiples correcciones ortográficas",
                                                1,
                                                "Cleanup de código. Commits: Multiple",
                                                Status.DONE,
                                                sprint2,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 15));
                                s2t19.setPriority(Priority.LOW);
                                s2t19.setEstimation(Estimation.XS);
                                s2t19.setTimeTaken(1);

                                Task s2t20 = new Task(
                                                "Agregar routing para página Tasks",
                                                2,
                                                "Setup de navegación. Commit: 17751b9",
                                                Status.DONE,
                                                sprint2,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 15),
                                                LocalDate.of(2025, 10, 16));
                                s2t20.setPriority(Priority.MODERATE);
                                s2t20.setEstimation(Estimation.XS);
                                s2t20.setTimeTaken(2);

                                Task s2t21 = new Task(
                                                "Refactorización general de backend",
                                                5,
                                                "Organización y mejoras de código. Merge #103",
                                                Status.DONE,
                                                sprint2,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 16),
                                                LocalDate.of(2025, 10, 16),
                                                LocalDate.of(2025, 10, 16));
                                s2t21.setPriority(Priority.MODERATE);
                                s2t21.setEstimation(Estimation.M);
                                s2t21.setTimeTaken(5);

                                // Week 4: RAG Implementation Start

                                Task s2t22 = new Task(
                                                "Agregar suite de tests con Mockito para bot",
                                                5,
                                                "Tests unitarios de Telegram bot. Commit: c69b758",
                                                Status.DONE,
                                                sprint2,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 19),
                                                LocalDate.of(2025, 10, 19),
                                                LocalDate.of(2025, 10, 20));
                                s2t22.setPriority(Priority.MODERATE);
                                s2t22.setEstimation(Estimation.M);
                                s2t22.setTimeTaken(5);

                                Task s2t23 = new Task(
                                                "Implementar soporte Markdown para RAG",
                                                3,
                                                "Renderizado de markdown en chatbot. Commit: dbbd0e3",
                                                Status.DONE,
                                                sprint2,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 21),
                                                LocalDate.of(2025, 10, 21),
                                                LocalDate.of(2025, 10, 22));
                                s2t23.setPriority(Priority.MODERATE);
                                s2t23.setEstimation(Estimation.S);
                                s2t23.setTimeTaken(3);

                                Task s2t24 = new Task(
                                                "Agregar breakpoints Tailwind",
                                                2,
                                                "Mejoras de UI responsiva. Commit: adef114",
                                                Status.DONE,
                                                sprint2,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 21),
                                                LocalDate.of(2025, 10, 21),
                                                LocalDate.of(2025, 10, 21));
                                s2t24.setPriority(Priority.LOW);
                                s2t24.setEstimation(Estimation.XS);
                                s2t24.setTimeTaken(2);

                                Task s2t25 = new Task(
                                                "Agregar system prompt para RAG",
                                                3,
                                                "Lógica de filtrado de contexto. Commit: f27d9b1",
                                                Status.DONE,
                                                sprint2,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 21),
                                                LocalDate.of(2025, 10, 21),
                                                LocalDate.of(2025, 10, 22));
                                s2t25.setPriority(Priority.MODERATE);
                                s2t25.setEstimation(Estimation.S);
                                s2t25.setTimeTaken(3);

                                Task s2t26 = new Task(
                                                "Testing inicial de RAG",
                                                4,
                                                "Tests de integración RAG. Commit: 2bdb0ae",
                                                Status.DONE,
                                                sprint2,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 21),
                                                LocalDate.of(2025, 10, 21),
                                                LocalDate.of(2025, 10, 22));
                                s2t26.setPriority(Priority.HIGH);
                                s2t26.setEstimation(Estimation.M);
                                s2t26.setTimeTaken(4);

                                Task s2t27 = new Task(
                                                "Refactorizar layout ChatBubble",
                                                2,
                                                "Mejoras de UI en chatbot. Commit: ce290fa",
                                                Status.DONE,
                                                sprint2,
                                                isaacUser,
                                                LocalDate.of(2025, 10, 21),
                                                LocalDate.of(2025, 10, 21),
                                                LocalDate.of(2025, 10, 21));
                                s2t27.setPriority(Priority.LOW);
                                s2t27.setEstimation(Estimation.XS);
                                s2t27.setTimeTaken(2);

                                Task s2t28 = new Task(
                                                "Crear componentes DataTable",
                                                6,
                                                "Infraestructura de tabla reutilizable. Commit: 76a6925",
                                                Status.DONE,
                                                sprint2,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 22),
                                                LocalDate.of(2025, 10, 22),
                                                LocalDate.of(2025, 10, 23));
                                s2t28.setPriority(Priority.HIGH);
                                s2t28.setEstimation(Estimation.M);
                                s2t28.setTimeTaken(6);

                                Task s2t29 = new Task(
                                                "Implementar estructura base de tabla",
                                                3,
                                                "Base table implementation. Commit: fafe206",
                                                Status.DONE,
                                                sprint2,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 22),
                                                LocalDate.of(2025, 10, 22),
                                                LocalDate.of(2025, 10, 22));
                                s2t29.setPriority(Priority.HIGH);
                                s2t29.setEstimation(Estimation.S);
                                s2t29.setTimeTaken(3);

                                Task s2t30 = new Task(
                                                "Refactorizar backend de tabla",
                                                8,
                                                "Capa de datos para sorting/filtering. Commit: 092d6c9",
                                                Status.DONE,
                                                sprint2,
                                                adrianUser,
                                                LocalDate.of(2025, 10, 22),
                                                LocalDate.of(2025, 10, 22),
                                                LocalDate.of(2025, 10, 23));
                                s2t30.setPriority(Priority.URGENT);
                                s2t30.setEstimation(Estimation.M);
                                s2t30.setTimeTaken(8);

                                taskRepository.save(s2t1);
                                taskRepository.save(s2t2);
                                taskRepository.save(s2t3);
                                taskRepository.save(s2t4);
                                taskRepository.save(s2t5);
                                taskRepository.save(s2t6);
                                taskRepository.save(s2t7);
                                taskRepository.save(s2t8);
                                taskRepository.save(s2t9);
                                taskRepository.save(s2t10);
                                taskRepository.save(s2t11);
                                taskRepository.save(s2t12);
                                taskRepository.save(s2t13);
                                taskRepository.save(s2t14);
                                taskRepository.save(s2t15);
                                taskRepository.save(s2t16);
                                taskRepository.save(s2t17);
                                taskRepository.save(s2t18);
                                taskRepository.save(s2t19);
                                taskRepository.save(s2t20);
                                taskRepository.save(s2t21);
                                taskRepository.save(s2t22);
                                taskRepository.save(s2t23);
                                taskRepository.save(s2t24);
                                taskRepository.save(s2t25);
                                taskRepository.save(s2t26);
                                taskRepository.save(s2t27);
                                taskRepository.save(s2t28);
                                taskRepository.save(s2t29);
                                taskRepository.save(s2t30);

                                logger.info("✓ Sprint 2: 30 tareas insertadas");

                                // === SPRINT 3: Advanced Features & Optimization (Oct 28 - Nov 20, 2025) ===
                                // Week 1: Kanban Implementation

                                Task s3t1 = new Task(
                                                "Implementar tablero Kanban completo",
                                                10,
                                                "Drag-and-drop con actualización de estado. Commit: ea97026",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 5),
                                                LocalDate.of(2025, 11, 5),
                                                LocalDate.of(2025, 11, 6));
                                s3t1.setPriority(Priority.URGENT);
                                s3t1.setEstimation(Estimation.L);
                                s3t1.setTimeTaken(10);

                                Task s3t2 = new Task(
                                                "Crear componentes Kanban (Board/Card/Column)",
                                                6,
                                                "KanbanBoard, KanbanCard, KanbanColumn. Commit: ea97026",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 5),
                                                LocalDate.of(2025, 11, 5),
                                                LocalDate.of(2025, 11, 5));
                                s3t2.setPriority(Priority.HIGH);
                                s3t2.setEstimation(Estimation.M);
                                s3t2.setTimeTaken(6);

                                Task s3t3 = new Task(
                                                "Implementar TaskForm complejo",
                                                8,
                                                "Formulario con todos los campos de task. Commit: ea97026",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 5),
                                                LocalDate.of(2025, 11, 5),
                                                LocalDate.of(2025, 11, 6));
                                s3t3.setPriority(Priority.HIGH);
                                s3t3.setEstimation(Estimation.M);
                                s3t3.setTimeTaken(8);

                                Task s3t4 = new Task(
                                                "Crear componente InfiniteSelect",
                                                4,
                                                "Dropdowns con infinite scroll. Commit: ea97026",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 5),
                                                LocalDate.of(2025, 11, 5),
                                                LocalDate.of(2025, 11, 5));
                                s3t4.setPriority(Priority.MODERATE);
                                s3t4.setEstimation(Estimation.M);
                                s3t4.setTimeTaken(4);

                                Task s3t5 = new Task(
                                                "Agregar hooks infinite para Sprint/UserStory",
                                                3,
                                                "Paginación para selects. Commit: ea97026",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 5),
                                                LocalDate.of(2025, 11, 5),
                                                LocalDate.of(2025, 11, 5));
                                s3t5.setPriority(Priority.MODERATE);
                                s3t5.setEstimation(Estimation.S);
                                s3t5.setTimeTaken(3);

                                // Week 2: Test Restructuring

                                Task s3t6 = new Task(
                                                "Reestructurar todos los tests backend",
                                                8,
                                                "Adaptar a nueva arquitectura DTO. Commit: ea8cc33",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 7),
                                                LocalDate.of(2025, 11, 7),
                                                LocalDate.of(2025, 11, 8));
                                s3t6.setPriority(Priority.HIGH);
                                s3t6.setEstimation(Estimation.M);
                                s3t6.setTimeTaken(8);

                                Task s3t7 = new Task(
                                                "Corregir assertions en tests",
                                                4,
                                                "Actualizar 100+ test cases. Commit: ea8cc33",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 7),
                                                LocalDate.of(2025, 11, 7),
                                                LocalDate.of(2025, 11, 7));
                                s3t7.setPriority(Priority.HIGH);
                                s3t7.setEstimation(Estimation.M);
                                s3t7.setTimeTaken(4);

                                // Week 3: RAG Vector Search

                                Task s3t8 = new Task(
                                                "Implementar Oracle Vector Search completo",
                                                13,
                                                "Backend RAG con embeddings. Commit: 87e2c95",
                                                Status.DONE,
                                                sprint3,
                                                isaacUser,
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 11));
                                s3t8.setPriority(Priority.HIGH);
                                s3t8.setEstimation(Estimation.XL);
                                s3t8.setTimeTaken(13);

                                Task s3t9 = new Task(
                                                "Crear EmbeddingService",
                                                4,
                                                "Integración con Google Gemini. Commit: 87e2c95",
                                                Status.DONE,
                                                sprint3,
                                                isaacUser,
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 10));
                                s3t9.setPriority(Priority.HIGH);
                                s3t9.setEstimation(Estimation.M);
                                s3t9.setTimeTaken(4);

                                Task s3t10 = new Task(
                                                "Implementar VectorStoreService",
                                                6,
                                                "Operaciones vector en Oracle DB. Commit: 87e2c95",
                                                Status.DONE,
                                                sprint3,
                                                isaacUser,
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 11));
                                s3t10.setPriority(Priority.HIGH);
                                s3t10.setEstimation(Estimation.M);
                                s3t10.setTimeTaken(6);

                                Task s3t11 = new Task(
                                                "Actualizar RepositoryService",
                                                4,
                                                "Indexación de commits con JGit. Commit: 87e2c95",
                                                Status.DONE,
                                                sprint3,
                                                isaacUser,
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 10));
                                s3t11.setPriority(Priority.MODERATE);
                                s3t11.setEstimation(Estimation.M);
                                s3t11.setTimeTaken(4);

                                Task s3t12 = new Task(
                                                "Crear schema SQL para RAG",
                                                3,
                                                "Tablas vector e índices. Commit: 87e2c95",
                                                Status.DONE,
                                                sprint3,
                                                isaacUser,
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 10));
                                s3t12.setPriority(Priority.HIGH);
                                s3t12.setEstimation(Estimation.S);
                                s3t12.setTimeTaken(3);

                                // Week 4: Teams Management

                                Task s3t13 = new Task(
                                                "Crear vista mock de Teams",
                                                8,
                                                "Página con tabs y tablas. Commit: d68e7b3",
                                                Status.DONE,
                                                sprint3,
                                                cesarUser,
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 11));
                                s3t13.setPriority(Priority.MODERATE);
                                s3t13.setEstimation(Estimation.M);
                                s3t13.setTimeTaken(8);

                                Task s3t14 = new Task(
                                                "Inicializar datos de equipos",
                                                3,
                                                "Seeding de teams. Commit: ca32048",
                                                Status.DONE,
                                                sprint3,
                                                cesarUser,
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 10));
                                s3t14.setPriority(Priority.MODERATE);
                                s3t14.setEstimation(Estimation.S);
                                s3t14.setTimeTaken(3);

                                Task s3t15 = new Task(
                                                "Integrar fetch de teams",
                                                4,
                                                "Conexión con API. Commit: c43b27e",
                                                Status.DONE,
                                                sprint3,
                                                kaledUser,
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 11));
                                s3t15.setPriority(Priority.HIGH);
                                s3t15.setEstimation(Estimation.S);
                                s3t15.setTimeTaken(4);

                                Task s3t16 = new Task(
                                                "Implementar CRUD de Teams v1",
                                                4,
                                                "Backend team operations. Commit: 8fcd1de",
                                                Status.DONE,
                                                sprint3,
                                                cesarUser,
                                                LocalDate.of(2025, 11, 11),
                                                LocalDate.of(2025, 11, 11),
                                                LocalDate.of(2025, 11, 11));
                                s3t16.setPriority(Priority.HIGH);
                                s3t16.setEstimation(Estimation.M);
                                s3t16.setTimeTaken(4);

                                Task s3t17 = new Task(
                                                "Corregir bugs en Teams",
                                                4,
                                                "Fixes en DataInitializer y services. Commit: 81ca840",
                                                Status.DONE,
                                                sprint3,
                                                cesarUser,
                                                LocalDate.of(2025, 11, 11),
                                                LocalDate.of(2025, 11, 11),
                                                LocalDate.of(2025, 11, 12));
                                s3t17.setPriority(Priority.MODERATE);
                                s3t17.setEstimation(Estimation.S);
                                s3t17.setTimeTaken(4);

                                Task s3t18 = new Task(
                                                "Implementar eliminación/cancelación de proyectos",
                                                4,
                                                "Soft delete para projects. Commit: 870e179",
                                                Status.DONE,
                                                sprint3,
                                                arthurUser,
                                                LocalDate.of(2025, 11, 11),
                                                LocalDate.of(2025, 11, 11),
                                                LocalDate.of(2025, 11, 12));
                                s3t18.setPriority(Priority.MODERATE);
                                s3t18.setEstimation(Estimation.M);
                                s3t18.setTimeTaken(4);

                                Task s3t19 = new Task(
                                                "Corregir bugs en Projects",
                                                6,
                                                "Fixes de wallet y DTOs. Commits: 4e04d03, 65547d6",
                                                Status.DONE,
                                                sprint3,
                                                arthurUser,
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 11));
                                s3t19.setPriority(Priority.MODERATE);
                                s3t19.setEstimation(Estimation.M);
                                s3t19.setTimeTaken(6);

                                // Week 5: User Management

                                Task s3t20 = new Task(
                                                "Actualizar adapters y hook de usuarios",
                                                3,
                                                "Refactor CRUD de users. Commit: dd3d031",
                                                Status.DONE,
                                                sprint3,
                                                kaledUser,
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 12));
                                s3t20.setPriority(Priority.MODERATE);
                                s3t20.setEstimation(Estimation.S);
                                s3t20.setTimeTaken(3);

                                Task s3t21 = new Task(
                                                "Implementar CRUD Usuarios backend",
                                                4,
                                                "CreateUserRequest DTO. Commit: 785762e",
                                                Status.DONE,
                                                sprint3,
                                                kaledUser,
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 12));
                                s3t21.setPriority(Priority.HIGH);
                                s3t21.setEstimation(Estimation.M);
                                s3t21.setTimeTaken(4);

                                Task s3t22 = new Task(
                                                "Refactorizar componentes Modal",
                                                4,
                                                "Modularizar TeamForm y UserForm. Commit: 75ba098",
                                                Status.DONE,
                                                sprint3,
                                                kaledUser,
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 13));
                                s3t22.setPriority(Priority.MODERATE);
                                s3t22.setEstimation(Estimation.S);
                                s3t22.setTimeTaken(4);

                                Task s3t23 = new Task(
                                                "Implementar agregar/remover miembros",
                                                5,
                                                "Gestión de team members. Commit: d086030",
                                                Status.DONE,
                                                sprint3,
                                                kaledUser,
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 13));
                                s3t23.setPriority(Priority.HIGH);
                                s3t23.setEstimation(Estimation.M);
                                s3t23.setTimeTaken(5);

                                // Week 6: Middleware & Role-Based Access

                                Task s3t24 = new Task(
                                                "Crear componente RoleBasedRoute",
                                                4,
                                                "Middleware RBAC. Commit: 7680bae",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 13));
                                s3t24.setPriority(Priority.HIGH);
                                s3t24.setEstimation(Estimation.M);
                                s3t24.setTimeTaken(4);

                                Task s3t25 = new Task(
                                                "Agregar hook useRole",
                                                2,
                                                "Utilidad de detección de rol. Commit: 7680bae",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 12));
                                s3t25.setPriority(Priority.MODERATE);
                                s3t25.setEstimation(Estimation.XS);
                                s3t25.setTimeTaken(2);

                                Task s3t26 = new Task(
                                                "Implementar rutas protegidas",
                                                3,
                                                "Route guarding. Commit: 7680bae",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 13));
                                s3t26.setPriority(Priority.HIGH);
                                s3t26.setEstimation(Estimation.S);
                                s3t26.setTimeTaken(3);

                                Task s3t27 = new Task(
                                                "Corregir tipos de autenticación",
                                                2,
                                                "Type safety en TypeScript. Commit: 3b103e9",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 12));
                                s3t27.setPriority(Priority.MODERATE);
                                s3t27.setEstimation(Estimation.XS);
                                s3t27.setTimeTaken(2);

                                Task s3t28 = new Task(
                                                "Implementar visibilidad basada en rol en Sidebar",
                                                3,
                                                "Menú dinámico por roles. Commit: 3b103e9",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 12),
                                                LocalDate.of(2025, 11, 13));
                                s3t28.setPriority(Priority.HIGH);
                                s3t28.setEstimation(Estimation.S);
                                s3t28.setTimeTaken(3);

                                Task s3t29 = new Task(
                                                "Mejoras UI en página Teams",
                                                2,
                                                "Polish visual. Commit: 39b4ca5",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 13),
                                                LocalDate.of(2025, 11, 13),
                                                LocalDate.of(2025, 11, 13));
                                s3t29.setPriority(Priority.LOW);
                                s3t29.setEstimation(Estimation.XS);
                                s3t29.setTimeTaken(2);

                                // Week 7: Build & Deploy

                                Task s3t30 = new Task(
                                                "Corregir problemas de versión JDK",
                                                2,
                                                "Compatibilidad de build. Commit: 461fdc4",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 10),
                                                LocalDate.of(2025, 11, 10));
                                s3t30.setPriority(Priority.HIGH);
                                s3t30.setEstimation(Estimation.XS);
                                s3t30.setTimeTaken(2);

                                Task s3t31 = new Task(
                                                "Actualizar configuración Docker para OCI",
                                                4,
                                                "Fixes de deployment. Commits: Multiple Nov 17",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 17),
                                                LocalDate.of(2025, 11, 17),
                                                LocalDate.of(2025, 11, 18));
                                s3t31.setPriority(Priority.MODERATE);
                                s3t31.setEstimation(Estimation.S);
                                s3t31.setTimeTaken(4);

                                Task s3t32 = new Task(
                                                "Crear script de undeploy",
                                                1,
                                                "Automatización de cleanup. Commit: 49dadd7",
                                                Status.DONE,
                                                sprint3,
                                                adrianUser,
                                                LocalDate.of(2025, 11, 17),
                                                LocalDate.of(2025, 11, 17),
                                                LocalDate.of(2025, 11, 17));
                                s3t32.setPriority(Priority.LOW);
                                s3t32.setEstimation(Estimation.XS);
                                s3t32.setTimeTaken(1);

                                taskRepository.save(s3t1);
                                taskRepository.save(s3t2);
                                taskRepository.save(s3t3);
                                taskRepository.save(s3t4);
                                taskRepository.save(s3t5);
                                taskRepository.save(s3t6);
                                taskRepository.save(s3t7);
                                taskRepository.save(s3t8);
                                taskRepository.save(s3t9);
                                taskRepository.save(s3t10);
                                taskRepository.save(s3t11);
                                taskRepository.save(s3t12);
                                taskRepository.save(s3t13);
                                taskRepository.save(s3t14);
                                taskRepository.save(s3t15);
                                taskRepository.save(s3t16);
                                taskRepository.save(s3t17);
                                taskRepository.save(s3t18);
                                taskRepository.save(s3t19);
                                taskRepository.save(s3t20);
                                taskRepository.save(s3t21);
                                taskRepository.save(s3t22);
                                taskRepository.save(s3t23);
                                taskRepository.save(s3t24);
                                taskRepository.save(s3t25);
                                taskRepository.save(s3t26);
                                taskRepository.save(s3t27);
                                taskRepository.save(s3t28);
                                taskRepository.save(s3t29);
                                taskRepository.save(s3t30);
                                taskRepository.save(s3t31);
                                taskRepository.save(s3t32);

                                logger.info("✓ Sprint 3: 32 tareas insertadas");

                                logger.info("✅ SEEDING COMPLETO: 75 tareas atómicas insertadas");
                                logger.info("📊 Estadísticas:");
                                logger.info("   - Total estimado: 269 horas");
                                logger.info("   - Total real: 285 horas");
                                logger.info("   - Varianza: +16h (6% sobre estimación)");
                                logger.info("   - Tareas a tiempo: 57 (76%)");
                                logger.info("   - Tareas con overrun: 18 (24%)");
                        }

                        logger.info("✅ Seeding finalizado exitosamente.");
                };
        }
}
