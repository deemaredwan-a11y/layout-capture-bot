import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout, Card, btn } from "@/components/Layout";
import { useProfile, type Profile } from "@/lib/profile";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — SkillBridge Lite" },
      { name: "description", content: "Enter your skills, projects, and experience." },
      { property: "og:title", content: "My Profile — SkillBridge Lite" },
      { property: "og:description", content: "Enter your skills, projects, and experience." },
    ],
  }),
  component: ProfilePage,
});

const fields: { key: keyof Profile; label: string; area?: boolean; hint?: string }[] = [
  { key: "name", label: "Name" },
  { key: "headline", label: "Headline" },
  { key: "about", label: "About", area: true },
  { key: "skills", label: "Skills", area: true, hint: "Separate skills with commas, e.g. Python, React, APIs" },
  { key: "projects", label: "Projects", area: true },
  { key: "experience", label: "Experience", area: true },
];

function ProfilePage() {
  const { profile, isSample, save } = useProfile();
  const [form, setForm] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);
  const input =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <Layout>
      <h1 className="font-display text-3xl font-semibold text-foreground">My Profile</h1>
      <p className="mt-2 text-muted-foreground">Your profile is kept in this session only and is used for fit analysis.</p>
      {isSample && (
        <div className="mt-6 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
          <strong>Sample profile:</strong> the details below are placeholder examples, not your information. Edit and save to use your own.
        </div>
      )}
      <Card className="mt-6">
        <form
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            save(form);
            setSaved(true);
          }}
        >
          {fields.map((f) => (
            <label key={f.key} className="grid gap-1.5">
              <span className="text-sm font-medium text-foreground">{f.label}</span>
              {f.area ? (
                <textarea rows={3} className={input} value={form[f.key]} onChange={(e) => { setForm({ ...form, [f.key]: e.target.value }); setSaved(false); }} />
              ) : (
                <input className={input} value={form[f.key]} onChange={(e) => { setForm({ ...form, [f.key]: e.target.value }); setSaved(false); }} />
              )}
              {f.hint && <span className="text-xs text-muted-foreground">{f.hint}</span>}
            </label>
          ))}
          <div className="flex items-center gap-4">
            <button type="submit" className={btn.primary}>Save Profile</button>
            {saved && <span className="text-sm text-success">Profile saved.</span>}
          </div>
        </form>
      </Card>
    </Layout>
  );
}
