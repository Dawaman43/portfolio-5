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

const liveMetrics = [
  {
    value: "12",
    suffix: "+",
    label: "Motion prototypes",
    description: "High-fidelity animation handoffs delivered in the past year.",
  },
  {
    value: "48",
    suffix: "ms",
    label: "Interaction latency",
    description: "Targeted response time across production experiences.",
  },
  {
    value: "3",
    suffix: "x",
    label: "Faster launches",
    description: "Acceleration founders see after integrating my workflows.",
  },
  {
    value: "98",
    suffix: "%",
    label: "Lighthouse score",
    description: "Performance, accessibility, and SEO kept in balance.",
  },
];

const processSteps = [
  {
    title: "Discover & Align",
    description:
      "We map the opportunity space fast with workshops, heuristics, and motion sketches to agree on north stars.",
    artifacts: ["Journey maps", "Motion studies"],
  },
  {
    title: "Prototype & Iterate",
    description:
      "Interactive prototypes and system spikes de-risk assumptions. Tooling ranges from GSAP to Compose previews.",
    artifacts: ["GSAP timelines", "Composable kits"],
  },
  {
    title: "Ship & Measure",
    description:
      "CI/CD, observability, and product analytics ensure every release is measurable and reversible when needed.",
    artifacts: ["Release playbooks", "Telemetry dashboards"],
  },
];

const labShowcase = [
  {
    title: "Generative color orchestrator",
    description:
      "Turns brand palettes into motion-ready token sets with automated contrast checks and live preview.",
    link: "https://github.com/dawaman43",
    status: "Prototype",
  },
  {
    title: "Edge-rendered markdown theatre",
    description:
      "Streams MDX to cinematic layouts with WASM typography shaping and animated annotations.",
    link: "https://github.com/dawaman43",
    status: "In progress",
  },
  {
    title: "Compose motion lab",
    description:
      "Compose multiplatform playground showcasing spring-driven micro interactions synced with web Framer exports.",
    link: "https://github.com/dawaman43",
    status: "Playground",
  },
];

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
    label: "Monochrome motion specialist",
    style: { top: "-1.8rem", left: "-1.4rem" },
    delayClass: "float-delay-1",
  },
  {
    label: "4th year Software Engineering @ ASTU",
    style: { bottom: "-2rem", left: "1rem" },
    delayClass: "float-delay-2",
  },
  {
    label: "Open to remote collaborations",
    style: { top: "42%", right: "-2.4rem" },
    delayClass: "float-delay-3",
  },
];

