# Repository Inventory

Complete map of all active repositories across both GitHub accounts (ryemyster and ascendvent). Use this to navigate between projects and understand what's active vs. archived.

---

## Quick Navigation

**12 active repositories** across two GitHub organizations:

### Ascendvent Org (4 repos)
- `ascendvent-planning/` — Strategy brain for Ascendvent
- `ascendvent-home/` — Marketing site (ascendvent.life)
- `SevenSharp/` — Voice-first communication training app
- `founderos/` — Published MCP server for product discovery

### RyEmyster Org (8 repos)
- `brain-os/` — This repo! Job hunt automation + personal tooling
- `frompixelstopunk/` — Blog on PM as creative discipline
- `portfolio/` — Personal portfolio site (Astro)
- `ShaleYeah/` — AI oil & gas investment analysis
- `techyeet-gaming/` — TechYeet Gaming newsletter (Vite)
- `vscode-themes-vibecoded/` — VS Code theme pack
- `small-language-models-for-pms/` — Educational content on SLMs
- `autoresearch/` — Automation/research tooling (early stage)

---

## Ascendvent Ecosystem

### ascendvent-planning (Strategy Brain)

**Org:** ascendvent | **Status:** Active | **Purpose:** Private strategy, PRDs, research for Ascendvent

**What it contains:**
- Ascendvent methodology docs (AOSI framework)
- Product requirements for Check-In and SevenSharp
- Market research, competitor analysis
- Roadmap and phase planning
- Team notes and decision logs

**GitHub account:** ascendvent (SSH: `git@github-ascendvent`)

**When to use it:** Anything Ascendvent strategy, product planning, or business decisions. Has its own `CLAUDE.md`.

**Key files:**
- `CLAUDE.md` — Strategy context and Ascendvent-specific instructions
- `projects/` — Product-specific subfolders
- `research/` — Market and competitive analysis
- `roadmap.md` — Phase planning

**FounderOS:** Registered MCP server for product discovery workflow. Active in this repo.

---

### ascendvent-home (Marketing Site)

**Org:** ascendvent | **Status:** Active | **Stack:** Static HTML/CSS | **Deploy:** Netlify

**What it contains:**
- Landing page for ascendvent.life
- Product descriptions
- Coaching philosophy overview
- Contact and CTA

**GitHub account:** ascendvent (SSH: `git@github-ascendvent`)

**When to use it:** Marketing copy updates, brand refresh, landing page improvements

**Last update:** 2026-05-05

---

### SevenSharp (Communication Training App)

**Org:** ascendvent | **Status:** Active | **Stack:** Vite + React + Supabase + Claude Sonnet + Stripe

**What it contains:**
- Voice-first communication training (7-second rounds)
- User authentication and profile management
- Scoring engine vs. AI opponent
- Payment processing (Stripe)
- Database layer (Supabase)

**GitHub account:** ascendvent (SSH: `git@github-ascendvent`)

**When to use it:** Feature development, bug fixes, infrastructure scaling

**Open issues:**
- #54: External services setup blocks everything (blocker)

**Last update:** 2026-04-28

**Architecture notes:**
- Each round generates labeled training data
- Behavioral scoring based on Claude analysis
- Deployment: Netlify

---

### founderos (MCP Server — Published Product)

**Org:** ascendvent | **Status:** Active | **Stack:** TypeScript + Node | **Distribution:** npm/registries

**What it contains:**
- 11-stage product discovery pipeline
- Problem validation through project scaffolding
- Tools for structured product thinking
- Documentation and examples

**GitHub account:** ascendvent (SSH: `git@github-ascendvent`)

**When to use it:** Product discovery tool enhancements, new stages/tools, documentation

**This is not personal tooling** — FounderOS is a published product others use. Quality and stability matter.

**Open issues:**
- #12: Semantic search (P0)
- #9: synthesize_thesis tool (P0)

**Last update:** 2026-04-27

**Usage:** Active in `ascendvent-planning/` and potentially other product work. Registered globally in Claude Code.

---

## RyEmyster Ecosystem

### brain-os (This Repo — Claude Code Orchestration Workspace)

**Org:** ryemyster | **Status:** Active | **Stack:** Markdown context + Claude Code workflow configuration + MCP integrations

**What it contains:**
- Claude Code orchestration for job search, writing, project context, and durable personal memory
- Career knowledge base (resume, achievements, voice guide, job criteria)
- Interview notes and human-readable context store
- Skill definitions (job-search, prep-loop, sync-context, doc-coauthoring)
- Rules, hooks, and agent definitions for Claude Code behavior
- This documentation

