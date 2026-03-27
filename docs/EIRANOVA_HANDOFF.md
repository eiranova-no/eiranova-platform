# EiraNova — Fullstendig UX Handoff
**Dato:** 22. mars 2026  
**Prototype:** `EiraNova-Prototype-HANDOFF-v16.jsx` (547 KB, 7 712 linjer, Babel-verifisert)  
**Til:** EiraNova Bootstrapping-tråden (Cursor IDE)  
**Fra:** UX-designtråden (Claude + Richard)

---

## ⚡ VIKTIGSTE BESKJED TIL CURSOR

Denne prototypen er **ferdigstilt og autoritativ**. All UX, alle datamodeller, alle forretningsregler og alle skjermflyter er definert her. Cursor skal implementere dette — ikke finne opp noe nytt.

Prototypen er en **single-file React JSX** med mock-data. I produksjon erstattes mock-data med Supabase-spørringer.

---

## 1. Prosjekt

| | |
|---|---|
| **Produkt** | EiraNova — Norsk hjemmehelsetjeneste-plattform |
| **Eier** | EiraNova AS (3 medeiere) — Lise Andersen (daglig leder) |
| **Holding** | X Group AS / CoreX-rammeverket |
| **Stack** | Next.js · Supabase (eu-central-1 Frankfurt) · Vercel · Tripletex · Vipps · Stripe |
| **Auth** | Supabase Auth — Magic Link + Google OAuth |
| **Regnskap** | Tripletex (master for alt — B2C og B2B) |
| **Region** | Østfold/Akershus — Moss, Fredrikstad, Sarpsborg, Vestby, Ski, Råde, Ås |

---

## 2. Fire apper — ett domene (app.eiranova.no)

### 2.1 Kunde-app (B2C)

| Screen-ID | Komponent | Beskrivelse |
|---|---|---|
| `landing` | Landing | Landing page, tjenesteoversikt, bestill-CTA |
| `login` | Login | Hvem er du? Privat / Bedrift |
| `push-tillatelse` | PushTillatelse | Be om push-varsel (ny konto-flyt steg 1) |
| `samtykke` | Samtykke | GDPR + vilkår — påkrevd før konto opprettes |
| `onboarding` | Onboarding | 3 steg: hvem/adresse/klar |
| `glemt-passord` | GlemtPassord | Reset via e-post |
| `hjem` | Hjem | Neste avtale, tjenestekort |
| `bestill` | Bestill | 4-stegs bestillingsflyt |
| `betaling` | Betaling | Vipps / kort |
| `bekreftelse` | Bekreftelse | Ordrebekreftelse |
| `mine` | Mine | Bestillinger kommende/tidligere |
| `kunde-profil` | KundeProfil | Profil + betaling + GDPR-rettigheter |
| `oppdrag-i-gang` | OppdragIGang | Sanntidsstatus — sykepleier på vei/her/ferdig |
| `chat-kunde` | ChatKunde | Chat med tildelt sykepleier |
| `ingen-invitasjon` | IngenInvitasjonInfo | Slik får organisasjonen B2B-tilgang |
| `login-gate` | LoginGate | Innloggingsvakt for beskyttede ruter |

**navTo-guard** — disse krever innlogging:
```
bestill · mine · kunde-profil · oppdrag-i-gang · chat-kunde
```

**Bunnavigasjon (BN_K):**
```
🏠 Hjem → hjem
➕ Bestill → bestill  
📋 Mine → mine
💬 Chat → chat-kunde
👤 Profil → kunde-profil
```

### 2.2 Sykepleier-app

| Screen-ID | Komponent | Beskrivelse |
|---|---|---|
| `nurse-login` | NurseLogin | Google Workspace med kontopicker |
| `nurse-rolle` | NurseRolle | Velg: Sykepleier / Koordinator |
| `nurse-hjem` | NurseHjem | Oppdragsliste for dagen |
| `nurse-innsjekk` | NurseInnsjekk | Start/stopp/avvik-registrering |
| `nurse-rapport` | NurseRapport | Rapport etter fullført oppdrag |
| `nurse-profil` | NurseProfil | Profil, spesialiteter, tilgjengelighet |

Koordinator-rolle ruter til `admin-panel` → `<Admin initPage="dashboard"/>`.

### 2.3 B2B (via Kunde-app Login)

**VIKTIG:** B2B har IKKE egen tab/URL. Innlogging skjer via:
```
Kunde-app → Login → Bedriftskunde → Har fått invitasjon → Google Workspace/e-post → b2b-dashboard
Kunde-app → Login → Bedriftskunde → Jeg er bruker/pasient → e-post/passord → b2b-bruker
```

| Screen-ID | Komponent | Beskrivelse |
|---|---|---|
| `b2b-dashboard` | B2BDashboard | Koordinator: aktive brukere, ukeplaner |
| `b2b-bestill` | B2BBestill | Bestill på vegne av bruker |
| `b2b-bruker` | B2BBruker | Bruker/pasient: min ukeplan |

