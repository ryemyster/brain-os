End-of-session context sync. Summarize the session and persist it to BrainOS memory and/or `context-store/`.

Steps:
1. Summarize this session in 3–5 tight bullets: what was discussed, what was decided, what changed, what's next.
2. Call `mcp__brain-os__remember` with:
   - type: "session"
   - label: today's date in YYYY-MM-DD format
   - content: the summary from step 1
3. Confirm what was saved and where.

If local durable notes are needed, write them under `context-store/context/` using the smallest appropriate file. Do not assume the MCP server writes local markdown in this repo.

Keep the summary factual and dense — this is for future-session recall, not a narrative.