**Related repo:** `brain-os-mcp` now lives separately at `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp` and contains the TypeScript MCP server.

**GitHub account:** ryemyster (default)

**When to use it:** Job search work, interview prep, writing updates, context updates, orchestration docs, Claude Code workflow behavior

**Open issues/needs:**
- Comprehensive docs (in progress — this audit)
- Repo inventory (Task 6 — being created now)
- Keep MCP server references pointed at sibling repo

**Key files:**
- `CLAUDE.md` — Job hunt context and system overview
- `context-store/career/` — Resume, achievements, voice guide, pipeline
- `context-store/context/` — Human-readable context and session notes
- `.claude/` — Skills, rules, configuration
- `context-store/projects/index.md` — Active project tracker

---

### frompixelstopunk (Blog)

**Org:** ryemyster | **Status:** Active | **Stack:** Markdown + Git + Netlify

**What it contains:**
- Blog posts arguing PM is a creative discipline
- Drafts in `context-store/writing/drafts/`
- Published archive in `context-store/writing/published/`
- Site theme and styling

**GitHub account:** ryemyster (default)

**When to use it:** Publishing blog posts, updating drafts, styling/navigation improvements

**Open issues:**
- #85: Archive search/filter (UX)

**Last update:** 2026-05-04

**Deploy:** Netlify (automatic on push to main)

---

### portfolio (Personal Portfolio)

**Org:** ryemyster | **Status:** Active | **Stack:** Astro (static site generator)

**What it contains:**
- Portfolio of PM work (AI, FinTech, HealthTech projects)
- Resume and credentials
- Case studies
- Contact information

**GitHub account:** ryemyster (default)

**When to use it:** Portfolio updates, new case study additions, resume syncs

**Open issues:**
- #19: Surface Ascendvent pivot as headline (important for branding)

**Last update:** 2026-05-06

**Deploy:** Netlify (automatic on push to main)

---

### ShaleYeah (Oil & Gas Investment Analysis)

**Org:** ryemyster | **Status:** Active (early stage) | **Stack:** TBD | **Purpose:** AI-powered analysis tool

**What it contains:**
- Core analysis engine
- Data pipeline and modeling
- Research and reference materials

**GitHub account:** ryemyster (default)

**When to use it:** Investment analysis improvements, data pipeline work, research compilation

**Open issues:**
- #315: Split index.ts god class (refactoring)

**Last update:** 2026-04-18

**Status:** Early stage — architecture solidifying

---

### techyeet-gaming (Community Newsletter)

**Org:** ryemyster | **Status:** Active | **Stack:** Vite + Netlify

**What it contains:**
- Monthly newsletter site for TechYeet Gaming community
- Low-maintenance static site
- Content and archives

**GitHub account:** ryemyster (default)

**When to use it:** Monthly content publication, styling/layout updates

**Open issues:**
- #2: Mobile responsive audit (UX)

**Last update:** 2026-05-04

**Deploy:** Netlify (automatic on push)

---

### vscode-themes-vibecoded (VS Code Theme Pack)

**Org:** ryemyster | **Status:** Active | **Distribution:** Visual Studio Code Marketplace

**What it contains:**
- Custom VS Code color themes
- Theme documentation and previews
- Installation and usage guides

**GitHub account:** ryemyster (default)

**When to use it:** Theme color tweaks, new theme variants, documentation updates

**Open issues:**
- #10: Theme preview gallery (feature request)

**Last update:** 2026-05-05

**Distribution:** Published to VS Code Marketplace

---

### small-language-models-for-pms (Educational Content)

**Org:** ryemyster | **Status:** Active | **License:** Apache 2.0 | **Purpose:** PM education

**What it contains:**
- Educational material on small language models for product managers
- Guides, tutorials, case studies
- Code examples

**GitHub account:** ryemyster (default)

**When to use it:** Content updates, new SLM frameworks, PM audience education

**Open issues:**
- #7: Repo hygiene (documentation and structure)

**Last update:** 2026-04-06

---

### autoresearch (Automation & Research Tooling)

**Org:** ryemyster | **Status:** Early stage | **Purpose:** TBD

**What it contains:**
- Early-stage automation and research tools
- Purpose and scope not yet defined

**GitHub account:** ryemyster (default)

**When to use it:** Experimental work, automation POCs, research tooling prototypes

**Status:** Not yet a git repo (local-only)

**Next:** Clarify purpose, establish core files, push to GitHub

---

