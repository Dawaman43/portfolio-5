## Portfolio Overview

Personal site, blog, and admin dashboard for **Dawit Worku** — a 4th year Software Engineering student at **Adama Science and Technology University**. Built with Next.js 15 app router, Tailwind CSS v4, and Supabase for data, storage, and analytics.

Key features:

- Liquid-glass inspired UI with responsive hero, sections, and scroll indicator
- Dynamic blog index and detail pages powered by Supabase
- Inline share buttons and public comment threads per article
- Admin dashboard for blogs, certificates, skills, and backlink tracking
- Core Web Vitals logging via `/api/web-vitals` for ongoing SEO monitoring
- Structured data (JSON-LD) and enriched metadata for better search visibility

## Getting Started

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the site. The admin dashboard lives at `/admin`.

Create a `.env.local` file with:

```ini
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Schema Checklist

Create the tables below (UUID primary key, default `gen_random_uuid()` unless noted):

| Table           | Columns                                                                                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blogs`         | `id uuid pk`, `title text`, `slug text unique`, `excerpt text`, `content text`, `cover_image text`, `created_at timestamptz default now()`                                          |
| `certificates`  | `id uuid pk`, `title text`, `issuer text`, `year text`, `file_url text`, `description text`, `created_at timestamptz default now()`                                                 |
| `skills`        | `id uuid pk`, `name text`, `category text`, `proficiency text`, `description text`, `created_at timestamptz default now()`                                                          |
| `blog_comments` | `id uuid pk`, `slug text`, `name text`, `message text`, `created_at timestamptz default now()`                                                                                      |
| `backlinks`     | `id uuid pk`, `source_url text`, `domain text`, `status text`, `notes text`, `created_at timestamptz default now()`                                                                 |
| `web_vitals`    | `id bigint generated always as identity pk`, `metric text`, `value numeric`, `label text`, `path text`, `user_agent text`, `metric_id text`, `created_at timestamptz default now()` |

Storage bucket requirements:

- Create a public bucket named `media` for certificate uploads and blog cover images.

Optional Row Level Security starter policies (Postgres SQL):

```sql
-- blogs, certificates, skills: allow anon read
create policy "Public read" on public.blogs for select using (true);
create policy "Public read" on public.certificates for select using (true);
create policy "Public read" on public.skills for select using (true);

-- allow inserts/updates/deletes from anon for now (restrict with auth once ready)
create policy "Admin write" on public.blogs for all using (true) with check (true);
create policy "Admin write" on public.certificates for all using (true) with check (true);
create policy "Admin write" on public.skills for all using (true) with check (true);

-- blog comments: public read + write
create policy "Comment read" on public.blog_comments for select using (true);
create policy "Comment write" on public.blog_comments for insert with check (true);

-- backlinks + web vitals: restrict writes if you add auth (currently open)
create policy "Backlink read" on public.backlinks for select using (true);
create policy "Backlink write" on public.backlinks for all using (true) with check (true);
create policy "Vitals read" on public.web_vitals for select using (true);
create policy "Vitals write" on public.web_vitals for insert with check (true);
```

> Restrict the write policies to authenticated service accounts once Supabase auth is in place (e.g., via Supabase Studio or an admin token).

## Web Vitals Pipeline

Client-side metrics are reported through `app/reportWebVitals.ts` to `/api/web-vitals`, which stores each event in the `web_vitals` table. Use Supabase dashboards or SQL to monitor LCP, INP, CLS, TTFB, and FID trends.

## Backlink Tracking

Log new backlinks from `/admin` → **Backlinks**. Each entry saves the referring URL, domain, status, and notes so you can monitor outreach and link quality alongside performance data.

## Deployment Notes

- Set the Supabase env vars in your hosting platform.
- Add `NEXT_PUBLIC_SITE_URL` if you need per-environment canonical URLs.
- Configure remote image domains in `next.config.ts` if your cover images are stored outside Supabase storage.

Happy shipping!
