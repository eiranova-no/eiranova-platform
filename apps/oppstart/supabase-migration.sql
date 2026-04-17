-- ═══════════════════════════════════════════════════════════════════
-- EiraNova Oppstart — Supabase schema
-- ═══════════════════════════════════════════════════════════════════
-- Kjøres én gang i Supabase SQL Editor for prosjekt eiranova-oppstart.
-- Oppretter delt state for Lise, Therese og Jeanett.
--
-- Designprinsipp: appen er midlertidig. Skjemaet er bevisst enkelt —
-- én tabell per konsept, ingen joins i app-koden, enkel RLS.
-- ═══════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────
-- 1. TASKS — alle oppgaver (både standard og egne)
-- ─────────────────────────────────────────────────────────────────
-- Standard-oppgaver seedes med is_default=true og en stabil default_id
-- som matcher id-ene i index.html. Egne oppgaver får is_default=false.

create table if not exists public.tasks (
  id           uuid primary key default gen_random_uuid(),
  default_id   text unique,                    -- stabil ID for standard-oppgaver (p-w1-1, c-01-1 ...)
  section_id   text not null,                  -- hvilken seksjon (plan-w1, c-01, ...)
  kind         text not null,                  -- 'plan' eller 'compliance'
  text         text not null,
  area         text,
  owner        text,
  is_default   boolean not null default false,
  is_deleted   boolean not null default false, -- soft delete for default-oppgaver
  sort_order   integer not null default 0,
  created_by   text,                           -- 'Lise' | 'Therese' | 'Jeanett' | null (for seeds)
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists tasks_section_idx on public.tasks (section_id, sort_order);
create index if not exists tasks_kind_idx on public.tasks (kind);

-- ─────────────────────────────────────────────────────────────────
-- 2. COMPLETIONS — avkryssing per oppgave
-- ─────────────────────────────────────────────────────────────────
-- Én rad = én avkryssing. Historikk beholdes (uncheck sletter raden).

create table if not exists public.completions (
  task_id      uuid primary key references public.tasks(id) on delete cascade,
  completed_by text not null,                  -- 'Lise' | 'Therese' | 'Jeanett'
  completed_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────
-- 3. COMMENTS — kommentarer per oppgave
-- ─────────────────────────────────────────────────────────────────

create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references public.tasks(id) on delete cascade,
  author     text not null,                    -- 'Lise' | 'Therese' | 'Jeanett'
  body       text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_task_idx on public.comments (task_id, created_at);

-- ─────────────────────────────────────────────────────────────────
-- 4. UPDATED_AT TRIGGER for tasks
-- ─────────────────────────────────────────────────────────────────

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_touch_updated on public.tasks;
create trigger tasks_touch_updated
  before update on public.tasks
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────
-- Dette er en midlertidig intern app med bare tre brukere, beskyttet
-- av et delt passord i frontend. Vi bruker anon-nøkkelen for alt.
-- RLS er skrudd på (best practice), men policy tillater alt for anon.
-- Sikkerheten ligger i at anon-nøkkelen deles kun med de tre.

alter table public.tasks       enable row level security;
alter table public.completions enable row level security;
alter table public.comments    enable row level security;

drop policy if exists "anon_all_tasks"       on public.tasks;
drop policy if exists "anon_all_completions" on public.completions;
drop policy if exists "anon_all_comments"    on public.comments;

create policy "anon_all_tasks"
  on public.tasks for all
  to anon
  using (true) with check (true);

create policy "anon_all_completions"
  on public.completions for all
  to anon
  using (true) with check (true);

create policy "anon_all_comments"
  on public.comments for all
  to anon
  using (true) with check (true);

-- ─────────────────────────────────────────────────────────────────
-- 6. REALTIME
-- ─────────────────────────────────────────────────────────────────
-- Aktiver realtime for alle tre tabeller så endringer fra én bruker
-- umiddelbart vises for de andre.

alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.completions;
alter publication supabase_realtime add table public.comments;

-- ─────────────────────────────────────────────────────────────────
-- 7. SEED — standard-oppgaver fra index.html
-- ─────────────────────────────────────────────────────────────────
-- Idempotent: bruker on conflict (default_id) do update så re-kjøring
-- oppdaterer tekst hvis vi endrer standard-oppgaver senere.

insert into public.tasks (default_id, section_id, kind, text, area, owner, is_default, sort_order) values
-- ── PLAN · Uke 1 ──
('p-w1-1', 'plan-w1', 'plan', 'Ferdigstill AS-registrering i Brønnøysund, bekreft org.nr. mottatt', 'Selskap', 'Alle tre', true, 1),
('p-w1-2', 'plan-w1', 'plan', 'Oppstartsmøte DNB — bedriftskonto, LIS (likviditetsservice), Vipps Bedrift', 'Bank', 'Alle tre', true, 2),
('p-w1-3', 'plan-w1', 'plan', 'Velg regnskapssystem og engasjer regnskapsfører (Tripletex anbefales iht. arkitektur)', 'Regnskap', 'Én tildelt', true, 3),
('p-w1-4', 'plan-w1', 'plan', 'Innhent tilbud på yrkesansvarsforsikring (If, Gjensidige, Tryg)', 'Forsikring', 'Én tildelt', true, 4),
('p-w1-5', 'plan-w1', 'plan', 'Vurder MVA-registrering (helsetjenester fritatt, men kan være aktuelt)', 'Skatt', 'Regnskapsfører', true, 5),

-- ── PLAN · Uke 2 ──
('p-w2-1', 'plan-w2', 'plan', 'Aksjonæravtale mellom de tre medgrunnleggerne (likeverdige 33,3% eierandeler)', 'Aksjonæravtale', 'Alle tre + jurist', true, 1),
('p-w2-2', 'plan-w2', 'plan', 'IP-lisensavtale signert (Richard → EiraNova AS) for plattformbruk', 'IP', 'Alle tre + Richard', true, 2),
('p-w2-3', 'plan-w2', 'plan', 'Start arbeid med ROS-analyse (se compliance-fanen)', 'Compliance', 'Én tildelt + input fra alle', true, 3),
('p-w2-4', 'plan-w2', 'plan', 'Start internkontrollsystem — mal fra Helsedirektoratet', 'Compliance', 'Én tildelt', true, 4),
('p-w2-5', 'plan-w2', 'plan', 'Verifiser at post@eiranova.no og individuelle @eiranova.no-adresser fungerer', 'Domene', 'Richard', true, 5),

-- ── PLAN · Uke 3 ──
('p-w3-1', 'plan-w3', 'plan', 'Sett opp Calendly eller SimplyBook.me med tjenestekatalog', 'Booking', 'Én tildelt', true, 1),
('p-w3-2', 'plan-w3', 'plan', 'Delt Google Calendar «EiraNova Drift» for oppdrag og tilgjengelighet', 'Kalender', 'Alle tre', true, 2),
('p-w3-3', 'plan-w3', 'plan', 'Velg og aktiver journalsystem (Infodoc / Pridok / WebMed) — aldri Google Docs', 'Journal', 'Alle tre', true, 3),
('p-w3-4', 'plan-w3', 'plan', 'Aktiver Vipps Bedrift og Stripe (når org.nr. er aktivt)', 'Betaling', 'Én tildelt', true, 4),
('p-w3-5', 'plan-w3', 'plan', 'Fakturamal i Tripletex (helsetjenester fritatt MVA)', 'Faktura', 'Regnskapsfører', true, 5),
('p-w3-6', 'plan-w3', 'plan', 'OneDrive Business / SharePoint for pasientdata — aldri Google Drive', 'Lagring', 'Alle tre', true, 6),

-- ── PLAN · Uke 4 ──
('p-w4-1', 'plan-w4', 'plan', 'Prissett tjenestekatalog — konkurranseanalyse mot Stendi, Aleris, lokale aktører', 'Prising', 'Alle tre', true, 1),
('p-w4-2', 'plan-w4', 'plan', 'Samtykkeskjema for behandling og personvern', 'Samtykke', 'Én tildelt + jurist', true, 2),
('p-w4-3', 'plan-w4', 'plan', 'Tjenestevilkår inkl. 48-timers kanselleringsregel', 'Vilkår', 'Én tildelt + jurist', true, 3),
('p-w4-4', 'plan-w4', 'plan', 'Personvernerklæring publisert på marketing-siden', 'Personvern', 'Richard + alle tre', true, 4),
('p-w4-5', 'plan-w4', 'plan', 'Prosedyrebok: hygiene, dokumentasjon, avviksrapportering, taushetsplikt', 'Fag', 'Alle tre', true, 5),

-- ── PLAN · Uke 5 ──
('p-w5-1', 'plan-w5', 'plan', 'Send melding til Statsforvalteren om oppstart av privat helsetjeneste', 'Statsforvalter', 'Én tildelt', true, 1),
('p-w5-2', 'plan-w5', 'plan', 'Bekreftelse fra Statsforvalteren mottatt og arkivert', 'Statsforvalter', 'Én tildelt', true, 2),
('p-w5-3', 'plan-w5', 'plan', 'ROS-analyse fullført og arkivert', 'Compliance', 'Alle tre', true, 3),
('p-w5-4', 'plan-w5', 'plan', 'Internkontrollsystem godkjent og implementert', 'Compliance', 'Alle tre', true, 4),
('p-w5-5', 'plan-w5', 'plan', 'Databehandleravtaler signert med ALLE leverandører', 'GDPR', 'Én tildelt', true, 5),
('p-w5-6', 'plan-w5', 'plan', 'Yrkesansvarsforsikring aktiv — dokument arkivert', 'Forsikring', 'Alle tre', true, 6),
('p-w5-7', 'plan-w5', 'plan', 'Bekreft at alle tres autorisasjoner er aktive i Helsepersonellregisteret (HPR)', 'HPR', 'Alle tre', true, 7),

-- ── PLAN · Uke 6 ──
('p-w6-1', 'plan-w6', 'plan', 'Legg til «Book time»-knapp på marketing-siden → Calendly', 'Marketing', 'Richard', true, 1),
('p-w6-2', 'plan-w6', 'plan', 'Publiser prisliste og tjenestekatalog på marketing-siden', 'Marketing', 'Alle tre', true, 2),
('p-w6-3', 'plan-w6', 'plan', 'Kontakt eget profesjonelle nettverk (tidligere kolleger)', 'Nettverk', 'Alle tre individuelt', true, 3),
('p-w6-4', 'plan-w6', 'plan', 'Personlige besøk hos 10 fastleger i Moss/Fredrikstad/Sarpsborg', 'Fastleger', 'Delt mellom alle tre', true, 4),
('p-w6-5', 'plan-w6', 'plan', 'Kontakt lokale sykehjem og forsikringsselskap (If, Gjensidige omsorg)', 'B2B', 'Én tildelt', true, 5),
('p-w6-6', 'plan-w6', 'plan', 'Opprett Google Business-profil og Facebook-side for EiraNova AS', 'Digital', 'Én tildelt', true, 6),
('p-w6-7', 'plan-w6', 'plan', 'Test lokal Facebook-annonsering — budsjett 3 000–5 000 kr', 'Annonsering', 'Én tildelt', true, 7),

-- ── PLAN · Uke 7 ──
('p-w7-1', 'plan-w7', 'plan', 'Mål: 3–5 pilotkunder med reduserte priser mot skriftlig tilbakemelding', 'Pilot', 'Alle tre', true, 1),
('p-w7-2', 'plan-w7', 'plan', 'Standard onboarding-rutine: samtykke, helsestatus, pårørende, nøkkelhåndtering', 'Onboarding', 'Alle tre', true, 2),
('p-w7-3', 'plan-w7', 'plan', 'Journalføring samme dag som oppdrag (dokumentasjonsplikt, helsepersonelloven § 39)', 'Journal', 'Alle tre', true, 3),
('p-w7-4', 'plan-w7', 'plan', 'Avvikslogg i bruk fra dag én (internkontrollkrav)', 'Avvik', 'Alle tre', true, 4),

-- ── PLAN · Uke 8 ──
('p-w8-1', 'plan-w8', 'plan', 'Tilbakemeldingssamtale etter 2 uker med hver pilotkunde', 'Kunder', 'Alle tre', true, 1),
('p-w8-2', 'plan-w8', 'plan', 'Ukentlig rapport til Richard: friksjon, tidsbruk, kundebehov (→ app-utvikling)', 'App-sync', 'Alle tre → Richard', true, 2),
('p-w8-3', 'plan-w8', 'plan', 'Første fakturakjøring via Tripletex — test at alt flyter', 'Økonomi', 'Regnskapsfører', true, 3),
('p-w8-4', 'plan-w8', 'plan', 'Vurder rekruttering av flere sykepleiere (hvis etterspørsel > kapasitet)', 'Skalering', 'Alle tre', true, 4),

-- ── COMPLIANCE · 01 Selskap og profesjon ──
('c-01-1', 'c-01', 'compliance', 'AS registrert i Brønnøysund med gyldig org.nr.', 'Aksjeloven', 'Alle tre', true, 1),
('c-01-2', 'c-01', 'compliance', 'Registrert i Arbeidsgiverregisteret (når første ansettelse)', 'Folketrygdloven § 24', 'Alle tre', true, 2),
('c-01-3', 'c-01', 'compliance', 'Alle tres sykepleierautorisasjon aktiv i Helsepersonellregisteret (HPR)', 'Helsepersonelloven § 48', 'Alle tre', true, 3),
('c-01-4', 'c-01', 'compliance', 'HPR-verifisering dokumentert (skjermbilde i arkiv)', 'Intern kontroll', 'Alle tre', true, 4),
('c-01-5', 'c-01', 'compliance', 'Aksjonæravtale signert (tre likeverdige medgrunnleggere)', 'Aksjeloven', 'Alle tre', true, 5),
('c-01-6', 'c-01', 'compliance', 'IP-lisensavtale signert (Richard → EiraNova AS)', 'Åndsverkloven', 'Alle tre + Richard', true, 6),

-- ── COMPLIANCE · 02 Melding til myndigheter ──
('c-02-1', 'c-02', 'compliance', 'Melding til Statsforvalteren om oppstart av privat helsetjeneste', 'HOL § 5-4', 'Én tildelt', true, 1),
('c-02-2', 'c-02', 'compliance', 'Bekreftelse fra Statsforvalteren mottatt og arkivert', 'Dokumentasjon', 'Én tildelt', true, 2),
('c-02-3', 'c-02', 'compliance', 'Vurdert om tjenesten krever godkjenning (ikke bare melding)', 'HOL § 5-4', 'Alle tre + jurist', true, 3),

-- ── COMPLIANCE · 03 Internkontroll ──
('c-03-1', 'c-03', 'compliance', 'Internkontrollsystem etablert', 'Forskrift om ledelse', 'Alle tre', true, 1),
('c-03-2', 'c-03', 'compliance', 'Dokumentert ansvarsfordeling mellom de tre grunnleggerne', 'Forskrift § 6', 'Alle tre', true, 2),
('c-03-3', 'c-03', 'compliance', 'Prosedyre for avvikshåndtering', 'Forskrift § 7', 'Alle tre', true, 3),
('c-03-4', 'c-03', 'compliance', 'Avvikslogg operativ (fra dag én)', 'Forskrift § 8', 'Alle tre', true, 4),
('c-03-5', 'c-03', 'compliance', 'Prosedyre for medikamenthåndtering (hvis relevant)', 'Helsepersonelloven § 4', 'Alle tre', true, 5),
('c-03-6', 'c-03', 'compliance', 'Prosedyre for hygiene og smittevern', 'Smittevernloven', 'Alle tre', true, 6),
('c-03-7', 'c-03', 'compliance', 'Prosedyre for akuttsituasjoner (HLR, 113, pårørendevarsling)', 'Helsepersonelloven § 7', 'Alle tre', true, 7),
('c-03-8', 'c-03', 'compliance', 'Årlig evaluering og forbedring planlagt', 'Forskrift § 8', 'Alle tre', true, 8),

-- ── COMPLIANCE · 04 GDPR ──
('c-04-1',  'c-04', 'compliance', 'ROS-analyse (risikovurdering) gjennomført og dokumentert', 'GDPR art. 35', 'Alle tre', true, 1),
('c-04-2',  'c-04', 'compliance', 'Personvernerklæring publisert på nettside', 'GDPR art. 13', 'Alle tre + Richard', true, 2),
('c-04-3',  'c-04', 'compliance', 'Samtykkeskjema for behandling utarbeidet', 'GDPR art. 9 (2)(a)', 'Alle tre + jurist', true, 3),
('c-04-4',  'c-04', 'compliance', 'Databehandleravtale: journalsystem', 'GDPR art. 28', 'Én tildelt', true, 4),
('c-04-5',  'c-04', 'compliance', 'Databehandleravtale: booking-system (Calendly)', 'GDPR art. 28', 'Én tildelt', true, 5),
('c-04-6',  'c-04', 'compliance', 'Databehandleravtale: Google Workspace', 'GDPR art. 28', 'Én tildelt', true, 6),
('c-04-7',  'c-04', 'compliance', 'Databehandleravtale: Microsoft (OneDrive/SharePoint)', 'GDPR art. 28', 'Én tildelt', true, 7),
('c-04-8',  'c-04', 'compliance', 'Databehandleravtale: Tripletex', 'GDPR art. 28', 'Én tildelt', true, 8),
('c-04-9',  'c-04', 'compliance', 'Behandlingsprotokoll ført (hva lagres, hvor, hvor lenge)', 'GDPR art. 30', 'Alle tre', true, 9),
('c-04-10', 'c-04', 'compliance', 'Lagringstid definert per datakategori (journal = min. 10 år)', 'Pasientjournalforskriften', 'Alle tre', true, 10),
('c-04-11', 'c-04', 'compliance', 'Rutine for innsyn, retting og sletting', 'GDPR art. 15–17', 'Alle tre', true, 11),
('c-04-12', 'c-04', 'compliance', 'Rutine for avviksmelding til Datatilsynet (72 timer)', 'GDPR art. 33', 'Alle tre', true, 12),
('c-04-13', 'c-04', 'compliance', 'Vurdert om DPIA (konsekvensvurdering) kreves', 'GDPR art. 35', 'Alle tre + jurist', true, 13),

-- ── COMPLIANCE · 05 Dokumentasjon ──
('c-05-1', 'c-05', 'compliance', 'Elektronisk pasientjournalsystem valgt og i drift', 'HPL § 39', 'Alle tre', true, 1),
('c-05-2', 'c-05', 'compliance', 'IKKE bruk av Google Docs, OneNote e.l. for pasientdata', 'GDPR + journalforskriften', 'Alle tre', true, 2),
('c-05-3', 'c-05', 'compliance', 'Journal føres samme dag som oppdrag', 'HPL § 39–40', 'Alle tre', true, 3),
('c-05-4', 'c-05', 'compliance', 'Tilgangskontroll: kun autorisert helsepersonell har tilgang', 'Pasientjournalforskriften § 13', 'Alle tre', true, 4),
('c-05-5', 'c-05', 'compliance', 'Logg over journaltilgang aktivert', 'Pasientjournalforskriften § 14', 'Alle tre', true, 5),
('c-05-6', 'c-05', 'compliance', '2FA aktivert på alle systemer med pasientdata', 'Normen for informasjonssikkerhet', 'Alle tre + Richard', true, 6),

-- ── COMPLIANCE · 06 Forsikring og økonomi ──
('c-06-1', 'c-06', 'compliance', 'Yrkesansvarsforsikring aktiv (alle tre dekket)', 'HPL § 20', 'Alle tre', true, 1),
('c-06-2', 'c-06', 'compliance', 'Forsikringsdokument arkivert og tilgjengelig', 'Dokumentasjon', 'Én tildelt', true, 2),
('c-06-3', 'c-06', 'compliance', 'Innholdsforsikring (utstyr, PC, medisinsk utstyr)', 'Anbefalt', 'Én tildelt', true, 3),
('c-06-4', 'c-06', 'compliance', 'Regnskapssystem operativt (Tripletex anbefalt)', 'Bokføringsloven', 'Regnskapsfører', true, 4),
('c-06-5', 'c-06', 'compliance', 'Regnskapsfører engasjert', 'Anbefalt for AS', 'Alle tre', true, 5),
('c-06-6', 'c-06', 'compliance', 'Helsetjenester er fritatt MVA — bekreftet med regnskapsfører', 'MVA-loven § 3-2', 'Regnskapsfører', true, 6),

-- ── COMPLIANCE · 07 Avtaler med kunder ──
('c-07-1', 'c-07', 'compliance', 'Tjenestevilkår publisert og tilgjengelig', 'Avtaleretten', 'Alle tre + jurist', true, 1),
('c-07-2', 'c-07', 'compliance', 'Prisliste transparent og publisert', 'Markedsføringsloven', 'Alle tre', true, 2),
('c-07-3', 'c-07', 'compliance', 'Kanselleringsregler tydelige (48-timers regel)', 'Forbrukerkjøpsloven', 'Alle tre', true, 3),
('c-07-4', 'c-07', 'compliance', 'Klageadgang beskrevet (Statsforvalter + Pasientombud)', 'Pasientrettighetsloven', 'Alle tre', true, 4),
('c-07-5', 'c-07', 'compliance', 'Taushetsplikt bekreftet skriftlig overfor kunde', 'HPL § 21', 'Alle tre', true, 5),

-- ── COMPLIANCE · 08 Operasjonell beredskap ──
('c-08-1', 'c-08', 'compliance', 'Nødprosedyre ved akutt forverring (113, pårørende, fastlege)', 'HPL § 7', 'Alle tre', true, 1),
('c-08-2', 'c-08', 'compliance', 'Oppdatert liste over pårørendekontakter per kunde', 'Pasientjournal', 'Alle tre', true, 2),
('c-08-3', 'c-08', 'compliance', 'Medisinsk utstyr kalibrert og kontrollert', 'Produsentanbefaling', 'Alle tre', true, 3),
('c-08-4', 'c-08', 'compliance', 'HLR-sertifisering aktiv (alle tre, gyldig 12 mnd)', 'Faglig anbefaling', 'Alle tre', true, 4),
('c-08-5', 'c-08', 'compliance', 'Politiattest innhentet for alle tre (krav ved arbeid i private hjem)', 'Politiregisterloven', 'Alle tre', true, 5),
('c-08-6', 'c-08', 'compliance', 'Sikkerhetsrutine for alenearbeid (check-in/out ved oppdrag)', 'Arbeidsmiljøloven § 4-3', 'Alle tre', true, 6),

-- ── COMPLIANCE · 09 Markedsføring ──
('c-09-1', 'c-09', 'compliance', 'Markedsføring er sannferdig og ikke villedende', 'HPL § 13', 'Alle tre', true, 1),
('c-09-2', 'c-09', 'compliance', 'Ingen påstander om medisinske effekter uten faglig grunnlag', 'HPL + markedsføringsloven', 'Alle tre', true, 2),
('c-09-3', 'c-09', 'compliance', 'Kundeuttalelser krever skriftlig samtykke', 'GDPR + markedsføringsloven', 'Alle tre', true, 3),
('c-09-4', 'c-09', 'compliance', 'Cookie-erklæring og samtykkemekanisme på nettside', 'Ekomloven § 2-7b', 'Richard', true, 4)

on conflict (default_id) do update set
  section_id = excluded.section_id,
  kind       = excluded.kind,
  text       = excluded.text,
  area       = excluded.area,
  owner      = excluded.owner,
  sort_order = excluded.sort_order;

-- ═══════════════════════════════════════════════════════════════════
-- Ferdig. Bekreft med:
--   select kind, count(*) from public.tasks where is_default group by kind;
-- Forventet: plan = 43, compliance = 57
-- ═══════════════════════════════════════════════════════════════════
