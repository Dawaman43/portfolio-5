import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);

    if (!payload || typeof payload.metric !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const metricRecord = {
      metric: payload.metric,
      value: typeof payload.value === "number" ? payload.value : null,
      label: payload.label ?? null,
      path: payload.path ?? null,
      user_agent: payload.userAgent ?? null,
      metric_id: payload.id ?? null,
    };

    const { error } = await supabase.from("web_vitals").insert(metricRecord);

    if (error) {
      console.error("Failed to store web vitals", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Web vitals route error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
