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

                User kaledUser = userRepository.findByEmail("kaled.enriquez@tomatask.com")
                        .orElseGet(() -> userRepository.save(new User(
                                "Kaled", "Enriquez", "kaled.enriquez@tomatask.com",
                                "+52 811-000-0001", passwordEncoder.encode("user123"),
                                userRole, null)));

                User cesarUser = userRepository.findByEmail("cesar.martinez@tomatask.com")
                        .orElseGet(() -> userRepository.save(new User(
                                "César", "Martínez", "cesar.martinez@tomatask.com",
                                "+52 811-000-0002", passwordEncoder.encode("user123"),
                                userRole, null)));

                User isaacUser = userRepository.findByEmail("isaac.enriquez@tomatask.com")
                        .orElseGet(() -> userRepository.save(new User(
                                "Isaac", "Enríquez", "isaac.enriquez@tomatask.com",
                                "+52 811-000-0003", passwordEncoder.encode("user123"),
                                userRole, null)));

                User arthurUser = userRepository.findByEmail("arthur.vigier@tomatask.com")
                        .orElseGet(() -> userRepository.save(new User(
                                "Arthur", "Vigier", "arthur.vigier@tomatask.com",
                                "+52 811-000-0004", passwordEncoder.encode("user123"),
                                userRole, null)));

                User ranferiUser = userRepository.findByEmail("ranferi.marquez@tomatask.com")
                        .orElseGet(() -> userRepository.save(new User(
                                "Ranferi", "Márquez", "ranferi.marquez@tomatask.com",
                                "+52 811-000-0005", passwordEncoder.encode("user123"),
                                userRole, null)));

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

                logger.info("✓ Proyectos inicializados correctamente (3 insertados)");

                // ========== SPRINTS ==========
                Sprint sprint1 = new Sprint(
                        "Sprint 1 - Configuración inicial del backend",
                        "FINALIZADO",
                        LocalDate.of(2025, 1, 15),
                        LocalDate.of(2025, 1, 31),
                        LocalDate.of(2025, 2, 1),
                        project1
                );

                Sprint sprint2 = new Sprint(
                        "Sprint 2 - Autenticación y permisos",
                        "EN_PROGRESO",
                        LocalDate.of(2025, 2, 1),
                        LocalDate.of(2025, 2, 20),
                        null,
                        project1
                );

                Sprint sprint3 = new Sprint(
                        "Sprint 1 - Diseño de UI y prototipos",
                        "PLANIFICADO",
                        LocalDate.of(2025, 5, 1),
                        LocalDate.of(2025, 5, 20),
                        null,
                        project2
                );

                Sprint sprint4 = new Sprint(
                        "Sprint 1 - Implementación offline",
                        "EN_PRUEBAS",
                        LocalDate.of(2024, 9, 5),
                        LocalDate.of(2024, 9, 30),
                        null,
                        project3
                );

                sprintRepository.save(sprint1);
                sprintRepository.save(sprint2);
                sprintRepository.save(sprint3);
                sprintRepository.save(sprint4);

                logger.info("✓ Sprints inicializados correctamente (4 insertados)");

                // ========== TASKS PARA SPRINT 2 ==========
                LocalDate startBase = LocalDate.of(2025, 9, 22);
                        
                Task task1 = new Task("HU01 - Diseño de UI", 3, "Hacer wireframes de TomaTask project planner.",
                                Status.DONE, null, sprint2, kaledUser,
                                LocalDate.of(2025, 9, 22), LocalDate.of(2025, 9, 24), null);

                Task task2 = new Task("HU01 - Crear formulario de inicio de sesión", 2, "Campo de contraseña e inicio de sesión.",
                                Status.DONE, null, sprint2, cesarUser,
                                LocalDate.of(2025, 9, 23), LocalDate.of(2025, 9, 25), null);

                Task task3 = new Task("HU01 - Validación de correo y contraseña", 2, "Enviar código por correo electrónico.",
                                Status.DONE, null, sprint2, isaacUser,
                                LocalDate.of(2025, 9, 24), LocalDate.of(2025, 9, 26), null);

                Task task4 = new Task("HU01 - Implementar encriptación de contraseña", 3, "Algoritmo de hash para seguridad.",
                                Status.DONE, null, sprint2, arthurUser,
                                LocalDate.of(2025, 9, 25), LocalDate.of(2025, 9, 28), null);

                Task task5 = new Task("HU01 - Implementar validación de contraseña", 1, "Verificar longitud y complejidad mínima.",
                                Status.PENDING, null, sprint2, ranferiUser,
                                LocalDate.of(2025, 9, 26), LocalDate.of(2025, 9, 27), null);

                Task task6 = new Task("HU01 - Implementar sesiones y validación mediante JWT", 4, "Proteger rutas y mantener sesión activa.",
                                Status.PENDING, null, sprint2, kaledUser,
                                LocalDate.of(2025, 9, 27), LocalDate.of(2025, 9, 30), null);

                Task task7 = new Task("HU01 - Implementar mensaje de error en caso de credenciales inválidas", 1, "Mostrar alerta clara al usuario.",
                                Status.IN_PROGRESS, null, sprint2, cesarUser,
                                LocalDate.of(2025, 9, 28), LocalDate.of(2025, 9, 29), null);

                Task task8 = new Task("HU01 - Realizar pruebas unitarias y de integración", 3, "Validar correcto funcionamiento del flujo.",
                                Status.IN_PROGRESS, null, sprint2, isaacUser,
                                LocalDate.of(2025, 9, 29), LocalDate.of(2025, 10, 2), null);

                Task task9 = new Task("HU09 - Verificar que el usuario autenticado tenga rol de Manager", 2, "Comprobar permisos en endpoints protegidos.",
                                Status.PENDING, null, sprint2, arthurUser,
                                LocalDate.of(2025, 9, 30), LocalDate.of(2025, 10, 2), null);

                Task task10 = new Task("HU09 - Crear interfaz en el portal para gestión de equipos", 4, "Diseñar vista para administración de equipos.",
                                Status.PENDING, null, sprint2, ranferiUser,
                                LocalDate.of(2025, 10, 1), LocalDate.of(2025, 10, 4), null);

                Task task11 = new Task("HU09 - Diseñar formulario de creación de equipo", 3, "Campos: nombre, descripción, integrantes.",
                                Status.PENDING, null, sprint2, kaledUser,
                                LocalDate.of(2025, 10, 2), LocalDate.of(2025, 10, 5), null);

                Task task12 = new Task("HU09 - Implementar validaciones de campos obligatorios en frontend", 2, "Requerir nombre y mínimo un integrante.",
                                Status.PENDING, null, sprint2, cesarUser,
                                LocalDate.of(2025, 10, 3), LocalDate.of(2025, 10, 5), null);

                Task task13 = new Task("HU09 - Implementar validaciones de negocio en backend", 2, "Reglas de validación en controladores.",
                                Status.PENDING, null, sprint2, isaacUser,
                                LocalDate.of(2025, 10, 4), LocalDate.of(2025, 10, 6), null);

                Task task14 = new Task("HU09 - Configurar API para creación de equipos", 4, "Endpoint REST para registrar nuevos equipos.",
                                Status.IN_PROGRESS, null, sprint2, arthurUser,
                                LocalDate.of(2025, 10, 5), LocalDate.of(2025, 10, 8), null);

                Task task15 = new Task("HU09 - Implementar lógica de persistencia en base de datos", 3, "Guardar equipos e integrantes en BD.",
                                Status.PENDING, null, sprint2, ranferiUser,
                                LocalDate.of(2025, 10, 6), LocalDate.of(2025, 10, 9), null);

                Task task16 = new Task("HU09 - Conectar frontend con backend para envío de datos del formulario", 4, "Integración completa de formulario.",
                                Status.IN_PROGRESS, null, sprint2, kaledUser,
                                LocalDate.of(2025, 10, 7), LocalDate.of(2025, 10, 10), null);

                Task task17 = new Task("HU09 - Implementar manejo de errores y mostrar mensajes claros al usuario", 1, "Mensajes de error comprensibles.",
                                Status.PENDING, null, sprint2, cesarUser,
                                LocalDate.of(2025, 10, 8), LocalDate.of(2025, 10, 9), null);

                Task task18 = new Task("HU09 - Realizar pruebas unitarias y de integración del flujo de creación de equipos", 3, "Validar API y UI conjuntamente.",
                                Status.PENDING, null, sprint2, isaacUser,
                                LocalDate.of(2025, 10, 9), LocalDate.of(2025, 10, 12), null);

                Task task19 = new Task("HU28 - Implementar validaciones de campos obligatorios en frontend", 2, "Comprobar entradas requeridas en formulario.",
                                Status.PENDING, null, sprint2, arthurUser,
                                LocalDate.of(2025, 10, 10), LocalDate.of(2025, 10, 12), null);

                Task task20 = new Task("HU28 - Implementar validaciones de negocio en backend", 2, "Aplicar restricciones de datos en el servidor.",
                                Status.PENDING, null, sprint2, ranferiUser,
                                LocalDate.of(2025, 10, 11), LocalDate.of(2025, 10, 13), null);

                Task task21 = new Task("HU28 - Configurar API para agregar tareas vinculadas a una HU", 3, "Agregar rutas y controladores necesarios.",
                                Status.PENDING, null, sprint2, kaledUser,
                                LocalDate.of(2025, 10, 12), LocalDate.of(2025, 10, 15), null);

                Task task22 = new Task("HU28 - Implementar lógica de persistencia para tareas relacionadas con una HU", 3, "Guardar tareas vinculadas a historias.",
                                Status.PENDING, null, sprint2, cesarUser,
                                LocalDate.of(2025, 10, 13), LocalDate.of(2025, 10, 16), null);

                Task task23 = new Task("HU28 - Conectar frontend con backend para registrar nuevas tareas", 3, "Integrar formulario de creación de tareas.",
                                Status.PENDING, null, sprint2, isaacUser,
                                LocalDate.of(2025, 10, 14), LocalDate.of(2025, 10, 17), null);

                Task task24 = new Task("HU28 - Implementar manejo de errores y mostrar mensajes claros al usuario", 1, "Validar respuestas y mostrar mensajes.",
                                Status.PENDING, null, sprint2, arthurUser,
                                LocalDate.of(2025, 10, 15), LocalDate.of(2025, 10, 16), null);

                Task task25 = new Task("HU28 - Mostrar mensaje de confirmación cuando la tarea se crea correctamente", 1, "Notificación emergente de éxito.",
                                Status.IN_PROGRESS, null, sprint2, ranferiUser,
                                LocalDate.of(2025, 10, 16), LocalDate.of(2025, 10, 17), null);

                Task task26 = new Task("HU23 - Crear Historia de Usuario desde el portal", 4, "Función para crear historias y verlas en tablero.",
                                Status.PENDING, null, sprint2, kaledUser,
                                LocalDate.of(2025, 10, 17), LocalDate.of(2025, 10, 21), null);

                Task task27 = new Task("HU28 - Realizar pruebas unitarias y de integración para el flujo de creación de tareas", 3, "Validar componentes y endpoints.",
                                Status.PENDING, null, sprint2, cesarUser,
                                LocalDate.of(2025, 10, 18), LocalDate.of(2025, 10, 21), null);


                taskRepository.save(task1);
                taskRepository.save(task2);
                taskRepository.save(task3);
                taskRepository.save(task4);
                taskRepository.save(task5);
                taskRepository.save(task6);
                taskRepository.save(task7);
                taskRepository.save(task8);
                taskRepository.save(task9);
                taskRepository.save(task10);
                taskRepository.save(task11);
                taskRepository.save(task12);
                taskRepository.save(task13);
                taskRepository.save(task14);
                taskRepository.save(task15);
                taskRepository.save(task16);
                taskRepository.save(task17);
                taskRepository.save(task18);
                taskRepository.save(task19);
                taskRepository.save(task20);
                taskRepository.save(task21);
                taskRepository.save(task22);
                taskRepository.save(task23);
                taskRepository.save(task24);
                taskRepository.save(task25);
                taskRepository.save(task26);
                taskRepository.save(task27);

                logger.info("✓ Tareas inicializadas correctamente (27 insertadas)");
            } else {
                logger.info("✓ Proyectos, sprints y tareas ya existentes en la base de datos");
            }

            logger.info("✅ Seeding completado correctamente.");
        };
    }
}
