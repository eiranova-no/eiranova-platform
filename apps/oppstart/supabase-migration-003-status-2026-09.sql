-- ═══════════════════════════════════════════════════════════════════
-- EiraNova Oppstart — migrering 003 (status september 2026)
-- ═══════════════════════════════════════════════════════════════════
-- K-OPPSTART-002: to eiere, ikke-medisinsk pilot, oppdatert roadmap.
-- Idempotent — trygg å kjøre flere ganger mot eiranova-oppstart.
-- ═══════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────
-- 0. SCHEMA — archived-flagg (filtreres bort i frontend)
-- ─────────────────────────────────────────────────────────────────
alter table public.tasks
  add column if not exists archived boolean not null default false;

create index if not exists tasks_archived_idx
  on public.tasks (archived)
  where archived = false;

-- ─────────────────────────────────────────────────────────────────
-- 1. OPPDATER eksisterende oppgaver (tekst / ansvarlig / seksjon)
-- ─────────────────────────────────────────────────────────────────

-- plan-w1
update public.tasks set
  text = 'Stift EiraNova AS i Altinn: 51/49, aksjekapital 30 000, begge i styret, varamedlem (Therese) – innenfor NAV-etableringsperioden',
  owner = 'Lise', area = 'Selskap', archived = false, is_deleted = false
  where default_id = 'p-w1-1';

update public.tasks set
  text = 'Bedriftskonto (DNB) og innbetaling av aksjekapital',
  owner = 'Lise', area = 'Bank', archived = false, is_deleted = false
  where default_id = 'p-w1-2';

update public.tasks set
  text = 'Tripletex-konto opprettet; regnskapsfører for årsoppgjør (enkelttjeneste) valgt',
  owner = 'Lise', area = 'Regnskap', archived = false, is_deleted = false
  where default_id = 'p-w1-3';

update public.tasks set
  text = 'MVA-status per tjeneste avklart skriftlig med Skatteetaten (helsetjenester fritatt; besøksvenn/trilleturer/forebygging usikkert)',
  owner = 'Lise', area = 'Skatt', archived = false, is_deleted = false
  where default_id = 'p-w1-5';

-- plan-w2
update public.tasks set
  text = 'Aksjonæravtale v7.1 (51/49, § 2 økonomisk likestilling) lest og godkjent av begge – JA til Richard',
  owner = 'Begge', area = 'Aksjonæravtale', archived = false, is_deleted = false
  where default_id = 'p-w2-1';

update public.tasks set
  text = 'Intensjonsavtale (plattform) signert med BankID – Richard, Lise, Jeanett',
  owner = 'Begge + Richard', area = 'IP', archived = false, is_deleted = false
  where default_id = 'p-w2-2';

update public.tasks set
  text = 'Google Workspace: lise@ og jeanett@eiranova.no opprettet (kreves for sykepleier-innlogging i plattformen)',
  owner = 'Lise', area = 'Domene', archived = false, is_deleted = false
  where default_id = 'p-w2-5';

-- plan-w3: arkiver utdaterte booking-/lagringsoppgaver; flytt journal til c-05
update public.tasks set archived = true, is_deleted = false
  where default_id = 'p-w3-1';

update public.tasks set
  section_id = 'c-05', kind = 'compliance',
  text = 'Velg og aktiver journalsystem (Infodoc / Pridok / WebMed) — kun ved overgang til helsetjenester',
  owner = 'Begge', area = 'Journal', archived = false, is_deleted = false
  where default_id = 'p-w3-3';

update public.tasks set
  text = 'Vipps ePayment: søknad sendt samme dag org.nr foreligger (godkjenning tar uker)',
  owner = 'Lise', area = 'Betaling', archived = false, is_deleted = false
  where default_id = 'p-w3-4';

update public.tasks set
  text = 'Fakturamal i Tripletex med riktig MVA-behandling per tjeneste',
  owner = 'Lise', area = 'Faktura', archived = false, is_deleted = false
  where default_id = 'p-w3-5';

update public.tasks set archived = true, is_deleted = false
  where default_id = 'p-w3-6';

-- plan-w4
update public.tasks set
  text = 'Prisliste ferdig og sendt Richard (→ eiranova.no/priser) – timepris, introduksjonspris første besøk',
  owner = 'Begge', area = 'Prising', archived = false, is_deleted = false
  where default_id = 'p-w4-1';

