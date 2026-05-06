import { join } from "path";

export const BRAIN_ROOT = process.env.BRAIN_ROOT ?? process.cwd();
export const CAREER_DIR = join(BRAIN_ROOT, "career");
export const WRITING_DIR = join(BRAIN_ROOT, "writing");
export const PROJECTS_DIR = join(BRAIN_ROOT, "projects");
export const CONTEXT_DIR = join(BRAIN_ROOT, "context");
