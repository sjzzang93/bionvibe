import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Helper function to get Supabase client with service role
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase credentials not configured");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// POST: Execute SQL to set up tables
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableName, sql } = body;

    if (!tableName || !sql) {
      return NextResponse.json(
        { success: false, message: "tableName and sql are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

    // Try to execute the SQL
    // Note: Supabase client doesn't directly support raw SQL execution
    // We need to check if the table exists by trying to query it

    // Split SQL into statements
    const statements = sql
      .split(";")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    // For each statement, we'll try to execute via the Supabase REST API
    // However, this is limited - the best approach is to guide the user to use SQL Editor

    // First, check if table already exists
    const { error: checkError } = await supabase
      .from(tableName)
      .select("*")
      .limit(1);

    if (!checkError) {
      return NextResponse.json({
        success: true,
        message: `Table '${tableName}' already exists!`,
      });
    }

    // If table doesn't exist, we can't create it via the JS client
    // Return the SQL for manual execution
    return NextResponse.json(
      {
        success: false,
        message: `Table '${tableName}' needs to be created manually. Please use the Supabase SQL Editor.`,
        sql: sql,
        sqlEditorUrl: `https://supabase.com/dashboard/project/${
          supabaseUrl.split("//")[1].split(".")[0]
        }/sql/new`,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
