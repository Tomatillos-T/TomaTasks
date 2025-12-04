package com.springboot.TomaTask.e2e;

import com.springboot.TomaTask.dto.ProjectDTO;
import com.springboot.TomaTask.dto.SprintDTO;
import com.springboot.TomaTask.repository.ProjectRepository;
import com.springboot.TomaTask.repository.SprintRepository;

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
 * End-to-End Integration Tests for Sprint API
 *
 * Tests the full stack: HTTP Request -> Controller -> Service -> Repository -> H2 Database
 *
 * Test Coverage:
 * - CRUD operations for Sprints
 * - Sprint-Project relationship
 * - HTTP status codes validation
 * - Database persistence verification
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Import(E2ETestConfig.class)
public class SprintE2ETest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private ProjectRepository projectRepository;

    private String baseUrl;
    private String projectsUrl;
    private ProjectDTO testProject;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port + "/api/sprints";
        projectsUrl = "http://localhost:" + port + "/api/projects";

        // Clean database before each test
        sprintRepository.deleteAll();
        projectRepository.deleteAll();

        // Create a test project (required for sprint creation)
        testProject = createTestProject("E2E Test Project");
    }

    // ========================================================================
    // CREATE SPRINT TESTS
    // ========================================================================

    @Test
    @DisplayName("E2E: POST /api/sprints - Should create sprint with project and return 201 CREATED")
    void testCreateSprint_WithProject_Returns201Created() {
        // GIVEN: A sprint DTO with project reference
        SprintDTO sprintDTO = new SprintDTO();
        sprintDTO.setDescription("Sprint 1 - E2E Test");
        sprintDTO.setStatus("active");
        sprintDTO.setStartDate(LocalDate.of(2025, 1, 1));
        sprintDTO.setEndDate(LocalDate.of(2025, 1, 14));
        sprintDTO.setProjectId(testProject.getId());

        // WHEN: Creating the sprint via HTTP POST
        ResponseEntity<SprintDTO> response = restTemplate.postForEntity(
            baseUrl, sprintDTO, SprintDTO.class);

        // THEN: HTTP 201 CREATED with sprint data
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getId());
        assertEquals("Sprint 1 - E2E Test", response.getBody().getDescription());
        assertEquals("active", response.getBody().getStatus());
        assertEquals(testProject.getId(), response.getBody().getProjectId());

        // AND: Sprint is persisted in database
        assertTrue(sprintRepository.findById(response.getBody().getId()).isPresent());
    }

    @Test
    @DisplayName("E2E: POST /api/sprints - Should persist all fields correctly")
    void testCreateSprint_PersistsAllFields() {
        // GIVEN: A sprint with all fields
        SprintDTO sprintDTO = new SprintDTO();
        sprintDTO.setDescription("Complete Sprint with all fields");
        sprintDTO.setStatus("planning");
        sprintDTO.setStartDate(LocalDate.of(2025, 2, 1));
        sprintDTO.setEndDate(LocalDate.of(2025, 2, 14));
        sprintDTO.setDeliveryDate(LocalDate.of(2025, 2, 15));
        sprintDTO.setProjectId(testProject.getId());

        // WHEN: Creating the sprint
        ResponseEntity<SprintDTO> response = restTemplate.postForEntity(
            baseUrl, sprintDTO, SprintDTO.class);

        // THEN: All fields are persisted
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        SprintDTO created = response.getBody();
        assertNotNull(created);
        assertEquals("Complete Sprint with all fields", created.getDescription());
        assertEquals("planning", created.getStatus());
        assertEquals(LocalDate.of(2025, 2, 1), created.getStartDate());
        assertEquals(LocalDate.of(2025, 2, 14), created.getEndDate());
        assertEquals(LocalDate.of(2025, 2, 15), created.getDeliveryDate());
        assertEquals(testProject.getId(), created.getProjectId());
    }

    @Test
    @DisplayName("E2E: POST /api/sprints - Should return error for invalid project ID")
    void testCreateSprint_WithInvalidProjectId_ReturnsError() {
        // GIVEN: A sprint with non-existent project ID
        SprintDTO sprintDTO = new SprintDTO();
        sprintDTO.setDescription("Sprint with invalid project");
        sprintDTO.setStatus("active");
        sprintDTO.setStartDate(LocalDate.of(2025, 1, 1));
        sprintDTO.setProjectId("non-existent-project-id");

        // WHEN: Creating the sprint
        ResponseEntity<String> response = restTemplate.postForEntity(
            baseUrl, sprintDTO, String.class);

        // THEN: HTTP error response (4xx or 5xx)
        assertTrue(response.getStatusCode().is4xxClientError() ||
                   response.getStatusCode().is5xxServerError(),
                   "Expected error status code but got: " + response.getStatusCode());
    }

    // ========================================================================
    // READ SPRINT TESTS
    // ========================================================================

    @Test
    @DisplayName("E2E: GET /api/sprints - Should return all sprints with 200 OK")
    void testGetAllSprints_Returns200WithList() {
        // GIVEN: Two sprints in database
        createTestSprint("Sprint Alpha", testProject.getId());
        createTestSprint("Sprint Beta", testProject.getId());

        // WHEN: Getting all sprints
        ResponseEntity<List<SprintDTO>> response = restTemplate.exchange(
            baseUrl,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<SprintDTO>>() {}
        );

        // THEN: HTTP 200 with list of sprints
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
    }

    @Test
    @DisplayName("E2E: GET /api/sprints - Should return empty list when no sprints exist")
    void testGetAllSprints_WhenEmpty_Returns200WithEmptyList() {
        // GIVEN: No sprints in database (cleaned in setUp)

        // WHEN: Getting all sprints
        ResponseEntity<List<SprintDTO>> response = restTemplate.exchange(
            baseUrl,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<SprintDTO>>() {}
        );

        // THEN: HTTP 200 with empty list
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().size());
    }

    @Test
    @DisplayName("E2E: GET /api/sprints/{id} - Should return sprint by ID with 200 OK")
    void testGetSprintById_Returns200WithSprint() {
        // GIVEN: A sprint in database
        SprintDTO created = createTestSprint("Sprint Gamma", testProject.getId());

        // WHEN: Getting sprint by ID
        ResponseEntity<SprintDTO> response = restTemplate.getForEntity(
            baseUrl + "/" + created.getId(), SprintDTO.class);

        // THEN: HTTP 200 with sprint data
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(created.getId(), response.getBody().getId());
        assertEquals("Sprint Gamma", response.getBody().getDescription());
    }

    @Test
    @DisplayName("E2E: GET /api/sprints/{id} - Should return error for non-existent sprint")
    void testGetSprintById_WhenNotFound_ReturnsError() {
        // GIVEN: A non-existent sprint ID
        String nonExistentId = "non-existent-sprint-id";

        // WHEN: Getting sprint by non-existent ID
        ResponseEntity<String> response = restTemplate.getForEntity(
            baseUrl + "/" + nonExistentId, String.class);

        // THEN: HTTP error response (4xx or 5xx)
        assertTrue(response.getStatusCode().is4xxClientError() ||
                   response.getStatusCode().is5xxServerError(),
                   "Expected error status code but got: " + response.getStatusCode());
    }

    @Test
    @DisplayName("E2E: GET /api/sprints/project/{projectId} - Should return sprints by project")
    void testGetSprintsByProjectId_Returns200WithList() {
        // GIVEN: Multiple sprints for a project
        createTestSprint("Sprint 1", testProject.getId());
        createTestSprint("Sprint 2", testProject.getId());

        // AND: A different project with its own sprint
        ProjectDTO otherProject = createTestProject("Other Project");
        createTestSprint("Other Sprint", otherProject.getId());

        // WHEN: Getting sprints by project ID
        ResponseEntity<List<SprintDTO>> response = restTemplate.exchange(
            baseUrl + "/project/" + testProject.getId(),
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<SprintDTO>>() {}
        );

        // THEN: HTTP 200 with only sprints for the specified project
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertTrue(response.getBody().stream()
            .allMatch(s -> testProject.getId().equals(s.getProjectId())));
    }

    // ========================================================================
    // UPDATE SPRINT TESTS
    // ========================================================================

    @Test
    @DisplayName("E2E: PUT /api/sprints/{id} - Should update sprint and return 200 OK")
    void testUpdateSprint_Returns200WithUpdatedSprint() {
        // GIVEN: An existing sprint
        SprintDTO created = createTestSprint("Original Sprint", testProject.getId());

        // AND: Updated data
        SprintDTO updateDTO = new SprintDTO();
        updateDTO.setDescription("Updated Sprint Description");
        updateDTO.setStatus("completed");
        updateDTO.setStartDate(LocalDate.of(2025, 3, 1));
        updateDTO.setEndDate(LocalDate.of(2025, 3, 14));
        updateDTO.setProjectId(testProject.getId());

        // WHEN: Updating the sprint
        ResponseEntity<SprintDTO> response = restTemplate.exchange(
            baseUrl + "/" + created.getId(),
            HttpMethod.PUT,
            new HttpEntity<>(updateDTO),
            SprintDTO.class
        );

        // THEN: HTTP 200 with updated data
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Updated Sprint Description", response.getBody().getDescription());
        assertEquals("completed", response.getBody().getStatus());

        // AND: Database reflects the update
        var dbSprint = sprintRepository.findById(created.getId());
        assertTrue(dbSprint.isPresent());
        assertEquals("Updated Sprint Description", dbSprint.get().getDescription());
    }

    @Test
    @DisplayName("E2E: PUT /api/sprints/{id} - Should return error for non-existent sprint")
    void testUpdateSprint_WhenNotFound_ReturnsError() {
        // GIVEN: A non-existent sprint ID
        String nonExistentId = "non-existent-sprint-id";
        SprintDTO updateDTO = new SprintDTO();
        updateDTO.setDescription("Update Non-existent");
        updateDTO.setStatus("active");
        updateDTO.setStartDate(LocalDate.now());
        updateDTO.setProjectId(testProject.getId());

        // WHEN: Updating non-existent sprint
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
    // DELETE SPRINT TESTS
    // ========================================================================

    @Test
    @DisplayName("E2E: DELETE /api/sprints/{id} - Should delete sprint and return 204 NO CONTENT")
    void testDeleteSprint_Returns204NoContent() {
        // GIVEN: An existing sprint
        SprintDTO created = createTestSprint("Sprint to Delete", testProject.getId());
        String sprintId = created.getId();

        // Verify it exists
        assertTrue(sprintRepository.findById(sprintId).isPresent());

        // WHEN: Deleting the sprint
        ResponseEntity<Void> response = restTemplate.exchange(
            baseUrl + "/" + sprintId,
            HttpMethod.DELETE,
            null,
            Void.class
        );

        // THEN: HTTP 204 NO CONTENT
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

        // AND: Sprint is removed from database
        assertFalse(sprintRepository.findById(sprintId).isPresent());
    }

    // ========================================================================
    // FULL CRUD FLOW TEST
    // ========================================================================

    @Test
    @DisplayName("E2E: Full CRUD flow for Sprint - Create, Read, Update, Delete")
    void testFullCRUDFlow() {
        // 1. CREATE
        SprintDTO createDTO = new SprintDTO();
        createDTO.setDescription("CRUD Test Sprint");
        createDTO.setStatus("planning");
        createDTO.setStartDate(LocalDate.of(2025, 1, 1));
        createDTO.setEndDate(LocalDate.of(2025, 1, 14));
        createDTO.setProjectId(testProject.getId());

        ResponseEntity<SprintDTO> createResponse = restTemplate.postForEntity(
            baseUrl, createDTO, SprintDTO.class);
        assertEquals(HttpStatus.CREATED, createResponse.getStatusCode());
        String sprintId = createResponse.getBody().getId();
        assertNotNull(sprintId);

        // 2. READ
        ResponseEntity<SprintDTO> readResponse = restTemplate.getForEntity(
            baseUrl + "/" + sprintId, SprintDTO.class);
        assertEquals(HttpStatus.OK, readResponse.getStatusCode());
        assertEquals("CRUD Test Sprint", readResponse.getBody().getDescription());

        // 3. UPDATE
        SprintDTO updateDTO = new SprintDTO();
        updateDTO.setDescription("Updated CRUD Sprint");
        updateDTO.setStatus("active");
        updateDTO.setStartDate(LocalDate.of(2025, 1, 1));
        updateDTO.setProjectId(testProject.getId());

        ResponseEntity<SprintDTO> updateResponse = restTemplate.exchange(
            baseUrl + "/" + sprintId,
            HttpMethod.PUT,
            new HttpEntity<>(updateDTO),
            SprintDTO.class
        );
        assertEquals(HttpStatus.OK, updateResponse.getStatusCode());
        assertEquals("Updated CRUD Sprint", updateResponse.getBody().getDescription());
        assertEquals("active", updateResponse.getBody().getStatus());

        // 4. DELETE
        ResponseEntity<Void> deleteResponse = restTemplate.exchange(
            baseUrl + "/" + sprintId,
            HttpMethod.DELETE,
            null,
            Void.class
        );
        assertEquals(HttpStatus.NO_CONTENT, deleteResponse.getStatusCode());

        // 5. VERIFY DELETION
        assertFalse(sprintRepository.findById(sprintId).isPresent());
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
            baseUrl, sprintDTO, SprintDTO.class);

        return response.getBody();
    }
}
