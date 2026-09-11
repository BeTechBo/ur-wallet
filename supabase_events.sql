create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  location text not null,
  day_of_week integer not null,
  start_time text not null,
  end_time text,
  valid_until timestamp with time zone,
  is_recurring boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.events enable row level security;

-- Allow anyone to view events
create policy "Events are viewable by everyone." on public.events for select using (true);

-- Insert the requested recurring events
insert into public.events (title, location, day_of_week, start_time, end_time, valid_until, is_recurring)
values
('PDA Monday meeting', 'Saint Mary and Anba Beshoy Church', 1, '19:00', null, '2026-12-12 23:59:59Z', true),
('Tasbeha and Bible study', 'AUC', 1, '22:00', null, '2026-12-12 23:59:59Z', true),
('PDA Wednesday Meeting', 'AUC cubes', 3, '13:00', '14:00', '2026-12-12 23:59:59Z', true);

