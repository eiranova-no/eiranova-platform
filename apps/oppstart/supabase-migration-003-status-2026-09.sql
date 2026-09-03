-- ═══════════════════════════════════════════════════════════════════
-- EiraNova Oppstart — migrering 003: status september 2026
-- ═══════════════════════════════════════════════════════════════════
-- Kjøres i Supabase SQL Editor for prosjekt eiranova-oppstart.
-- IDEMPOTENT: kan kjøres flere ganger uten bivirkninger.
--
-- Endringer:
--   1. To eiere (Lise, Jeanett) – «alle tre» → «begge» i tekst og owner
--   2. Ikke-medisinsk pilot – helsetjeneste-oppgaver flyttes til c-02/c-05
--   3. Utdaterte verktøy arkiveres (Calendly, OneDrive)
--   4. Oppgaver oppdatert til dagens plan og avtalepakke v7.1
--   5. Nye oppgaver fra de siste ukene
--   6. Fullførte oppgaver merkes (Richard, 02.09.2026)
-- ═══════════════════════════════════════════════════════════════════

begin;

-- ─────────────────────────────────────────────────────────────────
-- 1. GENERELL TEKSTOPPRYDDING (to eiere)
-- ─────────────────────────────────────────────────────────────────
update public.tasks set owner = 'Begge'            where is_default and owner in ('Alle tre', 'Alle tre individuelt', 'Alle tre + jurist');
update public.tasks set owner = 'Begge + Richard'  where is_default and owner = 'Alle tre + Richard';
update public.tasks set owner = 'Begge → Richard'  where is_default and owner = 'Alle tre → Richard';
update public.tasks set owner = 'Begge + input'    where is_default and owner = 'Én tildelt + input fra alle';

update public.tasks set text = replace(text, 'alle tres', 'begges')                 where is_default and text like '%alle tres%';
update public.tasks set text = replace(text, 'de tre grunnleggerne', 'de to eierne') where is_default and text like '%de tre grunnleggerne%';
update public.tasks set text = replace(text, '(alle tre dekket)', '(begge dekket)')  where is_default and text like '%(alle tre dekket)%';
update public.tasks set text = replace(text, '(alle tre, gyldig 12 mnd)', '(begge, gyldig 12 mnd)') where is_default and text like '%(alle tre, gyldig 12 mnd)%';
update public.tasks set text = replace(text, 'for alle tre', 'for begge')            where is_default and text like '%for alle tre%';
update public.tasks set text = replace(text, 'alle tre', 'begge')                    where is_default and text like '%alle tre%';

-- ─────────────────────────────────────────────────────────────────
-- 2. ARKIVERING (soft delete) – verktøy som ikke lenger gjelder
-- ─────────────────────────────────────────────────────────────────
update public.tasks set is_deleted = true
where default_id in ('p-w3-1', 'p-w3-6', 'c-04-5', 'c-04-7');

-- Duplikater: p-w5-1/p-w5-2 er identiske med c-02-1/c-02-2 (begge i c-02 etter flytting)
update public.tasks set is_deleted = true
where default_id in ('p-w5-1', 'p-w5-2');

-- ─────────────────────────────────────────────────────────────────
-- 3. FLYTTING – helsetjeneste-oppgaver til c-02 / c-05
-- ─────────────────────────────────────────────────────────────────
update public.tasks set section_id = 'c-05', kind = 'compliance', sort_order = 20,
  text = 'Journalsystem (Infodoc / Pridok / WebMed) valgt og aktivert – kun ved overgang til helsetjenester'
  where default_id = 'p-w3-3';
update public.tasks set section_id = 'c-02', kind = 'compliance', sort_order = 10 where default_id = 'p-w5-1';
update public.tasks set section_id = 'c-02', kind = 'compliance', sort_order = 11 where default_id = 'p-w5-2';
update public.tasks set section_id = 'c-05', sort_order = 21 where default_id = 'c-03-5';
update public.tasks set section_id = 'c-05', sort_order = 22 where default_id = 'c-04-4';

