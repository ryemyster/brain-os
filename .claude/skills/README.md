# Skills

Skills are slash commands that Claude Code exposes as reusable, composable workflows. They live here as `.md` files and are invoked with `/skill-name` in any Claude Code session.

## What a skill is

A skill is a markdown file that contains a prompt template Claude follows when invoked. It can reference files, run tools, call MCP servers, and produce structured output. Think of it as a macro for a workflow you run repeatedly.

## What's defined

Five skills are currently active:

### Orchestration & Workflow
- **`/job-search`** — Main orchestration skill for job hunt lifecycle. Chains together: scan → intel → fit → prep → apply/outreach → proctor → diagnose. Guides you through the full funnel from opportunity discovery to interview prep to pattern learning. Use this for end-to-end job hunting sessions.
- **`/prep-loop`** — Quick 3-step sequence: intel → fit → prep for a specific company. Use this when you already know which company to prepare for and want fast intel + fit check + prep in one go.

### Productivity & Persistence
- **`/build-brainos`** — Rebuild the BrainOS MCP server (`npm run build` inside `brain-os-mcp/`) and report any TypeScript compilation errors. Use this after making changes to brain-os source code.
- **`/sync-context`** — End-of-session summary and persistence workflow. Summarizes what was accomplished and calls `remember` with `type=session` to save the work. Use this at the end of substantive sessions to persist learnings.

### Collaborative Work
- **`/doc-coauthoring`** — Structured workflow for collaborative document creation. Guides through Context Gathering → Refinement → Reader Testing phases. Use this for building polished, multi-draft documents.

## How to add a skill

Create a `.md` file in this directory. The filename becomes the slash command name (e.g., `draft-article.md` → `/draft-article`). The file content is the prompt Claude follows.
