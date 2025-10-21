import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/caseStudies";

const siteUrl = "https://dawitworku.tech";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static top-level pages
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/projects",
    "/certificates",
    "/contact",
    "/blog",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  // Case studies (projects)
  const projectPages: MetadataRoute.Sitemap = caseStudies.map((p) => ({
    url: `${siteUrl}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Blog entries (best-effort; if Supabase fails, skip silently)
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${siteUrl}/api/blog-index`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const items = (await res.json()) as {
        slug: string;
        updated_at?: string;
      }[];
      blogPages = items.map((b) => ({
        url: `${siteUrl}/blog/${encodeURIComponent(b.slug)}`,
        lastModified: b.updated_at ? new Date(b.updated_at) : now,
        changeFrequency: "weekly",
        priority: 0.6,
      }));
    }
  } catch {
    // ignore network errors in sitemap generation
  }

  return [...staticPages, ...projectPages, ...blogPages];
}
