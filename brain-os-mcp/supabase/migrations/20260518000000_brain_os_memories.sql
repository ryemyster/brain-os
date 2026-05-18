-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Memory table for brain-os context store
CREATE TABLE brain_os_memories (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  type       text        NOT NULL,                  -- company | story | session | insight | task
  label      text        NOT NULL,                  -- slug of entity (company name, theme, etc)
  section    text        NOT NULL DEFAULT '',        -- subsection e.g. 'Intel', 'Fit Score', 'Outreach'
  content    text        NOT NULL,
  embedding  vector(768),                           -- nomic-embed-text output dimension
  metadata   jsonb       DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (type, label, section)
);

-- Vector similarity index
CREATE INDEX ON brain_os_memories USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- RLS: table is private — only service role can access
ALTER TABLE brain_os_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role full access" ON brain_os_memories
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Similarity search function
CREATE OR REPLACE FUNCTION search_brain_os_memories(
  query_embedding vector(768),
  match_type      text    DEFAULT NULL,
  match_count     int     DEFAULT 5
)
RETURNS TABLE (
  id         uuid,
  type       text,
  label      text,
  section    text,
  content    text,
  metadata   jsonb,
  created_at timestamptz,
  updated_at timestamptz,
  similarity float
)
LANGUAGE sql STABLE AS $$
  SELECT id, type, label, section, content, metadata, created_at, updated_at,
         1 - (embedding <=> query_embedding) AS similarity
  FROM   brain_os_memories
  WHERE  match_type IS NULL OR type = match_type
  ORDER  BY embedding <=> query_embedding
  LIMIT  match_count;
$$;
