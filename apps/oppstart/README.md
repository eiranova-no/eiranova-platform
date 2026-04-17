# EiraNova Oppstart App

Standalone statisk app som viser EiraNova AS sin oppstartsplan og compliance-sjekkliste for manuell drift — mens hovedplattformen utvikles.

## Formål

- Gi jentene (Lise + medgründere) en konkret, kryssbar plan fra AS-registrering til første betalende kunde
- Dokumentere alle compliance-krav som må oppfylles før oppstart
- Lagre progresjon lokalt (localStorage) så fremdriften vises neste gang appen åpnes

## Deploy

Deployes uavhengig til Vercel — root directory: `apps/oppstart`
Ingen build-step. Ren statisk HTML.

## Tilgang

Passordbeskyttet via enkel prompt (intern bruk kun).
Passord settes i `index.html` — endre før produksjon.

## Vedlikehold

Sjekkliste-items kan oppdateres direkte i `index.html`. Progresjonen lagres per browser i `localStorage` under nøkkelen `eiranova-oppstart-v1`.
