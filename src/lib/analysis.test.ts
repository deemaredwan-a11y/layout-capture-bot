import { describe, expect, it } from "vitest";
import { demoComparison, hasEnoughData, AI_SERVICE_CONFIGURED } from "./analysis";
import { opportunities } from "./opportunities";
import { sampleProfile } from "./profile";

describe("analysis rules", () => {
  it("has exactly three opportunities", () => expect(opportunities).toHaveLength(3));
  it("AI is reported unavailable", () => expect(AI_SERVICE_CONFIGURED).toBe(false));
  it("requires skills for analysis", () => expect(hasEnoughData({ ...sampleProfile, skills: "" })).toBe(false));
  it("demo matches skills", () => {
    const r = demoComparison({ ...sampleProfile, skills: "Python, APIs" }, opportunities[0]);
    expect(r.matches).toEqual(["Python", "APIs"]);
    expect(r.gaps).toEqual(["AI", "Automation"]);
  });
});
