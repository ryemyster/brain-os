# Skills

Skills are slash commands that Claude Code exposes as reusable, composable workflows. They live here as `.md` files and are invoked with `/skill-name` in any Claude Code session.

## What a skill is

A skill is a markdown file that contains a prompt template Claude follows when invoked. It can reference files, run tools, call MCP servers, and produce structured output. Think of it as a macro for a workflow you run repeatedly.

## What's missing

No skills are defined yet. Below are examples relevant to this project:

### Writing & content
- `/draft-article` — given a topic or idea from `writing/ideas.md`, produce a full draft in Ryan's voice matching `career/voice-and-style.md`
- `/polish-post` — take a rough draft and tighten it: sharper lede, stronger close, cut filler
- `/linkedin-post` — convert a longer piece or insight into a LinkedIn-optimized post (hook + 3 beats + CTA)
- `/substack-intro` — write the opening section of a Substack essay from a bullet outline

### Job hunt
- `/cover-letter` — alias for `apply` MCP tool but with more interactive back-and-forth
- `/prep-loop` — run `intel` then `fit` then `prep` for a company in sequence
- `/cold-dm` — draft a cold LinkedIn DM using `outreach` tool + voice guide

### Dev
- `/build-brainos` — run `npm run build` inside `brain-os/` and report errors
- `/sync-context` — summarize the current session and call `remember` to persist it

## How to add a skill

Create a `.md` file in this directory. The filename becomes the slash command name (e.g., `draft-article.md` → `/draft-article`). The file content is the prompt Claude follows.
