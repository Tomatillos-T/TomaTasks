package com.springboot.TomaTask.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RagService {

    @Value("${google.api.key}")
    private String apiKey;

    private final RepositoryService repoService;
    private final RestTemplate restTemplate = new RestTemplate();

    public RagService(RepositoryService repoService) {
        this.repoService = repoService;
    }

    public String queryRepository(String question, List<String> commitIds) throws Exception {
        StringBuilder context = new StringBuilder();
        
        // Get recent commits as context
        List<RepositoryService.CommitInfo> commits = repoService.getRecentCommits(10);
        context.append("Recent commits:\n");
        for (RepositoryService.CommitInfo commit : commits) {
            context.append(String.format("- [%s] %s by %s\n", 
                commit.hash.substring(0, 7), commit.message, commit.author));
        }
        
        // Add specific commit diffs if requested
        if (commitIds != null && !commitIds.isEmpty()) {
            for (String commitId : commitIds) {
                String diff = repoService.getCommitDiff(commitId);
                context.append("\nDiff for commit ").append(commitId).append(":\n");
                context.append(diff);
            }
        }

        return callGemini(context.toString(), question);
    }

    private String callGemini(String context, String question) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
            Map.of("parts", List.of(
                Map.of("text", "Repository context:\n" + context + "\n\nQuestion: " + question)
            ))
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
        
        Map<String, Object> body = response.getBody();
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        
        return (String) parts.get(0).get("text");
    }
}
