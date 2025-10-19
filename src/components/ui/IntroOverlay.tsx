"use client";

import { useEffect, useState } from "react";

type IntroOverlayProps = {
  minDurationMs?: number;
};

export default function IntroOverlay({
  minDurationMs = 1400,
}: IntroOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setDone(true);
      return;
    }

    setVisible(true);
    const t = window.setTimeout(() => {
      setVisible(false);
      const t2 = window.setTimeout(() => setDone(true), 450);
      return () => window.clearTimeout(t2);
    }, Math.max(400, minDurationMs));

    return () => window.clearTimeout(t);
  }, [minDurationMs]);

  if (done) return null;

  return (
    <div
      aria-hidden
      className={`intro-overlay ${
        visible ? "intro-overlay--enter" : "intro-overlay--exit"
      }`}
    >
      <div className="intro-backglow" />
      <div className="intro-content">
        <div className="intro-mark">
          <span className="intro-dot intro-dot--a" />
          <span className="intro-dot intro-dot--b" />
          <span className="intro-dot intro-dot--c" />
        </div>
        <div className="intro-title">
          <span className="intro-title__text">Dawit Worku</span>
          <span className="intro-title__sweep" />
        </div>
      </div>
    </div>
  );
}
