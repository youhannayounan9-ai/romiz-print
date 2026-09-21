-- ─────────────────────────────────────────────────────────────────────────────
-- ROMIZ PRINT — Checkout orders table
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Customer & delivery
  customer_name text not null,
  customer_phone text not null,
  governorate text not null,
  address text not null,

  -- Order contents & totals (jsonb: array of {name, slug, quantity, unitPrice, lineTotal, options, image})
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  shipping_fee numeric(12,2) not null default 0,
  payment_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,

  -- Payment
  payment_method text not null,
  receipt_url text,
  status text not null default 'pending',

  -- Backfill column used by the admin quotes flow (kept in sync for consistency)
  contacted boolean not null default false
);

-- 2. Row Level Security: inserts allowed for anyone (checkout), reads restricted
-- NOTE: order ids are generated server-side so the API can insert without a
-- RETURNING read (anon has no SELECT policy — by design).
alter table public.orders enable row level security;

drop policy if exists "Allow public order inserts" on public.orders;
create policy "Allow public order inserts"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow authenticated order reads" on public.orders;
create policy "Allow authenticated order reads"
  on public.orders
  for select
  to authenticated
  using (true);

-- 2b. Quotes table: same insert policy (fixes silent quote-submission failures)
drop policy if exists "Allow public quote inserts" on public.quotes;
create policy "Allow public quote inserts"
  on public.quotes
  for insert
  to anon, authenticated
  with check (true);

-- 3. Realtime: broadcast INSERT events so the admin dashboard updates live
alter table public.orders replica identity full;
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table orders;
  end if;
end $$;

-- 4. Storage bucket for transfer screenshots (private; service-role uploads only)
insert into storage.buckets (id, name, public)
values ('order-receipts', 'order-receipts', false)
on conflict (id) do nothing;

-- Allow authenticated users (admin dashboard) to read receipts
create policy "Allow authenticated receipt reads"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'order-receipts');
