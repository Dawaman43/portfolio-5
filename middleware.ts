import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const rawHost =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";

  // Normalize and extract the first host (if multiple forwarded hosts)
  const host = rawHost.split(",")[0].trim().toLowerCase();

  // Detect if it's the admin subdomain
  const isAdminHost =
    host === "admin.dawitworku.tech" || host.endsWith(".admin.dawitworku.tech");

  const { pathname } = request.nextUrl;

  // --- 1. Handle custom icons (profile.jpg instead of Next icons) ---
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

  // --- 2. Handle subdomain → /admin rewrite ---
  if (isAdminHost) {
    const isInternal =
      pathname.startsWith("/api") || pathname.startsWith("/_next");

    if (!pathname.startsWith("/admin") && !isInternal) {
      const url = request.nextUrl.clone();
      url.pathname = `/admin${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  if (pathname === "/debug") {
    return NextResponse.json({
      xForwardedHost: request.headers.get("x-forwarded-host"),
      host: request.headers.get("host"),
      detectedHost: host,
      isAdminHost,
    });
  }

  // Default: allow through
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|robots.txt|sitemap.xml).*)"],
};