-- ─────────────────────────────────────────────────────────────────
-- 4. OPPDATERTE OPPGAVER (tekst / område / ansvarlig)
-- ─────────────────────────────────────────────────────────────────
-- Plan · M0 September
update public.tasks set text = 'Stift EiraNova AS i Altinn: 51/49, aksjekapital 30 000 kr, begge i styret, varamedlem (Therese) – innenfor NAV-etableringsperioden', area = 'Selskap', owner = 'Lise' where default_id = 'p-w1-1';
update public.tasks set text = 'Bedriftskonto (DNB) opprettet og aksjekapital innbetalt', area = 'Bank', owner = 'Lise' where default_id = 'p-w1-2';
update public.tasks set text = 'Tripletex-konto opprettet; regnskapsfører for årsoppgjør (enkelttjeneste) valgt', area = 'Regnskap', owner = 'Lise' where default_id = 'p-w1-3';
update public.tasks set text = 'MVA-status per tjeneste avklart skriftlig med Skatteetaten (helsetjenester fritatt; besøksvenn, trilleturer og forebygging usikkert)', area = 'Skatt', owner = 'Lise' where default_id = 'p-w1-5';
update public.tasks set text = 'Aksjonæravtale v7.1 (51/49, § 2 økonomisk likestilling) lest og godkjent av begge – JA til Richard', area = 'Aksjonæravtale', owner = 'Begge' where default_id = 'p-w2-1';
update public.tasks set text = 'Intensjonsavtale (plattform) signert med BankID – Richard, Lise, Jeanett', area = 'IP', owner = 'Begge + Richard' where default_id = 'p-w2-2';
update public.tasks set text = 'Google Workspace: lise@ og jeanett@eiranova.no opprettet (kreves for sykepleier-innlogging i plattformen)', area = 'Workspace', owner = 'Lise' where default_id = 'p-w2-5';
-- Plan · M1 Oktober
update public.tasks set text = 'Vipps ePayment: søknad sendt samme dag org.nr foreligger (godkjenning tar uker)', area = 'Betaling', owner = 'Lise' where default_id = 'p-w3-4';
update public.tasks set text = 'Fakturamal i Tripletex med riktig MVA-behandling per tjeneste', area = 'Regnskap', owner = 'Lise' where default_id = 'p-w3-5';
update public.tasks set text = 'Prisliste ferdig og sendt Richard (→ eiranova.no/priser) – timepris, introduksjonspris første besøk', area = 'Priser', owner = 'Begge' where default_id = 'p-w4-1';
update public.tasks set text = 'Samtykketekst for kunder (ikke-medisinsk: kontakt- og oppdragsdata)', area = 'GDPR', owner = 'Begge' where default_id = 'p-w4-2';
update public.tasks set text = 'Tjenestevilkår inkl. avbestillingsregel (24/48 t)', area = 'Vilkår', owner = 'Begge' where default_id = 'p-w4-3';
update public.tasks set text = 'Personvernerklæring publisert på eiranova.no/personvern', area = 'GDPR', owner = 'Richard' where default_id = 'p-w4-4';
update public.tasks set text = 'Rutinebok for ikke-medisinsk drift: taushetsplikt, avvik, hygiene, nøkkelhåndtering, alenearbeid', area = 'Rutiner', owner = 'Jeanett' where default_id = 'p-w4-5';
update public.tasks set text = 'Enkel ROS-analyse for ikke-medisinsk hjemmetjeneste (alenearbeid, nøkler, personopplysninger)', area = 'Risiko', owner = 'Jeanett' where default_id = 'p-w5-3';
update public.tasks set text = 'Internkontroll (forenklet) etablert', area = 'Kvalitet', owner = 'Jeanett' where default_id = 'p-w5-4';
update public.tasks set text = 'Databehandleravtale Richard ↔ EiraNova AS signert; DPA med Google/Tripletex akseptert i tjenestevilkår', area = 'GDPR', owner = 'Lise + Richard' where default_id = 'p-w5-5';
update public.tasks set text = 'Begges autorisasjon verifisert i Helsepersonellregisteret (skjermbilde arkivert)', area = 'HPR', owner = 'Begge' where default_id = 'p-w5-7';
-- Plan · M2 November
update public.tasks set text = 'Bestill-CTA på eiranova.no (→ kontaktskjema nå, → kunde-app ved lansering)', area = 'Marketing', owner = 'Richard' where default_id = 'p-w6-1';
update public.tasks set text = 'Priser publisert på eiranova.no (K-MARKETING-008)', area = 'Marketing', owner = 'Richard' where default_id = 'p-w6-2';
update public.tasks set text = 'Eget nettverk kontaktet (tidligere kolleger, fastleger, helsestasjon)', area = 'Nettverk', owner = 'Begge' where default_id = 'p-w6-3';
update public.tasks set text = 'Google Business-profil og Facebook/Instagram opprettet med samme logo og tagline', area = 'SoMe', owner = 'Jeanett' where default_id = 'p-w6-6';
update public.tasks set text = '3–5 pilotkunder med signert pilotavtale (introduksjonspris mot tilbakemelding)', area = 'Pilot', owner = 'Begge' where default_id = 'p-w7-1';
update public.tasks set text = 'Onboarding-rutine: samtykke, pårørendekontakt, nøkkelhåndtering (ingen helseopplysninger)', area = 'Pilot', owner = 'Jeanett' where default_id = 'p-w7-2';
update public.tasks set text = 'Arbeidsnotat i nurse-app samme dag som oppdrag (ikke journal)', area = 'Pilot', owner = 'Begge' where default_id = 'p-w7-3';
-- Plan · M3 Desember–januar
update public.tasks set text = 'Ukentlig pilotmøte med Richard: friksjon, tidsbruk, kundebehov (→ app-utvikling)', area = 'App-sync', owner = 'Begge → Richard' where default_id = 'p-w8-2';
update public.tasks set text = 'Første fakturakjøring (manuelt i Tripletex) – deretter Vipps når godkjent', area = 'Regnskap', owner = 'Lise' where default_id = 'p-w8-3';
-- Compliance
update public.tasks set text = 'Begges sykepleierautorisasjon aktiv i Helsepersonellregisteret (HPR)' where default_id = 'c-01-3';
update public.tasks set text = 'Aksjonæravtale v7.1 signert (BankID) ved stiftelse', owner = 'Begge' where default_id = 'c-01-5';
update public.tasks set text = 'Lisensavtale plattform signert (Richard → EiraNova AS), godkjent i generalforsamling', owner = 'Begge + Richard' where default_id = 'c-01-6';
update public.tasks set text = 'Dokumentert ansvarsfordeling mellom de to eierne (Vedlegg 1 i aksjonæravtalen)', owner = 'Begge' where default_id = 'c-03-2';
update public.tasks set text = 'Personvernerklæring publisert på eiranova.no/personvern', owner = 'Richard' where default_id = 'c-04-2';
update public.tasks set text = 'Samtykketekst for kundeopplysninger (ikke helsedata i pilot)', owner = 'Begge' where default_id = 'c-04-3';
update public.tasks set text = 'Lagringstid definert: henvendelser 12 mnd; kundedata så lenge kundeforhold + regnskapslovens krav', owner = 'Lise' where default_id = 'c-04-10';
update public.tasks set text = 'Yrkesansvarsforsikring aktiv (begge dekket)', owner = 'Lise' where default_id = 'c-06-1';
update public.tasks set text = 'MVA per tjeneste bekreftet skriftlig (Skatteetaten / regnskapsfører)', owner = 'Lise' where default_id = 'c-06-6';
update public.tasks set text = 'Klageadgang beskrevet (Forbrukertilsynet; Pasientombud kun ved helsetjenester)', owner = 'Begge' where default_id = 'c-07-4';
update public.tasks set text = 'HLR-kurs gyldig (begge, 12 mnd)', owner = 'Begge' where default_id = 'c-08-4';
update public.tasks set text = 'Politiattest innhentet (begge – krav ved arbeid i private hjem)', owner = 'Begge' where default_id = 'c-08-5';
update public.tasks set text = 'Ingen cookies/sporing på eiranova.no – dokumentert i personvernerklæringen', owner = 'Richard' where default_id = 'c-09-4';

