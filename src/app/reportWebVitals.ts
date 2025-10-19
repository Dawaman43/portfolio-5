import type { NextWebVitalsMetric } from "next/app";

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    id: metric.id,
    metric: metric.name,
    value: Number(metric.value.toFixed(2)),
    label: metric.label,
    path: window.location.pathname,
    userAgent: navigator.userAgent,
  });

  const url = "/api/web-vitals";

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(url, blob);
  } else {
    fetch(url, {
      method: "POST",
      body,
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("Failed to send web vitals", error);
      }
    });
  }
}
