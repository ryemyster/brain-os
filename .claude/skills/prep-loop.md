Job hunt prep sequence for a named company. Run all three tools in order and present results as a unified briefing.

Usage: /prep-loop <company name>

Before tool calls, gather only relevant local context from `context-store/`:
- matching company notes from `context-store/career/pipeline/` or `context-store/context/companies/` if present
- concise resume/achievement/story context only if needed

Pass concise context explicitly. Do not assume the MCP server reads this repo directly.

Steps:
1. Call `mcp__brain-os__intel` for the company — fetch and present the intelligence report
2. Call `mcp__brain-os__fit` for the company — fetch Notion context and generate the fit score + verdict
3. Call `mcp__brain-os__prep` for the company — fetch Notion context and generate the full prep briefing

Present in order: **Intel → Fit verdict → Prep briefing**. No filler between sections — just the outputs.
