import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CSSProperties } from "react";
import IntroOverlay from "@/components/ui/IntroOverlay";
import TiltCard from "@/components/ui/TiltCard";
import ScrollRail from "@/components/ui/ScrollRail";
import HomeMotion from "@/components/home/HomeMotion";

const focusHighlights = [
  {
    title: "Full‑Stack Product Craft",
    description:
      "Design systems, DX tooling, and resilient APIs. I care about clarity, performance, and long-term maintainability.",
    bullets: ["Next.js / React 19", "Node, Edge runtimes", "CI/CD, testing"],
  },
  {
    title: "Android Experiences",
    description:
      "Native apps with Kotlin, Jetpack Compose, and on-device ML integrations that feel fluid and dependable.",
    bullets: [
      "Jetpack Compose UIs",
      "KMP, Room, Coroutines",
      "Play Store delivery",
    ],
  },
  {
    title: "Intelligent Features",
    description:
      "Ship AI/ML features responsibly—from prototyping with Python to deploying inference-ready services.",
    bullets: ["PyTorch / TensorFlow", "LangChain, OpenAI", "Model monitoring"],
  },
];

const featuredProjects = [
  {
    title: "Gebeya Go",
    summary:
      "Marketplace for digital talents with role-based dashboards, real-time messaging, and analytics insights.",
    href: "/projects/gebeya-go",
    tags: ["Next.js", "Turbopack", "Prisma", "PostgreSQL"],
  },
  {
    title: "Atlas Android",
    summary:
      "Offline-first Android app with Compose, synchronized Firestore data, and ML-powered content recommendations.",
    href: "/projects/atlas-android",
    tags: ["Kotlin", "Compose", "Firebase", "ML Kit"],
  },
  {
    title: "AI Support Copilot",
    summary:
      "Fine-tuned LLM assistant automating tier-one support with vector search, guardrails, and human handoff.",
    href: "/projects/ai-support-copilot",
    tags: ["Python", "LangChain", "OpenAI", "Redis"],
  },
];

const experienceTimeline = [
  {
    role: "Software Engineering Student • 4th Year",
    company: "Adama Science and Technology University",
    period: "2022 — Present",
    details: [
      "Balancing a full course load while prototyping real-world products for the campus community.",
      "Led a multidisciplinary capstone team delivering a data-driven student services platform.",
      "Organized peer workshops mentoring 40+ developers on modern web and AI tooling.",
    ],
  },
  {
    role: "Freelance Product Engineer",
    company: "Remote Collaborations",
    period: "2020 — Present",
    details: [
      "Ship MVPs for founders in hiring, logistics, and edtech with rapid iteration cycles.",
      "Integrate AI-assisted features such as semantic search and support copilots across stacks.",
      "Partner with designers and stakeholders to align product strategy with measurable impact.",
    ],
  },
];

const coreTools = [
  "TypeScript",
  "React 19",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "Kotlin",
  "Jetpack Compose",
  "TensorFlow",
  "PyTorch",
  "LangChain",
  "OpenAI API",
];

const exploringNow = ["Realtime AI", "Edge functions", "Vision transformers"];

const heroFacts = [
  {
    label: "Based in",
    value: "Adama, Ethiopia • Remote-friendly",
  },
  {
    label: "Studying",
    value: "4th year Software Engineering @ ASTU",
  },
  {
    label: "Currently shipping",
    value: "Gebeya Go talent marketplace",
  },
];

const heroBadges: {
  label: string;
  style: CSSProperties;
  delayClass: string;
}[] = [
  {
    label: "Currently shipping: Gebeya Go",
    style: { top: "-2.5rem", left: "-2.5rem" },
    delayClass: "float-delay-1",
  },
  {
    label: "4th year Software Engineering student",
    style: { bottom: "-2.6rem", left: "-0.5rem" },
    delayClass: "float-delay-2",
  },
  {
    label: "Open to remote roles",
    style: { top: "38%", right: "-2.6rem" },
    delayClass: "float-delay-3",
  },
];

