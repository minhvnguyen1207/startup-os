# Supabase Setup — Cross-device sync

Follow these steps once. Takes about 15 minutes.

---

## 1. Create a Supabase project

1. Go to https://supabase.com and sign up (free, no credit card)
2. Click "New project"
3. Name it `startup-os`, choose a strong password, pick region **Southeast Asia (Singapore)** for best latency from Melbourne
4. Wait ~2 minutes for it to provision

---

## 2. Create the database tables

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Paste the entire block below and click **Run**

```sql
-- Tasks table
create table public.tasks (
  user_id uuid references auth.users not null,
  task_key text not null,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, task_key)
);

-- Notes table (per-phase)
create table public.notes (
  user_id uuid references auth.users not null,
  phase_id text not null,
  content text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, phase_id)
);

-- Journal entries table
create table public.journal_entries (
  id text not null,
  user_id uuid references auth.users not null,
  content text not null,
  tag text not null default 'general',
  created_at timestamptz not null default now(),
  primary key (id)
);

-- Row Level Security (each user only sees their own data)
alter table public.tasks enable row level security;
alter table public.notes enable row level security;
alter table public.journal_entries enable row level security;

create policy "Own tasks" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Own notes" on public.notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Own journal" on public.journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

---

## 3. Get your project credentials

1. Go to **Project Settings** → **API** (left sidebar)
2. Copy two values:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon public** key — long string starting with `eyJ...`

---

## 4. Add credentials to local dev

In your `startup-os` folder, create a file called `.env` (it's already gitignored):

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

Replace the values with your actual URL and key.

---

## 5. Add credentials to Vercel (for the live site)

1. Go to https://vercel.com → your `startup-os` project
2. **Settings** → **Environment Variables**
3. Add two variables:
   - Name: `VITE_SUPABASE_URL` → Value: your project URL
   - Name: `VITE_SUPABASE_ANON_KEY` → Value: your anon key
4. Click Save → go to **Deployments** → **Redeploy** (top deployment, three dots)

---

## 6. Push and test

```bash
cd "/Users/minhnguyen/Desktop/Coffee Importation/startup-os"
git add .
git commit -m "add supabase sync"
git push
```

Open the live URL → enter your email → check email → click magic link → you're in.
Open the same URL on your phone → enter same email → click link → same data.

---

## How it works

- Sign in with your email once per device (magic link, no password)
- Session stays active — you won't be asked again unless you sign out
- Every task toggle syncs instantly to Supabase
- Notes save automatically 600ms after you stop typing
- Journal entries save on click
- Any device signed in with the same email sees the same data
