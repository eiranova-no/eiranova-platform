# K-REFACTOR-001 Fase A — discovery

Operativ logg for overraskelser ved uttrekk fra `apps/prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx`.

## 1. `C.sky` vs `C.skyBg` ved tekstuerstatning

`ROLLE_INFO` m.fl. bruker både `C.sky` og `C.skyBg`. En naiv strengerstatning som tok `C.sky` først ga ugyldig JS (`"#2563EB"Bg`). **Løsning:** erstatt `C.*` i synkende lengde på nøkkel (lengste token først) i `scripts/extract-prototype-mock-data.mjs`.

## 2. SSR / hydrering og viewport

Prototypen dokumenterer at kunde-landing må starte i «mobil»-grensesnitt for å unngå hydreringsfeil; `useViewportMin768` er derfor bevisst `useEffect`-basert (ikke `useLayoutEffect`). Hooken er flyttet til `packages/ui` med eksplisitt `breakpointPrototypeDesktopPx` (768) for pixel-paritet med prototype-CSS.

## 3. Globale CSS-klasser på tvers av skjermer

Store deler av UI-et er ikke komponentisolert, men styrt av klasser (`.btn`, `.card`, `.phone`, `.land-kunde-mobile`, `.pw-app`, osv.). Fase A beholder én `global.css` slik at senere skjermmigrering ikke introduserer duplikat eller avvikende utility-sett per app.

## 4. Mock-data og `DEFAULT_KUNDE_SERVICES`

`DEFAULT_KUNDE_SERVICES` er avledet av `catalogTilKundeServices(INIT_TJENESTER_CATALOG)` — samme rekkefølge som i prototypen. Endringer i katalogen påvirker både kunde-listen og admin-state; pakken eksporterer begge eksplisitt.

## 5. Regenerering av fixtures

`packages/mock-data/src/generated/prototype-fixtures.ts` skal ikke redigeres for hånd. Kjør `node scripts/extract-prototype-mock-data.mjs` (eller `pnpm --filter @eiranova/mock-data generate`) etter bevisste endringer i HANDOFF-fila.
