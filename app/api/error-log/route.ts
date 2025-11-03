import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Helper function to get Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseKey);
}

// Helper function to parse user agent
function parseUserAgent(userAgent: string) {
  let browser = "Unknown";
  let os = "Unknown";
  let deviceType = "Desktop";

  // Detect browser
  if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari")) browser = "Safari";
  else if (userAgent.includes("Edge")) browser = "Edge";

  // Detect OS
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac")) os = "macOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";

  // Detect device type
  if (userAgent.includes("Mobile") || userAgent.includes("Android")) deviceType = "Mobile";
  else if (userAgent.includes("Tablet") || userAgent.includes("iPad")) deviceType = "Tablet";

  return { browser, os, deviceType };
}

// POST: Log an error
export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();

    const body = await request.json();
    const {
      errorMessage,
      errorStack,
      errorType,
      appId,
      appUrl,
      pageUrl,
    } = body;

    // Validate required fields
    if (!errorMessage) {
      return NextResponse.json(
        { success: false, message: "errorMessage is required" },
        { status: 400 }
      );
    }

    // Get user agent and IP
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "Unknown";

    // Parse user agent
    const { browser, os, deviceType } = parseUserAgent(userAgent);

    // Check if similar error already exists (within last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { data: existingError } = await supabase
      .from("error_logs")
      .select("id, occurrence_count")
      .eq("error_message", errorMessage)
      .eq("app_url", appUrl || "")
      .eq("page_url", pageUrl || "")
      .gte("created_at", fiveMinutesAgo)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (existingError) {
      // Update existing error with incremented count
      const { error: updateError } = await supabase
        .from("error_logs")
        .update({
          occurrence_count: existingError.occurrence_count + 1,
          last_occurred_at: new Date().toISOString(),
        })
        .eq("id", existingError.id);

      if (updateError) {
        console.error("Failed to update error count:", updateError);
      }

      return NextResponse.json({
        success: true,
        message: "Error updated (duplicate)",
        errorId: existingError.id,
      });
    }

    // Insert new error log
    const { data, error } = await supabase
      .from("error_logs")
      .insert({
        error_message: errorMessage,
        error_stack: errorStack || null,
        error_type: errorType || "Unknown",
        app_id: appId || null,
        app_url: appUrl || null,
        page_url: pageUrl || null,
        user_agent: userAgent,
        ip_address: ipAddress,
        browser,
        os,
        device_type: deviceType,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to log error", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Error logged successfully",
      errorId: data.id,
    });
  } catch (error) {
    console.error("Error logging error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: Retrieve error logs
export async function GET(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);

    const limit = parseInt(searchParams.get("limit") || "100");
    const appId = searchParams.get("appId");
    const errorType = searchParams.get("errorType");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = supabase
      .from("error_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    // Apply filters
    if (appId) {
      query = query.eq("app_id", appId);
    }

    if (errorType) {
      query = query.eq("error_type", errorType);
    }

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch error logs:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch error logs" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error("Error fetching error logs:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Clear old error logs
export async function DELETE(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);

    const daysOld = parseInt(searchParams.get("daysOld") || "7");
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from("error_logs")
      .delete()
      .lt("created_at", cutoffDate);

    if (error) {
      console.error("Failed to delete old error logs:", error);
      return NextResponse.json(
        { success: false, message: "Failed to delete error logs" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Deleted error logs older than ${daysOld} days`,
    });
  } catch (error) {
    console.error("Error deleting error logs:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
