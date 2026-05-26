Job hunt prep sequence for a named company. Checks stored context first, then runs intel → fit → prep in order and presents results as a unified briefing.

Usage: /prep-loop <company name>

## Step 0 — Check local context first (always)

Before any MCP tool calls:

1. **localhost:8088** — scan for local notes on this company:
   ```
   curl -s http://localhost:8088/healthcheck
   POST /find  {"path": "context-store/", "query": "<company name>"}
   ```
   Read `ai-context/` output. If recent session notes or company files exist, carry them forward.

2. **recall list** — discover what's stored for companies:
   ```
   recall(action="list", listType="company")
   ```
   Check if the target company slug appears. If yes, proceed to exact recall. If no, use `search` for semantic check.

3. **recall or search** — load stored context:
   - If label found: `recall(type=company, label=<slug>)` → check `updatedAt`
     - If `updatedAt` < 30d → skip `intel`, go straight to `fit` or `prep`
     - If `updatedAt` > 30d or null → run `intel` to refresh
   - If label not found: `search(query="<company name>", type="company")` → pass any hits as `pipelineNotes` to `intel`

## Step 1 — Intel (skip if recall hit and recent)

Call `mcp__brain-os-mcp__intel` for the company.
Pass any local notes from Step 0 as `pipelineNotes`.

## Step 2 — Fit

Call `mcp__brain-os-mcp__fit` for the company.
Pass intel output + job criteria from `context-store/career/job-criteria.md` as context.

## Step 3 — Prep

Call `mcp__brain-os-mcp__prep` for the company.
Pass synthesized intel + fit + any achievements context from `context-store/career/achievements.md`.

## Output

Present in order: **Intel → Fit verdict → Prep briefing**. No filler between sections.

## Step 4 — Persist

Call `remember(type=company, label=<company>, section=Prep)` after prep completes.
