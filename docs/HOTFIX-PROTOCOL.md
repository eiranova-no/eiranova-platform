# Hotfix-protokoll — EiraNova

Brukes **kun** ved kritisk bug i produksjon.

---

## Severity-nivåer

| Level | Eksempel | Responstid |
|-------|----------|------------|
| SEV-1 | Auth-brudd, data-tap, helsedata eksponert, sikkerhetshull | Umiddelbart |
| SEV-2 | Funksjon utilgjengelig for alle brukere, betaling feiler | < 2 timer |
| SEV-3 | Visuell feil, ikke-kritisk bug, enkeltstående feil | Neste kontrakt |

---

## Workflow

```bash
git checkout main && git pull origin main
git checkout -b hotfix/BESKRIVELSE

# Gjør minimal fix
# Test lokalt

git add .
git commit -m "hotfix: BESKRIVELSE (SEV-X)"
git push origin hotfix/BESKRIVELSE

# Åpne PR direkte mot main (unntak fra normal feature → dev → main flyt)
# Tittel: "hotfix: BESKRIVELSE"
# Etter merge til main: cherry-pick til dev
git checkout dev
git cherry-pick <commit-hash>
git push origin dev

# Tag versjon
git tag -a v1.x.x -m "Hotfix: BESKRIVELSE"
git push origin v1.x.x

# Logg discovery
# Legg til D-XXX i docs/contracts/DISCOVERIES.json
```

---

## Post-hotfix

1. Legg til D-XXX i `docs/contracts/DISCOVERIES.json` med severity og beskrivelse
2. Kjør `pnpm generate-cc` hvis CONTRACT_QUEUE endret
3. Skriv incident-rapport i `docs/ops/incidents/INC-YYYY-MM-DD-BESKRIVELSE.md`

---

## Spesielt for helsedata (SEV-1)

Ved mistanke om helsedata-brudd:
1. Deaktiver berørt tjeneste umiddelbart (Vercel → Deployment protection)
2. Kontakt Datatilsynet innen 72 timer (GDPR art. 33)
3. Vurder om Statsforvalteren skal varsles
4. Dokumenter alt i incident-rapport

---

*EiraNova — AI Dev OS v1.1 · X Group AS / CoreX*
