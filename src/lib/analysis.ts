import type { Opportunity } from "./opportunities";
import type { Profile } from "./profile";

/** No AI service is configured in this prototype. */
export const AI_SERVICE_CONFIGURED = false;

export async function checkAiService(): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 600));
  return AI_SERVICE_CONFIGURED;
}

export function hasEnoughData(p: Profile) {
  return p.skills.trim().length > 0 && (p.projects.trim().length > 0 || p.experience.trim().length > 0);
}

/** Simple keyword matching used only for the labeled demonstration example. */
export function demoComparison(p: Profile, o: Opportunity) {
  const text = `${p.skills} ${p.projects} ${p.experience}`.toLowerCase();
  const has = (s: string) => new RegExp(`\\b${s.toLowerCase()}\\b`).test(text);
  const matches = o.skills.filter(has);
  const gaps = o.skills.filter((s) => !has(s));
  const steps = gaps.length
    ? gaps.map((g) => `Build a small project that demonstrates ${g}, then add it to your profile.`)
    : ["Highlight your matching projects clearly in your profile."];
  return { matches, gaps, steps };
}
