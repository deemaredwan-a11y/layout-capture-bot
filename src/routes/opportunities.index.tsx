import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, Card, SkillTag, btn } from "@/components/Layout";
import { opportunities } from "@/lib/opportunities";

export const Route = createFileRoute("/opportunities/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Opportunities — SkillBridge Lite" },
      { name: "description", content: "Browse sample opportunities and check your fit." },
      { property: "og:title", content: "Opportunities — SkillBridge Lite" },
      { property: "og:description", content: "Browse sample opportunities and check your fit." },
    ],
  }),
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  return (
    <Layout>
      <h1 className="font-display text-3xl font-semibold text-foreground">Opportunities</h1>
      <p className="mt-2 text-muted-foreground">Sample opportunities to compare against your profile.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {opportunities.map((o) => (
          <Card key={o.id} className="flex flex-col">
            <p className="text-sm text-muted-foreground">{o.company}</p>
            <h2 className="mt-1 font-display text-lg font-semibold text-foreground">{o.title}</h2>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{o.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {o.skills.map((s) => <SkillTag key={s}>{s}</SkillTag>)}
            </div>
            <Link to="/opportunities/$id" params={{ id: o.id }} className={`${btn.secondary} mt-6`}>
              View Details
            </Link>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
