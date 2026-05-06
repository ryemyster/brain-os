import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";
import { NOTION_PAGES, NOTION_COLLECTIONS, buildNotionContext } from "../notion.js";

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

export function runFit(company: string): object {
  const slug = company.toLowerCase().replace(/\s+/g, "-");

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

  const localContext = [
    `## Local Resume (fallback)\n${localResume}`,
    `## Local Achievements (fallback)\n${localAchievements}`,
    `## Job Criteria (what Ryan is looking for)\n${criteria}`,
    `## Local Pipeline Notes (fallback)\n${pipelineContent}`,
  ].join("\n\n---\n\n");

  return {
    task: `Score Ryan K. McDonald's fit for ${company} across 5 dimensions and return a verdict.`,
    system_prompt: SYSTEM,
    instructions: [
      "Fetch each item in notion_context using the Notion MCP fetch/query tools.",
      `For the Interview Tracker, look for an entry matching company: "${company}" to get real pipeline status.`,
      "Use Notion Resume as primary source for Ryan's background.",
      "Use Rates Discovery to contextualize comp expectations vs. company stage.",
      "Use Core Why to understand Ryan's positioning — helps frame the 'uniquely relevant angles' section.",
      "After fetching, generate the full fit analysis per system_prompt.",
    ],
    notion_context: buildNotionContext([
      { label: "Ryan's Resume", id: NOTION_PAGES.resume, type: "page" },
      { label: "Core Why — positioning and narrative", id: NOTION_PAGES.core_why, type: "page" },
      { label: "Rates Discovery — compensation anchors", id: NOTION_PAGES.rates_discovery, type: "page" },
      {
        label: "Interview Tracker — check for existing pipeline entry",
        id: NOTION_COLLECTIONS.interview_tracker,
        type: "collection",
        note: `Filter by company: "${company}" if an entry exists.`,
      },
    ]),
    local_context: localContext,
  };
}
