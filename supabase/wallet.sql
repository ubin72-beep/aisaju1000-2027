-- Apply after payment_orders.sql. 1 point = 1 KRW; each successful AI answer costs 100 points.
-- RPCs are callable only by service_role. Never grant wallet writes to clients.
create table if not exists public.wallets (
 user_id uuid primary key references auth.users(id) on delete restrict,
 balance integer not null default 0 check (balance >= 0),
 updated_at timestamptz not null default now()
);
create table if not exists public.wallet_ledger (
 id bigint generated always as identity primary key,
 user_id uuid not null references auth.users(id) on delete restrict,
 amount integer not null check (amount <> 0),
 balance_after integer not null check (balance_after >= 0),
 reference text not null unique,
 kind text not null check (kind in ('topup','consult','refund')),
 created_at timestamptz not null default now()
);
create index if not exists wallet_ledger_user_idx on public.wallet_ledger(user_id,created_at desc);
alter table public.wallets enable row level security;
alter table public.wallet_ledger enable row level security;
drop policy if exists wallet_read_own on public.wallets;
create policy wallet_read_own on public.wallets for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists wallet_ledger_read_own on public.wallet_ledger;
create policy wallet_ledger_read_own on public.wallet_ledger for select to authenticated using ((select auth.uid())=user_id);

create or replace function public.wallet_apply(p_user_id uuid,p_amount integer,p_kind text,p_reference text)
returns integer language plpgsql security definer set search_path = '' as $$
declare v_balance integer;
begin
 if p_user_id is null or p_amount is null or p_amount=0 or
    p_reference is null or length(p_reference)<6 or length(p_reference)>200 or
    (p_kind='topup' and p_amount<=0) or
    (p_kind='consult' and p_amount<>-100) or
    (p_kind='refund' and p_amount<>100) or
    p_kind not in ('topup','consult','refund') then
   raise exception 'invalid wallet transaction';
 end if;
 insert into public.wallets(user_id,balance) values(p_user_id,0)
 on conflict(user_id) do nothing;
 -- Lock row to serialize concurrent charges and credits.
 select balance into v_balance from public.wallets where user_id=p_user_id for update;
 if exists(select 1 from public.wallet_ledger where reference=p_reference) then
   raise exception 'duplicate wallet reference';
 end if;
 if v_balance+p_amount<0 then raise exception 'insufficient wallet balance'; end if;
 v_balance:=v_balance+p_amount;
 update public.wallets set balance=v_balance,updated_at=now() where user_id=p_user_id;
 insert into public.wallet_ledger(user_id,amount,balance_after,reference,kind)
 values(p_user_id,p_amount,v_balance,p_reference,p_kind);
 return v_balance;
end;$$;
revoke all on function public.wallet_apply(uuid,integer,text,text) from public,anon,authenticated;
grant execute on function public.wallet_apply(uuid,integer,text,text) to service_role;

-- Atomically credit only a confirmed paid order, once. Recovery can safely retry.
create or replace function public.wallet_credit_paid_order(p_order_id text)
returns integer language plpgsql security definer set search_path = '' as $$
declare v_order public.payment_orders%rowtype; v_balance integer;
begin
 select * into v_order from public.payment_orders where order_id=p_order_id for update;
 if not found or v_order.status<>'paid' or v_order.payment_key is null
 then raise exception 'order not paid'; end if;
 if v_order.product_code<>'wallet_topup' or v_order.amount<=0
 then raise exception 'not a wallet topup'; end if;
 if exists(select 1 from public.wallet_ledger where reference='topup_'||p_order_id)
 then
  select balance into v_balance from public.wallets where user_id=v_order.user_id;
  return v_balance;
 end if;
 select public.wallet_apply(v_order.user_id,v_order.amount,'topup','topup_'||p_order_id)
 into v_balance;
 return v_balance;
end;$$;
revoke all on function public.wallet_credit_paid_order(text) from public,anon,authenticated;
grant execute on function public.wallet_credit_paid_order(text) to service_role;
