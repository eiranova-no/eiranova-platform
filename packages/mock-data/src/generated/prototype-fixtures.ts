/**
 * AUTO-GENERATED — do not edit manually.
 * Regenerate: pnpm --filter @eiranova/mock-data generate
 * (equivalent: node scripts/extract-prototype-mock-data.mjs from repo root)
 * Source: apps/prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx
 * Drift check: pnpm verify:mock-data-generated (also runs in CI)
 */

import type {
  KundeFacingService,
  MockOrder,
  NurseProfileLike,
  OppdragEntry,
  TjenesteCatalogEntry,
} from "../types";

export const INIT_TJENESTER_CATALOG = [
  {id:"t1",kundeType:"morgensstell",navn:"Morgensstell & dusj",ikon:"🚿",kategori:"eldre",beskrivelse:"Stell i ro – den tiden det tar",pris:590,b2bPris:490,varighet:75,mva:"0%",mvaRisiko:"lav",aktiv:true,utfoertAv:["sykepleier","hjelpepleier"],opprettet:"2025-08-01",
    tagline:"En god start på dagen — med ro og verdighet",kundeInkluderer:["Dusj eller kroppsvask","Hjelp til påkledning","Hårstell og munnhygiene","Frokostforberedelse ved behov"],
    instruks:{
      kundeversjon:"Du mottar hjelp til morgenstell og dusj i ditt eget tempo. Sykepleieren er der for deg — ikke for å stresse deg. Du bestemmer rekkefølge og tempo. Stellet avsluttes når du er klar og komfortabel.",
      sykepleiersjon:"Gjennomfør fullt morgenstell inkl. dusj/vask, tannpuss, hårpleie og påkledning. Dokumenter hudtilstand ved avvik. Respekter brukerens tempo og selvbestemmelse. Bruk heis/hjelpemidler etter brukerens plan. Meld fra ved bekymringer i rapport.",
      inkluderer:["Dusj eller vask","Tannpuss","Hårpleie","Påkledning","Enkel frokosttilberedning"],
      inkludererIkke:["Rengjøring av bad","Klesvask","Matlaging utover enkel frokost"],
      endretAv:"Lise Andersen",endretDato:"2026-02-15",versjon:2
    }},
  {id:"t2",kundeType:"praktisk",navn:"Praktisk bistand",ikon:"🏠",kategori:"eldre",beskrivelse:"Rengjøring · Matlaging · Handling",pris:490,b2bPris:390,varighet:60,mva:"0%",mvaRisiko:"lav",aktiv:true,utfoertAv:["sykepleier","hjelpepleier"],opprettet:"2025-08-01",
    tagline:"Hverdagen på stell — så du kan bruke energien på det som betyr mest",
    kundeInkluderer:["Rengjøring og støvtørking","Klesvask og opprydding","Matlaging eller oppvarming","Handling ved behov"],
    instruks:{
      kundeversjon:"Vi hjelper deg med praktiske gjøremål i hjemmet — rengjøring, matlaging eller handling. Fortell oss hva som er viktigst for deg denne gangen. Vi er her for å gjøre hverdagen enklere.",
      sykepleiersjon:"Avtal med bruker hvilke oppgaver som prioriteres. Utfør rengjøring av kjøkken, bad og stue etter avtale. Matlaging: tilbered angitt måltid. Handling: bruk utlevert liste og kvitter for alle kjøp. Dokumenter utført arbeid i rapport.",
      inkluderer:["Rengjøring av angitte rom","Matlaging etter avtale","Handling med kvittering","Avfallshåndtering"],
      inkludererIkke:["Vindusvask","Hagearbeid","Større vask som gardiner"],
      endretAv:"Lise Andersen",endretDato:"2026-02-15",versjon:1
    }},
  {id:"t3",kundeType:"besok",navn:"Besøksvenn",ikon:"☕",kategori:"eldre",beskrivelse:"Samtale · Tur · Tilstedeværelse",pris:390,b2bPris:320,varighet:60,mva:"avklares",mvaRisiko:"høy",aktiv:true,utfoertAv:["hjelpepleier"],opprettet:"2025-08-01",
    tagline:"Godt selskap — en samtale, en kopp kaffe, en som er til stede",
    kundeInkluderer:["Sosialt samvær hjemme","Gåtur eller frisk luft sammen","Samtale og aktivitet","Tilstedeværelse og trygghet"],
    instruks:{
      kundeversjon:"En besøksvenn er en hyggelig person som kommer for å snakke, gå en tur eller bare være tilstede. Dette er din tid — dere gjør det du har lyst til innenfor timen. Det kreves ikke at du gjør noe bestemt.",
      sykepleiersjon:"Vær til stede, lyttende og engasjert. Følg brukerens ønsker for timen — samtale, tur eller aktivitet. Ikke utfør helsefaglige oppgaver under besøksvenn-tjenesten. Observér brukerens velvære og meld fra ved bekymringer. Dokumenter timen kort i rapport.",
      inkluderer:["Samtale og sosialt samvær","Kortere tur i nærområdet","Lesing/aktivitet etter ønske","Kaffeselskap"],
      inkludererIkke:["Helsefaglig pleie","Handling","Rengjøring","Transport med bil"],
      endretAv:"Lise Andersen",endretDato:"2026-03-01",versjon:1
    }},
  {id:"t4",kundeType:"transport",navn:"Transport & ærender",ikon:"🚗",kategori:"eldre",beskrivelse:"Lege · Butikk · Gravlund",pris:490,b2bPris:390,varighet:90,mva:"avklares",mvaRisiko:"medium",aktiv:true,utfoertAv:["hjelpepleier"],opprettet:"2025-08-01",instruks:null,
    tagline:"Kom deg dit du skal — trygt og uten stress",kundeInkluderer:["Kjøring til lege, butikk eller apotek","Følge til avtaler","Hjelp med handling","Assistanse inn og ut av bil"]},
  {id:"t5",kundeType:"avlastning",navn:"Avlastning pårørende",ikon:"🤝",kategori:"eldre",beskrivelse:"Tilsyn · Trygghet",pris:490,b2bPris:390,varighet:60,mva:"avklares",mvaRisiko:"medium",aktiv:true,utfoertAv:["sykepleier","hjelpepleier"],opprettet:"2025-08-01",instruks:null,
    tagline:"Pusterom for deg som stiller opp — vi tar over mens du lader batteriene",kundeInkluderer:["Tilsyn og omsorg for din nærstående","Sosialt samvær og aktivitet","Enkel praktisk hjelp","Trygg og kjent sykepleier"]},
  {id:"t6",kundeType:"ringetilsyn",navn:"Ringetilsyn",ikon:"📞",kategori:"eldre",beskrivelse:"Oppfølging og påminnelser",pris:190,b2bPris:150,varighet:15,mva:"0%",mvaRisiko:"lav",aktiv:true,utfoertAv:["hjelpepleier"],opprettet:"2025-08-01",instruks:null,
    tagline:"En stemme som sjekker at alt er bra — hver dag, til fast tid",kundeInkluderer:["Daglig telefonsamtale til avtalt tid","Sjekk av dagsform og velvære","Påminnelse om medisiner ved behov","Rapport til pårørende ved ønske"]},
  {id:"t7",kundeType:"barsel_bistand",navn:"Barselstøtte Praktisk bistand",ikon:"🍼",kategori:"barsel",beskrivelse:"Praktisk hjelp i hjemmet",pris:490,b2bPris:null,varighet:60,mva:"0%",mvaRisiko:"lav",aktiv:true,utfoertAv:["sykepleier"],opprettet:"2025-09-01",instruks:null,
    tagline:"Hjelp i hjemmet når nyfødt-livet er nytt og krevende",kundeInkluderer:["Rengjøring og klesvask","Matlaging og oppvask","Handling og ærender","Støtte til hverdagsmestring"]},
  {id:"t8",kundeType:"barsel_tur",navn:"Barselstøtte Trilleturer",ikon:"🍃",kategori:"barsel",beskrivelse:"Trilleturer og avlastning",pris:390,b2bPris:null,varighet:60,mva:"avklares",mvaRisiko:"høy",aktiv:true,utfoertAv:["hjelpepleier"],opprettet:"2025-09-01",instruks:null,
    tagline:"Frisk luft og en ekstra hånd — for deg og din nyfødte",kundeInkluderer:["Tur med barnevogn i nærområdet","Selskap og samtale underveis","Trygghet for nye foreldre","Tilpasset tempo og rute"]},
  {id:"t9",kundeType:"barsel_samtale",navn:"Barselstøtte Samtale & støtte",ikon:"💬",kategori:"barsel",beskrivelse:"Samtale og støtte",pris:390,b2bPris:null,varighet:60,mva:"avklares",mvaRisiko:"medium",aktiv:true,utfoertAv:["sykepleier"],opprettet:"2025-09-01",instruks:null,
    tagline:"Noen å snakke med — uten å måtte ha alt under kontroll",kundeInkluderer:["Lyttende samtale om barseltiden","Støtte ved bekymringer og usikkerhet","Veiledning fra erfaren sykepleier","Ingen journalføring — bare nærvær"]},
];

