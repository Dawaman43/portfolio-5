"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollRail() {
  const [progress, setProgress] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const total = scrollHeight - clientHeight;
      const value = total > 0 ? (scrollTop / total) * 100 : 0;
      setProgress(value);
    };

    updateProgress();
    const onScroll = () => requestAnimationFrame(updateProgress);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div ref={railRef} className="scroll-rail" aria-hidden>
      <div className="scroll-rail__track">
        <div
          className="scroll-rail__thumb"
          style={{ height: `${progress}%` }}
        />
        <div className="scroll-rail__glow" />
      </div>
    </div>
  );
}
