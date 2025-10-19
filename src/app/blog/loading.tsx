export default function BlogLoading() {
  return (
    <main className="px-4 md:px-6 py-16 md:py-24">
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-3">
          <div className="h-5 w-24 rounded bg-white/10" />
          <div className="h-8 w-72 rounded bg-white/10" />
          <div className="h-4 w-96 max-w-full rounded bg-white/10" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 md:p-7"
            >
              <div className="space-y-3">
                <div className="h-3 w-40 rounded bg-white/10" />
                <div className="h-6 w-3/4 rounded bg-white/10" />
                <div className="h-4 w-full rounded bg-white/10" />
                <div className="h-4 w-5/6 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
