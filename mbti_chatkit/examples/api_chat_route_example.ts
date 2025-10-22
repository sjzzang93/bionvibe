import { NextRequest } from "next/server";
export const runtime = "edge";
export async function POST(req: NextRequest) {
  const { message, mbti } = await req.json();
  return new Response(JSON.stringify({
    role: "assistant",
    text: `[${mbti}] ${message} — 데모 응답입니다.`
  }), { headers: { "Content-Type": "application/json" } });
}