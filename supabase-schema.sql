-- Atelier Planner — Supabase Schema
-- Idempotent — safe to re-run multiple times

-- 1. Profiles (auto-created on signup via trigger)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can read own profile' and tablename = 'profiles') then
    create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own profile' and tablename = 'profiles') then
    create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert own profile' and tablename = 'profiles') then
    create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
  end if;
end $$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Tasks
create table if not exists public.tasks (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  date text not null,
  time text,
  duration_min int,
  category text not null default 'personal',
  completed boolean not null default false,
  created_at bigint not null default extract(epoch from now()) * 1000
);

alter table public.tasks enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can CRUD own tasks' and tablename = 'tasks') then
    create policy "Users can CRUD own tasks" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

create index if not exists idx_tasks_user_date on public.tasks (user_id, date);

-- 3. Habits
create table if not exists public.habits (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  icon text not null default 'Activity',
  color text not null default 'sage',
  frequency text not null default 'daily',
  custom_days int[],
  completed_dates text[] default '{}',
  created_at bigint not null default extract(epoch from now()) * 1000
);

alter table public.habits enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can CRUD own habits' and tablename = 'habits') then
    create policy "Users can CRUD own habits" on public.habits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

-- 4. Journal entries
create table if not exists public.journal_entries (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date text not null,
  content text not null default '',
  mood smallint,
  updated_at bigint not null default extract(epoch from now()) * 1000,
  unique(user_id, date)
);

alter table public.journal_entries enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can CRUD own journal' and tablename = 'journal_entries') then
    create policy "Users can CRUD own journal" on public.journal_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

-- 5. Pomodoro sessions
create table if not exists public.pomodoro_sessions (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date text not null,
  type text not null,
  duration_min int not null default 25,
  completed boolean not null default true,
  started_at bigint not null default extract(epoch from now()) * 1000
);

alter table public.pomodoro_sessions enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can CRUD own pomodoros' and tablename = 'pomodoro_sessions') then
    create policy "Users can CRUD own pomodoros" on public.pomodoro_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

create index if not exists idx_pomodoro_user_date on public.pomodoro_sessions (user_id, date);

-- 6. Settings (single row per user, stored as jsonb)
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now() not null
);

alter table public.user_settings enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can CRUD own settings' and tablename = 'user_settings') then
    create policy "Users can CRUD own settings" on public.user_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

-- 7. Project briefs (AI Project Planner)
create table if not exists public.project_briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  idea text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.project_briefs enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can CRUD own briefs' and tablename = 'project_briefs') then
    create policy "Users can CRUD own briefs" on public.project_briefs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

create index if not exists idx_briefs_user on public.project_briefs (user_id, created_at desc);