export const ORDERS = [
  {id:"ORD-0091",service:"🚿 Morgensstell",customer:"Astrid Hansen",nurse:"Sara L.",time:"08:00",status:"completed",paid:true,amount:590,cat:"eldre",date:"Man 3. mars",betaltVia:"vipps",oppdragId:"1"},
  {id:"ORD-0092",service:"🏠 Praktisk bistand",customer:"Olaf Eriksen",nurse:"Sara L.",time:"10:30",status:"active",paid:true,amount:390,cat:"eldre",date:"Man 3. mars",betaltVia:"b2b",b2bOrg:"Moss Kommune",b2bUserId:"u2",oppdragId:"2"},
  {id:"ORD-0093",service:"📞 Ringetilsyn",customer:"Kari Olsen",nurse:"Maria K.",time:"13:00",status:"assigned",paid:true,amount:190,cat:"eldre",date:"Man 3. mars",betaltVia:"b2b",b2bOrg:"Moss Kommune",b2bUserId:"u3",oppdragId:"3"},
  {id:"ORD-0094",service:"🍃 Trilleturer",customer:"Line Bakke",nurse:"—",time:"15:30",status:"pending",paid:false,amount:390,cat:"barsel",date:"Man 3. mars",betaltVia:"vipps",oppdragId:"4"},
  {id:"ORD-0095",service:"☕ Besøksvenn",customer:"Ingrid Dahl",nurse:"—",time:"17:00",status:"confirmed",paid:false,amount:390,cat:"eldre",date:"Man 3. mars",betaltVia:"vipps",startIso:"2026-03-03T17:00:00+01:00"},
  {id:"ORD-0096",service:"🚿 Morgensstell",customer:"Astrid Hansen",nurse:"Sara L.",time:"08:00",status:"completed",paid:true,amount:490,cat:"eldre",date:"Fre 28. feb",betaltVia:"b2b",b2bOrg:"Moss Kommune",b2bUserId:"u1",startIso:"2026-02-28T08:00:00+01:00"},
  {id:"ORD-0097",service:"🏠 Praktisk bistand",customer:"Astrid Hansen",nurse:"Sara L.",time:"11:00",status:"completed",paid:true,amount:390,cat:"eldre",date:"Tor 27. feb",betaltVia:"b2b",b2bOrg:"Moss Kommune",b2bUserId:"u1",startIso:"2026-02-27T11:00:00+01:00"},
  {id:"ORD-0098",service:"📞 Ringetilsyn",customer:"Olaf Eriksen",nurse:"Maria K.",time:"13:00",status:"completed",paid:true,amount:190,cat:"eldre",date:"Ons 26. feb",betaltVia:"b2b",b2bOrg:"Moss Kommune",b2bUserId:"u2",startIso:"2026-02-26T13:00:00+01:00"},
  {id:"ORD-0099",service:"🏠 Praktisk bistand",customer:"Else Moen",nurse:"Anne S.",time:"09:00",status:"completed",paid:true,amount:490,cat:"eldre",date:"Man 3. mars",betaltVia:"b2b",b2bOrg:"Parkveien Borettslag",b2bUserId:"u4",startIso:"2026-03-03T09:00:00+01:00"},
  {id:"ORD-0100",service:"🚗 Transport & ærender",customer:"Harald Dahl",nurse:"Lars B.",time:"14:00",status:"completed",paid:true,amount:490,cat:"eldre",date:"Fre 28. feb",betaltVia:"b2b",b2bOrg:"Parkveien Borettslag",b2bUserId:"u5",startIso:"2026-02-28T14:00:00+01:00"},
  {id:"ORD-0101",service:"☕ Besøksvenn",customer:"Per Nilsen",nurse:"—",time:"12:00",status:"no_show",paid:true,amount:390,cat:"eldre",date:"Tor 27. feb",betaltVia:"vipps",startIso:"2026-02-27T12:00:00+01:00"},
  {id:"ORD-0102",service:"🚿 Morgensstell",customer:"Astrid Hansen",nurse:"Sara L.",time:"09:00",status:"confirmed",paid:true,amount:590,cat:"eldre",date:"Tir 4. mars",betaltVia:"vipps",oppdragId:"5"},
  {id:"ORD-0103",service:"🍃 Trilleturer",customer:"Line Bakke",nurse:"Maria K.",time:"10:00",status:"confirmed",paid:true,amount:390,cat:"barsel",date:"Ons 6. mars",betaltVia:"vipps",oppdragId:"6"},
];

