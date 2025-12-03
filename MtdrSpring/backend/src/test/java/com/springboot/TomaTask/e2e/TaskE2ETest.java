package com.springboot.TomaTask.e2e;

import com.springboot.TomaTask.dto.ProjectDTO;
import com.springboot.TomaTask.dto.SprintDTO;
import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.model.Task;
import com.springboot.TomaTask.repository.ProjectRepository;
import com.springboot.TomaTask.repository.SprintRepository;
import com.springboot.TomaTask.repository.TaskRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * End-to-End Integration Tests for Task API
 *
 * Tests the full stack: HTTP Request -> Controller -> Service -> Repository -> H2 Database
 *
 * Test Coverage:
 * - CRUD operations for Tasks
 * - Task-Sprint relationship
 * - Task status management (TODO, IN_PROGRESS, DONE)
 * - Completed tasks filtering
 * - HTTP status codes validation
 * - Database persistence verification
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Import(E2ETestConfig.class)
public class TaskE2ETest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private ProjectRepository projectRepository;

    private String baseUrl;
    private String sprintsUrl;
    private String projectsUrl;

    private ProjectDTO testProject;
    private SprintDTO testSprint;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port + "/api/tasks";
        sprintsUrl = "http://localhost:" + port + "/api/sprints";
        projectsUrl = "http://localhost:" + port + "/api/projects";

        // Clean database before each test
        taskRepository.deleteAll();
        sprintRepository.deleteAll();
        projectRepository.deleteAll();

        // Create test project and sprint
        testProject = createTestProject("E2E Test Project");
        testSprint = createTestSprint("E2E Test Sprint", testProject.getId());
    }

    // ========================================================================
    // CREATE TASK TESTS
    // ========================================================================

    @Test
    @DisplayName("E2E: POST /api/tasks - Should create task and return 201 CREATED")
    void testCreateTask_Returns201Created() {
        // GIVEN: A new task DTO
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setName("E2E Test Task");
        taskDTO.setDescription("Task created by E2E test");
        taskDTO.setStatus(Task.Status.TODO);
        taskDTO.setTimeEstimate(5);

        // WHEN: Creating the task via HTTP POST
        ResponseEntity<TaskDTO> response = restTemplate.postForEntity(
            baseUrl, taskDTO, TaskDTO.class);

        // THEN: HTTP 201 CREATED with task data
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getId());
        assertEquals("E2E Test Task", response.getBody().getName());
        assertEquals(Task.Status.TODO, response.getBody().getStatus());

        // AND: Task is persisted in database
        assertTrue(taskRepository.findById(response.getBody().getId()).isPresent());
    }

    @Test
    @DisplayName("E2E: POST /api/tasks - Should create task with sprint relationship")
    void testCreateTask_WithSprint_Returns201Created() {
        // GIVEN: A task DTO with sprint reference
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setName("Task with Sprint");
        taskDTO.setDescription("Task linked to sprint");
        taskDTO.setStatus(Task.Status.TODO);
        taskDTO.setTimeEstimate(3);
        taskDTO.setSprintId(testSprint.getId());

        // WHEN: Creating the task
        ResponseEntity<TaskDTO> response = restTemplate.postForEntity(
            baseUrl, taskDTO, TaskDTO.class);

        // THEN: HTTP 201 CREATED with sprint relationship
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Task with Sprint", response.getBody().getName());
        assertEquals(testSprint.getId(), response.getBody().getSprintId());
    }

    @Test
    @DisplayName("E2E: POST /api/tasks - Should persist all fields correctly")
    void testCreateTask_PersistsAllFields() {
        // GIVEN: A task with all fields
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setName("Full Task");
        taskDTO.setDescription("Complete task with all fields");
        taskDTO.setStatus(Task.Status.IN_PROGRESS);
        taskDTO.setTimeEstimate(10);
        taskDTO.setStartDate(LocalDate.of(2025, 1, 15));
        taskDTO.setEndDate(LocalDate.of(2025, 1, 30));
        taskDTO.setDeliveryDate(LocalDate.of(2025, 2, 1));
        taskDTO.setSprintId(testSprint.getId());

        // WHEN: Creating the task
        ResponseEntity<TaskDTO> response = restTemplate.postForEntity(
            baseUrl, taskDTO, TaskDTO.class);

        // THEN: All fields are persisted
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        TaskDTO created = response.getBody();
        assertNotNull(created);
        assertEquals("Full Task", created.getName());
        assertEquals("Complete task with all fields", created.getDescription());
        assertEquals(Task.Status.IN_PROGRESS, created.getStatus());
        assertEquals(10, created.getTimeEstimate());
        assertEquals(LocalDate.of(2025, 1, 15), created.getStartDate());
        assertEquals(LocalDate.of(2025, 1, 30), created.getEndDate());
        assertEquals(LocalDate.of(2025, 2, 1), created.getDeliveryDate());
    }

    @Test
    @DisplayName("E2E: POST /api/tasks - Should return error for invalid sprint ID")
    void testCreateTask_WithInvalidSprintId_ReturnsError() {
        // GIVEN: A task with non-existent sprint ID
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setName("Task with invalid sprint");
        taskDTO.setStatus(Task.Status.TODO);
        taskDTO.setSprintId("non-existent-sprint-id");

        // WHEN: Creating the task
        ResponseEntity<String> response = restTemplate.postForEntity(
            baseUrl, taskDTO, String.class);

        // THEN: HTTP error response (4xx or 5xx)
        assertTrue(response.getStatusCode().is4xxClientError() ||
                   response.getStatusCode().is5xxServerError(),
                   "Expected error status code but got: " + response.getStatusCode());
    }

    // ========================================================================
    // READ TASK TESTS
    // ========================================================================

    @Test
    @DisplayName("E2E: GET /api/tasks - Should return all tasks with 200 OK")
    void testGetAllTasks_Returns200WithList() {
        // GIVEN: Multiple tasks in database
        createTestTask("Task Alpha", Task.Status.TODO);
        createTestTask("Task Beta", Task.Status.IN_PROGRESS);
        createTestTask("Task Gamma", Task.Status.DONE);

        // WHEN: Getting all tasks
        ResponseEntity<List<TaskDTO>> response = restTemplate.exchange(
            baseUrl,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<TaskDTO>>() {}
        );

        // THEN: HTTP 200 with list of tasks
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(3, response.getBody().size());
    }

    @Test
    @DisplayName("E2E: GET /api/tasks - Should return empty list when no tasks exist")
    void testGetAllTasks_WhenEmpty_Returns200WithEmptyList() {
        // GIVEN: No tasks in database (cleaned in setUp)

        // WHEN: Getting all tasks
        ResponseEntity<List<TaskDTO>> response = restTemplate.exchange(
            baseUrl,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<TaskDTO>>() {}
        );

        // THEN: HTTP 200 with empty list
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().size());
    }

    @Test
    @DisplayName("E2E: GET /api/tasks/{id} - Should return task by ID with 200 OK")
    void testGetTaskById_Returns200WithTask() {
        // GIVEN: A task in database
        TaskDTO created = createTestTask("Task Delta", Task.Status.TODO);

        // WHEN: Getting task by ID
        ResponseEntity<TaskDTO> response = restTemplate.getForEntity(
            baseUrl + "/" + created.getId(), TaskDTO.class);

        // THEN: HTTP 200 with task data
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(created.getId(), response.getBody().getId());
        assertEquals("Task Delta", response.getBody().getName());
    }

    @Test
    @DisplayName("E2E: GET /api/tasks/{id} - Should return error for non-existent task")
    void testGetTaskById_WhenNotFound_ReturnsError() {
        // GIVEN: A non-existent task ID
        String nonExistentId = "non-existent-task-id";

        // WHEN: Getting task by non-existent ID
        ResponseEntity<String> response = restTemplate.getForEntity(
            baseUrl + "/" + nonExistentId, String.class);

        // THEN: HTTP error response (4xx or 5xx)
        assertTrue(response.getStatusCode().is4xxClientError() ||
                   response.getStatusCode().is5xxServerError(),
                   "Expected error status code but got: " + response.getStatusCode());
    }

    @Test
    @DisplayName("E2E: GET /api/tasks/sprint/{sprintId} - Should return tasks by sprint")
    void testGetTasksBySprintId_Returns200WithList() {
        // GIVEN: Multiple tasks for a sprint
        createTestTaskWithSprint("Sprint Task 1", Task.Status.TODO, testSprint.getId());
        createTestTaskWithSprint("Sprint Task 2", Task.Status.IN_PROGRESS, testSprint.getId());

        // AND: A task without sprint
        createTestTask("No Sprint Task", Task.Status.TODO);

        // WHEN: Getting tasks by sprint ID
        ResponseEntity<List<TaskDTO>> response = restTemplate.exchange(
            baseUrl + "/sprint/" + testSprint.getId(),
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<TaskDTO>>() {}
        );

        // THEN: HTTP 200 with only tasks for the specified sprint
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertTrue(response.getBody().stream()
            .allMatch(t -> testSprint.getId().equals(t.getSprintId())));
    }

    // ========================================================================
    // COMPLETED TASKS TESTS (Feature 2 & 3)
    // ========================================================================

    @Test
    @DisplayName("E2E: GET /api/tasks/sprint/{sprintId}/completed - Should return completed tasks for sprint")
    void testGetCompletedTasksBySprintId_Returns200WithCompletedTasks() {
        // GIVEN: Tasks with various statuses in a sprint
        createTestTaskWithSprint("Completed Task 1", Task.Status.DONE, testSprint.getId());
        createTestTaskWithSprint("Completed Task 2", Task.Status.DONE, testSprint.getId());
        createTestTaskWithSprint("In Progress Task", Task.Status.IN_PROGRESS, testSprint.getId());
        createTestTaskWithSprint("Todo Task", Task.Status.TODO, testSprint.getId());

        // WHEN: Getting completed tasks for sprint
        ResponseEntity<List<TaskDTO>> response = restTemplate.exchange(
            baseUrl + "/sprint/" + testSprint.getId() + "/completed",
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<TaskDTO>>() {}
        );

        // THEN: HTTP 200 with only DONE tasks
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertTrue(response.getBody().stream()
            .allMatch(t -> t.getStatus() == Task.Status.DONE));
    }

    @Test
    @DisplayName("E2E: GET /api/tasks/sprint/{sprintId}/completed - Should return empty list when no completed tasks")
    void testGetCompletedTasksBySprintId_WhenNoCompleted_ReturnsEmptyList() {
        // GIVEN: Only non-completed tasks in sprint
        createTestTaskWithSprint("In Progress Task", Task.Status.IN_PROGRESS, testSprint.getId());
        createTestTaskWithSprint("Todo Task", Task.Status.TODO, testSprint.getId());

        // WHEN: Getting completed tasks for sprint
        ResponseEntity<List<TaskDTO>> response = restTemplate.exchange(
            baseUrl + "/sprint/" + testSprint.getId() + "/completed",
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<TaskDTO>>() {}
        );

        // THEN: HTTP 200 with empty list
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().size());
    }

    // ========================================================================
    // UPDATE TASK TESTS
    // ========================================================================

    @Test
    @DisplayName("E2E: PUT /api/tasks/{id} - Should update task and return 200 OK")
    void testUpdateTask_Returns200WithUpdatedTask() {
        // GIVEN: An existing task
        TaskDTO created = createTestTask("Original Task", Task.Status.TODO);

        // AND: Updated data
        TaskDTO updateDTO = new TaskDTO();
        updateDTO.setName("Updated Task Name");
        updateDTO.setDescription("Updated description");
        updateDTO.setStatus(Task.Status.IN_PROGRESS);
        updateDTO.setTimeEstimate(8);

        // WHEN: Updating the task
        ResponseEntity<TaskDTO> response = restTemplate.exchange(
            baseUrl + "/" + created.getId(),
            HttpMethod.PUT,
            new HttpEntity<>(updateDTO),
            TaskDTO.class
        );

        // THEN: HTTP 200 with updated data
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Updated Task Name", response.getBody().getName());
        assertEquals("Updated description", response.getBody().getDescription());
        assertEquals(Task.Status.IN_PROGRESS, response.getBody().getStatus());
        assertEquals(8, response.getBody().getTimeEstimate());

        // AND: Database reflects the update
        var dbTask = taskRepository.findById(created.getId());
        assertTrue(dbTask.isPresent());
        assertEquals("Updated Task Name", dbTask.get().getName());
    }

    @Test
    @DisplayName("E2E: PUT /api/tasks/{id} - Should update task status from TODO to DONE")
    void testUpdateTask_StatusTransition_ToDone() {
        // GIVEN: A task in TODO status
        TaskDTO created = createTestTask("Task to Complete", Task.Status.TODO);

        // AND: Update to DONE
        TaskDTO updateDTO = new TaskDTO();
        updateDTO.setName("Task to Complete");
        updateDTO.setStatus(Task.Status.DONE);

        // WHEN: Updating the task status
        ResponseEntity<TaskDTO> response = restTemplate.exchange(
            baseUrl + "/" + created.getId(),
            HttpMethod.PUT,
            new HttpEntity<>(updateDTO),
            TaskDTO.class
        );

        // THEN: HTTP 200 with DONE status
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Task.Status.DONE, response.getBody().getStatus());
    }

    @Test
    @DisplayName("E2E: PUT /api/tasks/{id} - Should return error for non-existent task")
    void testUpdateTask_WhenNotFound_ReturnsError() {
        // GIVEN: A non-existent task ID
        String nonExistentId = "non-existent-task-id";
        TaskDTO updateDTO = new TaskDTO();
        updateDTO.setName("Update Non-existent");
        updateDTO.setStatus(Task.Status.TODO);

        // WHEN: Updating non-existent task
        ResponseEntity<String> response = restTemplate.exchange(
            baseUrl + "/" + nonExistentId,
            HttpMethod.PUT,
            new HttpEntity<>(updateDTO),
            String.class
        );

        // THEN: HTTP error response (4xx or 5xx)
        assertTrue(response.getStatusCode().is4xxClientError() ||
                   response.getStatusCode().is5xxServerError(),
                   "Expected error status code but got: " + response.getStatusCode());
    }

    // ========================================================================
    // DELETE TASK TESTS
    // ========================================================================

    @Test
    @DisplayName("E2E: DELETE /api/tasks/{id} - Should delete task and return 204 NO CONTENT")
    void testDeleteTask_Returns204NoContent() {
        // GIVEN: An existing task
        TaskDTO created = createTestTask("Task to Delete", Task.Status.TODO);
        String taskId = created.getId();

        // Verify it exists
        assertTrue(taskRepository.findById(taskId).isPresent());

        // WHEN: Deleting the task
        ResponseEntity<Void> response = restTemplate.exchange(
            baseUrl + "/" + taskId,
            HttpMethod.DELETE,
            null,
            Void.class
        );

        // THEN: HTTP 204 NO CONTENT
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

        // AND: Task is removed from database
        assertFalse(taskRepository.findById(taskId).isPresent());
    }

    // ========================================================================
    // FULL CRUD FLOW TEST
    // ========================================================================

    @Test
    @DisplayName("E2E: Full CRUD flow for Task - Create, Read, Update, Delete")
    void testFullCRUDFlow() {
        // 1. CREATE
        TaskDTO createDTO = new TaskDTO();
        createDTO.setName("CRUD Test Task");
        createDTO.setDescription("Testing full CRUD flow");
        createDTO.setStatus(Task.Status.TODO);
        createDTO.setTimeEstimate(5);
        createDTO.setSprintId(testSprint.getId());

        ResponseEntity<TaskDTO> createResponse = restTemplate.postForEntity(
            baseUrl, createDTO, TaskDTO.class);
        assertEquals(HttpStatus.CREATED, createResponse.getStatusCode());
        String taskId = createResponse.getBody().getId();
        assertNotNull(taskId);

        // 2. READ
        ResponseEntity<TaskDTO> readResponse = restTemplate.getForEntity(
            baseUrl + "/" + taskId, TaskDTO.class);
        assertEquals(HttpStatus.OK, readResponse.getStatusCode());
        assertEquals("CRUD Test Task", readResponse.getBody().getName());
        assertEquals(Task.Status.TODO, readResponse.getBody().getStatus());

        // 3. UPDATE (status transition)
        TaskDTO updateDTO = new TaskDTO();
        updateDTO.setName("Updated CRUD Task");
        updateDTO.setDescription("Updated description");
        updateDTO.setStatus(Task.Status.IN_PROGRESS);
        updateDTO.setTimeEstimate(8);

        ResponseEntity<TaskDTO> updateResponse = restTemplate.exchange(
            baseUrl + "/" + taskId,
            HttpMethod.PUT,
            new HttpEntity<>(updateDTO),
            TaskDTO.class
        );
        assertEquals(HttpStatus.OK, updateResponse.getStatusCode());
        assertEquals("Updated CRUD Task", updateResponse.getBody().getName());
        assertEquals(Task.Status.IN_PROGRESS, updateResponse.getBody().getStatus());

        // 4. UPDATE (complete task)
        TaskDTO completeDTO = new TaskDTO();
        completeDTO.setName("Updated CRUD Task");
        completeDTO.setStatus(Task.Status.DONE);

        ResponseEntity<TaskDTO> completeResponse = restTemplate.exchange(
            baseUrl + "/" + taskId,
            HttpMethod.PUT,
            new HttpEntity<>(completeDTO),
            TaskDTO.class
        );
        assertEquals(HttpStatus.OK, completeResponse.getStatusCode());
        assertEquals(Task.Status.DONE, completeResponse.getBody().getStatus());

        // 5. DELETE
        ResponseEntity<Void> deleteResponse = restTemplate.exchange(
            baseUrl + "/" + taskId,
            HttpMethod.DELETE,
            null,
            Void.class
        );
        assertEquals(HttpStatus.NO_CONTENT, deleteResponse.getStatusCode());

        // 6. VERIFY DELETION
        assertFalse(taskRepository.findById(taskId).isPresent());
    }

    @Test
    @DisplayName("E2E: Task workflow - TODO -> IN_PROGRESS -> DONE")
    void testTaskWorkflow_StatusTransitions() {
        // 1. Create task in TODO
        TaskDTO createDTO = new TaskDTO();
        createDTO.setName("Workflow Task");
        createDTO.setStatus(Task.Status.TODO);
        createDTO.setSprintId(testSprint.getId());

        ResponseEntity<TaskDTO> createResponse = restTemplate.postForEntity(
            baseUrl, createDTO, TaskDTO.class);
        String taskId = createResponse.getBody().getId();
        assertEquals(Task.Status.TODO, createResponse.getBody().getStatus());

        // 2. Move to IN_PROGRESS
        TaskDTO inProgressDTO = new TaskDTO();
        inProgressDTO.setName("Workflow Task");
        inProgressDTO.setStatus(Task.Status.IN_PROGRESS);

        ResponseEntity<TaskDTO> inProgressResponse = restTemplate.exchange(
            baseUrl + "/" + taskId,
            HttpMethod.PUT,
            new HttpEntity<>(inProgressDTO),
            TaskDTO.class
        );
        assertEquals(Task.Status.IN_PROGRESS, inProgressResponse.getBody().getStatus());

        // 3. Move to DONE
        TaskDTO doneDTO = new TaskDTO();
        doneDTO.setName("Workflow Task");
        doneDTO.setStatus(Task.Status.DONE);

        ResponseEntity<TaskDTO> doneResponse = restTemplate.exchange(
            baseUrl + "/" + taskId,
            HttpMethod.PUT,
            new HttpEntity<>(doneDTO),
            TaskDTO.class
        );
        assertEquals(Task.Status.DONE, doneResponse.getBody().getStatus());

        // 4. Verify task appears in completed tasks
        ResponseEntity<List<TaskDTO>> completedResponse = restTemplate.exchange(
            baseUrl + "/sprint/" + testSprint.getId() + "/completed",
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<TaskDTO>>() {}
        );
        assertTrue(completedResponse.getBody().stream()
            .anyMatch(t -> t.getId().equals(taskId)));
    }

    // ========================================================================
    // HELPER METHODS
    // ========================================================================

    /**
     * Helper method to create a test project via API
     */
    private ProjectDTO createTestProject(String name) {
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setName(name);
        projectDTO.setStatus("active");
        projectDTO.setStartDate(LocalDate.of(2025, 1, 1));

        ResponseEntity<ProjectDTO> response = restTemplate.postForEntity(
            projectsUrl, projectDTO, ProjectDTO.class);

        return response.getBody();
    }

    /**
     * Helper method to create a test sprint via API
     */
    private SprintDTO createTestSprint(String description, String projectId) {
        SprintDTO sprintDTO = new SprintDTO();
        sprintDTO.setDescription(description);
        sprintDTO.setStatus("active");
        sprintDTO.setStartDate(LocalDate.of(2025, 1, 1));
        sprintDTO.setProjectId(projectId);

        ResponseEntity<SprintDTO> response = restTemplate.postForEntity(
            sprintsUrl, sprintDTO, SprintDTO.class);

        return response.getBody();
    }

    /**
     * Helper method to create a test task via API (without sprint)
     */
    private TaskDTO createTestTask(String name, Task.Status status) {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setName(name);
        taskDTO.setStatus(status);
        taskDTO.setTimeEstimate(5);

        ResponseEntity<TaskDTO> response = restTemplate.postForEntity(
            baseUrl, taskDTO, TaskDTO.class);

        return response.getBody();
    }

    /**
     * Helper method to create a test task with sprint via API
     */
    private TaskDTO createTestTaskWithSprint(String name, Task.Status status, String sprintId) {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setName(name);
        taskDTO.setStatus(status);
        taskDTO.setTimeEstimate(5);
        taskDTO.setSprintId(sprintId);

        ResponseEntity<TaskDTO> response = restTemplate.postForEntity(
            baseUrl, taskDTO, TaskDTO.class);

        return response.getBody();
    }
}
