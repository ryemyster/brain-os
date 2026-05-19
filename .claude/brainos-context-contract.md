# BrainOS Context Contract

This repo is the BrainOS orchestration workspace.

Local durable context lives in `context-store/`.

The orchestration layer owns:

- reading local context files
- selecting relevant context
- summarizing large context
- passing explicit context into BrainOS MCP tools
- writing durable local notes back into `context-store/`

The standalone MCP server owns:

- MCP tool schemas
- validation
- LLM/tool execution
- configured service integrations
- Supabase/Notion memory writes when explicitly requested

The MCP server must not read this repo's filesystem layout directly.

Before calling MCP tools, gather only the minimum relevant context from `context-store/`.

## Operating Rule

Do not pass folder dumps to MCP tools. Read the smallest relevant files, summarize them when large, and pass only the context the tool needs for the specific task.

## Current Context Roots

| Path | Purpose |
|------|---------|
| `context-store/career/` | Resume, achievements, voice, job criteria, pipeline, interview notes |
| `context-store/writing/` | Drafts, published writing, and idea backlog |
| `context-store/projects/` | Project index and cross-repo status |
| `context-store/context/` | Human-readable memory, insights, stories, companies |
| `context-store/sessions/` | Session notes and auto-written session summaries |
| `concept-images/` | Private visual inspiration/reference only |
