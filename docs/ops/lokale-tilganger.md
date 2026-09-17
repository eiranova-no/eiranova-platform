# Lokale tilganger for Cursor og CLI

Én lokal nøkkelfil utenfor repoet, slik at Cursor og CLI-er kan kjøre migrasjoner, deploy og Supabase-kommandoer uten at noen limer inn nøkler i chatten.

## Oppsett på ny maskin (Lise / Jeanett / Richard)

1. Hent verdiene fra **selskapets passordhvelv** (ikke fra chat eller Slack):
   - **Supabase DB-URL:** Supabase → prosjekt → Connect → Session pooler (bruk URI). Tre verdier: oppstart (`jvhfelvwzsqkmewecvfz`), dev, prod.
   - **Supabase Access Token:** Supabase → Account → Access Tokens (for `supabase` CLI). Tokenet utløper årlig (neste fornyelse: **17. sep 2027**) — forny på [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens).
   - **Vercel Token:** Vercel → Settings → Tokens (valgfritt hvis `vercel login` allerede er gjort).
   - **Resend:** én nøkkel `eiranova-vercel`, sending-only, kun eiranova.no. Ved bytte: opprett ny, oppdater alle fire Vercel-prosjekter (`eiranova-marketing`, `eiranova-web`, `eiranova-nurse`, `eiranova-admin`), slett gammel.

2. Opprett filen:

```bash
mkdir -p ~/.config/eiranova
cat > ~/.config/eiranova/env << 'EOF'
# EiraNova – lokale tilganger. ALDRI kopier denne filen inn i repoet.
export SUPABASE_DB_URL_OPPSTART="postgresql://..."
export SUPABASE_DB_URL_DEV="postgresql://..."
export SUPABASE_DB_URL_PROD="postgresql://..."
export SUPABASE_ACCESS_TOKEN="sbp_..."
export VERCEL_TOKEN="..."
export RESEND_API_KEY="re_..."
EOF
chmod 600 ~/.config/eiranova/env
```

3. Last inn i shell (legg til i `~/.zshrc` hvis den ikke finnes):

```bash
[ -f ~/.config/eiranova/env ] && source ~/.config/eiranova/env
```

4. Test:

```bash
source ~/.config/eiranova/env && psql "$SUPABASE_DB_URL_OPPSTART" -c "select 1"
```

Forventet: `1` i én rad.

## Regler

- Filen ligger **utenfor** repoet (`~/.config/eiranova/env`). Aldri kopier den inn i prosjektet.
- Rettigheter skal være `600` (kun eier leser/skriver).
- Cursor henter nøkler herfra (`source ~/.config/eiranova/env`) før eksterne kall.
- Mot prod-database: alltid backup først og eksplisitt bekreftelse i dialogen.
- Resend-nøkkelverdier og andre hemmeligheter skal aldri i repo, commits, PR-tekst eller rapporter.
