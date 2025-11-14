-- business_ads table & RLS policies
create table if not exists business_ads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  province text,
  district text,
  working_type text,
  working_hours text,
  created_at timestamptz default now()
);

-- Index for faster listing
create index if not exists business_ads_user_id_idx on business_ads(user_id);
create index if not exists business_ads_created_idx on business_ads(created_at desc);

-- Enable RLS
alter table business_ads enable row level security;

-- Policies: owner full control, others read
create policy "Business ads select for all" on business_ads
  for select using (true);
create policy "Business ads insert for owner" on business_ads
  for insert with check (auth.uid() = user_id);
create policy "Business ads update for owner" on business_ads
  for update using (auth.uid() = user_id);
create policy "Business ads delete for owner" on business_ads
  for delete using (auth.uid() = user_id);

-- NOTE: Couriers are listed directly from couriers table; no courier_ads table required.

-- Optional public view for couriers to simplify RLS for business users reading basic fields
create view if not exists couriers_public as
  select id, user_id, first_name, last_name, avatar_url, phone, province, district, license_type, working_type, working_hours, created_at
  from couriers;

grant select on couriers_public to anon, authenticated;
