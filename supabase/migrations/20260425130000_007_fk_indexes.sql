-- 007_fk_indexes.sql
-- FK-indekser. Postgres lager kun indeks på PK og UNIQUE automatisk;
-- alle FK-kolonner trenger eksplisitt indeks for join-ytelse.
-- Forward-only: aldri rediger 001–006.

-- users-relasjoner
CREATE INDEX IF NOT EXISTS idx_parorende_user_id ON public.parorende(user_id);
CREATE INDEX IF NOT EXISTS idx_sykepleiere_user_id ON public.sykepleiere(user_id);
CREATE INDEX IF NOT EXISTS idx_samtykker_user_id ON public.samtykker(user_id);
CREATE INDEX IF NOT EXISTS idx_push_varsler_user_id ON public.push_varsler(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_ansatte_user_id ON public.ansatte(user_id);

-- oppdrag (mest joinede tabell)
CREATE INDEX IF NOT EXISTS idx_oppdrag_kunde_id ON public.oppdrag(kunde_id);
CREATE INDEX IF NOT EXISTS idx_oppdrag_sykepleier_id ON public.oppdrag(sykepleier_id);
CREATE INDEX IF NOT EXISTS idx_oppdrag_tjeneste_id ON public.oppdrag(tjeneste_id);
CREATE INDEX IF NOT EXISTS idx_oppdrag_parorende_id ON public.oppdrag(parorende_id);
CREATE INDEX IF NOT EXISTS idx_oppdrag_b2b_org_id ON public.oppdrag(b2b_org_id);
CREATE INDEX IF NOT EXISTS idx_oppdrag_b2b_bruker_id ON public.oppdrag(b2b_bruker_id);

-- oppdrag-relaterte
CREATE INDEX IF NOT EXISTS idx_oppdrag_endringer_oppdrag_id ON public.oppdrag_endringer(oppdrag_id);
CREATE INDEX IF NOT EXISTS idx_oppdrag_endringer_endret_av ON public.oppdrag_endringer(endret_av);
CREATE INDEX IF NOT EXISTS idx_vurderinger_kunde_id ON public.vurderinger(kunde_id);
CREATE INDEX IF NOT EXISTS idx_vurderinger_sykepleier_id ON public.vurderinger(sykepleier_id);
-- vurderinger.oppdrag_id er allerede UNIQUE → får automatisk indeks

-- betalinger og krediteringer
CREATE INDEX IF NOT EXISTS idx_betalinger_oppdrag_id ON public.betalinger(oppdrag_id);
CREATE INDEX IF NOT EXISTS idx_betalinger_kunde_id ON public.betalinger(kunde_id);
CREATE INDEX IF NOT EXISTS idx_krediteringer_oppdrag_id ON public.krediteringer(oppdrag_id);
CREATE INDEX IF NOT EXISTS idx_krediteringer_kunde_id ON public.krediteringer(kunde_id);
CREATE INDEX IF NOT EXISTS idx_krediteringer_b2b_org_id ON public.krediteringer(b2b_org_id);
CREATE INDEX IF NOT EXISTS idx_krediteringer_godkjent_av ON public.krediteringer(godkjent_av);

-- B2B
CREATE INDEX IF NOT EXISTS idx_b2b_brukere_b2b_org_id ON public.b2b_brukere(b2b_org_id);
CREATE INDEX IF NOT EXISTS idx_b2b_brukere_user_id ON public.b2b_brukere(user_id);
CREATE INDEX IF NOT EXISTS idx_b2b_fakturaer_b2b_org_id ON public.b2b_fakturaer(b2b_org_id);

-- Personal/lønn
CREATE INDEX IF NOT EXISTS idx_vikarer_sykepleier_id ON public.vikarer(sykepleier_id);
CREATE INDEX IF NOT EXISTS idx_skattetrekk_lonnkjoring_id ON public.skattetrekk(lonnkjoring_id);
CREATE INDEX IF NOT EXISTS idx_skattetrekk_ansatt_id ON public.skattetrekk(ansatt_id);

-- Tjenester
CREATE INDEX IF NOT EXISTS idx_tjenester_kategori_id ON public.tjenester(kategori_id);
CREATE INDEX IF NOT EXISTS idx_tjenester_endret_av ON public.tjenester(endret_av);
