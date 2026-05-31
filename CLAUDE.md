# CLAUDE.md — BrainOS

Read this at the start of every BrainOS session. This repo is the Claude Code orchestration workspace and durable personal context layer, not the MCP server codebase.

## Identity & Focus

Ryan K. McDonald is a Senior PM focused on AI, FinTech, HealthTech, and agent-orchestrated product systems. Founder of Ascendvent / AOSI.

Primary focus for May 2026:

- Job hunt: Senior PM or Head of Product roles, AI-native companies preferred.
- Secondary: Ascendvent products, BrainOS, FounderOS, writing, and selected side projects.

## Start Here

Use these durable references instead of re-scanning the repo:

| Need | Read |
|------|------|
| Repo orientation and file boundaries | `.claude/project-map.md` |
| Context ownership contract | `.claude/brainos-context-contract.md` |
| Token/scanning limits | `.claude/rules/token-discipline.md` |
| Job-search workflow details | `.claude/commands/job-search.md` |
| Content-only edits | `.claude/agents/content-update.md` |
| MCP server development | sibling repo `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp` |
| System architecture and data flows | `docs/ARCHITECTURE.md` |
| Context engine live protocol | `GET http://localhost:8088/setup` (once per session; path prefix: `ryemyster/brain-os/`) |

## Default Routing

- "What happened today" / "catch me up" / "what's on my plate" / "daily summary": run the `/daily` flow — context engine wave scan (sessions → context) → recall → Calendar/Gmail → combine. Never answer from session memory alone; the context store has prior-session data that is invisible to this session.
- Company name or role mentioned: assume job-search context.
- Pasted job description: use the `apply` workflow.
- Upcoming interview or meeting: use `prep` or `/prep-loop`.
- MCP/tool/schema/runtime question: document the issue and tell Ryan — do NOT cd into or edit `brain-os-mcp`.
- Code/package question in sibling repo: document file/line/fix/use-case and hand off — do NOT enter or edit the other repo.
- Content-only update: stay in the target markdown area; use `context-store/career/voice-and-style.md` only when tone matters.
- Writing/blog work: match `context-store/career/voice-and-style.md`.

## Core Sources

| Source | Use |
|--------|-----|
| `context-store/career/resume.md` | Local resume fallback |
| `context-store/career/achievements.md` | Wins, metrics, STAR stories fallback |
| `context-store/career/voice-and-style.md` | Writing tone and style |
| `context-store/career/job-criteria.md` | Role preferences |
| `context-store/projects/index.md` | Cross-project status and routing |
| `context-store/context/` | Human-readable memory docs and session context |
| Supabase memory via BrainOS MCP | `recall(list)` → enumerate labels; `recall(label)` → load exact entry with `updatedAt`; `search(query)` → semantic discovery |
| `concept-images/` | Private visual reference/inspiration only; do not publish, quote, or embed |

Notion is the primary source for several career/workflow tools. Local markdown is still useful, but do not assume it is the only source of truth.

## BrainOS MCP Server

The BrainOS MCP server now lives in the sibling repo:

`/Users/rmcdonald/Repos/ryemyster/brain-os-mcp`

This root repo should not run MCP builds, tests, server starts, or package release checks. For MCP development, work from the sibling repo.

The MCP server should not read this repo's filesystem layout directly. Before calling BrainOS MCP tools, gather the minimum relevant context from `context-store/` and pass concise context explicitly.

## Working Rules

- Be direct and concise.
- Prefer exact file references over broad summaries.
- Do not inspect unrelated areas once the answer is clear.
- Start with `.claude/project-map.md` before broad exploration.
- Follow `.claude/brainos-context-contract.md` before MCP tool calls. Always: localhost:8088 → recall(list) → recall/search → external APIs.
- Do not treat this root repo as an app codebase.
- Follow `.claude/rules/token-discipline.md` for exploration limits.
- Follow `.claude/rules/security.md`; never read real `.env`, `.env.*`, `*.env`, or secret-bearing settings files.
- Empty career files mean “ask for content,” not “infer or hallucinate.”
- At the end of substantive job-search or research sessions, persist important learnings with `remember` or `/sync-context`.

## GitHub Account Policy

Two GitHub accounts are used: `ryemyster` and `ascendvent`.

- Git remotes should use SSH aliases already configured locally.
- For `gh` CLI work in this repo, prefer `.claude/scripts/gh-brain-os.sh`.
- Ask before running GitHub commands that read or mutate remote state.

More detail belongs in durable workflow docs, not active chat context.
