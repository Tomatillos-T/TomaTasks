package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.GitHubRepoDTO;
import com.springboot.TomaTask.dto.GitHubBranchDTO;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Service for interacting with GitHub API
 * Handles repository and branch listing using authenticated requests
 */
@Service
public class GitHubApiService {

    private static final String GITHUB_API_BASE_URL = "https://api.github.com";
    private final RestTemplate restTemplate;

    public GitHubApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * List all repositories accessible to the user via their GitHub token
     * Includes owned, collaborated, and organization repos
     *
     * @param githubAccessToken User's GitHub personal access token
     * @return List of repositories (includes private repos if token has access)
     */
    public List<GitHubRepoDTO> listRepositories(String githubAccessToken) {
        String url = GITHUB_API_BASE_URL + "/user/repos?affiliation=owner,collaborator,organization_member&per_page=100";

        HttpHeaders headers = createAuthHeaders(githubAccessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<GitHubRepoDTO[]> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            entity,
            GitHubRepoDTO[].class
        );

        GitHubRepoDTO[] repos = response.getBody();
        return repos != null ? Arrays.asList(repos) : Collections.emptyList();
    }

    /**
     * List all branches for a specific repository
     *
     * @param githubAccessToken User's GitHub personal access token
     * @param owner Repository owner (username or organization)
     * @param repo Repository name
     * @return List of branches
     */
    public List<GitHubBranchDTO> listBranches(String githubAccessToken, String owner, String repo) {
        String url = GITHUB_API_BASE_URL + "/repos/" + owner + "/" + repo + "/branches";

        HttpHeaders headers = createAuthHeaders(githubAccessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<GitHubBranchDTO[]> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            entity,
            GitHubBranchDTO[].class
        );

        GitHubBranchDTO[] branches = response.getBody();
        return branches != null ? Arrays.asList(branches) : Collections.emptyList();
    }

    /**
     * Create HTTP headers with GitHub authentication
     *
     * @param githubAccessToken GitHub personal access token
     * @return HttpHeaders with Authorization and Accept headers
     */
    private HttpHeaders createAuthHeaders(String githubAccessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + githubAccessToken);
        headers.set("Accept", "application/vnd.github+json");
        headers.set("X-GitHub-Api-Version", "2022-11-28");
        return headers;
    }
}