### 2.4 Adminpanel

Tilgang: `nurse-rolle → Koordinator → admin-panel`

| Admin-fane | Komponent(er) | Nøkkelfunksjon |
|---|---|---|
| Dashboard | ADashboard | KPI-strip, aktivitetslogg, hurtiglenker |
| Oppdrag | AOppdrag + OppdrагModal | Filter, endre/avlys, endringslogg, krediter |
| Betalinger | ABetalinger (4 faner) | Vipps/Stripe/EHF/Krediteringer |
| B2B & Faktura | AB2B (3 faner) | Kunder, fakturaer, avtalemodeller CRUD |
| Ansatte & Roller | AAnsatte (4 faner) | Interne, Tilkallingsvikarer, B2B, Roller |
| Økonomi | OkonomiPage (3 faner) | Regnskap, Lønn & ansatte, Priskalkulator |
| Tjenester & priser | TjenesteAdmin | CRUD tjenester+kategorier+instrukser |
| Innstillinger | InnstillingerPage | B2B-toggle, org, varsling, dekningsområder |

---

## 3. Databasemodell (Supabase)

### Kjernetabeller

```sql
-- Brukere
users (
  id uuid PK,
  email text UNIQUE,
  phone text,
  full_name text,
  address text, postnr text, poststed text,
  role text CHECK (role IN ('kunde','sykepleier','koordinator','admin')),
  terms_accepted_at timestamptz,
  gdpr_consent_at timestamptz,
  marketing_consent bool DEFAULT false,
  push_enabled bool DEFAULT false,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  deleted_at timestamptz  -- soft delete
)

-- Pårørende
parorende (
  id uuid PK,
  user_id uuid FK → users,
  navn text, adresse text, postnr text, poststed text,
  relasjon text, created_at timestamptz
)

-- Tjeneste-kategorier
tjeneste_kategorier (
  id text PK,  -- slug: 'eldre', 'barsel'
  label text, ikon text, farge text, gradient text,
  created_at timestamptz
)

-- Tjenester
tjenester (
  id text PK,
  navn text, ikon text,
  kategori_id text FK → tjeneste_kategorier,
  beskrivelse text,
  pris int, b2b_pris int,
  varighet_min int,
  mva_sats text,  -- '0%', '25%', 'avklares'
  mva_risiko text CHECK (mva_risiko IN ('lav','medium','høy')),
  aktiv bool DEFAULT true,
  utfoert_av text[],  -- ['sykepleier','hjelpepleier']
  instruks_kunde text,
  instruks_sykepleier text,
  inkluderer text[],
  inkluderer_ikke text[],
  instruks_versjon int DEFAULT 1,
  instruks_endret_av text,
  instruks_endret_dato date,
  opprettet_at timestamptz
)

-- Oppdrag
oppdrag (
  id text PK,
  kunde_id uuid FK → users,
  parorende_id uuid FK → parorende NULLABLE,
  sykepleier_id uuid FK → sykepleiere NULLABLE,
  tjeneste_id text FK → tjenester,
  dato date, tid_start time, tid_slutt time,
  adresse text,
  status text CHECK (status IN ('pending','bekreftet','tildelt','aktiv','fullfort','avlyst')),
  betalt_via text CHECK (betalt_via IN ('vipps','stripe','b2b','gratis')),
  belop int,
  b2b_org_id uuid FK → b2b_organisasjoner NULLABLE,
  b2b_bruker_id uuid FK → b2b_brukere NULLABLE,
  vipps_payment_id text,
  stripe_payment_intent text,
  opprettet_at timestamptz, oppdatert_at timestamptz
)

-- Oppdrag endringslogg (append-only, aldri slett)
oppdrag_endringer (
  id uuid PK,
  oppdrag_id text FK → oppdrag,
  dato timestamptz, endret_av text,
  handling text, arsak text,
  ny_sykepleier_id uuid NULLABLE
)

-- Sykepleiere
sykepleiere (
  id uuid PK,
  user_id uuid FK → users,
  hpr_nummer text UNIQUE,
  tittel text, bio text,
  spesialiteter text[], sprak text[],
  erfaring_aar int,
  sertifisert bool DEFAULT false,
  omrade text[],
  rating numeric(3,2), antall_oppdrag int DEFAULT 0,
  er_vikar bool DEFAULT false,
  enk_org text, kontonr text,
  godkjent bool DEFAULT false, godkjent_dato date,
  varsel_kanal text CHECK (varsel_kanal IN ('push','sms')),
  aktiv bool DEFAULT true,
  status text CHECK (status IN ('aktiv','venter_godkjenning','inaktiv'))
)

-- Samtykker (GDPR-sporbarhet)
samtykker (
  id uuid PK,
  user_id uuid FK → users,
  type text CHECK (type IN ('gdpr','vilkaar','markeds')),
  versjon int DEFAULT 1,
  godkjent_at timestamptz,
  trukket_at timestamptz NULLABLE
)

-- Vurderinger
vurderinger (
  id uuid PK,
  oppdrag_id text FK → oppdrag UNIQUE,
  kunde_id uuid FK → users,
  sykepleier_id uuid FK → sykepleiere,
  stjerner int CHECK (stjerner BETWEEN 1 AND 5),
  kommentar text, created_at timestamptz
)
```

