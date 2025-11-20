package com.springboot.TomaTask.auth.controller;

import com.springboot.TomaTask.auth.service.GitHubOAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

/**
 * Separate controller for OAuth callbacks to match registered redirect URIs
 * This controller handles GitHub OAuth callback at /api/oauth/callback/github
 */
@RestController
@RequestMapping("/api/oauth/callback")
public class OAuthCallbackController {

    @Autowired
    private GitHubOAuthService gitHubOAuthService;

    /**
     * Handle GitHub OAuth callback
     * GET /api/oauth/callback/github?code=xxx&state=userId
     * This endpoint matches the registered callback URL in GitHub OAuth app settings
     */
    @GetMapping("/github")
    public RedirectView handleGitHubCallback(
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
}