update public.tasks set
  text = 'Samtykketekst for kunder (ikke-medisinsk: kontakt- og oppdragsdata)',
  owner = 'Begge', area = 'Samtykke', archived = false, is_deleted = false
  where default_id = 'p-w4-2';

update public.tasks set
  text = 'Tjenestevilkår inkl. avbestillingsregel (24/48 t)',
  owner = 'Begge', area = 'Vilkår', archived = false, is_deleted = false
  where default_id = 'p-w4-3';

update public.tasks set
  text = 'Personvernerklæring publisert på eiranova.no/personvern (02.09.2026)',
  owner = 'Richard', area = 'Personvern', archived = false, is_deleted = false
  where default_id = 'p-w4-4';

update public.tasks set
  text = 'Rutinebok for ikke-medisinsk drift: taushetsplikt, avvik, hygiene, nøkkelhåndtering, alenearbeid',
  owner = 'Jeanett', area = 'Fag', archived = false, is_deleted = false
  where default_id = 'p-w4-5';

-- plan-w5: Statsforvalter → c-02
update public.tasks set
  section_id = 'c-02', kind = 'compliance',
  text = 'Send melding til Statsforvalteren om oppstart av privat helsetjeneste',
  owner = 'Lise', area = 'Statsforvalter', archived = false, is_deleted = false
  where default_id = 'p-w5-1';

update public.tasks set
  section_id = 'c-02', kind = 'compliance',
  text = 'Bekreftelse fra Statsforvalteren mottatt og arkivert',
  owner = 'Lise', area = 'Statsforvalter', archived = false, is_deleted = false
  where default_id = 'p-w5-2';

update public.tasks set
  text = 'Enkel ROS-analyse for ikke-medisinsk hjemmetjeneste (alenearbeid, nøkler, personopplysninger)',
  owner = 'Jeanett', area = 'Compliance', archived = false, is_deleted = false
  where default_id = 'p-w5-3';

update public.tasks set
  text = 'Internkontroll (forenklet) etablert',
  owner = 'Jeanett', area = 'Compliance', archived = false, is_deleted = false
  where default_id = 'p-w5-4';

update public.tasks set
  text = 'Databehandleravtale Richard ↔ EiraNova AS signert; DPA med Google/Tripletex akseptert i tjenestevilkår',
  owner = 'Lise + Richard', area = 'GDPR', archived = false, is_deleted = false
  where default_id = 'p-w5-5';

update public.tasks set
  text = 'Begges autorisasjon verifisert i HPR (skjermbilde arkivert)',
  owner = 'Begge', area = 'HPR', archived = false, is_deleted = false
  where default_id = 'p-w5-7';

-- plan-w6
update public.tasks set
  text = 'Bestill-CTA på eiranova.no (→ skjema nå, → kunde-app ved lansering)',
  owner = 'Richard', area = 'Marketing', archived = false, is_deleted = false
  where default_id = 'p-w6-1';

update public.tasks set
  text = 'Priser publisert på eiranova.no (K-MARKETING-008)',
  owner = 'Richard', area = 'Marketing', archived = false, is_deleted = false
  where default_id = 'p-w6-2';

update public.tasks set
  text = 'Eget nettverk kontaktet (tidligere kolleger, fastleger, helsestasjon)',
  owner = 'Begge', area = 'Nettverk', archived = false, is_deleted = false
  where default_id = 'p-w6-3';

update public.tasks set
  text = 'Google Business-profil og Facebook/Instagram opprettet med samme logo og tagline',
  owner = 'Jeanett', area = 'Digital', archived = false, is_deleted = false
  where default_id = 'p-w6-6';

-- plan-w7
update public.tasks set
  text = '3–5 pilotkunder med signert pilotavtale (introduksjonspris mot tilbakemelding)',
  owner = 'Begge', area = 'Pilot', archived = false, is_deleted = false
  where default_id = 'p-w7-1';

update public.tasks set
  text = 'Onboarding-rutine: samtykke, pårørendekontakt, nøkkelhåndtering (ingen helseopplysninger)',
  owner = 'Jeanett', area = 'Onboarding', archived = false, is_deleted = false
  where default_id = 'p-w7-2';

update public.tasks set
  text = 'Arbeidsnotat i nurse-app samme dag (ikke journal)',
  owner = 'Begge', area = 'Dokumentasjon', archived = false, is_deleted = false
  where default_id = 'p-w7-3';

