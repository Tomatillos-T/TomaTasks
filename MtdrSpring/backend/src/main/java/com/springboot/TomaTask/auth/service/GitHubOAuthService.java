package com.springboot.TomaTask.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class GitHubOAuthService {

    @Value("${github.oauth.client-id}")
    private String clientId;

    @Value("${github.oauth.client-secret}")
    private String clientSecret;

    @Value("${github.oauth.redirect-uri}")
    private String redirectUri;

    @Autowired
    private UserRepository userRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Generate GitHub authorization URL
     */
    public String getAuthorizationUrl(String userId) {
        return String.format(
            "https://github.com/login/oauth/authorize?client_id=%s&redirect_uri=%s&scope=user:email,repo&state=%s",
            clientId,
            redirectUri,
            userId // Using userId as state for CSRF protection
        );
    }

    /**
     * Exchange authorization code for access token
     */
    public String exchangeCodeForToken(String code) throws Exception {
        String tokenUrl = "https://github.com/login/oauth/access_token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json");

        Map<String, String> body = new HashMap<>();
        body.put("client_id", clientId);
        body.put("client_secret", clientSecret);
        body.put("code", code);
        body.put("redirect_uri", redirectUri);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, request, String.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            if (jsonNode.has("access_token")) {
                return jsonNode.get("access_token").asText();
            } else {
                throw new Exception("Failed to get access token from GitHub: " + response.getBody());
            }
        }

        throw new Exception("Failed to exchange code for token. Status: " + response.getStatusCode());
    }

    /**
     * Fetch GitHub user information using access token
     */
    public Map<String, String> getGitHubUserInfo(String accessToken) throws Exception {
        String userUrl = "https://api.github.com/user";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.set("Accept", "application/vnd.github.v3+json");

        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(userUrl, HttpMethod.GET, request, String.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            Map<String, String> userInfo = new HashMap<>();
            userInfo.put("id", jsonNode.get("id").asText());
            userInfo.put("login", jsonNode.get("login").asText());
            userInfo.put("name", jsonNode.has("name") && !jsonNode.get("name").isNull()
                ? jsonNode.get("name").asText()
                : jsonNode.get("login").asText());

            return userInfo;
        }

        throw new Exception("Failed to fetch GitHub user info. Status: " + response.getStatusCode());
    }

    /**
     * Link GitHub account to existing user
     */
    @Transactional
    public User linkGitHubAccount(String userId, String code) throws Exception {
        // Find user
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new Exception("User not found");
        }

        User user = userOptional.get();

        // Exchange code for access token
        String accessToken = exchangeCodeForToken(code);

        // Get GitHub user info
        Map<String, String> githubInfo = getGitHubUserInfo(accessToken);

        // Check if GitHub account is already linked to another user
        Optional<User> existingUser = userRepository.findByGithubId(githubInfo.get("id"));
        if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
            throw new Exception("This GitHub account is already linked to another user");
        }

        // Update user with GitHub information
        user.setGithubId(githubInfo.get("id"));
        user.setGithubUsername(githubInfo.get("login"));
        user.setGithubAccessToken(accessToken);

        return userRepository.save(user);
    }

    /**
     * Unlink GitHub account from user
     */
    @Transactional
    public User unlinkGitHubAccount(String userId) throws Exception {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new Exception("User not found");
        }

        User user = userOptional.get();
        user.setGithubId(null);
        user.setGithubUsername(null);
        user.setGithubAccessToken(null);

        return userRepository.save(user);
    }

    /**
     * Validate if user has GitHub account linked
     */
    public boolean hasGitHubLinked(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.isPresent() && userOptional.get().getGithubId() != null;
    }
}
