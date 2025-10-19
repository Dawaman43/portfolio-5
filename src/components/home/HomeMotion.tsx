"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HomeMotion() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-hero-item]");
      const heroMedia = gsap.utils.toArray<HTMLElement>("[data-hero-media]");
      const heroBadges = gsap.utils.toArray<HTMLElement>("[data-hero-badge]");

      if (heroItems.length) {
        gsap.from(heroItems, {
          opacity: 0,
          y: 28,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
        });
      }

      if (heroMedia.length) {
        gsap.from(heroMedia, {
          opacity: 0,
          y: 48,
          duration: 1,
          ease: "power3.out",
          delay: 0.15,
        });
      }

      if (heroBadges.length) {
        gsap.from(heroBadges, {
          opacity: 0,
          y: 18,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.14,
          delay: 0.25,
        });
      }

      const sections = gsap.utils.toArray<HTMLElement>("[data-section-reveal]");
      sections.forEach((section) => {
        const targets = section.querySelectorAll<HTMLElement>(
          "[data-reveal-child]"
        );

        if (!targets.length) return;

        gsap.from(targets, {
          opacity: 0,
          y: 32,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        });
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
