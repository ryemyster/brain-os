# Rules & Guardrails

This directory documents standing rules and hook intent for Claude Code in this repo.

## Active Rules

| Rule | File | Purpose |
|------|------|---------|
| BrainOS context contract | `../brainos-context-contract.md` | Defines context ownership between this repo and the standalone MCP server |
| Token discipline | `token-discipline.md` | Prevent repo over-scanning, broad context loading, and unapproved live/build commands |
| Security | `security.md` | Prevent reading, printing, searching, or exposing secrets and real environment files |
| Repo boundaries | `repo-boundaries.md` | Never edit files outside this repo — cross-repo bugs get documented and handed off |

Claude should read `security.md` and `repo-boundaries.md` for every task, `token-discipline.md` before broad exploration, and `brainos-context-contract.md` before BrainOS MCP tool calls.

## Hooks

Hooks are automatic behaviors that Claude Code runs before or after specific events — tool calls, session start, session end, file writes, etc. They are configured in `.claude/settings.json` as shell commands.

This README also tracks hook intent and what's configured.

## What hooks do

Hooks intercept Claude Code events and run a shell command. They can:
- Inject context into a session automatically (auto-enrich)
- Validate output before it's returned (quality gate)
- Block unsafe actions (safety guard)
- Log activity for later review
- Trigger downstream actions (e.g., sync to Notion after a `remember` call)

## Hook events available

| Event | When it fires |
|-------|--------------|
| `PreToolUse` | Before any tool call — can block or modify |
| `PostToolUse` | After any tool call — can log, enrich, or trigger side effects |
| `Stop` | When Claude finishes a response — good for summaries or syncs |
| `Start` (session) | When a new session opens — good for context injection |

## What's missing — examples by type

### Context selection (auto-enrich)
Automatically load relevant context so you don't have to ask for it:
- On session start: run `daily` briefing and inject pipeline status into context
- When a company name appears in a prompt: auto-load `context-store/context/companies/{slug}.md` before responding
- When a tool like `prep` or `apply` is called: inject `context-store/career/resume.md` and `context-store/career/voice-and-style.md`

For BrainOS MCP tools, orchestration should pass concise explicit context gathered from `context-store/`; the MCP server should not read this repo's filesystem layout directly.

### Quality gates
Validate output before it's returned:
- After `apply` runs: check that the cover letter contains at least one metric from `context-store/career/achievements.md`
- After `story_draft` runs: confirm the output has a Situation, Task, Action, Result structure

### Safety guards
Block or warn on risky actions:
- Prevent writes to `context-store/career/resume.md` without explicit confirmation
- Warn if a tool call would overwrite an existing `context-store/context/companies/` file

### Auto-sync (Phase 4)
Trigger downstream systems after a tool completes:
- After `remember type=company`: push the updated company file to Notion pipeline database
- After `outreach` runs: append to `context-store/context/outreach-log.md` automatically (this is already done in code — hook version would add Notion sync)
- After session ends: write a session summary to `context-store/sessions/`

## Currently configured hooks

**Stop Hook (runs on session end):**
- **Command:** `./.claude/scripts/session-write.sh`
- **Purpose:** Auto-archive old sessions and write a session summary to `context-store/sessions/`

**PostToolUse Hooks (fire after specific tools to prompt persistence):**

| Tool | Action |
|------|--------|
| `intel` | Prompt: "Intel gathered. Call `remember type=company` to persist findings to BrainOS operational memory; write local notes under `context-store/context/companies/` only when needed" |
| `fit` | Prompt: "Fit score generated. Call `remember type=company` to append fit score + rationale to company file" |
| `prep` | Prompt: "Prep complete. Call `remember type=company` to append prep notes to company file" |
| `apply` | Prompt: "Apply analysis complete. Call `remember type=session` to save gap analysis + cover letter" |
| `outreach` | Prompt: "Outreach drafted. Call `remember type=company` to append outreach drafts + warm intro paths to company file" |
| `story_draft` | Prompt: "Story drafted. Call `remember type=story` to save STAR story to story library for future interview prep" |
| `diagnose` | Prompt: "Diagnosis complete. Call `remember type=insight` to save pattern findings to recurring-gaps library" |
| `scan` | Prompt: "Scan complete. Call `remember type=session` to save high-signal opportunities or patterns found" |

## How to add a hook

Edit `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "mcp__brain-os__remember",
        "hooks": [{ "type": "command", "command": "echo 'remember called' >> /tmp/brainos.log" }]
      }
    ]
  }
}
```

Document what you add here so there's a record of what's active and why.