export const NURSES = [
  {name:"Sara Lindgren",status:"on_assignment",current:"Olaf Eriksen · Praktisk",av:"SL",
   tittel:"Autorisert sykepleier",erfaring:"8 år",
   bio:"Spesialisert i stell av eldre og demensomsorg. Kjent for ro, tålmodighet og god humor.",
   spesialitet:["Eldre","Demens","Morgensstell"],
   språk:["Norsk","Svensk"],rating:4.9,antallOppdrag:312,
   sertifisert:true,omrade:"Moss / Rygge"},
  {name:"Maria Kristiansen",status:"available",current:"Ledig · Neste: 13:00",av:"MK",
   tittel:"Hjelpepleier",erfaring:"5 år",
   bio:"Erfaren med hjemmepleie for både eldre og barselkvinner. Varm og omsorgsfull tilnærming.",
   spesialitet:["Eldre","Barsel","Praktisk bistand"],
   språk:["Norsk"],rating:4.8,antallOppdrag:198,
   sertifisert:true,omrade:"Moss / Vestby"},
  {name:"Anne Sørensen",status:"on_assignment",current:"Else Moen · Morgensstell",av:"AS",
   tittel:"Autorisert sykepleier",erfaring:"12 år",
   bio:"Lang erfaring fra sykehus og hjemmetjeneste. Trygg og grundig med stell og medisinering.",
   spesialitet:["Eldre","Medisin","Rehabilitering"],
   språk:["Norsk","Engelsk"],rating:5.0,antallOppdrag:501,
   sertifisert:true,omrade:"Sarpsborg / Fredrikstad"},
  {name:"Lars Bakken",status:"break",current:"Pause – tilbake 11:30",av:"LB",
   tittel:"Hjelpepleier",erfaring:"3 år",
   bio:"Engasjert og pålitelig. Spesielt god på praktisk bistand og transport til avtaler.",
   spesialitet:["Praktisk bistand","Transport","Avlastning"],
   språk:["Norsk"],rating:4.7,antallOppdrag:89,
   sertifisert:true,omrade:"Moss / Råde"},
];

export const OPPDRAG = [
  {id:"1",time:"08:00",date:"Man 3. mars",customer:"Astrid Hansen",phone:"415 22 334",address:"Konggata 12, Moss",service:"Morgensstell",icon:"🚿",cat:"eldre",status:"completed",nurse:"Sara Lindgren",amount:590,betaltVia:"vipps",opprettet:"2026-02-28",startIso:"2026-03-03T08:00:00+01:00",endringer:[
    {dato:"2026-02-28 09:12",av:"Astrid Hansen (kunde)",handling:"Bestilling opprettet",arsak:null},
  ]},
  {id:"2",time:"10:30",date:"Man 3. mars",customer:"Olaf Eriksen",phone:"922 11 445",address:"Storgata 45, Moss",service:"Praktisk bistand",icon:"🏠",cat:"eldre",status:"active",nurse:"Sara Lindgren",amount:390,betaltVia:"b2b",opprettet:"2026-02-27",startIso:"2026-03-03T10:30:00+01:00",endringer:[
    {dato:"2026-02-27 14:00",av:"Koordinator (Moss Kommune)",handling:"Bestilling opprettet",arsak:null},
    {dato:"2026-03-01 08:30",av:"Vi (admin)",handling:"Sykepleier endret: Maria K. → Sara L.",arsak:"Maria K. meldte seg syk"},
  ]},
  {id:"3",time:"13:00",date:"Man 3. mars",customer:"Kari Olsen",phone:"918 77 221",address:"Nygata 8, Moss",service:"Ringetilsyn",icon:"📞",cat:"eldre",status:"upcoming",nurse:"Anne Sørensen",amount:190,betaltVia:"b2b",opprettet:"2026-02-25",startIso:"2026-03-03T13:00:00+01:00",endringer:[
    {dato:"2026-02-25 11:00",av:"Koordinator (Moss Kommune)",handling:"Bestilling opprettet",arsak:null},
  ]},
  {id:"4",time:"15:30",date:"Man 3. mars",customer:"Line Bakke",phone:"476 33 118",address:"Parkveien 3, Moss",service:"Trilleturer",icon:"🍃",cat:"barsel",status:"upcoming",nurse:"Maria Kristiansen",amount:390,betaltVia:"vipps",opprettet:"2026-03-01",startIso:"2026-03-03T15:30:00+01:00",endringer:[
    {dato:"2026-03-01 16:45",av:"Line Bakke (kunde)",handling:"Bestilling opprettet",arsak:null},
  ]},
  {id:"5",time:"09:00",date:"Tir 4. mars",customer:"Astrid Hansen",phone:"415 22 334",address:"Konggata 12, Moss",service:"Morgensstell",icon:"🚿",cat:"eldre",status:"upcoming",nurse:"Sara Lindgren",amount:590,betaltVia:"vipps",opprettet:"2026-02-28",startIso:"2026-03-04T09:00:00+01:00",endringer:[
    {dato:"2026-02-28 09:12",av:"Astrid Hansen (kunde)",handling:"Bestilling opprettet",arsak:null},
    {dato:"2026-03-02 17:00",av:"Astrid Hansen (kunde)",handling:"Tid endret: 08:00 → 09:00",arsak:"Lege-avtale om morgenen"},
  ]},
  {id:"6",time:"10:00",date:"Ons 6. mars",customer:"Line Bakke",phone:"476 33 118",address:"Parkveien 3, Moss",service:"Trilleturer",icon:"🍃",cat:"barsel",status:"upcoming",nurse:"Maria Kristiansen",amount:390,betaltVia:"vipps",opprettet:"2026-03-02",startIso:"2026-03-06T10:00:00+01:00",endringer:[
    {dato:"2026-03-02 14:20",av:"Line Bakke (kunde)",handling:"Bestilling opprettet",arsak:null},
  ]},
];

export const CHAT = [
  {from:"nurse",text:"Hei! Jeg er på vei, ankommer om ca. 10 min.",time:"10:18"},
  {from:"customer",text:"Tusen takk! Jeg er hjemme 😊",time:"10:19"},
  {from:"nurse",text:"Perfekt, ses snart!",time:"10:20"},
];

export const B2B_C = [
  {id:"1",name:"Moss Kommune",type:"kommune",org:"959159548",contact:"post@moss.kommune.no",payDays:30,peppol:true,outstanding:24750,
   prismodell:"rammeavtale",
   rammePriser:{morgensstell:490,praktisk:390,ringetilsyn:150,besok:320,transport:390},
   brukere:[
     {id:"u1",name:"Astrid Hansen",dob:"1942",adresse:"Konggata 12",tjenester:["morgensstell","praktisk"],aktiv:true},
     {id:"u2",name:"Olaf Eriksen",dob:"1938",adresse:"Storgata 45",tjenester:["praktisk","ringetilsyn"],aktiv:true},
     {id:"u3",name:"Kari Olsen",dob:"1950",adresse:"Nygata 8",tjenester:["ringetilsyn"],aktiv:false},
   ]},
  {id:"2",name:"Parkveien Borettslag",type:"borettslag",org:"923456781",contact:"styret@parkveien.no",payDays:14,peppol:false,outstanding:0,
   prismodell:"per_bestilling",
   rammePriser:null,
   brukere:[
     {id:"u4",name:"Else Moen",dob:"1945",adresse:"Parkveien 3",tjenester:["morgensstell"],aktiv:true},
     {id:"u5",name:"Harald Dahl",dob:"1948",adresse:"Parkveien 7",tjenester:["besok","transport"],aktiv:true},
   ]},
  {id:"3",name:"Østfold Hjemmetjenester AS",type:"bedrift",org:"912345678",contact:"regnskap@oht.no",payDays:14,peppol:true,outstanding:8490,
   prismodell:"maanedspakke",
   maanedsPris:12000,
   timerInkludert:40,
   timerBrukt:31,
   brukere:[
     {id:"u6",name:"Ingrid Bakken",dob:"1955",adresse:"Osloveien 2",tjenester:["praktisk","avlastning"],aktiv:true},
   ]},
];

