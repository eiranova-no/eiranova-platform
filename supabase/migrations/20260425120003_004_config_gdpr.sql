-- K-DB-001 — T-004 (konfigurasjon, GDPR, varsler)

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
