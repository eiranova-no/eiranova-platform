# EiraNova UX-Referanse — v17

**Status:** Read-only referanse. **Ikke kjørende kode.**

## Hva er dette?

`EiraNova-Prototype-v17-REFERENCE.jsx` er den opprinnelige monolittiske prototypen
som ble brukt under produktdesign-fasen (februar–april 2026). Filen var master for:

- Visuell design og pixel-spesifikasjon
- Funksjonell flyt mellom skjermer
- Mock-data og forretningsregler
- `forcedScreen`-/`forcedTab`-pseudo-routing

## Hvorfor er den fortsatt her?

K-REFACTOR-001 (april 2026) splittet prototypen i tre selvstendige Next.js
App Router-applikasjoner: `apps/kunde-app`, `apps/nurse-app`, `apps/admin-app`.
**Pixel-parity var akseptkriterium** — denne fila er sannheten det ble verifisert
mot, og oppbevares som historisk referanse.

## Bruk

| Lov | Ikke lov |
|-----|----------|
| Lese filen for å verifisere intendert design ved tvil | Importere fra denne fila i app-kode (apps/*) |
| Sammenligne ny implementasjon med original ved pixel-avvik | Endre fila — den er historisk artefakt, ikke spesifikasjon |
| Bruke som UX-referanse i nye kontrakter | Bruke som kilde for nye features |

## Hvordan brukes den av script?

`scripts/extract-prototype-mock-data.mjs` peker på denne fila og genererer
`packages/mock-data/src/generated/prototype-fixtures.ts`. CI-jobben
`verify:mock-data-generated` regenererer og feiler ved diff.
Hvis prototypen *aldri* endres (forventet), forblir generert fil stabil.

## Versjonering

`v17` refererer til siste prototype-versjon før refactor. Hvis nye UX-konsepter
designes, lag en ny prototype som egen artefakt — **ikke** endre denne.

## Relaterte dokumenter

- `docs/contracts/active/K-REFACTOR-001.md` — kontrakten som migrerte vekk fra prototypen
- `docs/CURSOR-INSTRUKS-PROTOTYPE-TIL-APP-ROUTER.md` — fase A–E-spesifikasjon
- `docs/ARCHITECTURE.md` — nåværende arkitektur etter refactor
