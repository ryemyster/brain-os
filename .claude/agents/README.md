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
