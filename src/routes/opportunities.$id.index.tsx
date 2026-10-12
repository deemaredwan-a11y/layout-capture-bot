import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout, Card, SkillTag, btn } from "@/components/Layout";
import { getOpportunity } from "@/lib/opportunities";

export const Route = createFileRoute("/opportunities/$id/")({
  loader: ({ params }) => {
    const opp = getOpportunity(params.id);
    if (!opp) throw notFound();
    return opp;
  },
  head: ({ loaderData }) => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: loaderData ? `${loaderData.title} at ${loaderData.company} — SkillBridge Lite` : "Opportunity — SkillBridge Lite" },
      { name: "description", content: loaderData?.description ?? "Opportunity details" },
      { property: "og:title", content: loaderData ? `${loaderData.title} — SkillBridge Lite` : "Opportunity" },
      { property: "og:description", content: loaderData?.description ?? "Opportunity details" },
    ],
  }),
  component: DetailsPage,
});

function DetailsPage() {
  const o = Route.useLoaderData();
  return (
    <Layout>
      <Link to="/opportunities" className="text-sm text-muted-foreground hover:text-foreground">← All opportunities</Link>
      <Card className="mt-4">
        <p className="text-sm text-muted-foreground">{o.company}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">{o.title}</h1>
        <p className="mt-4 text-muted-foreground">{o.description}</p>
        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-foreground">Required skills</h2>
        <div className="mt-3 flex flex-wrap gap-2">{o.skills.map((s) => <SkillTag key={s}>{s}</SkillTag>)}</div>
        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-foreground">Responsibilities</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
          {o.responsibilities.map((r) => <li key={r}>{r}</li>)}
        </ul>
        <Link to="/opportunities/$id/analysis" params={{ id: o.id }} className={`${btn.primary} mt-8`}>
          Analyze My Fit
        </Link>
      </Card>
    </Layout>
  );
}
