"use server";

import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("guestbook_hearts")
      .select("id, count")
      .order("id", { ascending: true })
      .limit(1);

    if (error) {
      console.error("[guestbook][heart][GET]", error);
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    if (!data || data.length === 0) {
      const { data: inserted } = await supabase
        .from("guestbook_hearts")
        .insert({ count: 0 })
        .select("count")
        .single();
      return NextResponse.json({ count: inserted?.count ?? 0 });
    }

    return NextResponse.json({ count: data[0].count });
  } catch (error) {
    console.error("[guestbook][heart][GET] unexpected", error);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { increment = 1 } = await req.json().catch(() => ({ increment: 1 }));
    const supabase = getServerSupabase();

    const { data, error } = await supabase
      .from("guestbook_hearts")
      .select("id, count")
      .order("id", { ascending: true })
      .limit(1);

    if (error) {
      console.error("[guestbook][heart][POST] select error", error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    if (!data || data.length === 0) {
      const { error: insertError } = await supabase
        .from("guestbook_hearts")
        .insert({ count: increment });

      if (insertError) {
        throw insertError;
      }

      return NextResponse.json({ success: true, count: increment });
    }

    const current = data[0];
    const nextCount = current.count + increment;

    const { error: updateError } = await supabase
      .from("guestbook_hearts")
      .update({ count: nextCount, updated_at: new Date().toISOString() })
      .eq("id", current.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, count: nextCount });
  } catch (error) {
    console.error("[guestbook][heart][POST] unexpected", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
