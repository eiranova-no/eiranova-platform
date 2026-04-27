# K-REFACTOR-001 — Avvikle prototype-som-master

| Felt | Verdi |
| --- | --- |
| **ID** | K-REFACTOR-001 |
| **Tittel** | Avvikle prototype-som-master — uttrekk til `packages/ui` + ekte App Router per app |
| **Type** | refactor |
| **Status** | active |
| **Eier** | Richard (technical architect) |
| **Implementor** | Cursor |
| **Avhengigheter** | K-INFRA-001 (merged), K-AUTH-001 (merged), K-DB-002 (merged) |
| **Blokkerer** | K-ROUTE-001, K-AUTH-002, K-TJENESTE-001, K-BESTILL-001, og videre feature-kontrakter som bygger på prototype-mønsteret |
| **Cursor-instruks** | [CURSOR-INSTRUKS-PROTOTYPE-TIL-APP-ROUTER.md](../../CURSOR-INSTRUKS-PROTOTYPE-TIL-APP-ROUTER.md) (autoritativ steg-for-steg) |
| **Estimat** | 3–5 arbeidsøkter (skjerm-for-skjerm med pixel-parity-verifisering per commit) |

**Kø-sannhet:** `docs/contracts/CONTRACT_QUEUE.json`

---

## Mål

Fjern `apps/prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx` som runtime-kilde for `kunde-app`, `nurse-app` og `admin-app`. Hver app skal være en selvstendig Next.js App Router-applikasjon med egne typede komponenter og ekte ruter. Prototypen flyttes til `docs/ux-reference/` som **read-only UX-referanse**, ikke kjørende kode.

**Dette er ren refaktorering. Ingen UX-endringer. Pixel-parity er akseptkriterium.**

---

## Hvorfor nå

1. **D-001 er åpen (triaged).** Den anerkjenner prototype-som-master som teknisk gjeld. K-ROUTE-001 i eldre form videreførte gjelden (deliverables var «oppdatert prototype»); køen er nå justert: refactor først, deretter middleware-basert K-ROUTE-001.
2. **K-AUTH-002 trenger middleware-basert ruteguard**, ikke `navTo` inni en monolitt-fil. Refaktoreringen må skje først.
3. **Miljøene er oppe.** Hver feature som bygges på prototypen gjør refaktoreringen dyrere senere.
4. **Bundle-økonomi.** Store felles JSX-bundles per rute; mål er kodesplitting via ekte ruter og pakker.
5. **TypeScript stopper ved `.jsx`-grensen.** Typesikkerhet i kunde-app er begrenset så lenge monolitten importeres.

---

## Inventar (hva som faktisk skal flyttes)

Prototype-fila inneholder blant annet:

- **~50 React-komponenter** (Landing, Login, Hjem, Bestill, Mine, KundeProfil, OppdragIGang, ChatKunde, Onboarding, Samtykke, PushTillatelse, EpostBekreftelse, GlemtPassord, Betaling, Bekreftelse, KundeOppdragDetalj, KundeAvtaleDetalj, KundeAvbestillBekreftModal, NurseLogin, NurseRolle, NurseOnboarding, NurseHjem, NurseOppdrag, NurseInnsjekk, NurseProfil, NurseRapport, NurseBottomNav, Admin, ADashboard, AOppdrag, ABetalinger, AAnsatte, AB2B, OkonomiPage, InnstillingerPage, TjenesteAdmin, LonnPanel, VikarPanel, PrisKalkulator, OppdragModal, KrediterPrivatModal, KreditnotaB2BModal, InstruktionEditor, TjenesteKalkulator, ADrawer, AHeader, ASidebar, B2BLogin, B2BOnboarding, B2BDashboard, B2BBestill, B2BBruker, B2BBrukerAktivering, IngenInvitasjonInfo, LoginGate)
- **Designtokens** (`C`-objektet)
- **Global CSS** (template literal `CSS`)
- **Helpers** (`erGyldigEpost`, `fulltNavnMinToOrd`, `useViewportMin768`, `useToast`, `klikkRegistrert`, `parseErfaringAar`, `sykepleierOmradeTilChips`, `profilEndringSammendrag`, `kundeOrdreHistorisk`, `kundeKanAvbestilleSelv`, `kundeMaKontakteForAvbestilling`, `mockKundeNesteAvtale`, `nurseDefaultInnsjekkOppdragId`, `orderStartMsForAvbestilling`, `prototypeTimerTilOppstart`, `kundeAvbestiltRefusjonInfotekst`, `catalogTilKundeServices`, m.fl.)
- **Felles UI-primitiver** (`PH`, `Bdg`, `BNav`, `DeskNav`, `ModalPortal`, `TjenesteMerinfoModal`, `KundeNavShell`, `NurseBottomNav`)
- **Mock-data** (`INIT_TJENESTER_CATALOG`, `ORDERS`, `NURSES`, `OPPDRAG`, `CHAT`, `B2B_C`, `B2B_INV`, `MOCK_B2B_HENVENDELSER`, `VIPPS_P`, `STRIPE_P`, `WH`, `INIT_STAFF`, `INIT_B2B_TILGANGER`, `INIT_AVTALEMODELLER`, `INIT_VIKARER`, `BEMANNING_BYRAER`, `B2B_COORD_BRUKERE`, `PAKKER`, `ANSATTE_LONN`, `TARIFF_INFO`, `LONNKJORINGER`, `KREDITERINGER`, `KANSELLERING_REGLER`, `NURSE_PROFIL_SPESIALITETER_CHIPS`, `NURSE_PROFIL_OMRADE_CHIPS`, `NURSE_TITTEL_OPTIONS`, `NURSE_NAV`, `BN_K`, `KUNDE_NAV_TAB_IDS`, `KUNDE_NAV_SHELL_ROOT_IDS`, `INTERNE_ROLLER`, `B2B_ROLLER`, `ROLES`, `ROLLE_INFO`, `ROLLE_TILGANGER`, `MOCK_KUNDE_INNLOGGET_EPOST`, `TOAST_AVBESTILLING_BEKREFTET`, `PROTOTYPE_NOW_MS`, `NURSE_PROFIL_MOCK_INDEKS`, m.fl.)
- **Routing-tabeller** (`SC`, `SCREENS`, `KUNDE_SCREEN_PATH`)
- **App-rot-state** som krysser komponentgrensene: `tjenesterCatalog`, `mockOrders`, `nursesCatalog`, `ventendeProfilendringer`, `bestillPreselect`, `kundeOrdreDetaljId`, `nurseFocusOppdragId`, `kundeRegEpost`, `isNyKoordinator`, `glemtPassordNurseMode`, `loggedIn`, `nurseLoggedIn`, m.fl.

