# EiraNova — Cursor-instruksjon v5.0
# Basert på: EiraNova-UX-Handoff-Bootstrapping-2.docx (22. mars 2026)
# Prototype: EiraNova-Prototype-HANDOFF-v17.jsx · 7 826 linjer (auth: e-post+passord) · Babel-verifisert
# Plasser denne filen i roten: ~/code/eiranova-platform/CURSOR-INSTRUKSJON.md

---

## Slik bruker du denne filen

1. `git checkout dev && git pull origin dev`
2. Les kontrakten nedenfor som er merket **ready**
3. Opprett branch: `git checkout -b feature/K-XXX-beskrivelse`
4. Implementer alle T-XXX steg i rekkefølge
5. Verifiser alle akseptansekriterier ✅
6. Commit, push, åpne PR mot `dev`

**Aldri start neste kontrakt uten at forrige er godkjent og merget.**

---

## Prosjektkontekst

```
Produkt:      EiraNova — Norsk hjemmehelsetjeneste-plattform
Eier:         EiraNova AS (tre medeiere), holding X Group AS / CoreX
Prototype:    EiraNova-Prototype-HANDOFF-v17.jsx (7826 linjer, Babel-verifisert)
GitHub:       github.com/eiranova-no/eiranova-platform
Supabase:     EiraNova-org, eu-central-1 Frankfurt (GDPR — OBLIGATORISK)
Vercel:       Team EiraNova
Domene:       app.eiranova.no (ett domene, rollebasert ruting)
Regnskap:     Tripletex (master — EHF/PEPPOL, bankfeed, lønn, A-melding)
Betaling:     Vipps ePayment + Stripe (B2C) · EHF/PEPPOL via Tripletex (B2B)
```

---

## Designsystem (fra prototype)

```
Fonter:       Fraunces (display/titler) + DM Sans (brødtekst)
              NB: DM Sans erstatter Lato fra v1 — oppdater alle apper

Farger:
  C.navy        #1A2E24 / #2C3E35   Overskrifter, primærtekst
  C.green       #4A7C6F             Primærfarge, knapper
  C.greenDark   #2C5C52             Gradienter, headers
  C.greenLight  #7FAE96             Sekundær aksentuering
  C.greenBg     #EDF5F3             Kortbakgrunn, input-felt
  C.gold        #C4956A             Varsler, B2B
  C.rose        #E8A4A4             Barsel-kategori
  C.danger      #E11D48             Feil, sletting
  C.soft        #7A8E85             Undertekst
  C.border      #E4EDE9             Kanter
  C.cream       #FAF6F1             Sidebakgrunn
  C.vipps       #FF5B24             Vipps-knapper
  C.sky         #2563EB             Stripe, info
  C.sidebar     #1E3A2F             Admin sidebar
  C.sidebarAccent #4ABC9E           Admin sidebar aktiv

Breakpoint:   700px — under = phone-shell, over = full webapp
Desktop:      max-width 900-1200px, DeskNav øverst erstatter BNav
Mobil:        Phone-shell 390px max-width, BNav 5 ikoner
```

---

## Appstruktur — fire apper, ett domene

```
app.eiranova.no/
├── (kunde)/          Landing, Login, Hjem, Bestill, Betaling, Mine, Profil, Chat
├── (sykepleier)/     Login, Rolle, Hjem, Innsjekk, Rapport, Profil
├── (b2b)/            Dashboard (koordinator), Bestill, Bruker/pasient
└── (admin)/          Dashboard, Oppdrag, Betalinger, B2B, Ansatte,
                      Økonomi, Tjenester, Innstillinger
```

**Viktig:** B2B-innlogging skjer via Kunde-app Login → Bedriftskunde.
Det er IKKE en separat URL. Koordinator og bruker/pasient har ulike flyter
fra samme login-skjerm.

---

## Auth-regler (fra handoff §4)

```
Privat kunde (ny):    e-post + passord (registrer) →
                      push-tillatelse → samtykke → onboarding → hjem

Privat kunde (eks.):  e-post + passord (logg inn) → hjem
                      Glemt passord → reset-link på e-post → nytt passord

                      NB: INGEN Magic Link. INGEN Google OAuth for kunder.

Koordinator (B2B):    Login → Bedriftskunde → Har fått invitasjon →
                      e-post + passord → b2b-dashboard

Bruker/pasient (B2B): Login → Bedriftskunde → Jeg er bruker →
                      e-post+passord → b2b-bruker

Sykepleier:           Google Workspace (@eiranova.no) →
                      rolle-valg → nurse-hjem

Admin:                Sykepleier-innlogging → Koordinator-rolle → Adminpanel
```

---

## navTo-guard — beskyttede ruter

Følgende ruter krever innlogging. navTo() sjekker loggedIn-state:
`bestill · mine · kunde-profil · oppdrag-i-gang · chat-kunde`

Uinnloggede brukere → login-gate (IngenInvitasjonInfo / LoginGate).

---

## Betaling og MVA

```
Vipps ePayment:  B2C engangsbetalinger + refusjon
Stripe:          Visa/Mastercard alternativ
Tripletex:       EHF/PEPPOL for B2B (kommuner, borettslag, bedrifter)

MVA:  0% for helsetjenester (mval. §3-2)
      ⚠️ RISIKO: Besøksvenn og Trilleturer er markert mva_risiko: "høy"
         i prototype. MÅ avklares med revisor FØR lansering.
         MVA-sats er konfigurerbar per tjeneste i Admin → Tjenester.

Tripletex erstatter Fiken (fra v2 av instruksjonen).
Tripletex er master for ALT: B2C bilag, B2B EHF, lønn, A-melding.
```

---

## Kanselleringsregler (fra handoff §5.1)

```
> 24 timer:   0 kr  — gratis kansellering
12-24 timer:  50%   — sent varsel
< 4 timer:    100%  — svært sent
Sykepleier syk: 0 kr + full refusjon (EiraNova betaler)
Force majeure:  0 kr + individuell vurdering (admin beslutter)
```

---

## Vaktvakt-flyt (§5.2)

```
Steg 1 (0 min):   Oppdrag uten sykepleier → push/SMS til aktive vikarer
Steg 2 (0-30 min): Fortsatt ingen → API til Manpower Health (api.manpower.no/health/v2)
Steg 3 (30-90 min): Ingen API-svar → manuell varsling til admin
Steg 4 (ved tildeling): SMS/push til kunde med ny sykepleiers navn + tid
```

---

## Globale regler

- ALDRI commit direkte til `main` eller `dev`
- ALLTID starte fra `dev`: `git checkout dev && git pull origin dev`
- Feature-branches merges KUN til `dev`
- Kjør `pnpm generate-cc` etter CONTRACT_QUEUE-endringer
- Norsk UI-tekst, engelsk kode og kommentarer
- Mock data med `// TODO: Supabase` frem til ekte queries
- Les kontraktfil FØR kode skrives (SPEC-PROTECTION)
- Én kontrakt om gangen — maks 1 `active` i køen
- Tripletex (IKKE Fiken) som regnskapssystem
- DM Sans (IKKE Lato) som brødtekst

