import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";

export function runApply(jd: string): object {
  const resumePath = join(CAREER_DIR, "resume.md");
  const voicePath = join(CAREER_DIR, "voice-and-style.md");
  const achievementsPath = join(CAREER_DIR, "achievements.md");

  const resume = existsSync(resumePath)
    ? readFileSync(resumePath, "utf-8")
    : "(resume file is empty — add your resume to career/resume.md before using apply)";

  const voice = existsSync(voicePath)
    ? readFileSync(voicePath, "utf-8")
    : "(voice guide is empty — add writing samples and tone notes to career/voice-and-style.md)";

  const achievements = existsSync(achievementsPath)
    ? readFileSync(achievementsPath, "utf-8")
    : "(achievements file is empty)";

  return {
    task: "Analyze this job description against Ryan's resume and generate application materials.",
    instructions: [
      "Extract the top 10 required and preferred qualifications from the JD.",
      "For each: rate as Strong Match, Partial Match, or Gap based on the resume and achievements.",
      "Identify 3-5 existing resume bullets to highlight or sharpen for this role.",
      "Draft a cover letter — 3 tight paragraphs, no filler opener, written in Ryan's voice per the voice guide.",
      "Flag the top 2 gaps to address — either acknowledge in the letter or prepare to answer in screening.",
    ],
    job_description: jd,
    resume,
    voice_guide: voice,
    achievements,
  };
}
