# Kom i gang fra null — fra tom maskin til endring i produksjon

*For Lise og Jeanett. Én sti, ett steg om gangen. Etter hvert steg står det hvordan du vet at du er ferdig, og hva du skriver til Claude hvis det ikke stemmer. Du trenger ikke forstå hvorfor — bare gjøre det som står. Regn med 2–3 timer første gang. Andre gang tar hele løpet 15 minutter.*

> **Én regel over alle andre:** Er du i tvil, spør Claude. Det er aldri feil å spørre, og det er alltid billigere enn å gjette. Under hvert steg står det nøyaktig hva du kan skrive.

---

## Steg 0 — Før du starter

Du trenger:
- En Mac eller en Windows-PC (bærbar er fint)
- Din @eiranova.no-e-post (Lise oppretter den i Google Workspace)
- Tilgang til passordhvelvet **«EiraNova»** i 1Password (Lise deler det med deg)
- Ca. 2 timer uten avbrytelser

**Du er ferdig når:** du kan logge inn på e-posten din på eiranova.no-adressen, og Lise har sagt at hvelvet er delt.

**Hvis noe mangler:** det er Lise som gir tilgangene. Send henne: «Jeg trenger @eiranova.no-e-post og tilgang til 1Password-hvelvet EiraNova.»

---

## Steg 1 — Installer tre programmer

### Mac
1. Åpne **Safari** og gå til `google.com/chrome` → Last ned Chrome → åpne filen → dra Chrome til Programmer.
2. Gå til `1password.com/downloads` → Last ned for Mac → installer → logg inn med kontoen Lise ga deg.
3. Gå til `cursor.com` → Download for Mac → åpne filen → dra Cursor til Programmer → åpne Cursor.

### Windows
1. Åpne **Edge** og gå til `google.com/chrome` → Last ned → kjør filen.
2. Gå til `1password.com/downloads` → Last ned for Windows → kjør filen → logg inn med kontoen Lise ga deg.
3. Gå til `cursor.com` → Download for Windows → kjør filen → åpne Cursor.

**Du er ferdig når:** Chrome, 1Password og Cursor er åpne på skjermen samtidig, og du ser hvelvet «EiraNova» i 1Password.

<!-- 📷 img/steg-1-1password.png: 1Password med hvelvet EiraNova synlig -->

**Hvis det ikke stemmer:** skriv til Claude i EiraNova-prosjektet: *«Jeg er på steg 1 i Kom i gang-guiden. Jeg har [Mac/PC], og [beskriv hva som skjer, eller lim inn skjermbilde]. Hva gjør jeg?»*

---

## Steg 2 — Kontoer

### 2a. Cursor
Første gang Cursor åpnes ber den deg logge inn. Velg **«Sign up»** → bruk @eiranova.no-adressen din → følg stegene. Abonnementet (Pro) betales av selskapet — Lise legger inn betalingskort første gang.

### 2b. GitHub (arkivet)
1. I Chrome: gå til `github.com` → **Sign up** → bruk @eiranova.no-adressen → velg et brukernavn (f.eks. `jeanett-eiranova`) → fullfør.
2. Send brukernavnet ditt til Lise. Hun legger deg til i organisasjonen `eiranova-no`. Du får en e-post med «Join» — trykk på den.

### 2c. Claude
I Chrome: gå til `claude.ai` → logg inn med selskapets Claude-konto (innlogging ligger i 1Password under «Claude EiraNova»). Øverst til venstre: velg prosjektet **«EiraNova»**. Det er her du skriver alle ønsker og spørsmål.

**Du er ferdig når:** du er logget inn i Cursor, du har trykket «Join» på GitHub-e-posten, og du ser prosjektet «EiraNova» i Claude.

<!-- 📷 img/steg-2-claude-prosjekt.png: Claude med EiraNova-prosjektet åpent -->

**Hvis det ikke stemmer:** *«Jeg er på steg 2 i Kom i gang-guiden. Jeg har laget GitHub-bruker, men [beskriv]. Hva gjør jeg?»*

---

## Steg 3 — Hent arkivet inn i Cursor

1. Åpne Cursor. Nederst er det et chatfelt.
2. Skriv nøyaktig: **hent eiranova-platform** — og trykk Enter.
3. Cursor spør kanskje om du vil klone («Clone»). Svar ja. Den kan be om bekreftelse på én eller to ting — les hva den sier, og svar ja hvis det handler om å hente arkivet.
4. Vent til Cursor sier at den er ferdig. Til venstre ser du nå mapper: `apps`, `docs`, `packages` …

**Du er ferdig når:** du ser mappen `docs` i venstre kolonne i Cursor, og kan klikke deg inn i `docs/pilot`.

<!-- 📷 img/steg-3-cursor-mapper.png: Cursor med mappene synlige til venstre -->

**Hvis det ikke stemmer:** *«Jeg er på steg 3 i Kom i gang-guiden. Jeg skrev «hent eiranova-platform» i Cursor, og fikk [lim inn det Cursor svarte]. Hva gjør jeg?»* — Den vanligste årsaken er at du ikke har trykket «Join» på GitHub-e-posten ennå.

