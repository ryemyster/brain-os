import {
  upsertMemory,
  insertMemory,
  getMemoriesByTypeAndLabel,
  getMemory,
  getRecentMemories,
} from "./memory.js";
import { slugify } from "./config.js";

function timestamp(): string {
  return new Date().toISOString().split("T")[0];
}

// --- Companies ---

export async function readCompanyContext(company: string): Promise<string> {
  const memories = await getMemoriesByTypeAndLabel("company", slugify(company));
  if (!memories.length) return "";
  return memories
    .map((m) => `## ${m.section || "Notes"} — ${m.updated_at.split("T")[0]}\n\n${m.content}`)
    .join("\n\n---\n\n");
}

export async function writeCompanyContext(
  company: string,
  section: string,
  content: string
): Promise<void> {
  await upsertMemory("company", slugify(company), content, section);
}

export async function appendOutreachLog(
  company: string,
  contact: string,
  channel: string,
  summary: string
): Promise<void> {
  const content = `**Contact:** ${contact || "unknown"}\n**Channel:** ${channel}\n${summary}`;
  await upsertMemory("company", slugify(company), content, "Outreach");
}

// --- Stories ---

export async function readStory(theme: string): Promise<string> {
  const memory = await getMemory("story", slugify(theme));
  return memory?.content ?? "";
}

export async function writeStory(theme: string, content: string): Promise<void> {
  await upsertMemory("story", slugify(theme), content);
}

export async function listStories(): Promise<string[]> {
  const memories = await getRecentMemories("story", 50);
  return [...new Set(memories.map((m) => m.label))];
}

// --- Sessions ---

export async function writeSession(
  company: string,
  interviewType: string,
  summary: string
): Promise<void> {
  const label = `${timestamp()}-${slugify(company || "general")}-${slugify(interviewType)}`;
  await insertMemory("session", label, summary, "", { company, interviewType });
}

export async function readRecentSessions(
  limit = 5
): Promise<Array<{ filename: string; content: string }>> {
  const memories = await getRecentMemories("session", limit);
  return memories.map((m) => ({
    filename: `${m.label}.md`,
    content: m.content,
  }));
}

// --- Patterns ---

export async function readPatterns(): Promise<string> {
  const memory = await getMemory("insight", "patterns");
  return memory?.content ?? "";
}

export async function writePatterns(content: string): Promise<void> {
  await upsertMemory("insight", "patterns", content);
}

// --- Generic remember ---

export type MemoryType = "company" | "story" | "insight" | "task" | "session";

export async function remember(
  type: MemoryType,
  content: string,
  label: string,
  notionSync = false
): Promise<{ saved_to: string; notion_sync_pending: boolean }> {
  let savedTo = "";

  switch (type) {
    case "company":
      await writeCompanyContext(label, "Notes", content);
      savedTo = `supabase:company/${slugify(label)}`;
      break;
    case "story":
      await writeStory(label, content);
      savedTo = `supabase:story/${slugify(label)}`;
      break;
    case "insight":
    case "task":
      await upsertMemory(type, slugify(label), content);
      savedTo = `supabase:${type}/${slugify(label)}`;
      break;
    case "session":
      await writeSession(label, "manual", content);
      savedTo = `supabase:session/${timestamp()}-${slugify(label)}-manual`;
      break;
  }

  return { saved_to: savedTo, notion_sync_pending: notionSync };
}
