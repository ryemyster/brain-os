import { remember, MemoryType } from "../context.js";

export function runRemember(
  type: MemoryType,
  label: string,
  content: string,
  notionSync = false
): object {
  const result = remember(type, content, label, notionSync);
  return {
    saved: true,
    type,
    label,
    saved_to: result.saved_to,
    notion_sync_pending: result.notion_sync_pending,
    message: `Saved ${type} entry "${label}" to ${result.saved_to}.${notionSync ? " Notion sync pending (Phase 4)." : ""}`,
  };
}