---

# FASE 0 — FUNDAMENT

---

## K-DB-001 — Alle Supabase-tabeller

**Status:** ready | **Type:** infra | **Tid:** 3-4 t | **Avhenger av:** —

**Mål:** Opprett komplett databaseskjema basert på §3 i UX-handoff.
RLS på alle tabeller. Seed-data for utvikling.

### T-001 — Kjernetabeller

```sql
-- supabase/migrations/001_core.sql

-- Enums
CREATE TYPE user_role AS ENUM ('kunde','sykepleier','koordinator','admin');
CREATE TYPE oppdrag_status AS ENUM ('pending','bekreftet','tildelt','aktiv','fullfort','avlyst');
CREATE TYPE betaling_metode AS ENUM ('vipps','stripe','ehf','kredittnota');
CREATE TYPE betaling_status AS ENUM ('venter','betalt','feilet','refundert');
CREATE TYPE mva_risiko AS ENUM ('lav','medium','høy');
CREATE TYPE b2b_type AS ENUM ('kommune','borettslag','bedrift');
CREATE TYPE faktura_type AS ENUM ('maanedlig','per_oppdrag','engang','kvartal');
CREATE TYPE severity_level AS ENUM ('SEV1','SEV2','SEV3','INFO');
CREATE TYPE samtykke_type AS ENUM ('gdpr','vilkaar','markedsfoering');
CREATE TYPE sykepleier_status AS ENUM ('aktiv','venter_godkjenning','inaktiv');
CREATE TYPE kreditering_status AS ENUM ('initiert','refundert','sendt');
CREATE TYPE kreditering_metode AS ENUM ('vipps','stripe','kreditnota');
CREATE TYPE b2b_faktura_status AS ENUM ('usendt','sendt','forfalt','betalt');
CREATE TYPE varsel_kanal AS ENUM ('push','sms');

-- users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  full_name TEXT,
  address TEXT,
  postnr TEXT,
  poststed TEXT,
  role user_role NOT NULL DEFAULT 'kunde',
  terms_accepted_at TIMESTAMPTZ,
  gdpr_consent_at TIMESTAMPTZ,
  marketing_consent BOOLEAN DEFAULT FALSE,
  push_enabled BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- soft delete
);

-- parorende
CREATE TABLE public.parorende (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  navn TEXT NOT NULL,
  adresse TEXT,
  postnr TEXT,
  poststed TEXT,
  relasjon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- tjeneste_kategorier
CREATE TABLE public.tjeneste_kategorier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  ikon TEXT,
  farge TEXT,
  gradient TEXT,
  opprettet_at TIMESTAMPTZ DEFAULT NOW()
);

-- tjenester
CREATE TABLE public.tjenester (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  navn TEXT NOT NULL,
  ikon TEXT,
  kategori_id UUID REFERENCES public.tjeneste_kategorier(id),
  beskrivelse TEXT,
  pris DECIMAL(10,2) NOT NULL,
  b2b_pris DECIMAL(10,2),
  varighet_min INTEGER,
  mva_sats DECIMAL(5,2) DEFAULT 0,
  mva_risiko mva_risiko DEFAULT 'lav',
  aktiv BOOLEAN DEFAULT TRUE,
  utfoert_av TEXT[],
  instruks_kunde TEXT,
  instruks_sykepleier TEXT,
  inkluderer TEXT[],
  inkluderer_ikke TEXT[],
  versjon INTEGER DEFAULT 1,
  endret_av UUID REFERENCES public.users(id),
  endret_dato TIMESTAMPTZ,
  opprettet_at TIMESTAMPTZ DEFAULT NOW()
);

-- sykepleiere
CREATE TABLE public.sykepleiere (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  hpr_nummer TEXT,
  tittel TEXT,
  bio TEXT,
  spesialiteter TEXT[],
  sprak TEXT[],
  erfaring_aar INTEGER,
  sertifisert BOOLEAN DEFAULT FALSE,
  omrade TEXT[],
  rating DECIMAL(3,2),
  antall_oppdrag INTEGER DEFAULT 0,
  er_vikar BOOLEAN DEFAULT FALSE,
  enk_org TEXT,
  kontonr TEXT,
  godkjent BOOLEAN DEFAULT FALSE,
  godkjent_dato TIMESTAMPTZ,
  varsel_kanal varsel_kanal DEFAULT 'push',
  aktiv BOOLEAN DEFAULT TRUE,
  status sykepleier_status DEFAULT 'venter_godkjenning'
);

-- oppdrag
CREATE TABLE public.oppdrag (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kunde_id UUID NOT NULL REFERENCES public.users(id),
  parorende_id UUID REFERENCES public.parorende(id),
  sykepleier_id UUID REFERENCES public.sykepleiere(id),
  tjeneste_id UUID REFERENCES public.tjenester(id),
  dato DATE NOT NULL,
  tid_start TIME NOT NULL,
  tid_slutt TIME,
  adresse TEXT,
  status oppdrag_status DEFAULT 'pending',
  betalt_via betaling_metode,
  belop DECIMAL(10,2),
  b2b_org_id UUID REFERENCES public.b2b_organisasjoner(id),
  b2b_bruker_id UUID REFERENCES public.b2b_brukere(id),
  vipps_payment_id TEXT,
  stripe_payment_intent TEXT,
  opprettet_at TIMESTAMPTZ DEFAULT NOW(),
  oppdatert_at TIMESTAMPTZ DEFAULT NOW()
);

-- oppdrag_endringer (append-only)
CREATE TABLE public.oppdrag_endringer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oppdrag_id UUID NOT NULL REFERENCES public.oppdrag(id),
  dato TIMESTAMPTZ DEFAULT NOW(),
  endret_av UUID REFERENCES public.users(id),
  handling TEXT NOT NULL,
  arsak TEXT,
  ny_sykepleier_id UUID REFERENCES public.sykepleiere(id)
);

-- vurderinger
CREATE TABLE public.vurderinger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oppdrag_id UUID NOT NULL UNIQUE REFERENCES public.oppdrag(id),
  kunde_id UUID NOT NULL REFERENCES public.users(id),
  sykepleier_id UUID NOT NULL REFERENCES public.sykepleiere(id),
  stjerner INTEGER CHECK (stjerner BETWEEN 1 AND 5),
  kommentar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### T-002 — Betalings- og B2B-tabeller

```sql
-- supabase/migrations/002_payments_b2b.sql

