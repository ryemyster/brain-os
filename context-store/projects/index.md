# Projects Index

One-paragraph summary of every active repo. Update this when a project's status or purpose shifts significantly. BrainOS `daily` reads this for active project context.

## Quick status reference (updated 2026-05-07)

| Project | gh account | Last commit | Top open issue |
| ------- | ---------- | ----------- | -------------- |
| checkin-ascendvent | ascendvent | 2026-05-07 — Apple-inspired landing overhaul | #394: downgrade client locking logic |
| brain-os | ryemyster | 2026-05-07 — Calendar/Gmail wired into daily | Stop hook + session persistence |
| portfolio | ryemyster | 2026-05-06 — new resume | #19: surface Ascendvent pivot as headline |
| frompixelstopunk | ryemyster | 2026-05-04 — punk succession post | #85: archive search/filter |
| techyeet-gaming | ryemyster | 2026-05-04 — May 2026 content | #2: mobile responsive audit |
| vscode-themes-vibecoded | ryemyster | 2026-05-05 — Claude context guide | #10: theme preview gallery |
| ascendvent-home | ascendvent | 2026-05-05 — typo fix | No issues tracked |
| founderos | ascendvent | 2026-04-27 — version sync | #12: semantic search (P0), #9: synthesize_thesis tool (P0) |
| SevenSharp | ascendvent | 2026-04-28 — toolchain cleanup | #54: external services setup blocks everything |
| ascendvent-planning | ascendvent | 2026-04-19 — silent launch marked | Local-only repo, no issue tracker |
| ShaleYeah | ryemyster | 2026-04-18 — cleanup/research | #315: split index.ts god class |
| small-language-models-for-pms | ryemyster | 2026-04-06 — core files | #7: repo hygiene |
| autoresearch | ryemyster | — | No git repo |

**gh account routing:** `ascendvent/` repos → use ascendvent account. All others → ryemyster. Script: `.claude/scripts/gh-brain-os.sh`

---

## Ascendvent (Brand + Planning)
**Repos:** `ascendvent-planning/`, `ascendvent-home/`
Ascendvent is a Coach-Mentee Operating System — agentic infrastructure for coaches. Powered by AOSI (Agent-Orchestrated Self-Improvement™, trademark filed). The methodology is invisible infrastructure; coaches own their clients, brand, and pricing. Current builds: Check-In by Ascendvent (between-sessions AI check-in tool) and SevenSharp. Full strategy, PRDs, and research live in `ascendvent-planning/` which has its own CLAUDE.md. Marketing site at ascendvent.life is in `ascendvent-home/`.

## SevenSharp
**Repo:** `SevenSharp/`
Voice-first communication training app. Seven seconds, one prompt — user vs. AI, scored in real time. Trains rapid synthesis under pressure, a learnable skill almost nobody practices deliberately. Stack: Vite + React + Supabase + Claude Sonnet + Netlify + Stripe. Data moat: every round generates a labeled behavioral data point (prompt → transcript → score → beat bot → level). Listed as an AOSI module.

## FounderOS
**Repo:** `founderos/`
Published MCP server for structured product discovery. 11-stage pipeline from problem validation through project scaffolding. Registered globally in Claude Code — active in all sessions. Use it inside `ascendvent-planning/` for product work. Not personal tooling — this is a product for others to use.

## From Pixels to Punk
**Repo:** `frompixelstopunk/`
Blog arguing that product management is a creative discipline, not a business function. Active publishing outlet. Drafts live in `context-store/writing/drafts/` in this repo; published archive in `context-store/writing/published/`.

## ShaleYeah
**Repo:** `ShaleYeah/`
AI-powered oil and gas investment analysis tool. Early stage.

## Portfolio
**Repo:** `portfolio/`
Personal portfolio site built with Astro. Static, no backend. Showcases PM work across AI, FinTech, HealthTech. Deploy target: Netlify.

## autoresearch
**Repo:** `autoresearch/`
Automation and research tooling. Early stage — purpose to be defined.

## Claude-Cowork
**Repo:** `Claude-Cowork/`
Claude-related project. Early stage — purpose to be defined.

## small-language-models-for-pms
**Repo:** `small-language-models-for-pms/`
Educational content for product managers on small language models. Apache 2.0 licensed.

## TechYeet Gaming
**Repo:** `techyeet-gaming/`
Static monthly newsletter site for the TechYeet Gaming community. Built with Vite, deployed on Netlify. Low-maintenance.
