import { remember, MemoryType } from "../context.js";

export async function runRemember(
  type: MemoryType,
  label: string,
  content: string,
  notionSync = false
): Promise<string> {
  const result = await remember(type, content, label, notionSync);
  return `Saved ${type} "${label}" to ${result.saved_to}.${notionSync ? " Notion sync pending (Phase 4)." : ""}`;
}