function Home() {
  return (
    <main className="px-4 md:px-6 space-y-16 md:space-y-20">
      <IntroOverlay />
      <ScrollRail />
      <HomeMotion />
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto pt-16 md:pt-28 pb-16 md:pb-24">
        <div
          className="hero-aurora hero-aurora--violet -left-28 -top-28"
          aria-hidden
        />
        <div
          className="hero-aurora hero-aurora--pink -right-12 bottom-0"
          aria-hidden
        />
        <div className="relative grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] items-center gap-8 md:gap-12">
          {/* Text */}
          <div className="text-center md:text-left overflow-visible">
            <div
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md"
              data-hero-item
            >
              <span className="text-xs text-white/75">
                Full‑Stack • Android • AI/ML
              </span>
            </div>
            <h1
              className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight"
              data-hero-item
            >
              Dawit Worku
            </h1>
            {/* Role ticker */}
            <div
              className="mt-2 h-6 md:h-7 relative overflow-hidden"
              data-hero-item
            >
              <div className="absolute inset-0 [mask-image:linear-gradient(black,black)] animate-[ticker_9s_ease-in-out_infinite] will-change-transform">
                <div className="flex flex-col gap-0 text-sm md:text-base text-white/80">
                  <span>Full‑Stack Developer</span>
                  <span>Android Engineer</span>
                  <span>AI/ML Enthusiast</span>
                </div>
              </div>
            </div>
            <p
              className="mt-4 md:mt-6 text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto md:mx-0"
              data-hero-item
            >
              I design and build across web, Android, and AI/ML—shipping
              polished UIs, reliable APIs, and intelligent features with
              measurable impact.
            </p>
            <div
              className="mt-8 flex items-center justify-center md:justify-start gap-3 md:gap-4"
              data-hero-item
            >
              <Button asChild>
                <Link href="/projects">View Projects</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="mailto:dawitworkujima@gmail.com">
                  Let&#39;s talk
                </Link>
              </Button>
            </div>
            {/* Stats + Social */}
            <div
              className="mt-6 md:mt-8 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6"
              data-hero-item
            >
              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-white/80 text-sm md:text-base">
                <div>
                  <span className="text-white font-bold">5+</span> yrs exp
                </div>
                <div>
                  <span className="text-white font-bold">20+</span> projects
                </div>
                <div>
                  <span className="text-white font-bold">4</span> domains
                </div>
              </div>
              <div className="flex items-center gap-3 opacity-90">
                <a
                  aria-label="GitHub"
                  href="https://github.com/dawaman43"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-100"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="opacity-80"
                  >
                    <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.35-1.77-1.35-1.77-1.1-.75.09-.74.09-.74 1.22.09 1.86 1.25 1.86 1.25 1.08 1.86 2.84 1.32 3.53 1.01.11-.78.42-1.32.77-1.63-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 12 .5Z" />
                  </svg>
                </a>
                <a
                  aria-label="LinkedIn"
                  href="https://linkedin.com/in/dawit-worku"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-100"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="opacity-80"
                  >
                    <path d="M20.45 20.45h-3.55v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.86v5.49H9.47V9h3.41v1.56h.05c.47-.89 1.6-1.82 3.3-1.82 3.53 0 4.18 2.32 4.18 5.33v6.38ZM5.34 7.42a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.13 20.45H3.55V9h3.58v11.45Z" />
                  </svg>
                </a>
                <a
                  aria-label="X (Twitter)"
                  href="https://x.com/dawit_codes"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-100"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="opacity-80"
                  >
                    <path d="M18.244 2H21l-6.452 7.38L22 22h-6.828l-4.64-6.07L5.12 22H2.36l6.903-7.907L2 2h6.984l4.2 5.59L18.244 2Zm-1.195 18h1.987L7.03 4h-2L17.05 20Z" />
                  </svg>
                </a>
              </div>
            </div>

            <div
              className="mt-8 glass-panel px-5 py-4 md:px-6 md:py-5 text-left"
              data-hero-item
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {heroFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="space-y-1 text-sm md:text-base"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                      {fact.label}
                    </p>
                    <p className="text-white/80">{fact.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Photo */}
          <div
            className="flex justify-center md:justify-end overflow-visible"
            data-hero-media
          >
            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-3xl overflow-hidden glass-panel float-slow">
              <Image
                src="/profile.jpg"
                alt="Portrait of Dawit Worku"
                fill
                priority
                sizes="(max-width: 768px) 12rem, (max-width: 1024px) 16rem, 18rem"
                className="object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 35%)",
                  mixBlendMode: "soft-light",
                }}
              />
              {heroBadges.map((badge) => (
                <span
                  key={badge.label}
                  className={`hero-badge hidden md:inline-flex float-slow ${badge.delayClass}`}
                  style={badge.style}
                  data-hero-badge
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Focus */}
      <section className="max-w-6xl mx-auto pb-16 md:pb-20" data-section-reveal>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold">
            What I focus on
          </h2>
          <span className="text-xs uppercase tracking-[0.3em] text-white/60 md:text-right">
            Craft • Reliability • Learning
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {focusHighlights.map((item) => (
            <Card key={item.title} data-reveal-child>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mt-1 space-y-2 text-sm text-white/70">
                  {item.bullets.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/60" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section
        id="projects"
        className="max-w-6xl mx-auto pb-16 md:pb-20"
        data-section-reveal
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold">Featured work</h2>
          <Link
            href="/projects"
            className="text-white/75 hover:text-white transition"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredProjects.map((project) => (
            <TiltCard
              key={project.title}
              className="glass-panel p-6 flex flex-col justify-between will-change-transform"
              data-reveal-child
            >
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm md:text-base text-white/75 leading-relaxed">
                  {project.summary}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/70">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/20 px-3 py-1 bg-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={project.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition"
              >
                Case study
                <span aria-hidden>→</span>
              </Link>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section
        id="experience"
        className="max-w-6xl mx-auto pb-16 md:pb-20"
        data-section-reveal
      >
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">
          Experience & Impact
        </h2>
        <div className="space-y-6 border-l border-white/15 pl-6">
          {experienceTimeline.map((item) => (
            <article
              key={`${item.role}-${item.company}`}
              className="relative"
              data-reveal-child
            >
              <span className="absolute -left-8 top-1.5 h-3 w-3 rounded-full bg-white" />
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-white">
                    {item.role}
                  </h3>
                  <p className="text-sm md:text-base text-white/70">
                    {item.company}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-widest text-white/60">
                  {item.period}
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-white/70 leading-relaxed">
                {item.details.map((detail) => (
                  <li key={detail} className="flex gap-2">
                    <span className="mt-2 h-1 w-4 rounded-sm bg-white/40" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Tools & Learning */}
      <section className="max-w-6xl mx-auto pb-16 md:pb-20" data-section-reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 md:gap-8">
          <div className="glass-panel p-6" data-reveal-child>
            <h2 className="text-xl md:text-2xl font-semibold">Daily toolkit</h2>
            <p className="mt-2 text-sm md:text-base text-white/75">
              Technologies I use every day to keep products shipping quickly and
              safely.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2 text-sm text-white/80">
              {coreTools.map((tool) => (
                <li
                  key={tool}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel p-6" data-reveal-child>
            <h2 className="text-xl md:text-2xl font-semibold">
              Currently exploring
            </h2>
            <p className="mt-2 text-sm md:text-base text-white/75">
              Always experimenting with what’s next in product engineering and
              AI.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {exploringNow.map((topic) => (
                <li key={topic} className="flex items-center gap-3">
                  <span className="inline-flex h-2 w-2 rounded-full bg-white/70" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section
        id="contact"
        className="max-w-5xl mx-auto pb-20"
        data-section-reveal
      >
        <div
          className="glass-panel p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          data-reveal-child
        >
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold">
              Let’s build what’s next
            </h2>
            <p className="mt-2 text-sm md:text-base text-white/75">
              Open to collaborations, advisory roles, and full-time
              opportunities where craft and impact matter.
            </p>
          </div>
          <Link
            href="mailto:your@email"
            className="rounded-full px-5 md:px-6 py-2.5 md:py-3 bg-white text-black font-semibold shadow hover:bg-white/90 transition"
          >
            Email me
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
