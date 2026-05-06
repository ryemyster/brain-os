import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR, slugify } from "../config.js";
import { callModel } from "../llm.js";
import { notion, NOTION_PAGES, NOTION_COLLECTIONS } from "../notion-client.js";

const SYSTEM = `You are a talent and company-fit analyst evaluating Ryan K. McDonald as a PM candidate.

Ryan's background: Senior PM, AI/FinTech/HealthTech, founder of Ascendvent/AOSI (Agent-Orchestrated Self-Improvement), built and published FounderOS MCP server, strong LLM product and agent orchestration experience, based in NYC.

Score fit across 5 dimensions (1–5 each):
1. Domain Expertise — does Ryan's domain experience match the company's core product?
2. Industry Match — AI, FinTech, HealthTech overlap?
3. Technical Depth — does the role require technical PM depth Ryan has?
4. Company Stage Fit — seed/Series A/B/C/public — where has Ryan thrived?
5. Leadership Level Match — IC PM, lead PM, Head of Product, or above?

For each: score (1–5), Strong/Partial/Gap label, one-sentence rationale.
Then: overall fit score /10, 2–3 specific angles where Ryan's background is uniquely relevant, 1–2 most likely hiring manager objections and how to preempt them.
Verdict: Prioritize / Worth Pursuing / Pass — one sentence.

Be specific to this company. Use Ryan's actual experience, not generic PM attributes.
Use Notion Resume, Core Why, and Rates Discovery as primary sources over local files.`;

export async function runFit(company: string): Promise<string> {
  const slug = slugify(company);

  const [resume, coreWhy, rates, trackerEntry] = await Promise.all([
    notion.fetchPage(NOTION_PAGES.resume),
    notion.fetchPage(NOTION_PAGES.core_why),
    notion.fetchPage(NOTION_PAGES.rates_discovery),
    notion.queryDatabase(NOTION_COLLECTIONS.interview_tracker, {
      property: "Company",
      rich_text: { contains: company },
    }),
  ]);

  const localResume = existsSync(join(CAREER_DIR, "resume.md"))
    ? readFileSync(join(CAREER_DIR, "resume.md"), "utf-8")
    : "(empty — use Notion Resume page as source of truth)";
  const localAchievements = existsSync(join(CAREER_DIR, "achievements.md"))
    ? readFileSync(join(CAREER_DIR, "achievements.md"), "utf-8")
    : "(empty)";
  const criteria = existsSync(join(CAREER_DIR, "job-criteria.md"))
    ? readFileSync(join(CAREER_DIR, "job-criteria.md"), "utf-8")
    : "(empty)";
  const pipelineContent = existsSync(join(CAREER_DIR, "pipeline", `${slug}.md`))
    ? readFileSync(join(CAREER_DIR, "pipeline", `${slug}.md`), "utf-8")
    : `No pipeline file yet for ${company} — use Interview Tracker DB.`;

  const staticContext = [
    `## Ryan's Resume (Notion)\n${resume}`,
    `## Core Why — Positioning & Narrative (Notion)\n${coreWhy}`,
    `## Rates Discovery — Compensation Anchors (Notion)\n${rates}`,
  ].join("\n\n---\n\n");

  const user = [
    `## Company: ${company}`,
    `## Interview Tracker Entry (Notion)\n${trackerEntry}`,
    `## Local Resume (fallback)\n${localResume}`,
    `## Local Achievements (fallback)\n${localAchievements}`,
    `## Job Criteria (what Ryan is looking for)\n${criteria}`,
    `## Local Pipeline Notes (fallback)\n${pipelineContent}`,
  ].join("\n\n---\n\n");

  return callModel("balanced", SYSTEM, user, staticContext);
}