-- ─────────────────────────────────────────────────────────────────
-- 5. NYE OPPGAVER
-- ─────────────────────────────────────────────────────────────────
insert into public.tasks (default_id, section_id, kind, text, area, owner, is_default, sort_order) values
('p-w1-6', 'plan-w1', 'plan', 'Databehandleravtale og lisensavtale signert med BankID etter stiftelse (org.nr satt inn av Richard)', 'Avtaler', 'Begge + Richard', true, 6),
('p-w1-7', 'plan-w1', 'plan', 'Generalforsamling protokollfører godkjenning av avtalene med Richard (habilitet far/datter)', 'Selskap', 'Begge', true, 7),
('p-w2-6', 'plan-w2', 'plan', 'NAV-orientering sendt via nav.no-dialog (endring 52→51 %, to eiere, kjøpsrett, salgsdeling)', 'NAV', 'Lise', true, 6),
('p-w2-7', 'plan-w2', 'plan', 'Lønn til Lise i etableringsperioden avklart med NAV før første lønnskjøring', 'NAV', 'Lise', true, 7),
('p-w2-8', 'plan-w2', 'plan', 'Arbeidsavtaler for begge eiere (arbeidsmiljøloven)', 'Ansettelse', 'Lise', true, 8),
('p-w2-9', 'plan-w2', 'plan', 'Originalfil av logo (høy oppløsning) sendt Richard for trykk og nett', 'Profil', 'Jeanett', true, 9),
('p-w4-6', 'plan-w4', 'plan', 'Pilotavtale-mal (ikke-medisinsk, introduksjonspris, tilbakemelding, personvern)', 'Pilot', 'Lise', true, 6),
('p-w4-7', 'plan-w4', 'plan', 'Brosjyre trykkes først når priser er publisert og logo/tekst matcher eiranova.no', 'Marketing', 'Jeanett', true, 7),
('p-w6-8', 'plan-w6', 'plan', 'Første SoMe-innlegg med bilde/tekst fra «Hvem er vi» – samme profil som nettsiden', 'SoMe', 'Jeanett', true, 8),
('p-w8-5', 'plan-w8', 'plan', 'Beslutning: går EiraNova over til helsetjenester i 2027? (aktiverer helsetjeneste-sporet i compliance)', 'Strategi', 'Begge + Richard', true, 5),
('c-06-7', 'c-06', 'compliance', 'Årsoppgjør 2026 bestilt hos Tripletex-regnskapsfører innen februar 2027', 'Regnskapsloven', 'Lise', true, 7),
('c-09-5', 'c-09', 'compliance', 'Alle flater bruker samme logo, tagline «Faglig trygghet. Menneskelig nærhet.» og tjenesteliste', 'Profil', 'Jeanett', true, 5)
on conflict (default_id) do update set
  section_id = excluded.section_id,
  kind       = excluded.kind,
  text       = excluded.text,
  area       = excluded.area,
  owner      = excluded.owner,
  sort_order = excluded.sort_order,
  is_deleted = false;

