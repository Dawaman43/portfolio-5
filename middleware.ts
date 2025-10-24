import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;

  // Determine the hostname robustly (Vercel sometimes hides subdomain in headers)
  const rawHost =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    url.hostname;

  const host = rawHost.split(",")[0].trim().toLowerCase();

  // Detect admin subdomain either by host or URL hostname
  const isAdminHost =
    host.includes("admin.") || url.hostname.includes("admin.");

  // --- 1. Serve custom icons from profile.jpg ---
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
    const newUrl = url.clone();
    newUrl.pathname = "/profile.jpg";
    const res = NextResponse.rewrite(newUrl);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // --- 2. Rewrite admin subdomain paths ---
  if (isAdminHost) {
    const isInternal =
      pathname.startsWith("/api") || pathname.startsWith("/_next");

    if (!pathname.startsWith("/admin") && !isInternal) {
      const newUrl = url.clone();
      newUrl.pathname = `/admin${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(newUrl);
    }
  }

  // --- 3. Debug endpoint ---
  if (pathname === "/debug") {
    return NextResponse.json({
      urlHostname: url.hostname,
      xForwardedHost: request.headers.get("x-forwarded-host"),
      host: request.headers.get("host"),
      detectedHost: host,
      isAdminHost,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|robots.txt|sitemap.xml).*)"],
};
