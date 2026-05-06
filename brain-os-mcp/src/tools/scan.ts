import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR, EXTERNAL_URLS } from "../config.js";
import { fetchUrl } from "../fetch.js";
import { notion, NOTION_PAGES } from "../notion-client.js";

function parseLocationFromCriteria(criteria: string): string {
  const match = criteria.match(/##\s*Location\s*\n([\s\S]*?)(?=\n##|$)/i);
  if (!match) return "Remote or major US city";
  const firstLine = match[1].trim().split("\n")[0].trim();
  return firstLine || "Remote or major US city";
}

export async function runScan(filters?: { focus?: string; stage?: string; location?: string }): Promise<object> {
  const focusAreas = filters?.focus ?? "AI, FinTech, HealthTech";

  // Read criteria first (sync) so location can be derived from it before async fetches
  const criteria = existsSync(join(CAREER_DIR, "job-criteria.md"))
    ? readFileSync(join(CAREER_DIR, "job-criteria.md"), "utf-8")
    : "(empty)";

  const location = filters?.location ?? parseLocationFromCriteria(criteria);

  const [resume, coreWhy, rates, portfolio] = await Promise.all([
    notion.fetchPage(NOTION_PAGES.resume),
    notion.fetchPage(NOTION_PAGES.core_why),
    notion.fetchPage(NOTION_PAGES.rates_discovery),
    fetchUrl(EXTERNAL_URLS.portfolio, "(portfolio unavailable)"),
  ]);

  return {
    task: "Find companies actively hiring for PM roles that match this candidate's profile. Execute the search queries below, then synthesize findings into a prioritized opportunity list.",
    instructions: [
      "Run each search query and collect 15-20 distinct companies with open PM roles.",
      "For each company: extract role title, seniority, whether AI is core to the product, and any signals about team culture or PM org strength.",
      "Group results into tiers: Strong Fit (≥7/10), Worth Exploring (5-6/10), Pass (<5/10).",
      "For each Strong Fit company: write one sentence on why Ryan's background is specifically relevant.",
      "Flag any companies where the Ascendvent/AOSI founder angle or FounderOS MCP background is a differentiator.",
      "Note if any company recently raised, launched, or is in a growth push — these are the highest-urgency targets.",
      "Use candidate_context to evaluate fit — resume and core_why are the primary sources.",
      "Use rates to filter out roles where comp is clearly misaligned.",
    ],
    search_queries: [
      `"senior product manager" OR "head of product" AI fintech healthtech "${location}" site:greenhouse.io OR site:lever.co`,
      `"senior PM" OR "principal product manager" AI startup "${location}" -junior -associate`,
      `"product manager" AI "${location}" fintech 2026 job opening`,
      `site:linkedin.com/jobs "senior product manager" AI "${location}"`,
      `"head of product" OR "director of product" AI-native company "${location}" 2026`,
    ],
    candidate_profile: {
      target_roles: ["Senior PM", "Staff PM", "Head of Product", "Director of Product"],
      focus_areas: focusAreas,
      location,
      differentiators: "AI/FinTech/HealthTech PM, founder experience, built and shipped MCP server (FounderOS), agent orchestration and LLM product design background",
    },
    candidate_context: {
      resume,
      core_why: coreWhy,
      rates_discovery: rates,
      job_criteria: criteria,
      portfolio,
    },
  };
}
