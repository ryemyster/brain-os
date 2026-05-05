import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";
import { writeCompanyContext } from "../context.js";

export function runIntel(company: string): object {
  const slug = company.toLowerCase().replace(/\s+/g, "-");
  const pipelinePath = join(CAREER_DIR, "pipeline", `${slug}.md`);
  const existingNotes = existsSync(pipelinePath) ? readFileSync(pipelinePath, "utf-8") : null;

  writeCompanyContext(company, "Intel Run", `Intel research initiated. See context/companies/${slug}.md for accumulated findings.`);

  return {
    task: `Generate a company intelligence report on ${company} for a job hunt context. Research each section below and synthesize findings.`,
    sections: {
      nyc_presence: {
        description: "New York City footprint",
        research_questions: [
          `Does ${company} have a NYC office? Where?`,
          "What is the NYC team size and what functions are based there?",
          "Is the role in-office, hybrid, or remote? What is the expected in-office cadence?",
          "Is NYC the HQ or a satellite? Who leads the NYC presence?",
        ],
      },
      org_health: {
        description: "Organizational health and trajectory",
        research_questions: [
          `What is ${company}'s funding stage and total raised? When was the last round?`,
          "What is the headcount trend — growing, stable, or contracting?",
          "Any recent layoffs, hiring freezes, or leadership departures?",
          "What do Glassdoor, Blind, or LinkedIn signals suggest about morale and retention?",
          "Are they hiring broadly or selectively? What does the hiring pace signal?",
        ],
      },
      market_strategy: {
        description: "What they're doing in the market right now",
        research_questions: [
          `What problem does ${company} solve and for whom?`,
          "Who are their primary competitors and how do they differentiate?",
          "Any recent pivots, rebrands, or strategic shifts in the last 12 months?",
          "What is their go-to-market motion — PLG, enterprise sales, or hybrid?",
          "Any recent press, analyst coverage, or notable partnerships?",
        ],
      },
      product_direction: {
        description: "Where the product is headed",
        research_questions: [
          `What have they launched or shipped in the last 6-12 months?`,
          "What is their AI strategy — is AI core to the product or a feature layer?",
          "What are they hiring for? What does the PM job description reveal about priorities?",
          "Any public roadmap signals from blog posts, conference talks, or exec interviews?",
        ],
      },
      pm_org: {
        description: "PM organization and leadership",
        research_questions: [
          "Who leads product (CPO/VP Product)? What is their background?",
          "How many PMs are there and how are they organized?",
          "Do PMs own outcomes or manage roadmaps? Any signals from job descriptions or leadership interviews?",
          "What is the PM-to-engineer ratio? What does it signal about the culture?",
        ],
      },
    },
    output_format: "For each section: 3-5 bullet findings + one-sentence bottom line. End with an Overall Signal: Green (strong opportunity), Yellow (worth watching), or Red (concerning).",
    existing_notes: existingNotes ?? `No pipeline notes yet for ${company}. Create career/pipeline/${slug}.md to capture findings from this research.`,
    save_instruction: `After generating this report, offer to save the key findings to career/pipeline/${slug}.md for future reference.`,
  };
}