## Organizational Patterns

### GitHub Account Routing

Two SSH keys configured in `~/.ssh/config`:

- **ryemyster account** (default): `git@github-ryemyster` — personal projects, career
- **ascendvent account**: `git@github-ascendvent` — Ascendvent brand, products

**Automatic routing:** Use `.claude/scripts/gh-brain-os.sh` instead of `gh` directly. The script auto-detects the org and switches accounts as needed.

**Manual routing:** For git operations, remotes use account aliases:
- `git@github-ryemyster:ryemyster/portfolio.git`
- `git@github-ascendvent:ascendvent/SevenSharp.git`

### Repo Health

| Repo | Last commit | Status | Blocker |
|------|-------------|--------|---------|
| brain-os | 2026-05-07 | Active | None |
| ascendvent-planning | 2026-04-19 | Active (strategy) | None |
| frompixelstopunk | 2026-05-04 | Active | None |
| portfolio | 2026-05-06 | Active | #19: headline update |
| founderos | 2026-04-27 | Active | #12: semantic search (P0) |
| SevenSharp | 2026-04-28 | Active | #54: external services setup |
| ascendvent-home | 2026-05-05 | Active | None |
| techyeet-gaming | 2026-05-04 | Active | #2: mobile responsive |
| vscode-themes-vibecoded | 2026-05-05 | Active | None |
| ShaleYeah | 2026-04-18 | Active | #315: refactoring |
| small-language-models-for-pms | 2026-04-06 | Active | #7: repo hygiene |
| autoresearch | — | Early | No git repo |

---

## Inter-Repo Dependencies

```
brain-os (job hunt)
  ├─→ ascendvent-planning (strategy reference)
  └─→ portfolio (project showcase)

ascendvent-home
  └─→ ascendvent-planning (content source)

SevenSharp (product)
  └─→ ascendvent-planning (PRD, roadmap, research)

founderos (product)
  ├─→ ascendvent-planning (used in product discovery)
  └─→ brain-os (registered globally, can be used here)

frompixelstopunk (blog)
  └─→ portfolio (can link articles)

ShaleYeah
  └─→ ascendvent-planning (research reference)
```

---

## Repo Setup Checklist

### New machine setup

```bash
# Clone all repos
for repo in brain-os frompixelstopunk portfolio ShaleYeah \
            autoresearch small-language-models-for-pms \
            vscode-themes-vibecoded techyeet-gaming; do
  git clone git@github-ryemyster:ryemyster/$repo.git
done

for repo in ascendvent-planning ascendvent-home SevenSharp founderos; do
  git clone git@github-ascendvent:ascendvent/$repo.git
done

# Configure gh CLI account routing
# (already done in ~/.ssh/config)

# Set up brain-os MCP server
cd brain-os/brain-os-mcp
npm install
npm run build
```

### Adding a new repo

1. Create on GitHub under appropriate org (ryemyster or ascendvent)
2. Clone locally: `git clone git@github-{account}:{org}/{repo}.git`
3. Add to this list (`REPOS.md`)
4. Update `context-store/projects/index.md` with status and key open issues
5. Create CLAUDE.md in repo if it has special instructions
6. If it's an MCP server, register in `~/.claude/settings.json`

---

## File Organization Conventions

| Location | Contents | Ownership |
|----------|----------|-----------|
| `context-store/career/` | Resume, achievements, voice, pipeline | brain-os (this repo) |
| `context-store/context/` | Persistent memory, company research, stories | brain-os (this repo) |
| `context-store/writing/` | Blog drafts and published posts | frompixelstopunk + brain-os |
| `context-store/projects/` | Active project tracker | brain-os (this repo) |
| `ascendvent-planning/` | Product strategy and research | ascendvent org |
| `.claude/` | Skills, rules, config, hooks | brain-os (this repo) |

---

## Quick Links

| Repo | URL | Purpose |
|------|-----|---------|
| brain-os | /Users/rmcdonald/Repos/ryemyster/brain-os | This repo — job automation |
| ascendvent-planning | /Users/rmcdonald/Repos/ascendvent/ascendvent-planning | Strategy brain |
| SevenSharp | /Users/rmcdonald/Repos/ascendvent/SevenSharp | Communication app |
| portfolio | /Users/rmcdonald/Repos/ryemyster/portfolio | Portfolio site |
| frompixelstopunk | /Users/rmcdonald/Repos/ryemyster/frompixelstopunk | Blog |
| founderos | /Users/rmcdonald/Repos/ascendvent/founderos | MCP server (published) |
