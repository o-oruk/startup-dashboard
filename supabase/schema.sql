-- Team Ops Dashboard — schema
-- Paste this whole file into the Supabase SQL editor and run it once.

-- ─────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  initials text not null default '',
  color text not null default '#4f46e5',
  role text not null default 'member',
  claimed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists objectives (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  objective_id uuid not null references objectives (id) on delete cascade,
  title text not null,
  weight int not null check (weight in (1, 2, 3)),
  assignee_id uuid references profiles (id) on delete set null,
  status text not null default 'backlog' check (status in ('backlog', 'daily', 'done')),
  scheduled_date date,
  completed_by uuid references profiles (id) on delete set null,
  completed_date date,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists important_dates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  note text,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists tasks_objective_id_idx on tasks (objective_id);
create index if not exists tasks_scheduled_date_idx on tasks (scheduled_date);
create index if not exists tasks_completed_date_idx on tasks (completed_date);
create index if not exists tasks_status_idx on tasks (status);

-- ─────────────────────────────────────────────────────────────
-- Auto-create a blank profile row whenever someone signs up.
-- The app then walks them through "claiming" it (name/initials/color).
-- ─────────────────────────────────────────────────────────────

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- Only the four of you can ever sign in (Supabase Auth), so once a
-- user is authenticated they get full read/write on shared data.
-- Anonymous (logged-out) access is blocked entirely.
-- ─────────────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table objectives enable row level security;
alter table tasks enable row level security;
alter table important_dates enable row level security;

create policy "profiles are readable by any signed-in user"
  on profiles for select
  to authenticated
  using (true);

create policy "a user can update only their own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "objectives full access for signed-in users"
  on objectives for all
  to authenticated
  using (true)
  with check (true);

create policy "tasks full access for signed-in users"
  on tasks for all
  to authenticated
  using (true)
  with check (true);

create policy "important_dates full access for signed-in users"
  on important_dates for all
  to authenticated
  using (true)
  with check (true);

-- ─────────────────────────────────────────────────────────────
-- Realtime (so the daily list / board update live across the team)
-- ─────────────────────────────────────────────────────────────

alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table objectives;
alter publication supabase_realtime add table important_dates;

-- ─────────────────────────────────────────────────────────────
-- Seed the three starting objectives
-- ─────────────────────────────────────────────────────────────

insert into objectives (title, position) values
  ('Conduct validation conversations', 0),
  ('Improve the model & develop our system', 1),
  ('Build our first real MVP', 2)
on conflict do nothing;
