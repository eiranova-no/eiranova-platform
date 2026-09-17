# Tilganger på ny maskin

1. Installer Cursor og logg inn. Installer 1Password og åpne hvelvet «EiraNova» (bes om tilgang fra Lise hvis du ikke ser det).
2. I Cursor: skriv «hent eiranova-platform» og deretter «Sett opp tilganger».
3. Cursor ber om seks nøkler, én om gangen, med samme navn som i 1Password. Kopier og lim inn.
4. Cursor sier «Ferdig». Det var alt.

**Årlig:** Supabase-tokenet utløper hvert år (neste: 17. september 2027). Lag nytt på supabase.com/dashboard/account/tokens med navn cursor-eiranova, samme innstillinger som sist, legg det i 1Password under «Supabase token (cursor-eiranova)», og skriv «Sett opp tilganger» i Cursor igjen – den bytter bare den ene.

**Hvis Cursor sier at noe mangler:** les hva den ber om. Nesten alltid er det at du ikke er lagt til i GitHub-organisasjonen ennå, eller at en oppføring i 1Password har feil navn.

*(For teknikere: verdiene lagres i ~/.config/eiranova/env, chmod 600. scripts/setup-local-env.sh gjør det samme uten Cursor.)*
