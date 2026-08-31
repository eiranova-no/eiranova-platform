# EiraNova Marketing App

Standalone marketing site for EiraNova.
Deployed independently to Vercel – root directory: `apps/marketing`.
Prosjekt: `eiranova-marketing` (production branch: `main`).

## Produksjonsdomener

| Domene | Rolle |
|---|---|
| `https://eiranova.no` | Primær (apex) |
| `https://www.eiranova.no` | 308-redirect → apex |
| `https://eiranova-marketing.vercel.app` | Vercel-default (beholdes) |

### DNS-mønster (Domeneshop → Vercel)

| Type | Navn | Verdi |
|---|---|---|
| A | `@` | `216.150.1.1` |
| A | `@` | `216.150.16.1` |
| CNAME | `www` | `e060534b97b4d94b.vercel-dns-016.com` |

MX/TXT (Google Workspace) og subdomenene `app` / `nurse` / `admin` (samt staging) er fredet — ikke endre dem i dette prosjektet.

## Innhold

- Statisk `index.html` (ingen build-step)
- Én serverless-funksjon: `api/contact.js` (kontaktskjema → Resend → `post@eiranova.no`)

## Routing

`vercel.json` rewriter alle stier til `index.html`, **unntatt** `/api/*`, slik at serverless-funksjoner ikke fanges av SPA-rewriten:

```json
{ "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }] }
```

## Miljøvariabler (Vercel → marketing-prosjektet)

Ingen hemmeligheter i kode. Sett i Vercel Production:

| Variabel | Verdi | Påkrevd |
|---|---|---|
| `RESEND_API_KEY` | API-nøkkel fra Resend | Ja |
| `CONTACT_TO` | `post@eiranova.no` | Nei (default) |
| `CONTACT_FROM` | `EiraNova.no kontaktskjema <post@eiranova.no>` | Nei (default) |

**Forutsetning:** Domenet `eiranova.no` må være verifisert i Resend for at `from` skal godtas. Er `RESEND_API_KEY` ikke satt, svarer API-et `503` og skjemaet viser e-postfallback — siden er trygg å deploye før Resend er klart.

## Lokal verifikasjon

```bash
cd apps/marketing
# Verifiser at .vercel peker på eiranova-marketing før CLI-kommandoer
vercel whoami && cat .vercel/project.json
vercel dev
# POST uten nøkkel → 503
curl -s -X POST http://localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@example.com","msg":"Hei"}'
```

Produksjon deployes via push/merge til `main` (ikke `vercel deploy --prod`).
