import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Metadata } from "next";
import supabase from "@/lib/supabase";

interface BlogSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at: string | null;
}

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
  searchParams?: Promise<SearchParams>;
};

async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams: SearchParams = (await searchParams) ?? {};

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
  const searchActive = Boolean(q || sort !== "new");

  const freshCount = posts.filter((post) => isNewPost(post.created_at)).length;
  const previewStats = posts.reduce(
    (acc, post) => {
      if (!post.excerpt) {
        return acc;
      }
      const words = post.excerpt.trim().split(/\s+/).filter(Boolean).length;
      return {
        words: acc.words + words,
        count: acc.count + 1,
      };
    },
    { words: 0, count: 0 }
  );
  const averagePreviewMinutes = previewStats.count
    ? Math.max(1, Math.round(previewStats.words / previewStats.count / 180))
    : null;
  const latestPublished = posts[0]?.created_at
    ? formatDate(posts[0].created_at)
    : null;

  const showHighlights = page === 1 && !q;
  const highlightStats = showHighlights
    ? [
        {
          label: "Published entries",
          value: total,
          note: "Long-form notes and shipping logs.",
        },
        {
          label: "Fresh dispatches",
          value: freshCount,
          note: "New within the last 14 days.",
        },
        {
          label: "Preview read",
          value: averagePreviewMinutes
            ? `${averagePreviewMinutes} min`
            : "~3 min",
          note: "Average skim from excerpts.",
        },
      ]
    : [];

  const signalBeacons = [
    {
      title: "Product craft",
      note: "Product loops, UX heuristics, sequencing features.",
    },
    {
      title: "Engineering lab",
      note: "Runtime experiments, measurement, Supabase notes.",
    },
    {
      title: "Learning loops",
      note: "University life, mentoring, continuous improvement.",
    },
  ];

  const timelineSignals = showHighlights
    ? [
        {
          headline: latestPublished
            ? `Latest dispatch · ${latestPublished}`
            : "Latest dispatch",
          detail: posts[0]?.title ?? "Drafting the next release notes.",
          subtext:
            posts[0]?.excerpt ??
            "Fresh experiments in monochrome—peek inside the build diary.",
        },
        {
          headline: "Writing cadence",
          detail: averagePreviewMinutes
            ? `~${averagePreviewMinutes} minute preview reads`
            : "Bite-sized experimentation logs",
          subtext:
            "Expect dense notes with diagrams, metrics, and field reports.",
        },
        {
          headline: "Archive depth",
          detail: `${total} published entries`,
          subtext: "Track the evolution from prototypes to polished launches.",
        },
      ]
    : [];

  const highlightPosts = showHighlights ? posts.slice(0, 2) : [];
  const feedPosts =
    highlightPosts.length > 0 ? posts.slice(highlightPosts.length) : posts;

  const buildQueryHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (q) {
      params.set("q", q);
    }
    if (sort !== "new") {
      params.set("sort", sort);
    }
    if (targetPage > 1) {
      params.set("page", String(targetPage));
    }
    const query = params.toString();
    return query ? `/blog?${query}` : "/blog";
  };

  return (
    <main className="blog-page px-4 md:px-6 py-16 md:py-24">
      <div className="blog-page__backdrop" aria-hidden />
      <section className="blog-page__container max-w-6xl mx-auto space-y-12">
        <header className="blog-hero">
          <div className="blog-hero__intro">
            <span className="blog-hero__tag">Blog</span>
            <h1 className="blog-hero__title">Thinking in monochrome</h1>
            <p className="blog-hero__subtitle md:max-w-2xl">
              Field notes from building in public—shipping diaries, debugging
              transcripts, and ideas connecting web, Android, and AI/ML.
            </p>
          </div>

          {showHighlights && highlightStats.length > 0 ? (
            <div className="blog-hero__meta">
              {highlightStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="blog-hero__stat"
                  style={{ animationDelay: `${(index + 1) * 70}ms` }}
                >
                  <span className="blog-hero__stat-label">{stat.label}</span>
                  <span className="blog-hero__stat-value">
                    {typeof stat.value === "number"
                      ? stat.value.toString().padStart(2, "0")
                      : stat.value}
                  </span>
                  <p className="blog-hero__stat-note">{stat.note}</p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="blog-hero__signals">
            {signalBeacons.map((beacon, index) => (
              <div
                key={beacon.title}
                className="blog-hero__signal"
                style={{ animationDelay: `${(index + 1) * 90}ms` }}
              >
                <Badge variant="outline" className="blog-hero__signal-badge">
                  {beacon.title}
                </Badge>
                <p className="blog-hero__signal-note">{beacon.note}</p>
              </div>
            ))}
          </div>
        </header>

        {showHighlights && timelineSignals.length > 0 ? (
          <section className="blog-timeline">
            <span className="blog-timeline__label">Dispatch feed</span>
            <div className="blog-timeline__grid">
              {timelineSignals.map((signal, index) => (
                <div
                  key={signal.headline}
                  className="blog-timeline__card"
                  style={{ animationDelay: `${(index + 1) * 80}ms` }}
                >
                  <span className="blog-timeline__headline">
                    {signal.headline}
                  </span>
                  <strong className="blog-timeline__detail">
                    {signal.detail}
                  </strong>
                  <p className="blog-timeline__subtext">{signal.subtext}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

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
            {searchActive ? (
              <Link
                href="/blog"
                className="blog-search__action blog-search__action--secondary"
              >
                Reset
              </Link>
            ) : null}
          </div>
        </form>

        {showHighlights && highlightPosts.length > 0 ? (
          <section className="blog-featured">
            <h2 className="blog-featured__heading">Featured dispatches</h2>
            <div className="blog-featured__grid">
              {highlightPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${encodeURIComponent(post.slug)}`}
                  className="blog-featured__card"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="blog-featured__media">
                    {post.cover_image ? (
                      <div
                        className="blog-featured__scrim"
                        style={{
                          backgroundImage: `url(${post.cover_image})`,
                        }}
                      />
                    ) : null}
                  </div>
                  <div className="blog-featured__body">
                    <span className="blog-featured__timestamp">
                      {formatDate(post.created_at)}
                    </span>
                    <h3 className="blog-featured__title">{post.title}</h3>
                    <p className="blog-featured__excerpt">
                      {post.excerpt ?? "Tap to read the full story."}
                    </p>
                    <span className="blog-featured__cta">
                      Read the deep dive →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="space-y-6">
          {searchActive && (
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
          {posts.length === 0 && !error ? (
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
          ) : null}

          <div className="blog-feed">
            {feedPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${encodeURIComponent(post.slug)}`}
                className="group block blog-card-wrap"
                style={{
                  animationDelay: `${(index + highlightPosts.length) * 70}ms`,
                }}
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
          </div>

          {totalPages > 1 && (
            <div className="blog-pagination">
              {page > 1 ? (
                <Link
                  href={buildQueryHref(page - 1)}
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
                  href={buildQueryHref(page + 1)}
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
