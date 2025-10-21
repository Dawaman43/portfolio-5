import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

// Lightweight index of public blog slugs for sitemap
export const revalidate = 60;

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("slug, updated_at")
      .order("updated_at", { ascending: false })
      .limit(1000);
    if (error) throw error;
    type Row = { slug: string; updated_at: string | null };
    const items = (data ?? []).map((row) => ({
      slug: (row as Row).slug,
      updated_at: (row as Row).updated_at,
    }));
    return NextResponse.json(items, { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