---

## Steg 4 — Sett opp tilganger (gjøres én gang)

1. I Cursor-chatten, skriv nøyaktig: **Sett opp tilganger** — og trykk Enter.
2. Cursor sier: «Jeg trenger seks nøkler fra 1Password-hvelvet EiraNova. Jeg ber om én om gangen.»
3. Den ber om **«Supabase database – oppstart»**. Åpne 1Password → hvelvet EiraNova → finn oppføringen med nøyaktig det navnet → kopier passordfeltet → lim inn i Cursor → Enter.
4. Cursor sier «Lagret.» og ber om neste. Gjenta for alle seks. Navnene i Cursor og i 1Password er identiske — let etter samme navn.
5. Til slutt sier Cursor: **«Ferdig. Du trenger ikke gjøre dette igjen på denne maskinen.»**

**Du er ferdig når:** Cursor har sagt «Ferdig».

<!-- 📷 img/steg-4-ferdig.png: Cursor-chatten med «Ferdig»-meldingen -->

**Hvis det ikke stemmer:** Cursor forteller selv hva som mangler, i vanlig språk. Gjør det den sier. Er det fortsatt uklart: *«Jeg er på steg 4. Cursor sa: [lim inn]. Hva betyr det?»* — Vanligste årsak: en oppføring i 1Password heter ikke helt det samme som Cursor ber om. Da spør du Lise/Richard om å rette navnet i hvelvet.

---

## Steg 5 — Din første endring (øvelse, helt trygg)

Nå skal du gjøre hele løpet én gang, på en fil som ikke betyr noe for kunder. Det er poenget: du lærer sløyfen uten risiko.

### 5a. Hent fersk kopi av arkivet til Claude
1. I Chrome: gå til `github.com/eiranova-no/eiranova-platform`.
2. Øverst til venstre står det en knapp med et gren-symbol og teksten `main`. Trykk på den og velg **`dev`**.
3. Trykk den grønne knappen **«Code»** → **«Download ZIP»**. Filen havner i Nedlastinger.

<!-- 📷 img/steg-5a-github-zip.png: GitHub med dev valgt og Download ZIP -->

### 5b. Skriv ønsket til Claude
1. I Chrome: åpne Claude → prosjektet EiraNova → **ny samtale**.
2. Trykk på binders-ikonet (+) og last opp zip-filen fra Nedlastinger.
3. Lim inn dette (bytt ut navnet):

> ENDRINGSØNSKE
> 1. Overskrift: Skriv navnet mitt i øvelsesfilen.
> 2. Hvor: Arkivet, filen docs/pilot/ovelse.md.
> 3. I dag: Filen finnes (eller er tom).
> 4. Slik vil jeg ha det: Legg til linjen «[Ditt navn] gjorde sin første endring [dagens dato].»
> 5. For meg — øvelse i Kom i gang-guiden, steg 5.
> 6. Ikke endre: Ingenting annet.
> 7. Nå.
> 8. Henger sammen med: Kom i gang-guiden.
> 9. Vedlegg: zip.

4. Claude svarer med en **kontrakt** — en tekstboks som starter med «K-…». Les den. Den skal si at den legger til én linje i én fil.

**Du er ferdig med 5b når:** Claude har gitt deg en kontrakt som starter med K-.

**Hvis Claude stiller spørsmål i stedet:** svar på dem. Det er normalt.

### 5c. Gi kontrakten til Cursor
1. Kopier hele kontrakten fra Claude (marker alt i boksen → kopier).
2. Gå til Cursor → **ny chat** (plusstegn øverst i chatfeltet).
3. Lim inn kontrakten. Skriv under: **Følg kontrakten. Rapporter når PR til dev er opprettet.** → Enter.
4. Cursor jobber. Den kan spørre «Run command?» — les én linje av det den vil gjøre; handler det om filen, git eller PR, svar ja (trykk knappen «Run» / «Accept»).
5. Når Cursor er ferdig, skriver den en **rapport** med en lenke til «PR #…».

**Du er ferdig med 5c når:** Cursor har skrevet en rapport med en PR-lenke.

<!-- 📷 img/steg-5c-cursor-rapport.png: Cursor-rapport med PR-lenke -->

**Hvis Cursor stopper eller sier noe du ikke forstår:** kopier det Cursor skrev, gå tilbake til Claude-samtalen, og lim inn: *«Cursor svarte dette: [lim inn]. Hva gjør jeg?»*

### 5d. La Claude sjekke
1. Kopier hele rapporten fra Cursor.
2. Lim den inn i **samme** Claude-samtale som kontrakten kom fra.
3. Claude svarer «Kontrakten er oppfylt» — eller sier hva som mangler. Mangler noe: kopier det Claude sier, og gi det til Cursor.

**Du er ferdig med 5d når:** Claude har sagt at kontrakten er oppfylt.

