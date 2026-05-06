import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";
import { NOTION_PAGES, buildNotionContext } from "../notion.js";

const SYSTEM = `You are a senior PM career strategist working with Ryan K. McDonald to produce application materials that could actually get him hired.

Ryan is a Senior PM (AI/FinTech/HealthTech) with founder experience (Ascendvent/AOSI), published MCP tooling (FounderOS), and deep LLM product and agent orchestration background. He is targeting Senior PM and Head of Product roles in NYC AI-native companies.

Your job:
1. Gap analysis — extract the top 10 required/preferred qualifications from the JD. For each: Strong Match, Partial Match, or Gap. Be honest about gaps — Ryan needs to know what to address, not what sounds good.
2. Resume bullets — identify 3–5 existing resume bullets to highlight or rewrite for this specific role. Show the before/after.
3. Cover letter — 3 tight paragraphs. No generic opener ("I am excited to apply..."). Open with the most compelling specific reason Ryan is right for this role. Second paragraph: the most relevant proof point from his career. Third paragraph: why this company specifically — not flattery, a real reason. Must be in Ryan's voice (see voice guide).
4. Top 2 gaps to address — either acknowledge in the letter or prepare to answer in screening.

The hiring manager reading this has seen 200 cover letters this month. Write something that makes them stop scrolling.

Notion data is the source of truth — use the fetched Resume, Stories, Core Why, and Rates pages over local fallback files.`;

export function runApply(jd: string): object {
  const voice = existsSync(join(CAREER_DIR, "voice-and-style.md"))
    ? readFileSync(join(CAREER_DIR, "voice-and-style.md"), "utf-8")
    : "(voice guide is empty — add writing samples to career/voice-and-style.md)";

  const localResume = existsSync(join(CAREER_DIR, "resume.md"))
    ? readFileSync(join(CAREER_DIR, "resume.md"), "utf-8")
    : "(empty — use Notion Resume page as source of truth)";

  const localAchievements = existsSync(join(CAREER_DIR, "achievements.md"))
    ? readFileSync(join(CAREER_DIR, "achievements.md"), "utf-8")
    : "(empty — use Notion Stories (STAR) page as fallback)";

  const localContext = [
    `## Voice Guide (local)\n${voice}`,
    `## Local Resume (fallback)\n${localResume}`,
    `## Local Achievements (fallback)\n${localAchievements}`,
    `## Job Description\n${jd}`,
  ].join("\n\n---\n\n");

  return {
    task: "Generate a gap analysis and cover letter for Ryan K. McDonald based on the job description.",
    system_prompt: SYSTEM,
    instructions: [
      "Fetch each item in notion_context using the Notion MCP fetch/query tools.",
      "Use Notion Resume as the primary resume source — it is more current than the local file.",
      "Use Stories (STAR) for achievement material and Core Why for positioning narrative.",
      "Use Rates Discovery to anchor compensation expectations if the JD mentions comp.",
      "Voice Guide is in local_context — match Ryan's tone when drafting the cover letter.",
      "After fetching Notion data, generate the gap analysis and cover letter per system_prompt.",
      "Model tier: use Claude claude-opus-4-7 (powerful) for this task — it is a high-stakes output.",
    ],
    notion_context: buildNotionContext([
      { label: "Ryan's Resume", id: NOTION_PAGES.resume, type: "page" },
      { label: "Stories (STAR) — achievement bank", id: NOTION_PAGES.stories_star, type: "page" },
      { label: "Core Why — positioning and narrative", id: NOTION_PAGES.core_why, type: "page" },
      { label: "Rates Discovery — compensation anchors", id: NOTION_PAGES.rates_discovery, type: "page" },
    ]),
    local_context: localContext,
  };
}