-- b2b_organisasjoner
CREATE TABLE public.b2b_organisasjoner (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  navn TEXT NOT NULL,
  type b2b_type NOT NULL,
  org_nr TEXT UNIQUE,
  kontakt_epost TEXT,
  peppol_aktiv BOOLEAN DEFAULT FALSE,
  betalingsdager INTEGER DEFAULT 30,
  prismodell_id UUID,
  ramme_priser JSONB,
  maaneds_pris DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- b2b_brukere
CREATE TABLE public.b2b_brukere (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  b2b_org_id UUID NOT NULL REFERENCES public.b2b_organisasjoner(id),
  user_id UUID REFERENCES public.users(id),
  navn TEXT NOT NULL,
  fodselsdato DATE,
  adresse TEXT,
  pakke TEXT,
  aktiv BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- avtalemodeller
CREATE TABLE public.avtalemodeller (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  ikon TEXT,
  farge TEXT,
  beskrivelse TEXT,
  faktura_type faktura_type NOT NULL,
  fakturadag INTEGER DEFAULT 1,
  betalingsfrist INTEGER DEFAULT 30,
  aktiv BOOLEAN DEFAULT TRUE,
  system_modell BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- betalinger
CREATE TABLE public.betalinger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oppdrag_id UUID REFERENCES public.oppdrag(id),
  kunde_id UUID REFERENCES public.users(id),
  belop DECIMAL(10,2) NOT NULL,
  metode betaling_metode NOT NULL,
  status betaling_status DEFAULT 'venter',
  ekstern_ref TEXT,
  opprettet_at TIMESTAMPTZ DEFAULT NOW()
);

-- krediteringer
CREATE TABLE public.krediteringer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('b2c','b2b')),
  oppdrag_id UUID REFERENCES public.oppdrag(id),
  kunde_id UUID REFERENCES public.users(id),
  b2b_org_id UUID REFERENCES public.b2b_organisasjoner(id),
  belop DECIMAL(10,2) NOT NULL,
  arsak TEXT,
  arsak_type TEXT,
  metode kreditering_metode,
  status kreditering_status DEFAULT 'initiert',
  godkjent_av UUID REFERENCES public.users(id),
  kreditnota_nr TEXT,
  opprettet_at TIMESTAMPTZ DEFAULT NOW()
);

-- b2b_fakturaer
CREATE TABLE public.b2b_fakturaer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  b2b_org_id UUID NOT NULL REFERENCES public.b2b_organisasjoner(id),
  periode TEXT,
  status b2b_faktura_status DEFAULT 'usendt',
  belop DECIMAL(10,2),
  peppol_ref TEXT,
  pdf_url TEXT,
  forfallsdato DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kreditnota-sekvens
CREATE SEQUENCE kreditnota_seq START 1;
CREATE OR REPLACE FUNCTION next_kreditnota_nr()
RETURNS TEXT AS $$
  SELECT 'KN-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' ||
    LPAD(nextval('kreditnota_seq')::TEXT, 3, '0');
$$ LANGUAGE sql;
```

### T-003 — Personal- og lønnstabeller

```sql
-- supabase/migrations/003_personal.sql

-- ansatte
CREATE TABLE public.ansatte (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  tittel TEXT,
  stillingsprosent DECIMAL(5,2),
  timer_per_uke DECIMAL(5,2),
  lonnstrinn INTEGER,
  grunnlonn DECIMAL(10,2),
  ansatt_dato DATE,
  aktiv BOOLEAN DEFAULT TRUE,
  kontonr TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- vikarer
CREATE TABLE public.vikarer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sykepleier_id UUID NOT NULL REFERENCES public.sykepleiere(id),
  enk BOOLEAN DEFAULT TRUE,
  enk_org TEXT,
  kontonr TEXT,
  varsel_kanal varsel_kanal DEFAULT 'push',
  responstid_snitt INTEGER,
  tjenester UUID[],
  omrade TEXT[],
  aktiv BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- bemanningsbyraaer
CREATE TABLE public.bemanningsbyraaer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  navn TEXT NOT NULL,
  kontakt TEXT,
  telefon TEXT,
  api_aktiv BOOLEAN DEFAULT FALSE,
  api_url TEXT DEFAULT 'api.manpower.no/health/v2',
  api_status TEXT,
  timepris_sykepleier DECIMAL(10,2),
  timepris_hjelpepleier DECIMAL(10,2),
  faktura_type TEXT,
  avtale TEXT,
  aktiv BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- lonnkjoringer
CREATE TABLE public.lonnkjoringer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  maaned TEXT NOT NULL,
  status TEXT DEFAULT 'kladd',
  utbetalings_dato DATE,
  total_brutto DECIMAL(12,2),
  total_netto DECIMAL(12,2),
  ag_avgift DECIMAL(12,2),
  feriepenger DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- skattetrekk
CREATE TABLE public.skattetrekk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lonnkjoring_id UUID REFERENCES public.lonnkjoringer(id),
  ansatt_id UUID REFERENCES public.ansatte(id),
  trekk_prosent DECIMAL(5,2),
  trekk_belop DECIMAL(10,2),
  innbetalt_dato DATE,
  kid TEXT,
  status TEXT DEFAULT 'venter'
);
```

### T-004 — Konfigurasjon og GDPR-tabeller

```sql
-- supabase/migrations/004_config_gdpr.sql

