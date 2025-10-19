import supabase from "@/lib/supabase";

type Certificate = {
  id: string;
  title: string;
  issuer: string | null;
  year: string | null;
  file_url: string | null;
  description: string | null;
};

export const revalidate = 60;

async function CertificatesPage() {
  const { data, error } = await supabase
    .from("certificates")
    .select("id, title, issuer, year, file_url, description")
    .order("created_at", { ascending: false });
  const certificates = (data ?? []) as Certificate[];
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

        {error && (
          <p className="text-sm text-red-300">Failed to load certificates.</p>
        )}
        <div className="space-y-4">
          {certificates.length === 0 ? (
            <div className="glass-panel p-6 md:p-7 text-white/70 text-sm">
              No certificates yet.
            </div>
          ) : (
            certificates.map((certificate) => (
              <article key={certificate.id} className="glass-panel p-6 md:p-7">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {certificate.title}
                    </h2>
                    {certificate.issuer ? (
                      <p className="text-sm text-white/70">
                        {certificate.issuer}
                      </p>
                    ) : null}
                  </div>
                  {certificate.year ? (
                    <span className="text-xs uppercase tracking-widest text-white/60">
                      {certificate.year}
                    </span>
                  ) : null}
                </div>
                {certificate.description ? (
                  <p className="mt-3 text-sm md:text-base text-white/75 leading-relaxed">
                    {certificate.description}
                  </p>
                ) : null}
                {certificate.file_url ? (
                  <div className="mt-3">
                    <a
                      href={certificate.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 hover:bg-white/15"
                    >
                      View file <span aria-hidden>↗</span>
                    </a>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default CertificatesPage;