-- ─────────────────────────────────────────────────────────────────
-- 6. FULLFØRTE OPPGAVER (Richard, 02.09.2026)
-- ─────────────────────────────────────────────────────────────────
insert into public.completions (task_id, completed_by, completed_at)
select id, 'Richard', '2026-09-02 12:00:00+02'
from public.tasks
where default_id in ('p-w4-4', 'p-w6-1', 'c-04-2', 'c-09-4')
on conflict (task_id) do nothing;

commit;

-- ═══════════════════════════════════════════════════════════════════
-- VERIFIKASJON (kjør etterpå – forventede tall i kommentar)
-- ═══════════════════════════════════════════════════════════════════
-- a) Aktive standardoppgaver per seksjon
select section_id, count(*) filter (where not is_deleted) as aktive, count(*) filter (where is_deleted) as arkivert
from public.tasks where is_default group by section_id order by section_id;
-- Forventet arkivert: c-02 = 2, c-04 = 2, plan-w3 = 2, ellers 0

-- b) Ingen «tre»-formuleringer igjen i aktive standardoppgaver
select default_id, text, owner from public.tasks
where is_default and not is_deleted
  and (text ilike '%alle tre%' or text ilike '%de tre%' or owner ilike '%alle tre%');
-- Forventet: 0 rader

-- c) Fullførte av Richard
select t.default_id, c.completed_by, c.completed_at
from public.completions c join public.tasks t on t.id = c.task_id
where c.completed_by = 'Richard' order by t.default_id;
-- Forventet: c-04-2, c-09-4, p-w4-4, p-w6-1

-- d) Helsetjeneste-sporet samlet i c-02 / c-05
select default_id, section_id, left(text, 70) from public.tasks
where section_id in ('c-02', 'c-05') and not is_deleted order by section_id, sort_order;
