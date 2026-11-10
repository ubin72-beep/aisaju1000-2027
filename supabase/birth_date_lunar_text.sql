-- Run once in Supabase SQL Editor before enabling lunar 30-day dates.
-- PostgreSQL date cannot store valid lunar dates such as lunar February 30.
-- Preserve the user's entered calendar notation rather than misrepresenting it as Gregorian.
begin;
alter table public.birth_profiles
  alter column birth_date type text using to_char(birth_date, 'YYYY-MM-DD');
alter table public.birth_profiles
  add constraint birth_profiles_birth_date_format
  check (birth_date ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
commit;
