import { describe, expect, it } from "vitest";
import { hasEnoughData, parseAnalysisOutput } from "./analysis";
import { opportunities } from "./opportunities";
import { sampleProfile } from "./profile";

describe("analysis rules", () => {
  it("has exactly three opportunities", () => expect(opportunities).toHaveLength(3));
  it("requires skills for analysis", () => expect(hasEnoughData({ ...sampleProfile, skills: "" })).toBe(false));
  it("accepts valid output", () => {
    const r = parseAnalysisOutput(JSON.stringify({ relevantSkills: [{ item: "Python", evidence: "Script", relevance: "Needed" }], potentialGaps: [], recommendedNextSteps: [] }));
    expect(r?.relevantSkills[0]?.item).toBe("Python");
  });
  it("rejects output missing a field", () => expect(parseAnalysisOutput(JSON.stringify({ relevantSkills: [], potentialGaps: [] }))).toBeNull());
  it("rejects non-JSON output", () => expect(parseAnalysisOutput("not json")).toBeNull());
});
