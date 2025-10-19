const certificates = [
  {
    title: "Google Professional Android Developer",
    issuer: "Google Developers",
    year: "2024",
    summary:
      "Validated expertise in building, testing, and publishing high-quality Android applications with modern architecture patterns.",
  },
  {
    title: "AWS Certified Developer – Associate",
    issuer: "Amazon Web Services",
    year: "2023",
    summary:
      "Demonstrated ability to design and maintain AWS-powered services with secure, scalable architectures.",
  },
  {
    title: "TensorFlow Developer Certificate",
    issuer: "Google",
    year: "2022",
    summary:
      "Proved proficiency in training, evaluating, and deploying ML models using TensorFlow for computer vision and NLP projects.",
  },
];

function CertificatesPage() {
  return (
    <main className="px-4 md:px-6 py-16 md:py-24">
      <section className="max-w-5xl mx-auto space-y-10">
        <header className="space-y-3 text-center md:text-left">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
            Certificates
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Continuing education
          </h1>
          <p className="text-sm md:text-base text-white/75 md:max-w-3xl">
            I invest in structured learning to stay sharp across full-stack
            development, Android engineering, and applied AI.
          </p>
        </header>

        <div className="space-y-4">
          {certificates.map((certificate) => (
            <article key={certificate.title} className="glass-panel p-6 md:p-7">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {certificate.title}
                  </h2>
                  <p className="text-sm text-white/70">{certificate.issuer}</p>
                </div>
                <span className="text-xs uppercase tracking-widest text-white/60">
                  {certificate.year}
                </span>
              </div>
              <p className="mt-3 text-sm md:text-base text-white/75 leading-relaxed">
                {certificate.summary}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default CertificatesPage;
