Job hunt prep sequence for a named company. Run all three tools in order and present results as a unified briefing.

Usage: /prep-loop <company name>

Steps:
1. Call `mcp__brain-os__intel` for the company — fetch and present the intelligence report
2. Call `mcp__brain-os__fit` for the company — fetch Notion context and generate the fit score + verdict
3. Call `mcp__brain-os__prep` for the company — fetch Notion context and generate the full prep briefing

Present in order: **Intel → Fit verdict → Prep briefing**. No filler between sections — just the outputs.
