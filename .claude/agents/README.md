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

## Context Engine (MCP — `mcp__context-engine__*`)

Use context engine before any broad file reading. MCP is the primary transport — see `.claude/rules/context-engine.md` for full workflow.

**Workflow: `find → assess → read → act → verify → refresh`**

**Cost order (cheapest → most expensive):**
`vector_search` → `load_context` → `investigate_codebase` → `recall` → `search` → external APIs

Move right only when the cheaper option didn't answer. Always use `mode=context_safe` unless exact implementation detail is required. If a `context_safe` discovery result is thin, retry once without the mode flag before expanding scope. Path prefix: `ryemyster/brain-os/` — never a bare `.`.

**Confidence gate before reading:** ≥1 matching artifact and scope ≤3 files = proceed. Otherwise escalate (one re-call without mode flag, then ask). Never read broadly on thin discovery.

**Verify after every Edit/Write:** call `review_diff` with `git diff HEAD` — required gate, not optional.

**Anti-patterns to avoid:** reading entire directories before relevance is established, loading multiple architecture docs simultaneously, using full-detail mode by default.

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
