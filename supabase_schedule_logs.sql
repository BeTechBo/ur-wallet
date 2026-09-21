-- Create Schedule Logs Table
create table public.schedule_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.schedule_logs enable row level security;

-- Policies for Schedule Logs
create policy "Admins can insert schedule logs" on public.schedule_logs
  for insert with check (
    auth.uid() in (select id from profiles where role = 'admin')
  );

create policy "Admins can view schedule logs" on public.schedule_logs
  for select using (
    auth.uid() in (select id from profiles where role = 'admin')
  );
