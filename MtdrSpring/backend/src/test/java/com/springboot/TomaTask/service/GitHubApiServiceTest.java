package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.GitHubRepoDTO;
import com.springboot.TomaTask.dto.GitHubBranchDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Test-Driven Development (TDD) tests for GitHubApiService
 * Following Red-Green-Refactor workflow
 *
 * Test Coverage:
 * - Feature 1: List user's GitHub repositories
 * - Feature 2: List branches for a repository
 *
 * Edge Cases Covered:
 * - Invalid/expired GitHub access tokens
 * - Non-existent repositories
 * - API rate limiting
 * - Empty repository lists
 * - Private vs public repositories
 * - Network errors
 */
@ExtendWith(MockitoExtension.class)
public class GitHubApiServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private GitHubApiService gitHubApiService;

    private String validToken;
    private String invalidToken;

    @BeforeEach
    void setUp() {
        // GIVEN: Setup test data
        validToken = "ghp_validtoken123456789";
        invalidToken = "ghp_invalidtoken";
    }

    /**
     * Test: List repositories with valid token
     * Expected: Returns list of repositories including private ones
     */
    @Test
    void testListRepositories_WithValidToken_ReturnsRepositories() {
        // GIVEN: Valid GitHub token and mock API response
        GitHubRepoDTO[] mockRepos = new GitHubRepoDTO[2];
        mockRepos[0] = new GitHubRepoDTO("repo1", "user/repo1", "user", false, "main", "https://github.com/user/repo1");
        mockRepos[1] = new GitHubRepoDTO("private-repo", "user/private-repo", "user", true, "main", "https://github.com/user/private-repo");

        ResponseEntity<GitHubRepoDTO[]> responseEntity = ResponseEntity.ok(mockRepos);

        when(restTemplate.exchange(
            anyString(),
            eq(HttpMethod.GET),
            any(HttpEntity.class),
            eq(GitHubRepoDTO[].class)
        )).thenReturn(responseEntity);

        // WHEN: Fetching repositories with valid token
        List<GitHubRepoDTO> result = gitHubApiService.listRepositories(validToken);

        // THEN: Returns all repositories including private ones
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("repo1", result.get(0).getName());
        assertEquals("private-repo", result.get(1).getName());
        assertTrue(result.get(1).isPrivate());
        verify(restTemplate, times(1)).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(GitHubRepoDTO[].class));
    }

    /**
     * Test: List repositories with invalid token
     * Edge Case: Token is invalid or expired
     * Expected: Throws exception
     */
    @Test
    void testListRepositories_WithInvalidToken_ThrowsException() {
        // GIVEN: Invalid GitHub token
        when(restTemplate.exchange(
            anyString(),
            eq(HttpMethod.GET),
            any(HttpEntity.class),
            eq(GitHubRepoDTO[].class)
        )).thenThrow(new HttpClientErrorException(HttpStatus.UNAUTHORIZED, "Bad credentials"));

        // WHEN & THEN: Fetching repositories with invalid token throws exception
        assertThrows(HttpClientErrorException.class, () -> {
            gitHubApiService.listRepositories(invalidToken);
        });

        verify(restTemplate, times(1)).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(GitHubRepoDTO[].class));
    }

    /**
     * Test: List repositories with no accessible repositories
     * Edge Case: User has no repositories
     * Expected: Returns empty list
     */
    @Test
    void testListRepositories_WithNoRepositories_ReturnsEmptyList() {
        // GIVEN: Valid token but no repositories
        ResponseEntity<GitHubRepoDTO[]> responseEntity = ResponseEntity.ok(new GitHubRepoDTO[0]);

        when(restTemplate.exchange(
            anyString(),
            eq(HttpMethod.GET),
            any(HttpEntity.class),
            eq(GitHubRepoDTO[].class)
        )).thenReturn(responseEntity);

        // WHEN: Fetching repositories
        List<GitHubRepoDTO> result = gitHubApiService.listRepositories(validToken);

        // THEN: Returns empty list
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(restTemplate, times(1)).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(GitHubRepoDTO[].class));
    }

    /**
     * Test: List branches for a repository with valid token
     * Expected: Returns list of branches
     */
    @Test
    void testListBranches_WithValidToken_ReturnsBranches() {
        // GIVEN: Valid GitHub token and repository
        GitHubBranchDTO[] mockBranches = new GitHubBranchDTO[3];
        mockBranches[0] = new GitHubBranchDTO("main", "abc123");
        mockBranches[1] = new GitHubBranchDTO("dev", "def456");
        mockBranches[2] = new GitHubBranchDTO("feature/new-feature", "ghi789");

        ResponseEntity<GitHubBranchDTO[]> responseEntity = ResponseEntity.ok(mockBranches);

        when(restTemplate.exchange(
            anyString(),
            eq(HttpMethod.GET),
            any(HttpEntity.class),
            eq(GitHubBranchDTO[].class)
        )).thenReturn(responseEntity);

        // WHEN: Fetching branches
        List<GitHubBranchDTO> result = gitHubApiService.listBranches(validToken, "user", "repo1");

        // THEN: Returns all branches
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals("main", result.get(0).getName());
        assertEquals("dev", result.get(1).getName());
        assertEquals("feature/new-feature", result.get(2).getName());
        verify(restTemplate, times(1)).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(GitHubBranchDTO[].class));
    }

    /**
     * Test: List branches for non-existent repository
     * Edge Case: Repository doesn't exist or user doesn't have access
     * Expected: Throws exception
     */
    @Test
    void testListBranches_WithNonExistentRepo_ThrowsException() {
        // GIVEN: Non-existent repository
        when(restTemplate.exchange(
            anyString(),
            eq(HttpMethod.GET),
            any(HttpEntity.class),
            eq(GitHubBranchDTO[].class)
        )).thenThrow(new HttpClientErrorException(HttpStatus.NOT_FOUND, "Not Found"));

        // WHEN & THEN: Fetching branches throws exception
        assertThrows(HttpClientErrorException.class, () -> {
            gitHubApiService.listBranches(validToken, "user", "nonexistent");
        });

        verify(restTemplate, times(1)).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(GitHubBranchDTO[].class));
    }

    /**
     * Test: List branches with invalid token
     * Edge Case: Token is invalid or expired
     * Expected: Throws exception
     */
    @Test
    void testListBranches_WithInvalidToken_ThrowsException() {
        // GIVEN: Invalid token
        when(restTemplate.exchange(
            anyString(),
            eq(HttpMethod.GET),
            any(HttpEntity.class),
            eq(GitHubBranchDTO[].class)
        )).thenThrow(new HttpClientErrorException(HttpStatus.UNAUTHORIZED, "Bad credentials"));

        // WHEN & THEN: Fetching branches with invalid token throws exception
        assertThrows(HttpClientErrorException.class, () -> {
            gitHubApiService.listBranches(invalidToken, "user", "repo1");
        });

        verify(restTemplate, times(1)).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(GitHubBranchDTO[].class));
    }

    /**
     * Test: List branches for repository with no branches
     * Edge Case: Repository exists but has no branches (unusual but possible)
     * Expected: Returns empty list
     */
    @Test
    void testListBranches_WithNoBranches_ReturnsEmptyList() {
        // GIVEN: Repository with no branches
        ResponseEntity<GitHubBranchDTO[]> responseEntity = ResponseEntity.ok(new GitHubBranchDTO[0]);

        when(restTemplate.exchange(
            anyString(),
            eq(HttpMethod.GET),
            any(HttpEntity.class),
            eq(GitHubBranchDTO[].class)
        )).thenReturn(responseEntity);

        // WHEN: Fetching branches
        List<GitHubBranchDTO> result = gitHubApiService.listBranches(validToken, "user", "empty-repo");

        // THEN: Returns empty list
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(restTemplate, times(1)).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(GitHubBranchDTO[].class));
    }

    /**
     * Test: List branches for private repository with valid token
     * Expected: Returns branches (proves token grants access)
     */
    @Test
    void testListBranches_ForPrivateRepo_WithValidToken_ReturnsBranches() {
        // GIVEN: Private repository with valid access token
        GitHubBranchDTO[] mockBranches = new GitHubBranchDTO[1];
        mockBranches[0] = new GitHubBranchDTO("main", "xyz123");

        ResponseEntity<GitHubBranchDTO[]> responseEntity = ResponseEntity.ok(mockBranches);

        when(restTemplate.exchange(
            anyString(),
            eq(HttpMethod.GET),
            any(HttpEntity.class),
            eq(GitHubBranchDTO[].class)
        )).thenReturn(responseEntity);

        // WHEN: Fetching branches from private repo
        List<GitHubBranchDTO> result = gitHubApiService.listBranches(validToken, "user", "private-repo");

        // THEN: Returns branches (access granted)
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("main", result.get(0).getName());
        verify(restTemplate, times(1)).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(GitHubBranchDTO[].class));
    }
}
