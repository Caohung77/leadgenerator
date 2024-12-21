-- Rename the table from emails to sophiena
ALTER TABLE IF EXISTS emails RENAME TO sophiena;

-- Enable RLS on the sophiena table
ALTER TABLE sophiena ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous read access
CREATE POLICY "Allow anonymous read access"
ON sophiena
FOR SELECT
TO anon
USING (true);

-- Create policy to allow anonymous insert
CREATE POLICY "Allow anonymous insert"
ON sophiena
FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy to allow anonymous update for verification
CREATE POLICY "Allow anonymous update for verification"
ON sophiena
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
