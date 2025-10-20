"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  repo_url: string | null;
  live_url: string | null;
  tags: string[] | null;
  cover_image: string | null;
  created_at: string | null;
};

export type ProjectUpsert = Omit<Project, "id" | "created_at"> & {
  id?: string;
};

const emptyProject: ProjectUpsert = {
  title: "",
  slug: "",
  description: "",
  repo_url: "",
  live_url: "",
  tags: [],
  cover_image: "",
};

function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectUpsert>(emptyProject);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (fetchError) setError(fetchError.message);
    setItems((data ?? []) as Project[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload: any = { ...form };
    if (Array.isArray(payload.tags))
      payload.tags = payload.tags.filter(Boolean);
    const { error: upsertError } = await supabase
      .from("projects")
      .upsert(payload);
    if (upsertError) setError(upsertError.message);
    else {
      setForm(emptyProject);
      fetchItems();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error: delError } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);
    if (delError) setError(delError.message);
    else fetchItems();
  };

  return (
    <section className="glass-panel p-6 space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Projects</h2>
        <p className="text-sm text-white/75">
          Manage portfolio projects. Include repo, live link, tags, and a cover
          image.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <label className="flex flex-col gap-2 text-sm">
          <span>Title</span>
          <input
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Slug (unique)</span>
          <input
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-sm">
          <span>Description</span>
          <textarea
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
            rows={3}
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Repo URL</span>
          <input
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
            value={form.repo_url ?? ""}
            onChange={(e) => setForm({ ...form, repo_url: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Live URL</span>
          <input
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
            value={form.live_url ?? ""}
            onChange={(e) => setForm({ ...form, live_url: e.target.value })}
          />
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-sm">
          <span>Tags (comma separated)</span>
          <input
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
            value={(form.tags ?? []).join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                tags: e.target.value.split(",").map((t) => t.trim()),
              })
            }
          />
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-sm">
          <span>Cover image URL</span>
          <input
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
            value={form.cover_image ?? ""}
            onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
          />
        </label>
        <div className="md:col-span-2 flex justify-end gap-3">
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#020617] hover:bg-white/90 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save project"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Existing projects</h3>
        <ul className="space-y-2 text-sm text-white/80">
          {items.map((p) => (
            <li
              key={p.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <div>
                <p className="font-semibold text-white">{p.title}</p>
                <p className="text-xs text-white/60">/{p.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                className="self-start rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 hover:bg-white/10"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ProjectsManager;
