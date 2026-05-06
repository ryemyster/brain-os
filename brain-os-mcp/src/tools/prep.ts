import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR, slugify } from "../config.js";
import { readCompanyContext } from "../context.js";
import { callModel } from "../llm.js";
import { notion, NOTION_PAGES, NOTION_COLLECTIONS } from "../notion-client.js";

const SYSTEM = `You are the interview prep coach for Ryan K. McDonald — Senior PM (AI/FinTech/HealthTech), actively interviewing for Senior PM and Head of Product roles in NYC.

Generate a focused interview prep briefing. Include:
1. Company snapshot — what they build, their stage, PM org signals, and what they care about in candidates
2. 6–8 likely interview questions for Ryan's target role (behavioral, product sense, metrics, strategy — calibrated to what this company actually asks)
3. For each question, the strongest achievement or story from Ryan's background to draw on
4. 4–5 sharp questions Ryan should ask the interviewer — about team, product velocity, and decision-making
5. 2–3 gaps to research if the pipeline file is thin

Lead with what matters most. Be specific to this company — no generic PM prep advice.
Notion data is the source of truth — use it over local fallback files when available.`;

export async function runPrep(company: string): Promise<string> {
  const slug = slugify(company);

  // Notion: live pipeline entry + rich career context
  const [trackerEntry, resume, stories, coreWhy, maangRubric] = await Promise.all([
    notion.queryDatabase(NOTION_COLLECTIONS.interview_tracker, {
      property: "Company",
      rich_text: { contains: company },
    }),
    notion.fetchPage(NOTION_PAGES.resume),
    notion.fetchPage(NOTION_PAGES.stories_star),
    notion.fetchPage(NOTION_PAGES.core_why),
    notion.fetchPage(NOTION_PAGES.maang_behavioral_map),
  ]);

  // Background-only: stale company prep pages (may be outdated)
  const companyPage = notion.getCompanyPageId(company);
  const narrativePage = notion.getNarrativePageId(company);
  const [companyPrepContext, narrativeContext] = await Promise.all([
    companyPage ? notion.fetchPageSafe(companyPage.id) : Promise.resolve(""),
    narrativePage ? notion.fetchPageSafe(narrativePage) : Promise.resolve(""),
  ]);

  // Local fallbacks
  const pipelinePath = join(CAREER_DIR, "pipeline", `${slug}.md`);
  const localPipeline = existsSync(pipelinePath)
    ? readFileSync(pipelinePath, "utf-8")
    : "(no local pipeline file)";
  const storedContext = readCompanyContext(company);

  const staticContext = [
    `## Ryan's Resume (Notion)\n${resume}`,
    `## Ryan's Stories — STAR Achievement Bank (Notion)\n${stories}`,
    `## Core Why — Positioning & Narrative (Notion)\n${coreWhy}`,
    `## MAANG Behavioral Rubric & Gap Scores (Notion)\n${maangRubric}`,
    companyPrepContext ? `## ${company} Prep Page (background — may be outdated)\n${companyPrepContext}` : "",
    narrativeContext ? `## ${company} Narrative (background — may be outdated)\n${narrativeContext}` : "",
  ].filter(Boolean).join("\n\n---\n\n");

  const user = [
    `## Company: ${company}`,
    `## Interview Tracker Entry (Notion — source of truth)\n${trackerEntry}`,
    `## Local Pipeline Notes (fallback)\n${localPipeline}`,
    storedContext ? `## Accumulated Intel (context store)\n${storedContext}` : "",
  ].filter(Boolean).join("\n\n---\n\n");

  return callModel("balanced", SYSTEM, user, staticContext);
}
