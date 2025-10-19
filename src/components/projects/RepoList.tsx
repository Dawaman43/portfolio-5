"use client";

import { useMemo, useState } from "react";

export type GithubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  updated_at?: string;
};

function langColor(lang: string | null | undefined) {
  const key = (lang ?? "").toLowerCase();
  const map: Record<string, string> = {
    typescript: "#3178c6",
    javascript: "#f1e05a",
    python: "#3572A5",
    kotlin: "#A97BFF",
    java: "#b07219",
    go: "#00ADD8",
    rust: "#DEA584",
    dart: "#00B4AB",
    php: "#4F5D95",
    c: "#555555",
    "c++": "#f34b7d",
    csharp: "#178600",
    shell: "#89e051",
    html: "#e34c26",
    css: "#563d7c",
  };
  return map[key] ?? "#93c5fd";
}

export default function RepoList({ repos }: { repos: GithubRepo[] }) {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<string>("all");

  // Ensure excluded repos never appear even if upstream changes
  const sourceRepos = useMemo(() => {
    const exclude = new Set(["bingo_w", "e-commerce"]);
    return repos.filter((r) => !exclude.has((r.name ?? "").toLowerCase()));
  }, [repos]);

  const languages = useMemo(() => {
    const set = new Set<string>();
    sourceRepos.forEach((r) => r.language && set.add(r.language));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [sourceRepos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sourceRepos.filter((r) => {
      const matchQ = !q
        ? true
        : r.name.toLowerCase().includes(q) ||
          (r.description ?? "").toLowerCase().includes(q) ||
          (r.topics ?? []).some((t) => t.toLowerCase().includes(q));
      const matchLang =
        lang === "all" ||
        (r.language ?? "").toLowerCase() === lang.toLowerCase();
      return matchQ && matchLang;
    });
  }, [sourceRepos, query, lang]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <h2 className="text-2xl md:text-3xl font-extrabold">
          Open‑source on GitHub
        </h2>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search repositories…"
            className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50"
          />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="rounded-lg border border-white/20 bg-white/10 backdrop-blur px-3 py-2 text-sm text-white/95 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-white/70">
          No repositories match your search.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {filtered.map((repo) => {
              const color = langColor(repo.language);
              return (
                <div
                  key={repo.id}
                  className="group glass-panel p-5 md:p-6 border border-white/10 hover:border-white/20 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg md:text-xl font-semibold text-white break-words">
                      {repo.name}
                    </h3>
                    <span
                      className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/80"
                      title="Stars"
                    >
                      ★ {repo.stargazers_count}
                    </span>
                  </div>
                  {repo.description && (
                    <p className="mt-2 text-sm text-white/75 leading-relaxed line-clamp-3">
                      {repo.description}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    {repo.language && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/80">
                        <span
                          aria-hidden
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {repo.language}
                      </span>
                    )}
                    {(repo.topics ?? []).slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-white/50">
                    Updated{" "}
                    {repo.updated_at
                      ? new Date(repo.updated_at).toLocaleDateString()
                      : ""}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {repo.homepage ? (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-white text-[#020617] px-4 py-1.5 text-sm font-semibold hover:bg-white/90"
                      >
                        View demo
                        <span aria-hidden>↗</span>
                      </a>
                    ) : null}
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 hover:bg-white/15"
                    >
                      Source
                      <span aria-hidden>↗</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-2 flex justify-center">
            <a
              href="https://github.com/Dawaman43?tab=repositories"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm text-white/90 hover:bg-white/15"
            >
              View more on GitHub
              <span aria-hidden>↗</span>
            </a>
          </div>
        </>
      )}
    </section>
  );
}
