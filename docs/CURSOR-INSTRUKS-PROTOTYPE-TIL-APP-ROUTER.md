# Cursor-instruks: Fra prototype-monolitt til normal Next.js-struktur (ASAP)

**Formål:** Prototypen skal ikke være «master» for produksjonsappene. Next.js App Router, TypeScript og modulære komponenter eier UI. Prototypen blir **lesbar referanse**, ikke importert runtime-kilde.

**Eneste godkjente kilde i repo:** `apps/prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx`  
**Aldri:** kopier fra `~/Downloads`, eldre HANDOFF-zip eller filer utenfor monorepo.

**Branching:** Arbeid alltid på `feature/K-REFACTOR-001-...` fra `dev`. Aldri commit til `main`/`main`-merge uten release-prosess.

---

## 1. Nåværende tilstand (fakta i kodebasen)

| App | Mønster |
|-----|--------|
| **kunde-app** | `KundePrototypeShell` importerer hele prototypen og styrer én «skjerm» via `forcedScreen` fra `usePathname()` (`TAB_BY_PATH` i `apps/kunde-app/components/KundePrototypeShell.tsx`). Flere ruter har allerede **direkte** import av enkeltkomponenter fra prototype (login, onboarding, glemt passord, osv.). |
| **nurse-app** | Én side: `PrototypeApp` med `forcedTab="nurse"`, `forcedScreen="nurse-login"`. |
| **admin-app** | Én side: `PrototypeApp` med `forcedTab="admin"`, `forcedScreen="admin-panel"`. |
| **Stiler** | `prototype-styles.tsx` trekker ut `CSS`-string fra samme prototype-fil — global injisering. |

**Konsekvens:** Hver rute som bruker skallet bundler ~657KB+ JSX; ingen reell kodesplitt per rute; TypeScript stopper ved import-grensen; én felles tilstandsmaskin i demo-fila.

**Kø-konflikt å løse i governance:** `CONTRACT_QUEUE.json` sin `K-ROUTE-001` har `out_of_scope`: «Ekte Next.js App Router-struktur» og deliverables som «Oppdatert prototype» — det **forsterker** prototype-som-master. `DISCOVERIES.json` D-001 peker på K-ROUTE-001 som løsning for «ekte struktur». Etter denne migreringen må kø/spes **K-ROUTE-001** revideres (egen `chore/queue-update-*`-branch når Richard sier fra).

---

## 2. Målbilde (Definition of Done)

1. **Ingen** produksjonsapp importerer `apps/prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx` (verken default export eller navngitte exports).
2. **Ruter** eies av App Router: én mappe per brukerflate, komponenter co-located eller i `components/`, delt UI i `packages/`.
3. **TypeScript** på alt nytt/omskrevet (strict, interfaces, ingen unødig `any`).
4. **Visuell paritet:** Samme layout, typografi (Fraunces + DM Sans), farger fra designsystem, avstander og tekst (bokmål) som prototype — med mindre Richard eksplisitt godkjenner avvik.
5. **Ingen** «forbedringer» i samme PR som flytting: refaktor = flytt, splitt, typ — ikke redesign.
6. **Mock-data** flyttes til `packages/mock-data` (eller tilsvarende) og eksporteres derfra; ikke dupliser store JSON-blokker i hver app.
7. Prototype-fila **flyttes** til `docs/ux-reference/` (eller beholder navn) som **dokumentasjon**; `apps/prototype/` slettes når intet lenger refererer dit.
8. Oppdater **ÉN** av `README.md` / `docs/ARCHITECTURE.md` / `docs/CHANGELOG.md` når hovedfasen lander (følger EiraNova doc-regler).

---

## 3. Inventar fra prototype (kildemapper i én fil)

`SC` (tabs → `[screenId, label]`) og `SCREENS` (screenId → komponent) ligger nederst i prototype-fila (~linje 9284–9297). Bruk disse som **sjekkliste** — ikke som arkitektur.

**Kunde (`kunde`-tab, utdrag):**  
`landing`, `login`, `push-tillatelse`, `samtykke`, `epost-bekreftelse`, `onboarding`, `glemt-passord`, `hjem`, `bestill`, `betaling`, `bekreftelse`, `mine`, `kunde-oppdrag-detalj`, `kunde-profil`, `kunde-avtale-detalj`, `oppdrag-i-gang`, `chat-kunde`, B2B-relaterte skjermer, m.fl.

**Sykepleier (`nurse`-tab):**  
`nurse-login` → `nurse-rolle` → `nurse-onboarding` → `nurse-hjem` → `nurse-oppdrag` → `nurse-innsjekk` → `nurse-rapport` → `nurse-profil`

**Admin:**  
`admin-panel` (Admin-komponent med mange props)

`KUNDE_SCREEN_PATH` i prototype (ca. 9300–9311) mapper allerede flere `screenId` → path — **gjenspeil** dette i Next når du oppretter ruter, så deep links og auth-matcher fortsatt gir mening.

`KundePrototypeShell` `TAB_BY_PATH` i dag:

