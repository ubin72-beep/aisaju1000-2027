-- Apply in Supabase SQL Editor before enabling AI consultation.
create table if not exists public.consultations (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 question text not null check (char_length(question) between 1 and 1000),
 answer text not null,
 created_at timestamptz not null default now()
);
create index if not exists consultations_user_created_idx on public.consultations(user_id,created_at desc);
alter table public.consultations enable row level security;
create policy "consultations_owner_read" on public.consultations for select to authenticated using ((select auth.uid())=user_id);
-- Writes only through server-side service role after user verification.
