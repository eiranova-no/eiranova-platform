# CONTROL CENTER
> ⚠️ AUTO-GENERATED — Do not edit manually.
> Generated from: docs/contracts/CONTRACT_QUEUE.json
> Run `pnpm generate-cc` to regenerate.

**Last generated:** 2026-04-28
**Progress:** 18% → MVP Launch

---

## 🟢 ACTIVE CONTRACT

| ID | Title | Type | Goal |
|----|-------|------|------|
| **K-REFACTOR-001** | Avvikle prototype-som-master — uttrekk til packages/ui + ekte App Router per app | refactor | Fjern apps/prototype/ som runtime-kilde. Hver app blir selvstendig Next.js App R... |

---

## ⏸️ PAUSED CONTRACTS

Ingen pausede kontrakter.

---

## ✅ READY CONTRACTS

| ID | Title | Type | Dependencies | Goal |
|----|-------|------|--------------|------|
| **K-DNS-001** | Vercel CNAME-migrering til nye DNS-records | infra | K-ENV-001 ✅ | Migrere CNAME-targets for app.eiranova.no, nurse.eiranova.no og admin.eiranova.n... |

---

## 📋 PLANNED CONTRACTS

| ID | Title | Type | Dependencies |
|----|-------|------|--------------|
| K-LAUNCH-001 | Production Cut-over: Plattform til main | governance | K-AUTH-002, K-DB-001 ✅, K-GDPR-001, K-PROFIL-001, K-BESTILL-001, K-OPPDRAG-001 |
| K-GDPR-001 | GDPR — Samtykke, Soft-delete & Dataportabilitet | governance | K-AUTH-001 ✅ |
| K-TJENESTE-001 | Tjenestekatalog — Backend & Admin CRUD | feature | K-ROUTE-001 |
| K-BESTILL-001 | Bestillingsflyt — 4 Steg Komplett | feature | K-TJENESTE-001, K-GDPR-001 |
| K-BETALING-002 | Betaling — Stripe Kortbetaling | feature | K-BETALING-001 |
| K-OPPDRAG-001 | Oppdragshåndtering — Status-maskin & Vaktvakt | feature | K-BESTILL-001 |
| K-NURSE-001 | Sykepleier-app — Innsjekk, Rapport & Profil | feature | K-OPPDRAG-001 |
| K-PROFIL-001 | Kundeprofil — 3 Faner (Konto, Pårørende, Personvern) | feature | K-OPPDRAG-001 |
| K-REALTIME-001 | Oppdrag-i-gang — Realtime Tre Faser | feature | K-PROFIL-001 |
| K-B2B-001 | B2B — Organisasjoner & Koordinator-onboarding | feature | K-REALTIME-001 |
| K-B2B-002 | B2B — Koordinator-app & Bestilling på Vegne Av | feature | K-B2B-001 |
| K-B2B-003 | B2B — EHF/PEPPOL-faktura via Tripletex | feature | K-B2B-002 |
| K-B2B-004 | B2B — Avtalemodeller & Multi-lokasjon | feature | K-B2B-003 |
| K-LONN-001 | Lønnskjøring, A-melding & Skattetrekk | feature | K-TRIPLETEX-001 |
| K-VIKAR-001 | Tilkallingsvikarer & Vikarregister | feature | K-LONN-001 |
| K-KREDITERING-001 | Kreditering — B2C Refusjon & B2B Kreditnota | feature | K-VIKAR-001 |
| K-PUSH-001 | Push-varsler — Web Push & FCM | feature | K-KREDITERING-001 |
| K-CHAT-001 | Chat — Kunde ↔ Sykepleier via Supabase Realtime | feature | K-PUSH-001 |
| K-VURDERING-001 | Vurderingssystem — Stjerner & Aggregering | feature | K-CHAT-001 |
| K-RAPPORT-001 | KPI-rapportering — Admin Dashboard | feature | K-VURDERING-001 |
| K-DEKN-001 | Dekningsområde — Admin & Kart | feature | K-RAPPORT-001 |
| K-JOURNAL-EXT-001 | Ekstern Journal — Redirect til EPJ-system | feature | K-DEKN-001 |
| K-TILSYN-001 | Internkontroll & Statsforvalter-rapportering | governance | K-JOURNAL-EXT-001 |
| K-KPR-001 | KPR — Kommunalt Pasient- og Brukerregister | feature | K-TILSYN-001 |

---

## 🚫 BLOCKED

| ID | Title | Blocked reason |
|----|-------|----------------|
| K-AUTH-002 | Auth — Sykepleiere (Google Workspace @eiranova.no) | Avventer K-REFACTOR-001 (App Router / ingen prototype-import) og K-ROUTE-001 (Next.js middleware + routing-fundament). |
| K-ROUTE-001 | App Router middleware — auth-guards og rolle-ruting | Avventer K-REFACTOR-001: ekte App Router uten prototype-tab-navigasjon. Spesifikajon kan justeres etter refactor-landing. |
| K-BETALING-001 | Betaling — Vipps ePayment | Venter på EiraNova AS org.nr. (Lise). Vipps krever organisasjonsnummer for produksjonsintegrasjon. Kan settes opp i Vipps Merchant Test uten org.nr. |
| K-TRIPLETEX-001 | Tripletex — Regnskapsintegrasjon Master | Venter på EiraNova AS org.nr. for Tripletex-kontraktregistrering. Tripletex krever organisasjonsnummer. |
| K-JOURNAL-001 | Intern Journal — NHN-sertifisert Pasientjournal | Starter IKKE uten: (1) godkjent helserettsadvokat, (2) Statsforvalteren registrering bekreftet, (3) NHN-sertifisering fullført, (4) journalansvarlig utpekt. Alle fire er lovpåkrevt. |

---

## ✅ RECENTLY MERGED

| ID | Title | Merged |
|----|-------|--------|
| K-ENV-003 | Etabler tredelt deployment-modell — main = production, dev = staging, feature/* = preview | 2026-04-28 |
| K-ENV-002 | Env-guard & Middleware Hardening | 2026-04-26 |
| K-DB-002 | Prod-Supabase Migration & Production Environment Activation | 2026-04-26 |
| K-DB-001 | Supabase Databaseskjema — Komplett Fundament | 2026-04-25 |
| K-AUTH-001 | Auth — Kunder (e-post + passord) | 2026-04-25 |

→ [Komplett merge-historikk](./MERGED_HISTORY.md)

---

*Source: docs/contracts/CONTRACT_QUEUE.json*
*Process: docs/PROCESS.md*
