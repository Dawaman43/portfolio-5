import Link from "next/link";

const contacts = [
  {
    label: "Email",
    value: "dawitworkujima@gmail.com",
    href: "mailto:dawitworkujima@gmail.com",
  },
  {
    label: "GitHub",
    value: "github.com/dawaman43",
    href: "https://github.com/dawaman43",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/dawit-worku",
    href: "https://linkedin.com/in/dawit-worku",
  },
  {
    label: "X (Twitter)",
    value: "@dawit_codes",
    href: "https://x.com/dawit_codes",
  },
];

function ContactPage() {
  return (
    <main className="px-4 md:px-6 py-16 md:py-24">
      <section className="max-w-4xl mx-auto space-y-10">
        <header className="space-y-3 text-center md:text-left">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
            Contact
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Let’s collaborate
          </h1>
          <p className="text-sm md:text-base text-white/75 md:max-w-2xl">
            Drop a note and I’ll get back within 1–2 business days. I’m a 4th
            year Software Engineering student at Adama Science and Technology
            University, open to internships, freelancing, consulting, and
            full-time roles that blend web, Android, and AI/ML work.
          </p>
        </header>

        <section className="glass-panel p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-semibold">Direct contact</h2>
          <ul className="space-y-3 text-sm text-white/80">
            {contacts.map((item) => (
              <li
                key={item.label}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2"
              >
                <span className="uppercase tracking-widest text-xs text-white/60">
                  {item.label}
                </span>
                <Link
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="text-sm md:text-base font-semibold text-white hover:text-white/80 transition"
                >
                  {item.value}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass-panel p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-semibold">Project kickoff guide</h2>
          <p className="text-sm md:text-base text-white/75">
            When you reach out, it helps to include a quick overview of the
            problem, ideal timeline, and current stack. I’ll follow up with
            clarifying questions and a proposal for the next steps.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="mailto:dawitworkujima@gmail.com"
              className="rounded-full bg-white px-4 py-2 font-semibold text-black hover:bg-white/90 transition"
            >
              Email me directly
            </Link>
            <Link
              href="/projects"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/80 hover:bg-white/15 transition"
            >
              Browse past work
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

export default ContactPage;
