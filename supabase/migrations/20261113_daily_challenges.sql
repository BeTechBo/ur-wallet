-- Table: daily_challenges
-- One row per day (the admin selects which character is active for which day)
create table if not exists daily_challenges (
  id uuid primary key default gen_random_uuid(),
  character_id text not null,
  active_date date not null unique,
  created_at timestamptz default now()
);

-- Table: challenge_submissions
-- Records who solved the challenge and when (for ranking + coin awarding)
create table if not exists challenge_submissions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references daily_challenges(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  solved_at timestamptz default now(),
  coins_awarded integer not null default 0,
  unique(challenge_id, user_id)
);

-- Indexes
create index if not exists idx_challenge_submissions_challenge_id on challenge_submissions(challenge_id);
create index if not exists idx_challenge_submissions_user_id on challenge_submissions(user_id);
create index if not exists idx_daily_challenges_active_date on daily_challenges(active_date);
