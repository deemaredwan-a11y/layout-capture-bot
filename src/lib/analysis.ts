import { z } from "zod";
import type { Profile } from "./profile";

export function hasEnoughData(p: Profile) {
  return p.skills.trim().length > 0 && (p.projects.trim().length > 0 || p.experience.trim().length > 0);
}

const text = z.string().trim().min(1).max(600);

export const analysisResultSchema = z
  .object({
    relevantSkills: z.array(z.object({ item: text, evidence: text, relevance: text }).strict()).max(12),
    potentialGaps: z.array(z.object({ requirement: text, reason: text }).strict()).max(12),
    recommendedNextSteps: z.array(z.object({ action: text, reason: text }).strict()).max(10),
  })
  .strict();

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

/** Strict JSON schema sent to the AI model so its output matches analysisResultSchema. */
const str = { type: "string" };
const obj = (keys: string[]) => ({
  type: "object",
  additionalProperties: false,
  required: keys,
  properties: Object.fromEntries(keys.map((k) => [k, str])),
});
export const analysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["relevantSkills", "potentialGaps", "recommendedNextSteps"],
  properties: {
    relevantSkills: { type: "array", items: obj(["item", "evidence", "relevance"]) },
    potentialGaps: { type: "array", items: obj(["requirement", "reason"]) },
    recommendedNextSteps: { type: "array", items: obj(["action", "reason"]) },
  },
};

export type AnalysisFailureKind = "insufficient" | "unavailable" | "invalid" | "error";
export type AnalysisResponse =
  | { ok: true; result: AnalysisResult }
  | { ok: false; kind: AnalysisFailureKind; message: string };

export class AnalysisFailure extends Error {
  constructor(public kind: AnalysisFailureKind, message: string) {
    super(message);
  }
}

/** Parses raw model text; returns null unless it is valid analysis data. */
export function parseAnalysisOutput(raw: string): AnalysisResult | null {
  try {
    const parsed = analysisResultSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
