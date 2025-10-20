"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { inter } from "@/lib/fonts";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
  { name: "Certificates", href: "/certificates" },
  { name: "Blog", href: "/blog" },
];

function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Blur the underlying content slightly when hovering header nav
  useEffect(() => {
    if (hovering) {
      document.documentElement.classList.add("header-hover");
    } else {
      document.documentElement.classList.remove("header-hover");
    }
    return () => document.documentElement.classList.remove("header-hover");
  }, [hovering]);

  return (
    <header
      className="sticky top-0 z-50"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="pt-[max(env(safe-area-inset-top),0.75rem)] px-4">
        <div className="mx-auto max-w-6xl">
          <nav
            aria-label="Primary"
            className="transition-[transform,opacity] duration-300 ease-out will-change-transform"
          >
            <div className="liquid-glass liquid-noise mobile-nav-shell shadow-[0_8px_40px_rgba(0,0,0,0.25)] w-full md:w-auto px-4 md:px-6 py-3 md:py-3.5 flex items-center justify-between gap-4 md:gap-6">
              <Link
                href="/"
                className={`${inter.className} text-base md:text-lg font-semibold tracking-tight text-white flex items-center gap-2`}
              >
                <span
                  className="inline-flex h-2 w-2 rounded-full bg-white/80 animate-pulse"
                  aria-hidden="true"
                />
                Dawit Worku
              </Link>
              <ul className="hidden md:flex items-center gap-x-6 lg:gap-x-8">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <li key={link.name} className="list-none">
                      <Link
                        href={link.href}
                        className={`${
                          inter.className
                        } relative text-sm lg:text-base font-semibold transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-white/80 hover:text-white"
                        }`}
                      >
                        {link.name}
                        {isActive && (
                          <span className="absolute -bottom-1 left-0 right-0 mx-auto h-0.5 w-6 rounded-full bg-white/80" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                aria-label="Toggle navigation"
                aria-expanded={open}
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 hover:bg-white/15 transition"
                onClick={() => setOpen((prev) => !prev)}
              >
                {open ? (
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M6 18L18 6" />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                )}
              </button>
            </div>
            {open && (
              <div className="md:hidden mt-3 animate-[fadeUp_0.2s_ease-out]">
                <ul className="glass-panel mobile-nav-menu px-5 py-4 space-y-2 text-left">
                  {navLinks.map((link) => {
                    const isActive =
                      pathname === link.href ||
                      (link.href !== "/" && pathname.startsWith(link.href));
                    return (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className={`${inter.className} mobile-nav-link ${
                            isActive ? "mobile-nav-link--active" : ""
                          }`}
                        >
                          {link.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
