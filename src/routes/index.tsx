import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, btn } from "@/components/Layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillBridge Lite — Understand Your Fit" },
      { name: "description", content: "See how your skills and projects relate to professional opportunities, and discover what to improve next." },
      { property: "og:title", content: "SkillBridge Lite — Understand Your Fit" },
      { property: "og:description", content: "See how your skills relate to opportunities and discover your next step." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <Layout>
      <section className="mx-auto max-w-2xl py-10 text-center sm:py-20">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">SkillBridge Lite</p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
          Understand Your Fit. Discover Your Next Step.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          For students, recent graduates, and early-career professionals: compare your documented skills,
          projects, and experience with a selected opportunity to see where you stand and what to improve.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/opportunities" className={btn.primary}>Explore Opportunities</Link>
          <Link to="/profile" className={btn.secondary}>Complete My Profile</Link>
        </div>
      </section>
    </Layout>
  );
}
