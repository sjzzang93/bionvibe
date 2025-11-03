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
