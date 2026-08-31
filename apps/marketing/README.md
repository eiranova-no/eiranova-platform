# EiraNova Marketing App

Standalone marketing site for EiraNova.
Deployed independently to Vercel – root directory: `apps/marketing`.

## Innhold

- Statisk `index.html` (ingen build-step)
- Én serverless-funksjon: `api/contact.js` (kontaktskjema → Resend → `post@eiranova.no`)

## Routing

`vercel.json` rewriter alle stier til `index.html`, **unntatt** `/api/*`, slik at serverless-funksjoner ikke fanges av SPA-rewriten:

```json
{ "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }] }
```

## Miljøvariabler (Vercel → marketing-prosjektet)

Settes av Lise i Vercel. Ingen hemmeligheter i kode.

| Variabel | Verdi | Påkrevd |
|---|---|---|
| `RESEND_API_KEY` | API-nøkkel fra Resend | Ja |
| `CONTACT_TO` | `post@eiranova.no` | Nei (default) |
| `CONTACT_FROM` | `EiraNova nettside <post@eiranova.no>` | Nei (default) |

**Forutsetning:** Domenet `eiranova.no` må være verifisert i Resend for at `from` skal godtas. Er `RESEND_API_KEY` ikke satt, svarer API-et `503` og skjemaet viser e-postfallback — siden er trygg å deploye før Resend er klart.

## Lokal verifikasjon

```bash
cd apps/marketing
vercel dev
# POST uten nøkkel → 503
curl -s -X POST http://localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@example.com","msg":"Hei"}'
```
