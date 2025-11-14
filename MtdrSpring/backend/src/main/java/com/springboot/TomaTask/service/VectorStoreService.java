package com.springboot.TomaTask.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;

@Service
public class VectorStoreService {

    private static final Logger logger = LoggerFactory.getLogger(VectorStoreService.class);
    private final JdbcTemplate jdbcTemplate;

    public VectorStoreService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Store embedding in Oracle Vector Store
     */
    @Transactional
    public void storeEmbedding(String id, String commitHash, String filePath, 
                               int chunkIndex, String content, float[] embedding, 
                               Map<String, Object> metadata) {
        String sql =
            "MERGE INTO repository_embeddings t\n" +
            "USING (SELECT ? AS id FROM dual) s\n" +
            "ON (t.id = s.id)\n" +
            "WHEN MATCHED THEN\n" +
            "    UPDATE SET \n" +
            "        content = ?,\n" +
            "        embedding = TO_VECTOR(?, 768, FLOAT32),\n" +
            "        updated_at = CURRENT_TIMESTAMP,\n" +
            "        metadata = ?\n" +
            "WHEN NOT MATCHED THEN\n" +
            "    INSERT (id, commit_hash, file_path, chunk_index, content, embedding, metadata)\n" +
            "    VALUES (?, ?, ?, ?, ?, TO_VECTOR(?, 768, FLOAT32), ?)";

        String embeddingStr = floatArrayToString(embedding);
        String metadataJson = metadata != null ? toJson(metadata) : null;

        jdbcTemplate.update(sql, 
            id, content, embeddingStr, metadataJson,
            id, commitHash, filePath, chunkIndex, content, embeddingStr, metadataJson
        );

        logger.debug("Stored embedding for id: {}", id);
    }

    /**
     * Semantic search using vector similarity
     */
    public List<SearchResult> semanticSearch(float[] queryEmbedding, int limit, String commitHash) {
        String sql =
            "SELECT \n" +
            "    id, commit_hash, file_path, chunk_index, content,\n" +
            "    VECTOR_DISTANCE(embedding, TO_VECTOR(?, 768, FLOAT32), COSINE) AS distance,\n" +
            "    metadata\n" +
            "FROM repository_embeddings\n" +
            "WHERE 1=1\n" +
            (commitHash != null ? " AND commit_hash = ? " : "") +
            "ORDER BY VECTOR_DISTANCE(embedding, TO_VECTOR(?, 768, FLOAT32), COSINE)\n" +
            "FETCH FIRST ? ROWS ONLY";

        String embeddingStr = floatArrayToString(queryEmbedding);

        return jdbcTemplate.query(
            connection -> {
                PreparedStatement ps;
                if (commitHash != null) {
                    ps = connection.prepareStatement(sql);
                    ps.setString(1, embeddingStr);
                    ps.setString(2, commitHash);
                    ps.setString(3, embeddingStr);
                    ps.setInt(4, limit);
                } else {
                    ps = connection.prepareStatement(sql);
                    ps.setString(1, embeddingStr);
                    ps.setString(2, embeddingStr);
                    ps.setInt(3, limit);
                }
                return ps;
            },
            (rs, rowNum) -> new SearchResult(
                rs.getString("id"),
                rs.getString("commit_hash"),
                rs.getString("file_path"),
                rs.getInt("chunk_index"),
                rs.getString("content"),
                rs.getDouble("distance"),
                rs.getString("metadata")
            )
        );
    }

