import Link from "next/link";

function AboutPage() {
  return (
    <main className="px-4 md:px-6 py-16 md:py-24">
      <section className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-3 text-center md:text-left">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
            About
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Crafting useful experiences end-to-end.
          </h1>
          <p className="text-sm md:text-base text-white/75 md:max-w-3xl">
            I’m Dawit Worku, a 4th year Software Engineering student at Adama
            Science and Technology University, full-stack developer, and Android
            engineer who loves building tools that feel fast, polished, and
            purposeful. From product discovery to final delivery, I work across
            the stack to ship features users love.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="glass-panel p-6 space-y-3">
            <h2 className="text-xl font-semibold">How I work</h2>
            <p className="text-sm text-white/75">
              I thrive in cross-functional teams where design, product, and
              engineering collaborate closely. I enjoy turning fuzzy
              requirements into actionable plans and validating ideas quickly.
            </p>
            <ul className="space-y-2 text-sm text-white/75">
              <li>• Rapid iteration with user feedback loops</li>
              <li>• Design system stewardship and code reviews</li>
              <li>• Metrics-driven delivery and documentation</li>
            </ul>
          </article>
          <article className="glass-panel p-6 space-y-3">
            <h2 className="text-xl font-semibold">Outside of code</h2>
            <p className="text-sm text-white/75">
              When I’m not shipping features, you’ll find me tinkering with
              indie Android apps, reading about AI ethics, or mentoring
              early-career engineers.
            </p>
            <p className="text-sm text-white/75">
              I’m also an avid learner who keeps a steady cadence of
              side-project experiments to explore new frameworks and techniques.
            </p>
          </article>
        </section>

        <section className="glass-panel p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-semibold">Recent highlights</h2>
          <ul className="space-y-3 text-sm text-white/80">
            <li>
              • Shipped a multi-tenant dashboard that reduced reporting time by
              60% for Gebeya teams.
            </li>
            <li>
              • Built an Android app with on-device ML that processes logistics
              data offline.
            </li>
            <li>
              • Led an AI support copilot prototype that handles 45% of inbound
              tickets autonomously.
            </li>
          </ul>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/contact"
              className="rounded-full bg-white px-4 py-2 font-semibold text-black hover:bg-white/90 transition"
            >
              Work together
            </Link>
            <Link
              href="/projects"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/80 hover:bg-white/15 transition"
            >
              View projects
            </Link>
            <Link
              href="https://github.com/dawaman43"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/80 hover:bg-white/15 transition"
            >
              Explore GitHub
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

export default AboutPage;
