# K-DNS-001 — Vercel CNAME-migrering til nye DNS-records

**Status:** ready
**Type:** infra
**Dependencies:** K-ENV-001 ✅
**Author:** Claude (Technical Architect)
**Implementer:** Richard (manuell DNS-endring i Domeneshop + Vercel-verifisering)

---

## Bakgrunn

Per 2026-04-27 viser alle tre EiraNova-domener "DNS Change Recommended" i Vercel-konsollen. Vercel utvider sine IP-områder og anbefaler å bytte fra det gamle delte targetet `cname.vercel-dns.com` (som peker på legacy-IP `76.76.21.21`) til prosjekt-spesifikke targets på `vercel-dns-017.com`-domenet.

Vercel bekrefter at de gamle records fortsetter å fungere ("will continue to work"), men det finnes ingen offentlig sunset-dato. Migreringen er derfor lavrisiko-vedlikehold som bør utføres mens plattformen ennå ikke er i produksjon, ikke under tidspress senere når Vercel eventuelt deprecater de gamle.

Observerte verdier (må reverifiseres ved utførelse, da Vercel kan endre target):

| Prosjekt | Subdomene | Nåværende CNAME | Ny CNAME (per 27.04) |
|----------|-----------|-----------------|----------------------|
| eiranova-web | `app.eiranova.no` | `cname.vercel-dns.com` | `3272f5e449460437.vercel-dns-017.com` |
| eiranova-nurse | `nurse.eiranova.no` | `cname.vercel-dns.com` | *(hentes fra Vercel)* |
| eiranova-admin | `admin.eiranova.no` | `cname.vercel-dns.com` | *(hentes fra Vercel)* |

## Mål

Fjerne "DNS Change Recommended"-varselet på alle tre Vercel-prosjekter og migrere til Vercels nye DNS-infrastruktur, slik at EiraNova ikke står med teknisk gjeld i DNS-laget når plattformen tas i produksjon.

## In Scope

- Oppdatere CNAME-record for `app.eiranova.no` i Domeneshop til ny target fra Vercel
- Oppdatere CNAME-record for `nurse.eiranova.no` i Domeneshop til ny target fra Vercel
- Oppdatere CNAME-record for `admin.eiranova.no` i Domeneshop til ny target fra Vercel
- Verifisere via `dig` at hver subdomene returnerer riktig CNAME etter propagering
- Klikke "Refresh" i Vercel for hver subdomene og bekrefte at varselet forsvinner
- Smoke-teste alle tre URL-er i incognito etter migrering
- Markere D-014 som resolved i `DISCOVERIES.json`

## Out of Scope

- Endringer i Vercel-konfigurasjon utover Refresh-knappen
- SSL-fornyelse (Vercel håndterer automatisk)
- Endringer i kode, env-vars eller Supabase-konfigurasjon
- Migrering av andre DNS-records enn de tre subdomenene (MX, TXT, SPF, DKIM beholdes urørt)
- Endring av apex-domenet `eiranova.no` (ikke koblet til Vercel)

## Deliverables

- Tre oppdaterte CNAME-records i Domeneshop
- Skjermbilde av Vercel Domains-siden for hvert prosjekt som viser "Valid Configuration" uten "DNS Change Recommended"-badge
- `DISCOVERIES.json` oppdatert: D-014 → status `resolved`
- `CONTRACT_QUEUE.json` oppdatert: K-DNS-001 → status `merged`
- `CONTROL_CENTER.md` regenerert via `pnpm generate-cc`

## Acceptance Criteria

- [ ] `dig app.eiranova.no CNAME +short` returnerer `*.vercel-dns-017.com.`
- [ ] `dig nurse.eiranova.no CNAME +short` returnerer `*.vercel-dns-017.com.`
- [ ] `dig admin.eiranova.no CNAME +short` returnerer `*.vercel-dns-017.com.`
- [ ] Vercel viser "Valid Configuration" uten "DNS Change Recommended" på alle tre prosjekter
- [ ] `https://app.eiranova.no` laster forsiden i incognito (200 OK)
- [ ] `https://nurse.eiranova.no` laster Google-pålogging i incognito (200 OK)
- [ ] `https://admin.eiranova.no` laster admin-pålogging i incognito (200 OK)
- [ ] Ingen EnvBadge synlig på noen av de tre produksjonsdomenene

## Definition of Done

- Alle akseptansekriterier oppfylt
- D-014 markert resolved
- K-DNS-001 → merged i `CONTRACT_QUEUE.json`
- `pnpm generate-cc` kjørt og endringer commitet

## Utførelsesplan

**Forutsetning:** Plattformen er IKKE i produksjon (ingen eksterne kunder). Utføres i et planlagt vindu, ikke ad-hoc.

**Rekkefølge:** `nurse` → `admin` → `app`. Begrunnelse: nurse har færrest brukere (intern Google Workspace), admin er internt verktøy, app er kundevendt og viktigst. Slik øves migreringen to ganger før det viktigste domenet røres.

**Per subdomene:**

1. Hent ny CNAME-target fra Vercel (Domains-siden, "DNS Change Recommended" → "Learn more")
2. Logg inn på Domeneshop → DNS for `eiranova.no`
3. Finn eksisterende CNAME-record (`nurse` / `admin` / `app`)
4. Endre Value fra `cname.vercel-dns.com.` til ny target (med punktum til slutt)
5. Lagre. Vent 5–10 min på propagering
6. Verifiser med `dig <subdomene> CNAME +short`
7. Klikk "Refresh" i Vercel → bekreft at "DNS Change Recommended" forsvinner
8. Smoke-test URL-en i incognito
9. Vent 10 min på observasjon før neste subdomene migreres

**Total tid:** 30–45 minutter for alle tre.

## Risks

- **DNS-propagering kan ta lengre enn forventet** (5 min typisk, opptil 30 min worst case). Mitigering: gjøres i et roligt tidsvindu, ikke under demo eller møte.
- **Feiltastet CNAME-target tar domenet ned.** Mitigering: copy-paste fra Vercel-dashboardet, ikke manuell skriving. Verifiser med `dig` før Refresh.
- **TTL på gammel record kan gjøre at noen klienter ser gammel CNAME en stund.** Mitigering: gamle records fungerer fortsatt per Vercels egen melding, så det er ingen reell nedetid.
- **Hvis nurse migreres uten problemer, men admin feiler:** rollback ved å sette CNAME tilbake til `cname.vercel-dns.com.` i Domeneshop. Vercel støtter begge targets samtidig, så ingen koordinert rollback nødvendig.

## References

- Vercel Domains-side for `eiranova-web`: https://vercel.com/eira-nova/eiranova-web/settings/domains
- Vercel Domains-side for `eiranova-nurse`: https://vercel.com/eira-nova/eiranova-nurse/settings/domains
- Vercel Domains-side for `eiranova-admin`: https://vercel.com/eira-nova/eiranova-admin/settings/domains
- Vercel-dokumentasjon på IP-utvidelse: lenke fra "Learn more" i Domains-siden
- Skjermbilde av varsel: tatt 2026-04-27 kl. 12:04 lokalt
- Forrige DNS-kontrakt: K-ENV-001 (initial Vercel-domenekobling, merged 2026-04-10)
