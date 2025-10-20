"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Setting = {
  key: string;
  value: string;
};

const KEYS = [
  { key: "site.title", label: "Site Title" },
  { key: "site.description", label: "Site Description" },
  { key: "profile.name", label: "Profile Name" },
  { key: "profile.photo", label: "Profile Photo URL" },
  { key: "social.twitter", label: "Twitter/X" },
  { key: "social.github", label: "GitHub" },
  { key: "social.linkedin", label: "LinkedIn" },
  { key: "seo.keywords", label: "SEO Keywords (comma separated)" },
];

function SiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from("settings")
      .select("key, value")
      .order("key", { ascending: true });
    if (error) {
      setError(error.message);
      return;
    }
    const map: Record<string, string> = {};
    (data ?? []).forEach((row: any) => {
      map[row.key] = row.value ?? "";
    });
    setSettings(map);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const updates = KEYS.map(({ key }) => ({
      key,
      value: settings[key] ?? "",
    }));
    const { error } = await supabase.from("settings").upsert(updates);
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <section className="glass-panel p-6 space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Site Settings</h2>
        <p className="text-sm text-white/75">
          Update profile, social links, and SEO text content.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {KEYS.map(({ key, label }) => (
          <label key={key} className="flex flex-col gap-2 text-sm">
            <span>{label}</span>
            <input
              className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
              value={settings[key] ?? ""}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, [key]: e.target.value }))
              }
            />
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button
          type="button"
          disabled={loading}
          onClick={handleSave}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#020617] hover:bg-white/90 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save settings"}
        </button>
      </div>
    </section>
  );
}

export default SiteSettings;
