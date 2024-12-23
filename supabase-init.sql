-- Create emails table
drop table if exists emails;

-- Create the emails table with all required columns
create table emails (
    id uuid default gen_random_uuid() primary key,
    email text not null unique,
    industry text,
    location text,
    verified boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add some indexes for better performance
create index emails_email_idx on emails(email);
create index emails_verified_idx on emails(verified);