-- dekningsomraader
CREATE TABLE public.dekningsomraader (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  navn TEXT NOT NULL,
  fylke TEXT,
  aktiv BOOLEAN DEFAULT TRUE,
  apner TIME,
  stenges TIME,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- varslingsmottakere
CREATE TABLE public.varslingsmottakere (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  navn TEXT NOT NULL,
  epost TEXT NOT NULL,
  rolle TEXT,
  varsler JSONB,
  kanaler JSONB DEFAULT '{"epost":true,"push":false,"sms":false}',
  aktiv BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- innstillinger (singleton)
CREATE TABLE public.innstillinger (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
  org_navn TEXT DEFAULT 'EiraNova AS',
  org_nr TEXT,
  kontakt_epost TEXT,
  b2b_aktiv BOOLEAN DEFAULT FALSE,
  mva_sats DECIMAL(5,2) DEFAULT 0,
  fakturadag INTEGER DEFAULT 1,
  betalingsfrist INTEGER DEFAULT 30,
  kansellering_frister JSONB DEFAULT '{"over_24h":0,"12_24h":50,"under_4h":100}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO public.innstillinger DEFAULT VALUES;

-- push_varsler
CREATE TABLE public.push_varsler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  type TEXT NOT NULL,
  tittel TEXT NOT NULL,
  body TEXT,
  data JSONB,
  lest BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- system_events
CREATE TABLE public.system_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  severity severity_level DEFAULT 'INFO',
  melding TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- samtykker (GDPR — kan ikke slettes)
CREATE TABLE public.samtykker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  type samtykke_type NOT NULL,
  versjon TEXT NOT NULL,
  godkjent_at TIMESTAMPTZ DEFAULT NOW(),
  trukket_at TIMESTAMPTZ
);

-- push_subscriptions (PWA)
CREATE TABLE public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);
```

### T-005 — RLS policies

```sql
-- supabase/migrations/005_rls.sql

-- Hjelpe-funksjon
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users: own" ON public.users FOR ALL USING (id = auth.uid());
CREATE POLICY "users: admin read" ON public.users FOR SELECT
  USING (current_user_role() IN ('koordinator','admin'));

-- oppdrag
ALTER TABLE public.oppdrag ENABLE ROW LEVEL SECURITY;
CREATE POLICY "oppdrag: kunde" ON public.oppdrag FOR SELECT
  USING (kunde_id = auth.uid());
CREATE POLICY "oppdrag: sykepleier" ON public.oppdrag FOR SELECT
  USING (sykepleier_id IN (SELECT id FROM public.sykepleiere WHERE user_id = auth.uid()));
CREATE POLICY "oppdrag: admin all" ON public.oppdrag FOR ALL
  USING (current_user_role() IN ('koordinator','admin'));

-- sykepleiere
ALTER TABLE public.sykepleiere ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sykepleiere: read active" ON public.sykepleiere FOR SELECT
  USING (aktiv = TRUE AND auth.uid() IS NOT NULL);
CREATE POLICY "sykepleiere: admin write" ON public.sykepleiere FOR ALL
  USING (current_user_role() IN ('koordinator','admin'));

-- b2b_organisasjoner
ALTER TABLE public.b2b_organisasjoner ENABLE ROW LEVEL SECURITY;
CREATE POLICY "b2b_org: admin" ON public.b2b_organisasjoner FOR ALL
  USING (current_user_role() IN ('koordinator','admin'));

-- lonnkjoringer, ansatte, innstillinger
ALTER TABLE public.lonnkjoringer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ansatte ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innstillinger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lonn: admin" ON public.lonnkjoringer FOR ALL
  USING (current_user_role() = 'admin');
CREATE POLICY "ansatte: admin" ON public.ansatte FOR ALL
  USING (current_user_role() = 'admin');
CREATE POLICY "innstillinger: admin" ON public.innstillinger FOR ALL
  USING (current_user_role() = 'admin');

-- samtykker (aldri slett)
ALTER TABLE public.samtykker ENABLE ROW LEVEL SECURITY;
CREATE POLICY "samtykker: own read/create" ON public.samtykker
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "samtykker: own insert" ON public.samtykker
  FOR INSERT WITH CHECK (user_id = auth.uid());
-- Ingen DELETE policy — GDPR-logg kan ikke slettes

-- oppdrag_endringer (append-only)
ALTER TABLE public.oppdrag_endringer ENABLE ROW LEVEL SECURITY;
CREATE POLICY "oppdrag_end: insert" ON public.oppdrag_endringer
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "oppdrag_end: read admin" ON public.oppdrag_endringer
  FOR SELECT USING (current_user_role() IN ('koordinator','admin'));
```

### T-006 — Seed-data for utvikling

```sql
-- supabase/migrations/006_seed.sql (dev only)

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
```

### K-DB-001 Akseptansekriterier

```
✅ supabase db push kjører uten feil
✅ Alle 20+ tabeller eksisterer i eiranova-dev
✅ RLS aktivert på alle tabeller
✅ Seed-data finnes: 9 tjenester, 7 dekningsområder, 4 avtalemodeller
✅ Enums opprettes korrekt
✅ current_user_role() hjelpe-funksjon fungerer
```

---

## K-AUTH-001 — Supabase Auth: Kunder (e-post + passord)

**Status:** planned | **Tid:** 3-4 t | **Avhenger av:** K-DB-001

**Mål:** E-post + passord for kunder. Glemt passord via reset-e-post.
INGEN Magic Link. INGEN Google OAuth for kunder.
Ny konto-flyt: push-tillatelse → samtykke → onboarding.

### Auth-flow (ny konto):
```
registrer (e-post + passord) → push-tillatelse → samtykke (GDPR+vilkår påkrevd, markedsf. valgfri)
     → onboarding (steg 1: hvem/pårørende, steg 2: adresse, steg 3: klar)
     → hjem
```

### Auth-flow (eksisterende konto):
```
logg inn (e-post + passord) → hjem
```

### Glemt passord-flyt:
```
Login → «Glemt passord?» → skriv inn e-post
     → Supabase sender reset-link → bruker klikker link
     → Nytt passord-skjerm → lagre → login → hjem
```

```typescript
// Supabase e-post + passord auth
await supabase.auth.signUp({ email, password })
await supabase.auth.signInWithPassword({ email, password })

// Glemt passord
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: 'https://app.eiranova.no/reset-passord'
})

// Sett nytt passord (på reset-passord-skjermen)
await supabase.auth.updateUser({ password: nyttPassord })
```

### Viktig — Samtykke-skjerm:
- To avmerkingsbokser som BEGGE må krysses av: Personvernerklæring + Vilkår
- En valgfri: Markedsføring
- Lagres i samtykker-tabellen med versjon + timestamp
- Kan IKKE avvises (blokkerer videre flyt)

### navTo-guard:
```typescript
const PROTECTED = ['bestill','mine','kunde-profil','oppdrag-i-gang','chat-kunde']

function navTo(screen: string) {
  if (PROTECTED.includes(screen) && !loggedIn) {
    setScreen('login-gate')
    setPendingNav(screen)
    return
  }
  setScreen(screen)
}
```

### Akseptansekriterier:
```
✅ e-post + passord registrering fungerer
✅ e-post + passord innlogging fungerer
✅ Feil passord gir tydelig feilmelding (ikke "bruker finnes ikke")
✅ Glemt passord → reset-e-post sendes
✅ Reset-link setter nytt passord korrekt
✅ Ny konto → push-tillatelse → samtykke → onboarding → hjem
✅ Eksisterende konto → direkte til hjem
✅ Samtykker lagres i samtykker-tabellen
✅ Uinnlogget → login-gate med pending-nav
✅ INGEN Magic Link-knapper i UI
✅ INGEN Google OAuth for kunder
```

---

## K-AUTH-002 — Google Workspace-innlogging (sykepleiere)

**Status:** planned | **Tid:** 2-3 t | **Avhenger av:** K-DB-001

**Mål:** Google Workspace (@eiranova.no) innlogging med kontopicker.
Rollebasert ruting etter innlogging.

```typescript
// KUN én metode — Google Workspace
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    queryParams: { hd: 'eiranova.no' }, // ← kontopicker viser @eiranova.no automatisk
    redirectTo: `${window.location.origin}/auth/callback`,
  }
})
```

### Role-routing (callback):
```typescript
const role = userData.role
if (role === 'admin' || role === 'koordinator') redirect('/admin/dashboard')
else if (role === 'sykepleier') {
  const hasCoord = /* sjekk user_roles */ false
  if (hasCoord) redirect('/nurse/velg-rolle')
  else redirect('/nurse/hjem')
}
```

### B2B koordinator-flyt:
```
Login → Bedriftskunde → Har fått invitasjon →
Google Workspace / e-post → validér mot b2b_organisasjoner → b2b-dashboard
```

### B2B bruker/pasient-flyt:
```
Login → Bedriftskunde → Jeg er bruker →
e-post + passord → validér mot b2b_brukere → b2b-bruker
```

### Akseptansekriterier:
```
✅ @eiranova.no Google kontopicker vises automatisk
✅ Sykepleier med én rolle → direkte til nurse-hjem
✅ Koordinator-rolle → velg-rolle-skjerm
✅ B2B koordinator → b2b-dashboard
✅ B2B bruker/pasient → b2b-bruker
✅ Ikke-@eiranova.no-konto → feilmelding
```

---

## K-GDPR-001 — Samtykke, soft-delete og dataportabilitet

**Status:** planned | **Tid:** 2-3 t | **Avhenger av:** K-AUTH-001

**Mål:** GDPR art. 17 (sletting) og art. 20 (portabilitet). Samtykke-historikk.

### Soft-delete:
```typescript
// Anonymisering av persondata (kjøres dag etter deleted_at settes)
UPDATE users SET
  email = 'deleted-' || id || '@anon.eiranova.no',
  full_name = 'Slettet bruker', phone = NULL,
  address = NULL, postnr = NULL, avatar_url = NULL
