import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import supabase from "@/lib/supabase";
import { renderMarkdown } from "@/lib/markdown";
import CommentSection from "@/components/blog/CommentSection";
import ShareButtons from "@/components/blog/ShareButtons";
import CodeBlockEnhancer from "@/components/blog/CodeBlockEnhancer";
import { normalizeSlug, slugMatches } from "@/lib/utils";

export const revalidate = 60;

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  created_at: string | null;
};

type CommentRecord = {
  id: string;
  slug: string;
  name: string | null;
  message: string;
  created_at: string | null;
  parent_id: string | null;
  likes: number | null;
};

type RelatedSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  created_at: string | null;
};

function buildSlugCandidates(rawSlug: string) {
  const decoded = (() => {
    try {
      return decodeURIComponent(rawSlug);
    } catch {
      return rawSlug;
    }
  })();

  const normalizedSpace = decoded.replace(/[-_]+/g, " ");

  return Array.from(
    new Set(
      [rawSlug, decoded, normalizedSpace]
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

async function getPost(rawSlug: string) {
  const candidates = buildSlugCandidates(rawSlug);

  for (const candidate of candidates) {
    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, slug, excerpt, content, cover_image, created_at")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return data as Blog;
    }
  }

  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, content, cover_image, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const normalizedTarget = normalizeSlug(candidates[0] ?? rawSlug);
  const posts = (data ?? []) as Blog[];

  const fallback = posts.find((post) => {
    if (!post.slug) return false;
    return (
      candidates.some((candidate) => slugMatches(post.slug, candidate)) ||
      normalizeSlug(post.slug) === normalizedTarget
    );
  });

  return fallback ?? null;
}

async function getCommentSnapshot(slug: string) {
  const { data } = await supabase
    .from("blog_comments")
    .select("id, slug, name, message, created_at, parent_id, likes")
    .eq("slug", slug)
    .order("created_at", { ascending: true });
  return (data ?? []) as CommentRecord[];
}

async function getRelatedPosts(postId: string) {
  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, created_at")
    .neq("id", postId)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    return [] as RelatedSummary[];
  }

  return (data ?? []) as RelatedSummary[];
}

function formatDate(value: string | null) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function calculateReadingTime(content: string | null) {
  if (!content) return null;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  if (!words) return null;
  return Math.max(1, Math.round(words / 180));
}

type ExtractedHeading = {
  level: number;
  title: string;
  anchor: string;
};

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").trim();
}

