"use client";

import Link from "next/link";

function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 mb-10 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 shadow backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">
            Admin Control Center
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            Manage Dawit Worku Portfolio
          </h1>
          <p className="text-sm text-white/70">
            Publish blogs, update achievements, and keep backlinks in sync.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link
            href="/"
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/80 hover:bg-white/15"
          >
            View site
          </Link>
          <a
            href="https://app.supabase.com/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/20 bg-white px-4 py-2 font-semibold text-[#020617] hover:bg-white/90"
          >
            Open Supabase
          </a>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