### Betalings- og fakturatbeller

```sql
-- Betalinger
betalinger (
  id uuid PK,
  oppdrag_id text FK → oppdrag,
  kunde_id uuid FK → users,
  belop int, metode text, status text,
  ekstern_ref text, opprettet_at timestamptz
)

-- Krediteringer
krediteringer (
  id uuid PK,
  type text CHECK (type IN ('b2c','b2b')),
  oppdrag_id text FK → oppdrag NULLABLE,
  kunde_id uuid FK → users NULLABLE,
  b2b_org_id uuid NULLABLE,
  belop int, arsak text, arsak_type text,
  metode text CHECK (metode IN ('vipps','stripe','kreditnota')),
  status text CHECK (status IN ('initiert','refundert','sendt')),
  godkjent_av text, kreditnota_nr text,
  opprettet_at timestamptz
)

-- B2B organisasjoner
b2b_organisasjoner (
  id uuid PK,
  navn text, type text, org_nr text,
  kontakt_epost text,
  peppol_aktiv bool DEFAULT false,
  betalingsdager int DEFAULT 30,
  prismodell_id text FK → avtalemodeller,
  ramme_priser jsonb,
  maaneds_pris int,
  created_at timestamptz
)

-- B2B brukere/pasienter
b2b_brukere (
  id uuid PK,
  b2b_org_id uuid FK → b2b_organisasjoner,
  user_id uuid FK → users NULLABLE,
  navn text, fodselsdato text, adresse text,
  pakke text, aktiv bool, created_at timestamptz
)

-- B2B fakturaer
b2b_fakturaer (
  id uuid PK,
  b2b_org_id uuid FK → b2b_organisasjoner,
  periode text, status text,
  belop int, peppol_ref text, pdf_url text,
  forfallsdato date, created_at timestamptz
)

-- Avtalemodeller
avtalemodeller (
  id text PK,  -- slug: 'rammeavtale', 'per_bestilling' osv
  label text, ikon text, farge text, beskrivelse text,
  faktura_type text CHECK (faktura_type IN ('maanedlig','per_oppdrag','engang','kvartal')),
  fakturadag int, betalingsfrist int,
  aktiv bool DEFAULT true,
  system_modell bool DEFAULT false,  -- kan ikke slettes
  created_at timestamptz
)
```

### Personal- og lønnstabeller

```sql
-- Fast ansatte
ansatte (
  id uuid PK,
  user_id uuid FK → users,
  tittel text, stillingsprosent int,
  timer_per_uke numeric(4,1), lonnstrinn text,
  grunnlonn int, ansatt_dato date,
  aktiv bool, kontonr text, created_at timestamptz
)

-- Tilkallingsvikarer
vikarer (
  id uuid PK,
  sykepleier_id uuid FK → sykepleiere,
  enk bool DEFAULT true, enk_org text, kontonr text,
  varsel_kanal text, responstid_snitt text,
  tjenester text[], omrade text[],
  aktiv bool, created_at timestamptz
)

-- Lønnskjøringer
lonnkjoringer (
  id uuid PK,
  maaned text, status text,
  utbetalings_dato date,
  total_brutto int, total_netto int,
  ag_avgift int, feriepenger int,
  created_at timestamptz
)

-- Bemanningsbyrå
bemanningsbyraaer (
  id uuid PK,
  navn text, kontakt text, telefon text,
  api_aktiv bool, api_url text, api_status text,
  timepris_sykepleier int, timepris_hjelpepleier int,
  faktura_type text, avtale text,
  aktiv bool, created_at timestamptz
)
```

### Konfigurasjon

