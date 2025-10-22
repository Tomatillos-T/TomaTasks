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
    
        // Fetch commits (limit 10) to provide general context
        List<RepositoryService.CommitInfo> recentCommits = repoService.getRecentCommits(10);
        context.append("Recent commits overview:\n");
        for (RepositoryService.CommitInfo commit : recentCommits) {
            context.append(String.format("- [%s] %s by %s (%d)\n",
                    commit.hash.substring(0, 7), commit.message, commit.author, commit.timestamp));
        }
    
        // If specific commits were selected by the user
        if (commitIds != null && !commitIds.isEmpty()) {
            context.append("\nSelected commit details:\n");
            for (String commitId : commitIds) {
                try {
                    String diff = repoService.getCommitDiff(commitId);
                    context.append("\n--- Commit ").append(commitId).append(" ---\n");
                    context.append(diff.isBlank() ? "(No changes detected)\n" : diff);
                } catch (Exception e) {
                    // Gracefully fallback if diff can't be generated
                    context.append(String.format("\n--- Commit %s ---\n(Diff unavailable locally: %s)\n",
                            commitId, e.getMessage()));
                }
            }
        }
    
        // Send the clean context to Gemini
        return callGemini(context.toString(), question);
    }
    

    private String callGemini(String context, String question) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + apiKey;
        
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
