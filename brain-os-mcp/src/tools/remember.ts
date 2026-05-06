import { remember, MemoryType } from "../context.js";

export function runRemember(
  type: MemoryType,
  label: string,
  content: string,
  notionSync = false
): string {
  const result = remember(type, content, label, notionSync);
  return `Saved ${type} "${label}" to ${result.saved_to}.${notionSync ? " Notion sync pending (Phase 4)." : ""}`;
}