```sql
-- Dekningsområder
dekningsomraader (
  id text PK,
  navn text, fylke text,
  aktiv bool, apner time, stenges time,
  created_at timestamptz
)

-- Varslingsmottakere
varslingsmottakere (
  id uuid PK,
  navn text, epost text, rolle text,
  varsler jsonb,   -- {nyBestilling:true, betaling:true, avvik:true, ...}
  kanaler jsonb,   -- {epost:true, push:false, sms:false}
  aktiv bool, created_at timestamptz
)

-- Innstillinger (singleton)
innstillinger (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  org_navn text, org_nr text, kontakt_epost text,
  -- ── Modul-toggles ──────────────────────────────────────────
  b2b_aktiv bool DEFAULT false,            -- B2B-portal av/på
  journal_aktiv bool DEFAULT false,        -- Journalmodul av/på
  journal_modus text DEFAULT 'ekstern'     -- 'ekstern' | 'intern'
    CHECK (journal_modus IN ('ekstern','intern')),
  journal_ekstern_url text DEFAULT null,   -- URL til ekstern EPJ (f.eks. CGM Pridok)
  journal_ekstern_navn text DEFAULT null,  -- "CGM Pridok" | "Aidn" | "Visma Flyt Helse"
  -- ── Økonomi ─────────────────────────────────────────────────
  mva_sats text DEFAULT '0%',
  fakturadag int DEFAULT 1,
  betalingsfrist int DEFAULT 30,
  kansellering_frister jsonb,  -- {fristTimer:24, gebyrProsent50:12, gebyrProsent100:4}
  updated_at timestamptz
)

-- Push-varsler
push_varsler (
  id uuid PK,
  user_id uuid FK → users,
  type text, tittel text, body text,
  data jsonb, lest bool DEFAULT false,
  created_at timestamptz
)

-- System events
system_events (
  id uuid PK,
  type text,
  severity text CHECK (severity IN ('SEV1','SEV2','SEV3','INFO')),
  melding text, data jsonb,
  created_at timestamptz
)

-- ── Journalsystem-tabeller (aktiveres når journal_aktiv = true) ──────────────
pasientjournaler (
  id uuid PK DEFAULT gen_random_uuid(),
  user_id uuid FK → users,           -- pasienten
  journalansvarlig_id uuid FK → users, -- sykepleier med HPR-nummer
  opprettet_at timestamptz DEFAULT now(),
  sperret bool DEFAULT false,        -- pasientens rett til sperring
  sperret_av uuid FK → users,
  sperret_at timestamptz
)

journalnotater (
  id uuid PK DEFAULT gen_random_uuid(),
  journal_id uuid FK → pasientjournaler,
  oppdrag_id uuid FK → oppdrag,      -- knyttes til besøket
  forfatter_id uuid FK → users,      -- sykepleieren som førte notatet
  notat_tekst text NOT NULL,
  notat_type text DEFAULT 'besøk'    -- 'besøk' | 'avvik' | 'observasjon' | 'medisin'
    CHECK (notat_type IN ('besøk','avvik','observasjon','medisin')),
  created_at timestamptz DEFAULT now()
)

journal_tilganger (                  -- audit-log: GDPR og Normen krav
  id uuid PK DEFAULT gen_random_uuid(),
  journal_id uuid FK → pasientjournaler,
  bruker_id uuid FK → users,        -- hvem åpnet journalen
  formal text NOT NULL,              -- 'helsehjelp' | 'admin' | 'innsyn'
  ip_adresse text,
  created_at timestamptz DEFAULT now()
)

avviksmeldinger (                    -- internkontroll og Helsetilsyn-rapportering
  id uuid PK DEFAULT gen_random_uuid(),
  oppdrag_id uuid FK → oppdrag,
  innmelder_id uuid FK → users,
  avvik_type text,                   -- 'fall' | 'medisin' | 'annet'
  beskrivelse text NOT NULL,
  tiltak text,
  lukket bool DEFAULT false,
  created_at timestamptz DEFAULT now()
)
```

---

## 4. Designsystem

### Fargepalett (C-objektet)

```javascript
const C = {
  green: "#4A7C6F",       // Primærfarge, knapper
  greenDark: "#2C5C52",   // Headers, gradienter
  greenLight: "#7FAE96",  // Sekundær aksentuering
  greenBg: "#EDF5F3",     // Kortbakgrunn
  greenXL: "#F4FAF8",     // Input-felt bakgrunn
  rose: "#E8A4A4",        // Barsel-kategori
  gold: "#C4956A",        // Varsler, B2B
  goldDark: "#A07040",
  goldBg: "#FDF5EE",
  cream: "#FAF6F1",       // Side-bakgrunn
  navy: "#2C3E35",        // Primærtekst
  navyMid: "#4A5E55",
  soft: "#7A8E85",        // Undertekst
  border: "#E4EDE9",      // Kant-farger
  softBg: "#F0F5F2",
  vipps: "#FF5B24",       // Vipps-knapper
  danger: "#E11D48",      // Feil, sletting
  dangerBg: "#FFF1F2",
  sky: "#2563EB",         // Stripe, info
  skyBg: "#EFF6FF",
  sidebar: "#1E3A2F",     // Admin sidebar
  sidebarAccent: "#4ABC9E"
};
```

### Typografi
- **Overskrifter:** Fraunces (serif) — Google Fonts → `.fr` CSS-klasse
- **Brødtekst:** DM Sans — Google Fonts

### Breakpoint
- **< 700px:** Phone-shell (`.pw` → `.phone`)
- **≥ 700px:** Full webapp med DeskNav øverst

### Nøkkel CSS-klasser
```css
.phone    /* Phone-shell wrapper */
.pw       /* Responsiv wrapper */
.fu       /* flex:1, overflow:auto */
.sa       /* Scroll-area */
.fr       /* font-family: Fraunces */
.card     /* Hvitt kort med skygge */
.btn.bp   /* Primærknapp grønn */
.bf       /* Full-bredde knapp */
.inp      /* Standard input */
.bnav     /* Bottom nav */
.tbl      /* Admin-tabell */
.tw       /* Table-wrapper overflow */
```