-- plan-w8
update public.tasks set
  text = 'Ukentlig pilotmøte med Richard: friksjon, tidsbruk, kundebehov',
  owner = 'Begge', area = 'App-sync', archived = false, is_deleted = false
  where default_id = 'p-w8-2';

update public.tasks set
  text = 'Første fakturakjøring (manuelt i Tripletex) – deretter Vipps når godkjent',
  owner = 'Lise', area = 'Økonomi', archived = false, is_deleted = false
  where default_id = 'p-w8-3';

-- compliance c-01
update public.tasks set
  text = 'Begges sykepleierautorisasjon aktiv i Helsepersonellregisteret (HPR)',
  owner = 'Begge', archived = false, is_deleted = false
  where default_id = 'c-01-3';

update public.tasks set
  text = 'HPR-verifisering dokumentert (skjermbilde i arkiv) – begge',
  owner = 'Begge', archived = false, is_deleted = false
  where default_id = 'c-01-4';

update public.tasks set
  text = 'Aksjonæravtale v7.1 signert (BankID) ved stiftelse',
  owner = 'Begge', archived = false, is_deleted = false
  where default_id = 'c-01-5';

update public.tasks set
  text = 'Lisensavtale plattform signert (Richard → EiraNova AS), godkjent i generalforsamling',
  owner = 'Begge + Richard', archived = false, is_deleted = false
  where default_id = 'c-01-6';

-- c-03
update public.tasks set
  text = 'Dokumentert ansvarsfordeling mellom de to eierne (Vedlegg 1 i aksjonæravtalen)',
  owner = 'Begge', archived = false, is_deleted = false
  where default_id = 'c-03-2';

-- c-03-5 medikament → c-05
update public.tasks set
  section_id = 'c-05', kind = 'compliance',
  text = 'Prosedyre for medikamenthåndtering (kun ved helsetjenester)',
  owner = 'Begge', area = 'Helsepersonelloven § 4', archived = false, is_deleted = false
  where default_id = 'c-03-5';

-- c-04
update public.tasks set
  text = 'Personvernerklæring publisert på eiranova.no/personvern (02.09.2026)',
  owner = 'Richard', archived = false, is_deleted = false
  where default_id = 'c-04-2';

update public.tasks set
  text = 'Samtykketekst for kundeopplysninger (ikke helsedata i pilot)',
  owner = 'Begge', archived = false, is_deleted = false
  where default_id = 'c-04-3';

update public.tasks set
  section_id = 'c-05', kind = 'compliance',
  text = 'Databehandleravtale: journalsystem (kun ved helsetjenester)',
  owner = 'Lise', area = 'GDPR art. 28', archived = false, is_deleted = false
  where default_id = 'c-04-4';

update public.tasks set archived = true, is_deleted = false
  where default_id = 'c-04-5';

update public.tasks set archived = true, is_deleted = false
  where default_id = 'c-04-7';

update public.tasks set
  text = 'Lagringstid definert: henvendelser 12 mnd, kundedata så lenge kundeforhold + regnskapslovens krav',
  owner = 'Lise', archived = false, is_deleted = false
  where default_id = 'c-04-10';

-- c-06
update public.tasks set
  text = 'Yrkesansvarsforsikring aktiv (begge dekket)',
  owner = 'Lise', archived = false, is_deleted = false
  where default_id = 'c-06-1';

update public.tasks set
  text = 'MVA per tjeneste bekreftet skriftlig (Skatteetaten/regnskapsfører)',
  owner = 'Lise', archived = false, is_deleted = false
  where default_id = 'c-06-6';

-- c-07
update public.tasks set
  text = 'Klageadgang beskrevet (Forbrukertilsynet; Pasientombud kun ved helsetjenester)',
  owner = 'Begge', archived = false, is_deleted = false
  where default_id = 'c-07-4';

-- c-08
update public.tasks set
  text = 'HLR-kurs gyldig (begge)',
  owner = 'Begge', archived = false, is_deleted = false
  where default_id = 'c-08-4';

update public.tasks set
  text = 'Politiattest innhentet (begge)',
  owner = 'Begge', archived = false, is_deleted = false
  where default_id = 'c-08-5';

-- c-09
update public.tasks set
  text = 'Ingen cookies/sporing på eiranova.no – dokumentert i personvernerklæringen',
  owner = 'Richard', archived = false, is_deleted = false
  where default_id = 'c-09-4';

