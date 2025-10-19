"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import supabase from "@/lib/supabase";

type Backlink = {
  id: string;
  source_url: string;
  domain: string | null;
  status: string | null;
  notes: string | null;
  created_at: string | null;
};

type BacklinkPayload = Omit<Backlink, "id" | "created_at"> & { id?: string };

const emptyBacklink: BacklinkPayload = {
  source_url: "",
  domain: "",
  status: "Pending",
  notes: "",
};

const statusOptions = ["Pending", "Confirmed", "Lost"];

function BacklinkManager() {
  const [backlinks, setBacklinks] = useState<Backlink[]>([]);
  const [form, setForm] = useState<BacklinkPayload>(emptyBacklink);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBacklinks = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from("backlinks")
      .select("id, source_url, domain, status, notes, created_at")
      .order("created_at", { ascending: false });
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setBacklinks((data ?? []) as Backlink[]);
    }
  }, []);

  useEffect(() => {
    fetchBacklinks();
  }, [fetchBacklinks]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.source_url.trim()) {
      setError("Source URL is required.");
      return;
    }
    setLoading(true);
    setError(null);
    let derivedDomain: string | null = form.domain?.trim() || "";
    if (!derivedDomain) {
      try {
        derivedDomain = new URL(form.source_url).hostname;
      } catch {
        derivedDomain = null;
      }
    }

    const payload = {
      source_url: form.source_url.trim(),
      domain: derivedDomain,
      status: form.status ?? "Pending",
      notes: form.notes?.trim() || null,
      id: editingId ?? undefined,
    };
    const { error: upsertError } = await supabase
      .from("backlinks")
      .upsert(payload);
    if (upsertError) {
      setError(upsertError.message);
    } else {
      setForm(emptyBacklink);
      setEditingId(null);
      fetchBacklinks();
    }
    setLoading(false);
  };

  const handleEdit = (backlink: Backlink) => {
    setEditingId(backlink.id);
    setForm({
      source_url: backlink.source_url,
      domain: backlink.domain ?? "",
      status: backlink.status ?? "Pending",
      notes: backlink.notes ?? "",
    });
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    const { error: deleteError } = await supabase
      .from("backlinks")
      .delete()
      .eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      fetchBacklinks();
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setForm(emptyBacklink);
    setEditingId(null);
    setError(null);
  };

  return (
    <section className="glass-panel p-6 space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Backlinks</h2>
        <p className="text-sm text-white/75">
          Track backlinks you’ve earned or are pursuing so you can measure SEO
          efforts alongside web vitals.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <label className="flex flex-col gap-2 text-sm md:col-span-2">
          <span>Source URL</span>
          <input
            required
            value={form.source_url}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, source_url: event.target.value }))
            }
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
            placeholder="https://example.com/your-article"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Domain</span>
          <input
            value={form.domain ?? ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, domain: event.target.value }))
            }
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
            placeholder="example.com"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Status</span>
          <select
            value={form.status ?? "Pending"}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, status: event.target.value }))
            }
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status} className="text-[#020617]">
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-sm">
          <span>Notes</span>
          <textarea
            value={form.notes ?? ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, notes: event.target.value }))
            }
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
            rows={3}
            placeholder="Campaign, anchor text, or follow-up reminders"
          />
        </label>
        <div className="md:col-span-2 flex flex-wrap justify-end gap-3">
          {error && <p className="text-sm text-red-300">{error}</p>}
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#020617] hover:bg-white/90 disabled:opacity-60"
            disabled={loading}
          >
            {editingId ? "Update backlink" : "Save backlink"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Backlink log</h3>
        <ul className="space-y-2 text-sm text-white/80">
          {backlinks.length === 0 ? (
            <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">
              No backlinks tracked yet. Add one to start measuring.
            </li>
          ) : (
            backlinks.map((backlink) => (
              <li
                key={backlink.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
              >
                <div className="space-y-1">
                  <a
                    href={backlink.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-white hover:text-white/80"
                  >
                    {backlink.domain ?? backlink.source_url}
                  </a>
                  <p className="text-xs text-white/60">
                    Status: {backlink.status ?? "Pending"}
                  </p>
                  {backlink.notes && (
                    <p className="text-xs text-white/60">{backlink.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(backlink)}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 hover:bg-white/10"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(backlink.id)}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 hover:bg-white/10"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

export default BacklinkManager;
