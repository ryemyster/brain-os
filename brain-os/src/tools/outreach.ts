import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";
import { appendOutreachLog } from "../context.js";

export function runOutreach(
  company: string,
  targetPerson?: string,
  role?: string
): object {
  const slug = company.toLowerCase().replace(/\s+/g, "-");

  const resumePath = join(CAREER_DIR, "resume.md");
  const voicePath = join(CAREER_DIR, "voice-and-style.md");
  const achievementsPath = join(CAREER_DIR, "achievements.md");
  const pipelinePath = join(CAREER_DIR, "pipeline", `${slug}.md`);

  const resume = existsSync(resumePath) ? readFileSync(resumePath, "utf-8") : "(empty — add resume to career/resume.md)";
  const voice = existsSync(voicePath) ? readFileSync(voicePath, "utf-8") : "(empty — add voice guide to career/voice-and-style.md)";
  const achievements = existsSync(achievementsPath) ? readFileSync(achievementsPath, "utf-8") : "(empty)";
  const pipelineContext = existsSync(pipelinePath) ? readFileSync(pipelinePath, "utf-8") : null;

  appendOutreachLog(company, targetPerson ?? "", "drafting", `Outreach strategy initiated${role ? ` for ${role}` : ""}. Drafts pending.`);

  return {
    task: `Generate an outreach strategy and message drafts for ${company}${targetPerson ? ` — targeting ${targetPerson}` : ""}${role ? ` for the ${role} role` : ""}.`,
    instructions: [
      targetPerson
        ? `Research ${targetPerson}'s background: current role at ${company}, career path, public writing or talks, any shared context with Ryan.`
        : `Identify the best person to reach out to at ${company} for a PM role — typically the hiring manager, VP Product, or a PM on the relevant team.`,
      "Identify the strongest outreach angle: shared background, company-specific insight Ryan can offer, a product observation, or a mutual connection path.",
      "Draft a LinkedIn DM: 3-4 sentences max. Specific hook in sentence one (not 'I came across your profile'). No asking for a job directly — ask for a 20-minute conversation. Must sound like Ryan, not a template.",
      "Draft an email alternative (subject line + 4-5 sentences) for cases where LinkedIn is unlikely to get a response.",
      "Suggest 2-3 warm intro paths: who Ryan might know in common (type of person to find, not names), what community or event overlap might exist (e.g., NYC PM meetups, AI conferences).",
      "Flag one specific piece of company news, product launch, or market development to reference — makes outreach timely and personal.",
    ],
    anti_patterns: [
      "Do not open with 'I hope this message finds you well'",
      "Do not say 'I am very interested in opportunities at...'",
      "Do not list credentials — show relevance through specificity",
      "Do not ask for a job in the first message — ask for a conversation",
      "Do not be generic — every message must have one company-specific or person-specific detail",
    ],
    context: {
      company,
      target_person: targetPerson ?? "TBD — identify best contact",
      role: role ?? "Senior PM or similar",
    },
    pipeline_context: pipelineContext ?? `No pipeline notes for ${company} yet. Run intel first to gather company context that will sharpen the outreach angle.`,
    resume,
    voice_guide: voice,
    achievements,
  };
}