export const B2B_INV = [
  {id:"EIR-2026-0042",customer:"Moss Kommune",amount:18750,due:"2026-04-02",status:"sent",ehf:true},
  {id:"EIR-2026-0041",customer:"Parkveien Borettslag",amount:6000,due:"2026-03-25",status:"overdue",ehf:false},
  {id:"EIR-2026-0040",customer:"Moss Kommune",amount:12500,due:"2026-03-15",status:"paid",ehf:true},
];

export const MOCK_B2B_HENVENDELSER = [
  {id:"bh1",navn:"Kari Nordmann",organisasjon:"Råde kommune",epost:"kari.nordmann@rade.kommune.no",telefon:"+47 900 11 223",antallBrukere:12,tidspunkt:"2026-04-06 14"},
  {id:"bh2",navn:"Per Hansen",organisasjon:"Soleng Borettslag",epost:"per.hansen@soleng.no",telefon:"901 55 882",antallBrukere:8,tidspunkt:"2026-04-05 09"},
  {id:"bh3",navn:"Linnea Berg",organisasjon:"Østfold Omsorg AS",epost:"linnea@oostfoldomsorg.no",telefon:"+47999 00 441",antallBrukere:45,tidspunkt:"2026-04-03 16"},
];

export const VIPPS_P = [
  {id:"VP-20260303",date:"2026-03-03",amount:4720,status:"settled",orders:8},
  {id:"VP-20260304",date:"2026-03-04",amount:2940,status:"settled",orders:5},
  {id:"VP-20260305",date:"2026-03-05",amount:6380,status:"pending",orders:11},
];

export const STRIPE_P = [
  {id:"po_3Ox1234",date:"2026-03-01",amount:3490,status:"paid",arrival:"2026-03-03"},
  {id:"po_3Ox5678",date:"2026-03-03",amount:1960,status:"paid",arrival:"2026-03-05"},
  {id:"po_3Ox9012",date:"2026-03-05",amount:2450,status:"in_transit",arrival:"2026-03-07"},
];

export const WH = [
  {event:"Betaling mottatt",ref:"ORD-0092",time:"10:31",status:"ok",method:"vipps"},
  {event:"Kortbetaling fullført",ref:"ORD-0091",time:"08:01",status:"ok",method:"stripe"},
  {event:"Betaling mislyktes",ref:"ORD-0088",time:"09:14",status:"error",method:"vipps"},
  {event:"Utbetaling til konto",ref:"po_3Ox5678",time:"06:00",status:"ok",method:"stripe"},
];

export const INIT_STAFF = [
  {id:"1",name:"Lise Andersen",    email:"lise@eiranova.no",   role:"admin",           scope:"intern",  googleWs:true, created:"2026-01-15"},
  {id:"2",name:"Sara Lindgren",    email:"sara@eiranova.no",   role:"sykepleier",      scope:"intern",  googleWs:true, created:"2026-01-20"},
  {id:"3",name:"Maria Kristiansen",email:"maria@eiranova.no",  role:"sykepleier",      scope:"intern",  googleWs:true, created:"2026-02-01"},
  {id:"4",name:"Anne Sørensen",    email:"anne@eiranova.no",   role:"sykepleier",      scope:"intern",  googleWs:true, created:"2026-02-10"},
  {id:"5",name:"Lars Bakken",      email:"lars@eiranova.no",   role:"hjelpepleier",    scope:"intern",  googleWs:true, created:"2026-02-15"},
  {id:"6",name:"Ingrid Moe",       email:"ingrid@eiranova.no", role:"koordinator",     scope:"intern",  googleWs:false,created:"2026-03-01"},
];

export const INIT_B2B_TILGANGER = [
  {id:"t1",kundeId:"1",kundeName:"Moss Kommune",
   kontaktperson:{name:"Kari Johnsen",email:"post@moss.kommune.no",godkjentAv:true},
   koordinatorer:[
     {id:"k1",name:"Bjørn Haugen",  email:"bjorn.haugen@moss.kommune.no",  rolle:"b2b_koordinator",
      status:"aktiv",  domeneOK:true,  invitasjonsStatus:"aktivert",
      godkjentAvKontakt:true, godkjentDato:"2026-01-20", gittTilgangAv:"Lise Andersen",
      revisjon:[
        {dato:"2026-01-20",handling:"Tilgang gitt",av:"Lise Andersen"},
        {dato:"2026-01-20",handling:"Godkjent av kontaktperson",av:"Kari Johnsen"},
        {dato:"2026-01-20",handling:"Konto aktivert",av:"Bjørn Haugen"},
      ]},
     {id:"k2",name:"Trude Nilsen",  email:"trude.nilsen@moss.kommune.no",  rolle:"b2b_koordinator",
      status:"aktiv",  domeneOK:true,  invitasjonsStatus:"aktivert",
      godkjentAvKontakt:true, godkjentDato:"2026-02-01", gittTilgangAv:"Lise Andersen",
      revisjon:[
        {dato:"2026-02-01",handling:"Tilgang gitt",av:"Lise Andersen"},
        {dato:"2026-02-01",handling:"Godkjent av kontaktperson",av:"Kari Johnsen"},
        {dato:"2026-02-01",handling:"Konto aktivert",av:"Trude Nilsen"},
      ]},
   ],
   hvitelisteDomener:["moss.kommune.no"],
   pending:[
     {id:"p1",email:"ny.koordinator@moss.kommune.no",
      steg:"venter_kontaktgodkjenning", // steg: invitert | venter_kontaktgodkjenning | venter_aktivering | aktivert
      invitasjonsDate:"2026-03-05",gittTilgangAv:"Lise Andersen"},
   ],
  },
  {id:"t2",kundeId:"2",kundeName:"Parkveien Borettslag",
   kontaktperson:{name:"Styret v/ Hans Mo",email:"styret@parkveien.no",godkjentAv:true},
   koordinatorer:[
     {id:"k3",name:"Knut Larsen",   email:"knut@parkveienborettslag.no",   rolle:"b2b_koordinator",
      status:"aktiv",  domeneOK:false, invitasjonsStatus:"aktivert",
      godkjentAvKontakt:true, godkjentDato:"2026-02-10", gittTilgangAv:"Lise Andersen",
      revisjon:[
        {dato:"2026-02-10",handling:"Tilgang gitt",av:"Lise Andersen"},
        {dato:"2026-02-10",handling:"Godkjent av kontaktperson",av:"Styret v/ Hans Mo"},
        {dato:"2026-02-11",handling:"Konto aktivert",av:"Knut Larsen"},
      ]},
   ],
   hvitelisteDomener:[],
   pending:[],
  },
  {id:"t3",kundeId:"3",kundeName:"Østfold Hjemmetjenester AS",
   kontaktperson:{name:"Regnskap / Silje Berg",email:"regnskap@oht.no",godkjentAv:false},
   koordinatorer:[],
   hvitelisteDomener:["oht.no"],
   pending:[
     {id:"p2",email:"silje.berg@oht.no",
      steg:"venter_aktivering",
      invitasjonsDate:"2026-03-10",gittTilgangAv:"Lise Andersen"},
   ],
  },
];

