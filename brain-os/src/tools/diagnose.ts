import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";

export function runDiagnose(company?: string): object {
  const notesDir = join(CAREER_DIR, "interview-notes");
  const achievementsPath = join(CAREER_DIR, "achievements.md");

  const notes: Array<{ filename: string; content: string }> = [];

  if (existsSync(notesDir)) {
    const files = readdirSync(notesDir).filter((f) => f.endsWith(".md") && f !== ".gitkeep");
    for (const file of files) {
      if (company && !file.toLowerCase().includes(company.toLowerCase())) continue;
      notes.push({
        filename: file,
        content: readFileSync(join(notesDir, file), "utf-8"),
      });
    }
  }

  const achievements = existsSync(achievementsPath) ? readFileSync(achievementsPath, "utf-8") : "(empty)";

  if (notes.length === 0) {
    return {
      status: "no_notes",
      message: company
        ? `No interview notes found for ${company}. Add a file to career/interview-notes/${company.toLowerCase()}.md after your interviews.`
        : "No interview notes found. Add files to career/interview-notes/ after each interview — one file per company. Include: questions asked, your answers, interviewer reactions, and any feedback received.",
      template: `# Interview Notes — [Company Name]\n\n**Date:** YYYY-MM-DD\n**Round:** [Phone screen / Panel / Final / Take-home]\n**Interviewer(s):** [Name, role if known]\n\n## Questions asked\n\n1. [Question] — My answer: [What I said] — Their reaction: [How it landed]\n\n## Feedback received\n\n[Any direct or indirect feedback]\n\n## My assessment\n\n**What went well:**\n**What felt weak:**\n**Questions I couldn't answer well:**\n**Overall vibe:**`,
    };
  }

  return {
    task: "Analyze these interview notes to diagnose patterns in performance. Identify recurring issues, weak response types, and the highest-leverage areas to improve.",
    instructions: [
      "Read all interview notes and extract: questions asked, quality of Ryan's answers (based on his own assessment and any feedback), question types that recur.",
      "Identify the top 3 recurring failure patterns — be specific (e.g., 'answers product design questions generically without naming a specific user segment', not 'needs to be more specific').",
      "Identify the top 2 recurring strengths — what's consistently landing well.",
      "Flag any question types Ryan consistently avoids or struggles with (metrics, behavioral, strategy, etc.).",
      "Identify story gaps: question themes that came up but Ryan had no strong story for.",
      "Compare against the achievements file — are strong achievements being left out of answers?",
      "Output a ranked practice priority list: what to work on first, second, third — with specific drill recommendations for each.",
      "End with one diagnosis sentence: the single most important thing holding back interview performance right now.",
    ],
    interview_notes: notes,
    achievements,
    scope: company ? `Filtered to: ${company}` : "All interviews",
  };
}
