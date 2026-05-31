# Skills

Skills are slash commands that Claude Code exposes as reusable, composable workflows. They live here as `.md` files and are invoked with `/skill-name` in any Claude Code session.

## What a skill is

A skill is a markdown file that contains a prompt template Claude follows when invoked. It can reference files, run tools, call MCP servers, and produce structured output. Think of it as a macro for a workflow you run repeatedly.

## What's Defined

Root orchestration skills are currently active here. MCP development skills live in the sibling repo `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp`.

### Orchestration & Workflow
- **`/daily`** — Start-of-day briefing. Surfaces calendar, email, job pipeline, and open threads from yesterday. Use when starting a morning session or asking what's on your plate.
- **`/job-search`** — Main orchestration skill for job hunt lifecycle. Chains together: scan → intel → fit → prep → apply/outreach → proctor → diagnose. Guides you through the full funnel from opportunity discovery to interview prep to pattern learning. Use this for end-to-end job hunting sessions.
- **`/prep-loop`** — Quick 3-step sequence: intel → fit → prep for a specific company. Use this when you already know which company to prepare for and want fast intel + fit check + prep in one go.

### Productivity & Persistence
- **`/sync-context`** — End-of-session summary and persistence workflow. Summarizes what was accomplished and calls `remember` with `type=session` to save the work. Use this at the end of substantive sessions to persist learnings.

### Collaborative Work
- **`/doc-coauthoring`** — Structured workflow for collaborative document creation. Guides through Context Gathering → Refinement → Reader Testing phases. Use this for building polished, multi-draft documents.

## Supporting Maps And Rules

These are not slash commands, but skills should use them for bounded operation:

- `.claude/project-map.md` — repo orientation and file boundaries
- `.claude/brainos-context-contract.md` — ownership boundary between local context and MCP tools
- `.claude/rules/token-discipline.md` — exploration limits and stop conditions
- `.claude/rules/security.md` — secret and environment-file handling rules
- `.claude/agents/README.md` — focused agent model for app, MCP, content, review, and release work
- `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp/.claude/` — MCP development agents, skills, and rules

## How to add a skill

Create a `.md` file in this directory. The filename becomes the slash command name (e.g., `draft-article.md` → `/draft-article`). The file content is the prompt Claude follows.
