create table if not exists public.birth_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 birth_date date not null,
 birth_time time,
 calendar_type text not null default 'solar' check (calendar_type in ('solar','lunar')),
 is_leap_month boolean not null default false,
 gender text check (gender in ('male','female','unspecified')),
 updated_at timestamptz not null default now()
);
alter table public.birth_profiles enable row level security;
create policy "birth_select" on public.birth_profiles for select to authenticated using ((select auth.uid())=user_id);
create policy "birth_insert" on public.birth_profiles for insert to authenticated with check ((select auth.uid())=user_id);
create policy "birth_update" on public.birth_profiles for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "birth_delete" on public.birth_profiles for delete to authenticated using ((select auth.uid())=user_id);
