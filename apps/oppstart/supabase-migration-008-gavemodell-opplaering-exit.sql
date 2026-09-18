-- ═══════════════════════════════════════════════════════════════════
-- EiraNova Oppstart — migrering 008: gavemodell, Richard ut av drift,
-- ny seksjon «Opplæring og verktøy» og «Overlevering – etter MVP»
-- ═══════════════════════════════════════════════════════════════════
-- Idempotent. Krever at index.html har SECTION_META for
-- 'plan-opplaering' og 'plan-exit' (K-OPPSTART-004).
begin;

-- ── 1. Avtaler: gavemodellen (Lise → selskapet) ────────────────────
update public.tasks set text = 'Lisensavtale plattform (Lise → EiraNova AS) signert med BankID etter stiftelse – godkjent i generalforsamling, signert for selskapet av Jeanett', owner = 'Begge' where default_id = 'p-w1-6';
update public.tasks set text = 'Generalforsamling protokollfører godkjenning av lisensavtalen (Lise er part og deltar ikke i behandlingen)', owner = 'Begge' where default_id = 'p-w1-7';
update public.tasks set text = 'Aksjonæravtale (endelig versjon 1.0) lest og signert med BankID av begge', owner = 'Begge' where default_id = 'p-w2-1';
update public.tasks set is_deleted = true where default_id in ('p-w2-2');  -- intensjonsavtalen bortfalt
update public.tasks set text = 'Databehandleravtaler med leverandørene (Google Workspace, Tripletex, Supabase, Vercel, Resend) akseptert og arkivert i Drive', owner = 'Lise' where default_id = 'p-w5-5';
update public.tasks set text = 'Lisensavtale plattform (Lise → EiraNova AS) signert og godkjent i generalforsamling', owner = 'Begge' where default_id = 'c-01-6';
update public.tasks set is_deleted = true where default_id in ('c-04-5', 'c-04-7');  -- Calendly / Microsoft (sikring – kan allerede være arkivert)

-- ── 2. Richard ut som ressurs / mottaker ───────────────────────────
update public.tasks set text = 'Originalfil av logo (høy oppløsning) lagt i selskapets Drive under Markedsføring/Logo – til trykk og nett', owner = 'Jeanett' where default_id = 'p-w2-9';
update public.tasks set text = 'Prisliste ferdig – legges inn på eiranova.no/priser via endringsønske til Claude (K-MARKETING-008)', owner = 'Begge' where default_id = 'p-w4-1';
update public.tasks set owner = 'Begge' where default_id in ('p-w4-4', 'c-04-2', 'c-09-4', 'p-w6-1', 'c-05-6', 'p-w8-5');
update public.tasks set text = 'Priser publisert på eiranova.no (K-MARKETING-008) – via endringsønske i Claude → Cursor', owner = 'Begge' where default_id = 'p-w6-2';
update public.tasks set text = 'Ukentlig eiermøte: friksjon, tidsbruk, kundebehov → endringsønsker til Claude og køen', owner = 'Begge' where default_id = 'p-w8-2';
update public.tasks set section_id = 'plan-exit', sort_order = 3, text = '1Password-hvelvet «EiraNova»: seks oppføringer med nøyaktig Cursor-navnene, hvelvet delt med Lise (gjøres av Richard før overlevering)', owner = 'Richard' where default_id = 'p-w2-10';