---

## 5. Forretningsregler

### Kanselleringsregler
| Frist | Gebyr |
|---|---|
| > 24 timer | 0 kr — gratis |
| 12–24 timer | 50% av oppdragspris |
| < 4 timer | 100% av oppdragspris |
| Sykepleier syk | 0 kr — full refusjon (EiraNova betaler) |

### Vaktvakt-flyt
1. **0 min:** Oppdrag uten sykepleier → automatisk trigger
2. **0–30 min:** Push/SMS til aktive vikarer i riktig område
3. **30–90 min:** API-forespørsel til bemanningsbyrå (Manpower Health)
4. **90+ min:** Manuell varsling til admin
5. **Ved tildeling:** Automatisk SMS/push til kunde

### MVA ⚠️
- **0% (unntatt §3-2):** Morgensstell, praktisk bistand, ringetilsyn, barsel-tjenester
- **Avklares — HØY RISIKO:** Besøksvenn, Trilleturer → Skatteetaten har krevd etterbetaling her
- MVA-sats er konfigurerbar per tjeneste i Admin → Tjenester & priser

### B2B-fakturering
- **Rammeavtale:** Samlefaktura 1. neste måned via EHF/PEPPOL (Tripletex)
- **Per bestilling:** Auto-faktura ved bestilling
- **Månedspakke:** Fast beløp 1. hver måned
- Purring: maks kr 70 gebyr (inkassoloven §2), 14-dagers varsel
- Kreditnota: `KN-YYYY-NNN` auto-increment

### GDPR
- Samtykke ved registrering: Personvernerklæring (påkrevd) + Vilkår (påkrevd) + Markedsf. (valgfri)
- Slett konto (art. 17): Anonymisering, regnskapsdata beholdes 5 år
- Dataeksport (art. 20): JSON på e-post innen 72 timer
- Soft-delete: `deleted_at` på users-rad

### Lønn
- **Primærmodell:** Vikarer fakturerer som ENK → ingen AG-avgift for EiraNova
- **Fast ansatte:** AG-avgift 14,1% · feriepenger 12% · OTP 2%
- **Skattetrekk:** Sperret konto i DNB (lovpålagt) · Betales innen 3 virkedager
- **A-melding:** Automatisk via Tripletex til Altinn innen 5. i måneden

---

## 6. Integrasjoner

| System | Formål | Status |
|---|---|---|
| **Tripletex** | Master regnskap — EHF/PEPPOL, bankfeed, lønn, A-melding | Spesifisert |
| **Vipps ePayment** | B2C betaling og refusjon | Konfigurert |
| **Stripe** | Korttransaksjoner og refusjoner | Klar |
| **Supabase** | Database, Auth, Realtime, Edge Functions | Frankfurt eu-central-1 |
| **Altinn** | A-melding + skattekort (via Tripletex) | Spesifisert |
| **PEPPOL/ELMA** | EHF-faktura til offentlig sektor | Via Tripletex |
| **Google Workspace** | Sykepleier-innlogging | @eiranova.no |
| **Manpower Health API** | Vaktvakt-fallback byrå | api.manpower.no/health/v2 |
| **FCM/APNs** | Push-varsler | Via Supabase Edge Function |
| **DNB** | Bankfeed + skattetrekkskonto | Via Tripletex |

---

## 7. Alle React-komponenter (47 stk)

### UI-atomer
`PH` · `BNav` · `DeskNav` · `Bdg` · `useToast`

### Kunde-app
`Landing` · `Login` · `PushTillatelse` · `Samtykke` · `Onboarding` · `GlemtPassord` · `Hjem` · `Bestill` · `Betaling` · `Bekreftelse` · `Mine` · `KundeProfil` · `OppdragIGang` · `ChatKunde` · `IngenInvitasjonInfo` · `LoginGate`

### Sykepleier-app
`NurseLogin` · `NurseRolle` · `NurseHjem` · `NurseInnsjekk` · `NurseRapport` · `NurseProfil`

### B2B
`B2BLogin` (redirect til Login) · `B2BDashboard` · `B2BBestill` · `B2BBruker`

### Admin
`Admin` · `ASidebar` · `AHeader` · `ADashboard` · `AOppdrag` · `ABetalinger` · `AB2B` · `AAnsatte` · `ADrawer`

### Admin modaler
`KrediterPrivatModal` · `KreditnotaB2BModal` · `OppdrагModal`

### Admin sub-komponenter
`VikarPanel` · `LonnPanel` · `PrisKalkulator` · `OkonomiPage` · `InnstillingerPage` · `TjenesteAdmin` · `InstruktionEditor` · `TjenesteKalkulator`

---

