-- EiraNova Oppstart — migrering 006: Claude-konto og prosjekt (K-DOC-002a)
-- Idempotent. Kjøres mot oppstart-prosjektet.
-- (005 er 1Password-navn; denne er neste nummer.)
begin;
insert into public.tasks (default_id, section_id, kind, text, area, owner, is_default, sort_order) values
('p-w2-11', 'plan-w2', 'plan', 'Claude-konto på post@eiranova.no opprettet, prosjektet «EiraNova» satt opp med instruks og prosjektkunnskap (Kom i gang-guiden steg 2c), testspørsmål gir riktig svar', 'Tilganger', 'Lise', true, 11)
on conflict (default_id) do update set section_id = excluded.section_id, kind = excluded.kind, text = excluded.text, area = excluded.area, owner = excluded.owner, sort_order = excluded.sort_order, is_deleted = false;
commit;
-- Verifikasjon: select default_id, text, owner, sort_order from public.tasks where default_id = 'p-w2-11' and not is_deleted;
