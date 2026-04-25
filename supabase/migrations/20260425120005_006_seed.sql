-- K-DB-001 — T-006 (seed) — tjenestekatalog og konfig for utvikling

-- Tjenestekategorier
INSERT INTO public.tjeneste_kategorier (label, ikon, farge) VALUES
  ('Eldre & Pårørende', '🏡', '#4A7C6F'),
  ('Barselstøtte',      '🤱', '#E8A4A4');

-- Tjenester med MVA-risiko
INSERT INTO public.tjenester (navn, ikon, pris, varighet_min, mva_sats, mva_risiko, aktiv) VALUES
  ('Morgensstell & dusj',       '🚿', 590, 75,  0, 'lav',    true),
  ('Praktisk bistand',          '🏠', 490, 60,  0, 'lav',    true),
  ('Besøksvenn & sosial støtte','☕', 390, 60,  0, 'høy',   true),  -- ⚠️ avklar MVA
  ('Transport & ærender',       '🚗', 490, 90,  0, 'lav',    true),
  ('Avlastning for pårørende',  '🤝', 490, 60,  0, 'lav',    true),
  ('Ringetilsyn',               '📞', 190, 15,  0, 'lav',    true),
  ('Praktisk bistand (barsel)', '🍼', 490, 60,  0, 'lav',    true),
  ('Trilleturer & avlastning',  '🍃', 390, 60,  0, 'høy',   true),  -- ⚠️ avklar MVA
  ('Samtale & støtte',          '💬', 390, 60,  0, 'medium', true);

-- Dekningsområder
INSERT INTO public.dekningsomraader (navn, fylke, aktiv) VALUES
  ('Moss',         'Viken', true),
  ('Fredrikstad',  'Viken', true),
  ('Sarpsborg',    'Viken', true),
  ('Råde',         'Viken', true),
  ('Vestby',       'Viken', true),
  ('Ås',           'Viken', true),
  ('Ski',          'Viken', true);

-- Avtalemodeller
INSERT INTO public.avtalemodeller (label, faktura_type, betalingsfrist, system_modell) VALUES
  ('Rammeavtale',    'maanedlig',    30, true),
  ('Per bestilling', 'per_oppdrag',  14, true),
  ('Månedspakke',    'maanedlig',    30, true),
  ('Engangstjeneste','engang',       14, false);
