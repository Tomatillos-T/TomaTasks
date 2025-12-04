package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.GitHubRepoDTO;
import com.springboot.TomaTask.dto.GitHubBranchDTO;
import com.springboot.TomaTask.dto.IndexBranchRequestDTO;
import com.springboot.TomaTask.dto.IndexBranchResponseDTO;
import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.repository.UserRepository;
import com.springboot.TomaTask.service.RagService;
import com.springboot.TomaTask.service.RepositoryService;
import com.springboot.TomaTask.service.GitHubApiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/rag")
public class RagController {

    private final RagService ragService;
    private final RepositoryService repoService;
    private final GitHubApiService gitHubApiService;
    private final UserRepository userRepository;

    public RagController(RagService ragService, RepositoryService repoService,
                        GitHubApiService gitHubApiService, UserRepository userRepository) {
        this.ragService = ragService;
        this.repoService = repoService;
        this.gitHubApiService = gitHubApiService;
        this.userRepository = userRepository;
    }

    /**
     * Query repository using RAG with vector search
     */
    @PostMapping("/query")
    public ResponseEntity<Map<String, String>> query(@RequestBody Map<String, Object> request) {
        try {
            String question = (String) request.get("question");
            List<String> commitIds = (List<String>) request.get("commitIds");
            
            String answer = ragService.queryRepository(question, commitIds);
            return ResponseEntity.ok(Map.of("answer", answer));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get recent commits with pagination
     */
    @GetMapping("/commits")
    public ResponseEntity<?> getCommits(
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        try {
            return ResponseEntity.ok(repoService.getRecentCommits(limit, offset));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Sync repository and update cache
     */
    @PostMapping("/sync")
    public ResponseEntity<Map<String, String>> syncRepo() {
        try {
            repoService.cloneOrUpdateRepo();
            return ResponseEntity.ok(Map.of("status", "Repository synced successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Index specific commits (generate embeddings)
     */
    @PostMapping("/index")
    public ResponseEntity<Map<String, String>> indexCommits(@RequestBody Map<String, Object> request) {
        try {
            List<String> commitIds = (List<String>) request.get("commitIds");
            
            if (commitIds == null || commitIds.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "commitIds are required"));
            }
            
            ragService.indexCommits(commitIds);
            return ResponseEntity.ok(Map.of(
                "status", "Indexing started", 
                "commits", String.valueOf(commitIds.size())
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get RAG statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        try {
            return ResponseEntity.ok(ragService.getStatistics());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Health check
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "healthy"));
    }

    // ========================================================================
    // GITHUB INTEGRATION ENDPOINTS
    // ========================================================================

    /**
     * List all GitHub repositories accessible to the authenticated user
     * Requires user to have linked their GitHub account
     *
     * @param userId User ID from JWT token
     * @return List of repositories (including private repos)
     */
    @GetMapping("/github/repos")
    public ResponseEntity<?> getGitHubRepos(@RequestParam String userId) {
        try {
            // Get user and verify GitHub is linked
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            String githubToken = user.getGithubAccessToken();

            if (githubToken == null || githubToken.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "GitHub account not linked. Please link your GitHub account first."));
            }

            // Fetch repositories using GitHub API
            List<GitHubRepoDTO> repos = gitHubApiService.listRepositories(githubToken);
            return ResponseEntity.ok(repos);

        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "GitHub token is invalid or expired. Please relink your GitHub account."));
            }
            return ResponseEntity.status(e.getStatusCode())
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * List all branches for a specific GitHub repository
     * Requires user to have linked their GitHub account
     *
     * @param userId User ID from JWT token
     * @param owner Repository owner (username or organization)
     * @param repo Repository name
     * @return List of branches
     */
    @GetMapping("/github/repos/{owner}/{repo}/branches")
    public ResponseEntity<?> getBranches(
            @RequestParam String userId,
            @PathVariable String owner,
            @PathVariable String repo) {

        // Debug logging
        System.out.println("=== GET Branches Request ===");
        System.out.println("UserId: " + userId);
        System.out.println("Owner: " + owner);
        System.out.println("Repo: " + repo);
        System.out.println("Full path: /api/rag/github/repos/" + owner + "/" + repo + "/branches");

        try {
            // Validate path parameters
            if (owner == null || owner.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Repository owner cannot be empty"));
            }
            if (repo == null || repo.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Repository name cannot be empty"));
            }

            // Get user and verify GitHub is linked
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                System.out.println("ERROR: User not found with ID: " + userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            String githubToken = user.getGithubAccessToken();

            if (githubToken == null || githubToken.isEmpty()) {
                System.out.println("ERROR: GitHub token not found for user: " + userId);
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "GitHub account not linked"));
            }

            System.out.println("Calling GitHub API for: " + owner + "/" + repo);

            // Fetch branches using GitHub API
            List<GitHubBranchDTO> branches = gitHubApiService.listBranches(githubToken, owner, repo);

            System.out.println("Successfully fetched " + branches.size() + " branches");
            return ResponseEntity.ok(branches);

        } catch (HttpClientErrorException e) {
            System.out.println("ERROR: GitHub API error - Status: " + e.getStatusCode() + ", Message: " + e.getMessage());

            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                        "error", "Repository not found or access denied",
                        "repository", owner + "/" + repo,
                        "details", "The repository may not exist, be private without access, or the owner/repo name may be incorrect"
                    ));
            }
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "error", "GitHub token is invalid or expired",
                        "action", "Please relink your GitHub account"
                    ));
            }
            return ResponseEntity.status(e.getStatusCode())
                .body(Map.of(
                    "error", "GitHub API error: " + e.getMessage(),
                    "statusCode", e.getStatusCode().value()
                ));
        } catch (Exception e) {
            System.out.println("ERROR: Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of(
                    "error", "Internal server error: " + e.getMessage(),
                    "type", e.getClass().getSimpleName()
                ));
        }
    }

    /**
     * Index a specific branch from a GitHub repository
     * Clones the repository, switches to the branch, and indexes all commits
     *
     * @param userId User ID from JWT token
     * @param request Contains owner, repo, and branch to index
     * @return Indexing status and statistics
     */
    @PostMapping("/github/index-branch")
    public ResponseEntity<?> indexBranch(
            @RequestParam String userId,
            @RequestBody IndexBranchRequestDTO request) {
        try {
            // Validate request
            if (request.getOwner() == null || request.getRepo() == null || request.getBranch() == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Missing required fields: owner, repo, branch"));
            }

            // Get user and verify GitHub is linked
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            String githubToken = user.getGithubAccessToken();

            if (githubToken == null || githubToken.isEmpty()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "GitHub account not linked"));
            }

            // Index the branch
            IndexBranchResponseDTO response = repoService.indexBranch(
                githubToken,
                request.getOwner(),
                request.getRepo(),
                request.getBranch()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }
}
