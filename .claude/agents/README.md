# Agents

This directory contains focused Claude agent definitions for the BrainOS orchestration/context repo. MCP server development agents live in the sibling repo `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp`.

## Current Agents

| Agent | File | Purpose | Default Scope |
|-------|------|---------|---------------|
| `content-update` | `content-update.md` | Markdown and content-only updates | Target content files, style guide when needed |

## When To Use

- Use `content-update` for markdown/content-only changes.
- Use the sibling `brain-os-mcp` repo for MCP package code questions, tool schemas, memory, integrations, runtime behavior, PR review, and release checks.
- Do not use agents when the answer is already clear from `.claude/project-map.md`.

## Context Engine (localhost:8088)

Before any broad exploration, use the context engine instead of raw file reads. It does the mechanical scan work so agent tokens stay on judgment.

**Cost hierarchy (cheapest → most expensive):**
```
ai-context/ cache → /find → /summarize → /context → recall → search → external APIs
```
Move right only when the cheaper option didn't answer the question.

**Endpoints for this repo:**

| Need | Call |
|------|------|
| Find where something lives | `POST /find {"path": "ryemyster/brain-os/context-store", "query": "..."}` |
| File inventory for a directory | `POST /scan {"path": "ryemyster/brain-os/.claude"}` |
| Deep read of one file | `POST /summarize {"file": "ryemyster/brain-os/<relative-path>"}` |
| Full context bundle (code tasks) | `POST /context {"task": "...", "paths": ["ryemyster/brain-os/..."], "focus": [...]}` |
| Full integration protocol | `GET http://localhost:8088/setup` (once per session, not per task) |

**Wave scanning — always use small targeted calls, never broad paths:**

Scan in waves. Stop as soon as the answer is found. Never pass the whole repo as a path.

```
Wave 1: narrowest likely path  →  read ai-context/ output  →  stop if found
Wave 2: next subdirectory      →  read ai-context/ output  →  stop if found
Wave 3: expand again           →  stop if found
```

Example — looking for company notes:
```
Wave 1: POST /find {"path": "ryemyster/brain-os/context-store/context", "query": "Stripe"}
Wave 2: POST /find {"path": "ryemyster/brain-os/context-store/sessions", "query": "Stripe"}
```
Never: `"path": "ryemyster/brain-os"` — that scans the whole repo.

**Rules:**
- Path prefix for this repo: `ryemyster/brain-os/` — never a bare `.`
- Max one subdirectory per wave; narrow the query before widening the path
- **Code repos: always scope to `src/` or equivalent** — never the repo root; skip `node_modules/`, `dist/`, `.next/`, `build/`, `.claude/`, `CLAUDE.md`
- Output lands in `ryemyster/local-model/ai-context/` — read those files; don't re-call the same endpoint if the file exists
- If `/healthcheck` returns non-200, fall back to direct file reads

## Shared Rules

Agents should:

- Read `.claude/project-map.md` before broad exploration.
- Follow `.claude/rules/token-discipline.md`.
- Inspect only the requested area plus one dependency hop.
- Return exact file references.
- Stop before builds, live service calls, GitHub commands, or cross-repo scans unless approved.

## How To Add An Agent

Create a `.md` file here with:

- Purpose
- Use when / do not use when
- Allowed tools
- Approval-required actions
- File boundaries
- Exploration process
- Output format
