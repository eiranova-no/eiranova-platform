# For teknikere. Ikke-teknikere: bruk «Sett opp tilganger» i Cursor.
# Windows-parallell til scripts/setup-local-env.sh — samme nøkler, samme filformat.

$ErrorActionPreference = 'Stop'

$EnvDir = Join-Path $HOME '.config\eiranova'
$EnvFile = Join-Path $EnvDir 'env'

function Ask-Secret([string]$Prompt) {
  Write-Host -NoNewline "${Prompt}: "
  return (Read-Host)
}

function Import-EiraNovaEnv([string]$Path) {
  Get-Content -LiteralPath $Path | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq '' -or $line.StartsWith('#')) { return }
    if ($line -match '^export\s+([A-Za-z_][A-Za-z0-9_]*)="(.*)"\s*$') {
      Set-Item -Path "Env:$($Matches[1])" -Value $Matches[2]
    }
  }
}

Write-Host "EiraNova – lokal tilgangsoppsett (tekniker-fallback, Windows)"
Write-Host "Lim inn verdien for hver nøkkel (samme navn som i 1Password-hvelvet EiraNova)."
Write-Host ""

$oppstart = Ask-Secret 'Supabase database – oppstart'
$dev = Ask-Secret 'Supabase database – dev'
$prod = Ask-Secret 'Supabase database – prod'
$sbToken = Ask-Secret 'Supabase token (cursor-eiranova)'
$vercel = Ask-Secret 'Vercel token (cursor-eiranova)'
$resend = Ask-Secret 'Resend nøkkel (eiranova-vercel)'

New-Item -ItemType Directory -Force -Path $EnvDir | Out-Null

@"
# EiraNova – lokale tilganger. ALDRI kopier denne filen inn i repoet.
export SUPABASE_DB_URL_OPPSTART="$oppstart"
export SUPABASE_DB_URL_DEV="$dev"
export SUPABASE_DB_URL_PROD="$prod"
export SUPABASE_ACCESS_TOKEN="$sbToken"
export VERCEL_TOKEN="$vercel"
export RESEND_API_KEY="$resend"
"@ | Set-Content -LiteralPath $EnvFile -Encoding utf8

# Begrens lesing til eier (best-effort på NTFS)
try {
  icacls $EnvFile /inheritance:r /grant:r "$env:USERNAME:(R)" | Out-Null
} catch {
  # Ignorer hvis icacls ikke er tilgjengelig
}

$profilePath = $PROFILE
$profileDir = Split-Path -Parent $profilePath
if (-not (Test-Path -LiteralPath $profileDir)) {
  New-Item -ItemType Directory -Force -Path $profileDir | Out-Null
}
if (-not (Test-Path -LiteralPath $profilePath)) {
  New-Item -ItemType File -Force -Path $profilePath | Out-Null
}

$marker = 'EiraNova lokale tilganger'
$loader = @"

# $marker
if (Test-Path "`$HOME\.config\eiranova\env") {
  Get-Content "`$HOME\.config\eiranova\env" | ForEach-Object {
    `$line = `$_.Trim()
    if (`$line -eq '' -or `$line.StartsWith('#')) { return }
    if (`$line -match '^export\s+([A-Za-z_][A-Za-z0-9_]*)="(.*)"\s*$') {
      Set-Item -Path ("Env:" + `$Matches[1]) -Value `$Matches[2]
    }
  }
}
"@

$existing = Get-Content -LiteralPath $profilePath -Raw -ErrorAction SilentlyContinue
if ($null -eq $existing -or $existing -notmatch [regex]::Escape($marker)) {
  Add-Content -LiteralPath $profilePath -Value $loader
}

Import-EiraNovaEnv $EnvFile

Write-Host ""
Write-Host "Verifiserer…"
$ok = $true

if (Get-Command psql -ErrorAction SilentlyContinue) {
  & psql $env:SUPABASE_DB_URL_OPPSTART -c 'select 1' 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: database oppstart"
  } else {
    Write-Host "Mangler: database oppstart (sjekk verdien)"
    $ok = $false
  }
} else {
  Write-Host "Mangler: psql er ikke installert (database-test hoppet over)"
  $ok = $false
}

if (Get-Command gh -ErrorAction SilentlyContinue) {
  & gh auth status 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: GitHub"
  } else {
    Write-Host "Mangler: GitHub-innlogging"
    $ok = $false
  }
} else {
  Write-Host "Mangler: GitHub CLI (gh)"
  $ok = $false
}

if (Get-Command vercel -ErrorAction SilentlyContinue) {
  & vercel whoami --token $env:VERCEL_TOKEN 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: Vercel"
  } else {
    Write-Host "Mangler: Vercel-token"
    $ok = $false
  }
} else {
  Write-Host "Mangler: Vercel CLI"
  $ok = $false
}

if (Get-Command supabase -ErrorAction SilentlyContinue) {
  $env:SUPABASE_ACCESS_TOKEN = $env:SUPABASE_ACCESS_TOKEN
  & supabase projects list 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: Supabase"
  } else {
    Write-Host "Mangler: Supabase-token"
    $ok = $false
  }
} else {
  Write-Host "Mangler: Supabase CLI"
  $ok = $false
}

Write-Host ""
if ($ok) {
  Write-Host "Ferdig. Du trenger ikke gjøre dette igjen på denne maskinen."
} else {
  Write-Host "Noe mangler — les meldingene over."
  exit 1
}
