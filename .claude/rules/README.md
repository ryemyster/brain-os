# Hooks (Rules & Guardrails)

Hooks are automatic behaviors that Claude Code runs before or after specific events — tool calls, session start, session end, file writes, etc. They are configured in `.claude/settings.json` as shell commands.

This directory is for documenting hook intent and tracking what's been configured vs. what's missing.

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

### Context injection (auto-enrich)
Automatically load relevant context so you don't have to ask for it:
- On session start: run `daily` briefing and inject pipeline status into context
- When a company name appears in a prompt: auto-load `context/companies/{slug}.md` before responding
- When a tool like `prep` or `apply` is called: inject `career/resume.md` and `career/voice-and-style.md`

### Quality gates
Validate output before it's returned:
- After `apply` runs: check that the cover letter contains at least one metric from `career/achievements.md`
- After `story_draft` runs: confirm the output has a Situation, Task, Action, Result structure

### Safety guards
Block or warn on risky actions:
- Prevent writes to `career/resume.md` without explicit confirmation
- Warn if a tool call would overwrite an existing `context/companies/` file

### Auto-sync (Phase 4)
Trigger downstream systems after a tool completes:
- After `remember type=company`: push the updated company file to Notion pipeline database
- After `outreach` runs: append to `context/outreach-log.md` automatically (this is already done in code — hook version would add Notion sync)
- After session ends: write a session summary to `context/sessions/`

## Currently configured hooks

None. Check `.claude/settings.json` for the current state.

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
