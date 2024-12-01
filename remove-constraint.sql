-- First, find the constraint name
SELECT conname
FROM pg_constraint 
WHERE conrelid = 'sophiena'::regclass 
  AND contype = 'u' 
  AND array_to_string(conkey, ',') = '2';  -- 2 is typically the position of email column

-- Then remove the unique constraint
ALTER TABLE sophiena
DROP CONSTRAINT IF EXISTS sophiena_email_key;