## 8. Kontrakt-køen — CONTRACT_QUEUE.json

```json
[
  {
    "id": "K-DB-001",
    "title": "Supabase database — alle tabeller fra handoff §3",
    "status": "queued",
    "priority": "critical",
    "phase": 0,
    "description": "Opprett alle tabeller med RLS, seed-data, og indekser. Se HANDOFF §3.",
    "depends_on": []
  },
  {
    "id": "K-AUTH-001",
    "title": "Supabase Auth — Magic Link + Google OAuth for kunder",
    "status": "queued",
    "priority": "critical",
    "phase": 0,
    "description": "Ny konto-flyt: push-tillatelse → samtykke → onboarding. Se HANDOFF §2.1.",
    "depends_on": ["K-DB-001"]
  },
  {
    "id": "K-AUTH-002",
    "title": "Google Workspace innlogging for sykepleiere",
    "status": "queued",
    "priority": "critical",
    "phase": 0,
    "description": "Kun @eiranova.no-kontoer. Rollebasert ruting etter innlogging.",
    "depends_on": ["K-DB-001"]
  },
  {
    "id": "K-GDPR-001",
    "title": "GDPR samtykke, soft-delete og dataeksport",
    "status": "queued",
    "priority": "critical",
    "phase": 0,
    "description": "Samtykke ved registrering, slett konto (art.17), dataeksport (art.20).",
    "depends_on": ["K-AUTH-001"]
  },
  {
    "id": "K-ROUTE-001",
    "title": "navTo-guard og innloggingsbeskyttelse",
    "status": "queued",
    "priority": "critical",
    "phase": 0,
    "description": "Beskytt: bestill, mine, kunde-profil, oppdrag-i-gang, chat-kunde.",
    "depends_on": ["K-AUTH-001"]
  },
  {
    "id": "K-TJENESTE-001",
    "title": "Tjenester CRUD med kategorier og instrukser",
    "status": "queued",
    "priority": "high",
    "phase": 1,
    "description": "Admin kan opprette/endre/deaktivere tjenester og kategorier. Instruks med versjonering.",
    "depends_on": ["K-DB-001"]
  },
  {
    "id": "K-BESTILL-001",
    "title": "Bestillingsflyt 4 steg",
    "status": "queued",
    "priority": "high",
    "phase": 1,
    "description": "Velg tjeneste → dato/tid → sykepleier → betaling. Lagre i oppdrag-tabellen.",
    "depends_on": ["K-DB-001", "K-AUTH-001"]
  },
  {
    "id": "K-BETALING-001",
    "title": "Vipps ePayment API",
    "status": "queued",
    "priority": "high",
    "phase": 1,
    "description": "Initier betaling, webhook for bekreftelse, refusjon-API.",
    "depends_on": ["K-BESTILL-001"]
  },
  {
    "id": "K-BETALING-002",
    "title": "Stripe betalinger og refusjoner",
    "status": "queued",
    "priority": "high",
    "phase": 1,
    "description": "Payment Intent, webhook, refunds API.",
    "depends_on": ["K-BESTILL-001"]
  },
  {
    "id": "K-OPPDRAG-001",
    "title": "Oppdragshåndtering og status-maskin",
    "status": "queued",
    "priority": "high",
    "phase": 1,
    "description": "Status: pending→bekreftet→tildelt→aktiv→fullfort/avlyst. Kanselleringsregler. Endringslogg.",
    "depends_on": ["K-BESTILL-001"]
  },
  {
    "id": "K-NURSE-001",
    "title": "Sykepleier-app — oppdragsliste, innsjekk, rapport",
    "status": "queued",
    "priority": "high",
    "phase": 1,
    "depends_on": ["K-DB-001", "K-AUTH-002"]
  },
  {
    "id": "K-PROFIL-001",
    "title": "Kundeprofil med betaling og pårørende",
    "status": "queued",
    "priority": "high",
    "phase": 1,
    "depends_on": ["K-AUTH-001"]
  },
  {
    "id": "K-REALTIME-001",
    "title": "Oppdrag-i-gang sanntidsstatus (Supabase Realtime)",
    "status": "queued",
    "priority": "high",
    "phase": 1,
    "depends_on": ["K-OPPDRAG-001"]
  },
  {
    "id": "K-B2B-001",
    "title": "B2B-organisasjoner CRUD og invitasjonssystem",
    "status": "queued",
    "priority": "high",
    "phase": 2,
    "depends_on": ["K-DB-001"]
  },
  {
    "id": "K-B2B-002",
    "title": "Koordinator-app: dashboard, bestill, ukeplan",
    "status": "queued",
    "priority": "high",
    "phase": 2,
    "depends_on": ["K-B2B-001"]
  },
  {
    "id": "K-B2B-003",
    "title": "EHF/PEPPOL fakturering via Tripletex",
    "status": "queued",
    "priority": "high",
    "phase": 2,
    "depends_on": ["K-B2B-001"]
  },
  {
    "id": "K-B2B-004",
    "title": "Avtalemodeller CRUD",
    "status": "queued",
    "priority": "medium",
    "phase": 2,
    "depends_on": ["K-B2B-001"]
  },
  {
    "id": "K-B2B-005",
    "title": "B2B global toggle i Innstillinger",
    "status": "queued",
    "priority": "medium",
    "phase": 2,
    "depends_on": ["K-B2B-001"]
  },
  {
    "id": "K-TRIPLETEX-001",
    "title": "Tripletex API — bankfeed, bilag, EHF, fakturaer",
    "status": "queued",
    "priority": "high",
    "phase": 3,
    "depends_on": ["K-B2B-003"]
  },
  {
    "id": "K-LONN-001",
    "title": "Tripletex Lønn — lønnskjøring og A-melding",
    "status": "queued",
    "priority": "high",
    "phase": 3,
    "depends_on": ["K-TRIPLETEX-001"]
  },
  {
    "id": "K-VIKAR-001",
    "title": "Tilkallingsvikarer og vaktvakt-automatisering",
    "status": "queued",
    "priority": "high",
    "phase": 3,
    "depends_on": ["K-DB-001"]
  },
  {
    "id": "K-KREDITERING-001",
    "title": "Kreditering B2C (Vipps/Stripe) og B2B (kreditnota)",
    "status": "queued",
    "priority": "medium",
    "phase": 3,
    "depends_on": ["K-BETALING-001", "K-B2B-003"]
  },
  {
    "id": "K-PUSH-001",
    "title": "Push-varsler via FCM/APNs (Supabase Edge Function)",
    "status": "queued",
    "priority": "high",
    "phase": 4,
    "depends_on": ["K-AUTH-001"]
  },
  {
    "id": "K-CHAT-001",
    "title": "Chat — Supabase Realtime med push-varsler",
    "status": "queued",
    "priority": "medium",
    "phase": 4,
    "depends_on": ["K-PUSH-001"]
  },
  {
    "id": "K-VURDERING-001",
    "title": "Vurderingssystem etter fullført oppdrag",
    "status": "queued",
    "priority": "medium",
    "phase": 4,
    "depends_on": ["K-OPPDRAG-001"]
  },
  {
    "id": "K-RAPPORT-001",
    "title": "Månedlig statusrapport til eierne",
    "status": "queued",
    "priority": "low",
    "phase": 4,
    "depends_on": ["K-TRIPLETEX-001"]
  },
  {
    "id": "K-DEKN-001",
    "title": "Dekningsområde-administrasjon CRUD",
    "status": "queued",
    "priority": "medium",
    "phase": 4,
    "depends_on": ["K-DB-001"]
  },
  {
    "id": "K-JOURNAL-EXT-001",
    "title": "Journal ekstern-redirect — «Åpne journal»-knapp i sykepleier-appen",
    "status": "queued",
    "priority": "high",
    "phase": 5,
    "description": "Mikrokontrakt. Legger til «Åpne journal»-knapp i NurseHjem og NurseInnsjekk. Leser journal_aktiv + journal_modus fra innstillinger. Hvis modus=ekstern: åpner journal_ekstern_url i ny fane. Estimert tid: 1–2 dager. Forutsetning: journal_aktiv=true og journal_modus='ekstern' i innstillinger.",
    "depends_on": ["K-AUTH-002", "K-DB-001"]
  },
  {
    "id": "K-JOURNAL-001",
    "title": "Intern journalmodul — pasientjournal, notat, tilgang, audit-log",
    "status": "queued",
    "priority": "high",
    "phase": 5,
    "description": "Intern journalmodul aktiveres av journal_aktiv=true + journal_modus='intern'. Oppretter/leser pasientjournaler, journalnotater, journal_tilganger (audit-log). NurseJournal-skjerm i sykepleier-app. JournalInnsyn og JournalSperring for pasient. JournalAdmin i adminpanel. Krever NHN-sertifisering og juridisk avklaring FØR produksjonssetting.",
    "depends_on": ["K-JOURNAL-EXT-001", "K-DB-001", "K-AUTH-002"]
  },
  {
    "id": "K-TILSYN-001",
    "title": "Internkontroll og Helsetilsyn-compliance — avviksmeldinger og kvalitetssystem",
    "status": "queued",
    "priority": "medium",
    "phase": 5,
    "description": "AvviksMelding-skjerm i sykepleier-app. InternKontroll-panel i admin. Skriver til avviksmeldinger-tabellen. Avviksoversikt med status, tiltak og lukking. Krav: forskrift om ledelse og kvalitetsforbedring i helse- og omsorgstjenesten.",
    "depends_on": ["K-JOURNAL-001"]
  },
  {
    "id": "K-KPR-001",
    "title": "KPR-rapportering til Helsedirektoratet",
    "status": "queued",
    "priority": "medium",
    "phase": 5,
    "description": "Aktivitetsrapportering til kommunalt pasient- og brukerregister (KPR). Vedtatt statsråd september 2024. Format, API og frist avklares med Helsedirektoratet (brev sendt). Avhenger av K-JOURNAL-001.",
    "depends_on": ["K-JOURNAL-001"]
  }
]
```

