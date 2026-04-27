-- K-DB-001 — T-001 (kjerne)
-- B2B-tabellene ligger i denne filen (før oppdrag) pga. forward-reference — se D-007 i DISCOVERIES.json

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
