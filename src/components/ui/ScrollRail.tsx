"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type SectionInfo = {
  id: string;
  title: string;
  snippet?: string;
  top: number; // page Y position
  percent: number; // 0..1 along the page
};

function clamp(n: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, n));
}

export default function ScrollRail() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0); // 0..1
  const [ratio, setRatio] = useState(0.1); // viewport/total
  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [hoverPct, setHoverPct] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  const [preview] = useState<{
    text: string;
    imageSrc?: string;
  } | null>(null);

  // Build section map (titles and positions)
  useEffect(() => {
    const buildSections = () => {
      const doc = document.documentElement;
      const total = Math.max(1, doc.scrollHeight - doc.clientHeight);
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("main > section")
      );
      const items: SectionInfo[] = nodes.map((el, i) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const heading = el.querySelector<HTMLElement>(
          "h1, h2, h3, [data-title]"
        );
        const titleAttr =
          el.getAttribute("data-title") || heading?.textContent?.trim();
        const p = el.querySelector<HTMLParagraphElement>("p");
        const snippet = p?.textContent?.trim()?.slice(0, 120);
        const id = el.id || `section-${i + 1}`;
        if (!el.id) el.id = id;
        return {
          id,
          title: titleAttr || `Section ${i + 1}`,
          snippet,
          top,
          percent: clamp(top / total),
        };
      });
      setSections(items);
    };

    buildSections();
    const ro = new ResizeObserver(() => buildSections());
    ro.observe(document.documentElement);
    window.addEventListener("load", buildSections);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", buildSections);
    };
  }, []);

  // Track scroll and viewport ratio
  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const total = Math.max(1, scrollHeight - clientHeight);
      setProgress(scrollTop / total);
      setRatio(clamp(clientHeight / scrollHeight));
    };
    const onScroll = () => requestAnimationFrame(update);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Derived thumb metrics
  const { heightPct, topPct } = useMemo(() => {
    const minPct = 6; // ensure visible handle
    const hp = Math.max(ratio * 100, minPct);
    const tp = progress * (100 - hp);
    return { heightPct: hp, topPct: tp };
  }, [progress, ratio]);

  // Hover tooltip section
  const hoverSection = useMemo(() => {
    if (hoverPct == null || sections.length === 0) return null;
    const pct = hoverPct;
    let nearest = sections[0];
    let dist = Math.abs(pct - nearest.percent * 100);
    for (const s of sections) {
      const d = Math.abs(pct - s.percent * 100);
      if (d < dist) {
        nearest = s;
        dist = d;
      }
    }
    return { section: nearest, pct };
  }, [hoverPct, sections]);

  // Active section (for marker highlight)
  const activeIndex = useMemo(() => {
    if (!sections.length) return -1;
    const currentPct = progress * 100;
    let idx = 0;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].percent * 100 <= currentPct) idx = i;
      else break;
    }
    return idx;
  }, [sections, progress]);

  // Helpers to compute percent from event
  const posToPercent = (clientY: number) => {
    const rail = railRef.current;
    if (!rail) return 0;
    const rect = rail.getBoundingClientRect();
    const y = clamp((clientY - rect.top) / rect.height);
    return y * 100;
  };

  const scrollToPercent = (pct: number, smooth = true) => {
    const { scrollHeight, clientHeight } = document.documentElement;
    const total = Math.max(1, scrollHeight - clientHeight);
    const top = (clamp(pct / 100) * total) | 0;
    window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  };

  // Pointer interactions
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onPointerDown = (e: PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      setDragging(true);
      const pct = posToPercent(e.clientY);
      scrollToPercent(pct, false);
    };
    const onPointerMove = (e: PointerEvent) => {
      const pct = posToPercent(e.clientY);
      setHoverPct(pct);
      if (dragging) {
        scrollToPercent(pct, false);
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      setDragging(false);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    };
    const onClick = (e: MouseEvent) => {
      const pct = posToPercent(e.clientY);
      scrollToPercent(pct, true);
    };
    const onLeave = () => setHoverPct(null);

    rail.addEventListener("pointerdown", onPointerDown);
    rail.addEventListener("pointermove", onPointerMove);
    rail.addEventListener("pointerup", onPointerUp);
    rail.addEventListener("click", onClick);
    rail.addEventListener("pointerleave", onLeave);
    return () => {
      rail.removeEventListener("pointerdown", onPointerDown);
      rail.removeEventListener("pointermove", onPointerMove);
      rail.removeEventListener("pointerup", onPointerUp);
      rail.removeEventListener("click", onClick);
      rail.removeEventListener("pointerleave", onLeave);
    };
  }, [dragging]);

  return (
    <div
      ref={railRef}
      className="scroll-rail"
      aria-label="Page scrollbar"
      tabIndex={0}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={(e) => {
        const key = e.key;
        if (
          [
            "ArrowUp",
            "ArrowDown",
            "PageUp",
            "PageDown",
            "Home",
            "End",
          ].includes(key)
        ) {
          e.preventDefault();
        }
        const stepSmall = 2; // percent
        const stepLarge = 10;
        if (key === "ArrowUp") scrollToPercent(progress * 100 - stepSmall);
        if (key === "ArrowDown") scrollToPercent(progress * 100 + stepSmall);
        if (key === "PageUp") scrollToPercent(progress * 100 - stepLarge);
        if (key === "PageDown") scrollToPercent(progress * 100 + stepLarge);
        if (key === "Home") scrollToPercent(0);
        if (key === "End") scrollToPercent(100);
      }}
    >
      {/* Quick jump buttons */}
      <button
        className="scroll-rail__btn scroll-rail__btn--up"
        aria-label="Scroll to top"
        onClick={(e) => {
          e.stopPropagation();
          scrollToPercent(0);
        }}
      >
        ↑
      </button>
      <div className="scroll-rail__track">
        {/* Hover highlight line */}
        {hoverPct != null && (
          <div
            className="scroll-rail__hoverline"
            style={{ top: `${hoverPct}%` }}
          />
        )}
        {/* Section markers */}
        {sections.map((s) => (
          <div
            key={s.id}
            className={`scroll-rail__marker${
              sections[activeIndex]?.id === s.id ? " is-active" : ""
            }`}
            style={{ top: `${s.percent * 100}%` }}
            title={s.title}
            aria-hidden
          />
        ))}

        {/* Thumb */}
        <div
          className={`scroll-rail__thumb${dragging ? " is-dragging" : ""}`}
          style={{ height: `${heightPct}%`, top: `${topPct}%` }}
        />

        {/* Glow overlay */}
        <div className="scroll-rail__glow" />

        {/* Stylish modal preview on hover */}
        {hoverSection && (
          <div
            className="scroll-rail__modal"
            style={{ top: `${hoverSection.pct}%` }}
            role="dialog"
            aria-label={`Preview of ${hoverSection.section.title}`}
          >
            {preview?.imageSrc && (
              <div className="scroll-rail__modal-media relative">
                <Image
                  src={preview.imageSrc}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 160px, 240px"
                  className="scroll-rail__modal-image object-cover"
                  priority={false}
                  unoptimized
                />
              </div>
            )}
            <div className="scroll-rail__modal-body">
              <div className="scroll-rail__modal-title">
                {hoverSection.section.title}
              </div>
              {preview?.text && (
                <div className="scroll-rail__modal-text">{preview.text}</div>
              )}
            </div>
          </div>
        )}

        {/* Percent readout near thumb on hover/drag/focus */}
        {(dragging || hoverPct != null || focused) && (
          <div
            className="scroll-rail__percent"
            style={{ top: `${topPct + heightPct / 2}%` }}
            aria-hidden
          >
            {Math.round(progress * 100)}%
          </div>
        )}
      </div>
      <button
        className="scroll-rail__btn scroll-rail__btn--down"
        aria-label="Scroll to bottom"
        onClick={(e) => {
          e.stopPropagation();
          scrollToPercent(100);
        }}
      >
        ↓
      </button>
    </div>
  );
}
