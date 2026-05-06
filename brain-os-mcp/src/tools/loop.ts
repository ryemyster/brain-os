import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";
import { getCompanyLoop, getRound, MAANG_LOOPS } from "../data/maang.js";

export function runLoop(company: string, round?: string): object {
  const resumePath = join(CAREER_DIR, "resume.md");
  const achievementsPath = join(CAREER_DIR, "achievements.md");

  const resume = existsSync(resumePath) ? readFileSync(resumePath, "utf-8") : "(empty)";
  const achievements = existsSync(achievementsPath) ? readFileSync(achievementsPath, "utf-8") : "(empty)";

  const loop = getCompanyLoop(company);

  if (!loop) {
    const available = Object.values(MAANG_LOOPS).map((l) => l.company);
    return {
      status: "not_found",
      message: `No loop data found for "${company}". Available companies: ${available.join(", ")}.`,
      tip: "Try the exact company name or a common alias (e.g., 'Meta', 'Amazon', 'Netflix', 'Google', 'Apple').",
    };
  }

  if (round) {
    const matchedRound = getRound(loop, round);
    if (!matchedRound) {
      return {
        status: "round_not_found",
        company: loop.company,
        message: `No round matching "${round}" found in ${loop.company}'s loop.`,
        available_rounds: loop.rounds.map((r) => ({ id: r.id, name: r.name, stage: r.stage })),
      };
    }

    return {
      task: `Prep Ryan for the "${matchedRound.name}" round at ${loop.company}.`,
      instructions: [
        "Read the round spec below and the candidate context.",
        "Brief Ryan on exactly what this round tests and what they actually want to see.",
        "Walk through each question — don't just list them. For each question, explain the underlying intent and what a great answer looks like.",
        "Based on Ryan's resume and achievements, suggest which of his specific stories or experiences map best to this round.",
        "Flag any deal-breakers specific to this round that Ryan needs to avoid.",
        "End with: the single most important thing to nail in this round.",
      ],
      company_context: {
        company: loop.company,
        unique_emphasis: loop.unique_emphasis,
        framework: loop.framework,
        deal_breakers: loop.deal_breakers,
        ai_specific_notes: loop.ai_specific_notes,
      },
      round: matchedRound,
      candidate_context: {
        resume,
        achievements,
        note: "Use Ryan's actual experience to make the prep specific. Reference real projects and wins when suggesting story choices.",
      },
    };
  }

  return {
    task: `Brief Ryan on the full ${loop.company} PM interview loop — what each round tests, what they actually want, and how to approach the process as a whole.`,
    instructions: [
      "Start with the big picture: what makes this company's interview loop distinctive vs. other MAANG loops.",
      "Walk through each round in order — for each: what it tests, what they actually want, the key rubric items, and what separates great from average answers.",
      "Identify which 2-3 rounds are highest leverage — where Ryan should spend most prep time.",
      "Flag all deal-breakers and how to avoid them.",
      "Based on Ryan's background, identify which rounds play to his strengths and which are his biggest risks.",
      "End with a prioritized prep plan: what to work on first.",
    ],
    company: {
      name: loop.company,
      total_rounds: loop.total_rounds,
      timeline: loop.timeline,
      unique_emphasis: loop.unique_emphasis,
      framework: loop.framework,
      deal_breakers: loop.deal_breakers,
      ai_specific_notes: loop.ai_specific_notes,
    },
    rounds: loop.rounds.map((r) => ({
      name: r.name,
      stage: r.stage,
      duration: r.duration,
      tests: r.tests,
      what_they_actually_want: r.what_they_actually_want,
      rubric: r.rubric,
      great_signals: r.great_signals,
      weak_signals: r.weak_signals,
      notes: r.notes,
    })),
    candidate_context: {
      resume,
      achievements,
      note: "Cross-reference Ryan's experience against the loop requirements. Be specific about fit strengths and gaps.",
    },
  };
}
