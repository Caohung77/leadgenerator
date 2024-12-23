-- Add usage_count column to email_usage table
ALTER TABLE email_usage ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;

-- Update existing records to have usage_count = 1
UPDATE email_usage SET usage_count = 1 WHERE usage_count IS NULL;
