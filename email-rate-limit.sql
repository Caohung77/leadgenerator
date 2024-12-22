-- Create a table to track email usage
CREATE TABLE IF NOT EXISTS email_usage (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(email)
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_usage_email ON email_usage(email);

-- Enable RLS
ALTER TABLE email_usage ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserting and reading own email
CREATE POLICY "Allow anonymous insert" ON email_usage
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON email_usage
    FOR SELECT TO anon
    USING (true);
