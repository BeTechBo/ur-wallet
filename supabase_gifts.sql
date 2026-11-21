-- Gift Budgets Table: tracks each user's monthly gifting budget
create table if not exists public.gift_budgets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  month_year text not null, -- format: 'YYYY-MM'
  budget_remaining integer not null default 30,
  budget_total integer not null default 30,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, month_year)
);

-- Gifts Table: tracks individual gifts sent between members
create table if not exists public.gifts (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  coins_amount integer not null check (coins_amount >= 1),
  verse_text text,
  verse_reference text,
  personal_note text,
  token text not null unique,
  opened_at timestamp with time zone,
  sent_at timestamp with time zone default timezone('utc'::text, now()) not null,
  month_year text not null -- format: 'YYYY-MM'
);

-- Enable RLS
alter table public.gift_budgets enable row level security;
alter table public.gifts enable row level security;

-- Gift Budgets Policies
drop policy if exists "Users can view their own gift budget" on public.gift_budgets;
create policy "Users can view their own gift budget" on public.gift_budgets
  for select using (auth.uid() = user_id);

drop policy if exists "Admins can manage gift budgets" on public.gift_budgets;
create policy "Admins can manage gift budgets" on public.gift_budgets
  for all using (
    auth.uid() in (select id from profiles where role = 'admin')
  );

-- Gifts Policies
drop policy if exists "Users can view gifts they sent or received" on public.gifts;
create policy "Users can view gifts they sent or received" on public.gifts
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);

drop policy if exists "Admins can manage gifts" on public.gifts;
create policy "Admins can manage gifts" on public.gifts
  for all using (
    auth.uid() in (select id from profiles where role = 'admin')
  );

-- Index for fast token lookups
create index if not exists gifts_token_idx on public.gifts(token);
create index if not exists gifts_recipient_month_idx on public.gifts(recipient_id, month_year);
create index if not exists gifts_sender_month_idx on public.gifts(sender_id, month_year);