---

## 9. Åpne punkt — MÅ avklares

| Prioritet | Punkt | Ansvarlig |
|---|---|---|
| 🔴 Kritisk | **MVA Besøksvenn + Trilleturer** — avklar med revisor FØR lansering. Satt til 0% nå. | Richard + revisor |
| 🔴 Kritisk | **AS-registrering** — org.nr. må på plass FØR Vipps/BankID produksjon | Richard |
| 🔴 Kritisk | **HPR-verifisering** — alle sykepleiere/vikarer. Helsepersonellregisteret API. | Lise + Richard |
| 🔴 Kritisk | **Journalansvarlig** — utpek person med HPR-nummer FØR første stell-oppdrag | Lise |
| 🔴 Kritisk | **Statsforvalteren registrering** — melding om privat helse- og omsorgstjeneste (brev sendt) | Lise |
| 🟡 Viktig | **Skattetrekkskonto** — sperret konto i DNB (lovpålagt) | Lise |
| 🟡 Viktig | **Tripletex Lønn** — sett opp før første ansatt | Lise |
| 🟡 Viktig | **Google Workspace** — @eiranova.no må konfigureres | Lise |
| 🟡 Viktig | **journal_modus valg** — ekstern (K-JOURNAL-EXT-001) FØR intern (K-JOURNAL-001) | Richard |
| 🟡 Viktig | **KPR-rapporteringsformat** — avklar med Helsedirektoratet (brev sendt) | Richard |
| 🟢 Planlagt | **BankID/Vipps Login** — etter AS-registrering | Richard |
| 🟢 Planlagt | **Push-varsler** — FCM/APNs via Supabase Edge Functions | Dev |
| 🟢 Planlagt | **NHN-sertifisering** — påkrevd FØR journal_modus='intern' settes i produksjon | Richard |

