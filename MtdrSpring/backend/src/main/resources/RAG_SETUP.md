# RAG (Retrieval-Augmented Generation) Database Setup

This guide explains how to set up the RAG feature tables in your Oracle 23ai database.

## Prerequisites

- Oracle Database 23ai with **Vector Search** support
- Database user with CREATE TABLE and CREATE INDEX privileges
- VECTOR and JSON data type support enabled

## Why Manual Setup?

The RAG tables (`repository_embeddings`, `commit_cache`, `search_cache`) use Oracle 23ai-specific features:
- **VECTOR(768, FLOAT32)** - For storing embeddings
- **JSON** - For metadata storage

These types are not recognized by Hibernate, so the schema must be created manually.

## Setup Instructions

### Option 1: Using SQL*Plus or SQL Developer

1. Connect to your Oracle database
2. Run the SQL script located at: `src/main/resources/schema.sql`

```bash
sqlplus username/password@database
@schema.sql
```

### Option 2: Manual Table Creation

Execute the following SQL statements in your Oracle 23ai database:

```sql
-- Create table for storing repository embeddings
CREATE TABLE repository_embeddings (
    id VARCHAR2(255) PRIMARY KEY,
    commit_hash VARCHAR2(255) NOT NULL,
    file_path VARCHAR2(4000),
    chunk_index NUMBER,
    content CLOB NOT NULL,
    embedding VECTOR(768, FLOAT32),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSON
);

CREATE VECTOR INDEX repo_embedding_idx ON repository_embeddings(embedding)
ORGANIZATION NEIGHBOR PARTITIONS
WITH TARGET ACCURACY 95;

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
```

## Verification

After running the schema, verify the tables were created:

```sql
SELECT table_name FROM user_tables WHERE table_name IN ('REPOSITORY_EMBEDDINGS', 'COMMIT_CACHE', 'SEARCH_CACHE');
```

## Troubleshooting

### Error: "ORA-00902: invalid datatype"
- Your Oracle database version doesn't support VECTOR or JSON types
- Ensure you're using Oracle Database 23ai or later
- Contact your DBA to enable Vector Search features

### Error: "ORA-00955: name is already used by an existing object"
- Tables already exist - you can skip this step
- Or drop existing tables first: `DROP TABLE table_name CASCADE CONSTRAINTS;`

## Environment Variables

Make sure these are set in your `.env` file:

```env
GOOGLE_API_KEY=your_gemini_api_key
REPO_URL=https://github.com/Tomatillos-T/TomaTasks.git
REPO_BRANCH=dev
REPO_PATH=/tmp/repo
```

## Running Without RAG Tables

If you don't need the RAG feature, the application will still work without these tables. The RAG endpoints will return errors, but all other functionality (projects, tasks, sprints, teams, users) will work normally.

To disable RAG endpoints, you can:
1. Not create the RAG tables
2. Not set the GOOGLE_API_KEY environment variable
3. The frontend chatbot feature will show errors but won't crash the app
