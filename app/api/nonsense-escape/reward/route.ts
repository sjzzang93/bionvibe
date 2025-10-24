"use server";

import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

const getClientIp = (req: NextRequest) => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      return parts[0];
    }
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return req.ip ?? "local-dev";
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const screenshotUrl = typeof body?.screenshotUrl === "string" ? body.screenshotUrl.trim() : "";

    if (!name || !email || !screenshotUrl) {
      return NextResponse.json({ success: false, message: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    const supabase = getServerSupabase();
    const ip = getClientIp(request);

    const { error } = await supabase.from("nonsense_escape_rewards").insert({
      name,
      email,
      screenshot_url: screenshotUrl,
      ip
    });

    if (error) {
      console.error("[nonsense-escape][reward] insert error", error);
      return NextResponse.json({ success: false, message: "신청 처리 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[nonsense-escape][reward] unexpected", error);
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
