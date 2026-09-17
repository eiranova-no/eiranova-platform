#!/usr/bin/env bash
# For teknikere. Ikke-teknikere: bruk «Sett opp tilganger» i Cursor.
set -euo pipefail

ENV_DIR="${HOME}/.config/eiranova"
ENV_FILE="${ENV_DIR}/env"
ZSHRC="${HOME}/.zshrc"
SOURCE_LINE='[ -f ~/.config/eiranova/env ] && source ~/.config/eiranova/env'

ask() {
  local prompt="$1"
  local var
  printf '%s: ' "$prompt" >&2
  IFS= read -r var
  printf '%s' "$var"
}

echo "EiraNova – lokal tilgangsoppsett (tekniker-fallback)"
echo "Lim inn verdien for hver nøkkel (samme navn som i 1Password-hvelvet EiraNova)."
echo

OPPSTART="$(ask 'Supabase database – oppstart')"
DEV="$(ask 'Supabase database – dev')"
PROD="$(ask 'Supabase database – prod')"
SB_TOKEN="$(ask 'Supabase token (cursor-eiranova)')"
VERCEL="$(ask 'Vercel token (cursor-eiranova)')"
RESEND="$(ask 'Resend nøkkel (eiranova-vercel)')"

mkdir -p "$ENV_DIR"
umask 077
cat > "$ENV_FILE" <<EOF
# EiraNova – lokale tilganger. ALDRI kopier denne filen inn i repoet.
export SUPABASE_DB_URL_OPPSTART="${OPPSTART}"
export SUPABASE_DB_URL_DEV="${DEV}"
export SUPABASE_DB_URL_PROD="${PROD}"
export SUPABASE_ACCESS_TOKEN="${SB_TOKEN}"
export VERCEL_TOKEN="${VERCEL}"
export RESEND_API_KEY="${RESEND}"
EOF
chmod 600 "$ENV_FILE"

if [[ -f "$ZSHRC" ]] && grep -qF '~/.config/eiranova/env' "$ZSHRC"; then
  :
else
  printf '\n# EiraNova lokale tilganger\n%s\n' "$SOURCE_LINE" >> "$ZSHRC"
fi

# shellcheck disable=SC1090
source "$ENV_FILE"
export PATH="/opt/homebrew/opt/libpq/bin:${PATH}"

echo
echo "Verifiserer…"
ok=true

if command -v psql >/dev/null 2>&1; then
  if psql "$SUPABASE_DB_URL_OPPSTART" -c 'select 1' >/dev/null 2>&1; then
    echo "OK: database oppstart"
  else
    echo "Mangler: database oppstart (sjekk verdien)"
    ok=false
  fi
else
  echo "Mangler: psql er ikke installert (database-test hoppet over)"
  ok=false
fi

if gh auth status >/dev/null 2>&1; then
  echo "OK: GitHub"
else
  echo "Mangler: GitHub-innlogging"
  ok=false
fi

if vercel whoami --token "$VERCEL_TOKEN" >/dev/null 2>&1; then
  echo "OK: Vercel"
else
  echo "Mangler: Vercel-token"
  ok=false
fi

if SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" supabase projects list >/dev/null 2>&1; then
  echo "OK: Supabase"
else
  echo "Mangler: Supabase-token"
  ok=false
fi

echo
if $ok; then
  echo "Ferdig. Du trenger ikke gjøre dette igjen på denne maskinen."
else
  echo "Noe mangler — les meldingene over."
  exit 1
fi