- `/` + innlogget → `hjem`; uten bruker → `landing`
- `/bestill` → `bestill`
- `/mine` → `mine`
- `/profil` → `kunde-profil`
- `/oppdrag-i-gang` → `oppdrag-i-gang`
- `/chat` → `chat-kunde`

---

## 4. Anbefalt rekkefølge (strikk, ikke big bang)

### Fase A — Delt grunnmur (før full «skjerm»-migrering)

1. Opprett `packages/ui` (eller utvid om noe finnes): knapper, layout, kort, typografi-wrappere som matcher prototype-CSS.
2. Ekstraher **globale stiler** fra prototype: i dag kommer `CSS` som én template literal — splitt i moduler (CSS modules eller `packages/ui` med co-located `.module.css`) slik at apper **ikke** avhenger av hele fila for styling.
3. `packages/mock-data`: `INIT_TJENESTER_CATALOG`, `ORDERS`, `NURSES`, mock-kunde e-post, osv. — det som SCREENS allerede bruker.

Commit: `chore(refactor): shared ui tokens and mock-data package` (eller tilsvarende).

### Fase B — kunde-app (høyest prioritet)

1. Ruter som **allerede** har direkte import fra prototype: la dem være **første** kandidater til å bytte import-path til `packages/ui` + lokale `page.tsx`-komponenter (samme JSX, ny fil).
2. Erstatt `KundePrototypeShell` + `forcedScreen` **skjerm for skjerm**:
   - For hver path i `app/.../page.tsx`: innhold skal være en eksportert komponent (fra `components/kunde/...`) med samme visning som tilsvarende `SCREENS[screenId]`.
   - Intern navigasjon: `Link` / `useRouter` fra Next — **ikke** `navTo` fra prototype.
3. Auth og middleware (`K-AUTH-001`) skal fortsatt beskytte ruter; ikke duplicate guard-logikk inne i gamle `navTo` — bruk `middleware` + session slik kunde-app allerede gjør.
4. **Ett** PR eller **en** logisk commit per hovedskjerm (f.eks. «feat(kunde): extract bestill from prototype») for enkel review og rollback.

### Fase C — nurse-app

1. Bytt ut enkeltside med App Router-struktur: f.eks. `app/(nurse)/login/page.tsx` → `nurse-login`, osv., speilet mot `SC.nurse`.
2. Del state som prototype holdt i `useState` i App-komponenten: bruk context per domene der nødvendig, ellers lokal state per side.

### Fase D — admin-app

1. `admin-panel` er tung: splitt `Admin` inn i sider under `app/admin/...` etter faner/seksjoner i eksisterende komponent, med delt layout.

### Fase E — Fjern prototype fra `apps/`

1. Søk repo: `EiraNova-Prototype-HANDOFF-vANDOFF` / `EiraNova-Prototype` — null treff i `apps/*` (unntatt evt. `docs/ux-reference`).
2. Flytt `apps/prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx` → `docs/ux-reference/`.
3. Oppdater `.cursorrules` peker og `richard-prototype-workflow.mdc`: prototype er **referanse**, ikke redigeringskilde for feature-arbeid fremover.
4. Triage **D-001** (oppdater `action` når fila ikke lenger er eneste kilde).

---

## 5. Regler Cursor skal følge under arbeidet

- **Ingen nye** avhengigheter til hele prototype-fila i apper. Midlertidig: én import-grense er akseptabelt *kun* inntil en skjerm er flyttet — ikke legg til nye.
- **Grep først** i prototype-fila etter komponentnavn; les **kontekst** rundt (props, state) før du limer inn.
- **Behøver ikke** lese 9000+ linjer sekvensielt: bruk målrettet søk (`Grep` / søk etter `function Landing`, `const Bestill`, osv.).
- **Pixel-paritet:** sammenlign side ved side (localhost) mot gjeldende prototype-skjerm før PR merges.
- **Norsk** i all bruker-tekst; **engelsk** i kode-kommentarer (EiraNova-standard).
- **Ikke** kjør `pnpm build` / dev-servere på vegne av Richard uten at han ber om det (lokal praksis i `.cursor/rules/richard-prototype-workflow.mdc`).

---

## 6. Aksepttest (manuell)

- [ ] Alle kunde-URL-er som finnes i `app/` gir samme hovedinnhold som før (desktop + 390px).
- [ ] Innlogging, utlogging, og beskyttede ruter fungerer som før.
- [ ] nurse og admin: alle primære flyter i `SC` for tab nås via URL (ingen «tom» prototype-toolbar avhengighet).
- [ ] Ingen import av `apps/prototype/...COMPLETE.jsx` i kunde-, nurse- eller admin-app.
- [ ] `pnpm --filter kunde-app build` (og tilsvarende) grønne når Richard kjører dem.

---

## 7. Eierskap

- **Produkt/arkitektur:** Richard — avvik fra pixel-paritet krever uttrykkelig OK.
- **Kø/spes-oppdatering** for K-ROUTE-001 + ev. K-REFACTOR-001: egen branch etter mønster i `.cursorrules`.

Dette dokumentet er **operativ instruks** til Cursor/ implementatør. Teknisk dypdykk i hver skjerm kommer i commits/PR-beskrivelser per skjerm.