WHERE deleted_at IS NOT NULL
  AND deleted_at < NOW() - INTERVAL '1 day';
-- Regnskapsdata beholdes anonymisert (5-år lovkrav)
-- Helsedata (oppdragsnotater) slettes etter 3 år
```

### Dataeksport (art. 20):
```typescript
// JSON-eksport sendes til e-post innen 72 timer
// Inkluderer: brukerprofil, alle oppdrag, betalinger, samtykker
```

### Akseptansekriterier:
```
✅ Profil → Personvern → Trekk samtykke → loggføres i samtykker
✅ Profil → Slett konto → deleted_at settes, cron anonymiserer
✅ Profil → Last ned mine data → JSON sendes til e-post
✅ Samtykker kan ikke slettes fra databasen
```

---

## K-ROUTE-001 — navTo-guard

**Status:** planned | **Tid:** 1-2 t | **Avhenger av:** K-AUTH-001

**Mål:** Beskytt bestill, mine, kunde-profil, oppdrag-i-gang, chat-kunde.
Vis login-gate (LoginGate-komponent) for uinnloggede.

---

# FASE 1 — KJERNEFUNKSJONALITET

---

## K-TJENESTE-001 — Tjenester CRUD

**Status:** planned | **Tid:** 3-4 t | **Avhenger av:** K-DB-001

**Mål:** Admin kan opprette/endre/deaktivere tjenester og kategorier.
Tjenesteinstruks med versjonering. MVA-risiko-flagging.

### Nøkkelregler:
- Kategori kan ikke slettes hvis den har aktive tjenester
- Deaktivering stopper nye bestillinger, men påvirker ikke eksisterende
- Instruksjon har versjon-felt — nytt versjonsnummer ved endring
- mva_risiko: 'høy' vises med ⚠️-advarsel i admin

### Akseptansekriterier:
```
✅ Admin → Tjenester → Ny tjeneste → lagres i tjenester-tabellen
✅ Kategori CRUD med ikon + farge
✅ Instruksjonseditor med kunde/sykepleier-tabs og versjonering
✅ mva_risiko: 'høy' vises med ⚠️-advarsel
✅ Deaktivering skjuler tjeneste i kundefront
```

---

## K-BESTILL-001 — Bestillingsflyt 4 steg

**Status:** planned | **Tid:** 4-5 t | **Avhenger av:** K-DB-001, K-AUTH-001

**Mål:** Komplett bestillingsflyt med 4 steg:
1. Velg tjeneste (kategorier, filtrerbar)
2. Dato/tid (kalender, tilgjengelige slots)
3. Velg sykepleier (opsjonelt — "Velg for meg" som standard)
4. Bekreft og betal

### Kanselleringslogikk ved bestilling:
```typescript
// Vis kanselleringsvilkår basert på tidspunkt
const hoursUntil = differenceInHours(oppdragDateTime, new Date())
const cancelPolicy =
  hoursUntil > 24   ? 'Gratis kansellering frem til 24 timer før'
  : hoursUntil > 12 ? '50% gebyr ved kansellering nå'
  :                   '100% gebyr — kan ikke kanselleres'
```

### Pårørende-støtte:
- Steg 1: velg "Meg selv" eller "Min pårørende" (fra parorende-tabellen)
- Legg til ny pårørende inline

### Akseptansekriterier:
```
✅ 4-stegs flyt fungerer med back-navigasjon
✅ Pårørende-valg lagres i oppdrag.parorende_id
✅ Kanselleringsregler vises tydelig i steg 4
✅ Oppdrag lagres i oppdrag-tabellen med status 'pending'
✅ Rutes til betaling etter steg 4
```

---

## K-BETALING-001 — Vipps ePayment

**Status:** planned | **Tid:** 3-4 t | **Avhenger av:** K-BESTILL-001

**Mål:** Vipps ePayment API for B2C. Initier, webhook, refusjon.
Oppgjør D+1 til EiraNova DNB-konto (automatisk — ingen kode).

```typescript
// server-only
export async function createVippsPayment(params) {
  const token = await getVippsToken()
  return fetch(`${VIPPS_BASE}/epayment/v1/payments`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, ... },
    body: JSON.stringify({
      amount: { currency: 'NOK', value: Math.round(params.amountNok * 100) },
      reference: params.orderId,
      returnUrl: params.returnUrl,
      userFlow: 'WEB_REDIRECT',
      paymentDescription: `EiraNova – ${params.description}`,
      webhooks: [{ url: params.webhookUrl,
        events: ['epayments.payment.captured.v1','epayments.payment.failed.v1'] }]
    })
  }).then(r => r.json())
}
```

### Refusjon:
```typescript
// Brukes ved kansellering
export async function refundVippsPayment(paymentId: string, amountNok: number) {
  return fetch(`${VIPPS_BASE}/epayment/v1/payments/${paymentId}/refund`, {
    method: 'POST', ...
    body: JSON.stringify({ amount: { currency: 'NOK', value: Math.round(amountNok * 100) } })
  })
}
```

### Akseptansekriterier:
```
✅ Vipps redirect fungerer i test-miljø
✅ Webhook oppdaterer betalinger.status + oppdrag.status
✅ Kvittering sendes via Resend
✅ Test-refusjon kjører
```

---

## K-BETALING-002 — Stripe (Visa/Mastercard)

**Status:** planned | **Tid:** 2-3 t | **Avhenger av:** K-BETALING-001

**Mål:** Stripe som kortbetalingsalternativ.
PaymentIntent, Stripe Elements, webhook, refund. Payouts T+2 til DNB.

---

## K-OPPDRAG-001 — Oppdragshåndtering

**Status:** planned | **Tid:** 4-5 t | **Avhenger av:** K-BESTILL-001

**Mål:** Status-maskin, sykepleier-tildeling, kanselleringsregler,
endringslogg (oppdrag_endringer), vaktvakt-flyt.

### Status-maskin:
```
pending → bekreftet → tildelt → aktiv → fullfort
                              ↘ avlyst
