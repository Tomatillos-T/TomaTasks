package com.springboot.TomaTask.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmbeddingService {

    private static final Logger logger = LoggerFactory.getLogger(EmbeddingService.class);

    @Value("${google.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Generate embeddings using Google's Gemini embedding model
     */
    public float[] generateEmbedding(String text) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=" + apiKey;

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "models/text-embedding-004");
        requestBody.put("content", Map.of(
            "parts", List.of(Map.of("text", text))
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            Map<String, Object> body = response.getBody();
            
            if (body != null && body.containsKey("embedding")) {
                Map<String, Object> embedding = (Map<String, Object>) body.get("embedding");
                List<Double> values = (List<Double>) embedding.get("values");
                
                float[] result = new float[values.size()];
                for (int i = 0; i < values.size(); i++) {
                    result[i] = values.get(i).floatValue();
                }
                return result;
            }
            
            throw new RuntimeException("Invalid response from embedding API");
        } catch (Exception e) {
            logger.error("Error generating embedding: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate embedding", e);
        }
    }

    /**
     * Generate embeddings in batch for better performance
     */
    public List<float[]> generateEmbeddingsBatch(List<String> texts) {
        // For now, process individually. Could be optimized with batch API if available
        return texts.stream()
            .map(this::generateEmbedding)
            .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    public double cosineSimilarity(float[] vectorA, float[] vectorB) {
        if (vectorA.length != vectorB.length) {
            throw new IllegalArgumentException("Vectors must have the same dimension");
        }

        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += Math.pow(vectorA[i], 2);
            normB += Math.pow(vectorB[i], 2);
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
