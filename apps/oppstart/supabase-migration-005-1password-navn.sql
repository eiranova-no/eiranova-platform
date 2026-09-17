-- EiraNova Oppstart — migrering 005: 1Password-navn for Cursor-onboarding (K-GOV-003)
-- Idempotent. Kjøres mot oppstart-prosjektet.
begin;
insert into public.tasks (default_id, section_id, kind, text, area, owner, is_default, sort_order) values
('p-w2-10', 'plan-w2', 'plan', '1Password-hvelvet «EiraNova»: seks oppføringer omdøpt til nøyaktig Cursor-navnene (Supabase database – oppstart/dev/prod, Supabase token (cursor-eiranova), Vercel token (cursor-eiranova), Resend nøkkel (eiranova-vercel)) – hele verdien i passordfeltet', 'Tilganger', 'Richard', true, 10)
on conflict (default_id) do update set section_id = excluded.section_id, kind = excluded.kind, text = excluded.text, area = excluded.area, owner = excluded.owner, sort_order = excluded.sort_order, is_deleted = false;
commit;
