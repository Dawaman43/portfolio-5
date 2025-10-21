import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
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
  const markdownHtml = post.content ? await renderMarkdown(post.content) : null;
  const hasContent = Boolean(markdownHtml && markdownHtml.trim().length > 0);
  const canonicalUrl = `https://dawitworku.tech/blog/${encodeURIComponent(
    post.slug
  )}`;
  const commentSnapshot = await getCommentSnapshot(post.slug);
  const commentCount = commentSnapshot.length;
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

        <section className="blog-article__comments">
          <CommentSection slug={post.slug} initialCount={commentCount} />
        </section>
      </article>
    </main>
  );
}

export default BlogPostPage;
