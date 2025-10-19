export type CaseStudyMetric = {
  label: string;
  value: string;
  description?: string;
};

export type CaseStudyHighlight = {
  title: string;
  description: string;
};

export type CaseStudyTimelineEntry = {
  phase: string;
  outcome: string;
};

export type CaseStudyLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type CaseStudy = {
  slug: string;
  title: string;
  eyebrow: string;
  tagline: string;
  summary: string;
  problem: string;
  approach: string;
  outcome: string;
  stack: string[];
  metrics: CaseStudyMetric[];
  highlights: CaseStudyHighlight[];
  timeline: CaseStudyTimelineEntry[];
  links: CaseStudyLink[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "gebeya-go",
    title: "Gebeya Go",
    eyebrow: "Talent marketplace",
    tagline: "Matching African builders with global opportunities.",
    summary:
      "Gebeya Go brings mentors, talents, and hiring teams into a single pane of glass with real-time messaging, analytics-rich dashboards, and automated billing flows.",
    problem:
      "Hiring teams struggled to track candidate readiness across markets, while talents needed clear visibility into learning paths, mentorship, and project assignments.",
    approach:
      "We shipped a role-based workspace on Next.js 15 and Supabase—leveraging SSR for fast dashboard loads, background queues for matching, and a shared design system for web and Android parity.",
    outcome:
      "The marketplace grew to 50k+ active members with sub-second dashboard loads, supporting weekly talent placements and automated invoicing across four countries.",
    stack: [
      "Next.js 15",
      "React 19",
      "Supabase",
      "Prisma",
      "PostgreSQL",
      "Tailwind 4",
      "Supabase Edge Functions",
    ],
    metrics: [
      {
        label: "Active users",
        value: "50k+",
        description: "Talent + hiring teams onboarded across four regions.",
      },
      {
        label: "Dashboard load",
        value: "<800ms",
        description:
          "Median page load after ISR caching and analytics hydration.",
      },
      {
        label: "Placement growth",
        value: "3.2x",
        description: "Increase in successful matches quarter over quarter.",
      },
    ],
    highlights: [
      {
        title: "Role-based dashboards",
        description:
          "Custom home surfaces for talents, mentors, and hiring partners with tailored KPIs and tasks.",
      },
      {
        title: "Realtime messaging",
        description:
          "Supabase channels back a Slack-like inbox with read receipts, message history, and moderator tooling.",
      },
      {
        title: "Automated billing",
        description:
          "Integrated payment flows reconcile payouts and receivables per partner contract with analytics export.",
      },
    ],
    timeline: [
      {
        phase: "Discovery & Research",
        outcome:
          "Interviewed hiring partners and mapped the onboarding gaps leading to a unified talent journey.",
      },
      {
        phase: "MVP Release",
        outcome:
          "Launched dashboards + messaging in 8 weeks with incremental Supabase migrations.",
      },
      {
        phase: "Scale",
        outcome:
          "Added analytics, billing, and self-serve onboarding while maintaining <1s perceived load times.",
      },
    ],
    links: [
      {
        label: "View code",
        href: "https://github.com/Dawaman43/gebeya-go",
        external: true,
      },
      {
        label: "Request a demo",
        href: "mailto:dawitworkujima@gmail.com?subject=Gebeya%20Go%20demo",
      },
    ],
  },
  {
    slug: "atlas-android",
    title: "Atlas Android",
    eyebrow: "Offline-first learning",
    tagline:
      "A Kotlin-first learning companion that works even without network.",
    summary:
      "Atlas powers content discovery, quizzes, and mentorship chat for remote learners with unreliable connectivity.",
    problem:
      "Learners in low-connectivity areas needed frictionless access to content and study plans without depending on a stable connection.",
    approach:
      "Built with Jetpack Compose, Room, and WorkManager to keep content synced in the background and surface ML-driven recommendations.",
    outcome:
      "Daily active usage increased 62% and support tickets dropped 40% after go-live thanks to predictable sync and clear progress cues.",
    stack: [
      "Kotlin",
      "Jetpack Compose",
      "Room",
      "WorkManager",
      "Firebase",
      "TensorFlow Lite",
    ],
    metrics: [
      {
        label: "Active learners",
        value: "12k",
        description:
          "Students across 3 time zones using offline-first mode weekly.",
      },
      {
        label: "Sync success",
        value: ">99%",
        description:
          "Background sync completion thanks to WorkManager + conflict resolution.",
      },
      {
        label: "DAU growth",
        value: "62%",
        description:
          "Increase in repeat usage within the first two release cycles.",
      },
    ],
    highlights: [
      {
        title: "Smart offline cache",
        description:
          "Prioritises syllabus-aligned modules and queues uploads during connectivity windows.",
      },
      {
        title: "ML recommendations",
        description:
          "On-device TensorFlow Lite model suggests revision paths and mentor prompts.",
      },
      {
        title: "Compose-first UI",
        description:
          "Adaptive layouts with smooth transitions across phone and tablet breakpoints.",
      },
    ],
    timeline: [
      {
        phase: "Product framing",
        outcome:
          "Shadowed learners and mapped drop-off moments caused by unreliable network conditions.",
      },
      {
        phase: "Pilot launch",
        outcome:
          "Released to 500 testers with feature flags controlling offline scope per cohort.",
      },
      {
        phase: "General availability",
        outcome:
          "Rolled out analytics, mentor chat, and ML recommendation loops.",
      },
    ],
    links: [
      {
        label: "View code",
        href: "https://github.com/Dawaman43/Atlas-android",
        external: true,
      },
    ],
  },
  {
    slug: "ai-support-copilot",
    title: "AI Support Copilot",
    eyebrow: "Customer support automation",
    tagline:
      "Fine-tuned LLM copilots that resolve tier-one tickets in seconds.",
    summary:
      "The AI Support Copilot blends vector search, guardrails, and human handoff to automate repetitive support flows while keeping humans in control.",
    problem:
      "Support teams spent 40% of their time triaging repetitive questions with inconsistent tone and slow resolution times.",
    approach:
      "Fine-tuned an open-weight LLM with retrieval-augmented generation, moderation layers, and analytics that surface automation opportunities.",
    outcome:
      "Tier-one resolution time dropped to 38 seconds on average, and teams reclaimed two workdays per agent each month.",
    stack: [
      "Python",
      "FastAPI",
      "LangChain",
      "OpenAI",
      "Redis",
      "Supabase Vector",
    ],
    metrics: [
      {
        label: "Resolution time",
        value: "38s",
        description: "Average response for tier-one tickets after automation.",
      },
      {
        label: "Human handoff",
        value: "<12%",
        description:
          "Escalations thanks to guardrails and confidence thresholds.",
      },
      {
        label: "Agent hours saved",
        value: "+2 days",
        description: "Per agent per month reclaimed for deep work.",
      },
    ],
    highlights: [
      {
        title: "Retrieval-augmented responses",
        description:
          "Embeds knowledge base articles with Supabase Vector to ground every answer in quoted sources.",
      },
      {
        title: "Moderation guardrails",
        description:
          "Custom safety filters and confidence scoring prevent hallucinations and escalate seamlessly.",
      },
      {
        title: "Analytics loop",
        description:
          "Tracks automation coverage, CSAT, and suggestions for new scripted flows.",
      },
    ],
    timeline: [
      {
        phase: "Design sprint",
        outcome:
          "Mapped support journeys and identified high-volume intents for automation.",
      },
      {
        phase: "MVP + evals",
        outcome:
          "Ran offline evals across 2k historical tickets before enabling live traffic.",
      },
      {
        phase: "Production",
        outcome:
          "Shipped live evaluation metrics, feedback review tools, and handoff dashboard.",
      },
    ],
    links: [
      {
        label: "View code",
        href: "https://github.com/Dawaman43/ai-support-copilot",
        external: true,
      },
      {
        label: "See playbook",
        href: "https://github.com/Dawaman43/ai-support-copilot#readme",
        external: true,
      },
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((item) => item.slug === slug);
}
