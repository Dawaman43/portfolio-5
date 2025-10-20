import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_HOSTS = new Set(["admin.dawitworku.tech", "admin.daiwtworku.tech"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";

  if (ADMIN_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = `/admin${url.pathname === "/" ? "" : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
