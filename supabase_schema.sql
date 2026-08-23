-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  role text default 'user' check (role in ('admin', 'user')),
  total_points integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Transactions Table
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  points_added integer not null,
  event_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.transactions enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Admins can update any profile" on profiles
  for update using (
    auth.uid() in (select id from profiles where role = 'admin')
  );

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Policies for Transactions
create policy "Users can view their own transactions" on transactions
  for select using (auth.uid() = user_id);

create policy "Admins can view all transactions" on transactions
  for select using (
    auth.uid() in (select id from profiles where role = 'admin')
  );

create policy "Admins can insert transactions" on transactions
  for insert with check (
    auth.uid() in (select id from profiles where role = 'admin')
  );

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, role, total_points)
  values (new.id, new.email, 'user', 0);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create a profile for new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger to update total_points in profiles when a transaction is added
create or replace function public.update_total_points()
returns trigger as $$
begin
  update public.profiles
  set total_points = total_points + new.points_added
  where id = new.user_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_transaction_inserted
  after insert on public.transactions
  for each row execute procedure public.update_total_points();
