-- Create table for storing repository embeddings
CREATE TABLE repository_embeddings (
    id VARCHAR2(255) PRIMARY KEY,
    commit_hash VARCHAR2(255) NOT NULL,
    file_path VARCHAR2(4000),
    chunk_index NUMBER,
    content CLOB NOT NULL,
    embedding VECTOR(768, FLOAT32),  -- Adjust dimension based on your model
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSON
);

-- Create vector index for similarity search
CREATE VECTOR INDEX repo_embedding_idx ON repository_embeddings(embedding)
ORGANIZATION NEIGHBOR PARTITIONS
WITH TARGET ACCURACY 95;

-- Create indexes for faster lookups
CREATE INDEX idx_commit_hash ON repository_embeddings(commit_hash);
CREATE INDEX idx_file_path ON repository_embeddings(file_path);

-- Create table for caching commit metadata
CREATE TABLE commit_cache (
    commit_hash VARCHAR2(255) PRIMARY KEY,
    message CLOB,
    author VARCHAR2(500),
    commit_time TIMESTAMP,
    diff_cached CLOB,
    processed CHAR(1) DEFAULT 'N',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_commit_time ON commit_cache(commit_time DESC);
CREATE INDEX idx_processed ON commit_cache(processed);

-- Create table for semantic search cache
CREATE TABLE search_cache (
    id VARCHAR2(255) PRIMARY KEY,
    query_text CLOB NOT NULL,
    query_embedding VECTOR(768, FLOAT32),
    results JSON,
    hit_count NUMBER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE VECTOR INDEX search_cache_idx ON search_cache(query_embedding)
ORGANIZATION NEIGHBOR PARTITIONS
WITH TARGET ACCURACY 90;
