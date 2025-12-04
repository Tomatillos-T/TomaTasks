package com.springboot.TomaTask.e2e;

import com.springboot.TomaTask.dto.ProjectDTO;
import com.springboot.TomaTask.repository.ProjectRepository;

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
 * End-to-End Integration Tests for Project API
 *
 * Tests the full stack: HTTP Request -> Controller -> Service -> Repository -> H2 Database
 *
 * Test Coverage:
 * - CRUD operations for Projects
 * - HTTP status codes validation
 * - Database persistence verification
 * - Error handling scenarios
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Import(E2ETestConfig.class)
public class ProjectE2ETest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ProjectRepository projectRepository;

    private String baseUrl;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port + "/api/projects";
        // Clean database before each test
        projectRepository.deleteAll();
    }

    // ========================================================================
    // CREATE PROJECT TESTS
    // ========================================================================

    @Test
    @DisplayName("E2E: POST /api/projects - Should create project and return 201 CREATED")
    void testCreateProject_Returns201Created() {
        // GIVEN: A new project DTO
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setName("TomaTasks E2E");
        projectDTO.setDescription("End-to-end test project");
        projectDTO.setStatus("active");
        projectDTO.setStartDate(LocalDate.of(2025, 1, 1));

        // WHEN: Creating the project via HTTP POST
        ResponseEntity<ProjectDTO> response = restTemplate.postForEntity(
            baseUrl, projectDTO, ProjectDTO.class);

        // THEN: HTTP 201 CREATED with project data
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getId());
        assertEquals("TomaTasks E2E", response.getBody().getName());
        assertEquals("active", response.getBody().getStatus());

        // AND: Project is persisted in database
        assertTrue(projectRepository.findById(response.getBody().getId()).isPresent());
    }

    @Test
    @DisplayName("E2E: POST /api/projects - Should persist all fields correctly")
    void testCreateProject_PersistsAllFields() {
        // GIVEN: A project with all fields
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setName("Full Project");
        projectDTO.setDescription("Complete project with all fields");
        projectDTO.setStatus("planning");
        projectDTO.setStartDate(LocalDate.of(2025, 2, 1));
        projectDTO.setEndDate(LocalDate.of(2025, 6, 30));
        projectDTO.setDeliveryDate(LocalDate.of(2025, 7, 15));

        // WHEN: Creating the project
        ResponseEntity<ProjectDTO> response = restTemplate.postForEntity(
            baseUrl, projectDTO, ProjectDTO.class);

        // THEN: All fields are persisted
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        ProjectDTO created = response.getBody();
        assertNotNull(created);
        assertEquals("Full Project", created.getName());
        assertEquals("Complete project with all fields", created.getDescription());
        assertEquals("planning", created.getStatus());
        assertEquals(LocalDate.of(2025, 2, 1), created.getStartDate());
        assertEquals(LocalDate.of(2025, 6, 30), created.getEndDate());
        assertEquals(LocalDate.of(2025, 7, 15), created.getDeliveryDate());
    }

    // ========================================================================
    // READ PROJECT TESTS
    // ========================================================================

    @Test
    @DisplayName("E2E: GET /api/projects - Should return all projects with 200 OK")
    void testGetAllProjects_Returns200WithList() {
        // GIVEN: Two projects in database
        createTestProject("Project Alpha", "active");
        createTestProject("Project Beta", "planning");

        // WHEN: Getting all projects
        ResponseEntity<List<ProjectDTO>> response = restTemplate.exchange(
            baseUrl,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<ProjectDTO>>() {}
        );

        // THEN: HTTP 200 with list of projects
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
    }

    @Test
    @DisplayName("E2E: GET /api/projects - Should return empty list when no projects exist")
    void testGetAllProjects_WhenEmpty_Returns200WithEmptyList() {
        // GIVEN: No projects in database (cleaned in setUp)

        // WHEN: Getting all projects
        ResponseEntity<List<ProjectDTO>> response = restTemplate.exchange(
            baseUrl,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<ProjectDTO>>() {}
        );

        // THEN: HTTP 200 with empty list
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().size());
    }

    @Test
    @DisplayName("E2E: GET /api/projects/{id} - Should return project by ID with 200 OK")
    void testGetProjectById_Returns200WithProject() {
        // GIVEN: A project in database
        ProjectDTO created = createTestProject("Project Gamma", "active");

        // WHEN: Getting project by ID
        ResponseEntity<ProjectDTO> response = restTemplate.getForEntity(
            baseUrl + "/" + created.getId(), ProjectDTO.class);

        // THEN: HTTP 200 with project data
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(created.getId(), response.getBody().getId());
        assertEquals("Project Gamma", response.getBody().getName());
    }

    @Test
    @DisplayName("E2E: GET /api/projects/{id} - Should return error for non-existent project")
    void testGetProjectById_WhenNotFound_ReturnsError() {
        // GIVEN: A non-existent project ID
        String nonExistentId = "non-existent-id-12345";

        // WHEN: Getting project by non-existent ID
        ResponseEntity<String> response = restTemplate.getForEntity(
            baseUrl + "/" + nonExistentId, String.class);

        // THEN: HTTP error response (4xx or 5xx)
        assertTrue(response.getStatusCode().is4xxClientError() ||
                   response.getStatusCode().is5xxServerError(),
                   "Expected error status code but got: " + response.getStatusCode());
    }

    // ========================================================================
    // UPDATE PROJECT TESTS
    // ========================================================================

    @Test
    @DisplayName("E2E: PUT /api/projects/{id} - Should update project and return 200 OK")
    void testUpdateProject_Returns200WithUpdatedProject() {
        // GIVEN: An existing project
        ProjectDTO created = createTestProject("Original Name", "planning");

        // AND: Updated data
        ProjectDTO updateDTO = new ProjectDTO();
        updateDTO.setName("Updated Name");
        updateDTO.setDescription("Updated description");
        updateDTO.setStatus("active");
        updateDTO.setStartDate(LocalDate.of(2025, 3, 1));

        // WHEN: Updating the project
        ResponseEntity<ProjectDTO> response = restTemplate.exchange(
            baseUrl + "/" + created.getId(),
            HttpMethod.PUT,
            new HttpEntity<>(updateDTO),
            ProjectDTO.class
        );

        // THEN: HTTP 200 with updated data
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Updated Name", response.getBody().getName());
        assertEquals("Updated description", response.getBody().getDescription());
        assertEquals("active", response.getBody().getStatus());

        // AND: Database reflects the update
        var dbProject = projectRepository.findById(created.getId());
        assertTrue(dbProject.isPresent());
        assertEquals("Updated Name", dbProject.get().getName());
    }

    @Test
    @DisplayName("E2E: PUT /api/projects/{id} - Should return error for non-existent project")
    void testUpdateProject_WhenNotFound_ReturnsError() {
        // GIVEN: A non-existent project ID
        String nonExistentId = "non-existent-id-12345";
        ProjectDTO updateDTO = new ProjectDTO();
        updateDTO.setName("Update Non-existent");
        updateDTO.setStatus("active");
        updateDTO.setStartDate(LocalDate.now());

        // WHEN: Updating non-existent project
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
    // DELETE PROJECT TESTS
    // ========================================================================

    @Test
    @DisplayName("E2E: DELETE /api/projects/{id} - Should delete project and return 204 NO CONTENT")
    void testDeleteProject_Returns204NoContent() {
        // GIVEN: An existing project
        ProjectDTO created = createTestProject("Project to Delete", "active");
        String projectId = created.getId();

        // Verify it exists
        assertTrue(projectRepository.findById(projectId).isPresent());

        // WHEN: Deleting the project
        ResponseEntity<Void> response = restTemplate.exchange(
            baseUrl + "/" + projectId,
            HttpMethod.DELETE,
            null,
            Void.class
        );

        // THEN: HTTP 204 NO CONTENT
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

        // AND: Project is removed from database
        assertFalse(projectRepository.findById(projectId).isPresent());
    }

    @Test
    @DisplayName("E2E: DELETE /api/projects/{id} - Should handle deletion of non-existent project gracefully")
    void testDeleteProject_WhenNotFound_ShouldNotFail() {
        // GIVEN: A non-existent project ID
        String nonExistentId = "non-existent-id-12345";

        // WHEN: Deleting non-existent project
        ResponseEntity<Void> response = restTemplate.exchange(
            baseUrl + "/" + nonExistentId,
            HttpMethod.DELETE,
            null,
            Void.class
        );

        // THEN: Should return 204 (deleteById doesn't throw if not found)
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    // ========================================================================
    // FULL CRUD FLOW TEST
    // ========================================================================

    @Test
    @DisplayName("E2E: Full CRUD flow - Create, Read, Update, Delete")
    void testFullCRUDFlow() {
        // 1. CREATE
        ProjectDTO createDTO = new ProjectDTO();
        createDTO.setName("CRUD Test Project");
        createDTO.setDescription("Testing full CRUD flow");
        createDTO.setStatus("planning");
        createDTO.setStartDate(LocalDate.of(2025, 1, 1));

        ResponseEntity<ProjectDTO> createResponse = restTemplate.postForEntity(
            baseUrl, createDTO, ProjectDTO.class);
        assertEquals(HttpStatus.CREATED, createResponse.getStatusCode());
        String projectId = createResponse.getBody().getId();
        assertNotNull(projectId);

        // 2. READ
        ResponseEntity<ProjectDTO> readResponse = restTemplate.getForEntity(
            baseUrl + "/" + projectId, ProjectDTO.class);
        assertEquals(HttpStatus.OK, readResponse.getStatusCode());
        assertEquals("CRUD Test Project", readResponse.getBody().getName());

        // 3. UPDATE
        ProjectDTO updateDTO = new ProjectDTO();
        updateDTO.setName("Updated CRUD Project");
        updateDTO.setDescription("Updated description");
        updateDTO.setStatus("active");
        updateDTO.setStartDate(LocalDate.of(2025, 2, 1));

        ResponseEntity<ProjectDTO> updateResponse = restTemplate.exchange(
            baseUrl + "/" + projectId,
            HttpMethod.PUT,
            new HttpEntity<>(updateDTO),
            ProjectDTO.class
        );
        assertEquals(HttpStatus.OK, updateResponse.getStatusCode());
        assertEquals("Updated CRUD Project", updateResponse.getBody().getName());
        assertEquals("active", updateResponse.getBody().getStatus());

        // 4. DELETE
        ResponseEntity<Void> deleteResponse = restTemplate.exchange(
            baseUrl + "/" + projectId,
            HttpMethod.DELETE,
            null,
            Void.class
        );
        assertEquals(HttpStatus.NO_CONTENT, deleteResponse.getStatusCode());

        // 5. VERIFY DELETION
        assertFalse(projectRepository.findById(projectId).isPresent());
    }

    // ========================================================================
    // HELPER METHODS
    // ========================================================================

    /**
     * Helper method to create a test project via API
     */
    private ProjectDTO createTestProject(String name, String status) {
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setName(name);
        projectDTO.setStatus(status);
        projectDTO.setStartDate(LocalDate.of(2025, 1, 1));

        ResponseEntity<ProjectDTO> response = restTemplate.postForEntity(
            baseUrl, projectDTO, ProjectDTO.class);

        return response.getBody();
    }
}
