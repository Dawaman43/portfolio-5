import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RepoList from "@/components/projects/RepoList";
import { caseStudies } from "@/lib/caseStudies";

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

type RepoLite = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at?: string;
};

async function getGithubRepos(): Promise<RepoLite[]> {
  try {
    const res = await fetch(
      "https://api.github.com/users/Dawaman43/repos?per_page=100&sort=updated",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
    const data = (await res.json()) as GithubApiRepo[];

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

export default async function ProjectsPage() {
  const githubRepos = await getGithubRepos();
  const featuredRepos = [...githubRepos]
    .filter((r) => r.stargazers_count > 0)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3);

  return (
    <main className="px-4 md:px-6 py-16 md:py-24">
      <section className="max-w-6xl mx-auto space-y-10">
        <header className="space-y-3 text-center md:text-left">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Projects
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Selected work
          </h1>
          <p className="text-sm md:text-base text-muted-foreground md:max-w-3xl">
            A snapshot of recent projects spanning full-stack web apps, native
            Android builds, and AI-driven workflows.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {caseStudies.map((project) => {
            const href = `/projects/${project.slug}`;
            return (
              <Card key={project.slug} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription>{project.summary}</CardDescription>
                  <p className="text-xs md:text-sm text-muted-foreground opacity-80">
                    {project.outcome}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {project.stack.slice(0, 6).map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-white/80"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button asChild variant="outline">
                      <Link href={href}>View case study</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {featuredRepos.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Open‑source highlights
              </h2>
              <a
                href="https://github.com/Dawaman43?tab=repositories"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View more on GitHub →
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {featuredRepos.map((repo) => (
                <Card
                  key={repo.id}
                  className="border-white/10 hover:border-white/20 transition"
                >
                  <CardContent className="p-6 md:p-7 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg md:text-xl font-semibold text-foreground break-words">
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
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {repo.description}
                      </p>
                    )}
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-white/70">
                      {(repo.topics ?? []).slice(0, 4).map((t) => (
                        <Badge
                          key={t}
                          variant="outline"
                          className="text-white/80"
                        >
                          {t}
                        </Badge>
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
                          View demo <span aria-hidden>→</span>
                        </a>
                      ) : null}
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-foreground hover:bg-white/15"
                      >
                        Source <span aria-hidden>→</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto mt-12 space-y-6">
        <RepoList repos={githubRepos} />
      </section>
    </main>
  );
}
