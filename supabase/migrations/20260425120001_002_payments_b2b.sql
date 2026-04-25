-- K-DB-001 — T-002 (betaling + fakturering, uten b2b_organisasjoner / b2b_brukere — ligger i 001)

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
