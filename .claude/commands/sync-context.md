End-of-session context sync. Summarize the session and persist it to both BrainOS memory (Supabase) and local `context-store/sessions/`.

## Step 0 — Check context engine (skip if session files already in context)

```bash
curl -s http://localhost:8088/healthcheck
```
If up and session files not already known:
```
POST /find {"path": "ryemyster/brain-os/context-store/sessions", "query": "recent session summary"}
```
Use `POST /vector-search {"query": "recent session summary open threads"}` to retrieve indexed context. Use it to avoid duplicate session files and to surface the last session's open threads.

## Steps

1. **Summarize** this session in 3–5 tight bullets:
   - What was discussed
   - What was decided or changed
   - Active pipeline state (companies, statuses, follow-ups)
   - What's next

2. **Write to local context-store** — create or update a session file:
   ```
   context-store/sessions/YYYY-MM-DD-<topic>-manual.md
   ```
   Format: date, topic, bullet summary, next actions. Keep it under 30 lines.

3. **Write to BrainOS memory** — call `mcp__brain-os-mcp__remember`:
   ```
   type: "session"
   label: "YYYY-MM-DD-<topic>"
   content: the summary from step 1
   ```

4. **Confirm** what was saved and where (local file path + Supabase key).

## Rules

- Keep the summary factual and dense — this is for future-session recall, not a narrative.
- Do not write broad dumps — bullets only.
- If company intel was gathered this session, also call `remember(type=company, ...)` for each company.
- Do not assume the MCP server writes local markdown — Claude Code writes the local file directly.
- Follow `.claude/rules/security.md` — never include secrets or credential values in session notes.
