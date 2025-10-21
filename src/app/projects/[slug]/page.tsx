import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { caseStudies, getCaseStudy } from "@/lib/caseStudies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getCaseStudy(slug);
  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: `${project.title} · Case Study`,
    description: project.summary,
    openGraph: {
      title: `${project.title} · Case Study`,
      description: project.summary,
      url: `https://dawit.work/projects/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} · Case Study`,
      description: project.summary,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getCaseStudy(slug);

  if (!project) notFound();

  return (
    <main className="px-4 md:px-6 py-16 md:py-24 space-y-16 md:space-y-20">
      <nav className="max-w-5xl mx-auto text-sm text-muted-foreground">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 hover:text-foreground transition"
        >
          ← Back to projects
        </Link>
      </nav>

      <header className="max-w-5xl mx-auto space-y-6">
        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          {project.eyebrow}
        </span>
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground">
            {project.title}
          </h1>
          <p className="text-lg md:text-xl text-foreground opacity-80">
            {project.tagline}
          </p>
        </div>
        <p className="max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed">
          {project.summary}
        </p>
        <div className="flex flex-wrap gap-3">
          {project.links.map((link) => (
            <Button key={link.href} asChild variant="outline">
              <Link
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
              >
                {link.label} {link.external ? <span aria-hidden>↗</span> : null}
              </Link>
            </Button>
          ))}
        </div>
      </header>

      <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-6 md:gap-10">
        <div className="glass-panel p-6 md:p-8 space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            Problem · Approach
          </h2>
          <div className="space-y-3">
            <h3 className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              The challenge
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {project.problem}
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              How we solved it
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {project.approach}
            </p>
          </div>
        </div>
        <aside className="glass-panel p-6 md:p-8 space-y-5">
          <h2 className="text-xl font-semibold text-foreground">Stack</h2>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            {project.stack.map((tool) => (
              <Badge key={tool} variant="outline" className="text-white/80">
                {tool}
              </Badge>
            ))}
          </div>
        </aside>
      </section>

      <section className="max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          Impact at a glance
        </h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="glass-panel p-6 space-y-2">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {metric.label}
              </span>
              <p className="text-3xl font-bold text-foreground">
                {metric.value}
              </p>
              {metric.description ? (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {metric.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto space-y-6">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          What made the difference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {project.highlights.map((highlight) => (
            <article
              key={highlight.title}
              className="glass-panel p-6 space-y-3"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {highlight.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {highlight.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto space-y-5">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          Delivery timeline
        </h2>
        <div className="space-y-5 border-l border-white/15 pl-6">
          {project.timeline.map((entry) => (
            <div key={entry.phase} className="relative">
              <span className="absolute -left-8 top-2 h-3 w-3 rounded-full bg-white/80" />
              <h3 className="text-base font-semibold text-foreground">
                {entry.phase}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {entry.outcome}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto glass-panel p-6 md:p-8 space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          Results
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          {project.outcome}
        </p>
        <div className="flex flex-wrap gap-3">
          {project.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-foreground hover:bg-white/15 transition"
            >
              {link.label}
              {link.external ? <span aria-hidden>↗</span> : null}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