export const INIT_AVTALEMODELLER = [
  {id:"rammeavtale",   label:"Rammeavtale",      ikon:"📋",farge:"#2563EB",      beskrivelse:"Fast pris per tjenestetype. Faktura samles og sendes månedlig.",
   felt:[{key:"rammePriser",label:"Priser per tjenestetype",type:"tjenestePriser"}],
   fakturaType:"maanedlig",fakturadag:1,betalingsfrist:30,aktiv:true,systemModell:true},
  {id:"per_bestilling",label:"Per bestilling",   ikon:"🛒",farge:"#7A8E85",     beskrivelse:"Listepris per bestilling. Faktura genereres automatisk ved hver bestilling.",
   felt:[],
   fakturaType:"per_oppdrag",fakturadag:null,betalingsfrist:14,aktiv:true,systemModell:true},
  {id:"maanedspakke",  label:"Månedspakke",      ikon:"🗓️",farge:"#6D28D9",  beskrivelse:"Fast månedspris inkl. X timer. Overskridelse faktureres separat.",
   felt:[{key:"maanedsPris",label:"Fast månedspris (kr)",type:"tall"},{key:"timerInkludert",label:"Timer inkludert",type:"tall"}],
   fakturaType:"maanedlig",fakturadag:1,betalingsfrist:30,aktiv:true,systemModell:true},
  {id:"timebasert",    label:"Timebasert",        ikon:"⏱️",farge:"#0891B2",  beskrivelse:"Betaling per faktisk time. Faktura med timelogg sendes månedlig.",
   felt:[{key:"timepris",label:"Timepris (kr/t)",type:"tall"}],
   fakturaType:"maanedlig",fakturadag:1,betalingsfrist:30,aktiv:true,systemModell:false},
  {id:"abonnement",    label:"Abonnement",        ikon:"🔄",farge:"#BE185D",  beskrivelse:"Fast månedspris for et sett tjenester. Fornyes automatisk.",
   felt:[{key:"aboPris",label:"Månedspris (kr)",type:"tall"},{key:"aboTjenester",label:"Inkluderte tjenester",type:"tekst"}],
   fakturaType:"maanedlig",fakturadag:1,betalingsfrist:14,aktiv:true,systemModell:false},
  {id:"prosjekt",      label:"Prosjektbasert",    ikon:"🎯",farge:"#7C3AED",  beskrivelse:"Fast pris for en definert periode/prosjekt. Engangsavtale.",
   felt:[{key:"prosjektPris",label:"Totalbeløp (kr)",type:"tall"},{key:"prosjektPeriode",label:"Periode",type:"tekst"}],
   fakturaType:"engang",fakturadag:null,betalingsfrist:14,aktiv:true,systemModell:false},
];

export const INIT_VIKARER = [
  {id:"v1",navn:"Kaja Strand",av:"KS",tittel:"Sykepleier",hpr:"7123456",enk:true,enkOrg:"Kaja Strand ENK",rating:4.8,oppdrag:34,telefon:"416 88 221",epost:"kaja.strand@gmail.com",kontonr:"1503.22.11111",
   tjenester:["morgensstell","praktisk","barsel_praktisk"],omrade:["Moss","Rygge"],
   tilgjengelig:true,varsel:"push",responstid:"< 30 min",
   sertifisert:true,godkjent:true,godkjentDato:"2026-01-10",
   evaluering:"Meget pålitelig. Pasientene er svært fornøyde.",
   status:"aktiv"},
  {id:"v2",navn:"Thomas Vik",av:"TV",tittel:"Hjelpepleier",hpr:"8234567",enk:true,enkOrg:"Thomas Vik ENK",rating:4.6,oppdrag:18,telefon:"922 44 551",epost:"thomas.vik@gmail.com",kontonr:"1503.33.22222",
   tjenester:["praktisk","besok","transport","ringetilsyn"],omrade:["Moss","Vestby","Ås"],
   tilgjengelig:true,varsel:"sms",responstid:"< 1 time",
   sertifisert:true,godkjent:true,godkjentDato:"2026-02-01",
   evaluering:"God med eldre. Litt sen respons noen ganger.",
   status:"aktiv"},
  {id:"v3",navn:"Nina Bakke",av:"NB",tittel:"Sykepleier",hpr:"9345678",enk:false,enkOrg:null,rating:0,oppdrag:0,telefon:"478 11 992",epost:"nina.bakke@outlook.com",kontonr:"",
   tjenester:["morgensstell","barsel_praktisk","barsel_samtale"],omrade:["Fredrikstad","Sarpsborg"],
   tilgjengelig:false,varsel:"push",responstid:"ukjent",
   sertifisert:true,godkjent:false,godkjentDato:null,
   evaluering:"",
   status:"venter_godkjenning"},
  {id:"v4",navn:"Erik Solberg",av:"ES",tittel:"Hjelpepleier",hpr:"6456789",enk:true,enkOrg:"Solberg Omsorg ENK",rating:4.9,oppdrag:52,telefon:"913 77 334",epost:"erik.solberg@solberg-omsorg.no",kontonr:"1503.44.33333",
   tjenester:["praktisk","avlastning","transport","ringetilsyn","besok"],omrade:["Moss","Råde","Vestby"],
   tilgjengelig:true,varsel:"push",responstid:"< 15 min",
   sertifisert:true,godkjent:true,godkjentDato:"2025-11-15",
   evaluering:"Raskeste responstid. Svært profesjonell.",
   status:"aktiv"},
];

export const BEMANNING_BYRAER = [
  {id:"b1",navn:"Manpower Health",logo:"MP",kontakt:"helse@manpower.no",telefon:"22 63 00 00",
   api:true,apiStatus:"aktiv",apiUrl:"https://api.manpower.no/health/v2",
   tilgjengelighet:"24/7",responstid:"< 2 timer",timepris:{sykepleier:420,hjelpepleier:350},
   faktura:"månedlig",aktiv:true,avtale:"Rammeavtale 2026"},
  {id:"b2",navn:"Adecco Medical",logo:"AD",kontakt:"medical@adecco.no",telefon:"23 29 90 00",
   api:true,apiStatus:"ikke_satt_opp",apiUrl:"https://connect.adecco.no/medical",
   tilgjengelighet:"hverdager 07-22",responstid:"< 4 timer",timepris:{sykepleier:440,hjelpepleier:365},
   faktura:"månedlig",aktiv:false,avtale:null},
  {id:"b3",navn:"Helse Vikaren",logo:"HV",kontakt:"post@helsevikaren.no",telefon:"900 45 678",
   api:false,apiStatus:null,apiUrl:null,
   tilgjengelighet:"24/7",responstid:"< 1 time",timepris:{sykepleier:395,hjelpepleier:330},
   faktura:"per oppdrag",aktiv:false,avtale:null},
];

