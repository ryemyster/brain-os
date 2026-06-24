---
name: context-load
description: Mid-session context re-anchor. Scans recent sessions and recall for current pipeline state. Use when session context feels stale or before any job-search decision.
---

# Context Load

Quick wave scan to surface current pipeline state without running the full daily brief.

## Steps

1. **Healthcheck**
   Call any `mcp__context-engine__*` tool (e.g. `load_context`). If it returns `engine_down`, skip to step 4 and proceed with recall + direct file reading.

2. **Wave 1 — recent sessions** (stop if found)
   ```
   load_context(task="pipeline status open items active companies", paths=["ryemyster/brain-os/context-store/sessions"], mode="context_safe")
   ```
   Extract: active companies, statuses, open items. Stop here if results are sufficient.

3. **Wave 2 — broader context** (if wave 1 is thin)
   ```
   load_context(task="current pipeline state open items active companies", paths=["ryemyster/brain-os/context-store/context"], mode="context_safe")
   ```
   If still thin, try `paths=["ryemyster/brain-os/context-store/career"]`. Stop when found.

4. **Recall check**
   ```
   recall(action="list", listType="company")
   ```
   Load any company entries with recent activity (< 14d).

5. **Surface a compact status block:**
   - Active pipeline (company → status → next action)
   - Open items carried forward
   - Anything to close or update

Keep the output tight — this is a status check, not a full brief.