### 5e. Godkjenn
1. Trykk på PR-lenken i Cursor-rapporten. GitHub åpnes i Chrome.
2. Trykk fanen **«Files changed»**. Du ser filen med linjen din i grønt. Det er alt som endres.
3. Gå tilbake til Cursor og skriv: **Godkjent. Fullfør kjeden til main.** → Enter.
4. Cursor sender endringen videre (dev → main) og rapporterer når det er gjort.

**Du er ferdig med 5e når:** Cursor sier at endringen er på main.

<!-- 📷 img/steg-5e-files-changed.png: GitHub «Files changed» med den grønne linjen -->

### 5f. Se resultatet
I Chrome: `github.com/eiranova-no/eiranova-platform/blob/main/docs/pilot/ovelse.md` — der står navnet ditt. **Du har gjort hele sløyfen.**

---

## Steg 6 — Din andre endring (ekte, på eiranova.no)

Samme sløyfe, men nå på noe kundene ser. Velg noe lite: en setning under «Hvem vi hjelper», eller en pris i pristabellen.

1. Ny zip (steg 5a) — alltid fersk kopi før hver endring.
2. Ny Claude-samtale, fyll ut endringsønske-malen (`docs/pilot/endringsonske-mal.md`) med den nøyaktige teksten du vil ha. Legg ved skjermbilde av slik det er i dag.
3. Kontrakt → Cursor → rapport → Claude sjekker (steg 5b–5d).
4. **Nytt i dette steget — forhåndsvisning:** i PR-en på GitHub, se under «Checks» etter **«Vercel – eiranova-marketing – Preview»** → trykk «Details» → nettsiden åpnes i en testversjon. Sjekk endringen der, på mobil og PC. Se at *bare* det du ba om er endret.
5. Riktig? «Godkjent. Fullfør kjeden til main.» — Feil? Beskriv det til Claude, som formulerer rettelsen.
6. Etter 2–3 minutter: åpne `eiranova.no`. Endringen er live.

<!-- 📷 img/steg-6-vercel-preview.png: Vercel Preview-lenken under Checks -->

**Du er ferdig når:** du ser din egen endring på eiranova.no.

---

## Steg 7 — Når noe stopper

| Det du ser | Det du skriver til Claude (i EiraNova-prosjektet) |
|---|---|
| Cursor sier «tilganger mangler» eller spør om nøkler | «Cursor ber om tilganger igjen. Jeg har gjort Sett opp tilganger før. Hva gjør jeg?» |
| Cursor stopper med rød feilmelding | «Cursor stoppet med denne meldingen: [lim inn]. Hva gjør jeg?» |
| PR-en på GitHub viser mer enn jeg ba om | «PR #[nr] endrer mer enn kontrakten sa. Her er Files changed: [skjermbilde]. Skal jeg godkjenne?» — Svaret er nesten alltid nei. |
| Forhåndsvisningen ser feil ut | «Forhåndsvisningen viser [beskriv/skjermbilde]. Slik ville jeg ha det: [tekst]. Kan du lage rettelsen til Cursor?» |
| eiranova.no er nede eller viser feil etter endring | Gå til `vercel.com` → prosjektet eiranova-marketing → **Instant Rollback**. Deretter til Claude: «Jeg rullet tilbake. Dette skjedde: [beskriv].» |
| Jeg vet ikke hva som er neste | I Cursor: «Hva er neste i køen?» — eller til Claude med zip: «Hva bør vi prioritere nå, og hvorfor?» |
| Jeg forstår ikke et ord i noe Claude eller Cursor skrev | «Forklar dette for en som ikke er tekniker: [lim inn]» |

---

## Steg 8 — Det du aldri gjør

- Aldri lim inn passord eller nøkler i Claude, i e-post eller i en fil. Cursor ber om dem én gang i steg 4 — og aldri mer.
- Aldri skriv helse-, person- eller eierforhold i kommentarer, filer eller kontrakter.
- Aldri godkjenn en PR du ikke har sett på i «Files changed».
- Aldri endre noe direkte på GitHub-siden («Edit file») — alt går via Cursor og PR.
- Aldri innlogging, betaling eller databasestruktur på egen hånd — det bestilles og kvalitetssikres (håndboken Del 6).

---

## Ordliste (bare det du møter i denne guiden)

- **Arkivet / repoet** — mappen med all kode og dokumentasjon, på GitHub og i Cursor.
- **Zip** — en nedlastet kopi av arkivet slik det er nå. Claude trenger den for å treffe.
- **Kontrakt** — Claudes presise bestilling til Cursor. Starter med K-.
- **PR** — Cursors forslag til endring. Du ser og godkjenner den på GitHub.
- **Preview / forhåndsvisning** — en testversjon av nettsiden med endringen, før den blir ekte.
- **main** — det som er live. **dev** — trinnet før. Endringer går alltid dev → main.

*Guiden vedlikeholdes i `docs/pilot/kom-i-gang-fra-null.md`. Snublet du et sted? Si det til Claude: «Steg X i guiden var uklart fordi …» — så blir guiden bedre for neste person.*
