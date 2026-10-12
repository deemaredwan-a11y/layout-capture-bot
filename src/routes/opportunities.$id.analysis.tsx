import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { AnalysisInterface } from "@/components/AnalysisInterface";
import { getOpportunity } from "@/lib/opportunities";
import { useProfile, type Profile } from "@/lib/profile";
import { AnalysisFailure } from "@/lib/analysis";
import { analyzeFit } from "@/lib/fit-analysis.functions";
import type { Opportunity } from "@/lib/opportunities";

async function requestAnalysis(profile: Profile, opportunity: Opportunity) {
  const res = await analyzeFit({ data: { profile, opportunityId: opportunity.id } });
  if (!res.ok) throw new AnalysisFailure(res.kind, res.message);
  return res.result;
}

export const Route = createFileRoute("/opportunities/$id/analysis")({
  loader: ({ params }) => {
    const opp = getOpportunity(params.id);
    if (!opp) throw notFound();
    return opp;
  },
  head: ({ loaderData }) => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: loaderData ? `Fit Analysis: ${loaderData.title} — SkillBridge Lite` : "Fit Analysis — SkillBridge Lite" },
      { name: "description", content: "Compare your profile with the selected opportunity." },
      { property: "og:title", content: "AI Fit Analysis — SkillBridge Lite" },
      { property: "og:description", content: "Compare your profile with the selected opportunity." },
    ],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const opportunity = Route.useLoaderData();
  const { profile, isSample } = useProfile();
  return (
    <Layout>
      <Link to="/opportunities/$id" params={{ id: opportunity.id }} className="text-sm text-muted-foreground hover:text-foreground">← Back to opportunity</Link>
      <h1 className="mt-4 font-display text-3xl font-semibold text-foreground">AI Fit Analysis</h1>
      <p className="mt-2 text-muted-foreground">
        {opportunity.title} at {opportunity.company} · Profile: {profile.name || "Unnamed"} {isSample && <span className="text-warning-foreground">(sample profile)</span>}
      </p>
      <AnalysisInterface profile={profile} opportunity={opportunity} request={requestAnalysis} />
    </Layout>
  );
}
