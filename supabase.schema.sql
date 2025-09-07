-- Supabase schema for Duostudy

-- Users table will be managed by Supabase Auth (email/password).
-- Store additional profile data in public.profiles if needed.

-- Progress table: stores per-user JSON data (skills, flashcards, lessons)
create table if not exists public.progress (
  user_id text primary key,
  data jsonb,
  updated_at timestamptz default now()
);

-- Optional: courses table (store generated courses)
create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  user_id text references auth.users(id),
  title text,
  description text,
  flashcards jsonb,
  lessons jsonb,
  created_at timestamptz default now()
);