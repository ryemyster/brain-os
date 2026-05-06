import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { CONTEXT_DIR } from "./config.js";

function slug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function timestamp(): string {
  return new Date().toISOString().split("T")[0];
}

// --- Companies ---

export function readCompanyContext(company: string): string {
  const path = join(CONTEXT_DIR, "companies", `${slug(company)}.md`);
  return existsSync(path) ? readFileSync(path, "utf-8") : "";
}

export function writeCompanyContext(company: string, section: string, content: string) {
  const dir = join(CONTEXT_DIR, "companies");
  ensureDir(dir);
  const path = join(dir, `${slug(company)}.md`);
  const existing = existsSync(path) ? readFileSync(path, "utf-8") : `# ${company}\n\n<!-- brain-os managed -->\n`;
  const header = `## ${section} — ${timestamp()}`;
  const block = `${header}\n\n${content}\n\n---\n`;
  // Replace existing section of same name or append
  const sectionRegex = new RegExp(`## ${section} — [\\d-]+\\n[\\s\\S]*?(?=\\n## |$)`);
  const updated = sectionRegex.test(existing)
    ? existing.replace(sectionRegex, block)
    : existing + block;
  writeFileSync(path, updated, "utf-8");
}

export function appendOutreachLog(company: string, contact: string, channel: string, summary: string) {
  const path = join(CONTEXT_DIR, "outreach-log.md");
  const entry = `\n## ${company}${contact ? ` — ${contact}` : ""} (${timestamp()})\n**Channel:** ${channel}\n${summary}\n\n---`;
  const existing = existsSync(path) ? readFileSync(path, "utf-8") : "# Outreach Log\n\n<!-- brain-os managed -->";
  writeFileSync(path, existing + entry, "utf-8");
  // Also write to company context
  writeCompanyContext(company, "Outreach", `**Contact:** ${contact || "unknown"}\n**Channel:** ${channel}\n${summary}`);
}

// --- Stories ---

export function readStory(theme: string): string {
  const path = join(CONTEXT_DIR, "stories", `${slug(theme)}.md`);
  return existsSync(path) ? readFileSync(path, "utf-8") : "";
}

export function writeStory(theme: string, content: string) {
  const dir = join(CONTEXT_DIR, "stories");
  ensureDir(dir);
  const path = join(dir, `${slug(theme)}.md`);
  writeFileSync(path, `# Story — ${theme}\n\n_Last updated: ${timestamp()}_\n\n${content}\n`, "utf-8");
}

export function listStories(): string[] {
  const dir = join(CONTEXT_DIR, "stories");
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith(".md") && f !== ".gitkeep").map((f) => f.replace(".md", ""));
}

// --- Sessions ---

export function writeSession(company: string, interviewType: string, summary: string) {
  const dir = join(CONTEXT_DIR, "sessions");
  ensureDir(dir);
  const filename = `${timestamp()}-${slug(company || "general")}-${slug(interviewType)}.md`;
  const content = `# Session — ${interviewType} @ ${company || "general"}\n_${timestamp()}_\n\n${summary}\n`;
  writeFileSync(join(dir, filename), content, "utf-8");
}

export function readRecentSessions(limit = 5): Array<{ filename: string; content: string }> {
  const dir = join(CONTEXT_DIR, "sessions");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f !== ".gitkeep")
    .sort()
    .reverse()
    .slice(0, limit)
    .map((f) => ({ filename: f, content: readFileSync(join(dir, f), "utf-8") }));
}

// --- Patterns ---

export function readPatterns(): string {
  const path = join(CONTEXT_DIR, "patterns.md");
  return existsSync(path) ? readFileSync(path, "utf-8") : "";
}

export function writePatterns(content: string) {
  const path = join(CONTEXT_DIR, "patterns.md");
  writeFileSync(path, `# Interview Patterns\n\n_Last updated: ${timestamp()}_\n\n${content}\n`, "utf-8");
}

// --- Generic remember ---

export type MemoryType = "company" | "story" | "insight" | "task" | "session";

export function remember(
  type: MemoryType,
  content: string,
  label: string,
  notionSync = false
): { saved_to: string; notion_sync_pending: boolean } {
  let savedTo = "";

  switch (type) {
    case "company":
      writeCompanyContext(label, "Notes", content);
      savedTo = `context/companies/${slug(label)}.md`;
      break;
    case "story":
      writeStory(label, content);
      savedTo = `context/stories/${slug(label)}.md`;
      break;
    case "insight":
    case "task": {
      const dir = join(CONTEXT_DIR);
      ensureDir(dir);
      const path = join(dir, "insights.md");
      const existing = existsSync(path) ? readFileSync(path, "utf-8") : "# Insights & Tasks\n\n<!-- brain-os managed -->\n";
      writeFileSync(path, existing + `\n## [${type.toUpperCase()}] ${label} — ${timestamp()}\n${content}\n\n---`, "utf-8");
      savedTo = "context/insights.md";
      break;
    }
    case "session":
      writeSession(label, "manual", content);
      savedTo = `context/sessions/${timestamp()}-${slug(label)}-manual.md`;
      break;
  }

  return { saved_to: savedTo, notion_sync_pending: notionSync };
}
