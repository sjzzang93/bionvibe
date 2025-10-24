"use server";

import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

const getClientIp = (req: NextRequest) => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length > 0) return parts[0];
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  // fallback for local 개발 환경 (127.0.0.1 등)
  return "local-dev";
};

export async function POST(req: NextRequest) {
  try {
    const supabase = getServerSupabase();
    const ip = getClientIp(req);
    const today = new Date().toISOString().slice(0, 10);

    const { data: existing, error: selectError } = await supabase
      .from("nonsense_escape_attempts")
      .select("id")
      .eq("ip", ip)
      .eq("play_date", today)
      .maybeSingle();

    if (selectError && selectError.code !== "PGRST116") {
      console.error("[nonsense-escape][entry] select error", selectError);
      return NextResponse.json(
        { allowed: false, reason: "server_error" },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { allowed: false, reason: "limit_reached" },
        { status: 200 }
      );
    }

    const { error: insertError } = await supabase
      .from("nonsense_escape_attempts")
      .insert({ ip, play_date: today });

    if (insertError) {
      console.error("[nonsense-escape][entry] insert error", insertError);
      return NextResponse.json(
        { allowed: false, reason: "server_error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ allowed: true });
  } catch (error) {
    console.error("[nonsense-escape][entry] unexpected", error);
    return NextResponse.json(
      { allowed: false, reason: "server_error" },
      { status: 500 }
    );
  }
}
