"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Shows a small progress bar at the very top when navigating between routes/links
export default function TopLinkProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const search = useSearchParams();

  // Start animation when route changes
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    // Kick off: small width
    bar.style.width = "10%";
    const grow = window.setTimeout(() => {
      bar.style.width = "70%";
    }, 100);
    // Finish after short delay to simulate load
    const finish = window.setTimeout(() => {
      bar.style.width = "100%";
      // Hide after completing
      const hide = window.setTimeout(() => {
        if (bar) bar.style.width = "0%";
        window.clearTimeout(hide);
      }, 250);
    }, 450);
    return () => {
      window.clearTimeout(grow);
      window.clearTimeout(finish);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search?.toString()]);

  return <div ref={barRef} className="link-progress-bar" aria-hidden />;
}