export const B2B_COORD_BRUKERE = [
  {id:"u1",name:"Astrid Hansen",dob:"1942",adresse:"Konggata 12",pakke:"morgensstell+praktisk",
   ukeplan:[
     {dag:"Man",tjeneste:"Morgensstell",tid:"08:00",sykepleier:"Sara L.",status:"confirmed"},
     {dag:"Tirs",tjeneste:"Praktisk bistand",tid:"10:00",sykepleier:"Maria K.",status:"confirmed"},
     {dag:"Ons",tjeneste:"Morgensstell",tid:"08:00",sykepleier:"Sara L.",status:"confirmed"},
     {dag:"Tor",tjeneste:"Ringetilsyn",tid:"13:00",sykepleier:"Maria K.",status:"confirmed"},
     {dag:"Fre",tjeneste:"Morgensstell",tid:"08:00",sykepleier:"Sara L.",status:"confirmed"},
   ],
   digitalt:true,mnd_pris:2850,aktiv:true},
  {id:"u2",name:"Olaf Eriksen",dob:"1938",adresse:"Storgata 45",pakke:"praktisk+ringetilsyn",
   ukeplan:[
     {dag:"Man",tjeneste:"Praktisk bistand",tid:"10:30",sykepleier:"Sara L.",status:"confirmed"},
     {dag:"Ons",tjeneste:"Ringetilsyn",tid:"13:00",sykepleier:"Maria K.",status:"confirmed"},
     {dag:"Fre",tjeneste:"Praktisk bistand",tid:"10:30",sykepleier:"Lars B.",status:"confirmed"},
   ],
   digitalt:false,mnd_pris:1470,aktiv:true},
  {id:"u3",name:"Kari Olsen",dob:"1950",adresse:"Nygata 8",pakke:"ringetilsyn",
   ukeplan:[
     {dag:"Man",tjeneste:"Ringetilsyn",tid:"13:00",sykepleier:"Maria K.",status:"confirmed"},
     {dag:"Tor",tjeneste:"Ringetilsyn",tid:"13:00",sykepleier:"Maria K.",status:"confirmed"},
   ],
   digitalt:false,mnd_pris:380,aktiv:false},
];

export const PAKKER = [
  {id:"ringetilsyn",navn:"Ringetilsyn",ikon:"📞",beskrivelse:"Daglige påminnelser og tilsynssamtaler",pris:190,frekvens:"per gang"},
  {id:"praktisk",navn:"Praktisk bistand",ikon:"🏠",beskrivelse:"Rengjøring, matlaging og handling",pris:390,frekvens:"per gang"},
  {id:"morgensstell",navn:"Morgensstell",ikon:"🚿",beskrivelse:"Fullstendig morgenstell og dusj",pris:490,frekvens:"per gang"},
  {id:"besok",navn:"Besøksvenn",ikon:"☕",beskrivelse:"Samtale, selskap og tur",pris:320,frekvens:"per gang"},
  {id:"ukespakke_basis",navn:"Ukespakke Basis",ikon:"📋",beskrivelse:"3x ringetilsyn + 2x praktisk per uke",pris:1470,frekvens:"per mnd"},
  {id:"ukespakke_pluss",navn:"Ukespakke Pluss",ikon:"⭐",beskrivelse:"5x morgensstell + 3x praktisk per uke",pris:2850,frekvens:"per mnd"},
];

export const ANSATTE_LONN = [
  {id:"a1",navn:"Sara Lindgren",tittel:"Autorisert sykepleier",av:"SL",ansattDato:"2025-08-01",
   stillingsprosent:100,timerPerUke:37.5,lonnstrinn:"Sykepleier trinn 4",
   grunnlonn:42500,tilleggHelg:3200,tilleggKveld:1800,reise:1200,
   pensjon:850,agAvgift:6897,feriepenger:5100,
   bruttoLonn:48700,trekkProsent:35,nettoUtbetalt:31655,
   status:"aktiv",kontonr:"1503.44.12345",sykmeldt:false},
  {id:"a2",navn:"Maria Kristiansen",tittel:"Hjelpepleier",av:"MK",ansattDato:"2025-11-01",
   stillingsprosent:80,timerPerUke:30,lonnstrinn:"Hjelpepleier trinn 2",
   grunnlonn:35200,tilleggHelg:1800,tilleggKveld:900,reise:800,
   pensjon:704,agAvgift:5559,feriepenger:4224,
   bruttoLonn:38700,trekkProsent:32,nettoUtbetalt:26316,
   status:"aktiv",kontonr:"1503.55.67890",sykmeldt:false},
  {id:"a3",navn:"Anne Sørensen",tittel:"Autorisert sykepleier",av:"AS",ansattDato:"2024-03-01",
   stillingsprosent:100,timerPerUke:37.5,lonnstrinn:"Sykepleier trinn 6",
   grunnlonn:46800,tilleggHelg:4100,tilleggKveld:2200,reise:1600,
   pensjon:936,agAvgift:7678,feriepenger:5616,
   bruttoLonn:54700,trekkProsent:38,nettoUtbetalt:33914,
   status:"aktiv",kontonr:"1503.22.98765",sykmeldt:false},
  {id:"a4",navn:"Lars Bakken",tittel:"Hjelpepleier",av:"LB",ansattDato:"2026-01-15",
   stillingsprosent:60,timerPerUke:22.5,lonnstrinn:"Hjelpepleier trinn 1",
   grunnlonn:28400,tilleggHelg:1200,tilleggKveld:600,reise:500,
   pensjon:568,agAvgift:4347,feriepenger:3408,
   bruttoLonn:30700,trekkProsent:28,nettoUtbetalt:22104,
   status:"aktiv",kontonr:"1503.11.44556",sykmeldt:false},
  {id:"a5",navn:"Lise Andersen",tittel:"Daglig leder / Admin",av:"LA",ansattDato:"2025-01-01",
   stillingsprosent:100,timerPerUke:37.5,lonnstrinn:"Lederstilling",
   grunnlonn:68000,tilleggHelg:0,tilleggKveld:0,reise:0,
   pensjon:1360,agAvgift:10266,feriepenger:8160,
   bruttoLonn:68000,trekkProsent:42,nettoUtbetalt:39440,
   status:"aktiv",kontonr:"1503.33.77891",sykmeldt:false},
];

export const LONNKJORINGER = [
  {maaned:"Mars 2026",status:"planlagt",utbetalingsDato:"2026-03-25",totalBrutto:232800,totalNetto:153429,agAvgift:32837,feriepenger:26508},
  {maaned:"Feb 2026", status:"utbetalt",  utbetalingsDato:"2026-02-25",totalBrutto:228400,totalNetto:150744,agAvgift:32205,feriepenger:27408},
  {maaned:"Jan 2026", status:"utbetalt",  utbetalingsDato:"2026-01-25",totalBrutto:215900,totalNetto:142194,agAvgift:30443,feriepenger:25908},
];

