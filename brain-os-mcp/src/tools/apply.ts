import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";
import { callModel } from "../llm.js";
import { notion, NOTION_PAGES } from "../notion-client.js";

const SYSTEM = `You are a senior PM career strategist working with Ryan K. McDonald to produce application materials that could actually get him hired.

Ryan is a Senior PM (AI/FinTech/HealthTech) with founder experience (Ascendvent/AOSI), published MCP tooling (FounderOS), and deep LLM product and agent orchestration background. He is targeting Senior PM and Head of Product roles in NYC AI-native companies.

Your job:
1. Gap analysis — extract the top 10 required/preferred qualifications from the JD. For each: Strong Match, Partial Match, or Gap. Be honest about gaps — Ryan needs to know what to address, not what sounds good.
2. Resume bullets — identify 3–5 existing resume bullets to highlight or rewrite for this specific role. Show the before/after.
3. Cover letter — 3 tight paragraphs. No generic opener ("I am excited to apply..."). Open with the most compelling specific reason Ryan is right for this role. Second paragraph: the most relevant proof point from his career. Third paragraph: why this company specifically — not flattery, a real reason. Must be in Ryan's voice (see voice guide).
4. Top 2 gaps to address — either acknowledge in the letter or prepare to answer in screening.

The hiring manager reading this has seen 200 cover letters this month. Write something that makes them stop scrolling.`;

export async function runApply(jd: string): Promise<string> {
  // Notion: primary source for resume, stories, positioning, comp anchors
  const [resume, stories, coreWhy, rates] = await Promise.all([
    notion.fetchPage(NOTION_PAGES.resume),
    notion.fetchPage(NOTION_PAGES.stories_star),
    notion.fetchPage(NOTION_PAGES.core_why),
    notion.fetchPage(NOTION_PAGES.rates_discovery),
  ]);

  // Local: voice guide (no Notion equivalent)
  const voice = existsSync(join(CAREER_DIR, "voice-and-style.md"))
    ? readFileSync(join(CAREER_DIR, "voice-and-style.md"), "utf-8")
    : "(voice guide is empty — add writing samples to career/voice-and-style.md)";

  const staticContext = [
    `## Ryan's Resume (Notion)\n${resume}`,
    `## Ryan's Stories — STAR Achievement Bank (Notion)\n${stories}`,
    `## Core Why — Positioning & Narrative (Notion)\n${coreWhy}`,
    `## Rates Discovery — Compensation Anchors (Notion)\n${rates}`,
    `## Voice Guide (local)\n${voice}`,
  ].join("\n\n---\n\n");

  const user = `## Job Description\n${jd}`;

  return callModel("powerful", SYSTEM, user, staticContext);
}
