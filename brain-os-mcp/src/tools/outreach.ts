import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";
import { appendOutreachLog, readCompanyContext } from "../context.js";
import { NOTION_PAGES, NOTION_COLLECTIONS, buildNotionContext } from "../notion.js";

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

export function runOutreach(
  company: string,
  targetPerson?: string,
  role?: string
): object {
  const slug = company.toLowerCase().replace(/\s+/g, "-");

  appendOutreachLog(company, targetPerson ?? "", "drafting", `Outreach drafts generated${role ? ` for ${role}` : ""}.`);

  const voice = existsSync(join(CAREER_DIR, "voice-and-style.md"))
    ? readFileSync(join(CAREER_DIR, "voice-and-style.md"), "utf-8")
    : "(empty — add voice guide to career/voice-and-style.md)";
  const localResume = existsSync(join(CAREER_DIR, "resume.md"))
    ? readFileSync(join(CAREER_DIR, "resume.md"), "utf-8")
    : "(empty — use Notion Resume page as source of truth)";
  const pipelineContent = existsSync(join(CAREER_DIR, "pipeline", `${slug}.md`))
    ? readFileSync(join(CAREER_DIR, "pipeline", `${slug}.md`), "utf-8")
    : null;
  const storedContext = readCompanyContext(company);

  const localContext = [
    `## Voice Guide (local)\n${voice}`,
    `## Local Resume (fallback)\n${localResume}`,
    `## Company: ${company}`,
    targetPerson ? `## Target Person: ${targetPerson}` : "",
    role ? `## Target Role: ${role}` : "",
    pipelineContent ? `## Pipeline Notes\n${pipelineContent}` : "No pipeline notes — use Intel Tracker DB.",
    storedContext ? `## Accumulated Intel\n${storedContext}` : "",
  ].filter(Boolean).join("\n\n---\n\n");

  return {
    task: `Generate outreach strategy and message drafts for Ryan K. McDonald targeting ${company}${targetPerson ? ` — contact: ${targetPerson}` : ""}${role ? ` — role: ${role}` : ""}.`,
    system_prompt: SYSTEM,
    instructions: [
      "Fetch each item in notion_context using the Notion MCP fetch/query tools.",
      "Core Why tells you Ryan's narrative positioning — use it to find the sharpest outreach angle.",
      "Recruiter Vetting Checklist tells you what Ryan looks for in companies — use it to personalize the message.",
      "Resume gives specific proof points for the message.",
      "Voice Guide is in local_context — match tone and style when drafting messages.",
      "After fetching Notion data, generate the full outreach strategy per system_prompt.",
    ],
    notion_context: buildNotionContext([
      { label: "Core Why — positioning and narrative", id: NOTION_PAGES.core_why, type: "page" },
      { label: "Ryan's Resume", id: NOTION_PAGES.resume, type: "page" },
      { label: "Recruiter Vetting Checklist — what Ryan looks for", id: NOTION_PAGES.recruiter_vetting_checklist, type: "page" },
    ]),
    local_context: localContext,
  };
}
