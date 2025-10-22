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

        // 🧩 SYSTEM PROMPT: focus only on repository context
        // It's like this instead of a single long string because we use Java 11, if we upgrade to 17+ we can use text blocks
        String systemPrompt =
            "You are a repository analysis assistant.\n" +
            "Your job is to answer questions ONLY about the given repository context, commits, and code changes.\n" +
            "If the user's question is unrelated to the repository, such as general knowledge or personal questions,\n" +
            "respond politely with: \"I specialize in repository-related questions. Could you rephrase your question to reference code, commits, or repository details?\"\n" +
            "Be concise and accurate based on the provided context.";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
            Map.of("role", "user",
                "parts", List.of(
                    Map.of("text", systemPrompt + "\n\nRepository context:\n" + context + "\n\nQuestion: " + question)
                ))
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        Map<String, Object> body = response.getBody();
        if (body == null) {
            throw new RuntimeException("Gemini API response body is null.");
        }
        Object candidatesObj = body.get("candidates");
        if (!(candidatesObj instanceof List) || ((List<?>) candidatesObj).isEmpty()) {
            throw new RuntimeException("Gemini API response missing or empty 'candidates' field: " + body);
        }
        List<?> candidates = (List<?>) candidatesObj;
        Object firstCandidateObj = candidates.get(0);
        if (!(firstCandidateObj instanceof Map)) {
            throw new RuntimeException("First candidate in Gemini API response is not a Map: " + firstCandidateObj);
        }
        Map<?, ?> firstCandidate = (Map<?, ?>) firstCandidateObj;
        Object contentObj = firstCandidate.get("content");
        if (!(contentObj instanceof Map)) {
            throw new RuntimeException("Candidate 'content' field is missing or not a Map: " + contentObj);
        }
        Map<?, ?> content = (Map<?, ?>) contentObj;
        Object partsObj = content.get("parts");
        if (!(partsObj instanceof List) || ((List<?>) partsObj).isEmpty()) {
            throw new RuntimeException("Content 'parts' field is missing or empty: " + content);
        }
        List<?> parts = (List<?>) partsObj;
        Object firstPartObj = parts.get(0);
        if (!(firstPartObj instanceof Map)) {
            throw new RuntimeException("First part in 'parts' is not a Map: " + firstPartObj);
        }
        Map<?, ?> firstPart = (Map<?, ?>) firstPartObj;
        Object textObj = firstPart.get("text");
        if (!(textObj instanceof String)) {
            throw new RuntimeException("Part 'text' field is missing or not a String: " + firstPart);
        }
        return (String) textObj;
    }
}
