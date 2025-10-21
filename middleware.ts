import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_HOSTS = new Set(["admin.dawitworku.tech", "admin.daiwtworku.tech"]);

export function middleware(request: NextRequest) {
  const rawHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const host = rawHost?.split(",")[0]?.trim().toLowerCase() ?? "";
  const { pathname } = request.nextUrl;

  // Serve custom icons from profile.jpg (bypass default Next icon)
  const iconPaths = new Set([
    "/favicon.ico",
    "/apple-touch-icon.png",
    "/apple-touch-icon-precomposed.png",
    "/icon.png",
    "/icon-192.png",
    "/icon-512.png",
    "/android-chrome-192x192.png",
    "/android-chrome-512x512.png",
  ]);
  if (iconPaths.has(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/profile.jpg";
    const res = NextResponse.rewrite(url);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  if (ADMIN_HOSTS.has(host)) {
    // Allow API and Next.js internal assets/data to remain at their original paths
    const isInternal =
      pathname.startsWith("/api") || pathname.startsWith("/_next");
    if (!pathname.startsWith("/admin") && !isInternal) {
      const url = request.nextUrl.clone();
      url.pathname = `/admin${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|robots.txt|sitemap.xml).*)"],
};
