import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Helper function to get Supabase client with service role
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

// POST: Setup error_logs table
export async function POST() {
  try {
    const supabase = getSupabaseAdmin();

    // SQL to create the error_logs table
    const createTableSQL = `
-- Create error_logs table for error monitoring
CREATE TABLE IF NOT EXISTS error_logs (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Error details
  error_message TEXT NOT NULL,
  error_stack TEXT,
  error_type VARCHAR(255),

  -- Context
  app_id VARCHAR(255),
  app_url TEXT,
  page_url TEXT,

  -- User info
  user_agent TEXT,
  ip_address INET,

  -- Additional metadata
  browser VARCHAR(100),
  os VARCHAR(100),
  device_type VARCHAR(50),

  -- Count for duplicate errors
  occurrence_count INTEGER DEFAULT 1,
  last_occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_app_id ON error_logs(app_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_type ON error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_app_url ON error_logs(app_url);

-- Create a composite index for finding duplicate errors
CREATE INDEX IF NOT EXISTS idx_error_logs_dedup ON error_logs(error_message, app_url, page_url);

-- Enable Row Level Security (RLS)
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow error logging from anyone" ON error_logs;
DROP POLICY IF EXISTS "Allow reads for authenticated users only" ON error_logs;
DROP POLICY IF EXISTS "Allow deletes for authenticated users only" ON error_logs;

-- Create policy to allow inserts from anyone (for error reporting)
CREATE POLICY "Allow error logging from anyone"
  ON error_logs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy to allow reads only for authenticated users (admin)
CREATE POLICY "Allow reads for authenticated users only"
  ON error_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow deletes only for authenticated users (admin)
CREATE POLICY "Allow deletes for authenticated users only"
  ON error_logs
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE error_logs IS 'Stores client-side and server-side error logs for monitoring';
`;

    // Execute SQL using Supabase RPC
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });

    if (error) {
      // If RPC doesn't work, try direct query
      console.error('RPC failed, trying direct query:', error);

      // Split SQL into individual statements
      const statements = createTableSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        const { error: execError } = await supabase.from('error_logs').select('*').limit(0);

        if (execError && execError.message.includes("does not exist")) {
          return NextResponse.json({
            success: false,
            message: "Unable to create table automatically. Please use Supabase SQL Editor to run the migration manually.",
            sql: createTableSQL,
          }, { status: 500 });
        }
      }
    }

    // Verify table was created
    const { error: verifyError } = await supabase
      .from('error_logs')
      .select('id')
      .limit(1);

    if (verifyError) {
      return NextResponse.json({
        success: false,
        message: "Table creation verification failed. Please run SQL manually in Supabase Studio.",
        sql: createTableSQL,
        error: verifyError.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "error_logs table created successfully!",
    });

  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }, { status: 500 });
  }
}
