import Link from "next/link";
import RepoList, { type GithubRepo } from "@/components/projects/RepoList";

type GithubApiRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  updated_at?: string;
};

async function getGithubRepos(): Promise<GithubRepo[]> {
  try {
    const res = await fetch(
      "https://api.github.com/users/Dawaman43/repos?per_page=100&sort=updated",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
    const data = (await res.json()) as GithubApiRepo[];

    // Exclude specific repositories by name (case-insensitive)
    const exclude = new Set(["bingo_w", "e-commerce", "ecommerce-platform"]);
    const filtered = Array.isArray(data)
      ? data.filter((r) => !exclude.has((r.name ?? "").toLowerCase()))
      : [];

    return filtered.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      html_url: r.html_url,
      homepage: r.homepage,
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      topics: r.topics ?? [],
      updated_at: r.updated_at,
    }));
  } catch (error: unknown) {
    console.warn("Failed to load GitHub repos:", error);
    return [];
  }
}

const projects = [
  {
    title: "Gebeya Go",
    description:
      "Marketplace for digital talents with role-based dashboards, real-time messaging, and analytics insights.",
    impact:
      "Scaled to ~50k users with sub-second dashboard loads and integrated payment flows.",
    href: "/projects/gebeya-go",
    stack: ["Next.js", "Turbopack", "Prisma", "PostgreSQL"],
  },
];

async function ProjectsPage() {
  const githubRepos = await getGithubRepos();
  const featuredRepos = [...githubRepos]
    .filter((r) => r.stargazers_count > 0)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3);
  return (
    <main className="px-4 md:px-6 py-16 md:py-24">
      <section className="max-w-6xl mx-auto space-y-10">
        <header className="space-y-3 text-center md:text-left">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
            Projects
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold">Selected work</h1>
          <p className="text-sm md:text-base text-white/75 md:max-w-3xl">
            A snapshot of recent projects spanning full-stack web apps, native
            Android builds, and AI-driven workflows.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {projects.map((project) => {
            const isExternal = project.href.startsWith("http");
            return (
              <article
                key={project.title}
                className="glass-panel p-6 md:p-7 flex flex-col gap-4"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">
                    {project.title}
                  </h2>
                  <p className="text-sm md:text-base text-white/75 leading-relaxed">
                    {project.description}
                  </p>
                  <p className="text-xs md:text-sm text-white/60">
                    {project.impact}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-white/75">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/20 bg-white/5 px-3 py-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  href={project.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 self-start text-sm font-semibold text-white/80 hover:text-white transition"
                >
                  Explore project
                  <span aria-hidden>→</span>
                </Link>
              </article>
            );
          })}
        </div>

        {featuredRepos.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold">Open‑source highlights</h2>
              <a
                href="https://github.com/Dawaman43?tab=repositories"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-white/80 hover:text-white"
              >
                View more on GitHub ↗
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {featuredRepos.map((repo) => (
                <article
                  key={repo.id}
                  className="glass-panel p-6 md:p-7 flex flex-col gap-3 border border-white/10 hover:border-white/20 transition"
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
                    <p className="text-sm md:text-base text-white/75 leading-relaxed">
                      {repo.description}
                    </p>
                  )}
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-white/70">
                    {(repo.topics ?? []).slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/20 bg-white/5 px-3 py-1"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {repo.homepage ? (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-white text-[#020617] px-4 py-1.5 text-sm font-semibold hover:bg-white/90"
                      >
                        View demo <span aria-hidden>↗</span>
                      </a>
                    ) : null}
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 hover:bg-white/15"
                    >
                      Source <span aria-hidden>↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Open-source section */}
      <section className="max-w-6xl mx-auto mt-12 space-y-6">
        <RepoList repos={githubRepos} />
      </section>
    </main>
  );
}

export default ProjectsPage;