function extractHeadings(html: string | null) {
  if (!html) {
    return [] as ExtractedHeading[];
  }

  const headingPattern = /<h([2-3])[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  const headings: ExtractedHeading[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingPattern.exec(html)) !== null) {
    const level = Number(match[1]);
    const anchor = match[2];
    const title = stripHtml(match[3]);
    if (!title) {
      continue;
    }
    headings.push({ level, anchor, title });
  }

  return headings;
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from("blogs")
    .select("slug")
    .order("created_at", { ascending: false });
  return (data ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const post = await getPost(rawSlug);

  if (!post) {
    return { title: "Blog post not found" };
  }

  const description = post.excerpt ?? "Insights from Dawit Worku";
  const encodedSlug = encodeURIComponent(post.slug);
  const canonicalUrl = `https://dawitworku.tech/blog/${encodedSlug}`;

  return {
    title: `${post.title} | Dawit Worku`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      type: "article",
      images: post.cover_image
        ? [
            {
              url: post.cover_image,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug: rawSlug } = await params;
  const post = await getPost(rawSlug);

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);
  const [markdownHtml, commentSnapshot, relatedPosts] = await Promise.all([
    post.content
      ? renderMarkdown(post.content)
      : Promise.resolve<string | null>(null),
    getCommentSnapshot(post.slug),
    getRelatedPosts(post.id),
  ]);
  const hasContent = Boolean(markdownHtml && markdownHtml.trim().length > 0);
  const canonicalUrl = `https://dawitworku.tech/blog/${encodeURIComponent(
    post.slug
  )}`;
  const commentCount = commentSnapshot.length;
  const tableOfContents = extractHeadings(markdownHtml);
  const structuredComments = commentSnapshot
    .filter((comment) => !comment.parent_id)
    .slice(-5)
    .map((comment) => ({
      "@type": "Comment",
      author: comment.name || "Anonymous",
      datePublished: comment.created_at ?? undefined,
      upvoteCount: comment.likes ?? 0,
      text: comment.message,
    }));
  const articleSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? "",
    author: {
      "@type": "Person",
      name: "Dawit Worku",
      url: "https://dawitworku.tech",
    },
    mainEntityOfPage: canonicalUrl,
    datePublished: post.created_at ?? undefined,
    dateModified: post.created_at ?? undefined,
    image: post.cover_image ? [post.cover_image] : undefined,
    commentCount,
  };

  if (structuredComments.length > 0) {
    articleSchema.comment = structuredComments;
  }

  return (
    <main className="blog-article-page px-4 md:px-6 py-16 md:py-24">
      <div className="blog-article-page__backdrop" aria-hidden />
      <article className="blog-article w-full mx-auto">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
        <CodeBlockEnhancer />
        <header className="blog-article__header">
          <div className="blog-article__meta">
            <span className="blog-article__meta-item">
              Published {formatDate(post.created_at)}
            </span>
            {readingTime ? (
              <span className="blog-article__meta-item">
                • {readingTime} min read
              </span>
            ) : null}
          </div>
          <h1 className="blog-article__title">{post.title}</h1>
          {post.excerpt && (
            <p className="blog-article__excerpt">{post.excerpt}</p>
          )}
          <div className="blog-article__share">
            <ShareButtons title={post.title} url={canonicalUrl} />
          </div>
          {post.cover_image && (
            <div className="blog-article__cover blog-cover">
              <Image
                src={post.cover_image}
                alt={post.title}
                width={960}
                height={540}
                className="blog-article__cover-image"
                priority
              />
              <div className="blog-cover__scrim" />
            </div>
          )}
        </header>

        <div className="blog-article__divider" />

        <section className="blog-article__overview">
          <div className="blog-article__stat-grid">
            <div className="blog-article__stat">
              <span className="blog-article__stat-label">Status</span>
              <strong className="blog-article__stat-value">In the lab</strong>
              <p className="blog-article__stat-note">
                Capturing build signals, decisions, and monochrome experiments.
              </p>
            </div>
            <div className="blog-article__stat">
              <span className="blog-article__stat-label">Reading time</span>
              <strong className="blog-article__stat-value">
                {readingTime ? `${readingTime} min` : "—"}
              </strong>
              <p className="blog-article__stat-note">
                {readingTime
                  ? "Estimated focus to absorb the full dispatch."
                  : "Settle in—length varies across sections."}
              </p>
            </div>
            <div className="blog-article__stat">
              <span className="blog-article__stat-label">Comments</span>
              <strong className="blog-article__stat-value">
                {commentCount}
              </strong>
              <p className="blog-article__stat-note">
                {commentCount > 0
                  ? "Perspectives already logged by the community."
                  : "Be the first to leave a trace in the lab notes."}
              </p>
            </div>
          </div>

          {tableOfContents.length > 0 ? (
            <nav className="blog-article__toc" aria-label="Table of contents">
              <span className="blog-article__toc-label">Key sections</span>
              <ul className="blog-article__toc-list">
                {tableOfContents.map((heading, index) => (
                  <li
                    key={`${heading.anchor}-${index}`}
                    className={`blog-article__toc-item${
                      heading.level === 3 ? " blog-article__toc-item--sub" : ""
                    }`}
                  >
                    <a
                      href={`#${heading.anchor}`}
                      className="blog-article__toc-link"
                    >
                      {heading.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </section>

        {hasContent ? (
          <section className="blog-article__body">
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: markdownHtml ?? "" }}
            />
          </section>
        ) : (
          <p className="blog-article__empty">This post has no content yet.</p>
        )}

        {relatedPosts.length > 0 ? (
          <section className="blog-related">
            <div className="blog-related__header">
              <span className="blog-related__label">
                More monochrome essays
              </span>
              <p className="blog-related__subtitle">
                Continue the thread with recent experiments from the studio.
              </p>
            </div>
            <div className="blog-related__grid">
              {relatedPosts.map((entry, index) => {
                if (!entry.slug) {
                  return null;
                }

                return (
                  <Link
                    key={entry.id}
                    href={`/blog/${encodeURIComponent(entry.slug)}`}
                    className="blog-related__card"
                    style={{ animationDelay: `${(index + 1) * 80}ms` }}
                  >
                    <span className="blog-related__date">
                      {formatDate(entry.created_at)}
                    </span>
                    <h3 className="blog-related__title">{entry.title}</h3>
                    <p className="blog-related__excerpt">
                      {entry.excerpt ?? "Dive into the full story."}
                    </p>
                    <span className="blog-related__cta">Read next →</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="blog-article__comments">
          <CommentSection slug={post.slug} initialCount={commentCount} />
        </section>
      </article>
    </main>
  );
}

export default BlogPostPage;