export const KREDITERINGER = [
  {id:"KRD-001",type:"b2c",method:"vipps",kunde:"Astrid Hansen",oppdrag:"Morgensstell & dusj",dato:"2026-03-10",belop:590,arsak:"Oppdrag ikke gjennomført — sykepleier syk",status:"refundert",godkjentAv:"Lise Andersen",ref:"vipps_ref_8823x"},
  {id:"KRD-002",type:"b2c",method:"stripe",kunde:"Maria Olsen",oppdrag:"Besøksvenn",dato:"2026-03-08",belop:390,arsak:"Feil pris belastet — dobbeltbestilling",status:"refundert",godkjentAv:"Lise Andersen",ref:"pi_stripe_99kl2"},
  {id:"KRD-003",type:"b2b",method:"kreditnota",kunde:"Moss Kommune",oppdrag:"Ringetilsyn × 4",dato:"2026-03-05",belop:760,arsak:"4 oppdrag ikke gjennomført i uke 9",status:"sendt",godkjentAv:"Lise Andersen",ref:"KN-2026-003",kreditnotaNr:"KN-2026-003"},
  {id:"KRD-004",type:"b2b",method:"kreditnota",kunde:"Parkveien Borettslag",oppdrag:"Praktisk bistand",dato:"2026-02-28",belop:490,arsak:"Prisavvik — feil rammeavtalepris fakturert",status:"sendt",godkjentAv:"Lise Andersen",ref:"KN-2026-002",kreditnotaNr:"KN-2026-002"},
  {id:"KRD-005",type:"b2c",method:"vipps",kunde:"Sara Berg",oppdrag:"Barsel — Trilleturer",dato:"2026-02-20",belop:390,arsak:"Avlyst av kunde — varsel innen 24t",status:"refundert",godkjentAv:"System (auto)",ref:"vipps_ref_7712a"},
];

export const BN_K = [{id:"hjem",icon:"🏠",label:"Hjem"},{id:"bestill",icon:"➕",label:"Bestill"},{id:"mine",icon:"📋",label:"Mine"},{id:"chat-kunde",icon:"💬",label:"Chat"},{id:"kunde-profil",icon:"👤",label:"Profil"}];

export const NURSE_NAV = [
  {id:"nurse-hjem",icon:"🏠",label:"Hjem"},
  {id:"nurse-oppdrag",icon:"📋",label:"Oppdrag"},
  {id:"nurse-innsjekk",icon:"✅",label:"Innsjekk"},
  {id:"nurse-profil",icon:"👤",label:"Profil"},
];

export const ANAV = [
  {id:"dashboard",icon:"📊",label:"Dashboard"},
  {id:"oppdrag",icon:"📋",label:"Oppdrag"},
  {id:"betalinger",icon:"💳",label:"Betalinger"},
  {id:"b2b",icon:"🏢",label:"B2B & Faktura"},
  {id:"ansatte",icon:"👥",label:"Ansatte & Roller"},
  {id:"okonomi",icon:"📊",label:"Økonomi & Regnskap"},
  {id:"tjenester",icon:"🏥",label:"Tjenester & priser"},
  {id:"innstillinger",icon:"⚙️",label:"Innstillinger"},
];

export const TABS = [{id:"kunde",label:"📱 Kunde-app",def:"landing"},{id:"nurse",label:"🩺 Sykepleier",def:"nurse-login"},{id:"b2b",label:"🏢 B2B-portal",def:"b2b-login"},{id:"admin",label:"🖥️ Adminpanel",def:"admin"}];

export const ADMIN_SC = [["dashboard","📊 Dashboard"],["betalinger","💳 Betalinger"],["ansatte","👥 Ansatte"],["b2b","🏢 B2B"],["oppdrag","📋 Oppdrag"],["okonomi","📈 Økonomi"],["tjenester","🏥 Tjenester"]];

export const SC = {
  kunde:[["landing","Start"],["login","Login"],["push-tillatelse","Push"],["samtykke","Samtykke"],["epost-bekreftelse","E-post"],["onboarding","Onboarding"],["glemt-passord","Glemt pw"],["hjem","Hjem"],["bestill","Bestill"],["betaling","Betaling"],["bekreftelse","OK"],["mine","Mine"],["kunde-oppdrag-detalj","Ordre"],["kunde-profil","Profil"],["kunde-avtale-detalj","Avtale"],["oppdrag-i-gang","Pågår"],["chat-kunde","Chat"],["b2b-dashboard","B2B koordinator"],["b2b-onboarding","B2B ny"],["b2b-bestill","B2B bestill"],["b2b-bruker","B2B bruker"],["b2b-bruker-aktivering","B2B aktiver"]],
  nurse:[["nurse-login","Login"],["nurse-rolle","Rolle"],["nurse-onboarding","SP onboard"],["nurse-hjem","Hjem"],["nurse-oppdrag","Oppdrag"],["nurse-innsjekk","Innsjekk"],["nurse-rapport","Rapport"],["nurse-profil","Profil"]],
  b2b:[["b2b-login","B2B intro"],["login","Kunde-login"],["b2b-onboarding","Koord. onboard"],["b2b-dashboard","Dashboard"],["b2b-bestill","Bestill"],["b2b-bruker","Bruker"],["b2b-bruker-aktivering","Aktivering"]],
};

export const KUNDE_SCREEN_PATH = {
  hjem: "/",
  landing: "/",
  bestill: "/bestill",
  mine: "/mine",
  "kunde-profil": "/profil",
  "kunde-avtale-detalj": "/",
  "kunde-oppdrag-detalj": "/mine",
  "oppdrag-i-gang": "/oppdrag-i-gang",
  "chat-kunde": "/chat",
  login: "/login",
};

export const TARIFF_INFO = {
  avtale:"NSF / Spekter helseforetak",
  sone:"Sone 1 (Moss/Østfold)",
  agAvgiftSats:14.1,
  otpSats:2.0,
  feriepengeSats:12.0,
  sykeAGDager:16,
  minstelonn:{sykepleier:42000,hjelpepleier:34000},
  tillegg:{helgProsent:45,kveldKr:58,nattKr:88,overtidProsent:50},
};

export const KANSELLERING_REGLER = {
  fristTimer:24,        // timer før oppdrag — gratis avlysning
  gebyrProsent50:12,    // under X timer → 50% gebyr
  gebyrProsent100:4,    // under X timer → 100% gebyr
  sykepleierSyk:"full_refusjon",  // alltid full refusjon
  erstatningsvarsel:true,          // varsle kunde om bytte
};

export const NURSE_PROFIL_SPESIALITETER_CHIPS = ["Eldre","Demens","Barsel","Praktisk bistand","Transport","Medisin","Rehabilitering","Morgensstell"];

export const NURSE_PROFIL_OMRADE_CHIPS = ["Moss","Rygge","Råde","Vestby","Fredrikstad","Sarpsborg","Ski","Ås"];

export const NURSE_TITTEL_OPTIONS = ["Autorisert sykepleier","Hjelpepleier","Vernepleier"];

export const INTERNE_ROLLER = ["admin","koordinator","sykepleier","hjelpepleier","vikar"];