-- ── 3. Ny seksjon: Opplæring og verktøy ────────────────────────────
insert into public.tasks (default_id, section_id, kind, text, area, owner, is_default, sort_order) values
('p-op-1',  'plan-opplaering', 'plan', 'Kom i gang-guiden steg 0–2: programmer, Chrome-profil «EiraNova», kontoer (docs/pilot/kom-i-gang-fra-null.md)', 'Guide', 'Lise', true, 1),
('p-op-2',  'plan-opplaering', 'plan', 'Kom i gang-guiden steg 0–2: programmer, Chrome-profil «EiraNova», kontoer', 'Guide', 'Jeanett', true, 2),
('p-op-3',  'plan-opplaering', 'plan', 'Steg 3–4: arkivet hentet i Cursor, «Sett opp tilganger» sa Ferdig', 'Guide', 'Lise', true, 3),
('p-op-4',  'plan-opplaering', 'plan', 'Steg 3–4: arkivet hentet i Cursor, «Sett opp tilganger» sa Ferdig (Windows)', 'Guide', 'Jeanett', true, 4),
('p-op-5',  'plan-opplaering', 'plan', 'Steg 5: øvelsen gjennomført – navnet mitt står i docs/pilot/ovelse.md på main', 'Guide', 'Lise', true, 5),
('p-op-6',  'plan-opplaering', 'plan', 'Steg 5: øvelsen gjennomført – navnet mitt står i docs/pilot/ovelse.md på main', 'Guide', 'Jeanett', true, 6),
('p-op-7',  'plan-opplaering', 'plan', 'Steg 6: første ekte endring på eiranova.no gjennomført med forhåndsvisning', 'Guide', 'Begge', true, 7),
('p-op-8',  'plan-opplaering', 'plan', 'Økt 1 – Kart og kompass (2 t): guiden steg 0–5 gjennomført sammen første gang', 'Økt', 'Begge', true, 8),
('p-op-9',  'plan-opplaering', 'plan', 'Økt 2 – Ønske til kode (2 t): hver gjør én liten kontrakt fra endringsønske til live', 'Økt', 'Begge', true, 9),
('p-op-10', 'plan-opplaering', 'plan', 'Økt 3 – Drift og feil (2 t): rollback utført med vilje, passordhvelv og kontoer gjennomgått', 'Økt', 'Begge', true, 10),
('p-op-11', 'plan-opplaering', 'plan', 'Økt 4 – Trappen, køen og bestilling (1 t): én idé parkert i køen, én QA-bestilling skrevet', 'Økt', 'Begge', true, 11),
('p-op-12', 'plan-opplaering', 'plan', 'Testspørsmål til Claude-prosjektet gir riktig svar (ber om zip, viser til endringsønske-malen, vanlig norsk)', 'Claude', 'Begge', true, 12),
('p-op-13', 'plan-opplaering', 'plan', 'Hverdagsrutinen brukt én gang: «Hva er neste i køen?» i Cursor → startet', 'Rutine', 'Begge', true, 13)
on conflict (default_id) do update set section_id = excluded.section_id, text = excluded.text, area = excluded.area, owner = excluded.owner, sort_order = excluded.sort_order, is_deleted = false;

-- ── 4. Ny seksjon: Overlevering – etter MVP (speiler K-OVERLEVERING-001) ──
insert into public.tasks (default_id, section_id, kind, text, area, owner, is_default, sort_order) values
('p-ex-1',  'plan-exit', 'plan', 'MVP (M1) levert: ett oppdrag hele veien bestill → tildel → utfør → fullført – forutsetning for alt under', 'Forutsetning', 'Richard', true, 1),
('p-ex-2',  'plan-exit', 'plan', 'Selskapets GitHub-konto gitEiraNova er eier av organisasjonen eiranova-no (K-GOV-005)', 'GitHub', 'Lise', true, 2),
('p-ex-4',  'plan-exit', 'plan', 'Tag v1.0-overlevering satt og docs/EIERSKAP.md lest av begge: alt før tag = Lises gave, alt etter = selskapets', 'Eierskap', 'Begge', true, 4),
('p-ex-5',  'plan-exit', 'plan', 'Richard fjernet fra GitHub-organisasjonen, Vercel-teamet, Supabase-organisasjonen, Resend og 1Password-hvelvet', 'Kontoer', 'Richard', true, 5),
('p-ex-6',  'plan-exit', 'plan', 'Nye Vercel- og Supabase-tokens laget på selskapets konto og lagt i 1Password; Richards tokens slettet', 'Tilganger', 'Lise', true, 6),
('p-ex-7',  'plan-exit', 'plan', '«Sett opp tilganger» kjørt på nytt på Lises maskin med nye tokens – Cursor sa Ferdig', 'Tilganger', 'Lise', true, 7),
('p-ex-8',  'plan-exit', 'plan', 'Gavebrev med utfylt overleveringsprotokoll (tag, dato, avhukede punkter) signert med BankID – Richard og Lise', 'Signering', 'Lise', true, 8),
('p-ex-9',  'plan-exit', 'plan', 'Første kontrakt etter overlevering gjennomført av Lise alene – beviset på at overleveringen er reell', 'Bevis', 'Lise', true, 9),
('p-ex-10', 'plan-exit', 'plan', 'Skjermbilder til Kom i gang-guiden levert (K-DOC-003) – gjøres av Richard før overlevering', 'Guide', 'Richard', true, 10)
on conflict (default_id) do update set section_id = excluded.section_id, text = excluded.text, area = excluded.area, owner = excluded.owner, sort_order = excluded.sort_order, is_deleted = false;

commit;

-- Verifikasjon
-- a) Ingen «Richard» utenfor plan-exit (forventet: 0 rader)
select default_id, section_id, owner, left(text,80) from public.tasks
where not is_deleted and section_id <> 'plan-exit' and (text ilike '%richard%' or owner ilike '%richard%');
-- b) Nye seksjoner (forventet: 13 og 10)
select section_id, count(*) from public.tasks where not is_deleted and section_id in ('plan-opplaering','plan-exit') group by 1;
