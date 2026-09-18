-- EiraNova Oppstart — migrering 007: selskapets GitHub-konto (K-DOC-002b)
-- Idempotent. Kjøres mot oppstart-prosjektet.
-- (006 er Claude; denne er neste nummer.)
begin;
insert into public.tasks (default_id, section_id, kind, text, area, owner, is_default, sort_order) values
('p-w2-12', 'plan-w2', 'plan', 'Selskapets GitHub-konto gitEiraNova opprettet på post@eiranova.no med 2FA, lagret i 1Password som «GitHub gitEiraNova», og klar for eier-invitasjon (Kom i gang-guiden steg 2b-2)', 'Tilganger', 'Lise', true, 12)
on conflict (default_id) do update set section_id = excluded.section_id, kind = excluded.kind, text = excluded.text, area = excluded.area, owner = excluded.owner, sort_order = excluded.sort_order, is_deleted = false;
commit;
-- Verifikasjon: select default_id, text, owner, sort_order from public.tasks where default_id = 'p-w2-12' and not is_deleted;