export const B2B_ROLLER = ["b2b_koordinator","b2b_bruker"];

export const ROLLE_INFO = {
  admin:          {label:"Admin",          bg:"#EDE9FE",c:"#6D28D9", scope:"intern",  desc:"Full tilgang — økonomi, ansatte, kunder, innstillinger"},
  koordinator:    {label:"Koordinator",    bg:"#EFF6FF",  c:"#2563EB",    scope:"intern",  desc:"Oppdrag, ansatte, kunder — ikke økonomi"},
  sykepleier:     {label:"Sykepleier",     bg:"#EDF5F3",c:"#4A7C6F",  scope:"intern",  desc:"Egen arbeidsdag, innsjekk, rapport, chat"},
  hjelpepleier:   {label:"Hjelpepleier",   bg:"#EDF5F3",c:"#4A7C6F",  scope:"intern",  desc:"Samme som sykepleier"},
  vikar:          {label:"Vikar",          bg:"#F0F5F2", c:"#7A8E85",   scope:"intern",  desc:"Kun egne oppdrag — begrenset tilgang"},
  b2b_koordinator:{label:"B2B Koordinator",bg:"#FFF3E0",c:"#E65100",scope:"ekstern", desc:"Egne brukere, bestilling på vegne av, fakturastatus"},
  b2b_bruker:     {label:"B2B Bruker",     bg:"#FDF5EE", c:"#A07040",scope:"ekstern",desc:"Kun egne avtaler og ekstrabestilling"},
};

export const ROLLE_TILGANGER = {
  admin:          ["Dashboard","Oppdrag","Betalinger","B2B & Faktura","Ansatte","Innstillinger"],
  koordinator:    ["Dashboard","Oppdrag","B2B & Faktura","Ansatte (les)"],
  sykepleier:     ["Min arbeidsdag","Innsjekk","Rapport","Chat"],
  hjelpepleier:   ["Min arbeidsdag","Innsjekk","Rapport","Chat"],
  vikar:          ["Min arbeidsdag","Innsjekk"],
  b2b_koordinator:["Egne brukere","Bestilling","Ukesplan","Fakturastatus"],
  b2b_bruker:     ["Mine avtaler","Ekstrabestilling","Chat med sykepleier"],
};

export const ROLES = [...INTERNE_ROLLER, ...B2B_ROLLER];

export const NURSE_PROFIL_MOCK_INDEKS = 1;

export const MOCK_KUNDE_INNLOGGET_EPOST = "astrid@example.com";

export const TOAST_AVBESTILLING_BEKREFTET = "Avbestilling bekreftet. Bekreftelse er sendt til din e-post. Refusjon kommer innen 3–5 virkedager.";

export const PROTOTYPE_NOW_MS = Date.parse("2026-03-03T11:00:00+01:00");

export function catalogTilKundeServices(tjenester: readonly TjenesteCatalogEntry[]): KundeFacingService[] {
  return tjenester.filter(t=>t.aktiv&&t.kundeType).map(t=>({
    type:t.kundeType,
    name:t.navn,
    detail:t.beskrivelse,
    icon:t.ikon,
    price:t.pris,
    duration:t.varighet,
    cat:t.kategori,
    tagline:String(t.tagline||"").trim(),
    inkluderer:(Array.isArray(t.kundeInkluderer)?t.kundeInkluderer:[]).map(x=>String(x||"").trim()).filter(Boolean),
  }));
}

export function parseErfaringAar(erfaringStr: string | undefined): number {
  const m=String(erfaringStr||"").match(/(\d+)/);
  return m?Math.min(60,Math.max(0,parseInt(m[1],10))):0;
}

export function sykepleierOmradeTilChips(omradeStr: string | undefined): string[] {
  return String(omradeStr||"").split("/").map(s=>s.trim()).filter(Boolean);
}

export function profilEndringSammendrag(gammel: NurseProfileLike, apply: NurseProfileLike): string {
  const del=[];
  if((gammel.bio||"")!==(apply.bio||""))del.push("Kort beskrivelse");
  if((gammel.tittel||"")!==(apply.tittel||""))del.push(`Tittel → ${apply.tittel}`);
  if((gammel.erfaring||"")!==(apply.erfaring||""))del.push(`Erfaring → ${apply.erfaring}`);
  const gS=[...(gammel.spesialitet||[])].sort().join(",");
  const nS=[...(apply.spesialitet||[])].sort().join(",");
  if(gS!==nS)del.push("Spesialiteter");
  if((gammel.omrade||"")!==(apply.omrade||""))del.push("Dekningsområde");
  return del.length?del.join(" · "):"Profilfelter oppdatert";
}

export function orderStartMsForAvbestilling(o: MockOrder): number {
  if(o?.startIso) return Date.parse(o.startIso);
  const linked=o?.oppdragId!=null?OPPDRAG.find(x=>String(x.id)===String(o.oppdragId)):null;
  if(linked?.startIso) return Date.parse(linked.startIso);
  return NaN;
}

export function prototypeTimerTilOppstart(o: MockOrder): number | null {
  const t=orderStartMsForAvbestilling(o);
  if(Number.isNaN(t)) return null;
  return (t-PROTOTYPE_NOW_MS)/3600000;
}

export function kundeOrdreHistorisk(o: MockOrder): boolean {
  return o.status==="completed"||o.status==="cancelled"||o.status==="no_show";
}

export function kundeKanAvbestilleSelv(o: MockOrder): boolean {
  if(kundeOrdreHistorisk(o)) return false;
  const h=prototypeTimerTilOppstart(o);
  return h!=null&&h>48;
}

export function kundeMaKontakteForAvbestilling(o: MockOrder): boolean {
  if(kundeOrdreHistorisk(o)) return false;
  const h=prototypeTimerTilOppstart(o);
  if(h==null) return false;
  return h<=48;
}

export function kundeAvbestiltRefusjonInfotekst(order: MockOrder): string {
  const belop=Number(order?.amount??0).toLocaleString("nb-NO");
  return `Denne bestillingen er avbestilt. Refusjon på ${belop} kr er på vei til betalingsmetoden du brukte. Forventet: 3–5 virkedager.`;
}

export function mockKundeNesteAvtale(): OppdragEntry | undefined {
  return OPPDRAG.find(o=>o.id==="5")||OPPDRAG.find(o=>o.customer==="Astrid Hansen"&&o.status==="upcoming");
}

export function nurseDefaultInnsjekkOppdragId(): string {
  const active=OPPDRAG.find(o=>o.status==="active");
  if(active) return active.id;
  const pending=OPPDRAG.find(o=>o.status!=="completed");
  return pending?.id ?? OPPDRAG[0]?.id ?? "1";
}

export const DEFAULT_KUNDE_SERVICES = catalogTilKundeServices(INIT_TJENESTER_CATALOG);

export const KUNDE_NAV_TAB_IDS = new Set(BN_K.map((t) => t.id));

export const KUNDE_NAV_SHELL_ROOT_IDS = new Set([
  "hjem",
  "bestill",
  "mine",
  "chat-kunde",
  "kunde-profil",
]);
