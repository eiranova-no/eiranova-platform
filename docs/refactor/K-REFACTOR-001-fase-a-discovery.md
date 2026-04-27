# K-REFACTOR-001 Fase A — discovery

Operativ logg for overraskelser ved uttrekk fra `apps/prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx`.

**Governance:** Strukturerte kopier ligger i `docs/contracts/DISCOVERIES.json` (D-015–D-017, m.fl.).

## 1. `C.sky` vs `C.skyBg` ved tekstuerstatning

`ROLLE_INFO` m.fl. bruker både `C.sky` og `C.skyBg`. En naiv strengerstatning som tok `C.sky` først ga ugyldig JS (`"#2563EB"Bg`). **Løsning:** erstatt `C.*` i synkende lengde på nøkkel (lengste token først) i `scripts/extract-prototype-mock-data.mjs`.

## 2. SSR / hydrering og viewport

Prototypen dokumenterer at kunde-landing må starte i «mobil»-grensesnitt for å unngå hydreringsfeil; `useViewportMin768` er derfor bevisst `useEffect`-basert (ikke `useLayoutEffect`). Hooken er flyttet til `packages/ui` med eksplisitt `breakpointPrototypeDesktopPx` (768) for pixel-paritet med prototype-CSS.

## 3. Globale CSS-klasser på tvers av skjermer

Store deler av UI-et er ikke komponentisolert, men styrt av klasser (`.btn`, `.card`, `.phone`, `.land-kunde-mobile`, `.pw-app`, osv.). Fase A beholder én `global.css` slik at senere skjermmigrering ikke introduserer duplikat eller avvikende utility-sett per app.

## 4. Mock-data og `DEFAULT_KUNDE_SERVICES`

`DEFAULT_KUNDE_SERVICES` er avledet av `catalogTilKundeServices(INIT_TJENESTER_CATALOG)` — samme rekkefølge som i prototypen. Endringer i katalogen påvirker både kunde-listen og admin-state; pakken eksporterer begge eksplisitt.

## 5. Regenerering av fixtures (kontrakt)

`packages/mock-data/src/generated/prototype-fixtures.ts` skal **ikke** redigeres for hånd.

- **Når regenerere:** Etter hver bevisst endring i `apps/prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx` som påvirker mock-konstanter eller hjelperfunksjoner som scriptet eksporterer.
- **Kommando:** `pnpm --filter @eiranova/mock-data generate` (eller `node scripts/extract-prototype-mock-data.mjs` fra repo-rot).
- **Drift:** `pnpm verify:mock-data-generated` (kjører også i CI) — feiler hvis generert fil ikke matcher prototype + codegen.

## 6. Felles prototype-komponenter bevisst utsatt (Fase B+)

Fase A leverer kun `UiButton` og `UiCard` som tynne wrappere mot `.btn` / `.card`. Prototypen har flere **delte** komponenter som brukes på tvers av skjermer, bl.a.:

`PH`, `Bdg`, `BNav`, `DeskNav`, `ModalPortal`, `TjenesteMerinfoModal`, `KundeNavShell`, `NurseBottomNav` (og evt. nærstående hjelperkomponenter).

**Beslutning:** Disse legges **ikke** i `packages/ui` i Fase A. De flyttes/typifiseres når den **første migrerte skjermen** som trenger dem lander (Fase B–D), så unngår vi død kode og feil API-overflate. Neste fase skal **utvide `packages/ui`**, ikke duplisere disse lokalt i app uten avtale.

## 7. Next build vs. Supabase-env (pre-eksisterende)

`nurse-app` og `admin-app` feiler `next build` lokalt/CI uten `NEXT_PUBLIC_SUPABASE_*` fordi klient-/config-moduler evaluerer `process.env` ved import. Dette er en **build-time** coupling som bør løses med tydelig env-helper / lazy init (se D-015). Ikke introdusert av Fase A; logges for opprydding sammen med app-arbeid (f.eks. Fase B).

## 8. Eksport-konvensjon for `@eiranova/ui` (flat, ikke namespaced)

**Valg:** Flate navngitte eksporter fra pakkeroten, f.eks. `import { colors, breakpointPhoneShellPx, UiButton } from "@eiranova/ui"` — ikke `import * as tokens` eller `export * as tokens` med mindre vi senere **bevisst** endrer strategi.

- Filen `src/tokens.ts` kan utvides med flere token-grupper (f.eks. `spacing`, `typography`); hver gruppe eksporteres som **eget navn** og re-eksporteres fra `src/index.ts`.
- Dette matcher et Tailwind-aktig mønster og gjør destrukturering enkel.

## 9. Kjent for Fase B (ikke i scope i Fase A-PR)

Disse er avklart i Fase A og skal **ikke** blokkere merge av pakkene uten app-integrasjon:

1. **`transpilePackages`** — Hver app som importerer fra monorepo-pakkene bør legge til `transpilePackages: ["@eiranova/ui", "@eiranova/mock-data"]` i `next.config.mjs` ved første import. Pakkene er **kilde-TS** uten eget build-steg (intensjonelt). Logget som **D-017**.
2. **Global CSS** — Plan: `import "@eiranova/ui/styles/global.css"` i rot-layout; `sideEffects: ["*.css"]` er satt på `@eiranova/ui`. Må **verifiseres** i ekte app-build i Fase B.
3. **Branch protection** — Repo-innstilling: under *Settings → Branches → `dev` → Required status checks* bør **`verify-mock-data`** (jobbnavnet i GitHub Checks) inkluderes sammen med build/validate, slik at drift i `prototype-fixtures.ts` ikke kan merges ved oversett rød sjekk. Dette kan ikke settes fra kode; eier oppdaterer GitHub.
