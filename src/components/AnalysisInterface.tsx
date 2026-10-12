import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, CircleHelp, LoaderCircle, Sparkles, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillTag } from "@/components/Layout";
import { AnalysisFailure, analysisResultSchema, hasEnoughData, type AnalysisResult } from "@/lib/analysis";
import type { Profile } from "@/lib/profile";
import type { Opportunity } from "@/lib/opportunities";

export type { AnalysisResult };
export type AnalysisRequest = (profile: Profile, opportunity: Opportunity) => Promise<AnalysisResult>;
type State =
  | { status: "idle" | "analyzing" | "insufficient" | "unavailable"; detail?: string }
  | { status: "success"; result: AnalysisResult; detail?: string }
  | { status: "error"; detail?: string };

function initialState(profile: Profile, request?: AnalysisRequest): State {
  if (!hasEnoughData(profile)) return { status: "insufficient" };
  return { status: request ? "idle" : "unavailable" };
}

export function AnalysisInterface({ profile, opportunity, request }: {
  profile: Profile;
  opportunity: Opportunity;
  request?: AnalysisRequest;
}) {
  const [state, setState] = useState<State>(() => initialState(profile, request));
  const generation = useRef(0);
  const pending = useRef(false);
  useEffect(() => {
    generation.current += 1;
    pending.current = false;
    setState(initialState(profile, request));
    return () => { generation.current += 1; };
  }, [profile, opportunity, request]);

  async function analyze() {
    if (pending.current) return;
    if (!hasEnoughData(profile) || !request) {
      setState(initialState(profile, request));
      return;
    }
    pending.current = true;
    const current = generation.current;
    setState({ status: "analyzing" });
    try {
      const result = await request(profile, opportunity);
      const parsed = analysisResultSchema.safeParse(result);
      if (!parsed.success) throw new AnalysisFailure("invalid", "The AI returned a response we couldn't verify, so no results are shown.");
      if (current === generation.current) setState({ status: "success", result: parsed.data });
    } catch (e) {
      if (current !== generation.current) return;
      if (e instanceof AnalysisFailure) {
        const status = e.kind === "unavailable" ? "unavailable" : e.kind === "insufficient" ? "insufficient" : "error";
        setState({ status, detail: e.message });
      } else setState({ status: "error" });
    } finally {
      if (current === generation.current) pending.current = false;
    }
  }

  const messages = {
    idle: ["Ready to analyze", "Your profile is ready to compare with this opportunity."],
    analyzing: ["Analyzing your fit…", "Reviewing your skills, projects, and experience against this opportunity."],
    success: ["Analysis complete", "Your results are based on the profile information you provided."],
    insufficient: ["Not enough profile information", "Add your skills and at least one project or experience before requesting an analysis."],
    unavailable: ["Real AI analysis is unavailable", "The AI service is not available right now. Your profile has not been analyzed, and no AI-generated results are shown."],
    error: ["We couldn’t complete your analysis", "No new results are available. Please try again. If the problem continues, try again later."],
  };
  const [title, defaultDescription] = messages[state.status];
  const description = state.detail ?? defaultDescription;
  const StatusIcon = state.status === "analyzing" ? LoaderCircle : state.status === "success" ? CheckCircle2 :
    state.status === "error" || state.status === "unavailable" ? AlertCircle : CircleHelp;
  const result = state.status === "success" ? state.result : undefined;
  const emptyMessage = state.status === "analyzing" ? "Analysis in progress…" :
    state.status === "unavailable" ? "No results — the AI service is unavailable." :
    state.status === "insufficient" ? "Complete your profile to get results." :
    state.status === "error" ? "No results available from this request." : "Awaiting analysis.";

  return (
    <div className="mt-8" aria-busy={state.status === "analyzing"}>
      <section className="border-y border-border py-6" aria-live="polite" aria-atomic="true">
        <div className="flex items-start gap-3">
          <StatusIcon aria-hidden="true" className={`mt-0.5 size-5 shrink-0 ${state.status === "analyzing" ? "motion-safe:animate-spin text-primary" : state.status === "error" ? "text-destructive" : state.status === "success" ? "text-success" : "text-warning-foreground"}`} />
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
            {state.status === "insufficient" && (
              <Button asChild className="mt-4"><Link to="/profile">Complete My Profile</Link></Button>
            )}
            {request && state.status !== "insufficient" && (state.status !== "unavailable" || state.detail) && (
              <Button className="mt-4" disabled={state.status === "analyzing"} onClick={analyze}>
                <Sparkles aria-hidden="true" />
                {state.status === "analyzing" ? "Analyzing…" : state.status === "error" || state.status === "unavailable" ? "Try Again" : state.status === "success" ? "Analyze Again" : "Analyze My Fit"}
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <section aria-labelledby="relevant-skills" className="min-w-0">
          <Target className="mb-3 size-5 text-success" aria-hidden="true" />
          <h2 id="relevant-skills" className="font-display font-semibold text-foreground">Relevant Skills</h2>
          {result ? result.relevantSkills.length ? <ul className="mt-4 space-y-3 break-words text-sm">
            {result.relevantSkills.map((s, i) => <li key={i}><SkillTag tone="match">{s.item}</SkillTag>
              <p className="mt-1 text-muted-foreground"><span className="font-medium text-foreground">Evidence:</span> {s.evidence}</p>
              <p className="text-muted-foreground"><span className="font-medium text-foreground">Relevance:</span> {s.relevance}</p></li>)}
          </ul> : <p className="mt-4 text-sm text-muted-foreground">No relevant skills were identified in this analysis.</p> :
            <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>}
        </section>
        <section aria-labelledby="potential-gaps" className="min-w-0">
          <CircleHelp className="mb-3 size-5 text-warning-foreground" aria-hidden="true" />
          <h2 id="potential-gaps" className="font-display font-semibold text-foreground">Potential Gaps</h2>
          {result ? result.potentialGaps.length ? <ul className="mt-4 space-y-3 break-words text-sm">
            {result.potentialGaps.map((g, i) => <li key={i}><SkillTag tone="gap">{g.requirement}</SkillTag>
              <p className="mt-1 text-muted-foreground">{g.reason}</p></li>)}
          </ul> : <p className="mt-4 text-sm text-muted-foreground">No potential gaps were identified in this analysis.</p> :
            <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>}
        </section>
        <section aria-labelledby="next-steps" className="min-w-0">
          <TrendingUp className="mb-3 size-5 text-primary" aria-hidden="true" />
          <h2 id="next-steps" className="font-display font-semibold text-foreground">Recommended Next Steps</h2>
          {result ? result.recommendedNextSteps.length ? <ol className="mt-4 list-decimal space-y-3 break-words pl-5 text-sm leading-relaxed text-muted-foreground">
            {result.recommendedNextSteps.map((s, i) => <li key={i}><span className="font-medium text-foreground">{s.action}</span><br />{s.reason}</li>)}
          </ol> : <p className="mt-4 text-sm text-muted-foreground">No next steps were recommended in this analysis.</p> :
            <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>}
        </section>
      </div>
    </div>
  );
}