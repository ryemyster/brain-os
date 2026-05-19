# BrainOS Documentation Audit Archive

This is a historical placeholder for the May 2026 documentation audit.

Do not use this file as current operating guidance.

## Current References

| Need | Current Source |
|------|----------------|
| Session startup and routing | `CLAUDE.md` |
| Local context layout | `.claude/project-map.md` |
| Context ownership contract | `.claude/brainos-context-contract.md` |
| MCP server registration | `.claude/MCP-SERVERS.md` |
| Skills | `.claude/skills/README.md` |
| Agents | `.claude/agents/README.md` |
| Rules and hooks | `.claude/rules/README.md` |
| Human-readable context store | `context-store/context/README.md` |

## Current Architecture

- This repo is the BrainOS Claude Code orchestration workspace.
- Local durable context lives under `context-store/`.
- The standalone BrainOS MCP server lives at `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp`.
- The orchestration layer reads and summarizes local context before calling MCP tools.
- The MCP server should receive explicit context and should not depend on this repo's filesystem layout.

## Archive Note

The original audit content was intentionally removed because it referenced pre-split paths and obsolete MCP/package assumptions.
