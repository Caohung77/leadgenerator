-- Drop existing table if it exists
DROP TABLE IF EXISTS email_usage;

-- Create a table to track email usage
CREATE TABLE email_usage (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(email)
);

-- Create an index on email for faster lookups
CREATE INDEX idx_email_usage_email ON email_usage(email);

-- Enable RLS
ALTER TABLE email_usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert" ON email_usage;
DROP POLICY IF EXISTS "Allow anonymous select" ON email_usage;
DROP POLICY IF EXISTS "Allow anonymous update" ON email_usage;

-- Create policies
CREATE POLICY "Allow anonymous insert" ON email_usage
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON email_usage
    FOR SELECT TO anon
    USING (true);

CREATE POLICY "Allow anonymous update" ON email_usage
    FOR UPDATE TO anon
    USING (true)
    WITH CHECK (true);
