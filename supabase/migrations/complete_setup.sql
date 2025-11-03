-- ===================================================================
-- Complete Supabase Database Setup for BION
-- ===================================================================
-- Run this script in Supabase SQL Editor if automatic setup fails
-- URL: https://supabase.com/dashboard/project/vfoecqunkmqxktgywkdp/sql/new
-- ===================================================================

-- ===================================================================
-- 1. ERROR_LOGS TABLE
-- ===================================================================
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


-- ===================================================================
-- 2. SECRET_VISITORS TABLE
-- ===================================================================
-- Create secret_visitors table for tracking visitors
CREATE TABLE IF NOT EXISTS secret_visitors (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET NOT NULL,
  user_agent TEXT,
  browser VARCHAR(100),
  os VARCHAR(100),
  device_type VARCHAR(50),
  page_url TEXT,
  referrer TEXT,
  UNIQUE(ip_address, date_trunc('day', created_at))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_secret_visitors_created_at ON secret_visitors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_secret_visitors_ip ON secret_visitors(ip_address);

-- Enable RLS
ALTER TABLE secret_visitors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow visitor logging" ON secret_visitors;
DROP POLICY IF EXISTS "Allow reads for authenticated users" ON secret_visitors;

-- Create policies
CREATE POLICY "Allow visitor logging"
  ON secret_visitors
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow reads for authenticated users"
  ON secret_visitors
  FOR SELECT
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE secret_visitors IS 'Tracks visitors to the secret vault page';


-- ===================================================================
-- 3. SECRET_VISITOR_STATS VIEW
-- ===================================================================
-- Create view for visitor statistics
DROP VIEW IF EXISTS secret_visitor_stats;

CREATE VIEW secret_visitor_stats AS
SELECT
  date_trunc('day', created_at) as visit_date,
  COUNT(*) as visitor_count,
  COUNT(DISTINCT ip_address) as unique_visitors,
  COUNT(*) FILTER (WHERE device_type = 'Mobile') as mobile_visitors,
  COUNT(*) FILTER (WHERE device_type = 'Desktop') as desktop_visitors,
  COUNT(*) FILTER (WHERE device_type = 'Tablet') as tablet_visitors
FROM secret_visitors
GROUP BY date_trunc('day', created_at)
ORDER BY visit_date DESC;

-- Add comment to view
COMMENT ON VIEW secret_visitor_stats IS 'Aggregated daily statistics for secret vault visitors';


-- ===================================================================
-- VERIFICATION QUERIES
-- ===================================================================
-- Run these after setup to verify everything works:

-- Check error_logs table
-- SELECT COUNT(*) as error_logs_count FROM error_logs;

-- Check secret_visitors table
-- SELECT COUNT(*) as visitors_count FROM secret_visitors;

-- Check secret_visitor_stats view
-- SELECT * FROM secret_visitor_stats LIMIT 5;

-- ===================================================================
-- SETUP COMPLETE!
-- ===================================================================
