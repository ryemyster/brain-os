import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR, slugify } from "../config.js";
import { appendOutreachLog, readCompanyContext } from "../context.js";
import { callModel } from "../llm.js";
import { notion, NOTION_PAGES } from "../notion-client.js";

const SYSTEM = `You are an outreach strategist for Ryan K. McDonald — Senior PM (AI/FinTech/HealthTech), founder of Ascendvent/AOSI, based in NYC, actively targeting Senior PM and Head of Product roles.

Generate outreach strategy and message drafts. Rules:
- Never open with "I hope this message finds you well" or "I am very interested in opportunities at..."
- Never list credentials — show relevance through specificity
- Never ask for a job in the first message — ask for a 20-minute conversation
- Every message needs one company-specific or person-specific hook
- Match Ryan's voice: direct, confident, shows he's done his homework

Deliver:
1. Best contact to reach (if not specified) — name the type of person and why
2. Strongest outreach angle for this company and person
3. LinkedIn DM — 3–4 sentences max. Hook in sentence one.
4. Email alternative — subject line + 4–5 sentences
5. 2–3 warm intro paths — type of person to find in common, community overlap, event angle
6. One specific piece of recent company news or product detail to reference for timeliness

Use Notion Resume, Core Why, and Recruiter Vetting Checklist as primary sources.`;

export async function runOutreach(
  company: string,
  targetPerson?: string,
  role?: string
): Promise<string> {
  const slug = slugify(company);

  const [coreWhy, resume, recruiterVetting] = await Promise.all([
    notion.fetchPage(NOTION_PAGES.core_why),
    notion.fetchPage(NOTION_PAGES.resume),
    notion.fetchPage(NOTION_PAGES.recruiter_vetting_checklist),
  ]);

  const voice = existsSync(join(CAREER_DIR, "voice-and-style.md"))
    ? readFileSync(join(CAREER_DIR, "voice-and-style.md"), "utf-8")
    : "(empty — add voice guide to career/voice-and-style.md)";
  const pipelineContent = existsSync(join(CAREER_DIR, "pipeline", `${slug}.md`))
    ? readFileSync(join(CAREER_DIR, "pipeline", `${slug}.md`), "utf-8")
    : null;
  const [storedContext] = await Promise.all([
    readCompanyContext(company),
    appendOutreachLog(company, targetPerson ?? "", "drafting", `Outreach drafts generated${role ? ` for ${role}` : ""}.`),
  ]);

  const staticContext = [
    `## Core Why — Positioning & Narrative (Notion)\n${coreWhy}`,
    `## Ryan's Resume (Notion)\n${resume}`,
    `## Recruiter Vetting Checklist — What Ryan Looks For (Notion)\n${recruiterVetting}`,
    `## Voice Guide (local)\n${voice}`,
  ].join("\n\n---\n\n");

  const user = [
    `## Company: ${company}`,
    targetPerson ? `## Target Person: ${targetPerson}` : "",
    role ? `## Target Role: ${role}` : "",
    pipelineContent ? `## Pipeline Notes\n${pipelineContent}` : "No pipeline notes — use Intel Tracker DB.",
    storedContext ? `## Accumulated Intel\n${storedContext}` : "",
  ].filter(Boolean).join("\n\n---\n\n");

  return callModel("balanced", SYSTEM, user, staticContext);
}
