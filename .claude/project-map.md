# BrainOS Orchestration Project Map

Durable orientation for Claude Code. Read this before broad exploration, then inspect only the files relevant to the task.

## Repo Purpose

This repo is the BrainOS Claude Code orchestration workspace. It stores durable personal context, workflow rules, skills, agents, writing/job-search material, and references that help Claude work consistently across sessions.

This is not the MCP server codebase. The BrainOS MCP server lives in the sibling repo:

`/Users/rmcdonald/Repos/ryemyster/brain-os-mcp`

## Main Areas

| Path | Purpose | Inspect When |
|------|---------|--------------|
| `.claude/` | Claude Code workflow configuration | Changing agents, skills, hooks, rules, permissions, or local workflow |
| `context-store/career/` | Career source material | Resume, applications, interview prep, and job-search content only |
| `context-store/context/` | Human-readable memory docs and session notes | Memory architecture docs or manually stored insights |
| `context-store/sessions/` | Session notes and auto-written summaries | Session recall only; avoid broad reads |
| `context-store/projects/index.md` | Cross-repo project status | High-level project routing, not implementation detail |
| `context-store/writing/` | Drafts, published writing, and ideas | Writing/content tasks only |
| `concept-images/` | Private visual reference/inspiration | Understanding design direction only; do not publish or embed |

## Start Here By Task

| Task Type | First Files | Stop Condition |
|-----------|-------------|----------------|
| Claude workflow change | `.claude/settings.json`, `.claude/skills/`, `.claude/agents/`, `.claude/rules/` | Do not inspect MCP source unless a tool boundary is involved |
| Content-only update | Target markdown file, `context-store/career/voice-and-style.md` if tone matters | Do not inspect MCP source or run commands |
| Job-search workflow | `.claude/skills/job-search.md`, relevant `context-store/career/` files | Do not read broad session history unless needed |
| Writing/content | Target file, `context-store/career/voice-and-style.md` | Do not inspect MCP source or unrelated project files |
| MCP server development | Switch to `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp` | Do not perform MCP dev work in this repo |
| MCP tool call | `.claude/brainos-context-contract.md`, relevant `context-store/` files | Pass concise explicit context; do not assume MCP reads this repo |
| Concept/reference review | `concept-images/` only if explicitly requested | Do not publish, quote, or embed private reference images |

## Current Operational Model

- Active MCP server source lives in the sibling `brain-os-mcp` repo.
- Durable operational memory is implemented by the BrainOS MCP server through Supabase and Ollama.
- `context-store/` is the single root for local durable context.
- The orchestration layer reads/selects/summarizes local context before calling MCP tools.
- The MCP server receives explicit context and must not depend on this repo's filesystem layout.
- `context-store/context/` contains useful markdown documentation and manually curated context, but it is not the only runtime memory layer.
- `context-store/sessions/` contains session notes and can grow quickly; read narrowly.
- Root `.claude/` defines Claude Code orchestration behavior for this workspace.
- Local settings are ignored and should not contain committed secrets.

## Exploration Rules

- Prefer `rg` and targeted file reads over `find` or repo-wide scans.
- Read this file before opening broad directories.
- Do not treat this repo as an app codebase.
- For content work, stay in markdown/content paths.
- For MCP work, switch to the sibling MCP repo.
- For GitHub or remote work, use the repo/account policy docs before running `gh`, push, deploy, or build commands.

## Known Token Hotspots

- `context-store/career/` and `context-store/sessions/` can become large; read only what the task needs.
- MCP tools like `daily`, `prep`, `apply`, and `diagnose` can load broad context; call them with scope.
- Broad settings permissions make it easy for agents to over-read or over-act.
