-- Atomic per-user daily quota. Run with consultations.sql.
create table if not exists public.consultation_daily_usage (
 user_id uuid not null references auth.users(id) on delete cascade,
 usage_date date not null,
 used integer not null default 0 check (used between 0 and 3),
 primary key(user_id,usage_date)
);
alter table public.consultation_daily_usage enable row level security;
-- No direct client policies. Only service role invokes these functions.
create or replace function public.claim_consultation_slot(p_user_id uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare claimed integer;
begin
 if auth.role() <> 'service_role' then raise exception 'forbidden'; end if;
 insert into public.consultation_daily_usage(user_id,usage_date,used)
 values(p_user_id,(now() at time zone 'Asia/Seoul')::date,1)
 on conflict (user_id,usage_date) do update
 set used=public.consultation_daily_usage.used+1
 where public.consultation_daily_usage.used < 3
 returning used into claimed;
 return claimed is not null;
end;
$$;
create or replace function public.release_consultation_slot(p_user_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
 if auth.role() <> 'service_role' then raise exception 'forbidden'; end if;
 update public.consultation_daily_usage set used=greatest(used-1,0)
 where user_id=p_user_id and usage_date=(now() at time zone 'Asia/Seoul')::date;
end;
$$;
revoke all on function public.claim_consultation_slot(uuid) from public,anon,authenticated;
revoke all on function public.release_consultation_slot(uuid) from public,anon,authenticated;
grant execute on function public.claim_consultation_slot(uuid) to service_role;
grant execute on function public.release_consultation_slot(uuid) to service_role;
