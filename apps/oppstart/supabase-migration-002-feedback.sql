-- ═══════════════════════════════════════════════════════════════════
-- EiraNova Oppstart — feedback schema
-- ═══════════════════════════════════════════════════════════════════
-- Migrering nr. 2 for eiranova-oppstart.
-- Kjøres én gang i Supabase SQL Editor.
--
-- Legger til feedback-tabell for forbedringsforslag fra de tre
-- medgrunnleggerne til Richard (eneste som ser denne fanen).
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.feedback (
  id            uuid primary key default gen_random_uuid(),
  from_user     text not null,                  -- 'Lise' | 'Therese' | 'Jeanett'
  message       text not null,
  created_at    timestamptz not null default now(),
  seen_at       timestamptz,                    -- null = ulest av Richard
  resolved_at   timestamptz                     -- null = ikke håndtert ennå
);

create index if not exists feedback_created_idx on public.feedback (created_at desc);
create index if not exists feedback_unseen_idx on public.feedback (seen_at) where seen_at is null;

-- ─────────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────────
-- Samme modell som de andre tabellene: RLS på, åpen policy for anon.
-- Sikkerheten ligger i at admin-passordet og admin-UI er kun kjent for Richard.

alter table public.feedback enable row level security;

drop policy if exists "anon_all_feedback" on public.feedback;
create policy "anon_all_feedback"
  on public.feedback for all
  to anon
  using (true) with check (true);

-- ─────────────────────────────────────────────────────────────────
-- REALTIME
-- ─────────────────────────────────────────────────────────────────
alter publication supabase_realtime add table public.feedback;

-- Ferdig.
-- Verifiser med: select count(*) from public.feedback;  -- skal være 0
