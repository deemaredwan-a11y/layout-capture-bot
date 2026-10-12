import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout, Card, SkillTag, btn } from "@/components/Layout";
import { getOpportunity } from "@/lib/opportunities";
import { useProfile } from "@/lib/profile";
import { checkAiService, demoComparison, hasEnoughData } from "@/lib/analysis";

export const Route = createFileRoute("/opportunities/$id/analysis")({
  loader: ({ params }) => {
    const opp = getOpportunity(params.id);
    if (!opp) throw notFound();
    return opp;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `Fit Analysis: ${loaderData.title} — SkillBridge Lite` : "Fit Analysis — SkillBridge Lite" },
      { name: "description", content: "Compare your profile with the selected opportunity." },
      { property: "og:title", content: "AI Fit Analysis — SkillBridge Lite" },
      { property: "og:description", content: "Compare your profile with the selected opportunity." },
    ],
  }),
  component: AnalysisPage,
});

type Status = "loading" | "insufficient" | "unavailable" | "error";

function AnalysisPage() {
  const o = Route.useLoaderData();
  const { profile, isSample } = useProfile();
  const [status, setStatus] = useState<Status>("loading");
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    if (!hasEnoughData(profile)) {
      setStatus("insufficient");
      return;
    }
    checkAiService()
      .then((available) => active && setStatus(available ? "error" : "unavailable"))
      .catch(() => active && setStatus("error"));
    return () => { active = false; };
  }, [profile]);

  const demo = demoComparison(profile, o);

  return (
    <Layout>
      <Link to="/opportunities/$id" params={{ id: o.id }} className="text-sm text-muted-foreground hover:text-foreground">← Back to opportunity</Link>
      <h1 className="mt-4 font-display text-3xl font-semibold text-foreground">AI Fit Analysis</h1>
      <p className="mt-2 text-muted-foreground">
        {o.title} at {o.company} · Profile: {profile.name || "Unnamed"} {isSample && <span className="text-warning-foreground">(sample profile)</span>}
      </p>

      <div className="mt-8">
        {status === "loading" && (
          <Card className="flex items-center gap-3">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-muted-foreground">Checking analysis availability…</span>
          </Card>
        )}
        {status === "insufficient" && (
          <Card>
            <h2 className="font-display text-lg font-semibold text-foreground">Not enough profile information</h2>
            <p className="mt-2 text-muted-foreground">Add at least your skills and either projects or experience to analyze your fit.</p>
            <Link to="/profile" className={`${btn.primary} mt-5`}>Complete My Profile</Link>
          </Card>
        )}
        {status === "unavailable" && (
          <Card className="border-warning/40">
            <h2 className="font-display text-lg font-semibold text-foreground">Real AI analysis is currently unavailable</h2>
            <p className="mt-2 text-muted-foreground">
              No AI service is configured for this prototype, so no AI analysis has been performed on your profile.
            </p>
            <button className={`${btn.secondary} mt-5`} onClick={() => setShowDemo((v) => !v)}>
              {showDemo ? "Hide demonstration example" : "Show demonstration example"}
            </button>
          </Card>
        )}
        {status === "error" && (
          <Card className="border-destructive/40">
            <h2 className="font-display text-lg font-semibold text-destructive">Something went wrong</h2>
            <p className="mt-2 text-muted-foreground">The analysis could not be completed. Please try again later.</p>
          </Card>
        )}
      </div>

      {status === "unavailable" && showDemo && (
        <section className="mt-8">
          <div className="rounded-lg border border-dashed border-border bg-secondary px-4 py-3 text-sm text-foreground">
            <strong>Demonstration example — not an AI analysis.</strong> This preview uses simple keyword matching between your listed skills and the required skills, only to illustrate how results would be laid out.
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Card>
              <h3 className="font-display font-semibold text-foreground">Relevant Skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {demo.matches.length ? demo.matches.map((s) => <SkillTag key={s} tone="match">{s}</SkillTag>) : <p className="text-sm text-muted-foreground">No direct matches found.</p>}
              </div>
            </Card>
            <Card>
              <h3 className="font-display font-semibold text-foreground">Potential Gaps</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {demo.gaps.length ? demo.gaps.map((s) => <SkillTag key={s} tone="gap">{s}</SkillTag>) : <p className="text-sm text-muted-foreground">No gaps found.</p>}
              </div>
            </Card>
            <Card>
              <h3 className="font-display font-semibold text-foreground">Recommended Next Steps</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                {demo.steps.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </Card>
          </div>
        </section>
      )}
    </Layout>
  );
}
