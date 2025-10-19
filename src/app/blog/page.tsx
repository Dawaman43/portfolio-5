import Link from "next/link";
import type { Metadata } from "next";
import supabase from "@/lib/supabase";

type BlogSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at: string | null;
};

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles by Dawit Worku covering Next.js, Android, AI/ML, and student life at Adama Science and Technology University.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Dawit Worku",
    description:
      "Insights from Dawit Worku on building polished products across web, Android, and AI/ML.",
    url: "https://dawitworku.tech/blog",
    type: "website",
  },
};

function formatDate(value: string | null) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function isNewPost(value: string | null) {
  if (!value) return false;
  const created = new Date(value).getTime();
  if (Number.isNaN(created)) return false;
  const fourteenDays = 1000 * 60 * 60 * 24 * 14;
  return Date.now() - created < fourteenDays;
}

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(sp: SearchParams, key: string): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const q = (getParam(searchParams, "q") || "").trim();
  const sort = (getParam(searchParams, "sort") || "new").toLowerCase();
  const page = Math.max(
    1,
    parseInt(getParam(searchParams, "page") || "1", 10) || 1
  );
  const pageSize = 6;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Build base query with count for pagination
  let query = supabase
    .from("blogs")
    .select("id, title, slug, excerpt, cover_image, created_at", {
      count: "exact",
    });

  // Filter by search term across title and excerpt
  if (q) {
    const term = q.replace(/[(),]/g, " ");
    query = query.or(`title.ilike.%${term}%,excerpt.ilike.%${term}%`);
  }

  // Sorting
  const ascending = sort === "old";
  query = query.order("created_at", { ascending });

  // Pagination
  query = query.range(from, to);

  const { data, error, count } = await query;

  const posts: BlogSummary[] = (data ?? []) as BlogSummary[];
  const total = count ?? posts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main className="px-4 md:px-6 py-16 md:py-24">
      <section className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-3 text-center md:text-left">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
            Blog
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Thinking in public
          </h1>
          <p className="text-sm md:text-base text-white/75 md:max-w-3xl">
            Ideas, notes, and lessons learned from building products across the
            web, Android, and AI/ML.
          </p>
        </header>

        {error && (
          <p className="text-sm text-red-300">
            Could not load articles right now. Refresh or check back shortly.
          </p>
        )}

        {/* Search and controls */}
        <form
          action="/blog"
          method="get"
          className="glass-panel p-4 md:p-5 flex flex-col md:flex-row md:items-end gap-3"
        >
          <label className="flex-1 flex flex-col gap-1 text-sm">
            <span className="text-white/70">Search</span>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search articles by title or excerpt..."
              className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-white/40"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-white/70">Sort</span>
            <select
              name="sort"
              defaultValue={sort}
              className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
            >
              <option value="new">Newest</option>
              <option value="old">Oldest</option>
            </select>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#020617] hover:bg-white/90"
            >
              Apply
            </button>
            {q || sort !== "new" ? (
              <Link
                href="/blog"
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              >
                Reset
              </Link>
            ) : null}
          </div>
        </form>

        <div className="space-y-5">
          {(q || sort !== "new") && (
            <div className="text-xs md:text-sm text-white/70">
              Showing {posts.length} of {total} result{total === 1 ? "" : "s"}
              {q ? (
                <>
                  {" "}
                  for <span className="text-white">“{q}”</span>
                </>
              ) : null}
              {sort === "old" ? " • Oldest first" : " • Newest first"}
              {page > 1 ? ` • Page ${page} of ${totalPages}` : ""}
            </div>
          )}
          {posts.length === 0 && !error && (
            <div className="glass-panel p-6 md:p-7 text-center text-sm text-white/70">
              {q ? (
                <>No results found for “{q}”. Try a different search.</>
              ) : (
                <>
                  No posts yet. Publish one from the admin dashboard to see it
                  here.
                </>
              )}
            </div>
          )}
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${encodeURIComponent(post.slug)}`}
              className="group block"
            >
              <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 md:p-7 transition duration-300 ease-out hover:-translate-y-1 hover:border-white/20">
                {post.cover_image && (
                  <div
                    className="absolute inset-0 opacity-60 transition duration-300 group-hover:opacity-75"
                    style={{
                      backgroundImage: `url(${post.cover_image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#020617]/86 to-transparent" />
                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                    <span>{formatDate(post.created_at)}</span>
                    {isNewPost(post.created_at) ? (
                      <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.2em] text-white">
                        New
                      </span>
                    ) : null}
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    {post.title}
                  </h2>
                  <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                    {post.excerpt ?? "Tap to read the full story."}
                  </p>
                  <div className="flex items-center gap-3 text-sm font-semibold text-white/80 group-hover:text-white">
                    <span>Read article</span>
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              {page > 1 ? (
                <Link
                  href={`/blog?${new URLSearchParams({
                    q,
                    sort,
                    page: String(page - 1),
                  }).toString()}`}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  ← Previous
                </Link>
              ) : (
                <span />
              )}
              <div className="text-xs text-white/60">
                Page {page} of {totalPages}
              </div>
              {page < totalPages ? (
                <Link
                  href={`/blog?${new URLSearchParams({
                    q,
                    sort,
                    page: String(page + 1),
                  }).toString()}`}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  Next →
                </Link>
              ) : (
                <span />
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default BlogPage;