function Home() {
  const marqueeTools = [...coreTools, ...coreTools];

  return (
    <main className="bw-main px-4 md:px-6 space-y-16 md:space-y-20">
      <IntroOverlay />
      <ScrollRail />
      <HomeMotion />
      {/* Hero */}
      <section className="bw-hero relative max-w-6xl mx-auto pt-16 md:pt-28 pb-16 md:pb-24">
        <div className="bw-hero-bg" aria-hidden>
          <span className="bw-hero-grid" />
          <span className="bw-hero-stripe bw-hero-stripe--one" />
          <span className="bw-hero-stripe bw-hero-stripe--two" />
          <span className="bw-hero-ring" />
          <span className="bw-hero-noise" />
        </div>
        <div className="relative z-10 grid grid-cols-1 items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-12">
          <div className="space-y-6 md:space-y-8">
            <div className="bw-pill" data-hero-item>
              <span>Full-stack</span>
              <span>Android</span>
              <span>AI/ML</span>
            </div>
            <h1 className="bw-hero-title" data-hero-item>
              <span className="bw-hero-outline">Dawit Worku</span> crafts
              monochrome-first products with
              <span className="bw-hero-highlight">motion-led precision.</span>
            </h1>
            <p className="bw-hero-subtitle" data-hero-item>
              I deliver intentionally minimal interfaces that move—shipping fast
              web experiences, Android apps, and AI-infused workflows for teams
              that care about polish, accessibility, and measurable impact.
            </p>
            <div className="bw-hero-links" data-hero-item>
              <Button asChild>
                <Link href="/projects">View Projects</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="mailto:dawitworkujima@gmail.com">
                  Let&apos;s talk
                </Link>
              </Button>
            </div>
            <div className="bw-hero-meta" data-hero-item>
              <div className="bw-hero-stats">
                <div className="bw-hero-stat">
                  <span className="bw-hero-stat__number">5+</span>
                  <span className="bw-hero-stat__label">yrs exp</span>
                </div>
                <div className="bw-hero-stat">
                  <span className="bw-hero-stat__number">20+</span>
                  <span className="bw-hero-stat__label">projects</span>
                </div>
                <div className="bw-hero-stat">
                  <span className="bw-hero-stat__number">4</span>
                  <span className="bw-hero-stat__label">domains</span>
                </div>
              </div>
              <div className="bw-hero-social">
                <a
                  aria-label="GitHub"
                  href="https://github.com/dawaman43"
                  target="_blank"
                  rel="noreferrer"
                  className="bw-hero-social__link"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.35-1.77-1.35-1.77-1.1-.75.09-.74.09-.74 1.22.09 1.86 1.25 1.86 1.25 1.08 1.86 2.84 1.32 3.53 1.01.11-.78.42-1.32.77-1.63-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 12 .5Z" />
                  </svg>
                </a>
                <a
                  aria-label="LinkedIn"
                  href="https://linkedin.com/in/dawit-worku"
                  target="_blank"
                  rel="noreferrer"
                  className="bw-hero-social__link"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.45 20.45h-3.55v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.86v5.49H9.47V9h3.41v1.56h.05c.47-.89 1.6-1.82 3.3-1.82 3.53 0 4.18 2.32 4.18 5.33v6.38ZM5.34 7.42a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.13 20.45H3.55V9h3.58v11.45Z" />
                  </svg>
                </a>
                <a
                  aria-label="X (Twitter)"
                  href="https://x.com/dawit_codes"
                  target="_blank"
                  rel="noreferrer"
                  className="bw-hero-social__link"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2H21l-6.452 7.38L22 22h-6.828l-4.64-6.07L5.12 22H2.36l6.903-7.907L2 2h6.984l4.2 5.59L18.244 2Zm-1.195 18h1.987L7.03 4h-2L17.05 20Z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="bw-hero-facts" data-hero-item>
              {heroFacts.map((fact) => (
                <div key={fact.label} className="bw-hero-fact">
                  <p className="bw-hero-fact__label">{fact.label}</p>
                  <p className="bw-hero-fact__value">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bw-portrait-wrapper" data-hero-media>
            <div className="bw-portrait">
              <Image
                src="/profile.jpg"
                alt="Portrait of Dawit Worku"
                fill
                priority
                sizes="(max-width: 768px) 16rem, (max-width: 1024px) 20rem, 24rem"
                className="bw-portrait__image"
              />
              <span className="bw-portrait__glare" aria-hidden />
              <span className="bw-portrait__border" aria-hidden />
            </div>
            <span
              className="bw-portrait-orbit bw-portrait-orbit--outer"
              aria-hidden
            />
            <span
              className="bw-portrait-orbit bw-portrait-orbit--inner"
              aria-hidden
            />
            <span className="bw-portrait-orbit__node" aria-hidden />
            <span className="bw-portrait-shadow" aria-hidden />
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
      </section>

      <section
        className="bw-marquee-shell max-w-6xl mx-auto"
        data-section-reveal
      >
        <div className="bw-marquee" data-reveal-child>
          <div className="bw-marquee__inner" aria-hidden>
            {marqueeTools.map((tool, index) => (
              <span key={`${tool}-${index}`} className="bw-marquee__item">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bw-metrics max-w-6xl mx-auto" data-section-reveal>
        <div className="bw-section-heading" data-reveal-child>
          <div>
            <p className="bw-section-label">Pulse</p>
            <h2 className="bw-heading">Operational snapshot</h2>
          </div>
          <span className="bw-section-caption">
            Tracking velocity • Clarity • Motion
          </span>
        </div>
        <div className="bw-metrics__grid">
          {liveMetrics.map((metric) => (
            <div key={metric.label} className="bw-metric" data-reveal-child>
              <span className="bw-metric__glow" aria-hidden />
              <div className="bw-metric__value">
                {metric.value}
                <span>{metric.suffix}</span>
              </div>
              <p className="bw-metric__label">{metric.label}</p>
              <p className="bw-metric__description">{metric.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Focus */}
      <section className="max-w-6xl mx-auto pb-16 md:pb-20" data-section-reveal>
        <div className="bw-section-heading" data-reveal-child>
          <div>
            <p className="bw-section-label">Focus</p>
            <h2 className="bw-heading">What I focus on</h2>
          </div>
          <span className="bw-section-caption">
            Craft • Reliability • Learning
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {focusHighlights.map((item) => (
            <Card key={item.title} className="bw-card" data-reveal-child>
              <CardHeader className="space-y-4">
                <CardTitle className="bw-card__title">{item.title}</CardTitle>
                <CardDescription className="bw-card__description">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="bw-card__content">
                <ul className="bw-list">
                  {item.bullets.map((point) => (
                    <li key={point} className="bw-list__item">
                      <span className="bw-list__dot" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        className="bw-process max-w-6xl mx-auto pb-16 md:pb-20"
        data-section-reveal
      >
        <div className="bw-section-heading" data-reveal-child>
          <div>
            <p className="bw-section-label">Approach</p>
            <h2 className="bw-heading">How collaborations move</h2>
          </div>
          <span className="bw-section-caption">
            Strategy • Motion • Measurement
          </span>
        </div>
        <div className="bw-process__inner">
          <div className="bw-process__line" aria-hidden />
          {processSteps.map((step, index) => (
            <article
              key={step.title}
              className="bw-process__step"
              data-reveal-child
            >
              <div className="bw-process__index">0{index + 1}</div>
              <div className="bw-process__body">
                <h3 className="bw-process__title">{step.title}</h3>
                <p className="bw-process__description">{step.description}</p>
                <ul className="bw-process__artifacts">
                  {step.artifacts.map((artifact) => (
                    <li key={artifact}>{artifact}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section
        id="projects"
        className="max-w-6xl mx-auto pb-16 md:pb-20"
        data-section-reveal
      >
        <div
          className="bw-section-heading bw-section-heading--row"
          data-reveal-child
        >
          <h2 className="bw-heading">Featured work</h2>
          <Link href="/projects" className="bw-ghost-link">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {featuredProjects.map((project) => (
            <TiltCard key={project.title} className="bw-tilt" data-reveal-child>
              <div className="bw-tilt__body">
                <h3 className="bw-tilt__title">{project.title}</h3>
                <p className="bw-tilt__summary">{project.summary}</p>
              </div>
              <div className="bw-tilt__tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="bw-tilt__tag">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={project.href}
                className="bw-ghost-link bw-ghost-link--accent"
              >
                Case study
                <span aria-hidden>→</span>
              </Link>
            </TiltCard>
          ))}
        </div>
      </section>

      <section
        className="bw-lab max-w-6xl mx-auto pb-16 md:pb-20"
        data-section-reveal
      >
        <div
          className="bw-section-heading bw-section-heading--row"
          data-reveal-child
        >
          <div>
            <p className="bw-section-label">Lab</p>
            <h2 className="bw-heading">Latest experiments</h2>
          </div>
          <span className="bw-section-caption">
            Prototypes • Tooling • Play
          </span>
        </div>
        <div className="bw-lab__grid">
          {labShowcase.map((item) => (
            <article
              key={item.title}
              className="bw-lab__item"
              data-reveal-child
            >
              <span className="bw-lab__badge">{item.status}</span>
              <h3 className="bw-lab__title">{item.title}</h3>
              <p className="bw-lab__description">{item.description}</p>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="bw-ghost-link bw-ghost-link--accent"
              >
                View repo
                <span aria-hidden>{"->"}</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section
        id="experience"
        className="max-w-6xl mx-auto pb-16 md:pb-20"
        data-section-reveal
      >
        <h2 className="bw-heading mb-6" data-reveal-child>
          Experience &amp; Impact
        </h2>
        <div className="bw-timeline">
          {experienceTimeline.map((item) => (
            <article
              key={`${item.role}-${item.company}`}
              className="bw-timeline__item"
              data-reveal-child
            >
              <span className="bw-timeline__dot" aria-hidden />
              <div className="bw-timeline__top">
                <div>
                  <h3 className="bw-timeline__role">{item.role}</h3>
                  <p className="bw-timeline__company">{item.company}</p>
                </div>
                <span className="bw-timeline__period">{item.period}</span>
              </div>
              <ul className="bw-timeline__list">
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Tools & Learning */}
      <section className="max-w-6xl mx-auto pb-16 md:pb-20" data-section-reveal>
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bw-panel" data-reveal-child>
            <h2 className="bw-panel__title">Daily toolkit</h2>
            <p className="bw-panel__subtitle">
              Technologies I lean on every day to keep products shipping quickly
              and safely.
            </p>
            <ul className="bw-chip-row">
              {coreTools.map((tool) => (
                <li key={tool} className="bw-chip-row__item">
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          <div className="bw-panel" data-reveal-child>
            <h2 className="bw-panel__title">Currently exploring</h2>
            <p className="bw-panel__subtitle">
              Always experimenting with what&apos;s next in product engineering
              and AI.
            </p>
            <ul className="bw-stack-list">
              {exploringNow.map((topic) => (
                <li key={topic} className="bw-stack-list__item">
                  <span className="bw-stack-list__dot" />
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
        <div className="bw-contact" data-reveal-child>
          <div>
            <h2 className="bw-contact__title">
              Let&apos;s build what&apos;s next
            </h2>
            <p className="bw-contact__subtitle">
              Open to collaborations, advisory roles, and full-time
              opportunities where craft and motion matter.
            </p>
          </div>
          <Link
            href="mailto:dawitworkujima@gmail.com"
            className="bw-contact__cta"
          >
            Email me
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