---

## 10. Fra prototype til produksjon

### Mock-data → Supabase
| Prototype (mock) | Produksjon (Supabase) |
|---|---|
| `ORDERS` / `OPPDRAG` | `oppdrag`-tabell |
| `NURSES` / `ANSATTE_LONN` | `sykepleiere` / `ansatte`-tabeller |
| `B2B_C` / `B2B_COORD_BRUKERE` | `b2b_organisasjoner` / `b2b_brukere` |
| `INIT_VIKARER` | `vikarer`-tabell |
| `INIT_AVTALEMODELLER` | `avtalemodeller`-tabell |
| `initTjenester` | `tjenester`-tabell |
| `initKategorier` | `tjeneste_kategorier`-tabell |
| `BEMANNING_BYRAER` | `bemanningsbyraaer`-tabell |

### toast() → ekte API-kall
Alle `toast()`-kall i prototypen markerer steder for ekte implementasjon:
- `toast('Kjør lønn')` → `POST /api/tripletex/lonnkjoring`
- `toast('Send A-melding')` → `POST /api/tripletex/amelding`
- `toast('Vipps betaling')` → Vipps ePayment initiate
- `toast('Kreditnota sendes')` → Tripletex createCreditNote + PEPPOL
- `toast('Hent fra Altinn')` → `GET /api/altinn/skattekort`

### navTo() → Next.js App Router
- `navTo('hjem')` → `/app/hjem`
- `navTo('bestill')` → `/app/bestill` (middleware-beskyttet)
- `navTo('b2b-dashboard')` → `/b2b/dashboard`
- `navTo('admin-*')` → `/admin/*`

---

## 11. Anbefalt Next.js filstruktur

```
app/
  (kunde)/          # Landing, Login, Hjem, Bestill, Betaling, Mine, Profil, Chat
  (sykepleier)/     # Login, Rolle, Hjem, Innsjekk, Rapport, Profil
  (b2b)/            # Dashboard, Bestill, Bruker
  (admin)/          # Dashboard, Oppdrag, Betalinger, B2B, Ansatte, Økonomi, Tjenester, Innstillinger
  api/              # Vipps, Stripe, Tripletex, Altinn, Push webhooks

components/
  ui/               # PH, BNav, DeskNav, Toast, Badge, Toggle, Modal
  admin/            # ADashboard, AOppdrag, ABetalinger, AB2B, m.fl.

lib/
  supabase/         # Client, server, middleware, RLS helpers
  tripletex/        # API-klient, EHF, lønnskjøring
  vipps/            # ePayment API
  stripe/           # Payment Intent, refunds

hooks/              # useToast, useOppdrag, useTjenester, useAuth
types/              # TypeScript interfaces for alle datamodeller
```

---

*EiraNova — Faglig trygghet. Menneskelig nærhet.*  
*Prototype v17 · 7 826 linjer · 27. mars 2026 · X Group AS / CoreX*
