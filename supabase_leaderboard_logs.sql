-- Create Leaderboard Logs Table
create table if not exists public.leaderboard_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.leaderboard_logs enable row level security;

-- Policies for Leaderboard Logs
drop policy if exists "Admins can insert leaderboard logs" on public.leaderboard_logs;
create policy "Admins can insert leaderboard logs" on public.leaderboard_logs
  for insert with check (
    auth.uid() in (select id from profiles where role = 'admin')
  );

drop policy if exists "Admins can view leaderboard logs" on public.leaderboard_logs;
create policy "Admins can view leaderboard logs" on public.leaderboard_logs
  for select using (
    auth.uid() in (select id from profiles where role = 'admin')
  );
