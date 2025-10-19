"use client";

import { HTMLAttributes, PropsWithChildren, useRef } from "react";

type TiltCardProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    maxTilt?: number; // degrees
    scale?: number; // zoom on hover
  }
>;

export default function TiltCard({
  children,
  maxTilt = 8,
  scale = 1.02,
  className,
  ...rest
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rx = Math.max(Math.min(-dy * maxTilt, maxTilt), -maxTilt);
    const ry = Math.max(Math.min(dx * maxTilt, maxTilt), -maxTilt);
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </div>
  );
}
