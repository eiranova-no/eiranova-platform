-- K-DB-001 — T-005 (RLS) + handle_new_user + utvidet RLS (se D-007)

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

-- ——— Avvik 2: handle_new_user() + trigger ———
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'kunde')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ——— Avvik 3: RLS for øvrige tabeller ———

-- parorende
ALTER TABLE public.parorende ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parorende: own" ON public.parorende
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "parorende: staff read" ON public.parorende
  FOR SELECT USING (current_user_role() IN ('koordinator','admin'));

-- tjeneste_kategorier, tjenester, dekningsomraader, avtalemodeller (les for innloggede + admin all)
ALTER TABLE public.tjeneste_kategorier ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tjeneste_kat: read auth" ON public.tjeneste_kategorier
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "tjeneste_kat: staff all" ON public.tjeneste_kategorier
  FOR ALL USING (current_user_role() IN ('koordinator','admin'));

ALTER TABLE public.tjenester ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tjenester: read auth" ON public.tjenester
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "tjenester: staff all" ON public.tjenester
  FOR ALL USING (current_user_role() IN ('koordinator','admin'));

ALTER TABLE public.dekningsomraader ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dekn: read auth" ON public.dekningsomraader
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "dekn: staff all" ON public.dekningsomraader
  FOR ALL USING (current_user_role() IN ('koordinator','admin'));

ALTER TABLE public.avtalemodeller ENABLE ROW LEVEL SECURITY;
CREATE POLICY "avtale: read auth" ON public.avtalemodeller
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "avtale: staff all" ON public.avtalemodeller
  FOR ALL USING (current_user_role() IN ('koordinator','admin'));

-- b2b_brukere, betalinger, krediteringer, b2b_fakturaer, vikarer, bemanningsbyraaer, skattetrekk, varslingsmottakere, system_events (koordinator+admin)
ALTER TABLE public.b2b_brukere ENABLE ROW LEVEL SECURITY;
CREATE POLICY "b2b_bruker: staff" ON public.b2b_brukere
  FOR ALL USING (current_user_role() IN ('koordinator','admin'));

ALTER TABLE public.betalinger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "betalinger: staff" ON public.betalinger
  FOR ALL USING (current_user_role() IN ('koordinator','admin'));

ALTER TABLE public.krediteringer ENABLE ROW LEVEL SECURITY;
CREATE POLICY "krediteringer: staff" ON public.krediteringer
  FOR ALL USING (current_user_role() IN ('koordinator','admin'));

ALTER TABLE public.b2b_fakturaer ENABLE ROW LEVEL SECURITY;
CREATE POLICY "b2b_faktura: staff" ON public.b2b_fakturaer
  FOR ALL USING (current_user_role() IN ('koordinator','admin'));

ALTER TABLE public.vikarer ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vikarer: staff" ON public.vikarer
  FOR ALL USING (current_user_role() IN ('koordinator','admin'));

ALTER TABLE public.bemanningsbyraaer ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bemanningsbyra: staff" ON public.bemanningsbyraaer
  FOR ALL USING (current_user_role() IN ('koordinator','admin'));

ALTER TABLE public.skattetrekk ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skattetrekk: staff" ON public.skattetrekk
  FOR ALL USING (current_user_role() IN ('koordinator','admin'));

ALTER TABLE public.varslingsmottakere ENABLE ROW LEVEL SECURITY;
CREATE POLICY "varslmott: staff" ON public.varslingsmottakere
  FOR ALL USING (current_user_role() IN ('koordinator','admin'));

ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sys_events: staff" ON public.system_events
  FOR ALL USING (current_user_role() IN ('koordinator','admin'));

-- vurderinger: alle innloggede leser, kunde inserter egne
ALTER TABLE public.vurderinger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vurderinger: read auth" ON public.vurderinger
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "vurderinger: insert egen" ON public.vurderinger
  FOR INSERT WITH CHECK (kunde_id = auth.uid());

-- push_varsler, push_subscriptions: egne rader; admin leser
ALTER TABLE public.push_varsler ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pushv: own" ON public.push_varsler
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "pushv: staff read" ON public.push_varsler
  FOR SELECT USING (current_user_role() IN ('koordinator','admin'));

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pushsub: own" ON public.push_subscriptions
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "pushsub: staff read" ON public.push_subscriptions
  FOR SELECT USING (current_user_role() IN ('koordinator','admin'));
