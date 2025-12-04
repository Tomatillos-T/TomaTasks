package com.springboot.TomaTask.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RagService {

    private static final Logger logger = LoggerFactory.getLogger(RagService.class);

    @Value("${google.api.key}")
    private String apiKey;

    private final RepositoryService repoService;
    private final VectorStoreService vectorStore;
    private final EmbeddingService embeddingService;
    private final RestTemplate restTemplate = new RestTemplate();

    public RagService(RepositoryService repoService, VectorStoreService vectorStore, 
                     EmbeddingService embeddingService) {
        this.repoService = repoService;
        this.vectorStore = vectorStore;
        this.embeddingService = embeddingService;
    }

    /**
     * Query repository using RAG with vector search
     */
    public String queryRepository(String question, List<String> commitIds) throws Exception {
        logger.info("Processing RAG query: {}", question);

        // Generate embedding for the question
        float[] questionEmbedding = embeddingService.generateEmbedding(question);

        // Perform semantic search
        List<VectorStoreService.SearchResult> searchResults;
        if (commitIds != null && !commitIds.isEmpty()) {
            // Search within specific commits
            searchResults = new ArrayList<>();
            for (String commitId : commitIds) {
                searchResults.addAll(vectorStore.semanticSearch(questionEmbedding, 5, commitId));
            }
            // Sort by distance and limit
            searchResults = searchResults.stream()
                .sorted(Comparator.comparingDouble(r -> r.distance))
                .limit(10)
                .collect(Collectors.toList());
        } else {
            // Search across all commits
            searchResults = vectorStore.semanticSearch(questionEmbedding, 10, null);
        }

        if (searchResults.isEmpty()) {
            return "I couldn't find any relevant information in the repository to answer your question. " +
                   "Please try rephrasing or selecting specific commits to analyze.";
        }

        // Build context from search results
        StringBuilder context = new StringBuilder();
        context.append("Relevant code and commit information:\n\n");

        // Group by commit for better organization
        Map<String, List<VectorStoreService.SearchResult>> resultsByCommit = searchResults.stream()
            .collect(Collectors.groupingBy(r -> r.commitHash));

        for (Map.Entry<String, List<VectorStoreService.SearchResult>> entry : resultsByCommit.entrySet()) {
            String commitHash = entry.getKey();
            List<VectorStoreService.SearchResult> commitResults = entry.getValue();

            context.append(String.format("=== Commit %s ===\n", commitHash.substring(0, 7)));
            
            for (VectorStoreService.SearchResult result : commitResults) {
                context.append(String.format("\nRelevance score: %.3f\n", 1 - result.distance));
                if (result.filePath != null) {
                    context.append(String.format("File: %s\n", result.filePath));
                }
                context.append("Content:\n");
                context.append(result.content);
                context.append("\n---\n");
            }
            context.append("\n");
        }

        // If specific commits were requested, also add overview
        if (commitIds != null && !commitIds.isEmpty()) {
            context.append("\n=== Commit Overview ===\n");
            try {
                List<RepositoryService.CommitInfo> commits = repoService.getRecentCommits(20, 0);
                for (String commitId : commitIds) {
                    commits.stream()
                        .filter(c -> c.hash.equals(commitId))
                        .findFirst()
                        .ifPresent(c -> context.append(String.format(
                            "- [%s] %s by %s\n",
                            c.hash.substring(0, 7), c.message, c.author
                        )));
                }
            } catch (Exception e) {
                logger.warn("Could not fetch commit overview: {}", e.getMessage());
            }
        }

        // Generate response using Gemini
        String response = callGemini(context.toString(), question);
        
        logger.info("RAG query completed successfully");
        return response;
    }

    /**
     * Process and index new commits
     */
    public void indexCommits(List<String> commitIds) {
        logger.info("Indexing {} commits", commitIds.size());
        repoService.processCommitsAsync(commitIds)
            .thenRun(() -> logger.info("Commit indexing completed"))
            .exceptionally(e -> {
                logger.error("Error during commit indexing", e);
                return null;
            });
    }

    /**
     * Get indexing statistics
     */
    public Map<String, Object> getStatistics() {
        return vectorStore.getStatistics();
    }

    /**
     * Call Gemini API with context
     */
    private String callGemini(String context, String question) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + apiKey;

        String systemPrompt =
            "You are a repository analysis assistant specialized in code review and understanding.\n" +
            "Your job is to answer questions ONLY about the given repository context, commits, and code changes.\n" +
            "When analyzing code:\n" +
            "- Explain what the code does clearly and concisely\n" +
            "- Highlight important changes and their impact\n" +
            "- Point out potential issues or improvements when relevant\n" +
            "- Reference specific commits or files when discussing changes\n" +
            "If the user's question is unrelated to the repository, respond politely:\n" +
            "\"I specialize in repository-related questions. Could you rephrase your question to reference code, commits, or repository details?\"\n" +
            "Be concise, accurate, and helpful based on the provided context.";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
            Map.of("role", "user",
                "parts", List.of(
                    Map.of("text", systemPrompt + "\n\nRepository context:\n" + context + "\n\nQuestion: " + question)
                ))
        ));

        // Add generation config for better responses
        requestBody.put("generationConfig", Map.of(
            "temperature", 0.7,
            "topK", 40,
            "topP", 0.95,
            "maxOutputTokens", 2048
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            Map<String, Object> body = response.getBody();
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            logger.error("Error calling Gemini API", e);
            throw new RuntimeException("Failed to generate response", e);
        }
    }
}
