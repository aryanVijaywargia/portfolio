create table if not exists public.scratchpad_notes (
  id bigint generated always as identity primary key,
  message text not null check (char_length(message) between 1 and 280),
  created_at timestamptz not null default now()
);

create index if not exists scratchpad_notes_created_at_idx
  on public.scratchpad_notes (created_at desc);

alter table public.scratchpad_notes enable row level security;

-- There are intentionally no public RLS policies. The site talks to this
-- table through /api/scratchpad, where input validation and rate limiting run.
