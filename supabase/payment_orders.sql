-- Apply in Supabase SQL Editor before enabling Toss test payments.
create table if not exists public.payment_orders (
 order_id text primary key,
 user_id uuid not null references auth.users(id) on delete restrict,
 product_code text not null,
 order_name text not null,
 amount integer not null check (amount > 0),
 currency text not null default 'KRW' check (currency = 'KRW'),
 status text not null default 'pending' check (status in ('pending','confirming','paid','failed','review')),
 payment_key text unique,
 created_at timestamptz not null default now(),
 paid_at timestamptz,
 constraint payment_order_id_format check (order_id ~ '^[A-Za-z0-9_=-]{6,64}$')
);
create index if not exists payment_orders_user_idx on public.payment_orders(user_id,created_at desc);
alter table public.payment_orders enable row level security;
-- Members may view their own orders, but cannot create or mark them paid directly.
drop policy if exists payment_orders_read_own on public.payment_orders;
create policy payment_orders_read_own on public.payment_orders for select to authenticated using ((select auth.uid())=user_id);
-- All writes must be made by server with the service-role key after verification.
