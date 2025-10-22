package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.service.RagService;
import com.springboot.TomaTask.service.RepositoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rag")
public class RagController {

    private final RagService ragService;
    private final RepositoryService repoService;

    public RagController(RagService ragService, RepositoryService repoService) {
        this.ragService = ragService;
        this.repoService = repoService;
    }

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

    @GetMapping("/commits")
    public ResponseEntity<?> getCommits(@RequestParam(defaultValue = "20") int limit) {
        try {
            return ResponseEntity.ok(repoService.getRecentCommits(limit));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

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
}