Alt skal ut, kategoriseres og eksplisitt typet.

---

## In scope

1. **Delt pakke `packages/ui/` (TypeScript):** `tokens.ts` (`C`), `styles/global.css`, helpers under `lib/`, felles komponenter under `components/`, hooks (`useToast`, `useViewportMin768`).
2. **Pakke `packages/mock-data/` (TypeScript):** alle mock-data og relevante konstanter.
3. **Splitt skjermkomponenter** til `apps/*/components/screens/*.tsx` — én skjerm per fil, TypeScript.
4. **Erstatt `forcedScreen`** med ekte App Router-ruter; navigasjon med `useRouter` / `<Link>`; delt state via `searchParams`, route-state eller Context per app.
5. **Erstatt prototype CSS-injection** med standard Next-import i `app/layout.tsx`.
6. **Konverter til TypeScript** med eksplisitte props — ingen `any`, ingen `@ts-ignore`.
7. **Slett stillas:** `KundePrototypeShell.tsx`, `prototype-styles.tsx`, direkte prototype-imports i nurse/admin.
8. **Flytt prototype:** `apps/prototype/...COMPLETE.jsx` → `docs/ux-reference/EiraNova-Prototype-v17-REFERENCE.jsx`, `docs/ux-reference/README.md`, slett `apps/prototype/`, oppdater `pnpm-workspace.yaml`.

---

## Out of scope

- UX-endringer, nye features, redesign, mock → Supabase (egne kontrakter).
- Auth utover minimum for rutingu (K-AUTH-002).
- Endringer i `marketing` / `oppstart`.
- Migrering til Tailwind / CSS Modules — `global.css` beholdes som strukturert uttrekk fra prototype.

---

## Migrasjonsstrategi

Følg fasene i **CURSOR-INSTRUKS-PROTOTYPE-TIL-APP-ROUTER.md** (A → B → C → D → E). Instruksen er autoritativ for rekkefølge; denne fila er governance.

**Kritiske regler:** Én kilde i workspace (prototype-fila i repo). Pixel-parity. Commit per skjerm; build etter hver commit. Cursor starter ikke dev-server (Richard kjører lokalt). Skjult tilstand → append i `DISCOVERIES.json`.

---

## Akseptkriterier

Som i `CONTRACT_QUEUE.json` for denne kontrakten, inkl.:

- `apps/prototype/` finnes ikke etter merge av implementasjons-PR.
- Ingen import fra `apps/prototype/` eller `docs/ux-reference/` i app-kode.
- `pnpm typecheck` og `pnpm build` grønt på alle tre apper.
- Visuell paritet mot tag `pre-refactor-K-REFACTOR-001` (settes før Fase A).
- D-001 → `resolved` i egen oppdatering når refactor-PR merges (ikke i queue-only-PR).

---

## Deliverables

Se `CONTRACT_QUEUE.json` → `deliverables` for K-REFACTOR-001 (pakker, skjermfiler, ruter, ux-reference, workspace, ARCHITECTURE, CHANGELOG, DISCOVERIES).

---

## User stories

Ikke relevant — refaktoreringskontrakt.

---

## Risiko

| Risiko | Mitigering |
| --- | --- |
| Skjult kryss-komponent-state | Discovery før flytt; Context per app; logg i DISCOVERIES.json |
| Pixel-drift | Tag `pre-refactor-K-REFACTOR-001`; sammenlign per commit |
| UX-«forbedringer» underveis | Eksplisitt forbud; discovery, ikke kode |
| Pakker + Vercel | `pnpm build` alle apper etter Fase A før skjerm-migrering |
| K-AUTH-002 parallelt | K-AUTH-002 er blocked inntil denne kontrakten er merget |

---

## Etter merge av implementasjons-PR (ikke queue-PR)

1. Tag `post-refactor-K-REFACTOR-001`.
2. Egen `chore/queue-update-*`: K-REFACTOR-001 → merged; K-ROUTE-001 → ready (etter avtalt scope); K-AUTH-002 → ready; D-001 → resolved.
3. `pnpm generate-cc`.
