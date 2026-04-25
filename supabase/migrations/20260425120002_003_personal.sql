-- K-DB-001 — T-003 (personal, lønn)

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
