package com.springboot.TomaTask.auth.controller;

import com.springboot.TomaTask.auth.service.GitHubOAuthService;
import com.springboot.TomaTask.dto.UserDTO;
import com.springboot.TomaTask.mapper.UserMapper;
import com.springboot.TomaTask.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/github")
public class OAuthController {

    @Autowired
    private GitHubOAuthService gitHubOAuthService;

    /**
     * Get GitHub authorization URL
     * GET /api/auth/github/authorize/{userId}
     */
    @GetMapping("/authorize/{userId}")
    public ResponseEntity<Map<String, String>> getAuthorizationUrl(@PathVariable String userId) {
        try {
            String authUrl = gitHubOAuthService.getAuthorizationUrl(userId);
            Map<String, String> response = new HashMap<>();
            response.put("url", authUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to generate authorization URL: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Handle GitHub OAuth callback
     * GET /api/auth/github/callback?code=xxx&state=userId
     */
    @GetMapping("/callback")
    public RedirectView handleCallback(
            @RequestParam String code,
            @RequestParam String state) {

        try {
            String userId = state; // state contains userId for CSRF protection
            gitHubOAuthService.linkGitHubAccount(userId, code);

            // Redirect to frontend with success message
            return new RedirectView("http://localhost:3000/user?github=success");
        } catch (Exception e) {
            // Redirect to frontend with error message
            return new RedirectView("http://localhost:3000/user?github=error&message=" + e.getMessage());
        }
    }

    /**
     * Link GitHub account to user (alternative endpoint for frontend code submission)
     * POST /api/user/{userId}/github/link
     */
    @PostMapping("/{userId}/link")
    public ResponseEntity<?> linkGitHubAccount(
            @PathVariable String userId,
            @RequestBody Map<String, String> request) {

        try {
            String code = request.get("code");
            if (code == null || code.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Authorization code is required");
                return ResponseEntity.badRequest().body(error);
            }

            User user = gitHubOAuthService.linkGitHubAccount(userId, code);
            UserDTO userDTO = UserMapper.toDTO(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "GitHub account linked successfully");
            response.put("user", userDTO);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Unlink GitHub account from user
     * DELETE /api/user/{userId}/github/unlink
     */
    @DeleteMapping("/{userId}/unlink")
    public ResponseEntity<?> unlinkGitHubAccount(@PathVariable String userId) {
        try {
            User user = gitHubOAuthService.unlinkGitHubAccount(userId);
            UserDTO userDTO = UserMapper.toDTO(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "GitHub account unlinked successfully");
            response.put("user", userDTO);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Check if user has GitHub account linked
     * GET /api/user/{userId}/github/status
     */
    @GetMapping("/{userId}/status")
    public ResponseEntity<Map<String, Boolean>> getGitHubStatus(@PathVariable String userId) {
        boolean hasGitHub = gitHubOAuthService.hasGitHubLinked(userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("linked", hasGitHub);
        return ResponseEntity.ok(response);
    }
}