    /**
     * Check if commit is already processed
     */
    public boolean isCommitProcessed(String commitHash) {
        String sql = "SELECT COUNT(*) FROM commit_cache WHERE commit_hash = ? AND processed = 'Y'";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, commitHash);
        return count != null && count > 0;
    }

    /**
     * Cache commit metadata
     */
    @Transactional
    public void cacheCommit(String commitHash, String message, String author,
                           long commitTime, String diff) {
        String sql =
            "MERGE INTO commit_cache t\n" +
            "USING (SELECT ? AS commit_hash FROM dual) s\n" +
            "ON (t.commit_hash = s.commit_hash)\n" +
            "WHEN MATCHED THEN\n" +
            "    UPDATE SET \n" +
            "        message = ?,\n" +
            "        author = ?,\n" +
            "        commit_time = ?,\n" +
            "        diff_cached = ?,\n" +
            "        updated_at = CURRENT_TIMESTAMP\n" +
            "WHEN NOT MATCHED THEN\n" +
            "    INSERT (commit_hash, message, author, commit_time, diff_cached)\n" +
            "    VALUES (?, ?, ?, ?, ?)";

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql);
            java.sql.Timestamp timestamp = new java.sql.Timestamp(commitTime * 1000);

            // Set parameters with explicit types for CLOB columns
            ps.setString(1, commitHash);
            if (message != null) {
                ps.setString(2, message);
            } else {
                ps.setNull(2, java.sql.Types.CLOB);
            }
            ps.setString(3, author);
            ps.setTimestamp(4, timestamp);
            if (diff != null) {
                ps.setString(5, diff);
            } else {
                ps.setNull(5, java.sql.Types.CLOB);
            }

            // Repeat for INSERT clause
            ps.setString(6, commitHash);
            if (message != null) {
                ps.setString(7, message);
            } else {
                ps.setNull(7, java.sql.Types.CLOB);
            }
            ps.setString(8, author);
            ps.setTimestamp(9, timestamp);
            if (diff != null) {
                ps.setString(10, diff);
            } else {
                ps.setNull(10, java.sql.Types.CLOB);
            }

            return ps;
        });
    }

    /**
     * Mark commit as processed
     */
    @Transactional
    public void markCommitProcessed(String commitHash) {
        String sql = "UPDATE commit_cache SET processed = 'Y' WHERE commit_hash = ?";
        jdbcTemplate.update(sql, commitHash);
    }

    /**
     * Get cached commit diff
     */
    public String getCachedCommitDiff(String commitHash) {
        String sql = "SELECT diff_cached FROM commit_cache WHERE commit_hash = ?";
        List<String> results = jdbcTemplate.query(sql, 
            (rs, rowNum) -> rs.getString("diff_cached"), 
            commitHash
        );
        return results.isEmpty() ? null : results.get(0);
    }

    /**
     * Get cached commits metadata
     */
    public List<CommitMetadata> getCachedCommits(int limit, int offset) {
        String sql =
            "SELECT commit_hash, message, author, commit_time, processed\n" +
            "FROM commit_cache\n" +
            "ORDER BY commit_time DESC\n" +
            "OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";

        return jdbcTemplate.query(sql,
            (rs, rowNum) -> {
                String processed = rs.getString("processed");
                java.sql.Timestamp timestamp = rs.getTimestamp("commit_time");

                return new CommitMetadata(
                    rs.getString("commit_hash"),
                    rs.getString("message"),
                    rs.getString("author"),
                    timestamp != null ? timestamp.getTime() / 1000 : 0,
                    "Y".equals(processed)
                );
            },
            offset,
            limit
        );
    }

    /**
     * Delete embeddings for a specific commit
     */
    @Transactional
    public void deleteCommitEmbeddings(String commitHash) {
        String sql = "DELETE FROM repository_embeddings WHERE commit_hash = ?";
        jdbcTemplate.update(sql, commitHash);
        logger.info("Deleted embeddings for commit: {}", commitHash);
    }

    /**
     * Get statistics
     */
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        Integer embeddingCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM repository_embeddings", Integer.class
        );
        
        Integer commitCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM commit_cache", Integer.class
        );
        
        Integer processedCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM commit_cache WHERE processed = 'Y'", Integer.class
        );

        stats.put("totalEmbeddings", embeddingCount);
        stats.put("totalCommits", commitCount);
        stats.put("processedCommits", processedCount);
        
        return stats;
    }

    // Helper methods
    private String floatArrayToString(float[] array) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < array.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(array[i]);
        }
        sb.append("]");
        return sb.toString();
    }

    private String toJson(Map<String, Object> map) {
        // Simple JSON conversion - in production, use Jackson or Gson
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(map);
        } catch (Exception e) {
            logger.error("Error converting to JSON", e);
            return "{}";
        }
    }

    // Result classes
    public static class SearchResult {
        public String id;
        public String commitHash;
        public String filePath;
        public int chunkIndex;
        public String content;
        public double distance;
        public String metadata;

        public SearchResult(String id, String commitHash, String filePath, 
                          int chunkIndex, String content, double distance, String metadata) {
            this.id = id;
            this.commitHash = commitHash;
            this.filePath = filePath;
            this.chunkIndex = chunkIndex;
            this.content = content;
            this.distance = distance;
            this.metadata = metadata;
        }
    }

    public static class CommitMetadata {
        public String hash;
        public String message;
        public String author;
        public long timestamp;
        public boolean processed;

        public CommitMetadata(String hash, String message, String author, 
                            long timestamp, boolean processed) {
            this.hash = hash;
            this.message = message;
            this.author = author;
            this.timestamp = timestamp;
            this.processed = processed;
        }
    }
}
