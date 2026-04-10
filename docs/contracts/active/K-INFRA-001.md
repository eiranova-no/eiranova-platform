# K-INFRA-001 — Monorepo Foundation & GitHub Michelin-standard

**Status:** ready
**Type:** infra
**Tid:** 2-3 timer
**Avhenger av:** —

---

## Mål

Etabler Michelin-standard GitHub-oppsett identisk med MBV-plattformen:
CONTRACT_QUEUE.json, CONTROL_CENTER.md, DISCOVERIES.json, .cursorrules,
komplett docs-struktur, CI-baseline. Blocker for alle etterfølgende kontrakter.

---

## Scope

### In scope
- Commit alle governance-filer fra Claude til repo
- docs/contracts/CONTRACT_QUEUE.json (31 kontrakter, Fase 0–5)
- docs/contracts/DISCOVERIES.json (6 åpne funn)
- docs/contracts/active/.gitkeep
- docs/status/CONTROL_CENTER.md (auto-generert)
- docs/status/MERGED_HISTORY.md
- docs/PROCESS.md (AI Dev OS v1.1)
- docs/ARCHITECTURE.md
- docs/CHANGELOG.md
- docs/HOTFIX-PROTOCOL.md
- docs/ENVIRONMENTS.md
- .cursorrules v6.0 (Michelin-standard)
- .github/workflows/ci.yml (build alle tre apper + validate-queue)
- scripts/generate-control-center.ts
- scripts/queue.ts
- package.json: legg til scripts generate-cc og queue
- README.md oppdatert med status-seksjon

### Out of scope
- Feature-utvikling
- Supabase-migrasjoner
- Domene-kobling (K-ENV-001)
- Endring av prototype-JSX

---

## Steg

### T-001 — Kopier governance-filer til repo

```bash
cd ~/code/eiranova-platform
git checkout dev
git pull origin dev
git checkout -b chore/queue-update-K-INFRA-001
```

Kopier disse filene fra Claude-output til riktige steder i repo-et:

| Fra (Claude output) | Til (repo) |
|---------------------|------------|
| docs/contracts/CONTRACT_QUEUE.json | docs/contracts/CONTRACT_QUEUE.json |
| docs/contracts/DISCOVERIES.json | docs/contracts/DISCOVERIES.json |
| docs/status/CONTROL_CENTER.md | docs/status/CONTROL_CENTER.md |
| docs/status/MERGED_HISTORY.md | docs/status/MERGED_HISTORY.md |
| docs/PROCESS.md | docs/PROCESS.md |
| docs/ARCHITECTURE.md | docs/ARCHITECTURE.md |
| docs/CHANGELOG.md | docs/CHANGELOG.md |
| docs/HOTFIX-PROTOCOL.md | docs/HOTFIX-PROTOCOL.md |
| docs/ENVIRONMENTS.md | docs/ENVIRONMENTS.md |
| .cursorrules | .cursorrules |
| .github/workflows/ci.yml | .github/workflows/ci.yml |
| scripts/generate-control-center.ts | scripts/generate-control-center.ts |
| scripts/queue.ts | scripts/queue.ts |
| README.md | README.md |

### T-002 — Opprett manglende mapper

```bash
mkdir -p docs/contracts/active
mkdir -p docs/status
mkdir -p docs/ops/incidents
mkdir -p docs/compliance
mkdir -p scripts
mkdir -p .github/workflows

touch docs/contracts/active/.gitkeep
touch docs/ops/incidents/.gitkeep
touch docs/compliance/.gitkeep
```

### T-003 — Oppdater package.json med scripts

Legg til i rot-package.json under "scripts":

```json
{
  "scripts": {
    "generate-cc": "tsx scripts/generate-control-center.ts",
    "queue": "tsx scripts/queue.ts"
  }
}
```

Installer tsx hvis ikke allerede tilgjengelig:
```bash
pnpm add -D tsx -w
```

### T-004 — Test scripts

```bash
pnpm generate-cc
# Sjekk at docs/status/CONTROL_CENTER.md er oppdatert

pnpm queue
# Sjekk at terminal viser farget output med K-INFRA-001 som READY
```

### T-005 — Bygg-sjekk

```bash
pnpm --filter kunde-app build
pnpm --filter nurse-app build
pnpm --filter admin-app build
```

Alle tre skal bygge grønt.

### T-006 — Commit og push

```bash
git add .
git commit -m "feat(infra): Michelin-standard GitHub governance — CONTRACT_QUEUE, CONTROL_CENTER, DISCOVERIES, .cursorrules v6, CI"
git push origin chore/queue-update-K-INFRA-001
```

Åpne PR mot `dev`.

---

## Akseptansekriterier

- [ ] pnpm generate-cc produserer korrekt CONTROL_CENTER.md
- [ ] pnpm queue viser farget output med K-INFRA-001 som READY
- [ ] CI grønt på alle tre apper (build)
- [ ] CI validate-queue sjekker single-contract rule
- [ ] Kun én kontrakt har status active (ingen)
- [ ] docs-struktur identisk med MBV Michelin-standard
- [ ] README lenker til CONTROL_CENTER.md

---

## Documentation Update Checklist

- [ ] README.md — status-seksjon oppdatert
- [ ] docs/CHANGELOG.md — ## [0.2.0] seksjonen lagt til

---

*K-INFRA-001 · EiraNova · 2026-04-10*