-- ─────────────────────────────────────────────────────────────────
-- 2. NYE oppgaver
-- ─────────────────────────────────────────────────────────────────
insert into public.tasks (default_id, section_id, kind, text, area, owner, is_default, sort_order, archived) values
  ('p-w1-6', 'plan-w1', 'plan', 'Databehandleravtale og lisensavtale signert med BankID etter stiftelse (org.nr satt inn av Richard)', 'Avtaler', 'Begge + Richard', true, 6, false),
  ('p-w1-7', 'plan-w1', 'plan', 'Generalforsamling protokollfører godkjenning av avtalene med Richard (habilitet far/datter)', 'Selskap', 'Begge', true, 7, false),
  ('p-w2-6', 'plan-w2', 'plan', 'NAV-orientering sendt via nav.no-dialog (endring 52→51 %, to eiere, kjøpsrett, salgsdeling)', 'NAV', 'Lise', true, 6, false),
  ('p-w2-7', 'plan-w2', 'plan', 'Lønn til Lise i etableringsperioden avklart med NAV før første lønnskjøring', 'NAV', 'Lise', true, 7, false),
  ('p-w2-8', 'plan-w2', 'plan', 'Arbeidsavtaler for begge eiere (arbeidsmiljøloven)', 'HR', 'Lise', true, 8, false),
  ('p-w2-9', 'plan-w2', 'plan', 'Originalfil av logo (høy oppløsning) sendt Richard for trykk og nett', 'Merkevare', 'Jeanett', true, 9, false),
  ('p-w4-6', 'plan-w4', 'plan', 'Pilotavtale-mal (ikke-medisinsk, introduksjonspris, tilbakemelding, personvern)', 'Avtaler', 'Lise', true, 6, false),
  ('p-w4-7', 'plan-w4', 'plan', 'Brosjyre trykkes først når priser er publisert og logo/tekst matcher eiranova.no', 'Marketing', 'Jeanett', true, 7, false),
  ('p-w6-8', 'plan-w6', 'plan', 'Første SoMe-innlegg med bilde/tekst fra «Hvem er vi» – samme profil som nettsiden', 'SoMe', 'Jeanett', true, 8, false),
  ('p-w8-5', 'plan-w8', 'plan', 'Beslutning: går EiraNova over til helsetjenester i 2027? (aktiverer helsetjeneste-sporet i compliance)', 'Strategi', 'Begge + Richard', true, 5, false),
  ('c-06-7', 'c-06', 'compliance', 'Årsoppgjør 2026 bestilt hos Tripletex-regnskapsfører innen februar 2027', 'Regnskap', 'Lise', true, 7, false),
  ('c-09-5', 'c-09', 'compliance', 'Alle flater bruker samme logo, tagline «Faglig trygghet. Menneskelig nærhet.» og tjenesteliste', 'Markedsføring', 'Jeanett', true, 5, false)
on conflict (default_id) do update set
  section_id = excluded.section_id,
  kind       = excluded.kind,
  text       = excluded.text,
  area       = excluded.area,
  owner      = excluded.owner,
  sort_order = excluded.sort_order,
  archived   = excluded.archived,
  is_deleted = false;

-- ─────────────────────────────────────────────────────────────────
-- 3. FULLFØRTE oppgaver (2026-09-02, Richard)
-- ─────────────────────────────────────────────────────────────────
insert into public.completions (task_id, completed_by, completed_at)
select t.id, 'Richard', '2026-09-02T12:00:00+02:00'::timestamptz
from public.tasks t
where t.default_id in ('p-w4-4', 'p-w6-1', 'c-04-2', 'c-09-4')
on conflict (task_id) do update set
  completed_by = excluded.completed_by,
  completed_at = excluded.completed_at;

-- ═══════════════════════════════════════════════════════════════════
-- Verifikasjon (kjør etter migrering):
--   select section_id, count(*) from public.tasks
--     where is_default and not archived and not is_deleted
--     group by section_id order by section_id;
--   select default_id, archived, section_id from public.tasks
--     where default_id in ('p-w3-1','p-w3-3','p-w3-6','p-w5-1','p-w5-2','c-03-5','c-04-4','c-04-5','c-04-7');
--   select t.default_id, c.completed_by, c.completed_at
--     from public.completions c join public.tasks t on t.id = c.task_id
--     where t.default_id in ('p-w4-4','p-w6-1','c-04-2','c-09-4');
--   select count(*) from public.tasks
--     where text ilike '%Therese%' and default_id is not null;
--     -- forventet: 1 (p-w1-1 varamedlem)
-- ═══════════════════════════════════════════════════════════════════
