-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Create Memory Albums Table
create table if not exists public.memory_albums (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  event_date date,
  cover_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Memory Photos Table
create table if not exists public.memory_photos (
  id uuid default uuid_generate_v4() primary key,
  album_id uuid references public.memory_albums(id) on delete cascade not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.memory_albums enable row level security;
alter table public.memory_photos enable row level security;

-- Policies for memory_albums
drop policy if exists "Authenticated users can view albums" on public.memory_albums;
create policy "Authenticated users can view albums" on public.memory_albums
  for select using (auth.role() = 'authenticated');

drop policy if exists "Admins can insert albums" on public.memory_albums;
create policy "Admins can insert albums" on public.memory_albums
  for insert with check (
    auth.uid() in (select id from public.profiles where role = 'admin')
  );

drop policy if exists "Admins can update albums" on public.memory_albums;
create policy "Admins can update albums" on public.memory_albums
  for update using (
    auth.uid() in (select id from public.profiles where role = 'admin')
  );

drop policy if exists "Admins can delete albums" on public.memory_albums;
create policy "Admins can delete albums" on public.memory_albums
  for delete using (
    auth.uid() in (select id from public.profiles where role = 'admin')
  );

-- Policies for memory_photos
drop policy if exists "Authenticated users can view photos" on public.memory_photos;
create policy "Authenticated users can view photos" on public.memory_photos
  for select using (auth.role() = 'authenticated');

drop policy if exists "Admins can insert photos" on public.memory_photos;
create policy "Admins can insert photos" on public.memory_photos
  for insert with check (
    auth.uid() in (select id from public.profiles where role = 'admin')
  );

drop policy if exists "Admins can delete photos" on public.memory_photos;
create policy "Admins can delete photos" on public.memory_photos
  for delete using (
    auth.uid() in (select id from public.profiles where role = 'admin')
  );

-- 3. Storage Bucket Configuration for 'memories'
insert into storage.buckets (id, name, public)
values ('memories', 'memories', true)
on conflict (id) do update set public = true;

-- Storage policies for 'memories' bucket
drop policy if exists "Anyone can view memories photos" on storage.objects;
create policy "Anyone can view memories photos" on storage.objects
  for select using (bucket_id = 'memories');

drop policy if exists "Admins can upload memories photos" on storage.objects;
create policy "Admins can upload memories photos" on storage.objects
  for insert with check (
    bucket_id = 'memories' and
    auth.uid() in (select id from public.profiles where role = 'admin')
  );

drop policy if exists "Admins can update memories photos" on storage.objects;
create policy "Admins can update memories photos" on storage.objects
  for update using (
    bucket_id = 'memories' and
    auth.uid() in (select id from public.profiles where role = 'admin')
  );

drop policy if exists "Admins can delete memories photos" on storage.objects;
create policy "Admins can delete memories photos" on storage.objects
  for delete using (
    bucket_id = 'memories' and
    auth.uid() in (select id from public.profiles where role = 'admin')
  );
