"use client";

import { useEffect, useState } from "react";

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const total = scrollHeight - clientHeight;
      const value = total > 0 ? (scrollTop / total) * 100 : 0;
      setProgress(value);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="scroll-progress-track" aria-hidden="true">
      <span
        className="scroll-progress-thumb"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default ScrollProgress;
