"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabase";

type Skill = {
  id: string;
  name: string;
  category: string | null;
  proficiency: string | null;
  description: string | null;
  created_at: string | null;
};

type SkillPayload = Omit<Skill, "id" | "created_at">;

const emptySkill: SkillPayload = {
  name: "",
  category: "",
  proficiency: "",
  description: "",
};

function SkillManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState<SkillPayload>(emptySkill);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("skills")
      .select("*")
      .order("created_at", { ascending: false });
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setSkills((data ?? []) as Skill[]);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const categories = useMemo(() => {
    const values = new Set<string>();
    skills.forEach((skill) => {
      if (skill.category) {
        values.add(skill.category);
      }
    });
    const fromList = ["Frontend", "Backend", "Tools", "Soft Skills"];
    fromList.forEach((label) => values.add(label));
    return Array.from(values);
  }, [skills]);

  const handleChange = (
    key: keyof SkillPayload,
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const payload = editingId ? { ...form, id: editingId } : form;
    const { error: upsertError } = await supabase
      .from("skills")
      .upsert(payload);
    if (upsertError) {
      setError(upsertError.message);
    } else {
      setForm(emptySkill);
      setEditingId(null);
      fetchSkills();
    }
    setLoading(false);
  };

  const handleEdit = (skill: Skill) => {
    setForm({
      name: skill.name ?? "",
      category: skill.category ?? "",
      proficiency: skill.proficiency ?? "",
      description: skill.description ?? "",
    });
    setEditingId(skill.id);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    const { error: deleteError } = await supabase
      .from("skills")
      .delete()
      .eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      if (editingId === id) {
        setForm(emptySkill);
        setEditingId(null);
      }
      fetchSkills();
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setForm(emptySkill);
    setEditingId(null);
    setError(null);
  };

  return (
    <section className="glass-panel p-6 space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Skills</h2>
        <p className="text-sm text-white/75">
          Group your skills by category and set a proficiency level. These feed
          the toolkit section on the public site.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <label className="flex flex-col gap-2 text-sm">
          <span>Skill name</span>
          <input
            required
            value={form.name}
            onChange={(event) => handleChange("name", event)}
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Category</span>
          <select
            value={form.category ?? ""}
            onChange={(event) => handleChange("category", event)}
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
          >
            <option value="">Uncategorized</option>
            {categories.map((category) => (
              <option
                key={category}
                value={category}
                className="text-[#020617]"
              >
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Proficiency</span>
          <input
            value={form.proficiency ?? ""}
            placeholder="e.g. Expert, Intermediate"
            onChange={(event) => handleChange("proficiency", event)}
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
          />
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-sm">
          <span>Description</span>
          <textarea
            value={form.description ?? ""}
            onChange={(event) => handleChange("description", event)}
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
            rows={4}
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
            {editingId ? "Update skill" : "Save skill"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Current skills</h3>
        <ul className="space-y-2 text-sm text-white/80">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <div>
                <p className="font-semibold text-white">{skill.name}</p>
                <p className="text-xs text-white/60">
                  {(skill.category ?? "Uncategorized") +
                    (skill.proficiency ? ` • ${skill.proficiency}` : "")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(skill)}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 hover:bg-white/10"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(skill.id)}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 hover:bg-white/10"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default SkillManager;
