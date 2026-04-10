# AI Dev OS v1.1 — EiraNova
**Status:** LOCKED
**Version:** 1.1
**Last updated:** 2026-04-10
**Authority:** Richard (PO)

Dette dokumentet styrer all utvikling på EiraNova-plattformen.
Alle agenter (Claude, Cursor, QA_AUDITOR) følger dette uten unntak.

---

## Låste prinsipper

- Én kontrakt om gangen. Ingen parallell utførelse.
- Main er beskyttet. Aldri direkte commits.
- Repo ZIP-snapshot = eneste kilde til sannhet for alle agenter.
- CONTRACT_QUEUE.json styrer rekkefølge. Kun Richard setter en kontrakt til `ready`.
- Ingen kontrakt starter uten at Claude har evaluert arkitektur.
- Ingen merge til main uten QA_AUDITOR-verdict PASS eller PASS-WITH-RISKS.

---

## Agentroller

| Agent | Rolle | Ansvar |
|-------|-------|--------|
| **Claude** | Technical Architect | Kontrakter, arkitektur, governance, queue-rekkefølge |
| **Cursor** | Implementer | Kode, doc-oppdateringer, CI-verifisering |
| **Richard** | PO / Beslutter | Godkjenner kontrakter, setter ready, merger PR |
| **QA_AUDITOR** | Uavhengig QA | Verifiserer leverte kontrakter mot akseptansekriterier |

---

## Syklusen

### Steg 1 — Plan

**Claude (Technical Architect)**
- Oppdaterer CONTRACT_QUEUE.json: rekkefølge, avhengigheter, akseptansekriterier
- Skriver kontrakt-spec i docs/contracts/active/K-XXX.md
- Verifiserer at alle avhengigheter er merget før kontrakt kan starte

**Richard (PO)**
- Gjennomgår kontrakt
- Setter status → `ready`
- Starter Cursor

---

### Steg 2 — Implementasjon

**Cursor (Implementer)**
1. `git checkout dev && git pull origin dev`
2. `git checkout -b feature/K-XXX-kort-beskrivelse`
3. Les `docs/contracts/active/K-XXX.md` — ALDRI start uten å lese spec
4. Implementer alle T-XXX steg i rekkefølge
5. Kjør og rapporter i PR:
   - `pnpm install`
   - `pnpm build` (alle tre apper)
   - `pnpm typecheck` (når TypeScript er satt opp)
6. Åpne PR mot `dev` med: ferdig-sjekkliste, kommandoer kjørt + resultat, discoveries

**Richard (PO)**
- Gjennomgår PR-diff og scope
- Bekrefter GitHub Actions grønt
- Videresender til QA_AUDITOR

---

### Steg 2b — QA Gate (blokkerende)

**QA_AUDITOR** opererer etter implementasjon, før merge.
QA_AUDITOR er fullt uavhengig fra alle andre agenter.

**QA_AUDITOR mottar (obligatorisk input):**
- Repo ZIP-snapshot (feature-branch)
- Aktiv kontrakt-fil (K-XXX.md)
- Branch-navn og commit-hash
- Ingen tidligere chat-kontekst

**QA_AUDITOR verifiserer:**
1. Alle akseptansekriterier i kontrakten
2. Definition of Done
3. Sikkerhetskrav (RLS, server-only, soft-delete)
4. Regresjonsrisiko for eksisterende system
5. Testtilstedeværelse

**QA_AUDITOR-verdict:**
- `PASS` — klar for merge
- `PASS-WITH-RISKS` — merge OK men dokumenter risiko i DISCOVERIES.json
- `FAIL` — returneres til Cursor for revisjon

---

### Steg 3 — Merge

```bash
# Squash and merge til dev
# Delete branch etter merge
git checkout dev
git pull origin dev
```

Etter merge:
- Oppdater CONTRACT_QUEUE.json: sett status → `merged`, legg til `merged_at`
- Kjør `pnpm generate-cc` → CONTROL_CENTER.md regenereres
- Commit: `chore: K-XXX merged, CONTROL_CENTER updated`

---

## Branching-modell

```
main        ← Production (app.eiranova.no etc.) — ALDRI push direkte
 └── dev    ← Fast arbeids-branch
      └── feature/K-XXX-navn  ← kortlevde feature-branches
```

| Branch/hendelse | Vercel-miljø | Database |
|-----------------|--------------|----------|
| Push til `main` | Production | eiranova-prod (eu-central-1) |
| Push til `dev` | Preview | eiranova-dev (eu-central-1) |
| Feature-branch | Preview (unik URL) | eiranova-dev |

---

## Kontraktstatus-taksonomi

| Status | Beskrivelse |
|--------|-------------|
| `merged` | Ferdig implementert og merget til dev/main |
| `active` | Pågår nå — maks ÉN aktiv om gangen |
| `ready` | Spec ferdig, alle avhengigheter merget, klar for Cursor |
| `planned` | I køen, spec ikke ferdig eller avhengigheter ikke klare |
| `blocked` | Blokkert av ekstern faktor (org.nr., NHN etc.) |
| `superseded` | Erstattet av annen kontrakt |

---

## Kritiske ikke-forhandlingsbare regler

1. **Supabase eu-central-1 Frankfurt** — ALLTID. Helsedata krever EU-hosting.
2. **Ingen Magic Link for kunder** — eksplisitt forbudt, verifiser i Supabase-innstillinger
3. **samtykker kan ALDRI slettes** — GDPR-krav
4. **oppdrag_endringer er append-only** — audit-log
5. **journal_tilganger er append-only** — lovpålagt
6. **K-JOURNAL-001 starter IKKE** uten alle fire juridiske krav oppfylt
7. **server-only** på alle Vipps, Stripe og Tripletex-kall
8. **RLS på alle tabeller** uten unntak
9. **Tripletex — ikke Fiken** som regnskapssystem

---

## Hotfix-protokoll

Se `docs/HOTFIX-PROTOCOL.md` for fullstendig prosedyre.

**Kun ved:** kritisk bug i produksjon, auth-brudd, data-tap.

```bash
git checkout main && git pull
git checkout -b hotfix/BESKRIVELSE
# Minimal fix
# PR direkte mot main (unntak fra normal flyt)
# Etter merge: legg til D-XXX i DISCOVERIES.json
```

---

*EiraNova — Faglig trygghet. Menneskelig nærhet.*
*AI Dev OS v1.1 · X Group AS / CoreX*
