import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

type BlogPageProps = {
  searchParams: Promise<SearchParams> | SearchParams;
};

async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams =
    searchParams instanceof Promise
      ? await searchParams
      : (searchParams as SearchParams);

  const q = (getParam(resolvedSearchParams, "q") || "").trim();
  const sort = (getParam(resolvedSearchParams, "sort") || "new").toLowerCase();
  const page = Math.max(
    1,
    parseInt(getParam(resolvedSearchParams, "page") || "1", 10) || 1
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
    <main className="blog-page px-4 md:px-6 py-16 md:py-24">
      <div className="blog-page__backdrop" aria-hidden />
      <section className="blog-page__container max-w-5xl mx-auto space-y-10">
        <header className="blog-hero text-center md:text-left">
          <span className="blog-hero__tag">Blog</span>
          <h1 className="blog-hero__title">Thinking in public</h1>
          <p className="blog-hero__subtitle md:max-w-3xl">
            Ideas, notes, and lessons learned from building products across the
            web, Android, and AI/ML.
          </p>
        </header>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              Could not load articles right now. Refresh or check back shortly.
            </AlertDescription>
          </Alert>
        )}

        {/* Search and controls */}
        <form action="/blog" method="get" className="blog-search">
          <label className="blog-search__field">
            <span className="blog-search__label">Search</span>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search articles by title or excerpt..."
              className="blog-search__input"
            />
          </label>
          <label className="blog-search__field blog-search__field--compact">
            <span className="blog-search__label">Sort</span>
            <select
              name="sort"
              defaultValue={sort}
              className="blog-search__select"
            >
              <option value="new">Newest</option>
              <option value="old">Oldest</option>
            </select>
          </label>
          <div className="blog-search__actions">
            <button
              type="submit"
              className="blog-search__action blog-search__action--primary"
            >
              Apply
            </button>
            {q || sort !== "new" ? (
              <Link
                href="/blog"
                className="blog-search__action blog-search__action--secondary"
              >
                Reset
              </Link>
            ) : null}
          </div>
        </form>

        <div className="space-y-5">
          {(q || sort !== "new") && (
            <div className="blog-meta text-xs md:text-sm">
              Showing {posts.length} of {total} result{total === 1 ? "" : "s"}
              {q ? (
                <>
                  {" "}
                  for <span className="blog-meta__em">“{q}”</span>
                </>
              ) : null}
              {sort === "old" ? " • Oldest first" : " • Newest first"}
              {page > 1 ? ` • Page ${page} of ${totalPages}` : ""}
            </div>
          )}
          {posts.length === 0 && !error && (
            <div className="blog-empty">
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
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${encodeURIComponent(post.slug)}`}
              className="group block blog-card-wrap"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <article className="blog-card">
                {post.cover_image ? (
                  <div
                    className="blog-card__media"
                    style={{
                      backgroundImage: `url(${post.cover_image})`,
                    }}
                  />
                ) : null}
                <div className="blog-card__overlay" />
                <div className="blog-card__content">
                  <div className="blog-card__meta">
                    <span className="blog-card__date">
                      {formatDate(post.created_at)}
                    </span>
                    {isNewPost(post.created_at) ? (
                      <Badge className="blog-card__badge">New</Badge>
                    ) : null}
                  </div>
                  <h2 className="blog-card__title">{post.title}</h2>
                  <p className="blog-card__excerpt">
                    {post.excerpt ?? "Tap to read the full story."}
                  </p>
                  <div className="blog-card__cta">
                    <span>Read article</span>
                    <span aria-hidden className="blog-card__cta-icon">
                      →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="blog-pagination">
              {page > 1 ? (
                <Link
                  href={`/blog?${new URLSearchParams({
                    q,
                    sort,
                    page: String(page - 1),
                  }).toString()}`}
                  className="blog-pagination__link"
                >
                  ← Previous
                </Link>
              ) : (
                <span />
              )}
              <div className="blog-pagination__status">
                Page {page} of {totalPages}
              </div>
              {page < totalPages ? (
                <Link
                  href={`/blog?${new URLSearchParams({
                    q,
                    sort,
                    page: String(page + 1),
                  }).toString()}`}
                  className="blog-pagination__link"
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
