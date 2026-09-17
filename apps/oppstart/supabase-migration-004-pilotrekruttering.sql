-- EiraNova Oppstart — migrering 004: pilotrekruttering (M2 · plan-w6)
-- Idempotent. Kjøres i Supabase SQL Editor for oppstart-prosjektet.
-- Supplerer eksisterende p-w6-x med kanalstrategien fra «Slik finner dere de første pilotkundene».
begin;
insert into public.tasks (default_id, section_id, kind, text, area, owner, is_default, sort_order) values
('p-w6-10', 'plan-w6', 'plan', 'Nettverk: 3–5 tidligere kolleger bedt om å nevne EiraNova når det passer (ikke selge)', 'Nettverk', 'Begge', true, 10),
('p-w6-11', 'plan-w6', 'plan', 'Familie/venner/naboer spurt direkte: «Kjenner du noen som kunne trengt oss?»', 'Nettverk', 'Begge', true, 11),
('p-w6-12', 'plan-w6', 'plan', 'Helsestasjon, barselgruppe og åpen barnehage: brosjyre/visittkort lagt ut (etter avtale)', 'Småbarnsfamilier', 'Jeanett', true, 12),
('p-w6-13', 'plan-w6', 'plan', 'Facebook foreldregrupper (Moss/Fredrikstad/Sarpsborg): svart som person i tråder om avlastning – ikke annonse', 'Småbarnsfamilier', 'Jeanett', true, 13),
('p-w6-14', 'plan-w6', 'plan', 'Frivilligsentral, seniorsenter og menighet: ett møte med leder, brosjyre levert', 'Eldre/pårørende', 'Lise', true, 14),
('p-w6-15', 'plan-w6', 'plan', 'Fastlegekontor: brosjyre på venterom (spurt om lov)', 'Eldre/pårørende', 'Lise', true, 15),
('p-w6-16', 'plan-w6', 'plan', 'Første kunde innen 14 dager – tre kunder innen 30. november', 'Mål', 'Begge', true, 16),
('p-w6-17', 'plan-w6', 'plan', 'Bestillingsloggen har kolonne «Kilde» (kollega/Facebook/helsestasjon/anbefaling) – fylles for hver kunde', 'Måling', 'Lise', true, 17),
('p-w7-8', 'plan-w7', 'plan', 'Etter tredje besøk: spurt kunden «kjenner du noen som kunne hatt nytte av det samme?»', 'Ambassadør', 'Begge', true, 8),
('p-w7-9', 'plan-w7', 'plan', 'Ett anonymt kundesitat innhentet med samtykke – til eiranova.no', 'Ambassadør', 'Jeanett', true, 9)
on conflict (default_id) do update set section_id = excluded.section_id, kind = excluded.kind, text = excluded.text, area = excluded.area, owner = excluded.owner, sort_order = excluded.sort_order, is_deleted = false;
commit;
-- Verifikasjon: select default_id, text from public.tasks where section_id in ('plan-w6','plan-w7') and not is_deleted order by section_id, sort_order;