```

### Vaktvakt-flyt (automatisk):
```typescript
// Supabase Edge Function — trigger når sykepleier_id er NULL og status = 'bekreftet'
// Steg 1: Broadcast til aktive vikarer i riktig område
// Steg 2 (30 min): API til api.manpower.no/health/v2
// Steg 3 (90 min): Push til admin
```

### Endringslogg:
Alle statusendringer skrives til oppdrag_endringer (aldri slett).

---

## K-NURSE-001 — Sykepleier-app

**Status:** planned | **Tid:** 4-5 t | **Avhenger av:** K-DB-001, K-AUTH-002

**Mål:** Komplett sykepleier-app: oppdragsliste, innsjekk/utsjekk med GPS,
rapport med checklist + mood-score, NurseProfil med tilgjengelighet.

### Innsjekk GPS-validering:
```typescript
function haversineMeters(lat1, lng1, lat2, lng2): number {
  // Innsjekk godkjent hvis < 200 meter fra oppdragsadresse
}
```

---

## K-PROFIL-001 — Kundeprofil

**Status:** planned | **Tid:** 3-4 t | **Avhenger av:** K-AUTH-001

**Mål:** KundeProfil med 3 faner: Konto, Pårørende, Personvern (GDPR-rettigheter).

### Personvern-fane (GDPR):
- Vis alle aktive samtykker med tidspunkt
- Trekk markedsføring-samtykke (ikke blokkerer app)
- Slett konto (soft-delete med bekreftelsesdialog)
- Last ned mine data (JSON til e-post)

---

## K-REALTIME-001 — Oppdrag-i-gang sanntid

**Status:** planned | **Tid:** 3-4 t | **Avhenger av:** K-OPPDRAG-001

**Mål:** OppdragIGang-skjerm med tre faser: på_vei → her → ferdig.
Supabase Realtime-kanal per oppdrag. Sykepleiers posisjon → kundens skjerm.

---

# FASE 2 — B2B

---

## K-B2B-001 — B2B-organisasjoner CRUD

**Status:** planned | **Tid:** 3-4 t | **Avhenger av:** K-DB-001

**Mål:** Opprett/endre b2b_organisasjoner. Invitasjonssystem for koordinatorer.
B2B-toggle i innstillinger (skjuler/viser B2B globalt).

### Modul-toggle arkitektur (B2B og Journal — samme mønster):
```typescript
// innstillinger-tabellen har tre modul-toggles:
// b2b_aktiv       — kontrollerer hele B2B-domenet
// journal_aktiv   — kontrollerer journalmodulen
// journal_modus   — 'ekstern' | 'intern'
// journal_ekstern_url  — URL til eksternt EPJ-system
// journal_ekstern_navn — "CGM Pridok" | "Aidn" | "Visma Flyt Helse"

// b2b_aktiv kontrollerer:
// - Login → "Bedriftskunde"-knapp vises/skjules
// - Admin-sidebar → B2B-faner vises/skjules
// - /b2b/* ruter tilgjengelig/utilgjengelig

// journal_aktiv + journal_modus kontrollerer:
// - NurseHjem/NurseInnsjekk → "Åpne journal"-knapp vises/skjules
// - modus='ekstern' → åpner journal_ekstern_url i ny fane (K-JOURNAL-EXT-001)
// - modus='intern'  → åpner NurseJournal-skjerm i appen (K-JOURNAL-001)
// - Admin → JournalAdmin-fane vises/skjules

export async function getInnstillinger() {
  const { data } = await supabase
    .from('innstillinger')
    .select('b2b_aktiv, journal_aktiv, journal_modus, journal_ekstern_url, journal_ekstern_navn')
    .single()
  return data
}
```

---

## K-B2B-002 — Koordinator-app

**Status:** planned | **Tid:** 4-5 t | **Avhenger av:** K-B2B-001

**Mål:** B2BDashboard, B2BBestill (bestill på vegne av bruker),
B2BBruker (bruker/pasient-app med ukeplan og historikk).

---

## K-B2B-003 — EHF/PEPPOL via Tripletex

**Status:** planned | **Tid:** 4-5 t | **Avhenger av:** K-B2B-001

**Mål:** EHF-faktura til kommuner og bedrifter via Tripletex API.
Samlefaktura, purring (maks 70 kr, inkassoloven §2), kreditnota.

```typescript
// Tripletex erstatter Fiken (fra v2)
const TRIPLETEX_BASE = 'https://tripletex.no/v2'

