import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <main className="px-4 md:px-6 py-16 md:py-24">
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 md:p-7"
            >
              <div className="space-y-3">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
