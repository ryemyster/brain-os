import { join } from "path";

export const BRAIN_ROOT = process.env.BRAIN_ROOT ?? process.cwd();
export const CAREER_DIR = join(BRAIN_ROOT, "career");
export const WRITING_DIR = join(BRAIN_ROOT, "writing");
export const PROJECTS_DIR = join(BRAIN_ROOT, "projects");
export const CONTEXT_DIR = join(BRAIN_ROOT, "context");
export const NOTION_TOKEN = process.env.NOTION_TOKEN ?? "";

// External URLs fetched at tool call time — update here, propagates everywhere
export const EXTERNAL_URLS = {
  portfolio: "https://ryankmcdonald.netlify.app/",
} as const;

// Shared slug normalization — used by tools and notion-client for company lookups
export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