export async function createInvoice(params) {
  return fetch(`${TRIPLETEX_BASE}/invoice`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${tripletexAuth}` },
    body: JSON.stringify({
      invoiceDate: params.issueDate,
      paymentTypeId: 3, // EHF/PEPPOL
      kid: generateKID(),
      orders: params.orderIds.map(id => ({ id })),
      // MVA 0% for helsetjenester
    })
  })
}
```

---

## K-B2B-004 — Avtalemodeller CRUD

**Status:** planned | **Tid:** 2-3 t | **Avhenger av:** K-B2B-001

**Mål:** Rammeavtale, per bestilling, månedspakke, egendefinerte modeller.
System-modeller kan ikke slettes (system_modell = TRUE).

---

# FASE 3 — ØKONOMI OG LØNN

---

## K-TRIPLETEX-001 — Tripletex API

**Status:** planned | **Tid:** 4-5 t | **Avhenger av:** K-B2B-003

**Mål:** Bankfeed, bilagseksport, EHF-sending, faktura-status.
Tripletex er master for ALT økonomi i EiraNova.

```
TRIPLETEX_TOKEN=         # Consumer token fra Tripletex API
TRIPLETEX_EMPLOYEE_ID=   # Employee session token
TRIPLETEX_COMPANY_ID=    # EiraNova AS company ID
```

---

## K-LONN-001 — Lønnskjøring og A-melding

**Status:** planned | **Tid:** 4-5 t | **Avhenger av:** K-TRIPLETEX-001

**Mål:** Lønnskjøring via Tripletex Lønn. A-melding til Altinn.
Skattetrekk til sperret DNB-konto (lovpålagt).

### Satser:
```
AG-avgift:     14,1% (sone 1)
Feriepenger:   12%
OTP:           2%
Skattetrekk:   innhentes fra Altinn/Skatteetaten per ansatt
```

---

## K-VIKAR-001 — Tilkallingsvikarer

**Status:** planned | **Tid:** 3-4 t | **Avhenger av:** K-DB-001

**Mål:** Vikarregister, HPR-verifisering, godkjenningsflyt,
vaktvakt-automatisering (se §5.2 i handoff).

---

## K-KREDITERING-001 — Kreditering-system

**Status:** planned | **Tid:** 3-4 t | **Avhenger av:** K-BETALING-001, K-B2B-003

**Mål:** B2C refusjon (Vipps/Stripe), B2B kreditnota (Tripletex + PEPPOL).
To inngangspunkter: fra oppdrag (forhåndsutfylt) og fri kreditering.

```
Kreditnota-nummerering: KN-YYYY-NNN (auto-increment via next_kreditnota_nr())
Alle krediteringer logges — kan ikke slettes
```

---

# FASE 4 — VARSLING OG FULL DRIFT

---

## K-PUSH-001 — Push-varsler

**Status:** planned | **Tid:** 3-4 t | **Avhenger av:** K-AUTH-001

**Mål:** FCM/APNs via Supabase Edge Functions.
Viktige varsel-typer: Vipps på vei, påminnelse 24 timer før, bekreftelse.

---

## K-CHAT-001 — Chat

**Status:** planned | **Tid:** 2-3 t | **Avhenger av:** K-PUSH-001

**Mål:** Chat mellom kunde og tildelt sykepleier via Supabase Realtime.
Lese-kvittering, push ved ny melding.

---

## K-VURDERING-001 — Vurderingssystem

**Status:** planned | **Tid:** 2-3 t | **Avhenger av:** K-OPPDRAG-001

**Mål:** 1-5 stjerner + kommentar etter fullført oppdrag.
Aggregering på sykepleier-profil.

---

## K-RAPPORT-001 — Månedlig rapport

**Status:** planned | **Tid:** 2-3 t | **Avhenger av:** K-TRIPLETEX-001

**Mål:** Månedlig statusrapport til eierne: inntekt, oppdrag, sykepleiere, nøkkeltall.

---

## K-DEKN-001 — Dekningsområde-admin

**Status:** planned | **Tid:** 2 t | **Avhenger av:** K-DB-001

**Mål:** CRUD for kommuner/bydeler i dekningsomraader-tabellen.
Åpningstider per område. Synlighet i bestillingsflyt.

---

## Kontrakt-rekkefølge

```
FASE 0:
  K-DB-001 ← K-AUTH-001 ← K-GDPR-001 ← K-ROUTE-001
           ← K-AUTH-002

FASE 1:
  K-TJENESTE-001
  K-BESTILL-001 ← K-BETALING-001 ← K-BETALING-002
  K-BESTILL-001 ← K-OPPDRAG-001 ← K-REALTIME-001
  K-AUTH-001    ← K-PROFIL-001
  K-AUTH-002    ← K-NURSE-001

FASE 2:
  K-B2B-001 ← K-B2B-002
            ← K-B2B-003
            ← K-B2B-004

FASE 3:
  K-B2B-003 ← K-TRIPLETEX-001 ← K-LONN-001
  K-DB-001  ← K-VIKAR-001
  K-BETALING-001 + K-B2B-003 ← K-KREDITERING-001

FASE 4:
  K-AUTH-001 ← K-PUSH-001 ← K-CHAT-001
  K-OPPDRAG-001 ← K-VURDERING-001
  K-TRIPLETEX-001 ← K-RAPPORT-001
  K-DB-001 ← K-DEKN-001

FASE 5 — JOURNAL (aktiveres etter juridisk avklaring):
  K-AUTH-002 ← K-JOURNAL-EXT-001   ← starter her (1-2 dager, ekstern redirect)
  K-JOURNAL-EXT-001 ← K-JOURNAL-001 ← intern journal (etter NHN-sertifisering)
  K-JOURNAL-001 ← K-TILSYN-001      ← internkontroll og Helsetilsyn-rapportering
  K-JOURNAL-001 ← K-KPR-001         ← KPR-rapportering til Helsedirektoratet
```

---

## Kritiske åpne punkter (MÅ avklares)

```
🔴 MVA: Besøksvenn + Trilleturer er mva_risiko: 'høy'
        Avklar med revisor FØR lansering
        Sats er konfigurerbar per tjeneste i Admin

🔴 EiraNova AS: Org.nr. KREVES for Vipps + BankID produksjon

🔴 HPR-nummer: Alle sykepleiere MÅ ha verifisert HPR
              via Helsepersonellregisteret API

🔴 Journalansvarlig: Utpek person med HPR-nummer
                     FØR første stell-oppdrag

🔴 Statsforvalteren: Meld registrering som helse- og omsorgstjeneste
                     FØR journal_aktiv=true i produksjon (brev sendt)

🟡 journal_modus: Start med 'ekstern' (K-JOURNAL-EXT-001 — 1-2 dager)
                  Bytt til 'intern' etter NHN-sertifisering og K-JOURNAL-001

🟡 NHN-sertifisering: KREVES før journal_modus='intern' i produksjon
                       Kontakt Norsk helsenett (brev sendt)

🟡 KPR-rapportering: Avklar format og frist med Helsedirektoratet
                      (brev sendt — avventer svar)

🟡 Skattetrekkskonto: Sperret konto i DNB (lovpålagt)
🟡 Tripletex Lønn: Sett opp FØR første ansatt
🟡 Google Workspace: @eiranova.no konfigurert for sykepleier-login
```

---

## .cursorrules for EiraNova

```
# EiraNova Cursor Rules v5.0 — basert på UX Handoff v17

Prosjekt: EiraNova — hjemmehelsetjeneste-plattform
Eier: EiraNova AS / X Group AS / CoreX-rammeverket
GitHub: github.com/eiranova-no/eiranova-platform
Supabase: eu-central-1 Frankfurt (OBLIGATORISK — GDPR helsedata)

Auth:
  Kunder: e-post + passord + Glemt passord (reset via e-post). INGEN Magic Link. INGEN Google OAuth for kunder.
  Sykepleiere: KUN Google Workspace @eiranova.no
  B2B koordinator: Google Workspace / e-post (invitasjon påkrevd)
  B2B bruker: e-post + passord (aktivert av koordinator)

Regnskap: Tripletex (master — EHF/PEPPOL, lønn, A-melding)
          IKKE Fiken (erstatt alle Fiken-referanser med Tripletex)

MVA: 0% for helsetjenester (mval §3-2)
     ⚠️ Besøksvenn + Trilleturer = mva_risiko 'høy' — konfigureres per tjeneste

Design:
  Fonter: Fraunces (display) + DM Sans (body) — IKKE Lato
  Primær: #4A7C6F · Sidebar: #1E3A2F · Aktiv: #4ABC9E
  Breakpoint: 700px → phone-shell/full-webapp

Modul-toggles (innstillinger-tabellen):
  b2b_aktiv:          false (default) — B2B-portal av/på
  journal_aktiv:      false (default) — Journalmodul av/på
  journal_modus:      'ekstern' (default) — 'ekstern' | 'intern'
  journal_ekstern_url: null — URL til CGM Pridok/Aidn (ekstern modus)
  ALDRI start journal_modus='intern' uten NHN-sertifisering!

Regler:
  1. Les kontraktfil FØR kode
  2. En kontrakt om gangen
  3. Norsk UI, engelsk kode
  4. Mock + // TODO: Supabase frem til ekte queries
  5. server-only for alle API-kall (Vipps, Stripe, Tripletex)
  6. RLS på alle Supabase-tabeller
  7. Soft-delete på users (aldri hard-slett persondata)
  8. samtykker-tabellen kan ALDRI slettes fra
  9. oppdrag_endringer er append-only (GDPR-logg)
 10. journal_tilganger er append-only (audit-log — lovpålagt)
 11. K-JOURNAL-001 starter IKKE uten: helserettsadvokat OK + Statsforvalteren OK + NHN OK
 12. pnpm generate-cc etter CONTRACT_QUEUE-endringer
```

---

## K-JOURNAL-EXT-001 — Ekstern journal-redirect (mikrokontrakt)

**Status:** planned | **Tid:** 1-2 dager | **Avhenger av:** K-AUTH-002, K-DB-001

**Mål:** Legg til «Åpne journal»-knapp i sykepleier-appen. Leser `journal_aktiv` og
`journal_modus` fra innstillinger. Hvis `modus='ekstern'`: åpner `journal_ekstern_url`
i ny fane. Gjør EiraNova journalcompliant fra dag én ved stell — uten å bygge eget system.

### Akseptansekriterier:
- [ ] Knapp vises KUN når `journal_aktiv = true` i innstillinger
- [ ] `modus='ekstern'` → `window.open(journal_ekstern_url, '_blank')` fra NurseHjem og NurseInnsjekk
- [ ] `modus='intern'` → ruter til NurseJournal-skjermen (implementeres i K-JOURNAL-001)
- [ ] Knapp er ikke synlig i prototypen — den er styrt av toggle i InnstillingerPage
- [ ] Toast-melding ved åpning: «Åpner {journal_ekstern_navn} i nettleseren»

```typescript
// lib/journal.ts
export async function getJournalConfig() {
  const { data } = await supabase
    .from('innstillinger')
    .select('journal_aktiv, journal_modus, journal_ekstern_url, journal_ekstern_navn')
    .single()
  return data
}

// I NurseHjem og NurseInnsjekk:
const { journal_aktiv, journal_modus, journal_ekstern_url } = await getJournalConfig()

{journal_aktiv && (
  <button onClick={() => {
    if (journal_modus === 'ekstern') window.open(journal_ekstern_url, '_blank')
    else navTo('nurse-journal') // K-JOURNAL-001
  }}>
    📋 Åpne journal
  </button>
)}
```

---

## K-JOURNAL-001 — Intern journalmodul

**Status:** planned (venter på juridisk avklaring + NHN-sertifisering)
**Avhenger av:** K-JOURNAL-EXT-001

**Mål:** Intern journalmodul aktivert av `journal_modus='intern'`. Oppretter og leser
`pasientjournaler`, `journalnotater`, `journal_tilganger` (audit-log).

**⚠️ Start IKKE denne kontrakten uten:**
- Godkjent juridisk avklaring fra helserettsadvokat
- Statsforvalteren registrering bekreftet
- NHN-sertifisering fullført
- Journalansvarlig utpekt (HPR-nummer)

### Nye skjermer:
- `NurseJournal` — sykepleier-app: skriv notat per besøk
- `JournalInnsyn` — kundeprofil: pasient ser sin egen journal
- `JournalSperring` — kundeprofil: pasient sperre journal
- `JournalAdmin` — adminpanel: tilgangsstyring og audit-log

### RLS-regler:
```sql
-- Sykepleier kan kun lese/skrive pasientjournaler for egne oppdrag
CREATE POLICY "journal: sykepleier"
  ON pasientjournaler FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM oppdrag
    WHERE oppdrag.bruker_id = pasientjournaler.user_id
    AND oppdrag.sykepleier_id = auth.uid()
  ));

-- Pasient kan lese sin egen journal (men ikke om den er sperret for innsyn)
CREATE POLICY "journal: pasient innsyn"
  ON pasientjournaler FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND NOT sperret);

-- Admin kan lese alt
CREATE POLICY "journal: admin"
  ON pasientjournaler FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- audit-log: kun append, ingen oppdatering eller sletting
CREATE POLICY "journal_tilganger: insert only"
  ON journal_tilganger FOR INSERT TO authenticated
  WITH CHECK (bruker_id = auth.uid());
```

---

## K-TILSYN-001 — Internkontroll og Helsetilsyn-compliance

**Status:** planned | **Avhenger av:** K-JOURNAL-001

**Mål:** AvviksMelding-skjerm i sykepleier-appen. InternKontroll-panel i admin.
Krav: forskrift om ledelse og kvalitetsforbedring i helse- og omsorgstjenesten.

---

## K-KPR-001 — KPR-rapportering til Helsedirektoratet

**Status:** planned | **Avhenger av:** K-JOURNAL-001

**Mål:** Aktivitetsrapportering til kommunalt pasient- og brukerregister (KPR).
Format, API og frist avklares med Helsedirektoratet (brev sendt — avventer svar).

---

## Bootstrap-rekkefølge — gjør dette i riktig orden

### Steg 1 — Push prototypen til BÅDE dev og main (kartet på plass)

Prototypen er kartet. Den pushes til main og dev slik at hele repo-et
reflekterer hva som skal bygges — FØR første linje produksjonskode skrives.

```bash
cd ~/code/eiranova-platform

# Kopier alle filer til riktige steder i repo-et
cp EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx apps/prototype/
cp EIRANOVA_HANDOFF.md docs/
cp CURSOR-INSTRUKSJON.md docs/
cp cursorrules-eiranova.md .cursorrules
cp CONTROL_CENTER_EIRANOVA.md docs/status/CONTROL_CENTER.md

# --- Push til dev ---
git checkout dev && git pull origin dev
git add .
git commit -m "docs: EiraNova prototype v17 + handoff — kartet på plass (auth: e-post+passord)"
git push origin dev

# --- Merge til main (prototype er ikke kode, trygt å merge direkte) ---
git checkout main && git pull origin main
git merge dev --no-ff -m "chore: merge prototype v17 til main — kartet på plass"
git push origin main

# Tilbake til dev for videre arbeid
git checkout dev
```

### Steg 2 — Legg alle kontrakter i kø og push til GitHub

```bash
# Kontrakt-filer genereres av Claude i bootstrapping-tråden.
# Lim inn alle CONTRACT_QUEUE.json og individuelle kontrakt-filer:

cp CONTRACT_QUEUE.json docs/contracts/
cp contracts/*.md docs/contracts/

git add .
git commit -m "feat: CONTRACT_QUEUE — alle 31 kontrakter i kø, klar for bootstrapping"
git push origin dev
```

### Steg 3 — Åpne Cursor og start K-DB-001

Last opp disse tre filene i Cursor-tråden:
1. `EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx`
2. `EIRANOVA_HANDOFF.md`
3. `CURSOR-INSTRUKSJON.md` (denne filen)

Anbefalt første melding til Cursor:
```
Last opp disse tre filene. Les EIRANOVA_HANDOFF.md og EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx.
Dette er den ferdige UX-prototypen med journalmodul-toggle.
Auth for kunder: e-post + passord + Glemt passord. INGEN Magic Link.
Sjekk CONTRACT_QUEUE og start K-DB-001: opprett alle Supabase-tabeller fra HANDOFF §3.
```

### Git-branching-regler:
```
⚠️  Steg 1 (prototype-push) er det ENESTE unntaket fra vanlig branching-regler.
    Prototypen er ikke kode — den er kartet. Den pushes direkte til begge.

Etter Steg 1 gjelder alltid:
  feature/K-XXX-beskrivelse → PR → dev      (ferdig feature)
  dev                        → PR → main     (etter QA og godkjenning)

ALDRI push produksjonskode direkte til main.
ALDRI merge kontrakt til main uten at den er ferdig, testet og godkjent i dev.
```
