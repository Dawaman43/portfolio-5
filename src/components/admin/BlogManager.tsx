"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import MarkdownEditor from "./MarkdownEditor";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  created_at: string | null;
};

type BlogInsert = Omit<Blog, "id" | "created_at"> & { id?: string };

const emptyBlog: BlogInsert = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
};

function BlogManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [form, setForm] = useState<BlogInsert>(emptyBlog);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setBlogs(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error: insertError } = await supabase.from("blogs").upsert(form);
    if (insertError) {
      setError(insertError.message);
    } else {
      setForm(emptyBlog);
      fetchBlogs();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase
      .from("blogs")
      .delete()
      .eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      fetchBlogs();
    }
  };

  return (
    <section className="glass-panel p-6 space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Blogs</h2>
        <p className="text-sm text-white/75">
          Add, update, or remove blog posts. Use markdown in the content field
          for rich formatting.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <label className="flex flex-col gap-2 text-sm">
          <span>Title</span>
          <input
            required
            value={form.title ?? ""}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Slug (unique)</span>
          <input
            required
            value={form.slug ?? ""}
            onChange={(event) => setForm({ ...form, slug: event.target.value })}
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
          />
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-sm">
          <span>Excerpt</span>
          <textarea
            value={form.excerpt ?? ""}
            onChange={(event) =>
              setForm({ ...form, excerpt: event.target.value })
            }
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
            rows={3}
          />
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-sm">
          <span>Cover image URL</span>
          <input
            value={form.cover_image ?? ""}
            onChange={(event) =>
              setForm({ ...form, cover_image: event.target.value })
            }
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
          />
        </label>
        <div className="md:col-span-2 flex flex-col gap-2 text-sm">
          <span>Content (Markdown)</span>
          <MarkdownEditor
            value={form.content ?? ""}
            onChange={(content) => setForm({ ...form, content })}
            placeholder="Write your story..."
          />
        </div>
        <div className="md:col-span-2 flex justify-end gap-3">
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#020617] hover:bg-white/90 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save blog"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Existing posts</h3>
        <ul className="space-y-2 text-sm text-white/80">
          {blogs.map((blog) => (
            <li
              key={blog.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <div>
                <p className="font-semibold text-white">{blog.title}</p>
                <p className="text-xs text-white/60">/{blog.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(blog.id)}
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

export default BlogManager;
