-- Run in Supabase SQL Editor after reviewing backups and dependent views/functions.
-- PostgreSQL date cannot represent a valid lunar month day such as lunar 02-30.
-- This migration changes the stored calendar notation to ISO-shaped text.
begin;
alter table public.birth_profiles
  alter column birth_date type text using birth_date::text;
alter table public.birth_profiles
  drop constraint if exists birth_profiles_birth_date_format;
alter table public.birth_profiles
  add constraint birth_profiles_birth_date_format
  check (birth_date ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
alter table public.birth_profiles
  drop constraint if exists birth_profiles_leap_requires_lunar;
alter table public.birth_profiles
  add constraint birth_profiles_leap_requires_lunar
  check (not is_leap_month or calendar_type = 'lunar');
commit;

-- Verification (run separately):
-- select column_name,data_type from information_schema.columns
-- where table_schema='public' and table_name='birth_profiles' and column_name='birth_date';
-- Expected: text. Application must validate real lunar months separately.
