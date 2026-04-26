import { useCallback,useEffect,useMemo,useState } from "react";
import { createPortal } from "react-dom";

function klikkRegistrert(){
  if(process.env.NODE_ENV==="development")console.log("klikk registrert");
}
function erGyldigEpost(s){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
}
function fulltNavnMinToOrd(navn){
  const ord=String(navn||"").trim().split(/\s+/).filter(Boolean);
  return ord.length>=2;
}

/**
 * Desktop vs. mobil for kunde-landing. SSR og første klientside må begge bruke «mobil»
 * (false), ellers kan hydrering feile. Mobil-layout bruker klassen .land-kunde-mobile (ikke .land-mobile)
 * slik at Next SSR ikke skjules av display:none på bred skjerm før klient bytter til desktop-layout.
 */
function useViewportMin768(){
  const[desktop,setDesktop]=useState(false);
  // useEffect (ikke useLayoutEffect): trygg ved SSR/pre-render i Next — unngår dev/500-problemer
  // knyttet til layout effects. Første paint er mobil; desktop aktiveres umiddelbart etter mount.
  useEffect(()=>{
    const mq=window.matchMedia("(min-width:768px)");
    setDesktop(mq.matches);
    const cb=()=>setDesktop(mq.matches);
    mq.addEventListener("change",cb);
    return()=>mq.removeEventListener("change",cb);
  },[]);
  return desktop;
}

const C = {
  green:"#4A7C6F",greenDark:"#2C5C52",greenLight:"#7FAE96",
  greenBg:"#EDF5F3",greenXL:"#F4FAF8",
  rose:"#E8A4A4",roseDark:"#C47C7C",roseBg:"#FDF0F0",
  gold:"#C4956A",goldDark:"#A07040",goldBg:"#FDF5EE",
  cream:"#FAF6F1",navy:"#2C3E35",navyMid:"#4A5E55",
  soft:"#7A8E85",border:"#E4EDE9",softBg:"#F0F5F2",
  vipps:"#FF5B24",danger:"#E11D48",dangerBg:"#FFF1F2",
  sky:"#2563EB",skyBg:"#EFF6FF",
  sidebar:"#1E3A2F",sidebarActive:"rgba(74,188,158,0.18)",
  sidebarText:"rgba(255,255,255,0.75)",sidebarMuted:"rgba(255,255,255,0.35)",
  sidebarAccent:"#4ABC9E",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..140,100..900;1,9..140,100..900&family=DM+Sans:opsz,wght@9..40,300..700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{overflow-x:clip;-webkit-text-size-adjust:100%}
body{font-family:'DM Sans',system-ui,sans-serif;background:#F0F5F2;color:#2C3E35;font-size:14px;line-height:1.5;overflow-x:clip;max-width:100vw}
.fr{font-family:'Fraunces',serif}
.g1{display:grid;grid-template-columns:1fr;gap:12px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
@media(max-width:900px){.g4{grid-template-columns:1fr 1fr}.g3{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.g4,.g3{grid-template-columns:1fr 1fr}.g2m1{grid-template-columns:1fr!important}.hm{display:none!important}.ac{padding:12px!important}.ah{padding:0 14px!important}}
@media(max-width:480px){.g2{grid-template-columns:1fr!important}}
@media(min-width:601px){.hd{display:none!important}}
.login-stack{position:relative;z-index:1;width:100%;max-width:420px;margin:0 auto;box-sizing:border-box}
.sidebar{width:220px;flex-shrink:0;align-self:stretch;background:#1E3A2F;display:flex;flex-direction:column;height:100%;min-height:100vh;transition:transform .22s cubic-bezier(.4,0,.2,1)}
.sidebar.closed{transform:translateX(-100%)}
@media(min-width:769px){.sidebar{transform:none!important;position:sticky;height:100vh;top:0}.overlay{display:none!important}.hbg{display:none!important}}
@media(max-width:768px){.sidebar{position:fixed;top:0;left:0;z-index:50;height:100vh;max-height:100dvh}}
.overlay{position:fixed;inset:0;z-index:45;background:rgba(0,0,0,.38);display:none}
.overlay.open{display:block}
.phone{width:100%;max-width:100%;margin:0 auto;min-height:100svh;background:#FAF6F1;display:flex;flex-direction:column;position:relative;overflow-x:clip}
.pw{display:flex;justify-content:center;align-items:flex-start;padding:20px;min-height:calc(100vh - 42px);background:#CBD4D9;overflow-x:clip;max-width:100vw}
/* Next.js-innebygging: full høyde uten prototyp-verktøylinje (42px) */
.pw-app{position:relative;isolation:isolate;min-height:100svh!important}
.pw-app .phone{position:relative;z-index:0;min-height:100svh!important}
/* Flex scroll: uten min-height:0 kan .sa «vise» feil høyde og i enkelte nettlesere blokkere klikk under */
.pw-app .phone .sa{min-height:0}
/* Sykepleier innlogging (Next uten verktøylinje): sikre fleks-sone og klikkflate */
.pw-app .nurse-login-shell{flex:1 1 auto;min-height:0;width:100%;display:flex;flex-direction:column}
.pw-app .nurse-login-shell .sa{flex:1 1 auto;min-height:0;position:relative;z-index:2}
@media(min-width:768px){
  .pw-app{min-height:100vh!important}
  .pw-app .phone{min-height:100vh!important}
  .pw-app .land-desktop{height:100vh!important;min-height:0!important}
}
@media(min-width:768px){
  .pw{padding:0;background:#F0F5F2;align-items:stretch;min-height:calc(100vh - 42px)}
  .phone{max-width:100%;width:100%;min-height:calc(100vh - 42px);border-radius:0;box-shadow:none;border:none;flex-direction:column;background:#F0F5F2}
  .phone > div:first-child{flex-shrink:0}
  .sa{flex:1;overflow-y:auto;max-height:none}
  .sa > div{max-width:900px;margin:0 auto;width:100%;padding-left:clamp(0px,2vw,12px);padding-right:clamp(0px,2vw,12px);box-sizing:border-box}
  .bnav{display:none!important}
  .desk-nav{display:flex!important}
  .phone > div[style*="linear-gradient"]{max-height:280px;padding-bottom:28px!important;overflow:hidden;flex-shrink:0}
}
@media(max-width:767px){
  .pw{padding:0;background:#FAF6F1;min-height:calc(100svh - 42px);display:flex;flex-direction:column}
  .phone{max-width:100%;width:100%;min-height:calc(100svh - 42px)}
  .desk-nav{display:none!important}
  .land-kunde-mobile{display:flex!important}
  .land-desktop{display:none!important}
}
@media(min-width:768px){
  .land-desktop{display:block!important;width:100%;overflow-x:clip;overflow-y:auto;height:calc(100vh - 42px)}
}
@media(min-width:768px) and (max-width:1100px){
  .land-hero-grid{grid-template-columns:1fr!important;gap:40px!important}
  .land-hero-shell{padding:clamp(28px,4vw,48px) clamp(20px,4vw,40px)!important;min-height:auto!important}
}
.land-desktop img,.phone img{max-width:100%;height:auto}
.sa{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;min-width:0}
.bnav{position:sticky;bottom:0;z-index:20;display:flex;background:white;border-top:1px solid #E4EDE9;padding-bottom:env(safe-area-inset-bottom,0)}
.bi{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:52px;padding:10px 2px 8px;border:none;background:none;cursor:pointer;gap:4px;-webkit-tap-highlight-color:transparent}
.bi-lbl{font-size:11px;line-height:1.2;text-align:center;max-width:100%;overflow:hidden;text-overflow:ellipsis}
@media(max-width:380px){.bi-lbl{font-size:10px}}
.card{background:white;border-radius:12px;border:.5px solid #E4EDE9;overflow:hidden}
.cp{padding:12px 14px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:none;cursor:pointer;font-family:inherit;border-radius:8px;font-weight:600;transition:opacity .1s;min-height:44px;min-width:44px;padding:10px 14px}
.btn:active{opacity:.85}
.bp{background:#4A7C6F;color:white}
.bg{background:rgba(255,255,255,.14);color:white;border:1px solid rgba(255,255,255,.22)}
.bf{width:100%;padding:12px 16px;font-size:14px;min-height:48px;min-width:0}
.inp{width:100%;padding:12px 14px;border:1.5px solid #E4EDE9;border-radius:8px;font-size:14px;font-family:inherit;background:#F4FAF8;outline:none;color:#2C3E35;min-height:44px}
.inp:focus{border-color:#4A7C6F}
textarea.inp{min-height:88px;padding-top:10px}
.badge{display:inline-block;font-size:10px;font-weight:600;padding:2px 8px;border-radius:50px;white-space:nowrap}
.al{display:flex;align-items:stretch;min-height:100vh;overflow-x:clip}
.am{flex:1;min-width:0;display:flex;flex-direction:column;overflow-x:clip}
.hbg{min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ah{min-height:56px;height:auto;background:white;border-bottom:1px solid #E4EDE9;display:flex;align-items:center;padding:0 clamp(12px,3vw,20px);gap:12px;position:sticky;top:0;z-index:30;flex-shrink:0}
.ac{flex:1;overflow-y:auto;overflow-x:clip;padding:20px;min-width:0}
@media(min-width:1280px){
  .ac{padding:28px 36px}
  .ah{padding:0 28px}
}
@keyframes spin{to{transform:rotate(360deg)}}
.spin{width:14px;height:14px;border:2.5px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite}
@keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fu .25s ease both}
@media (prefers-reduced-motion:reduce){
  .fu{animation:none!important;opacity:1!important;transform:none!important}
}
.pb{display:flex;background:#1E3A2F;border-bottom:1px solid rgba(255,255,255,.08);flex-wrap:wrap;align-items:center;padding:0 10px;position:sticky;top:0;z-index:100}
.pt{padding:10px 12px;border:none;background:none;font-size:11px;font-weight:500;cursor:pointer;font-family:inherit;white-space:nowrap;border-bottom:2.5px solid transparent}
.pt.on{border-bottom-color:#4ABC9E;color:#4ABC9E}
.pt:not(.on){color:rgba(255,255,255,.5)}
.ps{display:flex;gap:4px;flex-wrap:wrap;padding:5px 0;margin-left:auto}
.sc{padding:3px 9px;border-radius:50px;font-size:9px;font-weight:500;cursor:pointer;border:none;font-family:inherit}
.sc.on{background:#4A7C6F;color:white}
.sc:not(.on){background:rgba(255,255,255,.1);color:rgba(255,255,255,.65)}
.tbl{width:100%;border-collapse:collapse;font-size:13px}
.tbl th{text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:#7A8E85;padding:10px 12px;border-bottom:1px solid #E4EDE9;background:#F4FAF8;white-space:nowrap}
.tbl td{padding:10px 12px;border-bottom:.5px solid #F0F5F2;color:#2C3E35}
.tbl tr:last-child td{border-bottom:none}
.tbl tr:hover td{background:#F4FAF8}
.tw{width:100%;max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;border-radius:12px}
@media(max-width:767px){
  .tbl button,.tbl .btn{font-size:11px!important;min-height:44px;padding:8px 12px!important}
}
.nc{background:white;border-radius:14px;padding:14px;border:1px solid #E4EDE9;margin-bottom:8px}
.desk-nav{background:white;border-bottom:1px solid #E4EDE9;padding:0 clamp(12px,2vw,24px);min-height:56px;height:auto;display:none;flex-wrap:nowrap;align-items:stretch;align-content:center;row-gap:0;column-gap:0;width:100%;max-width:100%;flex-shrink:0;position:sticky;top:0;z-index:20;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:thin}
.desk-nav-item{padding:0 12px;min-height:48px;display:flex;align-items:center;flex-shrink:0;font-size:13px;font-weight:500;cursor:pointer;border:none;background:none;font-family:inherit;border-bottom:2.5px solid transparent;color:#7A8E85;white-space:nowrap}
.desk-nav-item.on{color:#4A7C6F;border-bottom-color:#4A7C6F;font-weight:600}
.desk-nav-item:hover{color:#2C3E35}
@media(min-width:768px) and (max-width:1023px){
  .desk-nav-item{padding:0 10px;font-size:12px}
}
@media(min-width:768px){
  .hero-compact{padding:24px 32px!important;min-height:160px}
  .hero-compact h1{font-size:32px!important}
  .g2{grid-template-columns:1fr 1fr}
  .g3{grid-template-columns:1fr 1fr 1fr}
  .g4{grid-template-columns:repeat(4,1fr)}
  .desk-two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:860px;margin:0 auto}
  .desk-single{max-width:560px;margin:0 auto}
  .card-hover:hover{border-color:#4A7C6F!important;transform:translateY(-1px);transition:all .15s}
  .nc{border-radius:10px}
}
@media(min-width:768px) and (max-width:950px){
  .hero-cards{display:none!important}
}
.settings-toggle{width:52px;height:30px;border-radius:15px;border:none;padding:0;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;display:block}
.settings-toggle:focus-visible{outline:2px solid #4ABC9E;outline-offset:2px}
.stack-sm-1{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:639px){
  .stack-sm-1{grid-template-columns:1fr!important;gap:12px!important}
}
`;

// ── DATA ──────────────────────────────────────────────────────
/** Admin master catalog; App state is initialized from this. Customer list = catalogTilKundeServices(catalog). */
const INIT_TJENESTER_CATALOG=[
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

function catalogTilKundeServices(tjenester){
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

const DEFAULT_KUNDE_SERVICES=catalogTilKundeServices(INIT_TJENESTER_CATALOG);
const ORDERS=[
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
const NURSES=[
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
/** Forhåndsvalg i sykepleierprofil (prototype) */
const NURSE_PROFIL_SPESIALITETER_CHIPS=["Eldre","Demens","Barsel","Praktisk bistand","Transport","Medisin","Rehabilitering","Morgensstell"];
const NURSE_PROFIL_OMRADE_CHIPS=["Moss","Rygge","Råde","Vestby","Fredrikstad","Sarpsborg","Ski","Ås"];
const NURSE_TITTEL_OPTIONS=["Autorisert sykepleier","Hjelpepleier","Vernepleier"];
const NURSE_PROFIL_MOCK_INDEKS=1; // Maria Kristiansen i demo-flyt
function parseErfaringAar(erfaringStr){
  const m=String(erfaringStr||"").match(/(\d+)/);
  return m?Math.min(60,Math.max(0,parseInt(m[1],10))):0;
}
function sykepleierOmradeTilChips(omradeStr){
  return String(omradeStr||"").split("/").map(s=>s.trim()).filter(Boolean);
}
function profilEndringSammendrag(gammel,apply){
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
const OPPDRAG=[
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
/** «Nå» i prototypen: mandag 3. mars 2026 kl. 11 — brukes til 48-timers avbestilling */
const PROTOTYPE_NOW_MS=Date.parse("2026-03-03T11:00:00+01:00");
function orderStartMsForAvbestilling(o){
  if(o?.startIso) return Date.parse(o.startIso);
  const linked=o?.oppdragId!=null?OPPDRAG.find(x=>String(x.id)===String(o.oppdragId)):null;
  if(linked?.startIso) return Date.parse(linked.startIso);
  return NaN;
}
function prototypeTimerTilOppstart(o){
  const t=orderStartMsForAvbestilling(o);
  if(Number.isNaN(t)) return null;
  return (t-PROTOTYPE_NOW_MS)/3600000;
}
function kundeOrdreHistorisk(o){
  return o.status==="completed"||o.status==="cancelled"||o.status==="no_show";
}
function kundeKanAvbestilleSelv(o){
  if(kundeOrdreHistorisk(o)) return false;
  const h=prototypeTimerTilOppstart(o);
  return h!=null&&h>48;
}
function kundeMaKontakteForAvbestilling(o){
  if(kundeOrdreHistorisk(o)) return false;
  const h=prototypeTimerTilOppstart(o);
  if(h==null) return false;
  return h<=48;
}
/** Innlogget B2C-kunde (mock) — avbestillings-e-post, profil, osv. */
const MOCK_KUNDE_INNLOGGET_EPOST="astrid@example.com";
const TOAST_AVBESTILLING_BEKREFTET="Avbestilling bekreftet. Bekreftelse er sendt til din e-post. Refusjon kommer innen 3–5 virkedager.";
function kundeAvbestiltRefusjonInfotekst(order){
  const belop=Number(order?.amount??0).toLocaleString("nb-NO");
  return `Denne bestillingen er avbestilt. Refusjon på ${belop} kr er på vei til betalingsmetoden du brukte. Forventet: 3–5 virkedager.`;
}
/** Kunde-mock: neste avtale i header og KundeAvtaleDetalj (OPPDRAG id «5» som primærkilde) */
function mockKundeNesteAvtale(){
  return OPPDRAG.find(o=>o.id==="5")||OPPDRAG.find(o=>o.customer==="Astrid Hansen"&&o.status==="upcoming");
}
const NURSE_NAV=[
  {id:"nurse-hjem",icon:"🏠",label:"Hjem"},
  {id:"nurse-oppdrag",icon:"📋",label:"Oppdrag"},
  {id:"nurse-innsjekk",icon:"✅",label:"Innsjekk"},
  {id:"nurse-profil",icon:"👤",label:"Profil"},
];
function nurseDefaultInnsjekkOppdragId(){
  const active=OPPDRAG.find(o=>o.status==="active");
  if(active) return active.id;
  const pending=OPPDRAG.find(o=>o.status!=="completed");
  return pending?.id ?? OPPDRAG[0]?.id ?? "1";
}
const CHAT=[
  {from:"nurse",text:"Hei! Jeg er på vei, ankommer om ca. 10 min.",time:"10:18"},
  {from:"customer",text:"Tusen takk! Jeg er hjemme 😊",time:"10:19"},
  {from:"nurse",text:"Perfekt, ses snart!",time:"10:20"},
];
const B2B_C=[
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
const B2B_INV=[
  {id:"EIR-2026-0042",customer:"Moss Kommune",amount:18750,due:"2026-04-02",status:"sent",ehf:true},
  {id:"EIR-2026-0041",customer:"Parkveien Borettslag",amount:6000,due:"2026-03-25",status:"overdue",ehf:false},
  {id:"EIR-2026-0040",customer:"Moss Kommune",amount:12500,due:"2026-03-15",status:"paid",ehf:true},
];
/** Nye B2B-henvendelser fra landingsskjema (mock) */
const MOCK_B2B_HENVENDELSER=[
  {id:"bh1",navn:"Kari Nordmann",organisasjon:"Råde kommune",epost:"kari.nordmann@rade.kommune.no",telefon:"+47 900 11 223",antallBrukere:12,tidspunkt:"2026-04-06 14"},
  {id:"bh2",navn:"Per Hansen",organisasjon:"Soleng Borettslag",epost:"per.hansen@soleng.no",telefon:"901 55 882",antallBrukere:8,tidspunkt:"2026-04-05 09"},
  {id:"bh3",navn:"Linnea Berg",organisasjon:"Østfold Omsorg AS",epost:"linnea@oostfoldomsorg.no",telefon:"+47999 00 441",antallBrukere:45,tidspunkt:"2026-04-03 16"},
];
const VIPPS_P=[
  {id:"VP-20260303",date:"2026-03-03",amount:4720,status:"settled",orders:8},
  {id:"VP-20260304",date:"2026-03-04",amount:2940,status:"settled",orders:5},
  {id:"VP-20260305",date:"2026-03-05",amount:6380,status:"pending",orders:11},
];
const STRIPE_P=[
  {id:"po_3Ox1234",date:"2026-03-01",amount:3490,status:"paid",arrival:"2026-03-03"},
  {id:"po_3Ox5678",date:"2026-03-03",amount:1960,status:"paid",arrival:"2026-03-05"},
  {id:"po_3Ox9012",date:"2026-03-05",amount:2450,status:"in_transit",arrival:"2026-03-07"},
];
const WH=[
  {event:"Betaling mottatt",ref:"ORD-0092",time:"10:31",status:"ok",method:"vipps"},
  {event:"Kortbetaling fullført",ref:"ORD-0091",time:"08:01",status:"ok",method:"stripe"},
  {event:"Betaling mislyktes",ref:"ORD-0088",time:"09:14",status:"error",method:"vipps"},
  {event:"Utbetaling til konto",ref:"po_3Ox5678",time:"06:00",status:"ok",method:"stripe"},
];
// ── ROLLER ─────────────────────────────────────────────────
const INTERNE_ROLLER=["admin","koordinator","sykepleier","hjelpepleier","vikar"];
const B2B_ROLLER=["b2b_koordinator","b2b_bruker"];
const ROLES=[...INTERNE_ROLLER,...B2B_ROLLER];

const ROLLE_INFO={
  admin:          {label:"Admin",          bg:"#EDE9FE",c:"#6D28D9", scope:"intern",  desc:"Full tilgang — økonomi, ansatte, kunder, innstillinger"},
  koordinator:    {label:"Koordinator",    bg:C.skyBg,  c:C.sky,    scope:"intern",  desc:"Oppdrag, ansatte, kunder — ikke økonomi"},
  sykepleier:     {label:"Sykepleier",     bg:C.greenBg,c:C.green,  scope:"intern",  desc:"Egen arbeidsdag, innsjekk, rapport, chat"},
  hjelpepleier:   {label:"Hjelpepleier",   bg:C.greenBg,c:C.green,  scope:"intern",  desc:"Samme som sykepleier"},
  vikar:          {label:"Vikar",          bg:C.softBg, c:C.soft,   scope:"intern",  desc:"Kun egne oppdrag — begrenset tilgang"},
  b2b_koordinator:{label:"B2B Koordinator",bg:"#FFF3E0",c:"#E65100",scope:"ekstern", desc:"Egne brukere, bestilling på vegne av, fakturastatus"},
  b2b_bruker:     {label:"B2B Bruker",     bg:C.goldBg, c:C.goldDark,scope:"ekstern",desc:"Kun egne avtaler og ekstrabestilling"},
};

const ROLLE_TILGANGER={
  admin:          ["Dashboard","Oppdrag","Betalinger","B2B & Faktura","Ansatte","Innstillinger"],
  koordinator:    ["Dashboard","Oppdrag","B2B & Faktura","Ansatte (les)"],
  sykepleier:     ["Min arbeidsdag","Innsjekk","Rapport","Chat"],
  hjelpepleier:   ["Min arbeidsdag","Innsjekk","Rapport","Chat"],
  vikar:          ["Min arbeidsdag","Innsjekk"],
  b2b_koordinator:["Egne brukere","Bestilling","Ukesplan","Fakturastatus"],
  b2b_bruker:     ["Mine avtaler","Ekstrabestilling","Chat med sykepleier"],
};

const INIT_STAFF=[
  {id:"1",name:"Lise Andersen",    email:"lise@eiranova.no",   role:"admin",           scope:"intern",  googleWs:true, created:"2026-01-15"},
  {id:"2",name:"Sara Lindgren",    email:"sara@eiranova.no",   role:"sykepleier",      scope:"intern",  googleWs:true, created:"2026-01-20"},
  {id:"3",name:"Maria Kristiansen",email:"maria@eiranova.no",  role:"sykepleier",      scope:"intern",  googleWs:true, created:"2026-02-01"},
  {id:"4",name:"Anne Sørensen",    email:"anne@eiranova.no",   role:"sykepleier",      scope:"intern",  googleWs:true, created:"2026-02-10"},
  {id:"5",name:"Lars Bakken",      email:"lars@eiranova.no",   role:"hjelpepleier",    scope:"intern",  googleWs:true, created:"2026-02-15"},
  {id:"6",name:"Ingrid Moe",       email:"ingrid@eiranova.no", role:"koordinator",     scope:"intern",  googleWs:false,created:"2026-03-01"},
];

// B2B-tilganger per kunde — koordinatorer med domene-whitelist
const INIT_B2B_TILGANGER=[
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

// ── SHARED ────────────────────────────────────────────────────
// ── RESPONSIVE DESKTOP NAV ────────────────────────────────────
// Shows on tablet/desktop as horizontal top nav replacing bottom nav
function DeskNav({active, onNav, items, title, right}){
  return(
    <nav className="desk-nav">
      {title&&<div className="fr" style={{fontSize:15,fontWeight:600,color:C.navy,marginRight:16,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",minWidth:0,maxWidth:"min(280px,42vw)",flex:"0 1 auto"}}>{title}</div>}
      {items.map(it=>(
        <button key={it.id+it.label} className={`desk-nav-item${active===it.id?" on":""}`} onClick={()=>onNav(it.id)}>
          <span style={{marginRight:5,fontSize:14}}>{it.icon}</span>{it.label}
        </button>
      ))}
      {right&&<div style={{marginLeft:"auto",display:"flex",alignItems:"center"}}>{right}</div>}
    </nav>
  );
}

function Bdg({status}){
  const M={
    completed:{l:"✓ Fullført",bg:C.greenBg,c:C.greenDark},active:{l:"● Aktiv",bg:C.greenBg,c:C.green},
    assigned:{l:"Tildelt",bg:C.skyBg,c:C.sky},confirmed:{l:"Bekreftet",bg:C.goldBg,c:C.goldDark},
    pending:{l:"Venter",bg:C.goldBg,c:C.goldDark},sent:{l:"Sendt",bg:C.skyBg,c:C.sky},
    overdue:{l:"⚠ Forfalt",bg:C.dangerBg,c:C.danger},paid:{l:"✓ Betalt",bg:C.greenBg,c:C.greenDark},
    upcoming:{l:"Kommende",bg:C.softBg,c:C.soft},on_assignment:{l:"● Aktiv",bg:C.greenBg,c:C.green},
    available:{l:"Ledig",bg:"#F0FDF4",c:"#16A34A"},break:{l:"Pause",bg:C.goldBg,c:C.goldDark},
    settled:{l:"✓ Innbetalt",bg:C.greenBg,c:C.greenDark},in_transit:{l:"→ Overføring",bg:C.skyBg,c:C.sky},
    cancelled:{l:"Avbestilt",bg:"#FFF1F2",c:"#BE123C"},avlyst:{l:"Avlyst",bg:"#FFF1F2",c:"#BE123C"},
    no_show:{l:"Uteblitt",bg:C.softBg,c:C.soft},
  };
  const b=M[status]??{l:status,bg:C.softBg,c:C.soft};
  return <span className="badge" style={{background:b.bg,color:b.c}}>{b.l}</span>;
}
function PH({title,onBack,backLabel,bg,slim,rightAction,right,centerTitle=false}){
  const titleStr=title==null?"":String(title);
  const showTitle=titleStr.trim().length>0;
  const backLabelTrim=backLabel==null?"":String(backLabel).trim();
  const showBackLabel=backLabelTrim.length>0;
  const titleStyle={fontSize:15,fontWeight:600,color:"white",lineHeight:1.25,overflowWrap:"anywhere"};
  const rightCell=(right||rightAction)&&(
    <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:9,flexShrink:0,zIndex:1}}>
      {right&&<div style={{flexShrink:0}}>{right}</div>}
      {rightAction&&<button type="button" onClick={rightAction.fn} style={{background:"rgba(255,255,255,.18)",border:"none",color:"white",borderRadius:8,padding:"8px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600,flexShrink:0,minHeight:44}}>{rightAction.label}</button>}
    </div>
  );
  return(
    <div style={{padding:slim?"10px 14px":"12px 14px",display:"flex",alignItems:"center",gap:9,background:bg||`linear-gradient(135deg,${C.navy},${C.greenDark})`,flexShrink:0,position:"relative"}}>
      <div style={{display:"flex",alignItems:"center",gap:9,flexShrink:0,zIndex:1}}>
        {onBack&&<button type="button" onClick={onBack} style={{width:44,height:44,borderRadius:10,background:"rgba(255,255,255,.18)",border:"none",color:"white",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}} aria-label="Tilbake">‹</button>}
        {showBackLabel&&<span className="fr" style={{...titleStyle,flexShrink:0}}>{backLabelTrim}</span>}
      </div>
      {centerTitle&&showTitle?(
        <span className="fr" style={{
          ...titleStyle,
          position:"absolute",left:0,right:0,textAlign:"center",pointerEvents:"none",boxSizing:"border-box",
          paddingLeft:showBackLabel?200:(onBack?52:16),
          paddingRight:(right||rightAction)?125:52,
        }}>{titleStr}</span>
      ):showTitle?(
        <span className="fr" style={{...titleStyle,flex:1,minWidth:0}}>{titleStr}</span>
      ):(
        <span style={{flex:1,minWidth:0}} aria-hidden="true"/>
      )}
      {rightCell}
    </div>
  );
}
function BNav({active,onNav,items}){
  return(
    <nav className="bnav">
      {items.map(it=>(
        <button type="button" key={it.id+it.label} className="bi" onClick={()=>onNav(it.id)}>
          <span style={{fontSize:20,lineHeight:1}} aria-hidden>{it.icon}</span>
          <span className="bi-lbl" style={{fontWeight:active===it.id?600:400,color:active===it.id?C.green:C.soft}}>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

function ModalPortal({ children, overlayStyle }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const safePad = "max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))";
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        padding: safePad,
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        ...overlayStyle
      }}
    >
      {children}
    </div>,
    document.body
  );
}

/** Kort modal: tagline + «Hva inngår» for tjenestekort (hjem, landing, bestill steg 0). */
function TjenesteMerinfoModal({ service, accent, onClose, onFortsett, fortsettLabel }){
  if(!service) return null;
  const ac=accent||(service.cat==="barsel"?C.gold:C.green);
  return(
    <ModalPortal overlayStyle={{background:"rgba(0,0,0,.48)",padding:20}}>
      <div style={{background:"white",borderRadius:18,width:"100%",maxWidth:400,maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.22)",border:`1px solid ${C.border}`}}>
        <div style={{padding:"16px 18px",background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,borderRadius:"18px 18px 0 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12,minWidth:0}}>
            <div style={{width:44,height:44,borderRadius:11,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{service.icon}</div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:15,fontWeight:700,color:"white",lineHeight:1.25}}>{service.name}</div>
              {service.tagline?(
                <div style={{fontSize:11,color:"rgba(255,255,255,.72)",fontStyle:"italic",marginTop:6,lineHeight:1.45}}>{service.tagline}</div>
              ):null}
            </div>
          </div>
          <button type="button" onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:18,lineHeight:1,flexShrink:0}} aria-label="Lukk">×</button>
        </div>
        <div style={{padding:"16px 18px 18px"}}>
          <div style={{fontSize:10,fontWeight:700,color:C.soft,textTransform:"uppercase",letterSpacing:.6,marginBottom:8}}>Hva inngår</div>
          {(service.inkluderer&&service.inkluderer.length)?(
            <ul style={{margin:0,paddingLeft:18,fontSize:12,color:C.navyMid,lineHeight:1.55}}>
              {service.inkluderer.map((punkt,i)=><li key={i} style={{marginBottom:4}}>{punkt}</li>)}
            </ul>
          ):(
            <div style={{fontSize:12,color:C.soft,fontStyle:"italic"}}>Ingen punkter lagt inn ennå.</div>
          )}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:16,paddingTop:12,borderTop:`1px solid ${C.border}`}}>
            <div>
              <div style={{fontSize:10,color:C.soft}}>Pris · varighet</div>
              <div style={{fontSize:14,fontWeight:700,color:ac}}>fra {service.price} kr · {service.duration} min</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button type="button" onClick={onClose} style={{flex:1,padding:"10px 0",fontSize:12,borderRadius:10,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Lukk</button>
            <button type="button" onClick={()=>{onFortsett?.(service);onClose?.();}} className="btn bp" style={{flex:1,padding:"10px 0",fontSize:12,borderRadius:10,fontFamily:"inherit",fontWeight:600,background:ac,border:`1px solid ${ac}`}}>
              {fortsettLabel||"Fortsett"}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
const BN_K=[{id:"hjem",icon:"🏠",label:"Hjem"},{id:"bestill",icon:"➕",label:"Bestill"},{id:"mine",icon:"📋",label:"Mine"},{id:"chat-kunde",icon:"💬",label:"Chat"},{id:"kunde-profil",icon:"👤",label:"Profil"}];
/** Gyldige `active`-id'er for BN_K (alle faner) */
const KUNDE_NAV_TAB_IDS=new Set(BN_K.map(t=>t.id));
/**
 * Skjermer som skal vise kunde-bunnnav (+ DeskNav): hovedfaner og kun bestill steg 0.
 * Ikke: bestill steg 1–3, avtaledetaljer, øvrige dybdeskjermer med tilbake-pil.
 */
const KUNDE_NAV_SHELL_ROOT_IDS=new Set(["hjem","bestill","mine","chat-kunde","kunde-profil"]);
function KundeNavShell({active,onNav}){
  if(!KUNDE_NAV_SHELL_ROOT_IDS.has(active)||!KUNDE_NAV_TAB_IDS.has(active))return null;
  return(<>
    <BNav active={active} onNav={onNav} items={BN_K}/>
    <DeskNav active={active} onNav={onNav} items={BN_K} title="EiraNova"/>
  </>);
}

// ══ KUNDE ═════════════════════════════════════════════════════
// ── Global Toast system ────────────────────────────────────────
function useToast(){
  const[toasts,setToasts]=useState([]);
  const toast=(msg,type="ok",dur=2400)=>{
    const id=Date.now();
    setToasts(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),dur);
  };
  const ToastContainer=()=>(
    <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",zIndex:9999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none",minWidth:220,maxWidth:340}}>
      {toasts.map(t=>(
        <div key={t.id} style={{padding:"10px 18px",borderRadius:12,fontSize:12,fontWeight:600,color:"white",textAlign:"center",
          background:t.type==="ok"?C.green:t.type==="err"?C.danger:t.type==="warn"?C.gold:"#1A2E24",
          boxShadow:"0 4px 20px rgba(0,0,0,.25)",animation:"fadeInUp .2s ease"}}>
          {t.type==="ok"?"✓ ":t.type==="err"?"✗ ":t.type==="warn"?"⚠ ":""}{t.msg}
        </div>
      ))}
    </div>
  );
  return{toast,ToastContainer};
}

// ══ PUSH-TILLATELSE ═══════════════════════════════════════════
function PushTillatelse({onNav,kundeOnValg}){
  const handleValg=(allow)=>{
    if(kundeOnValg)kundeOnValg(allow);
    else onNav("samtykke");
  };
  return(
    <div className="phone fu" style={{background:C.cream}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 28px",textAlign:"center"}}>
        <div style={{width:80,height:80,borderRadius:24,background:`linear-gradient(135deg,${C.green},${C.greenDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,marginBottom:24,boxShadow:`0 8px 30px ${C.green}44`}}>🔔</div>
        <div className="fr" style={{fontSize:22,fontWeight:700,color:C.navy,marginBottom:10}}>Hold deg oppdatert</div>
        <div style={{fontSize:13,color:C.soft,lineHeight:1.7,marginBottom:28}}>
          Vi sender deg varsler når sykepleieren er på vei, hvis tidspunktet endres, eller ved viktige beskjeder om dine bestillinger.
        </div>
        <div style={{width:"100%",display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
          {[
            {icon:"🚶",tekst:"Sykepleieren er på vei til deg"},
            {icon:"⏰",tekst:"Påminnelse 1 time før besøk"},
            {icon:"📋",tekst:"Ny bestilling bekreftet"},
            {icon:"🔄",tekst:"Endringer i ditt oppdrag"},
          ].map(v=>(
            <div key={v.tekst} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"white",borderRadius:12,border:`1px solid ${C.border}`,textAlign:"left"}}>
              <span style={{fontSize:20}}>{v.icon}</span>
              <span style={{fontSize:12,color:C.navy,fontWeight:500}}>{v.tekst}</span>
              <span style={{marginLeft:"auto",fontSize:10,color:C.green,fontWeight:600}}>✓</span>
            </div>
          ))}
        </div>
        <button onClick={()=>handleValg(true)} className="btn bp" style={{width:"100%",padding:"14px 0",fontSize:14,borderRadius:13,marginBottom:10}}>
          🔔 Tillat varsler
        </button>
        <button onClick={()=>handleValg(false)} style={{background:"none",border:"none",color:C.soft,fontSize:11,cursor:"pointer",fontFamily:"inherit",padding:"4px 0"}}>
          Ikke nå — spør meg senere
        </button>
      </div>
    </div>
  );
}

// ══ SAMTYKKE & VILKÅR ═══════════════════════════════════════════
function Samtykke({onNav,kundeOnFortsett}){
  const[gdpr,setGdpr]=useState(false);
  const[vilkaar,setVilkaar]=useState(false);
  const[markedsf,setMarkedsf]=useState(false);
  const[lagrerFeil,setLagrerFeil]=useState("");
  const[visGdpr,setVisGdpr]=useState(false);
  const[visVilkaar,setVisVilkaar]=useState(false);
  const kanFortsette=gdpr&&vilkaar;

  if(visGdpr)return(
    <div className="phone fu">
      <PH title="Personvernerklæring" onBack={()=>setVisGdpr(false)} backLabel="Samtykke" centerTitle/>
      <div className="sa" style={{padding:"16px 18px"}}>
        <div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:12}}>EiraNova Personvernerklæring</div>
        {[
          {t:"Hvilke data samler vi inn?",txt:"Navn, e-post, adresse og betalingsinformasjon ved registrering. Helsedata knyttet til dine bestillinger behandles konfidensielt og deles kun med tildelt sykepleier."},
          {t:"Grunnlaget for behandlingen",txt:"Behandling av helsedata skjer med ditt eksplisitte samtykke (GDPR art. 9(2)(a)) og for å oppfylle avtalen om helsetjenester (art. 6(1)(b))."},
          {t:"Dine rettigheter",txt:"Du har rett til innsyn, retting, sletting (art. 17), begrensning og dataportabilitet. Du kan trekke samtykket når som helst. Se Profil → Personvern for å utøve dine rettigheter."},
          {t:"Lagringstid",txt:"Data slettes 3 år etter siste oppdrag, med unntak av det vi er lovpålagt å beholde (regnskapsdata 5 år). Anonymiserte statistikkdata beholdes uten tidsbegrensning."},
          {t:"Kontakt",txt:"Vi er personvernansvarlig. Kontakt: lise@eiranova.no · Datatilsynet: datatilsynet.no"},
        ].map(s=>(
          <div key={s.t} style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:C.navy,marginBottom:4}}>{s.t}</div>
            <div style={{fontSize:11,color:C.navyMid,lineHeight:1.7}}>{s.txt}</div>
          </div>
        ))}
        <button onClick={()=>{setGdpr(true);setVisGdpr(false);}} className="btn bp" style={{width:"100%",padding:"12px 0",fontSize:13,borderRadius:11,marginTop:8}}>
          ✓ Jeg har lest og forstått
        </button>
      </div>
    </div>
  );

  if(visVilkaar)return(
    <div className="phone fu">
      <PH title="Vilkår for bruk" onBack={()=>setVisVilkaar(false)} backLabel="Samtykke" centerTitle/>
      <div className="sa" style={{padding:"16px 18px"}}>
        <div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:12}}>Vilkår for bruk — EiraNova</div>
        {[
          {t:"Tjenestebeskrivelse",txt:"EiraNova AS formidler hjemmehelsetjenester fra kvalifiserte sykepleiere og hjelpepleiere. Vi er ikke et helseforetak, men en formidlingsplattform underlagt helsepersonelloven."},
          {t:"Bestilling og betaling",txt:"Bestillinger er bindende etter bekreftelse. Avlysning innen 24 timer er gratis. Kortere varsel medfører gebyr etter kanselleringsreglene som vises ved bestilling."},
          {t:"Ansvarsbegrensning",txt:"EiraNova er ansvarlig for at tjenesteyterne har godkjente kvalifikasjoner. Vi er ikke ansvarlig for skade som oppstår utenfor tjenestens omfang slik det er beskrevet i instruksene."},
          {t:"Klage og reklamasjon",txt:"Klager behandles innen 5 virkedager. Kunden har rett til refusjon ved dokumenterte avvik fra tjenestebeskrivelsen. Kontakt: post@eiranova.no"},
        ].map(s=>(
          <div key={s.t} style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:C.navy,marginBottom:4}}>{s.t}</div>
            <div style={{fontSize:11,color:C.navyMid,lineHeight:1.7}}>{s.txt}</div>
          </div>
        ))}
        <button onClick={()=>{setVilkaar(true);setVisVilkaar(false);}} className="btn bp" style={{width:"100%",padding:"12px 0",fontSize:13,borderRadius:11,marginTop:8}}>
          ✓ Jeg godtar vilkårene
        </button>
      </div>
    </div>
  );

  return(
    <div className="phone fu" style={{background:C.cream}}>
      <div style={{padding:"28px 22px 20px",background:`linear-gradient(160deg,${C.navy},${C.greenDark})`,textAlign:"center"}}>
        <div className="fr" style={{fontSize:20,fontWeight:700,color:"white",marginBottom:4}}>Eira<span style={{color:"#E8C4A4"}}>Nova</span></div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>Nesten klar — godkjenn for å fortsette</div>
      </div>
      <div className="sa" style={{padding:"20px 20px"}}>
        <div className="fr" style={{fontSize:15,fontWeight:700,color:C.navy,marginBottom:4}}>Vi trenger ditt samtykke</div>
        <div style={{fontSize:11,color:C.soft,marginBottom:20,lineHeight:1.6}}>Les gjennom og godkjenn for å opprette konto. De to første er påkrevd.</div>

        {/* Påkrevde */}
        {[
          {key:"gdpr",label:"Personvernerklæring",sub:"Behandling av dine helsedata (GDPR art. 9)",required:true,val:gdpr,set:setGdpr,les:()=>setVisGdpr(true)},
          {key:"vilkaar",label:"Vilkår for bruk",sub:"Avbestillingsregler, ansvar og reklamasjon",required:true,val:vilkaar,set:setVilkaar,les:()=>setVisVilkaar(true)},
        ].map(s=>(
          <div key={s.key} style={{background:"white",borderRadius:13,padding:"13px 15px",marginBottom:10,border:`2px solid ${s.val?C.green:C.border}`}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div onClick={()=>s.set(v=>!v)} style={{width:22,height:22,borderRadius:6,border:`2px solid ${s.val?C.green:C.border}`,background:s.val?C.green:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginTop:1}}>
                {s.val&&<span style={{fontSize:12,color:"white",fontWeight:700}}>✓</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                  <span style={{fontSize:12,fontWeight:600,color:C.navy}}>{s.label}</span>
                  <span style={{fontSize:8,background:C.dangerBg,color:C.danger,padding:"1px 6px",borderRadius:50,fontWeight:700}}>PÅKREVD</span>
                </div>
                <div style={{fontSize:10,color:C.soft}}>{s.sub}</div>
              </div>
              <button onClick={s.les} style={{fontSize:10,color:C.green,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600,flexShrink:0}}>Les →</button>
            </div>
          </div>
        ))}

        {/* Valgfri */}
        <div style={{background:"white",borderRadius:13,padding:"13px 15px",marginBottom:20,border:`1.5px solid ${C.border}`,opacity:.9}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
            <div onClick={()=>setMarkedsf(v=>!v)} style={{width:22,height:22,borderRadius:6,border:`2px solid ${markedsf?C.green:C.border}`,background:markedsf?C.green:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginTop:1}}>
              {markedsf&&<span style={{fontSize:12,color:"white",fontWeight:700}}>✓</span>}
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                <span style={{fontSize:12,fontWeight:600,color:C.navy}}>Markedsføring</span>
                <span style={{fontSize:8,background:C.softBg,color:C.soft,padding:"1px 6px",borderRadius:50,fontWeight:700}}>VALGFRI</span>
              </div>
              <div style={{fontSize:10,color:C.soft}}>Nyttige tips og tilbud fra EiraNova på e-post</div>
            </div>
          </div>
        </div>

        {lagrerFeil&&<div style={{fontSize:11,color:C.danger,marginBottom:8}}>{lagrerFeil}</div>}
        <button onClick={async()=>{
          if(!kanFortsette)return;
          if(kundeOnFortsett){
            setLagrerFeil("");
            const r=await kundeOnFortsett({gdpr,vilkaar,markedsf:markedsf});
            if(r&&r.error)setLagrerFeil(r.error);
            return;
          }
          onNav("epost-bekreftelse");
        }} className="btn bp" style={{width:"100%",padding:"14px 0",fontSize:14,borderRadius:13,marginBottom:10,opacity:kanFortsette?1:.4}}>
          Godkjenn og fortsett →
        </button>
        <div style={{fontSize:9,color:C.soft,textAlign:"center",lineHeight:1.6}}>
          Du kan trekke samtykket når som helst under Profil → Personvern
        </div>
      </div>
    </div>
  );
}

// ══ E-POST BEKREFTELSE (etter samtykke, før onboarding) ════════
function EpostBekreftelse({onNav,regEpost}){
  const{toast,ToastContainer}=useToast();
  const vistEpost=(regEpost&&String(regEpost).trim())||"din e-postadresse";
  return(
    <div className="phone fu" style={{background:C.cream}}>
      <ToastContainer/>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 28px",textAlign:"center",maxWidth:540,margin:"0 auto",width:"100%"}}>
        <div style={{width:80,height:80,borderRadius:24,background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:22,border:`1px solid ${C.border}`}}>📧</div>
        <div className="fr" style={{fontSize:22,fontWeight:700,color:C.navy,marginBottom:10}}>Sjekk e-posten din</div>
        <div style={{fontSize:13,color:C.soft,lineHeight:1.7,marginBottom:26,maxWidth:400}}>
          Vi har sendt en bekreftelseslink til <strong style={{color:C.navy}}>{vistEpost}</strong>. Klikk lenken for å aktivere kontoen.
        </div>
        <button type="button" onClick={()=>onNav("onboarding")} className="btn bp" style={{width:"100%",maxWidth:400,padding:"14px 0",fontSize:14,borderRadius:13,marginBottom:12}}>
          Jeg har bekreftet e-posten →
        </button>
        <button type="button" onClick={()=>toast("Ny e-post sendt!","ok")} style={{background:"none",border:"none",color:C.green,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600,textDecoration:"underline"}}>
          Send på nytt
        </button>
      </div>
    </div>
  );
}

// ══ ONBOARDING ════════════════════════════════════════════════
function Onboarding({onNav,kundeOnboarding}){
  const[steg,setSteg]=useState(0);
  const[hvem,setHvem]=useState(null);       // "meg_selv" | "parorende"
  const[adresse,setAdresse]=useState("");
  const[postnr,setPostnr]=useState("");
  const[poststed,setPoststed]=useState("");
  const[navn,setNavn]=useState("");
  const[obFeil,setObFeil]=useState("");

  const steger=[
    {id:"hvem",    tittel:"Hvem skal motta hjelp?", sub:"Vi tilpasser opplevelsen for deg"},
    {id:"adresse", tittel:"Hvilken adresse?",        sub:"Sykepleieren møter opp her"},
    {id:"klar",    tittel:"Alt er klart! 🎉",         sub:"Du kan nå bestille din første tjeneste"},
  ];
  const S=steger[steg];

  const progressW=`${Math.round((steg/(steger.length-1))*100)}%`;

  return(
    <div className="phone fu" style={{background:C.cream}}>
      {/* Progress */}
      <div style={{height:3,background:C.border,flexShrink:0}}>
        <div style={{height:"100%",background:C.green,width:progressW,transition:"width .4s ease"}}/>
      </div>
      <div style={{padding:"16px 20px 0",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:10,color:C.soft}}>{steg+1} av {steger.length}</span>
        {steg<steger.length-1&&(
          <button onClick={()=>onNav("hjem")} style={{fontSize:10,color:C.soft,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Hopp over</button>
        )}
      </div>

      <div className="sa" style={{padding:"20px 22px",display:"flex",flexDirection:"column"}}>
        <div style={{marginBottom:24}}>
          <div className="fr" style={{fontSize:20,fontWeight:700,color:C.navy,marginBottom:6}}>{S.tittel}</div>
          <div style={{fontSize:12,color:C.soft,lineHeight:1.6}}>{S.sub}</div>
        </div>

        {/* Steg 0: Hvem */}
        {steg===0&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[
              {key:"meg_selv",icon:"🧓",tittel:"Meg selv",sub:"Jeg ønsker hjelp til meg selv hjemme"},
              {key:"parorende",icon:"👨‍👩‍👧",tittel:"En pårørende",sub:"Jeg bestiller hjelp til et familiemedlem"},
            ].map(v=>(
              <div key={v.key} onClick={()=>setHvem(v.key)}
                style={{background:"white",borderRadius:14,padding:"16px",border:`2px solid ${hvem===v.key?C.green:C.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"all .15s"}}>
                <div style={{width:50,height:50,borderRadius:14,background:hvem===v.key?C.greenBg:C.softBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{v.icon}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:2}}>{v.tittel}</div>
                  <div style={{fontSize:11,color:C.soft}}>{v.sub}</div>
                </div>
                {hvem===v.key&&<div style={{marginLeft:"auto",width:22,height:22,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:12,fontWeight:700}}>✓</div>}
              </div>
            ))}
            {hvem==="parorende"&&(
              <div style={{marginTop:4}}>
                <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Navn på pårørende</label>
                <input value={navn} onChange={e=>setNavn(e.target.value)} className="inp" placeholder="Ola Nordmann"/>
              </div>
            )}
          </div>
        )}

        {/* Steg 1: Adresse */}
        {steg===1&&(
          <div>
            <div style={{background:"white",borderRadius:13,padding:"16px",border:`1.5px solid ${C.border}`,marginBottom:12}}>
              <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:6}}>Gateadresse</label>
              <input value={adresse} onChange={e=>setAdresse(e.target.value)} className="inp" placeholder="Storgata 12" style={{marginBottom:8}}/>
              <div style={{display:"grid",gridTemplateColumns:"100px 1fr",gap:8}}>
                <input value={postnr} onChange={e=>setPostnr(e.target.value)} className="inp" placeholder="1500"/>
                <input value={poststed} onChange={e=>setPoststed(e.target.value)} className="inp" placeholder="Moss"/>
              </div>
            </div>
            <div style={{background:C.greenXL,borderRadius:10,padding:"10px 13px",fontSize:10,color:C.navyMid,lineHeight:1.6}}>
              📍 Vi bruker adressen til å finne sykepleiere i ditt område og gi sykepleieren veibeskrivelse.
            </div>
          </div>
        )}

        {/* Steg 2: Klar */}
        {steg===2&&(
          <div style={{textAlign:"center"}}>
            <div style={{width:90,height:90,borderRadius:24,background:`linear-gradient(135deg,${C.green},${C.greenDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,margin:"0 auto 20px",boxShadow:`0 10px 30px ${C.green}44`}}>🌿</div>
            <div style={{fontSize:14,fontWeight:600,color:C.navy,marginBottom:8}}>
              Velkommen{hvem==="parorende"&&navn?`, og hei til ${navn}!`:"!"}
            </div>
            <div style={{fontSize:11,color:C.soft,lineHeight:1.7}}>
              Du er klar til å bestille din første tjeneste. Sykepleieren møter deg hjemme, i ro og mak.
            </div>
          </div>
        )}
      </div>

      {/* Navigasjon */}
      {obFeil&&<div style={{padding:"0 22px 8px",fontSize:11,color:C.danger}}>{obFeil}</div>}
      <div style={{padding:"16px 22px 24px",flexShrink:0}}>
        {steg<steger.length-1?(
          <button onClick={async()=>{
            setObFeil("");
            if(steg===0){
              if(!hvem)return;
              if(hvem==="parorende"&&(!String(navn||"").trim())){
                setObFeil("Skriv inn navn på pårørende.");
                return;
              }
              if(kundeOnboarding?.onSteg0Neste){
                const r=await kundeOnboarding.onSteg0Neste({hvem,navn:String(navn||"").trim()});
                if(r&&r.error){setObFeil(r.error);return;}
                setSteg(s=>s+1);
                return;
              }
              if(hvem)setSteg(s=>s+1);
            }else{
              if(!String(adresse||"").trim()||!String(postnr||"").trim()||!String(poststed||"").trim()){
                setObFeil("Fyll inn adresse, postnummer og poststed.");
                return;
              }
              if(kundeOnboarding?.onSteg1Neste){
                const r=await kundeOnboarding.onSteg1Neste({adresse:String(adresse).trim(),postnr:String(postnr).trim(),poststed:String(poststed).trim()});
                if(r&&r.error){setObFeil(r.error);return;}
                setSteg(s=>s+1);
                return;
              }
              if(adresse)setSteg(s=>s+1);
            }
          }} className="btn bp" style={{width:"100%",padding:"14px 0",fontSize:14,borderRadius:13,opacity:(steg===0?(hvem&&(hvem!=="parorende"||String(navn||"").trim())):(String(adresse||"").trim()&&String(postnr||"").trim()&&String(poststed||"").trim()))?1:.4}}>
            {steg===0?"Neste →":"Lagre adresse →"}
          </button>
        ):(
          <button onClick={()=>{
            if(kundeOnboarding?.onFerdig)kundeOnboarding.onFerdig();
            else onNav("hjem");
          }} className="btn bp" style={{width:"100%",padding:"14px 0",fontSize:14,borderRadius:13}}>
            Bestill din første tjeneste →
          </button>
        )}
      </div>
    </div>
  );
}

// ══ GLEMT PASSORD ══════════════════════════════════════════════
function GlemtPassord({onNav,nurseMode=false,kundeSendReset}){
  const[steg,setSteg]=useState("epost"); // epost | sendt
  const[epost,setEpost]=useState("");
  const[validerFeil,setValiderFeil]=useState("");
  const tilbakeLogin=()=>onNav(nurseMode?"nurse-login":"login");
  const sendLenke=async()=>{
    setValiderFeil("");
    const e=String(epost).trim();
    if(!e){setValiderFeil("Skriv inn e-postadressen.");return;}
    if(nurseMode){
      if(!e.toLowerCase().endsWith("@eiranova.no")){
        setValiderFeil("Kun @eiranova.no-kontoer kan tilbakestille passord her");
        return;
      }
    }else if(!erGyldigEpost(e)){
      setValiderFeil("Ugyldig e-postformat.");
      return;
    }
    if(kundeSendReset){
      await kundeSendReset(e);
      setSteg("sendt");
      return;
    }
    setSteg("sendt");
  };
  if(steg==="sendt")return(
    <div className="phone fu" style={{background:C.cream}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 28px",textAlign:"center"}}>
        <div style={{width:72,height:72,borderRadius:20,background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,marginBottom:20}}>📧</div>
        <div className="fr" style={{fontSize:20,fontWeight:700,color:C.navy,marginBottom:8}}>Sjekk innboksen</div>
        <div style={{fontSize:13,fontWeight:600,color:C.navy,lineHeight:1.5,marginBottom:16,maxWidth:340}}>
          {kundeSendReset
            ? "Hvis e-posten er registrert hos oss, har vi sendt en lenke for å tilbakestille passordet."
            : `Reset-lenke sendt til ${epost}`}
        </div>
        <div style={{background:C.greenXL,borderRadius:10,padding:"10px 14px",fontSize:10,color:C.navyMid,lineHeight:1.6,marginBottom:28,width:"100%"}}>
          Lenken er gyldig i 30 minutter. Sjekk spam-mappen hvis du ikke finner e-posten.
        </div>
        <button onClick={tilbakeLogin} style={{fontSize:12,color:C.green,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>← Tilbake til innlogging</button>
      </div>
    </div>
  );
  return(
    <div className="phone fu" style={{background:C.cream}}>
      <div style={{padding:"24px 20px 20px",background:`linear-gradient(160deg,${C.navy},${C.greenDark})`}}>
        <button onClick={tilbakeLogin} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit",marginBottom:12}}>← Tilbake</button>
        <div className="fr" style={{fontSize:18,fontWeight:600,color:"white",marginBottom:2}}>Glemt passord?</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>Vi sender deg en lenke for å opprette nytt passord</div>
      </div>
      <div style={{padding:"24px 20px"}}>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:5}}>Din e-postadresse</label>
          <input value={epost} onChange={e=>{setEpost(e.target.value);if(validerFeil)setValiderFeil("");}} className="inp" type="email" placeholder={nurseMode?"fornavn@eiranova.no":"ola@example.com"}/>
        </div>
        {validerFeil&&<div style={{fontSize:12,color:C.danger,marginTop:-8,marginBottom:12}}>{validerFeil}</div>}
        <button type="button" onClick={sendLenke} className="btn bp" style={{width:"100%",padding:"13px 0",fontSize:13,borderRadius:11}}>
          Send tilbakestillingslenke
        </button>
      </div>
    </div>
  );
}

// ══ KUNDEPROFIL / PERSONVERN ═══════════════════════════════════
function KundeProfil({onNav}){
  const{toast,ToastContainer}=useToast();
  const[fane,setFane]=useState("profil"); // profil | personvern | betaling
  const[slettBekreft,setSlettBekreft]=useState(false);
  const[datautlevering,setDatautlevering]=useState(false);

  return(
    <div className="phone fu">
      <ToastContainer/>
      <PH title="Min profil" onBack={()=>onNav("hjem")} backLabel="Hjem" centerTitle/>

      {/* Slette-bekreftelse */}
      {slettBekreft&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.5)",padding:20}}>
          <div style={{background:"white",borderRadius:16,padding:"24px",width:"100%",maxWidth:360,boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
            <div style={{fontSize:30,textAlign:"center",marginBottom:12}}>⚠️</div>
            <div style={{fontSize:15,fontWeight:700,color:C.navy,textAlign:"center",marginBottom:8}}>Slett min konto</div>
            <div style={{fontSize:11,color:C.soft,textAlign:"center",lineHeight:1.7,marginBottom:14}}>
              Dette vil anonymisere alle dine personopplysninger i samsvar med GDPR artikkel 17. Bestillingshistorikk beholdes i anonymisert form i 5 år (regnskapskrav).
            </div>
            <div style={{background:C.dangerBg,borderRadius:9,padding:"9px 12px",fontSize:10,color:C.danger,lineHeight:1.6,marginBottom:16}}>
              ⚠️ Handlingen kan ikke angres. Du mister all tilgang og historikk.
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setSlettBekreft(false)} style={{flex:1,padding:"10px 0",fontSize:12,borderRadius:9,background:"white",border:`1.5px solid ${C.border}`,color:C.navy,cursor:"pointer",fontFamily:"inherit"}}>Avbryt</button>
              <button onClick={()=>{toast("Sletting initiert — du mottar bekreftelse på e-post","warn");setSlettBekreft(false);}} style={{flex:1,padding:"10px 0",fontSize:12,borderRadius:9,background:C.danger,color:"white",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Slett konto</button>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Data-utlevering bekreftelse */}
      {datautlevering&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.5)",padding:20}}>
          <div style={{background:"white",borderRadius:16,padding:"24px",width:"100%",maxWidth:360}}>
            <div style={{fontSize:30,textAlign:"center",marginBottom:12}}>📦</div>
            <div style={{fontSize:15,fontWeight:700,color:C.navy,textAlign:"center",marginBottom:8}}>Last ned dine data</div>
            <div style={{fontSize:11,color:C.soft,textAlign:"center",lineHeight:1.7,marginBottom:20}}>
              Vi sender deg en JSON-fil med alle data vi har om deg til din registrerte e-post innen 72 timer (GDPR art. 20).
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setDatautlevering(false)} style={{flex:1,padding:"10px 0",fontSize:12,borderRadius:9,background:"white",border:`1.5px solid ${C.border}`,color:C.navy,cursor:"pointer",fontFamily:"inherit"}}>Avbryt</button>
              <button onClick={()=>{toast("Dataeksport sendes til din e-post","ok");setDatautlevering(false);}} className="btn bp" style={{flex:1,padding:"10px 0",fontSize:12,borderRadius:9}}>Send meg data</button>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Faner */}
      <div style={{display:"flex",margin:"0 11px",marginTop:10,background:C.greenXL,borderRadius:9,padding:3,flexShrink:0}}>
        {[["profil","👤 Profil"],["betaling","💳 Betaling"],["personvern","🔒 Personvern"]].map(([k,l])=>(
          <button key={k} onClick={()=>setFane(k)} style={{flex:1,padding:"6px 4px",borderRadius:7,fontSize:10,fontWeight:fane===k?600:400,cursor:"pointer",border:"none",background:fane===k?"white":"transparent",color:fane===k?C.green:C.soft,fontFamily:"inherit",whiteSpace:"nowrap"}}>{l}</button>
        ))}
      </div>

      <div className="sa" style={{padding:"12px 14px"}}>

        {/* PROFIL */}
        {fane==="profil"&&(
          <div>
            {/* Avatar */}
            <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px",background:"white",borderRadius:14,border:`1px solid ${C.border}`,marginBottom:14}}>
              <div style={{width:56,height:56,borderRadius:"50%",background:`linear-gradient(135deg,${C.green},${C.greenDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:"white",flexShrink:0}}>AH</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:C.navy}}>Astrid Hansen</div>
                <div style={{fontSize:11,color:C.soft}}>astrid@example.com</div>
                <div style={{fontSize:10,color:C.green,marginTop:2}}>✓ Verifisert konto</div>
              </div>
              <button onClick={()=>toast("Bilde-opplasting åpner kameraet")} style={{fontSize:10,color:C.green,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Endre</button>
            </div>
            {[
              {l:"Fullt navn",v:"Astrid Hansen"},
              {l:"E-post",v:"astrid@example.com"},
              {l:"Telefon",v:"415 22 334"},
              {l:"Adresse",v:"Konggata 12, 1500 Moss"},
            ].map(f=>(
              <div key={f.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${C.border}`}}>
                <div>
                  <div style={{fontSize:10,color:C.soft,marginBottom:1}}>{f.l}</div>
                  <div style={{fontSize:12,fontWeight:600,color:C.navy}}>{f.v}</div>
                </div>
                <button onClick={()=>toast(`${f.l} kan endres`)} style={{fontSize:10,color:C.green,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Endre</button>
              </div>
            ))}
            <div style={{marginTop:14}}>
              <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:8}}>Pårørende / annen mottaker</div>
              <div style={{background:C.greenXL,borderRadius:10,padding:"11px 13px",border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:C.navy}}>Olaf Hansen</div>
                  <div style={{fontSize:10,color:C.soft}}>Far · Storgata 8, Moss</div>
                </div>
                <button onClick={()=>toast("Rediger pårørende")} style={{fontSize:10,color:C.green,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Endre</button>
              </div>
              <button onClick={()=>toast("Legg til pårørende")} style={{marginTop:8,width:"100%",padding:"9px 0",fontSize:11,borderRadius:9,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>+ Legg til pårørende</button>
            </div>
            <button type="button" onClick={()=>onNav("logout")} className="btn" style={{width:"100%",marginTop:20,padding:"12px 0",fontSize:13,borderRadius:11,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
              Logg ut
            </button>
          </div>
        )}

        {/* BETALING */}
        {fane==="betaling"&&(
          <div>
            <div style={{fontSize:11,color:C.soft,marginBottom:14,lineHeight:1.6}}>Betalingsmetoder brukt ved bestilling</div>
            {[
              {icon:"💜",label:"Vipps",detalj:"+47 415 22 334",standard:true},
              {icon:"💳",label:"Visa-kort",detalj:"•••• •••• •••• 4242",standard:false},
            ].map(b=>(
              <div key={b.label} style={{background:"white",borderRadius:12,padding:"13px 15px",marginBottom:10,border:`1.5px solid ${b.standard?C.green:C.border}`,display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:24}}>{b.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:C.navy}}>{b.label}</div>
                  <div style={{fontSize:10,color:C.soft}}>{b.detalj}</div>
                </div>
                {b.standard&&<span style={{fontSize:9,background:C.greenBg,color:C.green,padding:"2px 8px",borderRadius:50,fontWeight:600}}>Standard</span>}
                <button onClick={()=>toast(b.standard?"Allerede standard":"Satt som standard","ok")} style={{fontSize:10,color:C.soft,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>⋯</button>
              </div>
            ))}
            <button onClick={()=>toast("Legg til betalingsmetode")} style={{width:"100%",padding:"11px 0",fontSize:12,borderRadius:10,background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>+ Ny betalingsmetode</button>
          </div>
        )}

        {/* PERSONVERN / GDPR */}
        {fane==="personvern"&&(
          <div>
            <div style={{background:C.greenXL,borderRadius:10,padding:"11px 13px",marginBottom:16,fontSize:10,color:C.navyMid,lineHeight:1.65,border:`1px solid ${C.border}`}}>
              🔒 EiraNova behandler dine persondata i henhold til GDPR. Du har full kontroll over dine data til enhver tid.
            </div>
            {/* Aktive samtykker */}
            <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:10}}>Dine samtykker</div>
            {[
              {label:"Behandling av helsedata",detalj:"Nødvendig for tjenesteleveranse",dato:"Godkjent 15. jan 2026",kan_trekkes:false},
              {label:"Vilkår for bruk",detalj:"Avbestillingsregler og ansvar",dato:"Godkjent 15. jan 2026",kan_trekkes:false},
              {label:"Markedsføring",detalj:"Tips og tilbud fra EiraNova",dato:"Godkjent 15. jan 2026",kan_trekkes:true},
            ].map(s=>(
              <div key={s.label} style={{background:"white",borderRadius:11,padding:"11px 13px",marginBottom:8,border:`1px solid ${C.border}`,display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{width:16,height:16,borderRadius:4,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"white",fontWeight:700,flexShrink:0,marginTop:1}}>✓</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:1}}>{s.label}</div>
                  <div style={{fontSize:9,color:C.soft}}>{s.detalj} · {s.dato}</div>
                </div>
                {s.kan_trekkes&&(
                  <button onClick={()=>toast("Samtykke trukket — dette kan ikke angres","warn")} style={{fontSize:9,color:C.danger,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Trekk</button>
                )}
              </div>
            ))}

            {/* GDPR-rettigheter */}
            <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:10,marginTop:16}}>Dine GDPR-rettigheter</div>
            {[
              {icon:"📦",tittel:"Last ned mine data",sub:"Alle data vi har om deg (art. 20)",action:()=>setDatautlevering(true),color:C.sky},
              {icon:"🗑",tittel:"Slett min konto",sub:"Anonymisering av alle personopplysninger (art. 17)",action:()=>setSlettBekreft(true),color:C.danger},
              {icon:"📧",tittel:"Kontakt personvernombud",sub:"lise@eiranova.no",action:()=>toast("E-post åpnes"),color:C.green},
            ].map(r=>(
              <div key={r.tittel} onClick={r.action} style={{background:"white",borderRadius:11,padding:"12px 14px",marginBottom:8,border:`1.5px solid ${C.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .15s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=r.color}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <div style={{width:36,height:36,borderRadius:10,background:`${r.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{r.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{r.tittel}</div>
                  <div style={{fontSize:10,color:C.soft}}>{r.sub}</div>
                </div>
                <span style={{color:C.soft,fontSize:16}}>›</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <BNav active="kunde-profil" onNav={onNav} items={BN_K}/>
      <DeskNav active="kunde-profil" onNav={onNav} items={BN_K} title="EiraNova"/>
    </div>
  );
}

// ══ OPPDRAG I GANG (kundens perspektiv) ════════════════════════
function OppdragIGang({onNav}){
  const{toast,ToastContainer}=useToast();
  const[fase,setFase]=useState("på_vei"); // på_vei | her | ferdig
  return(
    <div className="phone fu" style={{background:C.greenXL}}>
      <ToastContainer/>
      <PH title="Oppdrag pågår" onBack={()=>onNav("hjem")} backLabel="Hjem" centerTitle slim/>
      <div className="sa" style={{padding:"14px 16px"}}>
        {/* Status-kort */}
        <div style={{background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,borderRadius:18,padding:"20px",marginBottom:14,textAlign:"center",color:"white"}}>
          <div style={{fontSize:36,marginBottom:8}}>{fase==="på_vei"?"🚶":fase==="her"?"🏠":"✅"}</div>
          <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>
            {fase==="på_vei"?"Sara er på vei til deg":fase==="her"?"Sara er ankommet":"Oppdraget er fullført"}
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.65)"}}>
            {fase==="på_vei"?"Estimert ankomst: 5–10 min":fase==="her"?"Morgensstell · Startet 08:04":"Morgensstell · 08:04–08:49 · 45 min"}
          </div>
          {fase==="på_vei"&&(
            <div style={{marginTop:14,background:"rgba(255,255,255,.12)",borderRadius:10,padding:"10px",fontSize:11,color:"rgba(255,255,255,.8)"}}>
              📍 Konggata 4 → Konggata 12 — ca 3 min
            </div>
          )}
        </div>

        {/* Sykepleier-kort */}
        <div style={{background:"white",borderRadius:14,padding:"14px",marginBottom:12,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDark},${C.sidebarAccent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"white",flexShrink:0}}>SL</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:C.navy}}>Sara Lindgren</div>
            <div style={{fontSize:10,color:C.soft}}>Autorisert sykepleier · ⭐ 4.9</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>toast("Ringer Sara...")} style={{width:38,height:38,borderRadius:"50%",background:C.greenBg,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,cursor:"pointer"}}>📞</button>
            <button onClick={()=>onNav("chat-kunde")} style={{width:38,height:38,borderRadius:"50%",background:C.greenBg,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,cursor:"pointer"}}>💬</button>
          </div>
        </div>

        {/* Tidslinje */}
        <div style={{background:"white",borderRadius:14,padding:"14px",marginBottom:12,border:`1px solid ${C.border}`}}>
          <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:12}}>Status</div>
          {[
            {fase:"bestilt",label:"Bestilling bekreftet",tid:"07:30",done:true},
            {fase:"tilordnet",label:"Sykepleier tilordnet",tid:"07:32",done:true},
            {fase:"på_vei",label:"Sykepleier på vei",tid:"07:58",done:fase!=="bestilt"},
            {fase:"her",label:"Sykepleier ankommet",tid:"08:04",done:fase==="her"||fase==="ferdig"},
            {fase:"ferdig",label:"Oppdrag fullført",tid:"08:49",done:fase==="ferdig"},
          ].map((s,i,arr)=>(
            <div key={s.fase} style={{display:"flex",gap:10,paddingBottom:i<arr.length-1?10:0}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:20}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:s.done?C.green:"#E5E7EB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"white",fontWeight:700,flexShrink:0}}>{s.done?"✓":""}</div>
                {i<arr.length-1&&<div style={{width:2,flex:1,background:s.done?C.green:"#E5E7EB",marginTop:2,minHeight:12}}/>}
              </div>
              <div style={{flex:1,paddingBottom:4}}>
                <div style={{fontSize:11,fontWeight:s.done?600:400,color:s.done?C.navy:C.soft}}>{s.label}</div>
                {s.done&&<div style={{fontSize:9,color:C.soft}}>{s.tid}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Demo-knapper */}
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {fase!=="ferdig"&&(
            <button onClick={()=>setFase(f=>f==="på_vei"?"her":"ferdig")} className="btn bp" style={{flex:1,padding:"10px 0",fontSize:11,borderRadius:10}}>
              {fase==="på_vei"?"Simuler: ankommet →":"Simuler: fullført →"}
            </button>
          )}
          {fase==="ferdig"&&(
            <button onClick={()=>onNav("hjem")} className="btn bp" style={{flex:1,padding:"10px 0",fontSize:12,borderRadius:10}}>
              ⭐ Gi vurdering
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Kunde: detalj for neste avtale (matcher mock i hjem-header for Astrid / Morgensstell) */
function KundeAvtaleDetalj({onNav}){
  const o=mockKundeNesteAvtale();
  if(!o)return(
    <div className="phone fu">
      <PH title="Avtaledetaljer" onBack={()=>onNav("hjem")} backLabel="Hjem" centerTitle/>
      <div className="sa" style={{padding:20,textAlign:"center",color:C.soft}}>Ingen kommende avtale funnet.</div>
    </div>
  );
  const betalt=o.betaltVia==="b2b"?"B2B faktura":o.betaltVia==="vipps"?"Vipps":"Kort";
  return(
    <div className="phone fu">
      <PH title="Avtaledetaljer" onBack={()=>onNav("hjem")} backLabel="Hjem" centerTitle/>
      <div className="sa" style={{padding:14}}>
        <div className="card cp" style={{marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:52,height:52,borderRadius:12,background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{o.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:10,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Kommende avtale</div>
              <div className="fr" style={{fontSize:17,fontWeight:600,color:C.navy,marginBottom:2}}>{o.service}</div>
              <div style={{fontSize:12,color:C.soft}}>{o.date} · kl. {o.time}</div>
            </div>
            <Bdg status={o.status}/>
          </div>
        </div>
        {[
          {l:"Adresse",v:o.address,icon:"📍"},
          {l:"Sykepleier",v:o.nurse,icon:"🩺"},
          {l:"Telefon (kontakt)",v:o.phone,icon:"📞"},
          {l:"Beløp",v:`${o.amount} kr (MVA-unntatt helsetjeneste)`,icon:"💰"},
          {l:"Betaling",v:betalt,icon:"🧾"},
        ].map(r=>(
          <div key={r.l} className="card cp" style={{marginBottom:10,padding:"12px 14px"}}>
            <div style={{fontSize:9,color:C.soft,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>{r.icon} {r.l}</div>
            <div style={{fontSize:13,fontWeight:600,color:C.navy}}>{r.v}</div>
          </div>
        ))}
        <div className="card cp" style={{padding:"12px 14px"}}>
          <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:8}}>Siste aktivitet</div>
          {(o.endringer||[]).slice(-2).map((e,i)=>(
            <div key={i} style={{fontSize:11,color:C.navyMid,padding:"6px 0",borderTop:i?`1px solid ${C.border}`:"none"}}>
              <span style={{color:C.soft}}>{e.dato}</span> — {e.handling}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LandB2BKontaktSeksjon({variant="mobile"}){
  const{toast,ToastContainer}=useToast();
  const[navn,setNavn]=useState("");
  const[organisasjon,setOrganisasjon]=useState("");
  const[epost,setEpost]=useState("");
  const[telefon,setTelefon]=useState("");
  const[antall,setAntall]=useState("");
  const desktop=variant==="desktop";
  const onSubmit=e=>{
    e.preventDefault();
    toast("Takk! Vi tar kontakt med deg innen 1 virkedag.","ok");
    // TODO: Resend - varsle oss om ny B2B-henvendelse
    setNavn("");setOrganisasjon("");setEpost("");setTelefon("");setAntall("");
  };
  const fordel=(ikon,tekst)=>(
    <div key={tekst} style={{display:"flex",alignItems:"flex-start",gap:desktop?12:10,flex:desktop?1:undefined,minWidth:desktop?0:"100%"}}>
      <div style={{width:desktop?40:36,height:desktop?40:36,borderRadius:10,background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:desktop?18:16,flexShrink:0}}>{ikon}</div>
      <div style={{fontSize:desktop?13:12,fontWeight:600,color:C.navy,lineHeight:1.45,paddingTop:desktop?2:0}}>{tekst}</div>
    </div>
  );
  return(
    <section id="b2b-kontakt" style={{background:desktop?"linear-gradient(180deg,#F6FAF8 0%,#EDF5F1 100%)":"linear-gradient(160deg,#F4FAF7,#EEF6F1)",padding:desktop?"56px 40px":"28px 14px 32px",borderTop:desktop?`1px solid ${C.border}`:undefined}}>
      <ToastContainer/>
      <div style={desktop?{maxWidth:1200,margin:"0 auto"}:undefined}>
        <div style={{textAlign:desktop?"center":"left",marginBottom:desktop?36:18}}>
          <div className="fr" style={{fontSize:desktop?30:20,fontWeight:600,color:C.navy,marginBottom:desktop?10:6,lineHeight:1.2}}>Er dere en kommune, borettslag eller bedrift?</div>
          <div style={{fontSize:desktop?16:13,color:C.soft,maxWidth:560,margin:desktop?"0 auto":undefined,lineHeight:1.55}}>
            Vi tar oss av alt det praktiske — dere fokuserer på menneskene.
          </div>
        </div>
        <div style={{display:"flex",flexDirection:desktop?"row":"column",gap:desktop?20:16,marginBottom:desktop?32:20,justifyContent:"center"}}>
          {fordel("🧾","Samlefaktura (EHF)")}
          {fordel("🤝","Dedikert koordinator")}
          {fordel("👥","Fleksibelt antall brukere")}
        </div>
        <form onSubmit={onSubmit} className="card" style={{maxWidth:desktop?480:"100%",margin:desktop?"0 auto":undefined,padding:desktop?26:18,borderRadius:16,boxShadow:desktop?"0 8px 32px rgba(30,58,47,.08)":undefined}}>
          <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:14,lineHeight:1.5}}>
            Legg igjen et par detaljer — ingen forpliktelser. Vi tar en kort prat for å forstå behovene deres.
          </div>
          {[
            ["Navn",navn,setNavn,"text","Ola Nordmann"],
            ["Organisasjon",organisasjon,setOrganisasjon,"text","F.eks. kommunenavn eller AS"],
            ["E-post",epost,setEpost,"email","kontakt@organisasjon.no"],
            ["Telefon",telefon,setTelefon,"tel","900 00 000"],
          ].map(([label,val,setV,type,ph])=>(
            <div key={label} style={{marginBottom:12}}>
              <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>{label}</label>
              <input className="inp" type={type} placeholder={ph} value={val} onChange={e=>setV(e.target.value)}/>
            </div>
          ))}
          <div style={{marginBottom:16}}>
            <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Antall brukere (ca.)</label>
            <input className="inp" type="text" inputMode="numeric" placeholder="F.eks. 10" value={antall} onChange={e=>setAntall(e.target.value)}/>
          </div>
          <button type="submit" className="btn bp bf" style={{width:"100%",padding:desktop?14:12,borderRadius:12,fontSize:desktop?14:13,fontWeight:600}}>
            Ta kontakt — vi ringer deg innen 1 virkedag
          </button>
        </form>
      </div>
    </section>
  );
}

function LandKundeMobile({onNav,services=DEFAULT_KUNDE_SERVICES,nurses=NURSES}){
  const[merinfo,setMerinfo]=useState(null);
  return(
      <div className="land-kunde-mobile phone fu">
        <div style={{padding:"32px 18px 28px",background:"linear-gradient(160deg,#1E3A2F 0%,#2C5C52 60%,#1E3A2F 100%)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:22}}>
            <div style={{width:38,height:38,borderRadius:10,background:"rgba(255,255,255,.14)",border:"1px solid rgba(255,255,255,.24)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🤲</div>
            <div>
              <div className="fr" style={{fontSize:20,fontWeight:600,color:"white"}}>Eira<span style={{color:"#E8C4A4"}}>Nova</span></div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.6)",fontStyle:"italic"}}>Faglig trygghet. Menneskelig nærhet.</div>
            </div>
          </div>
          <div style={{display:"inline-flex",alignItems:"center",gap:4,background:"rgba(232,164,164,.2)",border:"1px solid rgba(232,164,164,.35)",borderRadius:50,padding:"3px 11px",marginBottom:12,fontSize:10,fontWeight:500,color:"#F2C4C4"}}>♡ Omsorg og støtte</div>
          <h1 className="fr" style={{fontSize:27,fontWeight:600,color:"white",lineHeight:1.2,marginBottom:10}}>Omsorg levert<br/><em style={{color:"#F2C4C4"}}>til din dør</em></h1>
          <p style={{fontSize:14,color:"rgba(255,255,255,.8)",lineHeight:1.6,marginBottom:18}}>Profesjonelle helsetjenester i hjemmet for eldre og nybakte mødre.</p>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <button type="button" className="btn bp" onClick={()=>onNav("bestill")} style={{flex:1,minHeight:48,padding:"12px 0",fontSize:14,borderRadius:11}}>Bestill nå</button>
            <button type="button" className="btn bg" onClick={()=>onNav("login")} style={{flex:1,minHeight:48,padding:"12px 0",fontSize:14,borderRadius:11}}>Logg inn</button>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["✓ Autorisert","📍 7 kommuner","⭐ 4.9/5"].map(p=><div key={p} style={{background:"rgba(255,255,255,.15)",borderRadius:50,padding:"3px 10px",fontSize:10,fontWeight:500,color:"white"}}>{p}</div>)}
          </div>
        </div>
        <div className="sa" style={{background:C.cream}}>
          <div style={{padding:"16px 14px 8px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{width:26,height:26,borderRadius:7,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🏡</div>
              <span className="fr" style={{fontSize:15,fontWeight:600,color:C.navy}}>Eldre & Pårørende</span>
            </div>
            {services.filter(s=>s.cat==="eldre").map(sv=>(
              <div key={sv.type} onClick={()=>setMerinfo(sv)} className="card" style={{marginBottom:6,padding:"10px 12px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
                <div style={{width:36,height:36,borderRadius:9,background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{sv.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:C.navy}}>{sv.name}</div>
                  {sv.tagline?<div style={{fontSize:10,color:C.soft,fontStyle:"italic",lineHeight:1.35,marginTop:2}}>{sv.tagline}</div>:null}
                </div>
                <div style={{fontSize:10,fontWeight:500,color:C.green,flexShrink:0}}>fra {sv.price} kr</div>
              </div>
            ))}
          </div>
          <div style={{margin:"4px 14px 14px",background:"linear-gradient(135deg,#FDF0F0,#FDF5EE)",borderRadius:14,padding:13,border:"0.5px solid #F2C4C4"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}>
              <div style={{width:28,height:28,borderRadius:7,background:C.rose,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤱</div>
              <span className="fr" style={{fontSize:15,fontWeight:600,color:C.navy}}>Barselstøtte</span>
            </div>
            {services.filter(s=>s.cat==="barsel").map(sv=>(
              <div key={sv.type} onClick={()=>setMerinfo(sv)} style={{background:"white",borderRadius:8,padding:"8px 10px",display:"flex",alignItems:"center",gap:8,marginBottom:5,cursor:"pointer",border:`0.5px solid ${C.border}`}}>
                <span style={{fontSize:14}}>{sv.icon}</span>
                <span style={{fontSize:12,fontWeight:500,color:C.navy,flex:1,minWidth:0}}>
                  {sv.name}
                  {sv.tagline?<span style={{display:"block",fontSize:9,color:C.soft,fontStyle:"italic",fontWeight:400,marginTop:2,lineHeight:1.35}}>{sv.tagline}</span>:null}
                </span>
                <span style={{marginLeft:"auto",fontSize:10,color:C.gold,fontWeight:500,flexShrink:0}}>fra {sv.price} kr</span>
              </div>
            ))}
          </div>
          <div style={{padding:"0 14px 20px"}}>
            <div style={{fontSize:10,fontWeight:600,color:C.green,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Tilgjengelig i:</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {["Fredrikstad","Sarpsborg","Moss","Råde","Vestby","Ås","Ski"].map(a=>(
                <div key={a} style={{background:"white",border:`0.5px solid ${C.border}`,borderRadius:50,padding:"3px 9px",fontSize:10,color:C.navy}}>📍 {a}</div>
              ))}
            </div>
          </div>

          {/* Sykepleiere — samme seksjon som desktop, tilpasset smal skjerm */}
          <div style={{background:"white",padding:"22px 14px 28px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20,flexWrap:"wrap",gap:10}}>
              <div>
                <div className="fr" style={{fontSize:20,fontWeight:600,color:C.navy,marginBottom:4}}>Møt våre sykepleiere</div>
                <div style={{fontSize:12,color:C.soft,lineHeight:1.45}}>Autorisert helsepersonell i ditt nærområde</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,background:C.greenBg,borderRadius:50,padding:"6px 14px",flexShrink:0}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#16A34A"}}/>
                <span style={{fontSize:12,color:C.green,fontWeight:600}}>{nurses.filter(n=>n.status==="available").length} ledig nå</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr",gap:12,marginBottom:20}}>
              {nurses.map(n=>(
                <div key={n.name} className="card" style={{padding:14,display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{position:"relative",flexShrink:0}}>
                    <div style={{width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDark},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"white",border:`3px solid ${C.greenBg}`}}>{n.av}</div>
                    <div style={{position:"absolute",bottom:2,right:2,width:12,height:12,borderRadius:"50%",background:n.status==="available"?"#16A34A":n.status==="on_assignment"?C.gold:C.soft,border:"2.5px solid white"}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                      <span style={{fontSize:14,fontWeight:700,color:C.navy}}>{n.name}</span>
                      <div style={{display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
                        <span>⭐</span><span style={{fontSize:12,fontWeight:700,color:C.navy}}>{n.rating}</span>
                        <span style={{fontSize:10,color:C.soft}}>({n.antallOppdrag})</span>
                      </div>
                    </div>
                    <div style={{fontSize:11,color:C.green,fontWeight:600,marginBottom:6}}>{n.tittel} · {n.erfaring}</div>
                    <div style={{fontSize:11,color:C.soft,lineHeight:1.55,marginBottom:8}}>"{n.bio}"</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
                      {n.spesialitet.map(s=><span key={s} style={{fontSize:9,background:C.greenXL,color:C.green,padding:"3px 8px",borderRadius:5,fontWeight:500,border:`0.5px solid ${C.border}`}}>{s}</span>)}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:10,color:C.soft}}>📍 {n.omrade}</span>
                      <span style={{fontSize:10,padding:"3px 9px",borderRadius:50,fontWeight:600,
                        background:n.status==="available"?"#F0FDF4":n.status==="on_assignment"?C.goldBg:C.softBg,
                        color:n.status==="available"?"#16A34A":n.status==="on_assignment"?C.goldDark:C.soft}}>
                        {n.status==="available"?"Ledig nå":n.status==="on_assignment"?"På oppdrag":"Pause"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{textAlign:"center"}}>
              <button type="button" onClick={()=>onNav("login")} className="btn bp" style={{width:"100%",maxWidth:400,margin:"0 auto",display:"block",padding:"12px 20px",fontSize:13,fontWeight:600,borderRadius:12,cursor:"pointer",fontFamily:"inherit"}}>
                Bestill en sykepleier →
              </button>
            </div>
          </div>
          <LandB2BKontaktSeksjon variant="mobile"/>
        </div>
      {merinfo&&(
        <TjenesteMerinfoModal
          service={merinfo}
          accent={merinfo.cat==="barsel"?C.gold:C.green}
          onClose={()=>setMerinfo(null)}
          onFortsett={s=>onNav("bestill",s.type)}
          fortsettLabel="Bestill denne tjenesten"
        />
      )}
      </div>
  );
}

function LandKundeDesktop({onNav,services=DEFAULT_KUNDE_SERVICES,nurses=NURSES}){
  const[merinfo,setMerinfo]=useState(null);
  return(
      <div className="land-desktop">

        {/* ── HERO ── */}
        <div className="land-hero-shell" style={{background:"linear-gradient(135deg,#1E3A2F 0%,#2C5C52 50%,#1a3028 100%)",minHeight:"60vh",display:"flex",alignItems:"center",padding:"64px 40px"}}>
          <div className="land-hero-grid" style={{maxWidth:1200,margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center"}}>
            {/* Venstre: tekst */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:32}}>
                <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🤲</div>
                <div>
                  <div className="fr" style={{fontSize:24,fontWeight:600,color:"white",lineHeight:1}}>Eira<span style={{color:"#E8C4A4"}}>Nova</span></div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.5)",fontStyle:"italic"}}>Faglig trygghet. Menneskelig nærhet.</div>
                </div>
              </div>
              <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(232,164,164,.2)",border:"1px solid rgba(232,164,164,.4)",borderRadius:50,padding:"5px 16px",marginBottom:20,fontSize:12,fontWeight:500,color:"#F2C4C4"}}>♡ Omsorg og støtte</div>
              <h1 className="fr" style={{fontSize:56,fontWeight:600,color:"white",lineHeight:1.1,marginBottom:20}}>
                Omsorg levert<br/><em style={{color:"#F2C4C4"}}>til din dør</em>
              </h1>
              <p style={{fontSize:18,color:"rgba(255,255,255,.82)",lineHeight:1.7,marginBottom:32,maxWidth:480}}>
                Profesjonelle helsetjenester i hjemmet for eldre og nybakte mødre — med autorisert helsepersonell i ditt nærområde.
              </p>
              <div style={{display:"flex",gap:14,marginBottom:28}}>
                <button type="button" className="btn bp" onClick={()=>onNav("bestill")} style={{padding:"15px 36px",fontSize:16,borderRadius:13}}>Bestill nå</button>
                <button type="button" className="btn bg" onClick={()=>onNav("login")} style={{padding:"15px 28px",fontSize:15,borderRadius:13}}>Logg inn</button>
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {["✓ Autorisert helsepersonell","📍 7 kommuner i Østfold","⭐ 4.9 av 5 · 1000+ oppdrag"].map(p=>(
                  <div key={p} style={{background:"rgba(255,255,255,.12)",borderRadius:50,padding:"6px 16px",fontSize:12,fontWeight:500,color:"rgba(255,255,255,.9)"}}>{p}</div>
                ))}
              </div>
            </div>
            {/* Høyre: sykepleier-highlight-kort */}
            <div>
              <div style={{background:"rgba(255,255,255,.08)",borderRadius:20,padding:24,border:"1px solid rgba(255,255,255,.12)",backdropFilter:"blur(10px)",marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Tilgjengelig nå i ditt område</div>
                {nurses.filter(n=>n.status==="available").slice(0,2).map(n=>(
                  <div key={n.name} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
                    <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDark},${C.sidebarAccent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"white",flexShrink:0,position:"relative"}}>
                      {n.av}
                      <div style={{position:"absolute",bottom:0,right:0,width:11,height:11,borderRadius:"50%",background:"#16A34A",border:"2px solid rgba(30,58,47,.8)"}}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:"white",marginBottom:1}}>{n.name}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,.55)"}}>{n.tittel} · {n.erfaring}</div>
                    </div>
                    <div style={{fontSize:10,background:"rgba(22,163,74,.2)",color:"#4ade80",padding:"3px 10px",borderRadius:50,fontWeight:600}}>Ledig</div>
                  </div>
                ))}
                <button type="button" onClick={()=>onNav("bestill")} style={{width:"100%",marginTop:16,padding:"11px 0",background:C.green,color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                  Bestill time nå →
                </button>
              </div>
              <div style={{display:"flex",gap:8}}>
                {[["4.9★","Kundetilfredsh."],["1000+","Oppdrag gjennomført"],["7","Kommuner dekket"]].map(([v,l])=>(
                  <div key={l} style={{flex:1,background:"rgba(255,255,255,.07)",borderRadius:12,padding:"12px 10px",textAlign:"center",border:"1px solid rgba(255,255,255,.08)"}}>
                    <div className="fr" style={{fontSize:20,fontWeight:700,color:"white",marginBottom:2}}>{v}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,.45)",lineHeight:1.3}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── TJENESTER ── */}
        <div style={{background:C.cream,padding:"56px 40px"}}>
          <div style={{maxWidth:1200,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:40}}>
              <div className="fr" style={{fontSize:32,fontWeight:600,color:C.navy,marginBottom:8}}>Våre tjenester</div>
              <div style={{fontSize:16,color:C.soft}}>Klikk på en tjeneste for detaljer og bestilling</div>
            </div>

            {/* Eldre */}
            <div style={{marginBottom:40}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                <div style={{width:32,height:32,borderRadius:9,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🏡</div>
                <span className="fr" style={{fontSize:20,fontWeight:600,color:C.navy}}>Eldre & Pårørende</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
                {services.filter(s=>s.cat==="eldre").map(sv=>(
                  <div key={sv.type} onClick={()=>setMerinfo(sv)} className="card"
                    style={{cursor:"pointer",overflow:"hidden",transition:"all .18s"}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.12)"}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
                    <div style={{height:5,background:`linear-gradient(90deg,${C.green},${C.greenLight})`}}/>
                    <div style={{padding:18}}>
                      <div style={{fontSize:28,marginBottom:10}}>{sv.icon}</div>
                      <div style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:4}}>{sv.name}</div>
                      {sv.tagline?<div style={{fontSize:12,color:C.soft,marginBottom:14,lineHeight:1.45,fontStyle:"italic"}}>{sv.tagline}</div>:<div style={{marginBottom:14}}/>}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${C.border}`}}>
                        <span style={{fontSize:15,fontWeight:700,color:C.green}}>fra {sv.price} kr</span>
                        <span style={{fontSize:11,color:C.soft,background:C.softBg,padding:"2px 8px",borderRadius:50}}>{sv.duration} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Barsel */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                <div style={{width:32,height:32,borderRadius:9,background:C.rose,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🤱</div>
                <span className="fr" style={{fontSize:20,fontWeight:600,color:C.navy}}>Barselstøtte</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
                {services.filter(s=>s.cat==="barsel").map(sv=>(
                  <div key={sv.type} onClick={()=>setMerinfo(sv)} className="card"
                    style={{cursor:"pointer",overflow:"hidden",transition:"all .18s"}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.12)"}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
                    <div style={{height:5,background:`linear-gradient(90deg,${C.rose},${C.gold})`}}/>
                    <div style={{padding:18}}>
                      <div style={{fontSize:28,marginBottom:10}}>{sv.icon}</div>
                      <div style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:4}}>{sv.name}</div>
                      {sv.tagline?<div style={{fontSize:12,color:C.soft,marginBottom:14,lineHeight:1.45,fontStyle:"italic"}}>{sv.tagline}</div>:<div style={{marginBottom:14}}/>}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${C.border}`}}>
                        <span style={{fontSize:15,fontWeight:700,color:C.gold}}>fra {sv.price} kr</span>
                        <span style={{fontSize:11,color:C.soft,background:C.softBg,padding:"2px 8px",borderRadius:50}}>{sv.duration} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SYKEPLEIERE ── */}
        <div style={{background:"white",padding:"56px 40px"}}>
          <div style={{maxWidth:1200,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32,flexWrap:"wrap",gap:12}}>
              <div>
                <div className="fr" style={{fontSize:32,fontWeight:600,color:C.navy,marginBottom:6}}>Møt våre sykepleiere</div>
                <div style={{fontSize:16,color:C.soft}}>Autorisert helsepersonell i ditt nærområde</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,background:C.greenBg,borderRadius:50,padding:"7px 18px"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#16A34A"}}/>
                <span style={{fontSize:13,color:C.green,fontWeight:600}}>{nurses.filter(n=>n.status==="available").length} ledig nå</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18,marginBottom:28}}>
              {nurses.map(n=>(
                <div key={n.name} className="card" style={{padding:20,display:"flex",gap:14,alignItems:"flex-start"}}>
                  <div style={{position:"relative",flexShrink:0}}>
                    <div style={{width:56,height:56,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDark},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"white",border:`3px solid ${C.greenBg}`}}>{n.av}</div>
                    <div style={{position:"absolute",bottom:2,right:2,width:14,height:14,borderRadius:"50%",background:n.status==="available"?"#16A34A":n.status==="on_assignment"?C.gold:C.soft,border:"2.5px solid white"}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                      <span style={{fontSize:15,fontWeight:700,color:C.navy}}>{n.name}</span>
                      <div style={{display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
                        <span>⭐</span><span style={{fontSize:13,fontWeight:700,color:C.navy}}>{n.rating}</span>
                        <span style={{fontSize:11,color:C.soft}}>({n.antallOppdrag})</span>
                      </div>
                    </div>
                    <div style={{fontSize:12,color:C.green,fontWeight:600,marginBottom:6}}>{n.tittel} · {n.erfaring}</div>
                    <div style={{fontSize:12,color:C.soft,lineHeight:1.55,marginBottom:10}}>"{n.bio}"</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
                      {n.spesialitet.map(s=><span key={s} style={{fontSize:10,background:C.greenXL,color:C.green,padding:"3px 9px",borderRadius:5,fontWeight:500,border:`0.5px solid ${C.border}`}}>{s}</span>)}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:11,color:C.soft}}>📍 {n.omrade}</span>
                      <span style={{fontSize:11,padding:"3px 10px",borderRadius:50,fontWeight:600,
                        background:n.status==="available"?"#F0FDF4":n.status==="on_assignment"?C.goldBg:C.softBg,
                        color:n.status==="available"?"#16A34A":n.status==="on_assignment"?C.goldDark:C.soft}}>
                        {n.status==="available"?"Ledig nå":n.status==="on_assignment"?"På oppdrag":"Pause"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{textAlign:"center"}}>
              <button type="button" onClick={()=>onNav("login")} style={{padding:"13px 40px",background:C.green,color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                Bestill en sykepleier →
              </button>
            </div>
          </div>
        </div>

        <LandB2BKontaktSeksjon variant="desktop"/>

        {/* ── FOOTER STRIP ── */}
        <div style={{background:C.navy,padding:"28px 40px"}}>
          <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
            <div className="fr" style={{fontSize:18,fontWeight:600,color:"white"}}>Eira<span style={{color:"#E8C4A4"}}>Nova</span></div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["Fredrikstad","Sarpsborg","Moss","Råde","Vestby","Ås","Ski"].map(a=>(
                <div key={a} style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>📍 {a}</div>
              ))}
            </div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>Powered by CoreX · EiraNova AS</div>
          </div>
        </div>
      {merinfo&&(
        <TjenesteMerinfoModal
          service={merinfo}
          accent={merinfo.cat==="barsel"?C.gold:C.green}
          onClose={()=>setMerinfo(null)}
          onFortsett={s=>onNav("bestill",s.type)}
          fortsettLabel="Bestill denne tjenesten"
        />
      )}
      </div>
  );
}

function Landing({onNav,services=DEFAULT_KUNDE_SERVICES,nurses=NURSES}){
  const desktop=useViewportMin768();
  return desktop?<LandKundeDesktop onNav={onNav} services={services} nurses={nurses}/>:<LandKundeMobile onNav={onNav} services={services} nurses={nurses}/>;
}

function Login({onNav,onMockKundeLogin,kundeAuth}){
  const[type,setType]=useState(null);
  const[bedriftMode,setBedriftMode]=useState(null);
  const[mode,setMode]=useState("login");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[fulltNavn,setFulltNavn]=useState("");
  const[kundeLoginFeil,setKundeLoginFeil]=useState("");
  const[regFeil,setRegFeil]=useState({fn:"",ep:"",pw:""});
  const[regTrengerBekreftelse,setRegTrengerBekreftelse]=useState(false);
  const fullforKundeMock=()=>{
    setKundeLoginFeil("");
    if(onMockKundeLogin)onMockKundeLogin();
    else{
      onNav("hjem");
    }
  };
  const isKommune=email.includes(".kommune.no");

  // ── 1. Velg hvem du er ─────────────────────────────────────
  if(!type)return(
    <div className="phone fu">
      <div style={{padding:"32px 18px 28px",background:`linear-gradient(160deg,${C.navy},${C.greenDark})`,textAlign:"center"}}>
        <div className="fr" style={{fontSize:22,fontWeight:600,color:"white",marginBottom:4}}>Eira<span style={{color:"#E8C4A4"}}>Nova</span></div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.6)",fontStyle:"italic"}}>Faglig trygghet. Menneskelig nærhet.</div>
      </div>
      <div className="sa" style={{padding:"24px 18px"}}>
        <div className="fr" style={{fontSize:16,fontWeight:600,color:C.navy,marginBottom:5,textAlign:"center"}}>Hvem er du?</div>
        <div style={{fontSize:11,color:C.soft,textAlign:"center",marginBottom:22,lineHeight:1.5}}>Velg riktig innlogging for din konto</div>
        {[
          {key:"privat",  icon:"👤",title:"Privat kunde",        sub:"Bestill omsorg for deg selv eller pårørende. Betaler selv.",     bg:C.greenBg},
          {key:"bedrift", icon:"🏢",title:"Bedriftskunde",       sub:"Kommune, borettslag eller bedrift. Faktura til organisasjonen.", bg:"#EEF2FF"},
        ].map(r=>(
          <div key={r.key} onClick={()=>setType(r.key)}
            style={{background:"white",borderRadius:14,padding:"15px 16px",marginBottom:10,cursor:"pointer",border:`2px solid ${C.border}`,display:"flex",alignItems:"center",gap:13}}>
            <div style={{width:46,height:46,borderRadius:12,background:r.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{r.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:3}}>{r.title}</div>
              <div style={{fontSize:10,color:C.soft,lineHeight:1.5}}>{r.sub}</div>
            </div>
            <span style={{color:C.soft,fontSize:18}}>›</span>
          </div>
        ))}
        <div style={{marginTop:16,textAlign:"center"}}>
          <span style={{fontSize:10,color:C.soft}}>Ikke mottatt invitasjon? </span>
          <span onClick={()=>onNav("ingen-invitasjon")} style={{fontSize:10,color:C.green,cursor:"pointer",fontWeight:600}}>Les hva du gjør →</span>
        </div>
      </div>
    </div>
  );

  // ── 2. Privat kunde ────────────────────────────────────────
  if(type==="privat")return(
    <div className="phone fu">
      <div style={{padding:"20px 18px 18px",background:`linear-gradient(160deg,${C.navy},${C.greenDark})`}}>
        <button onClick={()=>setType(null)} style={{background:"rgba(255,255,255,.16)",border:"none",color:"white",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>← Tilbake</button>
        <div className="fr" style={{fontSize:18,fontWeight:600,color:"white",marginBottom:2}}>Privat kunde</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>Logg inn eller opprett konto</div>
      </div>
      <div className="sa" style={{padding:"14px 18px"}}>
        <div className="login-stack">
        <button type="button" disabled title="Kommer når EiraNova AS er registrert" style={{width:"100%",minHeight:48,padding:"12px 0",background:C.vipps,color:"white",border:"none",borderRadius:11,fontSize:14,fontWeight:600,opacity:.55,cursor:"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontFamily:"inherit",marginBottom:12}}>
          <span style={{fontSize:18,lineHeight:1}} aria-hidden>💜</span> Fortsett med Vipps
        </button>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><div style={{flex:1,height:1,background:C.border}}/><span style={{fontSize:10,color:C.soft}}>eller</span><div style={{flex:1,height:1,background:C.border}}/></div>
        {regTrengerBekreftelse&&(
          <div style={{background:C.greenXL,borderRadius:12,padding:"12px 14px",marginBottom:14,fontSize:12,color:C.navyMid,lineHeight:1.6,border:`1px solid ${C.border}`}}>
            Vi har sendt en bekreftelseslenke til <strong style={{color:C.navy}}>{String(email).trim()}</strong>. Åpne lenken, deretter kan du logge inn. Sjekk spam-mappen hvis du ikke finner e-posten.
          </div>
        )}
        {mode==="register"&&<div style={{marginBottom:8}}><label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>Fullt navn</label><input className="inp" placeholder="Ola Nordmann" value={fulltNavn} onChange={e=>{setFulltNavn(e.target.value);if(regFeil.fn)setRegFeil(r=>({...r,fn:""}));}}/>{regFeil.fn&&<div style={{fontSize:11,color:C.danger,marginTop:6}}>{regFeil.fn}</div>}</div>}
        <div style={{marginBottom:8}}><label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>E-post</label><input className="inp" type="email" placeholder="ola@example.com" value={email} onChange={e=>{setEmail(e.target.value);if(regFeil.ep)setRegFeil(r=>({...r,ep:""}));}}/>{mode==="register"&&regFeil.ep&&<div style={{fontSize:11,color:C.danger,marginTop:6}}>{regFeil.ep}</div>}</div>
        <div style={{marginBottom:8}}><label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>Passord</label><input className="inp" type="password" placeholder="••••••••" value={password} onChange={e=>{setPassword(e.target.value);if(regFeil.pw)setRegFeil(r=>({...r,pw:""}));}}/>{mode==="register"&&regFeil.pw&&<div style={{fontSize:11,color:C.danger,marginTop:6}}>{regFeil.pw}</div>}</div>
        {mode==="login"&&(
          <>
            {kundeLoginFeil&&<div style={{fontSize:11,color:C.danger,marginBottom:8}}>{kundeLoginFeil}</div>}
            <button type="button" onClick={async()=>{
              klikkRegistrert();
              if(!email.trim()||!password.trim()){
                setKundeLoginFeil("Skriv inn e-post og passord.");
                return;
              }
              if(kundeAuth){
                setKundeLoginFeil("");
                const r=await kundeAuth.signIn(String(email).trim(),password);
                if(r&&r.error){
                  setKundeLoginFeil("E-post eller passord stemmer ikke.");
                  return;
                }
                if(kundeAuth.onAfterSignIn)await kundeAuth.onAfterSignIn();
                return;
              }
              fullforKundeMock();
            }} className="btn bp bf" style={{borderRadius:11}}>Logg inn</button>
          </>
        )}
        {mode==="register"&&<button type="button" onClick={async()=>{
          const err={fn:"",ep:"",pw:""};
          if(!fulltNavnMinToOrd(fulltNavn))err.fn="Skriv fullt navn (minst to ord: fornavn og etternavn).";
          if(!erGyldigEpost(email))err.ep="Ugyldig e-postformat.";
          if(String(password).length<8)err.pw="Passord må ha minst 8 tegn.";
          if(err.fn||err.ep||err.pw){setRegFeil(err);return;}
          setRegFeil({fn:"",ep:"",pw:""});
          setRegTrengerBekreftelse(false);
          if(kundeAuth){
            const r=await kundeAuth.signUp(String(email).trim(),password,fulltNavn);
            if(r&&r.error){
              setRegFeil({fn:"",ep:r.error,pw:""});
              return;
            }
            if(r&&r.needsEmailConfirmation){
              setRegTrengerBekreftelse(true);
              return;
            }
            if(kundeAuth.onAfterSignUp)kundeAuth.onAfterSignUp();
            return;
          }
          onNav("push-tillatelse",undefined,{kundeRegEpost:String(email).trim()});
        }} className="btn bp bf" style={{borderRadius:11}}>Opprett konto</button>}
        {mode==="login"&&<div style={{textAlign:"center",marginTop:12}}><span onClick={()=>onNav("glemt-passord")} style={{fontSize:11,color:C.green,cursor:"pointer",fontWeight:600}}>Glemt passord?</span></div>}
        {mode==="login"&&<div style={{textAlign:"center",marginTop:10}}><span style={{fontSize:10,color:C.soft}}>Ny bruker? </span><span onClick={()=>{setMode("register");setRegFeil({fn:"",ep:"",pw:""});}} style={{fontSize:10,color:C.green,cursor:"pointer",fontWeight:600}}>Registrer deg</span></div>}
        {mode==="register"&&<div style={{textAlign:"center",marginTop:10}}><span style={{fontSize:10,color:C.soft}}>Har du allerede konto? </span><span onClick={()=>{setMode("login");setRegFeil({fn:"",ep:"",pw:""});}} style={{fontSize:10,color:C.green,cursor:"pointer",fontWeight:600}}>Logg inn</span></div>}
        </div>
      </div>
    </div>
  );

  // ── 3. Bedriftskunde ───────────────────────────────────────
  return(
    <div className="phone fu">
      <div style={{padding:"20px 18px 18px",background:"linear-gradient(160deg,#1A2E24,#2C5C52)",flexShrink:0}}>
        <button onClick={()=>{setType(null);setBedriftMode(null);}} style={{background:"rgba(255,255,255,.16)",border:"none",color:"white",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>← Tilbake</button>
        <div className="fr" style={{fontSize:18,fontWeight:600,color:"white",marginBottom:2}}>Bedriftskunde</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>Kommune · Borettslag · Bedrift</div>
      </div>
      <div className="sa" style={{padding:"14px 18px"}}>

        {/* TILGANGSPORT */}
        {!bedriftMode&&(
          <>
            <div style={{background:"#1A2E24",borderRadius:12,padding:"14px 15px",marginBottom:16,color:"white"}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Slik får du tilgang</div>
              <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:9}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(74,188,158,.25)",border:"1px solid rgba(74,188,158,.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#4ABC9E",flexShrink:0}}>1</div>
                <div style={{display:"flex",alignItems:"flex-start",gap:7,flex:1}}>
                  <span style={{fontSize:14,lineHeight:1.4}}>🤝</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:"rgba(255,255,255,.8)",lineHeight:1.45,marginBottom:6}}>Dere fyller ut kontaktskjema — vi ringer dere innen 1 virkedag</div>
                    <button type="button" onClick={()=>onNav("landing",undefined,{scrollTo:"b2b-kontakt"})} style={{fontSize:10,color:"#4ABC9E",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600,padding:0,display:"inline-flex",alignItems:"center",gap:5}}>
                      Gå til kontaktskjema <span aria-hidden>↓</span>
                    </button>
                  </div>
                </div>
              </div>
              {[
                {n:"2",t:"Admin registrerer deg som koordinator i systemet",i:"👤"},
                {n:"3",t:"Du mottar en personlig invitasjon på jobb-e-post",i:"📧"},
                {n:"4",t:"Klikk lenken og logg inn — tilgang er klar",i:"✅"},
              ].map(s=>(
                <div key={s.n} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:9}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(74,188,158,.25)",border:"1px solid rgba(74,188,158,.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#4ABC9E",flexShrink:0}}>{s.n}</div>
                  <div style={{display:"flex",alignItems:"center",gap:7,flex:1}}>
                    <span style={{fontSize:14}}>{s.i}</span>
                    <span style={{fontSize:11,color:"rgba(255,255,255,.8)",lineHeight:1.4}}>{s.t}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="fr" style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:10}}>Har du mottatt invitasjon?</div>

            {[
              {key:"har_tilgang",   icon:"✅",title:"Ja, jeg har fått invitasjon",    sub:"Logg inn med e-post eller Google Workspace",       border:C.green,  bg:C.greenBg},
              {key:"ingen_tilgang", icon:"❓",title:"Nei, jeg har ikke fått invitasjon",sub:"Se hva du må gjøre for å få tilgang",            border:C.border, bg:C.goldBg},
              {key:"bruker",        icon:"👴",title:"Jeg er bruker / pasient",         sub:"Din koordinator har lagt deg til i systemet",      border:C.border, bg:"#EDE9FE"},
            ].map(r=>(
              <div key={r.key} onClick={()=>setBedriftMode(r.key)}
                style={{background:"white",borderRadius:12,padding:"13px 14px",marginBottom:8,cursor:"pointer",border:`2px solid ${r.border}`,display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:10,background:r.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{r.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:2}}>{r.title}</div>
                  <div style={{fontSize:10,color:C.soft}}>{r.sub}</div>
                </div>
                <span style={{color:C.soft,fontSize:18}}>›</span>
              </div>
            ))}
          </>
        )}

        {/* HAR TILGANG */}
        {bedriftMode==="har_tilgang"&&(
          <>
            <button onClick={()=>setBedriftMode(null)} style={{background:"none",border:"none",color:C.green,fontSize:11,cursor:"pointer",fontFamily:"inherit",marginBottom:14,padding:0}}>← Tilbake</button>
            <div style={{background:C.greenXL,borderRadius:10,padding:"10px 13px",marginBottom:14,border:`1px solid ${C.border}`,fontSize:10,color:C.navyMid,lineHeight:1.55}}>
              <span style={{fontWeight:600,color:C.green}}>Kun for inviterte koordinatorer.</span> Har du ikke mottatt invitasjon, har du ikke tilgang ennå.
            </div>
            <button onClick={()=>onNav("b2b-dashboard")} style={{width:"100%",padding:"12px 0",background:"white",color:"#1F1F1F",border:"1.5px solid #DADCE0",borderRadius:11,fontSize:13,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:9,marginBottom:10,fontFamily:"inherit",boxShadow:"0 1px 4px rgba(0,0,0,.08)"}}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
              Logg inn med Google Workspace
            </button>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{flex:1,height:1,background:C.border}}/><span style={{fontSize:10,color:C.soft}}>eller e-post</span><div style={{flex:1,height:1,background:C.border}}/></div>
            <div style={{marginBottom:8}}>
              <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>E-post</label>
              <input className="inp" type="email" placeholder="koordinator@moss.kommune.no" value={email} onChange={e=>setEmail(e.target.value)}/>
              {isKommune&&<div style={{fontSize:9,color:C.green,marginTop:3}}>✓ Kommunekonto gjenkjent</div>}
            </div>
            <div style={{marginBottom:12}}><label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>Passord</label><input className="inp" type="password" placeholder="••••••••"/></div>
            <button onClick={()=>onNav("b2b-dashboard")} className="btn bf" style={{borderRadius:11,background:"#1A2E24",color:"white"}}>Logg inn som koordinator</button>
          </>
        )}

        {/* INGEN TILGANG */}
        {bedriftMode==="ingen_tilgang"&&(
          <>
            <button onClick={()=>setBedriftMode(null)} style={{background:"none",border:"none",color:C.green,fontSize:11,cursor:"pointer",fontFamily:"inherit",marginBottom:14,padding:0}}>← Tilbake</button>
            <div style={{background:C.dangerBg,border:`1px solid rgba(225,29,72,.2)`,borderRadius:12,padding:"13px 14px",marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:700,color:C.danger,marginBottom:4}}>Du har ikke tilgang ennå</div>
              <div style={{fontSize:10,color:C.navyMid,lineHeight:1.6}}>Koordinatortilgang kan ikke opprettes selv — den gis av EiraNova etter avtale med din organisasjon.</div>
            </div>
            <div className="fr" style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:12}}>Slik får din organisasjon tilgang:</div>
            {[
              {t:"Din leder/IT tar kontakt med EiraNova",i:"📞",btn:"Ring oss: 900 12 345",tel:"tel:90012345"},
              {t:"EiraNova registrerer din organisasjon som B2B-kunde",i:"📝",btn:null},
              {t:"Du mottar personlig invitasjon på jobb-e-post",i:"📧",btn:null},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:10}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{s.i}</div>
                  {i<2&&<div style={{width:1.5,height:16,background:C.border,marginTop:2}}/>}
                </div>
                <div style={{flex:1,paddingBottom:i<2?8:0}}>
                  <div style={{fontSize:11,color:C.navy,lineHeight:1.5,marginBottom:s.btn?6:0}}>{s.t}</div>
                  {s.btn&&<button onClick={()=>s.tel?window.location.href=s.tel:toast(s.btn)} style={{fontSize:10,padding:"5px 12px",background:C.green,color:"white",border:"none",borderRadius:7,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>{s.btn}</button>}
                </div>
              </div>
            ))}
            <div style={{marginTop:8,padding:"10px 13px",background:C.softBg,borderRadius:9,fontSize:10,color:C.soft,textAlign:"center",lineHeight:1.6}}>
              Er du pasient og ikke koordinator?{" "}
              <span onClick={()=>setBedriftMode("bruker")} style={{color:C.green,cursor:"pointer",fontWeight:600}}>Klikk her</span>
            </div>
          </>
        )}

        {/* BRUKER/PASIENT */}
        {bedriftMode==="bruker"&&(
          <>
            <button onClick={()=>setBedriftMode(null)} style={{background:"none",border:"none",color:C.green,fontSize:11,cursor:"pointer",fontFamily:"inherit",marginBottom:14,padding:0}}>← Tilbake</button>
            <div style={{background:"#F5F3FF",border:"1px solid #C4B5FD",borderRadius:10,padding:"11px 13px",marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:"#6D28D9",marginBottom:3}}>Bruker / Pasient</div>
              <div style={{fontSize:10,color:"#5B21B6",lineHeight:1.55}}>Din koordinator har lagt deg til i EiraNova og sendt en invitasjons-e-post med aktiveringslenke.</div>
            </div>
            <button type="button" onClick={()=>onNav("b2b-bruker-aktivering")} className="btn bp bf" style={{borderRadius:11,marginBottom:12}}>Aktiver konto med invitasjon →</button>
            <div style={{fontSize:10,color:C.soft,marginBottom:10,textAlign:"center"}}>Har du allerede aktivert? Logg inn under.</div>
            <div style={{marginBottom:8}}><label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>Din e-post</label><input className="inp" type="email" placeholder="ola.nordmann@gmail.com"/></div>
            <div style={{marginBottom:12}}><label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>Passord</label><input className="inp" type="password" placeholder="••••••••"/></div>
            <button onClick={()=>onNav("b2b-bruker")} className="btn bp bf" style={{borderRadius:11,marginBottom:12}}>Logg inn</button>
            <div style={{textAlign:"center",fontSize:10,color:C.soft,lineHeight:1.6}}>
              Ikke mottatt invitasjon?{" "}
              <span onClick={()=>onNav("ingen-invitasjon")} style={{color:C.green,cursor:"pointer",fontWeight:600}}>Les hva du gjør →</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


function Hjem({onNav,services=DEFAULT_KUNDE_SERVICES,orders=ORDERS}){
  const BN_ITEMS=BN_K;
  const neste=mockKundeNesteAvtale();
  const[merinfo,setMerinfo]=useState(null);
  return(
    <div className="phone fu">
      {/* Desktop top nav */}
      <DeskNav active="hjem" onNav={onNav} items={BN_ITEMS} title="EiraNova"
        right={<div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.soft}}>
          <span style={{width:28,height:28,borderRadius:"50%",background:C.greenBg,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.green}}>AH</span>
          Astrid Hansen
        </div>}/>

      {/* Header */}
      <div style={{padding:"clamp(14px,2vw,24px) clamp(14px,3vw,40px) clamp(18px,2.5vw,28px)",background:`linear-gradient(160deg,${C.navy},${C.greenDark})`,flexShrink:0}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div>
            <div className="fr" style={{fontSize:"clamp(18px,2.5vw,28px)",fontWeight:600,color:"white",marginBottom:2}}>God dag, Astrid! 👋</div>
            <div style={{fontSize:"clamp(10px,1vw,13px)",color:"rgba(255,255,255,.65)"}}>Mandag 3. mars 2026</div>
          </div>
          {/* Neste avtale — samme mock som KundeAvtaleDetalj (mockKundeNesteAvtale → OPPDRAG id 5) */}
          {neste&&(
          <button type="button" onClick={()=>onNav("kunde-avtale-detalj")}
            style={{
              background:"rgba(255,255,255,.12)",borderRadius:12,padding:"10px 16px",display:"flex",alignItems:"center",gap:12,
              border:"1px solid rgba(255,255,255,.15)",cursor:"pointer",fontFamily:"inherit",textAlign:"left",color:"inherit",
              position:"relative",zIndex:1,maxWidth:"100%",alignSelf:"center",WebkitTapHighlightColor:"transparent",
            }}>
            <div style={{width:36,height:36,borderRadius:9,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{neste.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:"clamp(9px,.9vw,10px)",color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:.5,fontWeight:600}}>Neste avtale</div>
              <div style={{fontSize:"clamp(12px,1.2vw,14px)",fontWeight:600,color:"white"}}>{neste.service}</div>
              <div style={{fontSize:"clamp(10px,1vw,12px)",color:"rgba(255,255,255,.7)"}}>{neste.date} · kl. {neste.time}</div>
            </div>
            <span className="btn bp" style={{fontSize:"clamp(10px,1vw,12px)",padding:"7px 14px",marginLeft:8,flexShrink:0,pointerEvents:"none"}}>Detaljer</span>
          </button>
          )}
        </div>
      </div>

      <div className="sa" style={{padding:"clamp(14px,2vw,28px) clamp(12px,3vw,40px)"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>

          {/* Tjenester — desktop: alle i grid, mobil: 4 i 2-kolonne */}
          <div style={{marginBottom:"clamp(16px,2.5vw,28px)"}}>
            <div className="fr" style={{fontSize:"clamp(14px,1.5vw,18px)",fontWeight:600,color:C.navy,marginBottom:"clamp(8px,1.5vw,14px)"}}>Bestill ny tjeneste</div>
            {/* Eldre */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,180px),1fr))",gap:"clamp(8px,1.2vw,14px)",marginBottom:"clamp(12px,1.5vw,20px)"}}>
              {services.filter(s=>s.cat==="eldre").map(sv=>(
                <div key={sv.type} onClick={()=>setMerinfo(sv)} className="card"
                  style={{cursor:"pointer",overflow:"hidden",transition:"all .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 18px rgba(0,0,0,.1)"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
                  <div style={{height:"clamp(48px,6vw,64px)",background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"clamp(20px,2.5vw,28px)"}}>{sv.icon}</div>
                  <div style={{padding:"clamp(8px,1vw,12px)"}}>
                    <div style={{fontSize:"clamp(11px,1.1vw,13px)",fontWeight:600,color:C.navy,marginBottom:3,lineHeight:1.3}}>{sv.name}</div>
                    {sv.tagline?<div style={{fontSize:"clamp(8px,.85vw,10px)",color:C.soft,marginBottom:5,lineHeight:1.35,fontStyle:"italic"}}>{sv.tagline}</div>:null}
                    <div style={{fontSize:"clamp(9px,.9vw,11px)",color:C.soft,marginBottom:6}}>fra {sv.price} kr · {sv.duration} min</div>
                    <button type="button" className="btn bp" style={{width:"100%",fontSize:"clamp(9px,.9vw,11px)",padding:"5px 0",borderRadius:7}} onClick={e=>{e.stopPropagation();setMerinfo(sv);}}>Bestill</button>
                  </div>
                </div>
              ))}
            </div>
            {/* Barsel */}
            <div style={{background:"linear-gradient(135deg,#FDF0F0,#FDF5EE)",borderRadius:14,padding:"clamp(12px,1.5vw,18px)",border:"0.5px solid #F2C4C4"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"clamp(8px,1vw,12px)"}}>
                <div style={{width:24,height:24,borderRadius:6,background:C.rose,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🤱</div>
                <span style={{fontSize:"clamp(11px,1.2vw,13px)",fontWeight:600,color:"#B05C4A",textTransform:"uppercase",letterSpacing:.6}}>Barselstøtte</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,180px),1fr))",gap:"clamp(7px,1vw,12px)",alignItems:"stretch"}}>
                {services.filter(s=>s.cat==="barsel").map(sv=>(
                  <div key={sv.type} onClick={()=>setMerinfo(sv)} style={{background:"white",borderRadius:10,cursor:"pointer",border:`0.5px solid ${C.border}`,transition:"all .15s",display:"flex",flexDirection:"column",height:"100%",minHeight:0}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,.08)"}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
                    <div style={{padding:"clamp(10px,1.2vw,14px)",paddingBottom:8,display:"flex",flexDirection:"column",flex:1,minHeight:0}}>
                      <div style={{fontSize:"clamp(18px,2vw,24px)",marginBottom:6,flexShrink:0}}>{sv.icon}</div>
                      <div style={{fontSize:"clamp(11px,1.1vw,13px)",fontWeight:600,color:C.navy,marginBottom:3,flexShrink:0}}>{sv.name}</div>
                      {sv.tagline?<div style={{fontSize:"clamp(8px,.85vw,10px)",color:C.soft,marginBottom:5,lineHeight:1.35,fontStyle:"italic",flexShrink:0}}>{sv.tagline}</div>:null}
                      <div style={{fontSize:"clamp(9px,.9vw,11px)",color:C.soft,flexShrink:0}}>fra {sv.price} kr · {sv.duration} min</div>
                      <button type="button" className="btn" style={{width:"100%",fontSize:"clamp(9px,.9vw,11px)",padding:"5px 0",borderRadius:7,background:C.gold,color:"white",marginTop:"auto"}} onClick={e=>{e.stopPropagation();setMerinfo(sv);}}>Bestill</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mine bestillinger — desktop: to-kolonne */}
          <div>
            <div className="fr" style={{fontSize:"clamp(14px,1.5vw,18px)",fontWeight:600,color:C.navy,marginBottom:"clamp(8px,1.5vw,14px)"}}>Mine bestillinger</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,340px),1fr))",gap:"clamp(7px,1vw,12px)"}}>
              {orders.slice(0,4).map(o=>(
                <div key={o.id} onClick={()=>onNav("kunde-oppdrag-detalj",null,{orderId:o.id})} className="card" style={{cursor:"pointer"}}>
                  <div style={{height:3,background:o.cat==="barsel"?C.gold:C.green}}/>
                  <div style={{padding:"clamp(9px,1vw,13px) clamp(11px,1.5vw,16px)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:"clamp(12px,1.2vw,14px)",fontWeight:600,color:C.navy,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{o.service}</div>
                      <div style={{fontSize:"clamp(9px,.9vw,11px)",color:C.soft,marginTop:2}}>{o.date} · {o.time} · {o.nurse}</div>
                    </div>
                    <Bdg status={o.status}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {merinfo&&(
        <TjenesteMerinfoModal
          service={merinfo}
          accent={merinfo.cat==="barsel"?C.gold:C.green}
          onClose={()=>setMerinfo(null)}
          onFortsett={s=>onNav("bestill",s.type)}
          fortsettLabel="Gå til bestilling"
        />
      )}
      <BNav active="hjem" onNav={onNav} items={BN_ITEMS}/>
    </div>
  );
}

function Bestill({onNav,preselectedType=null,services=DEFAULT_KUNDE_SERVICES,nurses=NURSES}){
  const defaultService=services.find(s=>s.type==="morgensstell")||services[0];
  const fromType=t=>services.find(s=>s.type===t)||defaultService;
  // 0=tjenesteliste (kun uten forhåndsvalg), 1=dato/tid, 2=sykepleier, 3=betaling
  const[step,setStep]=useState(()=>preselectedType?1:0);
  const[sel,setSel]=useState(()=>(preselectedType?fromType(preselectedType):null));
  const[date,setDate]=useState("Tirsdag 4. mars");
  const[time,setTime]=useState("09:00");
  const[chosenNurse,setChosenNurse]=useState(null); // null = EiraNova velger

  const[merinfo,setMerinfo]=useState(null);
  useEffect(()=>{
    if(preselectedType){
      const next=fromType(preselectedType);
      setSel(next);
      setStep(1);
    }else{
      setSel(null);
      setStep(0);
    }
  },[preselectedType,services]);

  const velgTjeneste=sv=>{setSel(sv);setChosenNurse(null);setStep(1);};

  // Steg 3: betaling
  if(step===3)return <Betaling inBookFlow onBack={()=>setStep(2)} onNav={onNav} service={sel??defaultService} services={services} date={date} time={time}/>;

  // Steg 2: velg sykepleier
  if(step===2)return(
    <div className="phone fu">
      <PH title="Velg sykepleier" onBack={()=>setStep(1)} backLabel="Dato og tid" centerTitle/>
      <div className="sa" style={{padding:13}}>
        {/* La EiraNova velge */}
        <div onClick={()=>{setChosenNurse(null);setStep(3);}} className="card" style={{padding:"12px 14px",marginBottom:12,cursor:"pointer",border:`2px solid ${chosenNurse===null?C.green:C.border}`,background:chosenNurse===null?C.greenBg:"white"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:44,height:44,borderRadius:11,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>✨</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:2}}>EiraNova velger for meg</div>
              <div style={{fontSize:10,color:C.soft}}>Vi sender den best tilgjengelige sykepleieren til deg</div>
            </div>
            {chosenNurse===null&&<div style={{width:18,height:18,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:7,height:7,borderRadius:"50%",background:"white"}}/></div>}
          </div>
        </div>

        <div style={{fontSize:10,fontWeight:600,color:C.navy,textTransform:"uppercase",letterSpacing:1,marginBottom:9}}>Eller velg selv</div>

        {nurses.map(n=>{
          const avail=n.status==="available";
          const chosen=chosenNurse===n.name;
          return(
            <div key={n.name} onClick={()=>{setChosenNurse(n.name);}} className="card"
              style={{padding:"12px 13px",marginBottom:8,cursor:"pointer",border:`2px solid ${chosen?C.green:C.border}`,opacity:avail?1:.55,background:chosen?C.greenBg:"white"}}>
              <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
                {/* Avatar */}
                <div style={{position:"relative",flexShrink:0}}>
                  <div style={{width:46,height:46,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDark},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:"white"}}>{n.av}</div>
                  <div style={{position:"absolute",bottom:1,right:1,width:11,height:11,borderRadius:"50%",background:avail?"#16A34A":C.soft,border:"2px solid white"}}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
                    <span style={{fontSize:12,fontWeight:700,color:C.navy}}>{n.name}</span>
                    <div style={{display:"flex",alignItems:"center",gap:2}}>
                      <span style={{fontSize:10}}>⭐</span>
                      <span style={{fontSize:10,fontWeight:600,color:C.navy}}>{n.rating}</span>
                    </div>
                  </div>
                  <div style={{fontSize:10,color:C.green,fontWeight:500,marginBottom:3}}>{n.tittel} · {n.erfaring}</div>
                  <div style={{fontSize:10,color:C.soft,lineHeight:1.4,marginBottom:5}}>"{n.bio}"</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:4}}>
                    {n.spesialitet.slice(0,3).map(s=>(
                      <span key={s} style={{fontSize:8,background:C.greenXL,color:C.green,padding:"2px 6px",borderRadius:4,border:`0.5px solid ${C.border}`}}>{s}</span>
                    ))}
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontSize:9,color:C.soft}}>📍 {n.omrade}</span>
                    <span style={{fontSize:9,padding:"2px 7px",borderRadius:50,fontWeight:600,
                      background:avail?"#F0FDF4":C.goldBg,color:avail?"#16A34A":C.goldDark}}>
                      {avail?"Ledig nå":n.status==="on_assignment"?"På oppdrag":"Pause"}
                    </span>
                  </div>
                </div>
                {chosen&&<div style={{width:18,height:18,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><div style={{width:7,height:7,borderRadius:"50%",background:"white"}}/></div>}
              </div>
            </div>
          );
        })}
        <button type="button" onClick={()=>setStep(3)} className="btn bp bf" style={{borderRadius:11,marginTop:4}}>
          {chosenNurse?`Fortsett med ${chosenNurse.split(" ")[0]} →`:"Gå til betaling →"}
        </button>
      </div>
    </div>
  );

  // Steg 0: velg tjeneste (fanen «Bestill» m.m. uten forhåndsvalg)
  if(step===0)return(
    <div className="phone fu">
      <PH onBack={()=>onNav("hjem")} backLabel="Hjem"/>
      <div className="sa" style={{padding:"clamp(14px,2vw,28px) clamp(12px,3vw,40px)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",width:"100%"}}>
          <div className="fr" style={{fontSize:"clamp(14px,1.5vw,18px)",fontWeight:600,color:C.navy,marginBottom:"clamp(8px,1.5vw,14px)",textAlign:"center",width:"100%"}}>Hvilken tjeneste ønsker du?</div>
          <div style={{display:"grid",width:"100%",alignItems:"stretch",gridTemplateColumns:"repeat(auto-fill, minmax(min(100%,200px), 1fr))",gap:"clamp(8px,1.2vw,14px)",marginBottom:"clamp(12px,1.5vw,20px)"}}>
            {services.filter(s=>s.cat==="eldre").map(sv=>(
              <div key={sv.type} onClick={()=>setMerinfo(sv)} className="card"
                style={{cursor:"pointer",overflow:"hidden",transition:"all .15s",width:"100%",minWidth:0,boxSizing:"border-box"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 18px rgba(0,0,0,.1)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
                <div style={{height:"clamp(48px,6vw,64px)",background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"clamp(20px,2.5vw,28px)"}}>{sv.icon}</div>
                <div style={{padding:"clamp(8px,1vw,12px)"}}>
                  <div style={{fontSize:"clamp(11px,1.1vw,13px)",fontWeight:600,color:C.navy,marginBottom:3,lineHeight:1.3}}>{sv.name}</div>
                  {sv.tagline?<div style={{fontSize:"clamp(8px,.85vw,10px)",color:C.soft,marginBottom:5,lineHeight:1.35,fontStyle:"italic"}}>{sv.tagline}</div>:null}
                  <div style={{fontSize:"clamp(9px,.9vw,11px)",color:C.soft,marginBottom:6}}>fra {sv.price} kr · {sv.duration} min</div>
                  <span className="btn bp" role="button" tabIndex={0} style={{display:"block",width:"100%",fontSize:"clamp(9px,.9vw,11px)",padding:"5px 0",borderRadius:7,textAlign:"center"}} onClick={e=>{e.stopPropagation();setMerinfo(sv);}} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();e.stopPropagation();setMerinfo(sv);}}}>Velg</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:"linear-gradient(135deg,#FDF0F0,#FDF5EE)",borderRadius:14,padding:"clamp(12px,1.5vw,18px)",border:"0.5px solid #F2C4C4"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"clamp(8px,1vw,12px)"}}>
              <div style={{width:24,height:24,borderRadius:6,background:C.rose,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🤱</div>
              <span style={{fontSize:"clamp(11px,1.2vw,13px)",fontWeight:600,color:"#B05C4A",textTransform:"uppercase",letterSpacing:.6}}>Barselstøtte</span>
            </div>
            <div style={{display:"grid",width:"100%",alignItems:"stretch",gridTemplateColumns:"repeat(auto-fill, minmax(min(100%,200px), 1fr))",gap:"clamp(7px,1vw,12px)"}}>
              {services.filter(s=>s.cat==="barsel").map(sv=>(
                <div key={sv.type} onClick={()=>setMerinfo(sv)} style={{background:"white",borderRadius:10,padding:"clamp(10px,1.2vw,14px)",cursor:"pointer",border:`0.5px solid ${C.border}`,transition:"all .15s",width:"100%",minWidth:0,boxSizing:"border-box"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,.08)"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
                  <div style={{fontSize:"clamp(18px,2vw,24px)",marginBottom:6}}>{sv.icon}</div>
                  <div style={{fontSize:"clamp(11px,1.1vw,13px)",fontWeight:600,color:C.navy,marginBottom:3}}>{sv.name}</div>
                  {sv.tagline?<div style={{fontSize:"clamp(8px,.85vw,10px)",color:C.soft,marginBottom:5,lineHeight:1.35,fontStyle:"italic"}}>{sv.tagline}</div>:null}
                  <div style={{fontSize:"clamp(9px,.9vw,11px)",color:C.soft,marginBottom:8}}>fra {sv.price} kr · {sv.duration} min</div>
                  <span className="btn" role="button" tabIndex={0} style={{display:"block",width:"100%",fontSize:"clamp(9px,.9vw,11px)",padding:"5px 0",borderRadius:7,background:C.gold,color:"white",textAlign:"center"}} onClick={e=>{e.stopPropagation();setMerinfo(sv);}} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();e.stopPropagation();setMerinfo(sv);}}}>Velg</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {merinfo&&(
        <TjenesteMerinfoModal
          service={merinfo}
          accent={merinfo.cat==="barsel"?C.gold:C.green}
          onClose={()=>setMerinfo(null)}
          onFortsett={s=>{velgTjeneste(s);}}
          fortsettLabel="Velg denne tjenesten"
        />
      )}
      <KundeNavShell active="bestill" onNav={onNav}/>
    </div>
  );

  // Steg 1: dato og tid (tjeneste valgt fra steg 0 eller forhåndsvalg fra hjem)
  if(step===1)return(
    <div className="phone fu">
      <PH title="Dato og tid" onBack={()=>preselectedType?onNav("hjem"):setStep(0)} backLabel={preselectedType?"Hjem":"Velg tjeneste"} centerTitle/>
      <div className="sa" style={{padding:13}}>
        <div className="card cp" style={{marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:10,background:sel?.cat==="barsel"?C.goldBg:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{sel?.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.5}}>Valgt tjeneste</div>
            <div style={{fontSize:14,fontWeight:600,color:C.navy}}>{sel?.name}</div>
            {sel?.tagline?<div style={{fontSize:11,color:C.soft,fontStyle:"italic",lineHeight:1.4,marginTop:3}}>{sel.tagline}</div>:null}
            <div style={{fontSize:12,color:C.soft}}>fra {sel?.price} kr · {sel?.duration} min</div>
          </div>
        </div>
        <div className="card cp" style={{marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:7}}>Velg dato</div>
          {["Man 3. mars","Tirs 4. mars","Ons 5. mars","Tors 6. mars"].map(d=>(
            <button key={d} onClick={()=>setDate(d)} style={{display:"block",width:"100%",padding:"9px 11px",marginBottom:5,borderRadius:8,border:`1.5px solid ${date===d?C.green:C.border}`,background:date===d?C.greenBg:"white",fontSize:12,color:date===d?C.greenDark:C.navy,textAlign:"left",cursor:"pointer",fontWeight:date===d?600:400,fontFamily:"inherit"}}>{d} {date===d&&"✓"}</button>
          ))}
        </div>
        <div className="card cp" style={{marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:7}}>Velg tidspunkt</div>
          <div className="g4" style={{gap:6}}>
            {["08:00","09:00","10:00","11:00","13:00","14:00","15:00","16:00"].map(t=>(
              <button key={t} onClick={()=>setTime(t)} style={{padding:"8px 0",border:`1.5px solid ${time===t?C.green:C.border}`,borderRadius:7,fontSize:11,fontWeight:time===t?600:400,cursor:"pointer",background:time===t?C.greenBg:"white",color:time===t?C.greenDark:C.navy,fontFamily:"inherit"}}>{t}</button>
            ))}
          </div>
        </div>
        <div className="card cp" style={{marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:5}}>Adresse</div>
          <input className="inp" defaultValue="Konggata 12, 1530 Moss" style={{borderColor:C.green}}/>
          <div style={{fontSize:9,color:C.green,marginTop:3}}>✓ Innenfor dekningsområde</div>
        </div>
        {/* Step indicator */}
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12,justifyContent:"center"}}>
          {[1,2,3].map(s=>(
            <div key={s} style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:22,height:22,borderRadius:"50%",background:s<=1?C.green:C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"white"}}>{s}</div>
              {s<3&&<div style={{width:20,height:2,background:s<1?C.green:C.border,borderRadius:1}}/>}
            </div>
          ))}
        </div>
        <button type="button" onClick={()=>setStep(2)} className="btn bp bf" style={{borderRadius:11}}>Velg sykepleier →</button>
      </div>
    </div>
  );

  return null;
}

function Betaling({onBack,onNav,service,date,time,inBookFlow=false,services:serviceCatalog=DEFAULT_KUNDE_SERVICES}){
  const[method,setMethod]=useState("vipps");
  const[paying,setPaying]=useState(false);
  const[card,setCard]=useState("");const[exp,setExp]=useState("");const[cvv,setCvv]=useState("");
  const sv=service??serviceCatalog.find(s=>s.type==="morgensstell")??serviceCatalog[0];
  function pay(){setPaying(true);setTimeout(()=>{setPaying(false);onNav("bekreftelse");},1800);}
  function fC(v){return v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();}
  function fE(v){let d=v.replace(/\D/g,"");return d.length>=2?d.slice(0,2)+"/"+d.slice(2,4):d;}
  const PM=({id,icon,label,sub,bg})=>(
    <div onClick={()=>setMethod(id)} style={{background:method===id?"rgba(74,124,111,.06)":"white",borderRadius:11,padding:"12px 13px",display:"flex",alignItems:"center",gap:10,marginBottom:7,border:`2px solid ${method===id?C.green:C.border}`,cursor:"pointer"}}>
      <div style={{width:38,height:38,borderRadius:8,background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>{icon}</div>
      <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.navy}}>{label}</div><div style={{fontSize:9,color:C.soft}}>{sub}</div></div>
      <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${method===id?C.green:C.border}`,background:method===id?C.green:"white",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {method===id&&<div style={{width:7,height:7,borderRadius:"50%",background:"white"}}/>}
      </div>
    </div>
  );
  return(
    <div className="phone fu">
      <PH title="Betaling" onBack={onBack} backLabel={onBack?(inBookFlow?"Velg sykepleier":"Tilbake"):undefined} centerTitle={Boolean(onBack)}/>
      <div className="sa" style={{padding:13}}>
        <div className="card cp" style={{marginBottom:11}}>
          <div style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Sammendrag</div>
          <div style={{display:"flex",alignItems:"center",gap:9,paddingBottom:8,borderBottom:`1px solid ${C.border}`,marginBottom:8}}>
            <div style={{width:34,height:34,borderRadius:8,background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{sv.icon}</div>
            <div><div style={{fontSize:12,fontWeight:600,color:C.navy}}>{sv.name}</div><div style={{fontSize:10,color:C.soft}}>{date} · {time}</div></div>
          </div>
          {[["Tjenestepris",`${sv.price} kr`],["MVA","0 kr (helsetjeneste unntatt)"]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.soft,marginBottom:4}}><span>{l}</span><span>{v}</span></div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700,color:C.navy,paddingTop:6,borderTop:`1px solid ${C.border}`,marginTop:3}}>
            <span>Totalt</span><span style={{color:C.green}}>{sv.price} kr</span>
          </div>
        </div>
        <div style={{marginBottom:11}}>
          <div style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Betalingsmetode</div>
          <PM id="vipps" icon="💜" label="Vipps" sub="Raskeste og enkleste" bg={C.vipps}/>
          <PM id="visa" icon={<span style={{fontSize:10,fontWeight:900,color:"white",letterSpacing:1}}>VISA</span>} label="Visa" sub="Debet- eller kredittkort" bg="#1A1F71"/>
          <div onClick={()=>setMethod("mc")} style={{background:method==="mc"?"rgba(235,0,27,.04)":"white",borderRadius:11,padding:"12px 13px",display:"flex",alignItems:"center",gap:10,marginBottom:7,border:`2px solid ${method==="mc"?"#EB001B":C.border}`,cursor:"pointer"}}>
            <div style={{width:38,height:38,borderRadius:8,background:"white",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",left:4,width:21,height:21,borderRadius:"50%",background:"#EB001B"}}/><div style={{position:"absolute",right:4,width:21,height:21,borderRadius:"50%",background:"#F79E1B",opacity:.9}}/>
            </div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.navy}}>Mastercard</div><div style={{fontSize:9,color:C.soft}}>Debet- eller kredittkort</div></div>
            <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${method==="mc"?"#EB001B":C.border}`,background:method==="mc"?"#EB001B":"white",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {method==="mc"&&<div style={{width:7,height:7,borderRadius:"50%",background:"white"}}/>}
            </div>
          </div>
        </div>
        {(method==="visa"||method==="mc")&&(
          <div className="card cp" style={{marginBottom:11}}>
            <div style={{marginBottom:8}}><label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>Kortnummer</label><input className="inp" value={card} onChange={e=>setCard(fC(e.target.value))} placeholder="0000 0000 0000 0000" maxLength={19} style={{letterSpacing:2}}/></div>
            <div style={{display:"flex",gap:8}}>
              <div style={{flex:1}}><label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>Utløpsdato</label><input className="inp" value={exp} onChange={e=>setExp(fE(e.target.value))} placeholder="MM/ÅÅ" maxLength={5}/></div>
              <div style={{flex:1}}><label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>CVV</label><input className="inp" value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,"").slice(0,3))} placeholder="•••" type="password"/></div>
            </div>
          </div>
        )}
        {method==="vipps"&&<div style={{background:"#FFF5F0",borderRadius:10,padding:"10px 12px",marginBottom:11,border:"1px solid rgba(255,91,36,.2)",fontSize:11,color:"#994020",lineHeight:1.5}}>💜 Du videresendes til Vipps-appen for å fullføre betalingen på <strong>{sv.price} kr</strong></div>}
        <div style={{background:C.greenXL,borderRadius:10,padding:"10px 12px",marginBottom:11,border:`1px solid rgba(74,124,111,.2)`}}>
          <div style={{fontSize:10,fontWeight:600,color:C.greenDark,marginBottom:4,lineHeight:1.35}}>🔒 Trygg forskuddsbetaling</div>
          <div style={{fontSize:9,color:C.navyMid,lineHeight:1.5}}>Du kan avbestille gratis inntil 48 timer før oppdraget og få full refusjon automatisk til betalingsmetoden du brukte.</div>
        </div>
        <button onClick={pay} disabled={paying} className="btn bf" style={{borderRadius:11,background:paying?"#7FAE96":method==="vipps"?C.vipps:C.green,color:"white",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          {paying?<><div className="spin"/><span>Behandler...</span></>:method==="vipps"?`💜 Betal ${sv.price} kr med Vipps`:`💳 Betal ${sv.price} kr`}
        </button>
        <p style={{textAlign:"center",fontSize:9,color:C.soft,marginTop:9}}>🔒 Sikker betaling · Kryptert · MVA-unntatt helsetjeneste</p>
      </div>
    </div>
  );
}

function Bekreftelse({onNav}){
  return(
    <div className="phone fu">
      <PH title="Bekreftelse" centerTitle/>
      <div className="sa" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 18px",textAlign:"center"}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,marginBottom:18}}>✅</div>
        <div className="fr" style={{fontSize:22,fontWeight:600,color:C.navy,marginBottom:6}}>Bestilling bekreftet!</div>
        <div style={{fontSize:12,color:C.soft,lineHeight:1.6,marginBottom:14}}>Kvittering sendt på e-post. Du får beskjed når sykepleier er tildelt.</div>
        <div style={{width:"100%",maxWidth:400,background:C.greenXL,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",marginBottom:22,textAlign:"left"}}>
          <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:4}}>Avbestilling</div>
          <div style={{fontSize:11,color:C.navyMid,lineHeight:1.55}}>Du kan avbestille gratis inntil 48 timer før oppdraget. Etter dette må du kontakte oss.</div>
        </div>
        <div className="card cp" style={{width:"100%",marginBottom:16,textAlign:"left"}}>
          {[["Tjeneste","Morgensstell & dusj"],["Dato","Tirsdag 4. mars"],["Tid","09:00"],["Beløp","590 kr (MVA-unntatt)"],["Betaling","Vipps ✓"],["Oppgjør","D+1 virkedag"]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:11}}>
              <span style={{color:C.soft}}>{l}</span><span style={{fontWeight:600,color:C.navy}}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={()=>onNav("hjem")} className="btn bp bf" style={{borderRadius:11}}>Tilbake til hjem</button>
      </div>
    </div>
  );
}

function KundeAvbestillBekreftModal({order,onLukk,onBekreft}){
  if(!order)return null;
  return(
    <ModalPortal overlayStyle={{background:"rgba(0,0,0,.45)",padding:16}}>
      <div style={{background:"white",borderRadius:16,maxWidth:380,width:"100%",padding:"22px 20px",boxShadow:"0 16px 48px rgba(0,0,0,.18)"}}>
        <div className="fr" style={{fontSize:17,fontWeight:600,color:C.navy,marginBottom:10}}>Avbestille?</div>
        <p style={{fontSize:12,color:C.navyMid,lineHeight:1.6,margin:0,marginBottom:18}}>
          Er du sikker? Du vil få full refusjon innen 3–5 virkedager til betalingsmetoden du brukte.
        </p>
        <div style={{display:"flex",gap:10}}>
          <button type="button" onClick={onLukk} className="btn" style={{flex:1,padding:"11px 0",borderRadius:10,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Avbryt</button>
          <button type="button" onClick={onBekreft} className="btn" style={{flex:1,padding:"11px 0",borderRadius:10,background:C.danger,color:"white",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Bekreft avbestilling</button>
        </div>
      </div>
    </ModalPortal>
  );
}

function KundeOppdragDetalj({onNav,orderId,orders=ORDERS,onKundeOrderAvbestill}){
  const{toast,ToastContainer}=useToast();
  const[visAvbestill,setVisAvbestill]=useState(false);
  const o=orders.find(x=>String(x.id)===String(orderId));
  const betaltTekst=o?(
    o.paid
      ?(o.betaltVia==="vipps"?"Betalt med Vipps"
        :o.betaltVia==="b2b"?`Betalt via organisasjon${o.b2bOrg?` · ${o.b2bOrg}`:""}`
          :"Betalt")
      :"Ikke betalt"
  ):"";
  return(
    <div className="phone fu">
      <ToastContainer/>
      <PH title="Bestilling" onBack={()=>onNav("mine")} backLabel="Mine bestillinger" centerTitle/>
      <div className="sa" style={{padding:14}}>
        {!o?(
          <div className="card cp"><div style={{fontSize:13,color:C.soft}}>Fant ikke bestillingen.</div></div>
        ):(
          <>
            <div className="card cp" style={{marginBottom:10}}>
              <div style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Tjeneste</div>
              <div style={{fontSize:15,fontWeight:600,color:C.navy}}>{o.service}</div>
            </div>
            <div className="card cp" style={{marginBottom:10}}>
              <div style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Dato og tid</div>
              <div style={{fontSize:13,fontWeight:600,color:C.navy}}>{o.date} · kl. {o.time}</div>
            </div>
            <div className="card cp" style={{marginBottom:10}}>
              <div style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Sykepleier</div>
              <div style={{fontSize:13,fontWeight:600,color:C.navy}}>{o.nurse}</div>
            </div>
            <div className="card cp" style={{marginBottom:10}}>
              <div style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Status</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}><Bdg status={o.status}/></div>
            </div>
            <div className="card cp" style={{marginBottom:10}}>
              <div style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Beløp</div>
              <div style={{fontSize:16,fontWeight:700,color:C.green}}>{o.amount.toLocaleString("nb-NO")} kr</div>
              <div style={{fontSize:11,color:C.navyMid,marginTop:4}}>{betaltTekst}</div>
              {o.status==="no_show"&&(
                <div style={{marginTop:10,padding:"9px 11px",background:C.softBg,borderRadius:8,flexShrink:0,fontSize:11,color:C.navyMid,lineHeight:1.5}}>Ved uteblivelse (no-show) gis det ikke refusjon.</div>
              )}
              {o.status==="cancelled"&&(
                <div style={{marginTop:10,padding:"9px 11px",background:C.greenXL,borderRadius:8,border:`1px solid rgba(74,124,111,.22)`,fontSize:11,color:C.navyMid,lineHeight:1.55}}>{kundeAvbestiltRefusjonInfotekst(o)}</div>
              )}
            </div>
            {!kundeOrdreHistorisk(o)&&(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {kundeKanAvbestilleSelv(o)&&onKundeOrderAvbestill&&(
                  <button type="button" onClick={()=>setVisAvbestill(true)} style={{width:"100%",padding:"10px 12px",borderRadius:10,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:"white",color:C.danger,border:`1.5px solid ${C.danger}`}}>Avbestill</button>
                )}
                {kundeMaKontakteForAvbestilling(o)&&(
                  <button type="button" onClick={()=>onNav("chat-kunde")} style={{width:"100%",padding:"10px 12px",borderRadius:10,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:C.greenBg,color:C.greenDark,border:`1.5px solid ${C.border}`}}>Kontakt oss</button>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {visAvbestill&&o&&onKundeOrderAvbestill&&(
        <KundeAvbestillBekreftModal
          order={o}
          onLukk={()=>setVisAvbestill(false)}
          onBekreft={()=>{onKundeOrderAvbestill(o.id);setVisAvbestill(false);toast(TOAST_AVBESTILLING_BEKREFTET,"ok");}}
        />
      )}
    </div>
  );
}

function Mine({onNav,orders=ORDERS,onKundeOrderAvbestill}){
  const{toast,ToastContainer}=useToast();
  const[tab,setTab]=useState("kommende");
  const[avbestillFor,setAvbestillFor]=useState(null);
  const avbestillOrder=avbestillFor?orders.find(x=>String(x.id)===String(avbestillFor)):null;
  return(
    <div className="phone fu">
      <ToastContainer/>
      <PH title="Mine bestillinger" onBack={()=>onNav("hjem")} backLabel="Hjem" centerTitle/>
      <div style={{display:"flex",margin:"10px 11px",background:C.greenXL,borderRadius:9,padding:3,flexShrink:0}}>
        {["kommende","tidligere"].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"6px 0",borderRadius:7,fontSize:11,fontWeight:500,cursor:"pointer",border:"none",background:tab===t?"white":"transparent",color:tab===t?C.green:C.soft,fontFamily:"inherit"}}>{t==="kommende"?"Kommende":"Tidligere"}</button>)}
      </div>
      <div className="sa" style={{padding:"0 11px"}}>
        {orders.filter(o=>tab==="kommende"?!kundeOrdreHistorisk(o):kundeOrdreHistorisk(o)).map(o=>(
          <div key={o.id} role="button" tabIndex={0} onKeyDown={e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),onNav("kunde-oppdrag-detalj",null,{orderId:o.id}));}} onClick={()=>onNav("kunde-oppdrag-detalj",null,{orderId:o.id})} className="card" style={{marginBottom:8,cursor:"pointer"}}>
            <div style={{height:2.5,background:o.cat==="barsel"?C.gold:C.green}}/>
            <div style={{padding:"10px 12px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:5}}>
                <div><div style={{fontSize:12,fontWeight:600,color:C.navy}}>{o.service}</div><div style={{fontSize:9,color:C.soft,marginTop:1}}>{o.date} · {o.time}</div></div>
                <Bdg status={o.status}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.navyMid}}>
                <span>Sykepleier: {o.nurse}</span>
                <span style={{fontWeight:600,color:o.paid?C.green:C.goldDark}}>{o.paid?"✓ Betalt":"⏳ Ubetalt"} · {o.amount} kr</span>
              </div>
              {o.status==="cancelled"&&(
                <div style={{marginTop:8,padding:"8px 10px",background:C.greenXL,borderRadius:8,border:`1px solid rgba(74,124,111,.2)`,fontSize:10,color:C.navyMid,lineHeight:1.45}}>{kundeAvbestiltRefusjonInfotekst(o)}</div>
              )}
              {o.status==="no_show"&&(
                <div style={{marginTop:8,fontSize:10,color:C.soft,lineHeight:1.45}}>Ingen refusjon ved uteblivelse.</div>
              )}
              {!o.paid&&<button type="button" onClick={e=>{e.stopPropagation();toast("Går til betaling (prototyp)","info");}} style={{marginTop:8,width:"100%",padding:"7px",background:C.vipps,color:"white",border:"none",borderRadius:7,fontSize:10,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>Betal nå</button>}
              {tab==="kommende"&&!kundeOrdreHistorisk(o)&&(
                <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}} onClick={e=>e.stopPropagation()}>
                  {kundeKanAvbestilleSelv(o)&&onKundeOrderAvbestill&&(
                    <button type="button" onClick={()=>setAvbestillFor(o.id)} style={{width:"100%",padding:"8px 10px",borderRadius:8,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:"white",color:C.danger,border:`1.5px solid ${C.danger}`}}>Avbestill</button>
                  )}
                  {kundeMaKontakteForAvbestilling(o)&&(
                    <button type="button" onClick={()=>onNav("chat-kunde")} style={{width:"100%",padding:"8px 10px",borderRadius:8,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:C.greenBg,color:C.greenDark,border:`1.5px solid ${C.border}`}}>Kontakt oss</button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {avbestillOrder&&onKundeOrderAvbestill&&(
        <KundeAvbestillBekreftModal
          order={avbestillOrder}
          onLukk={()=>setAvbestillFor(null)}
          onBekreft={()=>{onKundeOrderAvbestill(avbestillOrder.id);setAvbestillFor(null);toast(TOAST_AVBESTILLING_BEKREFTET,"ok");}}
        />
      )}
      <KundeNavShell active="mine" onNav={onNav}/>
    </div>
  );
}

function ChatKunde({onNav}){
  const[msg,setMsg]=useState("");
  const[msgs,setMsgs]=useState(CHAT);
  const send=()=>{if(msg.trim()){setMsgs([...msgs,{from:"customer",text:msg,time:"nå"}]);setMsg("");}};
  return(
    <div className="phone fu">
      <PH title="Sara Lindgren · Sykepleier" onBack={()=>onNav("hjem")} backLabel="Hjem" centerTitle slim/>
      <div className="sa" style={{padding:"10px 11px",display:"flex",flexDirection:"column",gap:8,background:C.greenXL}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.from==="customer"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"75%",background:m.from==="customer"?C.green:"white",borderRadius:m.from==="customer"?"12px 12px 3px 12px":"12px 12px 12px 3px",padding:"8px 11px"}}>
              <div style={{fontSize:12,color:m.from==="customer"?"white":C.navy,lineHeight:1.45}}>{m.text}</div>
              <div style={{fontSize:8,color:m.from==="customer"?"rgba(255,255,255,.65)":C.soft,marginTop:2,textAlign:"right"}}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:"8px 11px",background:"white",borderTop:`1px solid ${C.border}`,display:"flex",gap:6}}>
        <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Skriv en melding..." style={{flex:1,padding:"8px 11px",border:`1.5px solid ${C.border}`,borderRadius:18,fontSize:12,outline:"none",background:C.greenXL,fontFamily:"inherit"}}/>
        <button onClick={send} style={{width:34,height:34,borderRadius:"50%",background:C.green,color:"white",border:"none",fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>↑</button>
      </div>
      <BNav active="chat-kunde" onNav={onNav} items={BN_K}/>
      <DeskNav active="chat-kunde" onNav={onNav} items={BN_K} title="EiraNova"/>
    </div>
  );
}

// ══ SYKEPLEIER ════════════════════════════════════════════════
function NurseBottomNav({onNav,activeId}){
  return(
    <nav className="bnav">
      {NURSE_NAV.map(it=>(
        <button type="button" key={it.id} className="bi" onClick={()=>onNav(it.id)}>
          <span style={{fontSize:20,lineHeight:1}} aria-hidden>{it.icon}</span>
          <span className="bi-lbl" style={{fontWeight:activeId===it.id?600:400,color:activeId===it.id?C.green:C.soft}}>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
function NurseLogin({onNav,onMockNurseLogin}){
  const[email,setEmail]=useState("");
  const[passord,setPassord]=useState("");
  const[feil,setFeil]=useState("");
  const[showPassordLogin,setShowPassordLogin]=useState(false);
  const fullforNurseMock=()=>{
    setFeil("");
    if(onMockNurseLogin)onMockNurseLogin();
    else onNav("nurse-rolle");
  };
  const loggInnMock=e=>{
    if(e){e.preventDefault();e.stopPropagation();}
    if(process.env.NODE_ENV==="development")console.log("nurse klikk");
    klikkRegistrert();
    const erIntern=s=>s.trim().toLowerCase().endsWith("@eiranova.no");
    if(!erIntern(email)){
      setFeil("Kun @eiranova.no-e-post er tillatt i mock-innlogging.");
      return;
    }
    if(!passord.trim()){
      setFeil("Skriv inn passord.");
      return;
    }
    fullforNurseMock();
  };
  const eiraKontoKlikk=e=>{
    e.preventDefault();
    e.stopPropagation();
    if(process.env.NODE_ENV==="development")console.log("nurse klikk");
    klikkRegistrert();
    fullforNurseMock();
  };
  const tilbakePrimær=()=>{
    setShowPassordLogin(false);
    setFeil("");
  };
  return(
    <div className="phone nurse-login-shell">
      <div style={{padding:"30px 18px 28px",background:`linear-gradient(160deg,${C.navy},${C.greenDark})`,textAlign:"center",flexShrink:0}}>
        <div style={{fontSize:36,marginBottom:10}}>🩺</div>
        <div className="fr" style={{fontSize:21,fontWeight:600,color:"white",marginBottom:4}}>Logg inn som ansatt</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.65)"}}>Kun for inviterte EiraNova-ansatte</div>
      </div>
      <div className="sa" style={{padding:"22px 18px",position:"relative",zIndex:1,isolation:"isolate",minHeight:0}}>
        <div className="login-stack" style={{position:"relative",zIndex:5,pointerEvents:"auto",isolation:"isolate"}}>
        {!showPassordLogin?(
          <>
            <div style={{position:"relative",zIndex:20,isolation:"isolate",flexShrink:0,width:"100%",marginBottom:10}}>
            <button
              type="button"
              onClick={eiraKontoKlikk}
              className="btn bp bf"
              style={{position:"relative",zIndex:1,isolation:"isolate",flexShrink:0,width:"100%",borderRadius:11,fontSize:14,padding:"16px 14px",cursor:"pointer",WebkitTapHighlightColor:"transparent",touchAction:"manipulation",display:"flex",flexDirection:"column",alignItems:"center",gap:6,lineHeight:1.3}}
            >
              <span style={{fontWeight:600}}>Logg inn med EiraNova-konto</span>
              <span style={{fontSize:11,fontWeight:500,opacity:0.92}}>Bruker din @eiranova.no e-post</span>
            </button>
            </div>
            <div style={{position:"relative",zIndex:10,isolation:"isolate",flexShrink:0,width:"100%"}}>
              <button
                type="button"
                onClick={e=>{
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPassordLogin(true);
                  setFeil("");
                }}
                style={{
                  display:"block",
                  width:"100%",
                  margin:0,
                  padding:"14px 12px",
                  minHeight:48,
                  boxSizing:"border-box",
                  background:"transparent",
                  border:"none",
                  borderRadius:8,
                  cursor:"pointer",
                  fontFamily:"inherit",
                  fontSize:12,
                  fontWeight:600,
                  color:C.green,
                  textAlign:"center",
                  textDecoration:"underline",
                  textUnderlineOffset:3,
                  WebkitAppearance:"none",
                  appearance:"none",
                  WebkitTapHighlightColor:"transparent",
                  touchAction:"manipulation",
                }}
              >
                Kan ikke logge inn? Bruk e-post og passord →
              </button>
            </div>
            <p style={{fontSize:11,color:C.soft,textAlign:"center",lineHeight:1.5,margin:"14px 0 0"}}>
              Kun <strong style={{color:C.navyMid}}>@eiranova.no</strong>-kontoer har tilgang.
            </p>
          </>
        ):(
          <>
            <button
              type="button"
              onClick={tilbakePrimær}
              style={{background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:11,color:C.green,fontWeight:600,padding:"0 0 14px",textAlign:"left",width:"100%"}}
            >
              ← Tilbake til EiraNova-konto innlogging
            </button>
            <div style={{background:C.greenXL,borderRadius:13,padding:"14px 16px",marginBottom:12,border:`1.5px solid ${C.greenBg}`}}>
              <div style={{marginBottom:8}}>
                <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>E-post</label>
                <input className="inp" type="email" placeholder="fornavn@eiranova.no" value={email} onChange={e=>setEmail(e.target.value)}/>
              </div>
              <div style={{marginBottom:6}}>
                <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>Passord</label>
                <input className="inp" type="password" placeholder="••••••••" value={passord} onChange={e=>setPassord(e.target.value)}/>
              </div>
              <div style={{textAlign:"right",marginBottom:10}}>
                <button type="button" onClick={()=>onNav("glemt-passord",{nurseMode:true})} style={{fontSize:10,color:C.green,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600,padding:0}}>Glemt passord?</button>
              </div>
              <p style={{fontSize:10,color:C.soft,lineHeight:1.55,margin:0}}>
                Problemer med innlogging? Kontakt din leder eller post@eiranova.no
              </p>
            </div>
            {feil&&<div style={{fontSize:12,color:C.danger,marginBottom:8}}>{feil}</div>}
            <button type="button" onClick={loggInnMock} className="btn bp bf" style={{borderRadius:11,marginBottom:10,cursor:"pointer",WebkitTapHighlightColor:"transparent",touchAction:"manipulation"}}>Logg inn med e-post</button>
            <p style={{fontSize:12,color:C.soft,textAlign:"center",lineHeight:1.5,margin:0}}>Kun <strong>@eiranova.no</strong>-kontoer skal ha tilgang i produksjon.</p>
          </>
        )}
        </div>
      </div>
    </div>
  );
}

function NurseRolle({onNav}){
  const[isNy]=useState(true);
  return(
    <div className="phone fu">
      {/* Desktop: enkel sentrert side */}
      <div style={{
        background:`linear-gradient(160deg,${C.navy},${C.greenDark})`,
        padding:"clamp(20px,3vw,40px) clamp(20px,3vw,40px) clamp(16px,2vw,28px)",
        flexShrink:0
      }}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div className="fr" style={{fontSize:"clamp(18px,2vw,24px)",fontWeight:600,color:"white",marginBottom:4}}>God morgen, Sara! 👋</div>
          <div style={{fontSize:"clamp(11px,1.2vw,14px)",color:"rgba(255,255,255,.6)"}}>Hvilken rolle jobber du i dag?</div>
        </div>
      </div>
      <div className="sa" style={{padding:"clamp(16px,3vw,40px)"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          {[
            {role:"sykepleier", label:"Sykepleier / Hjelpepleier", sub:"Hjemmebesøk og pasientoppfølging", icon:"🩺", screen:"nurse-hjem"},
            {role:"admin",      label:"Koordinator / Admin",        sub:"Oppdragsplanlegging og oversikt — åpner adminpanelet", icon:"🗂️", screen:"admin-redirect"},
          ].map(r=>(
            <div key={r.role} onClick={()=>{
              if(r.screen==="admin-redirect"){
                onNav("admin-panel"); // Koordinator → adminpanelet
              } else if(r.role==="sykepleier"&&isNy){
                onNav("nurse-onboarding");
              } else {
                onNav(r.screen);
              }
            }} className="card" style={{
              padding:"clamp(14px,2vw,20px) clamp(16px,2.5vw,24px)",
              display:"flex",alignItems:"center",gap:"clamp(12px,1.5vw,18px)",
              marginBottom:12,cursor:"pointer",
              transition:"border-color .15s, transform .15s"
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-1px)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="";e.currentTarget.style.transform=""}}>
              <div style={{width:"clamp(44px,5vw,56px)",height:"clamp(44px,5vw,56px)",borderRadius:12,background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"clamp(22px,2.5vw,28px)",flexShrink:0}}>{r.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:"clamp(13px,1.4vw,16px)",fontWeight:600,color:C.navy,marginBottom:3}}>{r.label}</div>
                <div style={{fontSize:"clamp(10px,1vw,12px)",color:C.soft}}>{r.sub}</div>
              </div>
              <span style={{color:C.soft,fontSize:20}}>›</span>
            </div>
          ))}
          <div style={{marginTop:16,padding:"clamp(10px,1.5vw,16px)",background:C.softBg,borderRadius:10,fontSize:"clamp(10px,1vw,12px)",color:C.soft,lineHeight:1.6}}>
            💡 Koordinator/Admin-rollen åpner adminpanelet. Velg sykepleier-rollen for daglig arbeidsdag og pasientoppfølging.
          </div>
        </div>
      </div>
    </div>
  );
}

function NurseOnboarding({onNav}){
  const[steg,setSteg]=useState(0);
  const fornavn="Sara";
  const antallSteg=4;
  const progressW=`${Math.round((steg/Math.max(antallSteg-1,1))*100)}%`;
  const[hpr,setHpr]=useState("");
  const[tittel,setTittel]=useState("Sykepleier");
  const TITLER=["Sykepleier","Hjelpepleier","Vernepleier","Helsefagarbeider"];
  const SPEC_OPTS=["Eldre","Barsel","Demens","Psykiatri","Palliasjon","Barn"];
  const[spec,setSpec]=useState([]);
  const toggleSpec=x=>setSpec(p=>p.includes(x)?p.filter(s=>s!==x):[...p,x]);
  const KOMM_NAVN=["Moss","Fredrikstad","Sarpsborg","Råde","Vestby","Ås","Ski"];
  const[kommSel,setKommSel]=useState(()=>new Set(["Moss"]));
  const toggleKomm=k=>setKommSel(p=>{const n=new Set(p);if(n.has(k))n.delete(k);else n.add(k);return n;});
  const[reisetid,setReisetid]=useState("30 min");
  const REISE_OPTS=["15 min","30 min","45 min","60 min+"];

  return(
    <div className="phone fu" style={{background:C.cream}}>
      <div style={{height:3,background:C.border,flexShrink:0}}>
        <div style={{height:"100%",background:C.green,width:progressW,transition:"width .4s ease"}}/>
      </div>
      <div style={{padding:"16px 20px 0",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:540,margin:"0 auto",width:"100%"}}>
        <span style={{fontSize:10,color:C.soft}}>{steg+1} av {antallSteg}</span>
        {steg<antallSteg-1&&(
          <button type="button" onClick={()=>onNav("nurse-hjem")} style={{fontSize:10,color:C.soft,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Hopp over</button>
        )}
      </div>
      <div className="sa" style={{padding:"20px 22px",display:"flex",flexDirection:"column",maxWidth:540,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
        {steg===0&&(
          <>
            <div className="fr" style={{fontSize:22,fontWeight:700,color:C.navy,marginBottom:10}}>Velkommen til EiraNova 🌿</div>
            <div style={{fontSize:14,fontWeight:600,color:C.navy,marginBottom:8}}>Hei {fornavn}!</div>
            <div style={{fontSize:12,color:C.soft,lineHeight:1.7,marginBottom:28}}>
              Du er nå registrert som sykepleier hos EiraNova. La oss sette opp profilen din.
            </div>
          </>
        )}
        {steg===1&&(
          <>
            <div className="fr" style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:6}}>Din profesjonelle profil</div>
            <div style={{fontSize:11,color:C.soft,marginBottom:16,lineHeight:1.6}}>Opplysningene brukes i planlegging og ved tildeling av oppdrag.</div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>HPR-nummer</label>
              <input className="inp" placeholder="7123456" value={hpr} onChange={e=>setHpr(e.target.value.replace(/\D/g,"").slice(0,9))}/>
              <div style={{fontSize:9,color:C.soft,marginTop:4}}>Hentes fra Helsepersonellregisteret</div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:8}}>Tittel</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {TITLER.map(t=>(
                  <button type="button" key={t} onClick={()=>setTittel(t)} className="btn" style={{padding:"8px 12px",fontSize:11,borderRadius:50,minHeight:0,background:tittel===t?C.green:"white",color:tittel===t?"white":C.navy,border:`1.5px solid ${tittel===t?C.green:C.border}`}}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:8}}>
              <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:8}}>Spesialiteter</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {SPEC_OPTS.map(s=>(
                  <button type="button" key={s} onClick={()=>toggleSpec(s)} className="btn" style={{padding:"8px 12px",fontSize:11,borderRadius:50,minHeight:0,background:spec.includes(s)?C.greenBg:"white",color:C.navy,border:`1.5px solid ${spec.includes(s)?C.green:C.border}`}}>{s}{spec.includes(s)?" ✓":""}</button>
                ))}
              </div>
            </div>
          </>
        )}
        {steg===2&&(
          <>
            <div className="fr" style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:6}}>Ditt dekningsområde</div>
            <div style={{fontSize:11,color:C.soft,marginBottom:14,lineHeight:1.6}}>Velg kommuner du kan ta oppdrag i, og maksimal reisetid.</div>
            <div style={{background:"white",borderRadius:13,padding:"12px 14px",border:`1.5px solid ${C.border}`,marginBottom:14}}>
              {KOMM_NAVN.map(k=>(
                <label key={k} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:k!==KOMM_NAVN[KOMM_NAVN.length-1]?`1px solid ${C.border}`:"none",cursor:"pointer",fontSize:12,color:C.navy}}>
                  <input type="checkbox" checked={kommSel.has(k)} onChange={()=>toggleKomm(k)} style={{accentColor:C.green,width:18,height:18}}/>
                  {k}
                </label>
              ))}
            </div>
            <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:8}}>Maks reisetid</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {REISE_OPTS.map(r=>(
                <button type="button" key={r} onClick={()=>setReisetid(r)} className="btn" style={{padding:"10px 8px",fontSize:11,background:reisetid===r?C.greenBg:"white",color:C.navy,border:`2px solid ${reisetid===r?C.green:C.border}`}}>{r}</button>
              ))}
            </div>
          </>
        )}
        {steg===3&&(
          <>
            <div className="fr" style={{fontSize:20,fontWeight:700,color:C.navy,marginBottom:8,textAlign:"center"}}>Alt er klart! 🎉</div>
            <div style={{background:"white",borderRadius:13,padding:"14px 16px",border:`1.5px solid ${C.border}`,marginBottom:14,fontSize:11,color:C.navy}}>
              <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}><span style={{color:C.soft}}>HPR</span><span style={{fontWeight:600}}>{hpr||"—"}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}><span style={{color:C.soft}}>Tittel</span><span style={{fontWeight:600}}>{tittel}</span></div>
              <div style={{padding:"6px 0",borderBottom:`1px solid ${C.border}`}}><span style={{color:C.soft}}>Spesialiteter</span><div style={{fontWeight:600,marginTop:4}}>{spec.length?spec.join(", "):"—"}</div></div>
              <div style={{padding:"6px 0 0"}}><span style={{color:C.soft}}>Kommuner</span><div style={{fontWeight:600,marginTop:4}}>{[...kommSel].join(", ")||"—"}</div></div>
              <div style={{padding:"8px 0 0",fontSize:10,color:C.soft}}>Maks reisetid: {reisetid}</div>
            </div>
            <div style={{background:C.greenXL,borderRadius:12,padding:"12px 14px",border:`1px solid ${C.green}`,fontSize:11,color:C.navyMid,lineHeight:1.65,marginBottom:8}}>
              Din profil er sendt til godkjenning. Du vil motta e-post når du er godkjent.
            </div>
            <div style={{fontSize:10,color:C.soft,lineHeight:1.6}}>
              Når du er godkjent: sjekk «Min arbeidsdag» for dagens oppdrag, bruk Innsjekk ved ankomst, og send korte meldinger til kunden via chat når det trengs.
            </div>
          </>
        )}
      </div>
      <div style={{padding:"16px 22px 24px",flexShrink:0,maxWidth:540,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
        {steg===0&&(
          <button type="button" onClick={()=>setSteg(1)} className="btn bp" style={{width:"100%",padding:"14px 0",fontSize:14,borderRadius:13}}>Kom i gang →</button>
        )}
        {steg===1&&(
          <button type="button" onClick={()=>hpr.trim()&&setSteg(2)} className="btn bp" style={{width:"100%",padding:"14px 0",fontSize:14,borderRadius:13,opacity:hpr.trim()?1:.4}}>Neste →</button>
        )}
        {steg===2&&(
          <button type="button" onClick={()=>kommSel.size&&setSteg(3)} className="btn bp" style={{width:"100%",padding:"14px 0",fontSize:14,borderRadius:13,opacity:kommSel.size?1:.4}}>Neste →</button>
        )}
        {steg===3&&(
          <button type="button" onClick={()=>onNav("nurse-hjem")} className="btn bp" style={{width:"100%",padding:"14px 0",fontSize:14,borderRadius:13}}>Gå til min arbeidsdag →</button>
        )}
      </div>
    </div>
  );
}

function NurseHjem({onNav}){
  const{toast,ToastContainer}=useToast();
  const done=OPPDRAG.filter(o=>o.status==="completed").length;
  const neste=OPPDRAG.find(o=>o.status!=="completed");
  const deskRight=(
    <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.soft,flexShrink:0}}>
      <span style={{width:28,height:28,borderRadius:"50%",background:C.sidebarAccent,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white"}}>SL</span>
      <span className="hm" style={{whiteSpace:"nowrap"}}>Sara Lindgren</span>
    </div>
  );
  return(
    <div className="phone fu">
      <ToastContainer/>
      <DeskNav active="nurse-hjem" onNav={onNav} items={NURSE_NAV} title="EiraNova · Sara Lindgren" right={deskRight}/>
      <div style={{padding:"clamp(14px,2vw,24px) clamp(14px,3vw,32px)",background:`linear-gradient(160deg,${C.navy},${C.greenDark})`,flexShrink:0}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{minWidth:0}}>
              <div className="fr" style={{fontSize:"clamp(16px,1.8vw,22px)",fontWeight:600,color:"white"}}>Min arbeidsdag</div>
              <div style={{fontSize:"clamp(10px,1vw,13px)",color:"rgba(255,255,255,.6)"}}>Mandag 3. mars · Sara L.</div>
            </div>
            <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:"white",flexShrink:0}}>SL</div>
          </div>
          <div style={{background:"rgba(255,255,255,.12)",borderRadius:10,padding:"10px 14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"clamp(10px,1vw,12px)",color:"rgba(255,255,255,.7)",marginBottom:6}}><span>Progresjon i dag</span><span>{done}/{OPPDRAG.length} oppdrag</span></div>
            <div style={{height:6,borderRadius:50,background:"rgba(255,255,255,.2)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:50,background:C.sidebarAccent,width:`${(done/OPPDRAG.length)*100}%`}}/></div>
          </div>
        </div>
      </div>
      <div className="sa" style={{padding:"clamp(13px,2vw,28px) clamp(13px,3vw,32px)"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{fontSize:10,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Neste oppdrag</div>
          {neste?(
            <div className="nc" style={{cursor:"pointer",marginBottom:12}} onClick={()=>onNav("nurse-innsjekk",{oppdragId:neste.id})}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:48,height:48,borderRadius:12,background:neste.cat==="barsel"?C.goldBg:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{neste.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{fontSize:"clamp(13px,1.3vw,15px)",fontWeight:600,color:C.navy}}>{neste.customer}</span>
                    <Bdg status={neste.status}/>
                  </div>
                  <div style={{fontSize:12,color:C.soft,marginBottom:2}}>{neste.service}</div>
                  <div style={{fontSize:12,color:C.navyMid}}>🕐 {neste.date} kl. {neste.time}</div>
                  <div style={{fontSize:11,color:C.soft,marginTop:4}}>📍 {neste.address}</div>
                </div>
              </div>
              {neste.status==="active"&&(
                <div style={{marginTop:14,display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button type="button" className="btn bp" style={{flex:1,minWidth:120,fontSize:"clamp(10px,1vw,12px)",padding:"8px 0",borderRadius:9}} onClick={e=>{e.stopPropagation();toast("Åpner navigasjon","ok");}}>📍 Naviger</button>
                  <button type="button" className="btn" onClick={e=>{e.stopPropagation();onNav("chat-kunde");}} style={{flex:1,minWidth:120,fontSize:"clamp(10px,1vw,12px)",padding:"8px 0",borderRadius:9,background:C.greenBg,color:C.green}}>💬 Melding</button>
                </div>
              )}
            </div>
          ):(
            <div className="card cp" style={{marginBottom:12,fontSize:13,color:C.soft}}>Ingen åpne oppdrag igjen i dag ✓</div>
          )}
          <button type="button" className="btn" onClick={()=>onNav("nurse-oppdrag")} style={{width:"100%",padding:"12px 16px",fontSize:13,borderRadius:11,background:"white",color:C.green,border:`1.5px solid ${C.green}`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
            Se alle dagens oppdrag →
          </button>
        </div>
      </div>
      <NurseBottomNav onNav={onNav} activeId="nurse-hjem"/>
    </div>
  );
}

function NurseOppdrag({onNav}){
  const deskRight=(
    <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.soft,flexShrink:0}}>
      <span style={{width:28,height:28,borderRadius:"50%",background:C.sidebarAccent,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white"}}>SL</span>
      <span className="hm" style={{whiteSpace:"nowrap"}}>Sara Lindgren</span>
    </div>
  );
  return(
    <div className="phone fu">
      <DeskNav active="nurse-oppdrag" onNav={onNav} items={NURSE_NAV} title="EiraNova · Sara Lindgren" right={deskRight}/>
      <div style={{padding:"clamp(14px,2vw,24px) clamp(14px,3vw,32px)",background:`linear-gradient(160deg,${C.navy},${C.greenDark})`,flexShrink:0}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div className="fr" style={{fontSize:"clamp(16px,1.8vw,22px)",fontWeight:600,color:"white",marginBottom:4}}>Dagens oppdrag</div>
          <div style={{fontSize:"clamp(10px,1vw,13px)",color:"rgba(255,255,255,.65)"}}>Mandag 3. mars · {OPPDRAG.length} oppdrag</div>
        </div>
      </div>
      <div className="sa" style={{padding:"clamp(13px,2vw,28px) clamp(13px,3vw,32px)"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,420px),1fr))",gap:12}}>
          {OPPDRAG.map(op=>(
            <div
              key={op.id}
              role="button"
              tabIndex={0}
              onClick={()=>onNav("nurse-innsjekk",{oppdragId:op.id})}
              onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onNav("nurse-innsjekk",{oppdragId:op.id});}}}
              className="nc"
              style={{cursor:"pointer",opacity:op.status==="completed"?.65:1}}
            >
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{width:44,height:44,borderRadius:11,background:op.cat==="barsel"?C.goldBg:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{op.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{fontSize:"clamp(12px,1.2vw,14px)",fontWeight:600,color:C.navy}}>{op.customer}</span>
                    <Bdg status={op.status}/>
                  </div>
                  <div style={{fontSize:"clamp(10px,1vw,12px)",color:C.soft,marginBottom:3}}>{op.service}</div>
                  <div style={{fontSize:"clamp(10px,1vw,12px)",color:C.navyMid}}>🕐 {op.date} kl. {op.time}</div>
                  <div style={{fontSize:"clamp(10px,1vw,12px)",color:C.soft,marginTop:4,lineHeight:1.45}}>📍 {op.address}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <NurseBottomNav onNav={onNav} activeId="nurse-oppdrag"/>
    </div>
  );
}
function NurseInnsjekk({onNav,focusOppdragId}){
  const{toast,ToastContainer}=useToast();
  const resolvedId=focusOppdragId!=null&&String(focusOppdragId)!==""?String(focusOppdragId):nurseDefaultInnsjekkOppdragId();
  const op=OPPDRAG.find(o=>String(o.id)===resolvedId)??OPPDRAG[0];
  const[done,setDone]=useState(false);
  const[checks,setChecks]=useState([false,false,false,false,false]);
  useEffect(()=>{
    setDone(false);
    setChecks([false,false,false,false,false]);
  },[op.id]);
  const nesteEtter=OPPDRAG.filter(o=>String(o.id)!==String(op.id)&&o.status!=="completed")[0];
  const notatTekst=op.id==="2"
    ?"Dør kode 1234. Pårørende: Kari (tlf. 900 12 345)."
    :`Besøk hos ${op.customer}. Meld fra til koordinator ved avvik.`;
  if(done)return(
    <div className="phone fu">
      <ToastContainer/>
      <PH title="Oppdrag fullført" onBack={()=>onNav("nurse-hjem")}/>
      <div className="sa" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center",flex:1}}>
        <div style={{fontSize:56,marginBottom:14}}>✅</div>
        <div className="fr" style={{fontSize:20,fontWeight:600,color:C.navy,marginBottom:6}}>Oppdrag fullført!</div>
        <div style={{fontSize:12,color:C.soft,lineHeight:1.6,marginBottom:22,maxWidth:320}}>
          Rapport sendt for {op.customer}.
          {nesteEtter?` Neste kl. ${nesteEtter.time} hos ${nesteEtter.customer}.`:" Du er ferdig med planlagte oppdrag i dag."}
        </div>
        <button type="button" onClick={()=>onNav("nurse-hjem")} className="btn bp bf" style={{borderRadius:11}}>Tilbake til arbeidsdag</button>
      </div>
      <NurseBottomNav onNav={onNav} activeId="nurse-innsjekk"/>
    </div>
  );
  return(
    <div className="phone fu">
      <ToastContainer/>
      <PH title={`Innsjekk · ${op.customer}`} onBack={()=>onNav("nurse-oppdrag")}/>
      <div className="sa" style={{padding:13}}>
        <div className="card cp" style={{marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:44,height:44,borderRadius:11,background:op.cat==="barsel"?C.goldBg:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{op.icon}</div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:C.navy}}>{op.customer}</div>
              <div style={{fontSize:10,color:C.soft}}>{op.service} · {op.date} kl. {op.time}</div>
              <div style={{fontSize:10,color:C.soft,marginTop:2}}>📍 {op.address}</div>
              <div style={{marginTop:6}}><Bdg status={op.status}/></div>
            </div>
          </div>
          <div style={{background:C.greenXL,borderRadius:8,padding:"8px 10px",fontSize:11,color:C.navyMid,lineHeight:1.6}}><strong>Notat:</strong> {notatTekst}</div>
          <div style={{display:"flex",gap:7,marginTop:10,flexWrap:"wrap"}}>
            <button type="button" className="btn" style={{flex:1,minWidth:90,fontSize:10,padding:"7px 0",background:C.greenBg,color:C.green,borderRadius:8}} onClick={()=>toast(`Ringer ${op.phone}`,"ok")}>📞 Ring</button>
            <button type="button" className="btn" onClick={()=>onNav("chat-kunde")} style={{flex:1,minWidth:90,fontSize:10,padding:"7px 0",background:C.greenBg,color:C.green,borderRadius:8}}>💬 Chat</button>
            <button type="button" className="btn" style={{flex:1,minWidth:90,fontSize:10,padding:"7px 0",background:C.greenBg,color:C.green,borderRadius:8}} onClick={()=>toast("Åpner kart","ok")}>🗺️ Kart</button>
          </div>
        </div>
        <div style={{fontSize:10,fontWeight:600,color:C.navy,textTransform:"uppercase",letterSpacing:1,marginBottom:7}}>Sjekkliste</div>
        {["Vasket kjøkken og bad","Støvsuget stue","Gjort klart middag","Handleliste sjekket","Medisin kontrollert"].map((item,i)=>(
          <div key={i} onClick={()=>setChecks(c=>c.map((v,j)=>j===i?!v:v))} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"white",borderRadius:9,marginBottom:5,border:`1px solid ${C.border}`,cursor:"pointer"}}>
            <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${C.green}`,background:checks[i]?C.green:"white",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{checks[i]&&<span style={{color:"white",fontSize:11}}>✓</span>}</div>
            <span style={{fontSize:12,color:checks[i]?C.soft:C.navy,textDecoration:checks[i]?"line-through":"none"}}>{item}</span>
          </div>
        ))}
        <div style={{marginTop:14}}><label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:5}}>Rapport / Notater</label><textarea className="inp" rows={3} placeholder="Beskriv gjennomføringen..." style={{resize:"none",lineHeight:1.5}}/></div>
        <button type="button" onClick={()=>setDone(true)} className="btn bp bf" style={{borderRadius:11,marginTop:12}}>✅ Fullfør og send rapport</button>
      </div>
      <NurseBottomNav onNav={onNav} activeId="nurse-innsjekk"/>
    </div>
  );
}

function NurseProfil({onNav,nurses=NURSES,onNurseProfilTilGodkjenning}){
  const{toast,ToastContainer}=useToast();
  const idx=NURSE_PROFIL_MOCK_INDEKS;
  const n=nurses[idx]??nurses[0];
  const[profilBildeMock,setProfilBildeMock]=useState(false);
  const[bio,setBio]=useState(()=>String(n?.bio||"").slice(0,150));
  const[tittel,setTittel]=useState(()=>(NURSE_TITTEL_OPTIONS.includes(n?.tittel)?n.tittel:NURSE_TITTEL_OPTIONS[0]));
  const[erfaringAar,setErfaringAar]=useState(()=>parseErfaringAar(n?.erfaring)||5);
  const[spes,setSpes]=useState(()=>new Set((n?.spesialitet||[]).filter(s=>NURSE_PROFIL_SPESIALITETER_CHIPS.includes(s))));
  const[omr,setOmr]=useState(()=>new Set(sykepleierOmradeTilChips(n?.omrade).filter(o=>NURSE_PROFIL_OMRADE_CHIPS.includes(o))));
  useEffect(()=>{
    const nn=nurses[idx]??nurses[0];
    if(!nn)return;
    setBio(String(nn.bio||"").slice(0,150));
    setTittel(NURSE_TITTEL_OPTIONS.includes(nn.tittel)?nn.tittel:NURSE_TITTEL_OPTIONS[0]);
    setErfaringAar(parseErfaringAar(nn.erfaring)||0);
    setSpes(new Set((nn.spesialitet||[]).filter(s=>NURSE_PROFIL_SPESIALITETER_CHIPS.includes(s))));
    setOmr(new Set(sykepleierOmradeTilChips(nn.omrade).filter(o=>NURSE_PROFIL_OMRADE_CHIPS.includes(o))));
  },[nurses,idx]);
  const toggle=(setFn,val)=>{
    setFn(prev=>{
      const next=new Set(prev);
      next.has(val)?next.delete(val):next.add(val);
      return next;
    });
  };
  const lagre=()=>{
    if(!onNurseProfilTilGodkjenning||!n){
      toast("Kan ikke sende til godkjenning (mangler handler)","info");
      return;
    }
    const erfaringStr=`${erfaringAar} år`;
    const spesArr=[...spes];
    const omrStr=[...omr].join(" / ");
    const apply={bio:bio.trim().slice(0,150),tittel,erfaring:erfaringStr,spesialitet:spesArr,omrade:omrStr||n.omrade};
    const sammendrag=profilEndringSammendrag(n,apply);
    // TODO: Supabase - lagre profilendring, send til godkjenning
    // TODO: Resend - varsle om ny profilendring til godkjenning
    onNurseProfilTilGodkjenning({
      nurseIndex:idx,
      nurseName:n.name,
      sammendrag,
      apply:{...apply,språk:n.språk,av:n.av,status:n.status,current:n.current,rating:n.rating,antallOppdrag:n.antallOppdrag,sertifisert:n.sertifisert},
    });
    toast("Profil sendt til godkjenning. Vi vil gjennomgå endringene dine.","ok");
  };
  return(
    <div className="phone fu">
      <ToastContainer/>
      <PH title="Min profil" onBack={()=>onNav("nurse-hjem")}/>
      <div className="sa" style={{padding:14}}>
        <div className="card cp" style={{marginBottom:12,textAlign:"center"}}>
          <div style={{position:"relative",display:"inline-block",marginBottom:10}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:profilBildeMock?`linear-gradient(135deg,${C.sky},${C.green})`:`linear-gradient(135deg,${C.greenDark},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:700,color:"white",margin:"0 auto",border:`3px solid ${C.greenBg}`}}>
              {profilBildeMock?"🖼":n.av}
            </div>
          </div>
          <div className="fr" style={{fontSize:17,fontWeight:600,color:C.navy,marginBottom:2}}>{n.name}</div>
          <div style={{fontSize:11,color:C.green,fontWeight:500,marginBottom:6}}>{n.tittel} · {n.erfaring} erfaring</div>
          <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:8}}>
            <div style={{textAlign:"center"}}><div className="fr" style={{fontSize:18,fontWeight:600,color:C.navy}}>{n.rating}</div><div style={{fontSize:9,color:C.soft}}>Rating</div></div>
            <div style={{width:1,background:C.border}}/>
            <div style={{textAlign:"center"}}><div className="fr" style={{fontSize:18,fontWeight:600,color:C.navy}}>{n.antallOppdrag}</div><div style={{fontSize:9,color:C.soft}}>Oppdrag</div></div>
            <div style={{width:1,background:C.border}}/>
            <div style={{textAlign:"center"}}><div className="fr" style={{fontSize:18,fontWeight:600,color:C.navy}}>5</div><div style={{fontSize:9,color:C.soft}}>År hos EiraNova</div></div>
          </div>
          <div style={{background:C.greenXL,borderRadius:8,padding:"6px 10px",fontSize:10,color:C.soft}}>
            📍 {n.omrade} · {n.sertifisert&&"✓ Autorisert helsepersonell"}
          </div>
        </div>

        <div className="card cp" style={{marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:6}}>Om meg (slik kunder ser deg nå)</div>
          <div style={{fontSize:11,color:C.navyMid,lineHeight:1.6,fontStyle:"italic"}}>"{n.bio}"</div>
        </div>

        <div className="card cp" style={{marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:C.navy,marginBottom:12}}>Rediger profil</div>
          <div style={{marginBottom:14,textAlign:"center"}}>
            <div style={{fontSize:9,fontWeight:600,color:C.soft,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Profilbilde</div>
            <button type="button" onClick={()=>setProfilBildeMock(true)} className="btn" style={{padding:"8px 14px",fontSize:10,borderRadius:8,background:C.greenXL,color:C.greenDark,border:`1px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
              Last opp bilde
            </button>
            <div style={{fontSize:9,color:C.soft,marginTop:6,lineHeight:1.4}}>Mock — bilde lagres ikke. Viser placeholder etter «opplasting».</div>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Kort beskrivelse <span style={{fontWeight:400,color:C.soft}}>(maks 150 tegn)</span></label>
            <textarea className="inp" value={bio} maxLength={150} onChange={e=>setBio(e.target.value.slice(0,150))} rows={3} style={{resize:"none",lineHeight:1.5}}/>
            <div style={{fontSize:9,color:C.soft,textAlign:"right",marginTop:3}}>{bio.length}/150</div>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Tittel</label>
            <select className="inp" value={tittel} onChange={e=>setTittel(e.target.value)} style={{fontSize:12,fontFamily:"inherit",width:"100%"}}>
              {NURSE_TITTEL_OPTIONS.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Antall års erfaring</label>
            <input className="inp" type="number" min={0} max={60} value={erfaringAar} onChange={e=>setErfaringAar(Math.min(60,Math.max(0,parseInt(e.target.value,10)||0)))} style={{fontSize:12}}/>
          </div>
          <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:6}}>Spesialiteter</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
            {NURSE_PROFIL_SPESIALITETER_CHIPS.map(s=>(
              <button key={s} type="button" onClick={()=>toggle(setSpes,s)} style={{fontSize:10,padding:"5px 10px",borderRadius:50,border:`1.5px solid ${spes.has(s)?C.green:C.border}`,background:spes.has(s)?C.greenBg:"white",color:spes.has(s)?C.greenDark:C.navyMid,fontFamily:"inherit",cursor:"pointer",fontWeight:500}}>{s}</button>
            ))}
          </div>
          <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:6}}>Dekningsområde</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
            {NURSE_PROFIL_OMRADE_CHIPS.map(o=>(
              <button key={o} type="button" onClick={()=>toggle(setOmr,o)} style={{fontSize:10,padding:"5px 10px",borderRadius:50,border:`1.5px solid ${omr.has(o)?C.green:C.border}`,background:omr.has(o)?C.greenBg:"white",color:omr.has(o)?C.greenDark:C.navyMid,fontFamily:"inherit",cursor:"pointer",fontWeight:500}}>{o}</button>
            ))}
          </div>
          <button type="button" onClick={lagre} className="btn bp bf" style={{width:"100%",borderRadius:10,fontSize:12}}>Lagre endringer</button>
        </div>

        <div className="card cp" style={{marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:8}}>Spesialiteter (godkjent)</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {n.spesialitet.map(s=>(
              <span key={s} style={{fontSize:11,background:C.greenBg,color:C.green,padding:"5px 11px",borderRadius:50,fontWeight:500,border:`1px solid ${C.border}`}}>{s}</span>
            ))}
          </div>
        </div>
        <div className="card cp" style={{marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:8}}>Språk</div>
          <div style={{display:"flex",gap:6}}>
            {n.språk.map(s=>(
              <span key={s} style={{fontSize:11,background:C.softBg,color:C.navyMid,padding:"5px 11px",borderRadius:50,fontWeight:500}}>🗣 {s}</span>
            ))}
          </div>
        </div>
        <div style={{background:C.greenXL,borderRadius:10,padding:"10px 13px",border:`1px solid ${C.border}`,marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:600,color:C.green,marginBottom:4}}>👁 Slik ser kunder deg</div>
          <div style={{fontSize:10,color:C.soft,lineHeight:1.55}}>Navn, tittel, erfaring, bio, spesialiteter og rating er synlig for kunder ved bestilling. Kontaktinfo og personopplysninger er aldri synlig.</div>
        </div>
        <button type="button" style={{width:"100%",padding:"10px",background:"white",border:`1.5px solid ${C.danger}`,borderRadius:10,fontSize:11,color:C.danger,cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>
          Meld deg utilgjengelig i dag
        </button>
        <button type="button" onClick={()=>onNav("nurse-login")} className="btn" style={{width:"100%",marginTop:12,padding:"12px 0",fontSize:13,borderRadius:11,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
          Logg ut
        </button>
        <div style={{height:16}}/>
      </div>
      <NurseBottomNav onNav={onNav} activeId="nurse-profil"/>
    </div>
  );
}

function NurseRapport({onNav}){
  return(
    <div className="phone fu">
      <PH title="Dagsrapport" onBack={()=>onNav("nurse-hjem")}/>
      <div className="sa" style={{padding:13}}>
        <div className="g2" style={{marginBottom:12}}>
          {[["✅","4","Fullførte"],["⏱️","6,5t","Timer"],["💰","1 660 kr","Fakturert"],["⭐","5/5","Score"]].map(([icon,val,label])=>(
            <div key={label} className="card cp" style={{textAlign:"center"}}>
              <div style={{fontSize:20,marginBottom:4}}>{icon}</div>
              <div className="fr" style={{fontSize:16,fontWeight:600,color:C.navy}}>{val}</div>
              <div style={{fontSize:9,color:C.soft}}>{label}</div>
            </div>
          ))}
        </div>
        {OPPDRAG.map((op,i)=>(
          <div key={op.id} style={{display:"flex",gap:10,marginBottom:10}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:op.status==="completed"||op.status==="active"?C.green:C.border,flexShrink:0,marginTop:5}}/>
              {i<OPPDRAG.length-1&&<div style={{width:1.5,flex:1,background:C.border,marginTop:2}}/>}
            </div>
            <div style={{flex:1,paddingBottom:8}}>
              <div style={{fontSize:10,color:C.soft,marginBottom:2}}>{op.time}</div>
              <div className="card cp" style={{padding:"9px 11px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontSize:12,fontWeight:600,color:C.navy}}>{op.customer}</div><div style={{fontSize:10,color:C.soft}}>{op.service}</div></div>
                  <Bdg status={op.status}/>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button onClick={()=>onNav("nurse-hjem")} className="btn bp bf" style={{borderRadius:11,marginTop:4}}>Send dagsrapport</button>
      </div>
    </div>
  );
}

// ══ ADMIN ════════════════════════════════════════════════════
const ANAV=[
  {id:"dashboard",icon:"📊",label:"Dashboard"},
  {id:"oppdrag",icon:"📋",label:"Oppdrag"},
  {id:"betalinger",icon:"💳",label:"Betalinger"},
  {id:"b2b",icon:"🏢",label:"B2B & Faktura"},
  {id:"ansatte",icon:"👥",label:"Ansatte & Roller"},
  {id:"okonomi",icon:"📊",label:"Økonomi & Regnskap"},
  {id:"tjenester",icon:"🏥",label:"Tjenester & priser"},
  {id:"innstillinger",icon:"⚙️",label:"Innstillinger"},
];

function ASidebar({current,open,onClose,onNav,onLogout}){
  return(
    <>
      <div className={`overlay${open?" open":""}`} onClick={onClose}/>
      <aside className={`sidebar${open?"":" closed"}`}>
        <div style={{padding:"16px 18px 12px",borderBottom:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:30,height:30,borderRadius:8,background:"rgba(74,188,158,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🤲</div>
          <div><div className="fr" style={{fontSize:15,fontWeight:600,color:"white"}}>Eira<span style={{color:"#E8C4A4"}}>Nova</span></div><div style={{fontSize:9,color:"rgba(255,255,255,.4)"}}>Adminpanel</div></div>
          <button onClick={onClose} className="hd" style={{marginLeft:"auto",background:"none",border:"none",color:"rgba(255,255,255,.5)",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <nav style={{flex:1,minHeight:0,overflowY:"auto",padding:"8px 0"}}>
          <div style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:1,padding:"10px 18px 4px"}}>Oversikt</div>
          {ANAV.map(item=>{
            const a=current===item.id;
            return(
              <button key={item.id} onClick={()=>{onNav(item.id);onClose();}}
                style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 18px",background:a?C.sidebarActive:"transparent",borderTop:"none",borderRight:"none",borderBottom:"none",borderLeft:`3px solid ${a?C.sidebarAccent:"transparent"}`,color:a?"white":C.sidebarText,fontSize:13,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                <span style={{fontSize:16,opacity:a?1:.75}}>{item.icon}</span>{item.label}
              </button>
            );
          })}
        </nav>
        <div style={{marginTop:"auto",flexShrink:0,borderTop:"1px solid rgba(255,255,255,.08)",padding:"12px 18px",paddingBottom:24}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:C.sidebarAccent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white",flexShrink:0}}>LA</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:"white"}}>Lise Andersen</div>
              <div style={{fontSize:10,color:C.sidebarMuted}}>Administrator</div>
            </div>
          </div>
          <button type="button" onClick={()=>{onLogout?.();onClose();}} style={{width:"100%",padding:"10px 12px",background:"rgba(255,255,255,.12)",color:"white",border:"1px solid rgba(255,255,255,.22)",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Logg ut</button>
        </div>
      </aside>
    </>
  );
}

function AHeader({onMenuClick,page}){
  const[showStatus,setShowStatus]=useState(false);
  const name=ANAV.find(n=>n.id===page)?.label??"Dashboard";
  const services=[{label:"Vipps MobilePay",ok:true},{label:"Stripe",ok:true},{label:"Supabase",ok:true},{label:"Google Workspace",ok:true},{label:"Fiken/EHF",ok:true}];
  return(
    <header className="ah" style={{position:"relative"}}>
      <button onClick={onMenuClick} className="hbg btn" style={{width:36,height:36,background:C.greenBg,borderRadius:8,fontSize:18,flexShrink:0,border:`1px solid ${C.border}`}}>☰</button>
      <div style={{flex:1,minWidth:0}}><div className="fr" style={{fontSize:16,fontWeight:600,color:C.navy}}>{name}</div></div>
      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        {/* CoreX system status gear */}
        <div style={{position:"relative"}}>
          <button onClick={()=>setShowStatus(s=>!s)} title="Systemstatus" style={{width:34,height:34,borderRadius:8,background:showStatus?C.greenBg:"white",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,position:"relative"}}>
            <span>⚙️</span>
            <div style={{position:"absolute",top:4,right:4,width:7,height:7,borderRadius:"50%",background:"#16A34A",border:"1.5px solid white"}}/>
          </button>
          {showStatus&&(
            <div style={{position:"absolute",top:42,right:0,background:"white",border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",width:220,boxShadow:"0 4px 20px rgba(0,0,0,.12)",zIndex:50}}>
              <div className="fr" style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:10}}>⚙️ Systemstatus</div>
              {services.map(s=>(
                <div key={s.label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontSize:11,color:C.navy}}>{s.label}</span>
                  <span style={{fontSize:10,color:"#16A34A",fontWeight:600}}>✓ OK</span>
                </div>
              ))}
              <div style={{fontSize:9,color:C.soft,marginTop:8,textAlign:"center"}}>Powered by CoreX · EiraNova</div>
            </div>
          )}
        </div>
        <div style={{width:34,height:34,borderRadius:8,background:C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🔔</div>
      </div>
    </header>
  );
}

function ADashboard({nurses=NURSES}){
  const kpis=[{label:"Oppdrag i dag",value:"12",icon:"📋",delta:"+2 fra i går",pos:true},{label:"Aktive sykepleiere",value:"4/6",icon:"🩺",delta:"2 på pause"},{label:"Omsetning (mtd)",value:"84 350 kr",icon:"💰",delta:"+18%",pos:true},{label:"Kundetilfredsh.",value:"4.9/5",icon:"⭐",delta:"Stabil"}];
  return(
    <div className="fu">
      <div className="g4" style={{marginBottom:18}}>
        {kpis.map(k=>(
          <div key={k.label} className="card cp">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><span style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.5}}>{k.label}</span><span style={{fontSize:18}}>{k.icon}</span></div>
            <div className="fr" style={{fontSize:22,fontWeight:600,color:C.navy,marginBottom:3}}>{k.value}</div>
            <div style={{fontSize:10,color:k.pos?C.green:C.soft}}>{k.delta}</div>
          </div>
        ))}
      </div>
      <div className="g2 g2m1" style={{marginBottom:18}}>
        <div className="card">
          <div className="fr" style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}`,fontSize:14,fontWeight:600,color:C.navy}}>Oppdrag i dag</div>
          {ORDERS.map(o=>(
            <div key={o.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",borderBottom:`0.5px solid ${C.border}`}}>
              <span style={{fontSize:14}}>{o.service.split(" ")[0]}</span>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:600,color:C.navy,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{o.customer}</div><div style={{fontSize:9,color:C.soft}}>{o.time} · {o.nurse}</div></div>
              <Bdg status={o.status}/>
            </div>
          ))}
        </div>
        <div className="card">
          <div style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}`,fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:600,color:C.navy}}>Sykepleiere nå</div>
          {nurses.map(n=>(
            <div key={n.name} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:`0.5px solid ${C.border}`}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:C.greenDark,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white",flexShrink:0}}>{n.av}</div>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:600,color:C.navy}}>{n.name}</div><div style={{fontSize:9,color:C.soft,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{n.current}</div></div>
              <Bdg status={n.status}/>
            </div>
          ))}
        </div>
      </div>
      <div className="card cp">
        <div className="fr" style={{fontSize:14,fontWeight:600,color:C.navy,marginBottom:12}}>Inntekt siste 7 dager</div>
        <div style={{display:"flex",gap:6,alignItems:"flex-end",height:70}}>
          {[42,68,55,80,73,90,84].map((v,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <div style={{width:"100%",background:i===6?C.green:C.greenBg,borderRadius:"4px 4px 0 0",height:`${v}%`,minHeight:4}}/>
              <div style={{fontSize:8,color:C.soft}}>{["Ma","Ti","On","To","Fr","Lø","Sø"][i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OppdrагModal({oppdrag,nurses,onClose,onSave}){
  const{toast,ToastContainer}=useToast();
  const[tab,setTab]=useState("detaljer");
  const[sykepleier,setSykepleier]=useState(oppdrag.nurse);
  const[dato,setDato]=useState(oppdrag.date);
  const[tid,setTid]=useState(oppdrag.time);
  const[arsak,setArsak]=useState("");
  const[arsakType,setArsakType]=useState("sykepleier_syk");
  const saved=()=>{onSave({...oppdrag,nurse:sykepleier,date:dato,time:tid},arsak,arsakType);onClose();};
  const arsakTyper=[
    {key:"sykepleier_syk",label:"🤒 Sykepleier syk",refusjon:"Full refusjon til kunde"},
    {key:"kunde_syk",label:"🤧 Kunde syk / avlyser",refusjon:"Avhenger av varslingstid"},
    {key:"tidendring",label:"🕐 Endre tidspunkt",refusjon:"Ingen refusjon"},
    {key:"bytte_sykepleier",label:"🔄 Bytte sykepleier",refusjon:"Ingen refusjon"},
    {key:"annet",label:"📝 Annet",refusjon:"Vurderes manuelt"},
  ];
  const valgtType=arsakTyper.find(a=>a.key===arsakType);
  const refusjonFarge=arsakType==="sykepleier_syk"?"#16A34A":arsakType==="kunde_syk"?C.gold:C.soft;
  return(
    <ModalPortal overlayStyle={{background:"rgba(0,0,0,.45)",padding:20}}>
      <ToastContainer/>
      <div style={{background:"white",borderRadius:18,width:"100%",maxWidth:620,maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
        {/* Header */}
        <div style={{padding:"18px 22px",background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,borderRadius:"18px 18px 0 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.55)",marginBottom:3,textTransform:"uppercase",letterSpacing:.6}}>Oppdrag #{oppdrag.id}</div>
            <div style={{fontSize:17,fontWeight:600,color:"white",marginBottom:2}}>{oppdrag.icon} {oppdrag.service}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.7)"}}>{oppdrag.customer} · {oppdrag.date} {oppdrag.time}</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:"white"}}>
          {[["detaljer","📋 Detaljer"],["endre","✏️ Endre oppdrag"],["historikk","🕐 Endringslogg"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"11px 0",fontSize:12,fontWeight:tab===t?600:400,border:"none",background:"transparent",color:tab===t?C.green:C.soft,borderBottom:tab===t?`2.5px solid ${C.green}`:"2.5px solid transparent",cursor:"pointer",fontFamily:"inherit"}}>
              {l}
            </button>
          ))}
        </div>
        <div style={{padding:"20px 22px"}}>
          {/* ── DETALJER ── */}
          {tab==="detaljer"&&(
            <div>
              <div className="stack-sm-1" style={{marginBottom:16}}>
                {[
                  {l:"Kunde",v:oppdrag.customer,icon:"👤"},
                  {l:"Telefon",v:oppdrag.phone,icon:"📞"},
                  {l:"Adresse",v:oppdrag.address,icon:"📍"},
                  {l:"Tjeneste",v:oppdrag.service,icon:"🏥"},
                  {l:"Dato & tid",v:`${oppdrag.date} kl. ${oppdrag.time}`,icon:"🕐"},
                  {l:"Sykepleier",v:oppdrag.nurse,icon:"🩺"},
                  {l:"Beløp",v:`${oppdrag.amount} kr`,icon:"💰"},
                  {l:"Betalt via",v:oppdrag.betaltVia==="b2b"?"B2B faktura":oppdrag.betaltVia==="vipps"?"💜 Vipps":"💳 Kort",icon:"🧾"},
                ].map(r=>(
                  <div key={r.l} style={{background:C.greenXL,borderRadius:9,padding:"10px 12px"}}>
                    <div style={{fontSize:9,color:C.soft,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>{r.icon} {r.l}</div>
                    <div style={{fontSize:12,fontWeight:600,color:C.navy}}>{r.v}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button onClick={()=>setTab("endre")} className="btn bp" style={{fontSize:12,padding:"8px 18px",borderRadius:9}}>✏️ Endre dette oppdraget</button>
                <button style={{fontSize:12,padding:"8px 18px",borderRadius:9,background:C.dangerBg,color:C.danger,border:`1px solid rgba(225,29,72,.2)`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>🚫 Avlys oppdrag</button>
              </div>
            </div>
          )}
          {/* ── ENDRE ── */}
          {tab==="endre"&&(
            <div>
              {/* Årsak-type velger */}
              <div style={{marginBottom:18}}>
                <div style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:10}}>Hva er årsaken til endringen?</div>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {arsakTyper.map(a=>(
                    <div key={a.key} onClick={()=>setArsakType(a.key)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderRadius:10,border:`2px solid ${arsakType===a.key?C.green:C.border}`,background:arsakType===a.key?C.greenXL:"white",cursor:"pointer",transition:"all .15s"}}>
                      <span style={{fontSize:12,fontWeight:arsakType===a.key?600:400,color:arsakType===a.key?C.navy:C.navyMid}}>{a.label}</span>
                      <span style={{fontSize:10,color:arsakType===a.key?"#16A34A":C.soft,fontWeight:500}}>{a.refusjon}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Refusjonsinfo */}
              <div style={{background:arsakType==="sykepleier_syk"?"#F0FDF4":arsakType==="kunde_syk"?C.goldBg:C.greenXL,borderRadius:9,padding:"10px 13px",marginBottom:16,border:`1px solid ${arsakType==="sykepleier_syk"?"rgba(22,163,74,.2)":arsakType==="kunde_syk"?"rgba(196,149,106,.3)":C.border}`}}>
                <div style={{fontSize:11,fontWeight:600,color:refusjonFarge,marginBottom:2}}>
                  {arsakType==="sykepleier_syk"?"✓ Full refusjon — EiraNova avlyser":
                   arsakType==="kunde_syk"?`Kanselleringsregler: ${KANSELLERING_REGLER.fristTimer}t+ = gratis · under ${KANSELLERING_REGLER.gebyrProsent50}t = 50% · under ${KANSELLERING_REGLER.gebyrProsent100}t = 100%`:
                   arsakType==="tidendring"?"Ingen refusjon — tidsendring":
                   arsakType==="bytte_sykepleier"?"Ingen refusjon — sykepleierbytte":"Vurderes manuelt etter gjennomgang"}
                </div>
                {arsakType==="sykepleier_syk"&&<div style={{fontSize:10,color:C.soft}}>Kunden varsles automatisk. Refusjon via {oppdrag.betaltVia==="b2b"?"kreditnota på neste faktura":oppdrag.betaltVia==="vipps"?"Vipps API (1-3 dager)":"Stripe (5-10 dager)"}.</div>}
              </div>
              {/* Endre-felter */}
              <div className="stack-sm-1" style={{marginBottom:14}}>
                {(arsakType==="tidendring"||arsakType==="annet")&&(
                  <>
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Ny dato</label>
                      <input value={dato} onChange={e=>setDato(e.target.value)} style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}} placeholder="Man 4. mars"/>
                    </div>
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Nytt klokkeslett</label>
                      <input value={tid} onChange={e=>setTid(e.target.value)} style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}} placeholder="09:00"/>
                    </div>
                  </>
                )}
                {(arsakType==="bytte_sykepleier"||arsakType==="sykepleier_syk")&&(
                  <div style={{gridColumn:"1/-1"}}>
                    <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:6}}>Velg ny sykepleier</label>
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {nurses.filter(n=>n.status==="available"||n.status==="on_assignment").map(n=>(
                        <div key={n.name} onClick={()=>setSykepleier(n.name)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 13px",borderRadius:10,border:`2px solid ${sykepleier===n.name?C.green:C.border}`,background:sykepleier===n.name?C.greenXL:"white",cursor:"pointer"}}>
                          <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDark},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white",flexShrink:0}}>{n.av}</div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:12,fontWeight:600,color:C.navy}}>{n.name}</div>
                            <div style={{fontSize:10,color:C.soft}}>{n.tittel} · {n.omrade}</div>
                          </div>
                          <span style={{fontSize:10,padding:"2px 8px",borderRadius:50,background:n.status==="available"?"#F0FDF4":C.goldBg,color:n.status==="available"?"#16A34A":C.goldDark,fontWeight:600}}>
                            {n.status==="available"?"Ledig":"På oppdrag"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Notat-felt */}
              <div style={{marginBottom:16}}>
                <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Notat / utfyllende årsak</label>
                <textarea value={arsak} onChange={e=>setArsak(e.target.value)} rows={3} style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL,resize:"vertical"}} placeholder="Beskriv årsaken kort..."/>
              </div>
              {/* Varsling */}
              <div style={{background:C.softBg,borderRadius:9,padding:"10px 13px",marginBottom:16,fontSize:10,color:C.navyMid,lineHeight:1.6}}>
                📧 <strong>Automatisk varsling:</strong> {oppdrag.customer} mottar e-post/SMS om endringen. Sykepleier varsles via appen.
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={saved} className="btn bp" style={{flex:1,padding:"11px 0",fontSize:13,borderRadius:10}}>
                  {arsakType==="sykepleier_syk"||arsakType==="kunde_syk"?"🚫 Avlys & varsle":"✓ Lagre endring & varsle"}
                </button>
                <button onClick={onClose} style={{padding:"11px 18px",fontSize:12,borderRadius:10,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>Avbryt</button>
              </div>
            </div>
          )}
          {/* ── HISTORIKK ── */}
          {tab==="historikk"&&(
            <div>
              <div style={{fontSize:11,color:C.soft,marginBottom:14}}>Alle endringer logges automatisk og kan ikke slettes (GDPR-sporbarhet).</div>
              <div style={{position:"relative"}}>
                <div style={{position:"absolute",left:16,top:8,bottom:8,width:2,background:C.border}}/>
                {oppdrag.endringer.map((e,i)=>(
                  <div key={i} style={{display:"flex",gap:14,marginBottom:14,position:"relative"}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:i===0?C.greenBg:C.softBg,border:`2px solid ${i===0?C.green:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,zIndex:1}}>
                      {i===0?"📄":"✏️"}
                    </div>
                    <div style={{flex:1,paddingTop:4}}>
                      <div style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:2}}>{e.handling}</div>
                      {e.arsak&&<div style={{fontSize:11,color:C.soft,marginBottom:2}}>Årsak: {e.arsak}</div>}
                      <div style={{fontSize:10,color:C.soft}}>{e.av} · {e.dato}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}

function AOppdrag({setDrawer,orders,setOrders,nurses=NURSES}){
  const{toast,ToastContainer}=useToast();
  const[filter,setFilter]=useState("Alle");
  const[selectedOppdrag,setSelectedOppdrag]=useState(null);
  const[krediterOppdrag,setKrediterOppdrag]=useState(null);
  const filters=["Alle","I dag","Kommende","Fullført","Avlyst"];
  const filteredOrders=orders.filter(o=>{
    if(filter==="Alle")return true;
    if(filter==="I dag")return o.date?.includes("Man 3");
    if(filter==="Kommende")return o.status==="upcoming"||o.status==="tildelt";
    if(filter==="Fullført")return o.status==="completed";
    if(filter==="Avlyst")return o.status==="avlyst"||o.status==="cancelled";
    return true;
  });
  const handleSave=(updated,arsak,arsakType)=>{
    setOrders(prev=>prev.map(o=>o.id===updated.id?{
      ...updated,
      status:arsakType==="sykepleier_syk"||arsakType==="kunde_syk"?"avlyst":o.status,
      endringer:[...(updated.endringer||[]),{dato:new Date().toLocaleString("nb-NO"),av:"Lise Andersen (admin)",handling:
        arsakType==="sykepleier_syk"?`Avlyst — sykepleier syk. ${updated.nurse?`Ny: ${updated.nurse}`:"Ingen erstatning"}`:
        arsakType==="bytte_sykepleier"?`Sykepleier endret → ${updated.nurse}`:
        arsakType==="tidendring"?`Tid endret → ${updated.date} ${updated.time}`:
        arsakType==="kunde_syk"?"Avlyst — kunde syk":"Endret",
        arsak}]
    }:o));
  };
  return(
    <div className="fu">
      {selectedOppdrag&&<OppdrагModal oppdrag={selectedOppdrag} nurses={nurses} onClose={()=>setSelectedOppdrag(null)} onSave={handleSave}/>}
      {krediterOppdrag&&<KrediterPrivatModal prefilledOppdrag={krediterOppdrag} ordersCatalog={orders} onClose={()=>setKrediterOppdrag(null)} onSave={(data)=>setKrediterOppdrag(null)}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {filters.map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:"5px 12px",borderRadius:50,fontSize:11,fontWeight:filter===f?600:400,border:filter===f?`1.5px solid ${C.green}`:`1px solid ${C.border}`,background:filter===f?C.greenBg:"white",color:filter===f?C.green:C.soft,cursor:"pointer",fontFamily:"inherit"}}>{f}</button>
          ))}
        </div>
        <button onClick={()=>setDrawer("oppdrag")} className="btn bp" style={{fontSize:11,padding:"7px 14px"}}>+ Nytt oppdrag</button>
      </div>
      <div className="card tw">
        <table className="tbl">
          <thead><tr><th>ID</th><th>Tjeneste</th><th>Kunde</th><th>Sykepleier</th><th>Tid</th><th>Status</th><th>Beløp</th><th>Handling</th></tr></thead>
          <tbody>{filteredOrders.map(o=>(
            <tr key={o.id} style={{cursor:"pointer",background:o.status==="avlyst"||o.status==="cancelled"?"#FFFBFB":"white"}}>
              <td style={{fontFamily:"monospace",fontSize:10,color:C.soft}}>{o.id}</td>
              <td style={{fontWeight:500}}>{o.service}</td>
              <td>{o.customer}</td>
              <td style={{color:C.soft}}>{o.nurse}</td>
              <td style={{color:C.soft,whiteSpace:"nowrap"}}>{o.date} {o.time}</td>
              <td><Bdg status={o.status}/></td>
              <td style={{fontWeight:600}}>{o.amount} kr</td>
              <td>
                <div style={{display:"flex",gap:5}}>
                  <button onClick={()=>{const full=OPPDRAG.find(op=>op.service===o.service&&op.customer===o.customer)||{...o,phone:"—",betaltVia:o.betaltVia||"vipps",opprettet:o.date,endringer:[{dato:o.date+" "+o.time,av:"System",handling:"Bestilling opprettet",arsak:null}]};setSelectedOppdrag(full);}}
                    style={{fontSize:10,padding:"3px 10px",background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit",fontWeight:600,whiteSpace:"nowrap"}}>
                    ✏️ Endre
                  </button>
                  {(o.status==="upcoming"||o.status==="tildelt")&&(
                    <button onClick={e=>{e.stopPropagation();toast("Avlysning registrert — kunden varsles","ok");}} style={{fontSize:10,padding:"3px 9px",background:C.dangerBg,color:C.danger,border:`1px solid rgba(225,29,72,.15)`,borderRadius:6,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                      🚫 Avlys
                    </button>
                  )}
                  {o.status!=="avlyst"&&o.status!=="cancelled"&&(
                    <button onClick={e=>{e.stopPropagation();setKrediterOppdrag(o);}}
                      style={{fontSize:10,padding:"3px 9px",background:"#F5F3FF",color:"#6D28D9",border:"1px solid #C4B5FD",borderRadius:6,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                      ↩️ Krediter
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {/* Infobox */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12,marginTop:16}}>
        {[
          {t:"🤒 Sykepleier syk",txt:"Bytt sykepleier eller avlys. Full refusjon til kunde automatisk. Kunde varsles umiddelbart.",bg:"#F0FDF4",c:"#166534"},
          {t:"🤧 Kunde avlyser",txt:`${KANSELLERING_REGLER.fristTimer}t+ før: gratis. Under ${KANSELLERING_REGLER.gebyrProsent50}t: 50% gebyr. Under ${KANSELLERING_REGLER.gebyrProsent100}t: fullt gebyr.`,bg:C.goldBg,c:C.goldDark},
          {t:"🕐 Tidsendring",txt:"Endre dato/tid på eksisterende bestilling. Ingen refusjon. Loggføres med hvem som endret.",bg:C.greenXL,c:C.navyMid},
        ].map(b=>(
          <div key={b.t} style={{background:b.bg,borderRadius:10,padding:"11px 14px",border:`1px solid ${b.c}22`}}>
            <div style={{fontSize:12,fontWeight:700,color:b.c,marginBottom:4}}>{b.t}</div>
            <div style={{fontSize:11,color:b.c,lineHeight:1.55,opacity:.85}}>{b.txt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KrediterPrivatModal({onClose,onSave,prefilledOppdrag=null,ordersCatalog=ORDERS}){
  // Hvis kalt fra oppdragstabellen er bestilling forhåndsutfylt
  const isPrefilled=!!prefilledOppdrag;
  const[modus,setModus]=useState(isPrefilled?"knyttet":null); // null=velg | "knyttet" | "fri"
  const[steg,setSteg]=useState(isPrefilled?2:1);
  const[metode,setMetode]=useState(prefilledOppdrag?.betaltVia||"vipps");
  const[kunde,setKunde]=useState(prefilledOppdrag?.customer||"");
  const[oppdrag,setOppdrag]=useState(prefilledOppdrag?.service||"");
  const[oppdragId,setOppdragId]=useState(prefilledOppdrag?.id||null);
  const[belop,setBelop]=useState(prefilledOppdrag?.amount?String(prefilledOppdrag.amount):"");
  const[arsak,setArsak]=useState("");
  const[arsakType,setArsakType]=useState("ikke_gjennomfort");
  const[sokTekst,setSokTekst]=useState("");

  const arsakTyper=[
    {key:"ikke_gjennomfort",label:"Oppdrag ikke gjennomført",sub:"Sykepleier syk eller force majeure"},
    {key:"feil_pris",label:"Feil pris belastet",sub:"Prisavvik mot det avtalte"},
    {key:"kunde_avlyst",label:"Kunde avlyste i tide",sub:"Avlysning innenfor fristen"},
    {key:"kvalitet",label:"Kvalitetsklage",sub:"Kunde ikke fornøyd — etter vurdering"},
    {key:"annet",label:"Annet",sub:"Beskriv årsak manuelt"},
  ];
  const refMetoder=[
    {key:"vipps",label:"💜 Vipps",sub:"Tilbake på Vipps innen 1-3 virkedager",color:"#FF5B24"},
    {key:"stripe",label:"💳 Kort (Stripe)",sub:"Tilbake på kort innen 5-10 virkedager",color:C.sky},
  ];

  const filteredOrders=ordersCatalog.filter(o=>
    o.betaltVia!=="b2b"&&
    (sokTekst===""||o.customer.toLowerCase().includes(sokTekst.toLowerCase())||o.service.toLowerCase().includes(sokTekst.toLowerCase()))
  );

  const stegLabels=modus==="fri"?["Type","Detaljer","Bekreft"]:["Bestilling","Detaljer","Bekreft"];

  return(
    <ModalPortal overlayStyle={{background:"rgba(0,0,0,.5)",padding:20}}>
      <div style={{background:"white",borderRadius:18,width:"100%",maxWidth:540,maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>

        {/* Header */}
        <div style={{padding:"18px 22px",background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.55)",textTransform:"uppercase",letterSpacing:.6,marginBottom:2}}>
              {isPrefilled?`Oppdrag #${prefilledOppdrag.id} · ${prefilledOppdrag.customer}`:"Ny kreditering"}
            </div>
            <div style={{fontSize:16,fontWeight:600,color:"white"}}>↩️ Krediter privatkunde</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16}}>×</button>
        </div>

        {/* Steg-indikator — vises kun etter modusvalg */}
        {modus&&(
          <div style={{display:"flex",padding:"14px 22px",borderBottom:`1px solid ${C.border}`,gap:0}}>
            {stegLabels.map((s,i)=>(
              <div key={s} style={{display:"flex",alignItems:"center",flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:steg>i+1?C.green:steg===i+1?C.green:"#E5E7EB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:steg>=i+1?"white":C.soft}}>
                    {steg>i+1?"✓":i+1}
                  </div>
                  <span style={{fontSize:11,fontWeight:steg===i+1?600:400,color:steg===i+1?C.navy:C.soft}}>{s}</span>
                </div>
                {i<2&&<div style={{flex:1,height:1,background:C.border,margin:"0 8px"}}/>}
              </div>
            ))}
          </div>
        )}

        <div style={{padding:"20px 22px"}}>

          {/* ── MODUSVALG (kun fri flyt, ikke prefilled) ── */}
          {!modus&&(
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.navy,marginBottom:5}}>Hva slags kreditering er dette?</div>
              <div style={{fontSize:11,color:C.soft,marginBottom:18,lineHeight:1.6}}>
                Velg om krediteringen er knyttet til en konkret bestilling, eller om det er en frittstående kreditering.
              </div>
              {[
                {key:"knyttet",icon:"🔗",title:"Knytt til bestilling",sub:"Finn bestillingen og krediter direkte. Kreditering knyttes til bestillingens historikk og spores automatisk.",bg:C.greenXL,border:C.green},
                {key:"fri",icon:"✏️",title:"Fri kreditering",sub:"Ingen bestillings-ID. Bruk for goodwill-kompensasjon, generell rabatt eller avtalte justeringer.",bg:"#F5F3FF",border:"#A78BFA"},
              ].map(m=>(
                <div key={m.key} onClick={()=>{setModus(m.key);setSteg(1);}}
                  style={{padding:"16px 18px",borderRadius:13,border:`2px solid ${m.border}`,background:m.bg,cursor:"pointer",marginBottom:10,transition:"all .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform=""}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{fontSize:28}}>{m.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:4}}>{m.title}</div>
                      <div style={{fontSize:11,color:C.soft,lineHeight:1.55}}>{m.sub}</div>
                    </div>
                    <span style={{color:C.soft,fontSize:20}}>›</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── KNYTTET: Steg 1 — Finn bestilling ── */}
          {modus==="knyttet"&&steg===1&&(
            <div>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Søk opp bestilling</label>
                <input value={sokTekst} onChange={e=>setSokTekst(e.target.value)}
                  style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${C.border}`,borderRadius:9,fontSize:12,fontFamily:"inherit",background:C.greenXL}}
                  placeholder="Kundenavn, tjeneste eller bestillings-ID..."/>
              </div>
              <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:8}}>Bestillinger</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16,maxHeight:280,overflowY:"auto"}}>
                {filteredOrders.map(o=>(
                  <div key={o.id} onClick={()=>{setKunde(o.customer);setOppdrag(o.service);setBelop(String(o.amount));setOppdragId(o.id);setMetode(o.betaltVia||"vipps");setSteg(2);}}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:9,border:`1.5px solid ${C.border}`,cursor:"pointer",background:"white",transition:"all .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=C.green}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                    <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>
                      {o.service?.includes("Morg")?"🚿":o.service?.includes("Prak")?"🏠":o.service?.includes("Trille")?"🍃":"☕"}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:C.navy}}>{o.customer}</div>
                      <div style={{fontSize:10,color:C.soft,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.service} · {o.date} · {o.time}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:11,fontWeight:700,color:C.navy}}>{o.amount} kr</div>
                      <span style={{fontSize:9,background:o.betaltVia==="vipps"?"#FFF0EB":C.skyBg,color:o.betaltVia==="vipps"?C.vipps:C.sky,padding:"1px 7px",borderRadius:50,fontWeight:600}}>
                        {o.betaltVia==="vipps"?"💜":"💳"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={()=>setModus(null)} style={{width:"100%",padding:"10px 0",fontSize:12,borderRadius:10,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>← Tilbake</button>
            </div>
          )}

          {/* ── FRI: Steg 1 — Skriv inn manuelt ── */}
          {modus==="fri"&&steg===1&&(
            <div>
              <div style={{background:"#F5F3FF",borderRadius:9,padding:"9px 13px",fontSize:10,color:"#5B21B6",marginBottom:16,lineHeight:1.55,border:"1px solid #C4B5FD"}}>
                ✏️ <strong>Fri kreditering</strong> — ingen bestillings-ID kreves. Bruk dette for kompensasjon, goodwill eller avtalte justeringer utenfor enkeltbestillinger.
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <div style={{gridColumn:"1/-1"}}>
                  <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Kundenavn</label>
                  <input value={kunde} onChange={e=>setKunde(e.target.value)} style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}} placeholder="Navn på kunden"/>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Beskrivelse</label>
                  <input value={oppdrag} onChange={e=>setOppdrag(e.target.value)} style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}} placeholder="F.eks. Goodwill-kompensasjon"/>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Beløp (kr)</label>
                  <input value={belop} onChange={e=>setBelop(e.target.value)} type="number" style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}} placeholder="0"/>
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setModus(null)} style={{padding:"10px 16px",fontSize:12,borderRadius:10,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>← Tilbake</button>
                <button onClick={()=>kunde&&belop&&setSteg(2)} className="btn bp" style={{flex:1,padding:"10px 0",fontSize:13,borderRadius:10,opacity:kunde&&belop?1:.5}}>Neste →</button>
              </div>
            </div>
          )}

          {/* ── Steg 2 — Årsak + metode (felles for begge modi) ── */}
          {steg===2&&(
            <div>
              {/* Bestillingskort hvis knyttet */}
              {modus==="knyttet"&&oppdragId&&(
                <div style={{background:C.greenXL,borderRadius:10,padding:"10px 13px",marginBottom:16,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:16}}>🔗</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:600,color:C.navy}}>Knyttet til bestilling #{oppdragId}</div>
                    <div style={{fontSize:10,color:C.soft}}>{oppdrag} · {kunde} · {belop} kr</div>
                  </div>
                  <span style={{fontSize:10,background:"#F0FDF4",color:"#16A34A",padding:"2px 8px",borderRadius:50,fontWeight:600}}>✓ Sporbar</span>
                </div>
              )}
              {modus==="fri"&&(
                <div style={{background:"#F5F3FF",borderRadius:10,padding:"10px 13px",marginBottom:16,border:"1px solid #C4B5FD",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:16}}>✏️</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#5B21B6"}}>Fri kreditering — {kunde}</div>
                    <div style={{fontSize:10,color:C.soft}}>{oppdrag} · {Number(belop).toLocaleString("nb-NO")} kr</div>
                  </div>
                </div>
              )}
              {/* Årsak */}
              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:8}}>Årsak til kreditering</label>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {arsakTyper.map(a=>(
                    <div key={a.key} onClick={()=>setArsakType(a.key)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,border:`2px solid ${arsakType===a.key?C.green:C.border}`,background:arsakType===a.key?C.greenXL:"white",cursor:"pointer"}}>
                      <div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${arsakType===a.key?C.green:C.border}`,background:arsakType===a.key?C.green:"white",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {arsakType===a.key&&<div style={{width:6,height:6,borderRadius:"50%",background:"white"}}/>}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{a.label}</div>
                        <div style={{fontSize:10,color:C.soft}}>{a.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {arsakType==="annet"&&(
                <div style={{marginBottom:14}}>
                  <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Utfyllende beskrivelse</label>
                  <textarea value={arsak} onChange={e=>setArsak(e.target.value)} rows={2} style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL,resize:"vertical"}} placeholder="Beskriv årsaken..."/>
                </div>
              )}
              {/* Refusjonsmetode */}
              <div style={{marginBottom:16}}>
                <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:8}}>Refusjonsmetode</label>
                <div style={{display:"flex",gap:8}}>
                  {refMetoder.map(m=>(
                    <div key={m.key} onClick={()=>setMetode(m.key)} style={{flex:1,padding:"10px 12px",borderRadius:9,border:`2px solid ${metode===m.key?m.color:C.border}`,background:metode===m.key?`${m.color}12`:"white",cursor:"pointer",textAlign:"center"}}>
                      <div style={{fontSize:12,fontWeight:600,color:metode===m.key?m.color:C.navy,marginBottom:2}}>{m.label}</div>
                      <div style={{fontSize:9,color:C.soft}}>{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setSteg(1)} style={{padding:"10px 16px",fontSize:12,borderRadius:10,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>← Tilbake</button>
                <button onClick={()=>setSteg(3)} className="btn bp" style={{flex:1,padding:"10px 0",fontSize:13,borderRadius:10}}>Se oppsummering →</button>
              </div>
            </div>
          )}

          {/* ── Steg 3 — Bekreft ── */}
          {steg===3&&(
            <div>
              <div style={{background:C.greenXL,borderRadius:12,padding:"16px 18px",marginBottom:16,border:`1px solid ${C.border}`}}>
                <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:12}}>Oppsummering</div>
                {[
                  {l:"Type",v:modus==="knyttet"?"🔗 Knyttet til bestilling #"+oppdragId:"✏️ Fri kreditering"},
                  {l:"Kunde",v:kunde},
                  {l:"Oppdrag / beskrivelse",v:oppdrag},
                  {l:"Beløp",v:`${Number(belop).toLocaleString("nb-NO")} kr`},
                  {l:"Årsak",v:arsakTyper.find(a=>a.key===arsakType)?.label+(arsak?" — "+arsak:"")},
                  {l:"Refusjon via",v:metode==="vipps"?"💜 Vipps — 1-3 virkedager":"💳 Kort — 5-10 virkedager"},
                ].map(r=>(
                  <div key={r.l} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:12,gap:12}}>
                    <span style={{color:C.soft,flexShrink:0}}>{r.l}</span>
                    <span style={{fontWeight:600,color:C.navy,textAlign:"right"}}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div style={{background:"#FFF3E0",borderRadius:9,padding:"9px 13px",fontSize:10,color:"#92400E",marginBottom:16,lineHeight:1.6}}>
                ⚠️ Denne handlingen kan ikke angres. Refusjonen sendes umiddelbart via {metode==="vipps"?"Vipps ePayments API":"Stripe refunds API"}.
                {modus==="knyttet"&&" Bestilling #"+oppdragId+" merkes som kreditert."}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setSteg(2)} style={{padding:"10px 16px",fontSize:12,borderRadius:10,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>← Tilbake</button>
                <button onClick={()=>{onSave({kunde,oppdrag,oppdragId,belop,arsak:arsakTyper.find(a=>a.key===arsakType)?.label,metode,modus});onClose();}} className="btn bp" style={{flex:1,padding:"10px 0",fontSize:13,borderRadius:10}}>
                  ✓ Bekreft refusjon — {Number(belop).toLocaleString("nb-NO")} kr
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}


function KreditnotaB2BModal({onClose,onSave,prefilledOppdrag=null}){
  const isPrefilled=!!prefilledOppdrag;
  const[modus,setModus]=useState(isPrefilled?"knyttet":null); // null|"knyttet"|"fri"
  const[steg,setSteg]=useState(isPrefilled?2:1);
  const[kunde,setKunde]=useState(prefilledOppdrag?.customer||"");
  const[kundeOrg,setKundeOrg]=useState(null);
  const[sokTekst,setSokTekst]=useState("");
  const[valgteOppdrag,setValgteOppdrag]=useState(prefilledOppdrag?[prefilledOppdrag]:[]);
  const[linjer,setLinjer]=useState(
    prefilledOppdrag
      ?[{beskrivelse:prefilledOppdrag.service,antall:1,pris:String(prefilledOppdrag.amount||0)}]
      :[{beskrivelse:"",antall:1,pris:""}]
  );
  const[arsak,setArsak]=useState("");
  const[levering,setLevering]=useState("ehf");

  const total=linjer.reduce((s,l)=>s+(Number(l.antall)||0)*(Number(l.pris)||0),0);
  const addLinje=()=>setLinjer(p=>[...p,{beskrivelse:"",antall:1,pris:""}]);
  const updateLinje=(i,field,val)=>setLinjer(p=>p.map((l,j)=>j===i?{...l,[field]:val}:l));

  // B2B-oppdrag = orders der betaltVia er b2b
  const b2bOrders=ORDERS.filter(o=>o.betaltVia==="b2b"&&
    (sokTekst===""||o.customer.toLowerCase().includes(sokTekst.toLowerCase())||o.service.toLowerCase().includes(sokTekst.toLowerCase()))
  );

  const toggleOppdrag=(o)=>{
    const exists=valgteOppdrag.find(v=>v.id===o.id);
    if(exists){
      setValgteOppdrag(p=>p.filter(v=>v.id!==o.id));
      setLinjer(p=>p.filter(l=>l._oppdragId!==o.id));
    } else {
      setValgteOppdrag(p=>[...p,o]);
      setLinjer(p=>[...p,{beskrivelse:o.service,antall:1,pris:String(o.amount||0),_oppdragId:o.id}]);
    }
  };

  const b2bKunder=B2B_C.map(c=>c.name);
  const selectedOrg=B2B_C.find(c=>c.name===kunde);

  return(
    <ModalPortal overlayStyle={{background:"rgba(0,0,0,.5)",padding:20}}>
      <div style={{background:"white",borderRadius:18,width:"100%",maxWidth:600,maxHeight:"92vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>

        {/* Header */}
        <div style={{padding:"18px 22px",background:"linear-gradient(135deg,#1A2E24,#2C5C52)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.55)",textTransform:"uppercase",letterSpacing:.6,marginBottom:2}}>
              {isPrefilled?`B2B Oppdrag #${prefilledOppdrag.id} · ${prefilledOppdrag.customer}`:"B2B Kreditering"}
            </div>
            <div style={{fontSize:16,fontWeight:600,color:"white"}}>📄 Utstedd kreditnota</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16}}>×</button>
        </div>

        {/* Steg-indikator */}
        {modus&&(
          <div style={{display:"flex",padding:"14px 22px",borderBottom:`1px solid ${C.border}`,gap:0}}>
            {(modus==="knyttet"?["Oppdrag","Kreditlinjer","Send"]:["Mottaker","Kreditlinjer","Send"]).map((s,i)=>(
              <div key={s} style={{display:"flex",alignItems:"center",flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:steg>i+1?"#2C5C52":steg===i+1?"#2C5C52":"#E5E7EB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:steg>=i+1?"white":C.soft}}>
                    {steg>i+1?"✓":i+1}
                  </div>
                  <span style={{fontSize:11,fontWeight:steg===i+1?600:400,color:steg===i+1?C.navy:C.soft}}>{s}</span>
                </div>
                {i<2&&<div style={{flex:1,height:1,background:C.border,margin:"0 8px"}}/>}
              </div>
            ))}
          </div>
        )}

        <div style={{padding:"20px 22px"}}>

          {/* ── MODUSVALG ── */}
          {!modus&&(
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.navy,marginBottom:5}}>Hva slags kreditnota er dette?</div>
              <div style={{fontSize:11,color:C.soft,marginBottom:18,lineHeight:1.6}}>Velg om kreditnotaen knyttes til konkrete oppdrag/fakturalinjer, eller om det er en frittstående kreditering.</div>
              {[
                {key:"knyttet",icon:"🔗",title:"Knytt til oppdrag",sub:"Velg ett eller flere konkrete B2B-oppdrag. Kreditlinjer fylles ut automatisk. Kreditnota knyttes til bestillings-ID og spores i fakturahistorikk.",bg:"#EDF5F3",border:"#2C5C52"},
                {key:"fri",icon:"✏️",title:"Fri kreditnota",sub:"Ingen bestillings-ID. Bruk for perioderabatter, kompensasjon, avtalte justeringer eller goodwill utenfor enkeltoppdrag.",bg:"#F5F3FF",border:"#A78BFA"},
              ].map(m=>(
                <div key={m.key} onClick={()=>{setModus(m.key);setSteg(1);}}
                  style={{padding:"16px 18px",borderRadius:13,border:`2px solid ${m.border}`,background:m.bg,cursor:"pointer",marginBottom:10,transition:"all .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform=""}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{fontSize:28}}>{m.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:4}}>{m.title}</div>
                      <div style={{fontSize:11,color:C.soft,lineHeight:1.55}}>{m.sub}</div>
                    </div>
                    <span style={{color:C.soft,fontSize:20}}>›</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── KNYTTET steg 1: Organisasjon → bruker → tjeneste ── */}
          {modus==="knyttet"&&steg===1&&(
            <div>
              {/* Steg A: Velg B2B-organisasjon */}
              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:8}}>
                  1. Velg organisasjon
                </label>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {b2bKunder.map(k=>{
                    const org=B2B_C.find(c=>c.name===k);
                    const orgOrders=ORDERS.filter(o=>o.b2bOrg===k);
                    return(
                      <div key={k} onClick={()=>{setKunde(k);setSokTekst("");setValgteOppdrag([]);setLinjer([{beskrivelse:"",antall:1,pris:""}]);}}
                        style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,
                          border:`2px solid ${kunde===k?"#2C5C52":C.border}`,
                          background:kunde===k?"#EDF5F3":"white",cursor:"pointer",transition:"all .15s"}}>
                        <div style={{width:38,height:38,borderRadius:10,background:"#EEF2FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🏢</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontWeight:600,color:C.navy}}>{k}</div>
                          <div style={{fontSize:10,color:C.soft}}>
                            {org?.type} · {org?.brukere?.length} brukere · {orgOrders.length} oppdrag
                          </div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontSize:9,color:C.soft}}>{org?.peppol?"EHF/PEPPOL":"PDF"}</div>
                          {kunde===k&&<div style={{fontSize:10,color:"#2C5C52",fontWeight:600}}>✓ Valgt</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Steg B: Søk på bruker og/eller tjeneste */}
              {kunde&&(()=>{
                const orgData=B2B_C.find(c=>c.name===kunde);
                const orgOrders=ORDERS.filter(o=>o.b2bOrg===kunde);

                // Unike brukere fra oppdrag for denne org
                const brukere=[...new Set(orgOrders.map(o=>o.customer))].map(navn=>{
                  const brukerInfo=orgData?.brukere?.find(b=>b.name===navn);
                  return {navn, info:brukerInfo};
                });

                const filteredOrders=orgOrders.filter(o=>{
                  const term=sokTekst.toLowerCase();
                  return term===""||
                    o.customer.toLowerCase().includes(term)||
                    o.service.toLowerCase().includes(term)||
                    o.id.toLowerCase().includes(term);
                });

                return(
                  <div>
                    {/* Søk */}
                    <div style={{marginBottom:10}}>
                      <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:6}}>
                        2. Søk på bruker eller tjeneste
                      </label>
                      <input value={sokTekst} onChange={e=>setSokTekst(e.target.value)}
                        style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:9,fontSize:12,fontFamily:"inherit",background:C.greenXL}}
                        placeholder="Navn på bruker, tjeneste eller oppdrag-ID..."/>
                    </div>

                    {/* Bruker-hurtigfilter */}
                    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
                      <button onClick={()=>setSokTekst("")}
                        style={{fontSize:10,padding:"3px 10px",borderRadius:50,border:`1px solid ${sokTekst===""?C.green:C.border}`,background:sokTekst===""?C.greenBg:"white",color:sokTekst===""?C.green:C.soft,cursor:"pointer",fontFamily:"inherit",fontWeight:sokTekst===""?600:400}}>
                        Alle ({orgOrders.length})
                      </button>
                      {brukere.map(b=>(
                        <button key={b.navn} onClick={()=>setSokTekst(b.navn)}
                          style={{fontSize:10,padding:"3px 10px",borderRadius:50,border:`1px solid ${sokTekst===b.navn?"#2C5C52":C.border}`,background:sokTekst===b.navn?"#EDF5F3":"white",color:sokTekst===b.navn?"#2C5C52":C.soft,cursor:"pointer",fontFamily:"inherit",fontWeight:sokTekst===b.navn?600:400}}>
                          👤 {b.navn} ({orgOrders.filter(o=>o.customer===b.navn).length})
                        </button>
                      ))}
                    </div>

                    {/* Oppdragsliste */}
                    <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:6}}>
                      3. Velg oppdrag å kreditere
                      {valgteOppdrag.length>0&&(
                        <span style={{background:C.greenBg,color:C.green,padding:"1px 9px",borderRadius:50,marginLeft:8,fontSize:10,fontWeight:600}}>
                          {valgteOppdrag.length} valgt · {valgteOppdrag.reduce((s,o)=>s+(o.amount||0),0).toLocaleString("nb-NO")} kr
                        </span>
                      )}
                    </div>
                    <div style={{maxHeight:240,overflowY:"auto",display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
                      {filteredOrders.length===0
                        ?<div style={{fontSize:11,color:C.soft,textAlign:"center",padding:20,background:C.softBg,borderRadius:9}}>
                            Ingen oppdrag funnet — prøv et annet søk
                          </div>
                        :filteredOrders.map(o=>{
                          const valgt=!!valgteOppdrag.find(v=>v.id===o.id);
                          return(
                            <div key={o.id} onClick={()=>toggleOppdrag(o)}
                              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:9,
                                border:`2px solid ${valgt?"#2C5C52":C.border}`,
                                background:valgt?"#EDF5F3":"white",cursor:"pointer",transition:"all .15s"}}>
                              {/* Checkbox */}
                              <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${valgt?"#2C5C52":C.border}`,background:valgt?"#2C5C52":"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"white",flexShrink:0,fontWeight:700}}>
                                {valgt?"✓":""}
                              </div>
                              {/* Bruker-avatar */}
                              <div style={{width:30,height:30,borderRadius:"50%",background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.green,flexShrink:0}}>
                                {o.customer.split(" ").map(n=>n[0]).join("").slice(0,2)}
                              </div>
                              {/* Info */}
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:1}}>
                                  <span style={{fontSize:12,fontWeight:700,color:C.navy}}>{o.customer}</span>
                                  <span style={{fontSize:9,background:"#EEF2FF",color:"#3B82F6",padding:"1px 6px",borderRadius:50}}>{o.b2bOrg?.split(" ")[0]}</span>
                                </div>
                                <div style={{display:"flex",alignItems:"center",gap:6}}>
                                  <span style={{fontSize:10,color:C.green,fontWeight:500}}>{o.service}</span>
                                  <span style={{fontSize:9,color:C.soft}}>·</span>
                                  <span style={{fontSize:10,color:C.soft}}>{o.date} {o.time}</span>
                                  <span style={{fontSize:9,color:C.soft}}>·</span>
                                  <span style={{fontSize:9,color:C.soft,fontFamily:"monospace"}}>{o.id}</span>
                                </div>
                              </div>
                              <div style={{textAlign:"right",flexShrink:0}}>
                                <div style={{fontSize:12,fontWeight:700,color:C.navy}}>{o.amount} kr</div>
                                <div style={{fontSize:9,background:o.status==="completed"?"#F0FDF4":C.goldBg,color:o.status==="completed"?"#16A34A":C.goldDark,padding:"1px 6px",borderRadius:50,fontWeight:500}}>
                                  {o.status==="completed"?"✓ Fullført":o.status==="active"?"Aktiv":"Kommende"}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                );
              })()}

              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Årsak til kreditnota</label>
                <textarea value={arsak} onChange={e=>setArsak(e.target.value)} rows={2}
                  style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL,resize:"vertical"}}
                  placeholder="F.eks. Morgensstell ikke gjennomført 3. mars — sykepleier syk..."/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setModus(null)} style={{padding:"10px 16px",fontSize:12,borderRadius:10,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>← Tilbake</button>
                <button onClick={()=>kunde&&setSteg(2)} className="btn bp"
                  style={{flex:1,padding:"10px 0",fontSize:13,borderRadius:10,background:"#2C5C52",opacity:kunde?1:.5}}>
                  {valgteOppdrag.length>0?`Neste — ${valgteOppdrag.length} oppdrag valgt →`:"Neste — rediger linjer →"}
                </button>
              </div>
            </div>
          )}

          {/* ── FRI steg 1: Velg mottaker ── */}
          {modus==="fri"&&steg===1&&(
            <div>
              <div style={{background:"#F5F3FF",borderRadius:9,padding:"9px 13px",fontSize:10,color:"#5B21B6",marginBottom:16,lineHeight:1.55,border:"1px solid #C4B5FD"}}>
                ✏️ <strong>Fri kreditnota</strong> — ingen oppdrag-ID kreves. Bruk for perioderabatter, kompensasjon eller avtalte justeringer.
              </div>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:8}}>Velg B2B-mottaker</label>
                {b2bKunder.map(k=>(
                  <div key={k} onClick={()=>setKunde(k)}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:10,border:`2px solid ${kunde===k?"#6D28D9":C.border}`,background:kunde===k?"#F5F3FF":"white",cursor:"pointer",marginBottom:7}}>
                    <div style={{width:36,height:36,borderRadius:9,background:"#EDE9FE",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏢</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600,color:C.navy}}>{k}</div>
                      <div style={{fontSize:10,color:C.soft}}>{B2B_C.find(c=>c.name===k)?.type}</div>
                    </div>
                    {kunde===k&&<div style={{width:20,height:20,borderRadius:"50%",background:"#6D28D9",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:11}}>✓</div>}
                  </div>
                ))}
              </div>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Årsak til kreditnota</label>
                <textarea value={arsak} onChange={e=>setArsak(e.target.value)} rows={2} style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL,resize:"vertical"}} placeholder="F.eks. Goodwill-kompensasjon mars 2026..."/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setModus(null)} style={{padding:"10px 16px",fontSize:12,borderRadius:10,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>← Tilbake</button>
                <button onClick={()=>kunde&&setSteg(2)} className="btn bp" style={{flex:1,padding:"10px 0",fontSize:13,borderRadius:10,background:"#2C5C52",opacity:kunde?1:.5}}>Neste →</button>
              </div>
            </div>
          )}

          {/* ── Steg 2: Kreditlinjer (felles) ── */}
          {steg===2&&(
            <div>
              {/* Infobanner */}
              {modus==="knyttet"&&valgteOppdrag.length>0&&(
                <div style={{background:"#EDF5F3",borderRadius:9,padding:"9px 13px",fontSize:10,color:"#2C5C52",marginBottom:14,lineHeight:1.55,border:"1px solid rgba(44,92,82,.2)"}}>
                  🔗 <strong>Knyttet til {valgteOppdrag.length} oppdrag</strong> ({valgteOppdrag.map(o=>"#"+o.id).join(", ")}) — linjer er forhåndsutfylt. Juster beløp ved behov.
                </div>
              )}
              {modus==="fri"&&(
                <div style={{background:"#F5F3FF",borderRadius:9,padding:"9px 13px",fontSize:10,color:"#5B21B6",marginBottom:14,border:"1px solid #C4B5FD"}}>
                  ✏️ <strong>Fri kreditnota til {kunde}</strong> — legg til linjer manuelt.
                </div>
              )}
              {/* Linjer */}
              <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:8}}>Kreditlinjer</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 52px 88px 28px",gap:"4px 8px",marginBottom:4}}>
                {["Beskrivelse","Ant.","Pris kr",""].map(h=><div key={h} style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.4,padding:"0 2px"}}>{h}</div>)}
              </div>
              {linjer.map((l,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 52px 88px 28px",gap:"4px 8px",marginBottom:6,alignItems:"center"}}>
                  <input value={l.beskrivelse} onChange={e=>updateLinje(i,"beskrivelse",e.target.value)}
                    style={{padding:"8px 10px",border:`1.5px solid ${C.border}`,borderRadius:7,fontSize:11,fontFamily:"inherit",background:C.greenXL}} placeholder="Tjeneste eller beskrivelse"/>
                  <input value={l.antall} onChange={e=>updateLinje(i,"antall",e.target.value)} type="number"
                    style={{padding:"8px 6px",border:`1.5px solid ${C.border}`,borderRadius:7,fontSize:11,fontFamily:"inherit",background:C.greenXL,textAlign:"center"}}/>
                  <input value={l.pris} onChange={e=>updateLinje(i,"pris",e.target.value)} type="number"
                    style={{padding:"8px 8px",border:`1.5px solid ${C.border}`,borderRadius:7,fontSize:11,fontFamily:"inherit",background:C.greenXL,textAlign:"right"}}/>
                  <button onClick={()=>linjer.length>1&&setLinjer(p=>p.filter((_,j)=>j!==i))}
                    style={{background:linjer.length>1?C.dangerBg:"#F3F4F6",color:linjer.length>1?C.danger:C.soft,border:"none",borderRadius:6,cursor:linjer.length>1?"pointer":"default",fontSize:13,fontWeight:700,height:32,width:28}}>×</button>
                </div>
              ))}
              <button onClick={addLinje} style={{fontSize:11,padding:"6px 14px",background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,borderRadius:7,cursor:"pointer",fontFamily:"inherit",marginBottom:14}}>+ Legg til linje</button>
              {/* Sum */}
              <div style={{background:C.greenXL,borderRadius:9,padding:"11px 14px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center",border:`1px solid ${C.border}`}}>
                <span style={{fontSize:12,fontWeight:600,color:C.navy}}>Total kreditnota</span>
                <span style={{fontSize:17,fontWeight:700,color:"#2C5C52"}}>{total.toLocaleString("nb-NO")} kr</span>
              </div>
              {/* Leveringsformat */}
              <div style={{marginBottom:16}}>
                <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:8}}>Leveringsformat</label>
                <div style={{display:"flex",gap:8}}>
                  {[{key:"ehf",label:"📡 EHF/PEPPOL",sub:"Automatisk til kommuner"},{key:"pdf",label:"📄 PDF e-post",sub:"Sendes manuelt"}].map(m=>(
                    <div key={m.key} onClick={()=>setLevering(m.key)} style={{flex:1,padding:"9px 12px",borderRadius:9,border:`2px solid ${levering===m.key?"#2C5C52":C.border}`,background:levering===m.key?"#EDF5F3":"white",cursor:"pointer",textAlign:"center"}}>
                      <div style={{fontSize:12,fontWeight:600,color:levering===m.key?"#2C5C52":C.navy,marginBottom:1}}>{m.label}</div>
                      <div style={{fontSize:9,color:C.soft}}>{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setSteg(1)} style={{padding:"10px 16px",fontSize:12,borderRadius:10,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>← Tilbake</button>
                <button onClick={()=>total>0&&setSteg(3)} className="btn bp" style={{flex:1,padding:"10px 0",fontSize:13,borderRadius:10,background:"#2C5C52",opacity:total>0?1:.5}}>Forhåndsvisning →</button>
              </div>
            </div>
          )}

          {/* ── Steg 3: Forhåndsvisning + Send ── */}
          {steg===3&&(
            <div>
              <div style={{border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:16}}>
                <div style={{background:"#1A2E24",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:"white"}}>EiraNova AS</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,.5)"}}>Org.nr: 923 456 789 · eiranova.no</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#E8C4A4"}}>KREDITNOTA</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,.5)"}}>KN-2026-{String(KREDITERINGER.length+1).padStart(3,"0")}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,.4)"}}>{new Date().toLocaleDateString("nb-NO")}</div>
                  </div>
                </div>
                <div style={{padding:"14px 18px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
                    <div>
                      <div style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.4,marginBottom:2}}>Til</div>
                      <div style={{fontSize:12,fontWeight:600,color:C.navy}}>{kunde}</div>
                      <div style={{fontSize:10,color:C.soft}}>{selectedOrg?.type}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.4,marginBottom:2}}>Type</div>
                      <span style={{fontSize:10,background:modus==="knyttet"?C.greenBg:"#F5F3FF",color:modus==="knyttet"?C.green:"#6D28D9",padding:"2px 9px",borderRadius:50,fontWeight:600}}>
                        {modus==="knyttet"?"🔗 Knyttet til oppdrag":"✏️ Fri kreditnota"}
                      </span>
                    </div>
                  </div>
                  {arsak&&<div style={{fontSize:10,color:C.soft,marginBottom:10,fontStyle:"italic"}}>"{arsak}"</div>}
                  {modus==="knyttet"&&valgteOppdrag.length>0&&(
                    <div style={{fontSize:10,color:C.soft,marginBottom:10}}>
                      Ref. oppdrag: {valgteOppdrag.map(o=>`#${o.id}`).join(", ")}
                    </div>
                  )}
                  <div className="tw" style={{marginBottom:10}}>
                  <table className="tbl">
                    <thead><tr>
                      {["Beskrivelse","Ant.","Pris","Sum"].map(h=><th key={h} style={{textAlign:h==="Ant."||h==="Pris"||h==="Sum"?"right":"left"}}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {linjer.filter(l=>l.beskrivelse).map((l,i)=>(
                        <tr key={i}>
                          <td>{l.beskrivelse}</td>
                          <td style={{textAlign:"right"}}>{l.antall}</td>
                          <td style={{textAlign:"right"}}>{Number(l.pris).toLocaleString("nb-NO")} kr</td>
                          <td style={{textAlign:"right",fontWeight:600}}>{(Number(l.antall)*Number(l.pris)).toLocaleString("nb-NO")} kr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:`2px solid ${C.navy}`}}>
                    <span style={{fontSize:12,fontWeight:700,color:C.navy}}>Total kreditbeløp</span>
                    <span style={{fontSize:14,fontWeight:700,color:"#2C5C52"}}>{total.toLocaleString("nb-NO")} kr</span>
                  </div>
                  <div style={{fontSize:9,color:C.soft,marginTop:6}}>MVA: 0% (helsetjenester unntatt jf. mval. §3-2) · Trekkes fra neste faktura eller utbetales etter avtale.</div>
                </div>
              </div>
              <div style={{background:C.greenXL,borderRadius:9,padding:"9px 13px",fontSize:10,color:C.navyMid,marginBottom:16,lineHeight:1.55}}>
                📡 Sendes som <strong>{levering==="ehf"?"EHF/PEPPOL til kommunens fakturasystem":"PDF til kontakt-e-post"}</strong>. Registreres i Tripletex og aktivitetslogg.
                {modus==="knyttet"&&valgteOppdrag.length>0&&` Oppdrag ${valgteOppdrag.map(o=>"#"+o.id).join(", ")} merkes som kreditert.`}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setSteg(2)} style={{padding:"10px 16px",fontSize:12,borderRadius:10,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>← Tilbake</button>
                <button onClick={()=>{onSave({kunde,linjer,total,arsak,levering,modus,oppdragIds:valgteOppdrag.map(o=>o.id)});onClose();}}
                  style={{flex:1,padding:"10px 0",fontSize:13,borderRadius:10,background:"#2C5C52",color:"white",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
                  📤 Send kreditnota — {total.toLocaleString("nb-NO")} kr
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}


function ABetalinger(){
  const{toast,ToastContainer}=useToast();
  const[tab,setTab]=useState("oversikt");
  const[showKrediterPrivat,setShowKrediterPrivat]=useState(false);
  const[showKreditnotaB2B,setShowKreditnotaB2B]=useState(false);
  const tv=VIPPS_P.reduce((s,p)=>s+p.amount,0);
  const ts=STRIPE_P.reduce((s,p)=>s+p.amount,0);
  return(
    <div className="fu">
      <ToastContainer/>
      {showKrediterPrivat&&<KrediterPrivatModal onClose={()=>setShowKrediterPrivat(false)} onSave={(data)=>console.log("Kreditert:",data)}/>}
      {showKreditnotaB2B&&<KreditnotaB2BModal onClose={()=>setShowKreditnotaB2B(false)} onSave={(data)=>console.log("Kreditnota:",data)}/>}
      <div className="g4" style={{marginBottom:16}}>
        {[{label:"Vipps (mtd)",value:`${(tv/1000).toFixed(1)}k kr`,icon:"💜",sub:"D+1 til DNB"},{label:"Stripe (mtd)",value:`${(ts/1000).toFixed(1)}k kr`,icon:"💳",sub:"T+2 til DNB"},{label:"B2B utestående",value:"33 240 kr",icon:"📄",sub:"2 forfalt"},{label:"Siste hendelse",value:"OK",icon:"🔔",sub:"10:31 i dag"}].map(k=>(
          <div key={k.label} className="card cp">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}><span style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.5,lineHeight:1.3}}>{k.label}</span><span style={{fontSize:17}}>{k.icon}</span></div>
            <div className="fr" style={{fontSize:20,fontWeight:600,color:C.navy,marginBottom:2}}>{k.value}</div>
            <div style={{fontSize:9,color:C.soft}}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",background:"white",borderRadius:10,padding:3,marginBottom:14,border:`1px solid ${C.border}`,width:"fit-content"}}>
        {["oversikt","vipps","stripe","krediteringer","aktivitet"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 14px",borderRadius:8,fontSize:11,fontWeight:tab===t?600:400,cursor:"pointer",border:"none",background:tab===t?C.greenBg:"transparent",color:tab===t?C.green:C.soft,fontFamily:"inherit"}}>
            {t==="vipps"?"💜 Vipps":t==="stripe"?"💳 Stripe":t==="aktivitet"?"📋 Aktivitetslogg":t==="krediteringer"?"↩️ Krediteringer":"📊 Oversikt"}
          </button>
        ))}
      </div>
      {tab==="oversikt"&&(
        <div className="g2 g2m1">
          <div className="card cp">
            <div className="fr" style={{fontSize:14,fontWeight:600,color:C.navy,marginBottom:12}}>Betalingsflyt</div>
            {[{from:"Vipps MobilePay",to:"DNB konto",timing:"D+1 virkedag",icon:"💜"},{from:"Stripe (Visa/MC)",to:"DNB konto",timing:"T+2 virkedager",icon:"💳"},{from:"EHF/KID-betaling",to:"Tripletex → DNB",timing:"14–30 dager netto",icon:"📄"}].map(f=>(
              <div key={f.from} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:32,height:32,borderRadius:8,background:f.icon==="💜"?"#FFF0EB":f.icon==="💳"?C.skyBg:C.goldBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{f.icon}</div>
                <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:C.navy}}>{f.from}</div><div style={{fontSize:10,color:C.soft}}>→ {f.to} · {f.timing}</div></div>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#16A34A"}}/>
              </div>
            ))}
            <div style={{marginTop:10,background:C.greenBg,borderRadius:8,padding:"8px 10px",fontSize:10,color:C.greenDark}}>🏦 Alle midler eies av EiraNova AS fra betaling. Ingen mellomkonto.</div>
          </div>
          <div className="card">
            <div style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}`,fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:600,color:C.navy}}>Aktivitetslogg</div>
            {WH.map((w,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderBottom:i<WH.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:w.status==="ok"?"#16A34A":C.danger,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:10,fontWeight:600,color:C.navy,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{w.event}</div><div style={{fontSize:9,color:C.soft}}>{w.ref} · {w.time}</div></div>
                <span style={{fontSize:9,padding:"2px 7px",borderRadius:50,background:w.method==="vipps"?"#FFF0EB":C.skyBg,color:w.method==="vipps"?C.vipps:C.sky,fontWeight:600}}>{w.method}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="vipps"&&(
        <div>
          <div style={{background:"#FFF5F1",border:"1px solid rgba(255,91,36,.2)",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:11,color:"#7A3020",lineHeight:1.5}}>💜 <strong>Vipps MobilePay ePayment API</strong> — Daglig oppgjør D+1 til EiraNova DNB-konto. Konfigurasjon i Vipps Merchant Portal.</div>
          <div className="card tw"><table className="tbl">
            <thead><tr><th>Referanse</th><th>Dato</th><th>Beløp</th><th>Ordre</th><th>Status</th></tr></thead>
            <tbody>{VIPPS_P.map(p=><tr key={p.id}><td style={{fontFamily:"monospace",fontSize:10,color:C.soft}}>{p.id}</td><td>{p.date}</td><td style={{fontWeight:600}}>{p.amount.toLocaleString("nb-NO")} kr</td><td>{p.orders} oppdrag</td><td><Bdg status={p.status}/></td></tr>)}</tbody>
          </table></div>
        </div>
      )}
      {tab==="stripe"&&(
        <div>
          <div style={{background:C.skyBg,border:`1px solid rgba(37,99,235,.15)`,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:11,color:"#1e40af",lineHeight:1.5}}>💳 <strong>Stripe Automatic Payouts</strong> — T+2 til EiraNova DNB. <code>setup_future_usage:'off_session'</code> lagrer kort for gjentakende betaling.</div>
          <div className="card tw"><table className="tbl">
            <thead><tr><th>Payout ID</th><th>Initiert</th><th>Beløp</th><th>Ankommer</th><th>Status</th></tr></thead>
            <tbody>{STRIPE_P.map(p=><tr key={p.id}><td style={{fontFamily:"monospace",fontSize:10,color:C.soft}}>{p.id}</td><td>{p.date}</td><td style={{fontWeight:600}}>{p.amount.toLocaleString("nb-NO")} kr</td><td style={{color:C.soft}}>{p.arrival}</td><td><Bdg status={p.status}/></td></tr>)}</tbody>
          </table></div>
        </div>
      )}
      {tab==="krediteringer"&&(
        <div>
          {/* Info-banner */}
          <div style={{background:"#F5F3FF",border:"1px solid #C4B5FD",borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:11,color:"#5B21B6",lineHeight:1.55}}>
            <strong>Best practice:</strong> Privatkunder (Vipps/kort) → direkte refusjon via betalings-API. B2B → kreditnota sendes via EHF/PDF og trekkes fra neste faktura eller utbetales. Alle krediteringer krever årsak og godkjenning.
          </div>

          {/* KPI-strip */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:16}}>
            {[
              {label:"Totalt kreditert (mtd)",value:`${KREDITERINGER.reduce((s,k)=>s+k.belop,0).toLocaleString("nb-NO")} kr`,icon:"↩️",color:C.soft},
              {label:"B2C refusjoner",value:`${KREDITERINGER.filter(k=>k.type==="b2c").length} stk`,icon:"💳",color:C.sky},
              {label:"B2B kreditnotaer",value:`${KREDITERINGER.filter(k=>k.type==="b2b").length} stk`,icon:"📄",color:C.gold},
            ].map(k=>(
              <div key={k.label} className="card cp">
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.5}}>{k.label}</span><span>{k.icon}</span></div>
                <div className="fr" style={{fontSize:18,fontWeight:700,color:C.navy}}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Ny kreditering-knapper */}
          <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
            <button onClick={()=>setShowKrediterPrivat(true)} className="btn bp" style={{fontSize:12,padding:"8px 18px",borderRadius:9}}>+ Krediter privatkunde (Vipps/kort)</button>
            <button onClick={()=>setShowKreditnotaB2B(true)} style={{fontSize:12,padding:"8px 18px",borderRadius:9,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>+ Utstedd B2B kreditnota</button>
          </div>

          {/* Tabell */}
          <div className="card tw">
            <table className="tbl">
              <thead><tr>
                <th>ID</th><th>Kunde</th><th>Oppdrag</th><th>Beløp</th><th>Årsak</th><th>Metode</th><th>Godkjent av</th><th>Status</th><th></th>
              </tr></thead>
              <tbody>
                {KREDITERINGER.map(k=>(
                  <tr key={k.id}>
                    <td style={{fontFamily:"monospace",fontSize:10,color:C.soft}}>{k.id}</td>
                    <td style={{fontWeight:600}}>{k.kunde}</td>
                    <td style={{fontSize:11,color:C.soft}}>{k.oppdrag}</td>
                    <td style={{fontWeight:700,color:C.navy}}>{k.belop.toLocaleString("nb-NO")} kr</td>
                    <td style={{fontSize:10,color:C.soft,maxWidth:180}}>{k.arsak}</td>
                    <td>
                      <span style={{fontSize:10,padding:"2px 8px",borderRadius:50,fontWeight:600,
                        background:k.method==="vipps"?"#FFF0EB":k.method==="stripe"?C.skyBg:"#FFF3E0",
                        color:k.method==="vipps"?C.vipps:k.method==="stripe"?C.sky:"#E65100"}}>
                        {k.method==="vipps"?"💜 Vipps":k.method==="stripe"?"💳 Stripe":"📄 Kreditnota"}
                      </span>
                    </td>
                    <td style={{fontSize:11}}>{k.godkjentAv}</td>
                    <td>
                      <span style={{fontSize:10,padding:"2px 8px",borderRadius:50,fontWeight:600,
                        background:k.status==="refundert"?"#F0FDF4":"#FFF3E0",
                        color:k.status==="refundert"?"#16A34A":"#E65100"}}>
                        {k.status==="refundert"?"✓ Refundert":"📤 Sendt"}
                      </span>
                    </td>
                    <td>
                      <button style={{fontSize:10,padding:"3px 10px",background:C.softBg,color:C.navyMid,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit"}}>
                        {k.kreditnotaNr?"Last ned PDF":"Kvittering"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Regelforklaring */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12,marginTop:16}}>
            <div style={{background:"#EFF6FF",borderRadius:10,padding:"12px 14px",border:"1px solid rgba(37,99,235,.15)"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#1e40af",marginBottom:6}}>💳 B2C — Direkte refusjon</div>
              <div style={{fontSize:11,color:"#1e40af",lineHeight:1.6}}>
                Vipps: Refunderes via <code>ePayments API</code> — tilbake på kundens Vipps innen 1-3 dager.<br/>
                Stripe: Refunderes via <code>refunds.create</code> — tilbake på kort innen 5-10 virkedager.<br/>
                <strong>Ingen faktura utstedes</strong> — kreditering registreres i aktivitetslogg.
              </div>
            </div>
            <div style={{background:"#FFF7ED",borderRadius:10,padding:"12px 14px",border:"1px solid #FDE68A"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#92400E",marginBottom:6}}>📄 B2B — Kreditnota</div>
              <div style={{fontSize:11,color:"#92400E",lineHeight:1.6}}>
                Kreditnota sendes via <strong>EHF/PEPPOL</strong> til kommuner, PDF til andre.<br/>
                Trekkes automatisk fra neste faktura, eller utbetales direkte ved avtale.<br/>
                <strong>Kreditnota nr. følger faktura-serien</strong> (KN-2026-XXX).
              </div>
            </div>
          </div>
        </div>
      )}
      {tab==="aktivitet"&&(
        <div className="card">
          <div style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:600,color:C.navy}}>Aktivitetslogg</span>
            <div style={{display:"flex",gap:4}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:50,background:"#F0FDF4",color:"#16A34A",fontWeight:600}}>3 OK</span><span style={{fontSize:9,padding:"2px 8px",borderRadius:50,background:C.dangerBg,color:C.danger,fontWeight:600}}>1 Feil</span></div>
          </div>
          {WH.map((w,i)=>(
            <div key={i} style={{padding:"11px 14px",borderBottom:i<WH.length-1?`1px solid ${C.border}`:"none",background:w.status==="error"?"#FFFBFB":"white"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:w.status==="ok"?"#16A34A":C.danger,flexShrink:0}}/>
                <span style={{fontSize:11,fontWeight:600,color:C.navy,fontFamily:"monospace"}}>{w.event}</span>
                <span style={{marginLeft:"auto",fontSize:9,color:C.soft}}>{w.time}</span>
              </div>
              <div style={{fontSize:10,color:C.soft,marginLeft:16}}>{w.ref} · {w.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const INIT_AVTALEMODELLER=[
  {id:"rammeavtale",   label:"Rammeavtale",      ikon:"📋",farge:C.sky,      beskrivelse:"Fast pris per tjenestetype. Faktura samles og sendes månedlig.",
   felt:[{key:"rammePriser",label:"Priser per tjenestetype",type:"tjenestePriser"}],
   fakturaType:"maanedlig",fakturadag:1,betalingsfrist:30,aktiv:true,systemModell:true},
  {id:"per_bestilling",label:"Per bestilling",   ikon:"🛒",farge:C.soft,     beskrivelse:"Listepris per bestilling. Faktura genereres automatisk ved hver bestilling.",
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


function AB2B({setDrawer,onOpprettKoordinator=()=>{}}){
  const{toast,ToastContainer}=useToast();
  const[expanded,setExpanded]=useState(null);
  const[activeTab,setActiveTab]=useState("kunder"); // kunder | fakturaer | avtalemodeller
  const[avtalemodeller,setAvtalemodeller]=useState(INIT_AVTALEMODELLER);
  const[avtaleModal,setAvtaleModal]=useState(null); // null | "ny" | modell-obj
  const[avtaleForm,setAvtaleForm]=useState({id:"",label:"",ikon:"📄",farge:C.green,beskrivelse:"",fakturaType:"maanedlig",fakturadag:1,betalingsfrist:14,felt:[],aktiv:true,systemModell:false});

  const prisLabel=(p)=>{const m=avtalemodeller.find(a=>a.id===p);return m?`${m.ikon} ${m.label}`:p;};
  const prisColor=(p)=>{const m=avtalemodeller.find(a=>a.id===p);return m?{bg:`${m.farge}18`,c:m.farge}:{bg:C.softBg,c:C.soft};};
  const tjenesteNavn=(t)=>({morgensstell:"Morgensstell",praktisk:"Praktisk bistand",ringetilsyn:"Ringetilsyn",besok:"Besøksvenn",transport:"Transport",avlastning:"Avlastning"})[t]??t;

  const kopierTelefon=(raw)=>{
    const num=String(raw||"").replace(/\s/g,"");
    const done=()=>toast("Telefonnummer kopiert","ok");
    if(typeof navigator!=="undefined"&&navigator.clipboard?.writeText){
      navigator.clipboard.writeText(num).then(done).catch(()=>toast("Kunne ikke kopiere — marker nummeret manuelt","warn"));
    }else done();
  };

  return(
    <div className="fu">
      <ToastContainer/>
      <div className="card" style={{marginBottom:16,padding:"14px 16px",border:`1px solid ${C.border}`,background:"linear-gradient(135deg,#F3FAF7,#E8F5F0)"}}>
        <div className="fr" style={{fontSize:13,fontWeight:600,color:C.navy,marginBottom:4}}>Nye henvendelser</div>
        <div style={{fontSize:10,color:C.soft,marginBottom:12,lineHeight:1.5}}>Fra kontaktskjemaet på kunde-landing (mock). Lise varsles på e-post når dette er koblet til Resend.</div>
        {MOCK_B2B_HENVENDELSER.map(h=>(
          <div key={h.id} style={{background:"white",borderRadius:10,padding:"12px 13px",marginBottom:10,border:`0.5px solid ${C.border}`}}>
            <div style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:6}}>{h.navn} · {h.organisasjon}</div>
            <div style={{fontSize:10,color:C.soft,lineHeight:1.55,marginBottom:4}}>
              <span style={{color:C.navyMid}}>{h.epost}</span>
              {" · "}
              <span style={{fontWeight:500,color:C.navy}}>{h.telefon}</span>
              {" · "}
              <span>ca. {h.antallBrukere} brukere</span>
            </div>
            <div style={{fontSize:9,color:C.soft,marginBottom:10}}>Mottatt {h.tidspunkt}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <button type="button" onClick={()=>kopierTelefon(h.telefon)} className="btn bp" style={{fontSize:10,padding:"6px 12px",borderRadius:8}}>Ring nå</button>
              <button type="button" onClick={()=>onOpprettKoordinator(h.epost)} className="btn" style={{fontSize:10,padding:"6px 12px",borderRadius:8,background:"white",color:C.navy,border:`1px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Opprett koordinator</button>
            </div>
          </div>
        ))}
      </div>

      {/* KPI strip */}
      <div className="g3" style={{marginBottom:16}}>
        {[["3","B2B-kunder"],["33 240 kr","Utestående"],["6","Tilknyttede brukere"]].map(([v,l])=>(
          <div key={l} className="card cp" style={{textAlign:"center"}}>
            <div className="fr" style={{fontSize:20,fontWeight:600,color:C.navy}}>{v}</div>
            <div style={{fontSize:9,color:C.soft}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Tab toggle */}
      <div style={{display:"flex",background:"white",borderRadius:10,padding:3,marginBottom:14,border:`1px solid ${C.border}`,width:"fit-content"}}>
        {[["kunder","👥 Kunder & brukere"],["fakturaer","🧾 Fakturaer"],["avtalemodeller","📋 Avtalemodeller"]].map(([t,l])=>(
          <button key={t} onClick={()=>setActiveTab(t)} style={{padding:"6px 14px",borderRadius:8,fontSize:11,fontWeight:activeTab===t?600:400,cursor:"pointer",border:"none",background:activeTab===t?C.greenBg:"transparent",color:activeTab===t?C.green:C.soft,fontFamily:"inherit"}}>{l}</button>
        ))}
      </div>

      {activeTab==="kunder"&&(
        <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
            <div className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>B2B-kunder</div>
            <button onClick={()=>setDrawer("b2b")} className="btn bp" style={{fontSize:11,padding:"7px 14px"}}>+ Legg til kunde</button>
          </div>

          {B2B_C.map((c,i)=>{
            const isOpen=expanded===c.id;
            const pc=prisColor(c.prismodell);
            return(
              <div key={c.id} className="card" style={{marginBottom:10}}>
                {/* Customer header — always visible */}
                <div onClick={()=>setExpanded(isOpen?null:c.id)} style={{padding:"13px 14px",cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:160}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                        <span style={{fontSize:13,fontWeight:600,color:C.navy}}>{c.name}</span>
                        <span style={{fontSize:9,background:C.softBg,borderRadius:50,padding:"1px 7px",color:C.soft}}>{c.type}</span>
                        {c.peppol&&<span style={{fontSize:9,background:C.greenBg,borderRadius:50,padding:"1px 7px",color:C.green}}>EHF/PEPPOL</span>}
                      </div>
                      {/* Prismodell badge */}
                      <span style={{fontSize:10,background:pc.bg,color:pc.c,borderRadius:50,padding:"2px 9px",fontWeight:600}}>{prisLabel(c.prismodell)}</span>
                      <div style={{fontSize:10,color:C.soft,marginTop:4}}>Org: {c.org} · {c.payDays} dager · {c.brukere.filter(b=>b.aktiv).length} aktive brukere</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:c.outstanding>0?C.danger:C.green,marginBottom:3}}>{c.outstanding>0?`${c.outstanding.toLocaleString("nb-NO")} kr utestående`:"✓ Ingen utestående"}</div>
                      <div style={{fontSize:9,color:C.soft}}>{c.contact}</div>
                      <div style={{fontSize:11,color:C.soft,marginTop:4}}>{isOpen?"▲ Skjul":"▼ Vis detaljer"}</div>
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen&&(
                  <div style={{borderTop:`1px solid ${C.border}`}}>

                    {/* Prismodell detail */}
                    <div style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}`,background:C.greenXL}}>
                      <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:8}}>Prismodell</div>

                      {c.prismodell==="rammeavtale"&&(
                        <div>
                          <div style={{fontSize:10,color:C.soft,marginBottom:8}}>Fast pris per tjenestetype — faktureres samlet hver måned</div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                            {Object.entries(c.rammePriser).map(([type,pris])=>(
                              <div key={type} style={{background:"white",borderRadius:7,padding:"6px 9px",display:"flex",justifyContent:"space-between",alignItems:"center",border:`0.5px solid ${C.border}`}}>
                                <span style={{fontSize:10,color:C.navy}}>{tjenesteNavn(type)}</span>
                                <span style={{fontSize:10,fontWeight:600,color:C.sky}}>{pris} kr</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {c.prismodell==="per_bestilling"&&(
                        <div style={{background:"white",borderRadius:8,padding:"9px 11px",border:`0.5px solid ${C.border}`}}>
                          <div style={{fontSize:11,color:C.navy,marginBottom:3}}>Standard tjenestepris per oppdrag</div>
                          <div style={{fontSize:10,color:C.soft}}>Faktura sendes per bestilling · {c.payDays} dagers betalingsfrist · PDF e-post</div>
                        </div>
                      )}

                      {c.prismodell==="maanedspakke"&&(
                        <div>
                          <div style={{background:"white",borderRadius:8,padding:"9px 11px",border:`0.5px solid ${C.border}`,marginBottom:8}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                              <span style={{fontSize:11,fontWeight:600,color:C.navy}}>{c.maanedsPris.toLocaleString("nb-NO")} kr / mnd</span>
                              <span style={{fontSize:10,color:"#6D28D9",fontWeight:600}}>{c.timerInkludert} timer inkludert</span>
                            </div>
                            {/* Progress bar */}
                            <div style={{fontSize:9,color:C.soft,marginBottom:4}}>Brukt denne måneden: {c.timerBrukt}/{c.timerInkludert} timer</div>
                            <div style={{height:6,borderRadius:50,background:C.border,overflow:"hidden"}}>
                              <div style={{height:"100%",borderRadius:50,background:c.timerBrukt/c.timerInkludert>0.9?C.danger:"#6D28D9",width:`${(c.timerBrukt/c.timerInkludert)*100}%`}}/>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Brukere */}
                    <div style={{padding:"12px 14px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                        <div style={{fontSize:10,fontWeight:600,color:C.navy}}>Tilknyttede brukere ({c.brukere.length})</div>
                        <button style={{fontSize:9,padding:"3px 10px",background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,borderRadius:50,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>+ Legg til bruker</button>
                      </div>
                      {c.brukere.map((b,bi)=>(
                        <div key={b.id} style={{display:"flex",alignItems:"flex-start",gap:9,padding:"8px 10px",background:b.aktiv?"white":C.softBg,borderRadius:9,marginBottom:5,border:`0.5px solid ${C.border}`,opacity:b.aktiv?1:.65}}>
                          <div style={{width:30,height:30,borderRadius:"50%",background:b.aktiv?C.greenDark:C.soft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white",flexShrink:0}}>
                            {b.name.split(" ").map(p=>p[0]).join("").slice(0,2)}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                              <span style={{fontSize:11,fontWeight:600,color:C.navy}}>{b.name}</span>
                              <span style={{fontSize:9,padding:"1px 6px",borderRadius:50,background:b.aktiv?C.greenBg:C.softBg,color:b.aktiv?C.green:C.soft}}>{b.aktiv?"Aktiv":"Inaktiv"}</span>
                            </div>
                            <div style={{fontSize:9,color:C.soft,marginBottom:4}}>{b.adresse} · f. {b.dob}</div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                              {b.tjenester.map(t=>(
                                <span key={t} style={{fontSize:8,background:C.greenXL,color:C.green,padding:"1px 6px",borderRadius:4,border:`0.5px solid ${C.border}`}}>{tjenesteNavn(t)}</span>
                              ))}
                            </div>
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
                            <button style={{fontSize:9,padding:"3px 8px",background:"white",color:C.navy,border:`1px solid ${C.border}`,borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>Rediger</button>
                            <button style={{fontSize:9,padding:"3px 8px",background:C.dangerBg,color:C.danger,border:"none",borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>Fjern</button>
                          </div>
                        </div>
                      ))}
                      {/* Faktureringsoppsummering */}
                      <div style={{marginTop:9,background:C.greenXL,borderRadius:8,padding:"8px 11px",border:`0.5px solid ${C.border}`}}>
                        <div style={{fontSize:9,fontWeight:600,color:C.green,marginBottom:3}}>📄 Fakturering denne måneden</div>
                        <div style={{fontSize:10,color:C.navyMid}}>
                          {c.prismodell==="rammeavtale"&&"Samlefaktura sendes 1. neste måned via EHF/PEPPOL"}
                          {c.prismodell==="per_bestilling"&&`${c.brukere.filter(b=>b.aktiv).length*3} oppdrag · faktura genereres ved bestilling`}
                          {c.prismodell==="maanedspakke"&&`Fast faktura ${c.maanedsPris.toLocaleString("nb-NO")} kr sendes 1. neste måned`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {activeTab==="fakturaer"&&(
        <>
          <div className="fr" style={{fontSize:14,fontWeight:600,color:C.navy,marginBottom:10}}>Fakturaer</div>
          <div className="card tw">
            <table className="tbl">
              <thead><tr><th>ID</th><th>Kunde</th><th>Beløp</th><th>Forfaller</th><th>Status</th><th>Type</th><th>Handling</th></tr></thead>
              <tbody>{B2B_INV.map(inv=>(
                <tr key={inv.id}>
                  <td style={{fontFamily:"monospace",fontSize:10,color:C.soft}}>{inv.id}</td>
                  <td style={{fontWeight:500}}>{inv.customer}</td>
                  <td style={{fontWeight:600}}>{inv.amount.toLocaleString("nb-NO")} kr</td>
                  <td style={{color:inv.status==="overdue"?C.danger:C.soft,fontSize:10}}>{inv.due}</td>
                  <td><Bdg status={inv.status}/></td>
                  <td><span style={{fontSize:9,padding:"2px 7px",borderRadius:50,background:inv.ehf?C.greenBg:"#F0F5F2",color:inv.ehf?C.green:C.soft}}>{inv.ehf?"EHF/PEPPOL":"PDF e-post"}</span></td>
                  <td>
                    <div style={{display:"flex",gap:5}}>
                      {inv.status==="overdue"&&(
                        <button style={{fontSize:10,padding:"3px 9px",background:C.dangerBg,color:C.danger,border:`1px solid rgba(225,29,72,.2)`,borderRadius:6,cursor:"pointer",fontFamily:"inherit",fontWeight:600,whiteSpace:"nowrap"}}>
                          📨 Send purring
                        </button>
                      )}
                      {inv.status!=="paid"&&(
                        <button style={{fontSize:10,padding:"3px 9px",background:C.softBg,color:C.navyMid,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                          ↩️ Kreditnota
                        </button>
                      )}
                      {inv.status==="paid"&&(
                        <button style={{fontSize:10,padding:"3px 9px",background:"#F0FDF4",color:"#16A34A",border:"1px solid rgba(22,163,74,.2)",borderRadius:6,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                          ↩️ Kreditnota
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}

      {/* ── TAB: AVTALEMODELLER ── */}
      {activeTab==="avtalemodeller"&&(
        <div>
          {/* Avtale-modal */}
          {avtaleModal&&(
            <ModalPortal overlayStyle={{background:"rgba(0,0,0,.45)",padding:20}}>
              <div style={{background:"white",borderRadius:18,width:"100%",maxWidth:520,maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
                <div style={{padding:"16px 20px",background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,borderRadius:"18px 18px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:2}}>{avtaleModal==="ny"?"Ny avtalemodell":"Rediger avtalemodell"}</div>
                    <div style={{fontSize:15,fontWeight:600,color:"white"}}>{avtaleForm.ikon} {avtaleForm.label||"Ny modell"}</div>
                  </div>
                  <button onClick={()=>setAvtaleModal(null)} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:15}}>×</button>
                </div>
                <div style={{padding:"18px 20px"}}>
                  {avtaleModal!=="ny"&&avtaleForm.systemModell&&(
                    <div style={{background:C.goldBg,borderRadius:9,padding:"8px 12px",fontSize:10,color:C.goldDark,marginBottom:14,lineHeight:1.6}}>
                      ⚠️ Dette er en systemmodell. Du kan endre navn, ikon og beskrivelse, men ikke slette den.
                    </div>
                  )}
                  {/* Basis */}
                  <div style={{display:"grid",gridTemplateColumns:"52px 1fr",gap:10,marginBottom:12}}>
                    <div>
                      <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Ikon</label>
                      <input value={avtaleForm.ikon} onChange={e=>setAvtaleForm(f=>({...f,ikon:e.target.value}))}
                        style={{width:"100%",padding:"9px 4px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:22,textAlign:"center",background:C.greenXL,fontFamily:"inherit"}}/>
                    </div>
                    <div>
                      <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Navn</label>
                      <input value={avtaleForm.label} onChange={e=>setAvtaleForm(f=>({...f,label:e.target.value}))}
                        style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:13,fontFamily:"inherit",background:C.greenXL,fontWeight:600}}
                        placeholder="F.eks. Hybridavtale" disabled={avtaleModal!=="ny"&&avtaleForm.systemModell}/>
                    </div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Beskrivelse</label>
                    <textarea value={avtaleForm.beskrivelse} onChange={e=>setAvtaleForm(f=>({...f,beskrivelse:e.target.value}))} rows={2}
                      style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL,resize:"vertical"}}
                      placeholder="Beskriv når denne avtalemodellen passer..."/>
                  </div>
                  {/* Farge */}
                  <div style={{marginBottom:14}}>
                    <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:6}}>Farge</label>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {[C.sky,C.soft,C.green,"#6D28D9","#0891B2","#BE185D","#7C3AED",C.gold,C.danger,"#16A34A"].map(c=>(
                        <div key={c} onClick={()=>setAvtaleForm(f=>({...f,farge:c}))}
                          style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:`3px solid ${avtaleForm.farge===c?"white":"transparent"}`,boxShadow:avtaleForm.farge===c?`0 0 0 2px ${c}`:"none",transition:"all .15s"}}/>
                      ))}
                    </div>
                  </div>
                  {/* Fakturering */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                    <div>
                      <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Faktureringstype</label>
                      <select value={avtaleForm.fakturaType} onChange={e=>setAvtaleForm(f=>({...f,fakturaType:e.target.value}))}
                        style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:11,fontFamily:"inherit",background:C.greenXL}}>
                        <option value="maanedlig">Månedlig</option>
                        <option value="per_oppdrag">Per oppdrag</option>
                        <option value="engang">Engangs</option>
                        <option value="kvartal">Kvartal</option>
                      </select>
                    </div>
                    <div>
                      <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Fakturadag</label>
                      <input type="number" value={avtaleForm.fakturadag||""} onChange={e=>setAvtaleForm(f=>({...f,fakturadag:Number(e.target.value)||null}))}
                        style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}}
                        placeholder="1–28" min={1} max={28}/>
                    </div>
                    <div>
                      <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Bet.frist (dager)</label>
                      <input type="number" value={avtaleForm.betalingsfrist} onChange={e=>setAvtaleForm(f=>({...f,betalingsfrist:Number(e.target.value)}))}
                        style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}}/>
                    </div>
                  </div>
                  {/* Forhåndsvisning */}
                  <div style={{marginBottom:16,padding:"10px 13px",borderRadius:9,border:`2px solid ${avtaleForm.farge}`,background:`${avtaleForm.farge}10`,display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:22}}>{avtaleForm.ikon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{avtaleForm.label||"Navn"}</div>
                      <div style={{fontSize:10,color:C.soft}}>{avtaleForm.beskrivelse||"Beskrivelse"}</div>
                    </div>
                    <span style={{fontSize:10,padding:"2px 9px",borderRadius:50,fontWeight:600,background:`${avtaleForm.farge}20`,color:avtaleForm.farge}}>{avtaleForm.fakturaType==="maanedlig"?"Månedlig":avtaleForm.fakturaType==="per_oppdrag"?"Per oppdrag":avtaleForm.fakturaType==="kvartal"?"Kvartal":"Engangs"}</span>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    {!avtaleForm.systemModell&&avtaleModal!=="ny"&&(
                      <button onClick={()=>{setAvtalemodeller(p=>p.filter(a=>a.id!==avtaleForm.id));setAvtaleModal(null);}}
                        style={{padding:"9px 14px",fontSize:11,borderRadius:9,background:C.dangerBg,color:C.danger,border:`1px solid rgba(225,29,72,.2)`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
                        🗑 Slett
                      </button>
                    )}
                    <button onClick={()=>setAvtaleModal(null)} style={{padding:"9px 14px",fontSize:11,borderRadius:9,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>Avbryt</button>
                    <button onClick={()=>{
                      if(avtaleModal==="ny"){
                        const id=avtaleForm.label.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
                        setAvtalemodeller(p=>[...p,{...avtaleForm,id}]);
                      } else {
                        setAvtalemodeller(p=>p.map(a=>a.id===avtaleForm.id?{...avtaleForm}:a));
                      }
                      setAvtaleModal(null);
                    }} className="btn bp" style={{flex:1,padding:"9px 0",fontSize:12,borderRadius:9,opacity:avtaleForm.label?1:.5}}>
                      {avtaleModal==="ny"?"+ Opprett modell":"✓ Lagre"}
                    </button>
                  </div>
                </div>
              </div>
            </ModalPortal>
          )}

          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div className="fr" style={{fontSize:15,fontWeight:600,color:C.navy,marginBottom:2}}>Avtalemodeller</div>
              <div style={{fontSize:11,color:C.soft}}>{avtalemodeller.filter(a=>a.aktiv).length} aktive · Brukes ved oppretting av nye B2B-kunder</div>
            </div>
            <button onClick={()=>{setAvtaleForm({id:"",label:"",ikon:"📄",farge:C.green,beskrivelse:"",fakturaType:"maanedlig",fakturadag:1,betalingsfrist:14,felt:[],aktiv:true,systemModell:false});setAvtaleModal("ny");}} className="btn bp" style={{fontSize:12,padding:"8px 16px"}}>
              + Ny avtalemodell
            </button>
          </div>

          {/* Info */}
          <div style={{background:C.skyBg,borderRadius:10,padding:"9px 14px",marginBottom:16,fontSize:10,color:"#1e40af",lineHeight:1.6,border:"1px solid rgba(37,99,235,.15)"}}>
            📋 <strong>Systemmodeller</strong> (grå lås) kan ikke slettes men kan redigeres. <strong>Egendefinerte modeller</strong> kan slettes hvis de ikke er i bruk hos aktive kunder.
          </div>

          {/* Modell-grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,280px),1fr))",gap:12,marginBottom:16}}>
            {avtalemodeller.map(a=>(
              <div key={a.id} className="card" style={{overflow:"hidden"}}>
                <div style={{height:4,background:a.farge}}/>
                <div style={{padding:"14px 16px"}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
                    <div style={{width:40,height:40,borderRadius:10,background:`${a.farge}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{a.ikon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                        <span style={{fontSize:13,fontWeight:700,color:C.navy}}>{a.label}</span>
                        {a.systemModell&&<span style={{fontSize:8,background:C.softBg,color:C.soft,padding:"1px 6px",borderRadius:50,fontWeight:600}}>🔒 System</span>}
                      </div>
                      <div style={{fontSize:10,color:C.soft,lineHeight:1.5}}>{a.beskrivelse}</div>
                    </div>
                  </div>
                  {/* Faktura-detaljer */}
                  <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
                    <span style={{fontSize:9,background:`${a.farge}15`,color:a.farge,padding:"2px 8px",borderRadius:50,fontWeight:600}}>
                      {a.fakturaType==="maanedlig"?"📅 Månedlig":a.fakturaType==="per_oppdrag"?"🧾 Per oppdrag":a.fakturaType==="kvartal"?"📆 Kvartal":"🔂 Engangs"}
                    </span>
                    {a.fakturadag&&<span style={{fontSize:9,background:C.softBg,color:C.navyMid,padding:"2px 8px",borderRadius:50}}>Dag {a.fakturadag}</span>}
                    <span style={{fontSize:9,background:C.softBg,color:C.navyMid,padding:"2px 8px",borderRadius:50}}>{a.betalingsfrist} dagers frist</span>
                    <span style={{fontSize:9,background:C.softBg,color:C.navyMid,padding:"2px 8px",borderRadius:50}}>
                      {B2B_C.filter(c=>c.prismodell===a.id).length} kunder
                    </span>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>{setAvtaleForm({...a});setAvtaleModal(a);}} style={{flex:1,padding:"7px 0",fontSize:11,borderRadius:8,background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
                      ✏️ Rediger
                    </button>
                    <button onClick={()=>setAvtalemodeller(p=>p.map(x=>x.id===a.id?{...x,aktiv:!x.aktiv}:x))}
                      style={{padding:"7px 12px",fontSize:11,borderRadius:8,background:a.aktiv?C.dangerBg:C.greenBg,color:a.aktiv?C.danger:C.green,border:`1px solid ${a.aktiv?"rgba(225,29,72,.2)":C.border}`,cursor:"pointer",fontFamily:"inherit"}}>
                      {a.aktiv?"⏸":"▶️"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {/* Ny-kort */}
            <div onClick={()=>{setAvtaleForm({id:"",label:"",ikon:"📄",farge:C.green,beskrivelse:"",fakturaType:"maanedlig",fakturadag:1,betalingsfrist:14,felt:[],aktiv:true,systemModell:false});setAvtaleModal("ny");}}
              style={{border:`2px dashed ${C.border}`,borderRadius:14,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer",minHeight:160,background:"white",transition:"border-color .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.green}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <div style={{width:40,height:40,borderRadius:"50%",background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>+</div>
              <div style={{fontSize:12,fontWeight:600,color:C.green}}>Ny avtalemodell</div>
              <div style={{fontSize:10,color:C.soft,textAlign:"center",maxWidth:140}}>Definer en ny prisstruktur for B2B-kunder</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


const INIT_VIKARER=[
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

const BEMANNING_BYRAER=[
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

function VikarPanel(){
  const{toast,ToastContainer}=useToast();
  const[sub,setSub]=useState("oversikt"); // oversikt | byraer | vaktvakt
  const[vikarer,setVikarer]=useState(INIT_VIKARER);
  const[valgtVikar,setValgtVikar]=useState(null);
  const[nyModal,setNyModal]=useState(false);
  const[byraer,setByraer]=useState(BEMANNING_BYRAER);
  const[nyByraModal,setNyByraModal]=useState(null);

  const aktive=vikarer.filter(v=>v.status==="aktiv");
  const ventende=vikarer.filter(v=>v.status==="venter_godkjenning");

  const StatusBadge=({status})=>{
    const cfg={aktiv:{bg:"#F0FDF4",c:"#16A34A",l:"✓ Aktiv"},venter_godkjenning:{bg:"#FFF3E0",c:"#E65100",l:"⏳ Venter godkjenning"},inaktiv:{bg:C.softBg,c:C.soft,l:"Inaktiv"}};
    const s=cfg[status]||cfg.inaktiv;
    return <span style={{fontSize:9,padding:"2px 8px",borderRadius:50,fontWeight:600,background:s.bg,color:s.c}}>{s.l}</span>;
  };

  return(
    <div>
      <ToastContainer/>
      {/* ── Vikar-detaljmodal ── */}
      {valgtVikar&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.45)",padding:20}}>
          <div style={{background:"white",borderRadius:18,width:"100%",maxWidth:540,maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
            <div style={{padding:"18px 22px",background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,borderRadius:"18px 18px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDark},${C.sidebarAccent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"white"}}>{valgtVikar.av}</div>
                <div>
                  <div style={{fontSize:16,fontWeight:600,color:"white"}}>{valgtVikar.navn}</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>{valgtVikar.tittel} · HPR: {valgtVikar.hpr}</div>
                </div>
              </div>
              <button onClick={()=>setValgtVikar(null)} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16}}>×</button>
            </div>
            <div style={{padding:"18px 22px"}}>
              {/* Info-grid */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                {[
                  {l:"Type",v:valgtVikar.enk?`ENK — ${valgtVikar.enkOrg}`:"Midlertidig ansatt"},
                  {l:"Telefon",v:valgtVikar.telefon},
                  {l:"E-post",v:valgtVikar.epost},
                  {l:"Kontonr (utbetaling)",v:valgtVikar.kontonr||"Ikke registrert"},
                  {l:"Varsling",v:valgtVikar.varsel==="push"?"📱 Push-varsel":"📱 SMS"},
                  {l:"Responstid",v:valgtVikar.responstid},
                  {l:"Gjennomsnitt",v:valgtVikar.rating>0?`⭐ ${valgtVikar.rating} (${valgtVikar.oppdrag} oppdrag)`:"Ingen oppdrag ennå"},
                  {l:"Godkjent",v:valgtVikar.godkjent?`✓ ${valgtVikar.godkjentDato}`:"⏳ Venter"},
                ].map(r=>(
                  <div key={r.l} style={{background:C.greenXL,borderRadius:8,padding:"9px 11px"}}>
                    <div style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.4,marginBottom:2}}>{r.l}</div>
                    <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{r.v}</div>
                  </div>
                ))}
              </div>
              {/* Tjenester */}
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:7}}>Godkjente tjenester</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {valgtVikar.tjenester.map(t=>(
                    <span key={t} style={{fontSize:10,background:C.greenBg,color:C.green,padding:"3px 10px",borderRadius:50,border:`0.5px solid ${C.border}`,fontWeight:500}}>
                      {t.replace(/_/g," ")}
                    </span>
                  ))}
                </div>
              </div>
              {/* Dekningsområde */}
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:7}}>Dekningsområde</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {valgtVikar.omrade.map(o=>(
                    <span key={o} style={{fontSize:10,background:C.softBg,color:C.navyMid,padding:"3px 10px",borderRadius:50,fontWeight:500}}>📍 {o}</span>
                  ))}
                </div>
              </div>
              {/* Evaluering */}
              {valgtVikar.evaluering&&(
                <div style={{marginBottom:16,background:C.greenXL,borderRadius:9,padding:"10px 13px",border:`1px solid ${C.border}`,fontSize:11,color:C.navyMid,fontStyle:"italic",lineHeight:1.6}}>
                  💬 "{valgtVikar.evaluering}"
                </div>
              )}
              <div style={{display:"flex",gap:8}}>
                {!valgtVikar.godkjent&&(
                  <button onClick={()=>{setVikarer(p=>p.map(v=>v.id===valgtVikar.id?{...v,godkjent:true,godkjentDato:new Date().toISOString().slice(0,10),status:"aktiv"}:v));setValgtVikar(null);}} className="btn bp" style={{flex:1,padding:"9px 0",fontSize:12,borderRadius:9}}>
                    ✓ Godkjenn vikar
                  </button>
                )}
                <button onClick={()=>setValgtVikar(null)} style={{flex:1,padding:"9px 0",fontSize:12,borderRadius:9,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>Lukk</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* KPI-strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:16}}>
        {[
          {l:"Aktive vikarer",v:aktive.length,icon:"🤝",c:C.green},
          {l:"Venter godkjenning",v:ventende.length,icon:"⏳",c:ventende.length>0?C.gold:C.soft},
          {l:"Tilgjengelig nå",v:vikarer.filter(v=>v.tilgjengelig&&v.status==="aktiv").length,icon:"✅",c:C.green},
          {l:"Byrå-avtaler aktive",v:byraer.filter(b=>b.aktiv).length,icon:"🏢",c:C.sky},
          {l:"Snitt rating",v:aktive.filter(v=>v.rating>0).length>0?(aktive.filter(v=>v.rating>0).reduce((s,v)=>s+v.rating,0)/aktive.filter(v=>v.rating>0).length).toFixed(1)+"⭐":"–",icon:"⭐",c:C.gold},
        ].map(k=>(
          <div key={k.l} className="card cp">
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.4}}>{k.l}</span><span>{k.icon}</span></div>
            <div className="fr" style={{fontSize:20,fontWeight:700,color:k.c}}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{display:"flex",background:"white",borderRadius:9,padding:3,marginBottom:16,border:`1px solid ${C.border}`,width:"fit-content"}}>
        {[["oversikt","👥 Vikarer"],["byraer","🏢 Bemanningsbyrå"],["vaktvakt","⚡ Vaktvakt-flyt"]].map(([t,l])=>(
          <button key={t} onClick={()=>setSub(t)} style={{padding:"6px 14px",borderRadius:7,fontSize:11,fontWeight:sub===t?600:400,cursor:"pointer",border:"none",background:sub===t?C.greenBg:"transparent",color:sub===t?C.green:C.soft,fontFamily:"inherit",whiteSpace:"nowrap"}}>{l}</button>
        ))}
      </div>

      {/* ── OVERSIKT ── */}
      {sub==="oversikt"&&(
        <div>
          {/* Ventende godkjenning */}
          {ventende.length>0&&(
            <div style={{background:"#FFF3E0",border:"1px solid #FFD0A0",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:20}}>⏳</span>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:"#E65100"}}>{ventende.length} vikar{ventende.length>1?"er":""} venter godkjenning</div>
                <div style={{fontSize:10,color:C.soft}}>{ventende.map(v=>v.navn).join(", ")} — klikk for å gjennomgå og godkjenne</div>
              </div>
            </div>
          )}
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
            <button onClick={()=>{toast("Vikar-registreringsflyt kommer — send invitasjon via e-post","warn");}} className="btn bp" style={{fontSize:11,padding:"7px 16px"}}>+ Legg til vikar</button>
          </div>
          <div className="card tw">
            <table className="tbl">
              <thead><tr><th>Navn</th><th>Type</th><th>Tjenester</th><th>Område</th><th>Tilgjengelig</th><th>Rating</th><th>Responstid</th><th>Status</th><th></th></tr></thead>
              <tbody>{vikarer.map(v=>(
                <tr key={v.id} style={{cursor:"pointer",background:v.status==="venter_godkjenning"?"#FFFDF5":"white"}} onClick={()=>setValgtVikar(v)}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDark},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"white",flexShrink:0}}>{v.av}</div>
                      <div>
                        <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{v.navn}</div>
                        <div style={{fontSize:9,color:C.soft}}>{v.tittel} · HPR {v.hpr}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{fontSize:9,padding:"1px 7px",borderRadius:50,background:v.enk?C.greenBg:C.skyBg,color:v.enk?C.green:C.sky,fontWeight:600}}>{v.enk?"ENK":"Midl."}</span></td>
                  <td style={{fontSize:10,color:C.soft}}>{v.tjenester.length} tjenester</td>
                  <td style={{fontSize:10,color:C.soft}}>{v.omrade.join(", ")}</td>
                  <td>
                    <div style={{width:10,height:10,borderRadius:"50%",background:v.tilgjengelig&&v.status==="aktiv"?"#16A34A":"#D1D5DB",margin:"0 auto"}}/>
                  </td>
                  <td style={{fontSize:11,fontWeight:600,color:v.rating>0?C.navy:C.soft}}>{v.rating>0?`⭐ ${v.rating}`:"–"}</td>
                  <td style={{fontSize:10,color:C.soft}}>{v.responstid}</td>
                  <td><StatusBadge status={v.status}/></td>
                  <td><button style={{fontSize:10,padding:"3px 9px",background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit"}} onClick={e=>{e.stopPropagation();setValgtVikar(v);}}>Detaljer</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── BEMANNINGSBYRÅ ── */}
      {sub==="byraer"&&(
        <div>
          <div style={{background:C.skyBg,borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:11,color:"#1e40af",lineHeight:1.6,border:"1px solid rgba(37,99,235,.15)"}}>
            🏢 <strong>Vaktvakt-prioritet:</strong> EiraNova forsøker alltid egne vikarer først. Bemanningsbyrå aktiveres automatisk hvis ingen egne vikarer responderer innen konfigurert tid. Se <button onClick={()=>setSub("vaktvakt")} style={{background:"none",border:"none",color:C.sky,cursor:"pointer",fontFamily:"inherit",fontWeight:600,padding:0,fontSize:11}}>Vaktvakt-flyt →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14,marginBottom:16}}>
            {byraer.map(b=>(
              <div key={b.id} className="card" style={{opacity:b.aktiv?1:.7}}>
                <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:11,background:b.aktiv?C.greenBg:C.softBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:b.aktiv?C.green:C.soft,flexShrink:0}}>{b.logo}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{b.navn}</div>
                    <div style={{fontSize:10,color:C.soft}}>{b.kontakt}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                    <span style={{fontSize:9,padding:"2px 8px",borderRadius:50,fontWeight:600,background:b.aktiv?"#F0FDF4":C.softBg,color:b.aktiv?"#16A34A":C.soft}}>{b.aktiv?"✓ Aktiv avtale":"Ingen avtale"}</span>
                    {b.api&&<span style={{fontSize:9,padding:"1px 7px",borderRadius:50,background:b.apiStatus==="aktiv"?C.greenBg:C.goldBg,color:b.apiStatus==="aktiv"?C.green:C.goldDark,fontWeight:600}}>{b.apiStatus==="aktiv"?"🔌 API aktiv":"🔌 API ikke satt opp"}</span>}
                  </div>
                </div>
                <div style={{padding:"12px 16px"}}>
                  {[
                    {l:"Tilgjengelighet",v:b.tilgjengelighet},
                    {l:"Responstid",v:b.responstid},
                    {l:"Timepris sykepleier",v:`${b.timepris.sykepleier} kr/t`},
                    {l:"Timepris hjelpepleier",v:`${b.timepris.hjelpepleier} kr/t`},
                    {l:"Fakturering",v:b.faktura},
                    {l:"Avtale",v:b.avtale||"—"},
                  ].map(r=>(
                    <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${C.border}`,fontSize:11}}>
                      <span style={{color:C.soft}}>{r.l}</span>
                      <span style={{fontWeight:600,color:C.navy}}>{r.v}</span>
                    </div>
                  ))}
                  {b.api&&b.apiUrl&&(
                    <div style={{marginTop:10,background:C.softBg,borderRadius:7,padding:"6px 10px",fontSize:9,fontFamily:"monospace",color:C.navyMid}}>{b.apiUrl}</div>
                  )}
                  <div style={{display:"flex",gap:7,marginTop:12}}>
                    <button onClick={()=>setByraer(p=>p.map(x=>x.id===b.id?{...x,aktiv:!x.aktiv}:x))} style={{flex:1,padding:"7px 0",fontSize:11,borderRadius:8,background:b.aktiv?C.dangerBg:C.greenBg,color:b.aktiv?C.danger:C.green,border:`1px solid ${b.aktiv?"rgba(225,29,72,.2)":C.border}`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
                      {b.aktiv?"Deaktiver avtale":"Aktiver avtale"}
                    </button>
                    {b.api&&!b.aktiv&&(
                      <button onClick={()=>toast(`API-oppsett for ${b.navn} — krever API-nøkkel fra byrået`,"warn")} style={{flex:1,padding:"7px 0",fontSize:11,borderRadius:8,background:C.skyBg,color:C.sky,border:`1px solid rgba(37,99,235,.2)`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
                        🔌 Sett opp API
                      </button>
                    )}
                    {b.api&&b.apiStatus==="aktiv"&&(
                      <button onClick={()=>toast(`${b.navn}: tilkobling OK ✓`,"ok")} style={{flex:1,padding:"7px 0",fontSize:11,borderRadius:8,background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>
                        Test tilkobling
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* Legg til byrå */}
            <div onClick={()=>setNyByraModal(true)} style={{border:`2px dashed ${C.border}`,borderRadius:14,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer",minHeight:200,background:"white",transition:"border-color .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.green}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <div style={{width:44,height:44,borderRadius:"50%",background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>+</div>
              <div style={{fontSize:12,fontWeight:600,color:C.green}}>Legg til bemanningsbyrå</div>
            </div>
          </div>
        </div>
      )}

      {/* ── VAKTVAKT-FLYT ── */}
      {sub==="vaktvakt"&&(
        <div>
          <div style={{background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,borderRadius:14,padding:"18px 20px",marginBottom:20,color:"white"}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>⚡ Automatisk vaktvakt-flyt</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.65)",lineHeight:1.6}}>Når et oppdrag ikke har tildelt sykepleier, forsøker systemet automatisk å fylle plassen i prioritert rekkefølge.</div>
          </div>
          {/* Flyt-diagram */}
          <div style={{display:"flex",flexDirection:"column",gap:0,marginBottom:20}}>
            {[
              {steg:1,tittel:"Oppdrag uten tildelt sykepleier",detalj:"Enten nytt oppdrag eller sykepleier meldt syk",icon:"📋",tid:"0 min",action:"Automatisk trigger",color:C.navy},
              {steg:2,tittel:"Varsle egne tilkallingsvikarer",detalj:`Push-varsel til ${aktive.length} aktive vikarer i riktig område. Inkl. tjenestetype og tidspunkt.`,icon:"📱",tid:"0–30 min",action:"Første tilgjengelige vikar aksepterer",color:C.green},
              {steg:3,tittel:"Ingen respons → API-forespørsel til byrå",detalj:`Automatisk forespørsel til ${byraer.filter(b=>b.aktiv&&b.api).map(b=>b.navn).join(", ")||"aktivt byrå med API"}. Inkl. HPR-krav og tjenestebeskrivelse.`,icon:"🏢",tid:"30–90 min",action:"Byrå bekrefter tilgjengelig vikar",color:C.sky},
              {steg:4,tittel:"Ingen API-byrå → Manuell bestilling",detalj:"Admin varsles. Ring øvrige byrå manuelt. Registrer vikaren manuelt i systemet.",icon:"📞",tid:"90+ min",action:"Manuell tildeling av admin",color:C.gold},
              {steg:5,tittel:"Kunde varsles ved tildeling",detalj:"Automatisk SMS/push til kunde: ny sykepleier bekreftet. Navn og tidspunkt.",icon:"✅",tid:"Ved tildeling",action:"Kunden informert",color:"#16A34A"},
            ].map((s,i)=>(
              <div key={s.steg} style={{display:"flex",gap:0}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:48,flexShrink:0}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,border:`3px solid ${s.color}44`}}>{s.icon}</div>
                  {i<4&&<div style={{width:2,flex:1,background:C.border,margin:"4px 0",minHeight:20}}/>}
                </div>
                <div style={{flex:1,padding:"2px 0 20px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <span style={{fontSize:12,fontWeight:700,color:C.navy}}>Steg {s.steg}: {s.tittel}</span>
                    <span style={{fontSize:9,background:`${s.color}18`,color:s.color,padding:"1px 8px",borderRadius:50,fontWeight:600,flexShrink:0}}>{s.tid}</span>
                  </div>
                  <div style={{fontSize:11,color:C.soft,lineHeight:1.55,marginBottom:4}}>{s.detalj}</div>
                  <div style={{fontSize:10,fontWeight:600,color:s.color}}>→ {s.action}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Innstillinger */}
          <div className="card">
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
              <span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>⚙️ Vaktvakt-innstillinger</span>
            </div>
            <div style={{padding:"16px"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
                {[
                  {l:"Ventetid før byrå-API (min)",v:"30",hint:"Tid egne vikarer har til å svare"},
                  {l:"Ventetid før manuell varsling (min)",v:"90",hint:"Før admin-varsling"},
                  {l:"Varslingskanal",v:"Push + SMS",hint:"Egne vikarer"},
                  {l:"Automatisk byrå-API",v:"Ja — Manpower Health",hint:"Ved manglende respons"},
                ].map(r=>(
                  <div key={r.l}>
                    <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>{r.l}</label>
                    <input defaultValue={r.v} style={{width:"100%",padding:"8px 11px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}}/>
                    <div style={{fontSize:9,color:C.soft,marginTop:2}}>{r.hint}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>toast("Vaktvakt-innstillinger lagret")} className="btn bp" style={{marginTop:14,padding:"8px 20px",fontSize:12,borderRadius:9}}>Lagre vaktvakt-innstillinger</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AAnsatte({ventendeProfilendringer=[],onGodkjennNurseProfil,onAvvisNurseProfil,koordinatorPrefillEmail=null,onKoordinatorPrefillConsumed}){
  const{toast,ToastContainer}=useToast();
  const[staff,setStaff]=useState(INIT_STAFF);
  const[b2bTilganger,setB2bTilganger]=useState(INIT_B2B_TILGANGER);
  const[modal,setModal]=useState(null);
  const[ws,setWs]=useState({});
  const[form,setForm]=useState({name:"",email:"",role:"sykepleier",scope:"intern"});
  const[del,setDel]=useState(null);
  const[activeTab,setActiveTab]=useState("interne"); // interne | vikarer | b2b | roller
  const[b2bModal,setB2bModal]=useState(null);
  const[revisjonModal,setRevisjonModal]=useState(null);
  const[inviteEmail,setInviteEmail]=useState("");
  const[inviteDomene,setInviteDomene]=useState("");

  useEffect(()=>{
    if(!koordinatorPrefillEmail)return;
    setActiveTab("interne");
    setForm(f=>({...f,name:"",email:koordinatorPrefillEmail,role:"koordinator",scope:"intern"}));
    setModal("ny");
    onKoordinatorPrefillConsumed?.();
  },[koordinatorPrefillEmail,onKoordinatorPrefillConsumed]);

  const sync=(id)=>{
    setWs(s=>({...s,[id]:"syncing"}));
    setTimeout(()=>{setWs(s=>({...s,[id]:"done"}));setTimeout(()=>setWs(s=>({...s,[id]:undefined})),2500);},1400);
  };
  const create=()=>{
    if(!form.name||!form.email)return;
    const id=String(Date.now());
    setStaff(s=>[...s,{id,name:form.name,email:form.email,role:form.role,scope:form.scope,googleWs:false,created:new Date().toISOString().split("T")[0]}]);
    setModal(null);setForm({name:"",email:"",role:"sykepleier",scope:"intern"});
    setWs(w=>({...w,[id]:"syncing"}));
    setTimeout(()=>{setStaff(s=>s.map(m=>m.id===id?{...m,googleWs:true}:m));setWs(w=>({...w,[id]:"done"}));setTimeout(()=>setWs(w=>({...w,[id]:undefined})),2500);},1600);
  };
  const remove=(m)=>{setDel(null);setWs(w=>({...w,[m.id]:"syncing"}));setTimeout(()=>setStaff(s=>s.filter(x=>x.id!==m.id)),1400);};
  const updateRole=(id,newRole)=>{setStaff(s=>s.map(m=>m.id===id?{...m,role:newRole}:m));sync(id);};
  const ri=(r)=>ROLLE_INFO[r]??{label:r,bg:C.softBg,c:C.soft,scope:"intern",desc:""};

  const sendInvite=(tilgangId)=>{
    if(!inviteEmail)return;
    setB2bTilganger(t=>t.map(x=>x.id===tilgangId?{...x,invitasjonsPending:[...x.invitasjonsPending,inviteEmail]}:x));
    setInviteEmail("");sync("inv_"+tilgangId);
  };
  const addDomene=(tilgangId)=>{
    if(!inviteDomene)return;
    setB2bTilganger(t=>t.map(x=>x.id===tilgangId?{...x,hvitelisteDomener:[...x.hvitelisteDomener,inviteDomene]}:x));
    setInviteDomene("");
  };
  const removeKoord=(tilgangId,koordinatorId)=>{
    setB2bTilganger(t=>t.map(x=>x.id===tilgangId?{...x,koordinatorer:x.koordinatorer.filter(k=>k.id!==koordinatorId)}:x));
  };

  const vCount=ventendeProfilendringer.length;
  const godkjenn=id=>{
    onGodkjennNurseProfil?.(id);
    toast("Profilendring godkjent — katalog oppdatert","ok");
  };
  const avvis=id=>{
    onAvvisNurseProfil?.(id);
    toast("Avvisningsmelding sendt til sykepleier (mock)","info");
  };
  return(
    <div className="fu">
      <ToastContainer/>
      <div style={{background:"linear-gradient(135deg,#F3FAF7,#E8F5F0)",border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:vCount?12:0,flexWrap:"wrap"}}>
          <div style={{fontSize:13,fontWeight:700,color:C.navy}}>Ventende profilendringer</div>
          <span style={{fontSize:10,fontWeight:700,background:vCount?C.goldBg:C.softBg,color:vCount?C.goldDark:C.soft,padding:"3px 10px",borderRadius:50,minWidth:22,textAlign:"center"}}>{vCount}</span>
        </div>
        {vCount===0&&<div style={{fontSize:11,color:C.soft}}>Ingen endringer venter på godkjenning.</div>}
        {ventendeProfilendringer.map(p=>(
          <div key={p.id} style={{background:"white",borderRadius:10,padding:"12px 14px",marginBottom:10,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:4}}>{p.nurseName}</div>
            <div style={{fontSize:11,color:C.navyMid,lineHeight:1.5,marginBottom:10}}>{p.sammendrag}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <button type="button" onClick={()=>godkjenn(p.id)} className="btn bp" style={{padding:"7px 16px",fontSize:11,borderRadius:8,fontWeight:600}}>Godkjenn</button>
              <button type="button" onClick={()=>avvis(p.id)} style={{padding:"7px 16px",fontSize:11,borderRadius:8,fontWeight:600,background:"white",color:C.danger,border:`1.5px solid ${C.danger}`,cursor:"pointer",fontFamily:"inherit"}}>Avvis</button>
            </div>
          </div>
        ))}
      </div>
      {/* Tab bar */}
      <div style={{display:"flex",background:"white",borderRadius:10,padding:3,marginBottom:14,border:`1px solid ${C.border}`,width:"fit-content"}}>
        {[["interne","👥 Interne ansatte"],["vikarer","🤝 Tilkallingsvikarer"],["b2b","🏢 B2B-tilganger"],["roller","🔑 Rollematrise"]].map(([t,l])=>(
          <button key={t} onClick={()=>setActiveTab(t)} style={{padding:"6px 13px",borderRadius:8,fontSize:11,fontWeight:activeTab===t?600:400,cursor:"pointer",border:"none",background:activeTab===t?C.greenBg:"transparent",color:activeTab===t?C.green:C.soft,fontFamily:"inherit"}}>{l}</button>
        ))}
      </div>

      {/* ── TAB: INTERNE ANSATTE ── */}
      {activeTab==="interne"&&(
        <>
          {/* Google Workspace banner */}
          <div style={{background:"white",border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 14px",marginBottom:14,display:"flex",alignItems:"flex-start",gap:11}}>
            <div style={{width:34,height:34,borderRadius:9,background:"#F0F7FF",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg width="17" height="17" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:2}}>Google Workspace — @eiranova.no</div>
              <div style={{fontSize:10,color:C.soft,lineHeight:1.5}}>Interne ansatte opprettes i Supabase og Google Workspace i én operasjon. Konto aktiveres automatisk.</div>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
            <span style={{fontSize:12,fontWeight:600,color:C.navy}}>{staff.filter(s=>s.scope!=="ekstern").length} interne ansatte</span>
            <button onClick={()=>setModal("ny")} className="btn bp" style={{fontSize:11,padding:"7px 14px"}}>+ Ny ansatt</button>
          </div>
          <div className="card" style={{marginBottom:14}}>
            {staff.filter(s=>s.scope!=="ekstern").map((m,i,arr)=>{
              const r=ri(m.role);
              return(
                <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",flexWrap:"wrap"}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:C.greenDark,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white",flexShrink:0}}>
                    {m.name.split(" ").map(p=>p[0]).join("").slice(0,2)}
                  </div>
                  <div style={{flex:1,minWidth:140}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2,flexWrap:"wrap"}}>
                      <span style={{fontSize:12,fontWeight:600,color:C.navy}}>{m.name}</span>
                      <span style={{fontSize:9,padding:"1px 7px",borderRadius:50,background:r.bg,color:r.c,fontWeight:600}}>{r.label}</span>
                      {m.googleWs?<span style={{fontSize:9,color:"#16A34A"}}>✓ Workspace</span>:<span style={{fontSize:9,color:C.goldDark}}>⚠ Ikke synkronisert</span>}
                    </div>
                    <div style={{fontSize:10,color:C.soft,fontFamily:"monospace"}}>{m.email}</div>
                  </div>
                  <select value={m.role} onChange={e=>updateRole(m.id,e.target.value)} style={{fontSize:10,padding:"4px 6px",border:`1px solid ${C.border}`,borderRadius:6,color:C.navy,background:"white",cursor:"pointer",fontFamily:"inherit"}}>
                    {INTERNE_ROLLER.map(r=><option key={r} value={r}>{ri(r).label}</option>)}
                  </select>
                  {ws[m.id]==="syncing"&&<div style={{fontSize:9,color:C.soft,display:"flex",alignItems:"center",gap:3}}><div style={{width:10,height:10,border:`1.5px solid ${C.border}`,borderTopColor:C.green,borderRadius:"50%",animation:"spin .7s linear infinite"}}/> Sync…</div>}
                  {ws[m.id]==="done"&&<span style={{fontSize:9,color:"#16A34A",fontWeight:600}}>✓ Synkronisert</span>}
                  <button onClick={()=>setDel(m)} style={{padding:"4px 9px",fontSize:9,borderRadius:6,background:C.dangerBg,color:C.danger,border:"none",cursor:"pointer",fontFamily:"inherit"}}>Fjern</button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── TAB: TILKALLINGSVIKARER ── */}
      {activeTab==="vikarer"&&<VikarPanel/>}

      {/* ── TAB: B2B-TILGANGER ── */}
      {activeTab==="b2b"&&(
        <>
          {/* Security process banner */}
          <div style={{background:"#FFF3E0",border:"1px solid #FFD0A0",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:700,color:"#E65100",marginBottom:6}}>Sikkerhetsprosess — 4 lag</div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {[
                ["1","Individuell invitasjon","Kun spesifikk e-postadresse kan aktivere"],
                ["2","Domene-whitelist","Bekrefter organisasjonstilhørighet"],
                ["3","Kontaktperson godkjenner","B2B-kontakt bekrefter via e-post"],
                ["4","Revisjonsspor","Alt loggføres med dato og hvem som ga tilgang"],
              ].map(([n,t,d])=>(
                <div key={n} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:"#E65100",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"white",flexShrink:0,marginTop:1}}>{n}</div>
                  <div><span style={{fontSize:10,fontWeight:600,color:"#7A3A00"}}>{t}</span><span style={{fontSize:10,color:"#7A3A00"}}> — {d}</span></div>
                </div>
              ))}
            </div>
          </div>

          {b2bTilganger.map(t=>{
            const allOK=t.koordinatorer.length>0&&t.koordinatorer.every(k=>k.godkjentAvKontakt);
            const hasPending=t.pending.length>0;
            return(
              <div key={t.id} className="card" style={{marginBottom:12}}>
                {/* Header */}
                <div style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:8}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:C.navy,marginBottom:3}}>{t.kundeName}</div>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {t.hvitelisteDomener.map(d=>(
                          <span key={d} style={{fontSize:9,background:C.greenBg,color:C.green,padding:"2px 8px",borderRadius:50,fontWeight:600}}>✓ @{d}</span>
                        ))}
                        {t.hvitelisteDomener.length===0&&<span style={{fontSize:9,color:C.soft,fontStyle:"italic"}}>Ingen hvitelistede domener</span>}
                      </div>
                    </div>
                    <button onClick={()=>setB2bModal(t)} className="btn bp" style={{fontSize:10,padding:"6px 12px"}}>
                      + Gi tilgang
                    </button>
                  </div>
                  {/* Kontaktperson */}
                  <div style={{display:"flex",alignItems:"center",gap:7,background:C.softBg,borderRadius:8,padding:"6px 10px"}}>
                    <span style={{fontSize:11}}>👤</span>
                    <div style={{flex:1}}>
                      <span style={{fontSize:10,fontWeight:600,color:C.navy}}>{t.kontaktperson.name}</span>
                      <span style={{fontSize:9,color:C.soft}}> · {t.kontaktperson.email}</span>
                    </div>
                    {t.kontaktperson.godkjentAv
                      ?<span style={{fontSize:9,color:"#16A34A",fontWeight:600}}>✓ Godkjenner tilganger</span>
                      :<span style={{fontSize:9,color:C.goldDark,fontWeight:600}}>⚠ Ikke bekreftet</span>}
                  </div>
                </div>

                {/* Aktive koordinatorer */}
                {t.koordinatorer.length>0&&(
                  <div>
                    <div style={{padding:"7px 14px",fontSize:9,fontWeight:700,color:C.soft,textTransform:"uppercase",letterSpacing:.6,background:C.greenXL}}>
                      Aktive koordinatorer ({t.koordinatorer.length})
                    </div>
                    {t.koordinatorer.map((k,i)=>(
                      <div key={k.id} style={{padding:"10px 14px",borderBottom:i<t.koordinatorer.length-1?`1px solid ${C.border}`:"none"}}>
                        <div style={{display:"flex",alignItems:"center",gap:9,flexWrap:"wrap"}}>
                          <div style={{width:32,height:32,borderRadius:"50%",background:"#E65100",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white",flexShrink:0}}>
                            {k.name.split(" ").map(p=>p[0]).join("").slice(0,2)}
                          </div>
                          <div style={{flex:1,minWidth:120}}>
                            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2,flexWrap:"wrap"}}>
                              <span style={{fontSize:11,fontWeight:600,color:C.navy}}>{k.name}</span>
                              {k.domeneOK
                                ?<span style={{fontSize:8,background:C.greenBg,color:C.green,padding:"1px 6px",borderRadius:50,fontWeight:600}}>✓ Domene</span>
                                :<span style={{fontSize:8,background:C.goldBg,color:C.goldDark,padding:"1px 6px",borderRadius:50}}>Manuell e-post</span>}
                              {k.godkjentAvKontakt
                                ?<span style={{fontSize:8,background:C.greenBg,color:C.green,padding:"1px 6px",borderRadius:50,fontWeight:600}}>✓ Godkjent</span>
                                :<span style={{fontSize:8,background:C.dangerBg,color:C.danger,padding:"1px 6px",borderRadius:50}}>Ikke godkjent</span>}
                            </div>
                            <div style={{fontSize:9,color:C.soft,fontFamily:"monospace",marginBottom:2}}>{k.email}</div>
                            <div style={{fontSize:9,color:C.soft}}>Gitt av {k.gittTilgangAv} · {k.godkjentDato}</div>
                          </div>
                          <button onClick={()=>setRevisjonModal(k)} style={{fontSize:9,padding:"4px 9px",background:C.softBg,color:C.navyMid,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit"}}>
                            Revisjon
                          </button>
                          <button onClick={()=>removeKoord(t.id,k.id)} style={{fontSize:9,padding:"4px 9px",background:C.dangerBg,color:C.danger,border:"none",borderRadius:6,cursor:"pointer",fontFamily:"inherit"}}>Fjern</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pending */}
                {t.pending.length>0&&(
                  <div style={{borderTop:`1px solid ${C.border}`}}>
                    <div style={{padding:"7px 14px",fontSize:9,fontWeight:700,color:C.goldDark,textTransform:"uppercase",letterSpacing:.6,background:C.goldBg}}>
                      Under behandling ({t.pending.length})
                    </div>
                    {t.pending.map((p,i)=>{
                      const STEG_INFO={
                        invitert:{label:"Steg 1 av 3 — Invitasjon sendt",color:C.sky,pct:33},
                        venter_kontaktgodkjenning:{label:"Steg 2 av 3 — Venter på godkjenning fra "+t.kontaktperson.name,color:C.gold,pct:66},
                        venter_aktivering:{label:"Steg 3 av 3 — Venter på at bruker aktiverer konto",color:"#7C3AED",pct:90},
                      };
                      const s=STEG_INFO[p.steg]??{label:p.steg,color:C.soft,pct:0};
                      return(
                        <div key={p.id} style={{padding:"10px 14px",borderBottom:i<t.pending.length-1?`1px solid ${C.border}`:"none"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7,flexWrap:"wrap"}}>
                            <div style={{width:28,height:28,borderRadius:"50%",background:C.goldBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>⏳</div>
                            <div style={{flex:1,minWidth:100}}>
                              <div style={{fontSize:10,fontWeight:600,color:C.navy,fontFamily:"monospace",marginBottom:1}}>{p.email}</div>
                              <div style={{fontSize:9,color:C.soft}}>Sendt {p.invitasjonsDate} av {p.gittTilgangAv}</div>
                            </div>
                            <button style={{fontSize:9,padding:"3px 8px",background:"white",border:`1px solid ${C.border}`,borderRadius:5,cursor:"pointer",fontFamily:"inherit",color:C.soft}}>Avbryt</button>
                          </div>
                          {/* Progress bar med steg */}
                          <div style={{background:C.softBg,borderRadius:7,padding:"7px 10px"}}>
                            <div style={{fontSize:9,color:C.navyMid,marginBottom:5,fontWeight:500}}>{s.label}</div>
                            <div style={{height:5,borderRadius:50,background:C.border,overflow:"hidden"}}>
                              <div style={{height:"100%",borderRadius:50,background:s.color,width:`${s.pct}%`,transition:"width .4s"}}/>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                              {["Invitert","Godkjent","Aktivert"].map((label,si)=>(
                                <div key={label} style={{display:"flex",alignItems:"center",gap:3}}>
                                  <div style={{width:8,height:8,borderRadius:"50%",background:s.pct>si*33+10?"#16A34A":C.border}}/>
                                  <span style={{fontSize:8,color:C.soft}}>{label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {t.koordinatorer.length===0&&t.pending.length===0&&(
                  <div style={{padding:"14px",textAlign:"center",color:C.soft,fontSize:11}}>
                    Ingen koordinatorer ennå — klikk "+ Gi tilgang"
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}


      {/* ── TAB: ROLLEMATRISE ── */}
      {activeTab==="roller"&&(
        <div className="card">
          <div style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}`}}>
            <div className="fr" style={{fontSize:14,fontWeight:600,color:C.navy,marginBottom:2}}>Rollematrise</div>
            <div style={{fontSize:10,color:C.soft}}>Oversikt over hva hver rolle har tilgang til</div>
          </div>
          {/* Interne */}
          <div style={{padding:"10px 14px 4px",fontSize:9,fontWeight:700,color:C.soft,textTransform:"uppercase",letterSpacing:.8}}>Interne roller — @eiranova.no</div>
          {INTERNE_ROLLER.map(r=>{
            const info=ri(r);
            return(
              <div key={r} style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontSize:10,padding:"2px 9px",borderRadius:50,background:info.bg,color:info.c,fontWeight:600}}>{info.label}</span>
                  <span style={{fontSize:10,color:C.soft}}>{info.desc}</span>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {(ROLLE_TILGANGER[r]||[]).map(t=>(
                    <span key={t} style={{fontSize:9,background:C.greenXL,color:C.green,padding:"2px 7px",borderRadius:4,border:`0.5px solid ${C.border}`}}>{t}</span>
                  ))}
                </div>
              </div>
            );
          })}
          {/* B2B */}
          <div style={{padding:"10px 14px 4px",fontSize:9,fontWeight:700,color:C.soft,textTransform:"uppercase",letterSpacing:.8}}>B2B-roller — eksternt domene</div>
          {B2B_ROLLER.map(r=>{
            const info=ri(r);
            return(
              <div key={r} style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontSize:10,padding:"2px 9px",borderRadius:50,background:info.bg,color:info.c,fontWeight:600}}>{info.label}</span>
                  <span style={{fontSize:10,color:C.soft}}>{info.desc}</span>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {(ROLLE_TILGANGER[r]||[]).map(t=>(
                    <span key={t} style={{fontSize:9,background:"#FFF3E0",color:"#E65100",padding:"2px 7px",borderRadius:4,border:`0.5px solid #FFD0A0`}}>{t}</span>
                  ))}
                </div>
              </div>
            );
          })}
          <div style={{padding:"10px 14px",fontSize:9,color:C.soft,lineHeight:1.6}}>
            Roller settes i Supabase JWT-token ved innlogging. B2B-koordinatorer autentiseres via eget domene — EiraNova oppretter ikke Workspace-konto for dem.
          </div>
        </div>
      )}

      {/* Modal: Ny intern ansatt */}
      {modal==="ny"&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.45)",padding:16}}>
          <div style={{background:"white",borderRadius:16,padding:22,width:"100%",maxWidth:420,boxShadow:"0 8px 40px rgba(0,0,0,.2)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <span className="fr" style={{fontSize:16,fontWeight:600,color:C.navy}}>Ny intern ansatt</span>
              <button onClick={()=>setModal(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.soft}}>✕</button>
            </div>
            {[["Fullt navn","Ola Nordmann","name","text"],["E-post (@eiranova.no)","ola@eiranova.no","email","email"]].map(([label,ph,key,type])=>(
              <div key={key} style={{marginBottom:10}}><label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>{label}</label><input className="inp" type={type} placeholder={ph} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}/></div>
            ))}
            <div style={{marginBottom:14}}>
              <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>Rolle</label>
              <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} style={{width:"100%",padding:"9px 11px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,outline:"none",background:C.greenXL,fontFamily:"inherit",color:C.navy}}>
                {INTERNE_ROLLER.map(r=><option key={r} value={r}>{ri(r).label} — {ri(r).desc}</option>)}
              </select>
            </div>
            <div style={{background:C.greenXL,borderRadius:9,padding:"9px 12px",marginBottom:14,fontSize:10,color:C.navyMid,lineHeight:1.6}}>
              <div style={{fontWeight:600,color:C.green,marginBottom:3}}>Skjer automatisk:</div>
              <div>✓ Supabase-bruker med rolle: <strong>{form.role}</strong></div>
              <div>✓ Google Workspace @eiranova.no opprettes</div>
              <div>✓ Midlertidig passord sendes på e-post</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setModal(null)} style={{flex:1,padding:11,background:C.softBg,color:C.soft,border:"none",borderRadius:10,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Avbryt</button>
              <button onClick={create} className="btn bp" style={{flex:2,padding:11,borderRadius:10,fontSize:12}}>Opprett + Workspace</button>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Modal: Gi B2B-tilgang — 4-stegs sikkerhetsflyt */}
      {b2bModal&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.5)",padding:20}}>
          <div style={{background:"white",borderRadius:18,padding:"20px 18px 30px",width:"100%",maxWidth:500,maxHeight:"88vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <div className="fr" style={{fontSize:16,fontWeight:600,color:C.navy}}>Gi B2B-tilgang</div>
                <div style={{fontSize:10,color:C.soft}}>{b2bModal.kundeName}</div>
              </div>
              <button onClick={()=>setB2bModal(null)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.soft}}>✕</button>
            </div>

            {/* Steg-indikator */}
            <div style={{display:"flex",gap:0,marginBottom:18,position:"relative"}}>
              <div style={{position:"absolute",top:14,left:"10%",right:"10%",height:2,background:C.border,zIndex:0}}/>
              {[["1","Inviter","📧"],["2","Domene","🔒"],["3","Godkjenning","✅"],["4","Aktivering","🎉"]].map(([n,l,icon],i)=>(
                <div key={n} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,position:"relative",zIndex:1}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:i===0?C.green:C.softBg,border:`2px solid ${i===0?C.green:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:i===0?"white":C.soft}}>{icon}</div>
                  <div style={{fontSize:8,color:i===0?C.green:C.soft,textAlign:"center",fontWeight:i===0?600:400}}>{l}</div>
                </div>
              ))}
            </div>

            {/* Steg 1: Inviter spesifikk e-post */}
            <div style={{background:"#F0FFF4",border:"1px solid #86EFAC",borderRadius:10,padding:"12px 13px",marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:"#15803D",marginBottom:2}}>Steg 1 — Inviter koordinator</div>
              <div style={{fontSize:9,color:"#166534",marginBottom:10,lineHeight:1.5}}>Kun denne spesifikke e-postadressen kan aktivere kontoen. Invitasjonen er personlig og utløper etter 7 dager.</div>
              <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>E-postadresse til koordinator</label>
              <div style={{display:"flex",gap:6}}>
                <input className="inp" placeholder={"koordinator@"+b2bModal.kundeName.toLowerCase().replace(/ /g,"")+".no"} value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} style={{flex:1}}/>
                <button onClick={()=>sendInvite(b2bModal.id)} className="btn bp" style={{padding:"8px 14px",fontSize:11,flexShrink:0}}>Send</button>
              </div>
            </div>

            {/* Steg 2: Domene */}
            <div style={{background:C.softBg,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 13px",marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:C.navy,marginBottom:2}}>Steg 2 — Hvitelist domene (valgfritt)</div>
              <div style={{fontSize:9,color:C.soft,marginBottom:10,lineHeight:1.5}}>Bekrefter at e-postadressen tilhører riktig organisasjon. Domenet alene gir <strong>ikke</strong> tilgang — individuell invitasjon kreves alltid.</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                {b2bModal.hvitelisteDomener.map(d=>(
                  <span key={d} style={{fontSize:9,background:C.greenBg,color:C.green,padding:"3px 9px",borderRadius:50,fontWeight:600}}>✓ @{d}</span>
                ))}
              </div>
              <div style={{display:"flex",gap:6}}>
                <input className="inp" placeholder="moss.kommune.no" value={inviteDomene} onChange={e=>setInviteDomene(e.target.value)} style={{flex:1}}/>
                <button onClick={()=>addDomene(b2bModal.id)} className="btn" style={{padding:"8px 12px",fontSize:11,background:C.greenBg,color:C.green,flexShrink:0}}>Legg til</button>
              </div>
            </div>

            {/* Steg 3: Kontaktperson godkjenner */}
            <div style={{background:"#EFF6FF",border:"1px solid #BAD7FB",borderRadius:10,padding:"12px 13px",marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:C.sky,marginBottom:2}}>Steg 3 — Kontaktperson godkjenner</div>
              <div style={{fontSize:9,color:"#1D4ED8",marginBottom:8,lineHeight:1.5}}>Når du sender invitasjonen, mottar {b2bModal.kontaktperson.name} ({b2bModal.kontaktperson.email}) automatisk en e-post: <em>"Godkjenner du at [navn] får koordinatortilgang?"</em></div>
              <div style={{display:"flex",alignItems:"center",gap:7,background:"white",borderRadius:7,padding:"7px 10px"}}>
                <span style={{fontSize:14}}>👤</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{b2bModal.kontaktperson.name}</div>
                  <div style={{fontSize:9,color:C.soft,fontFamily:"monospace"}}>{b2bModal.kontaktperson.email}</div>
                </div>
                {b2bModal.kontaktperson.godkjentAv
                  ?<span style={{fontSize:9,color:"#16A34A",fontWeight:600}}>✓ Bekreftet kontaktperson</span>
                  :<span style={{fontSize:9,color:C.goldDark}}>⚠ Ikke bekreftet ennå</span>}
              </div>
            </div>

            {/* Steg 4: Info om aktivering */}
            <div style={{background:"#F5F3FF",border:"1px solid #C4B5FD",borderRadius:10,padding:"12px 13px",marginBottom:18}}>
              <div style={{fontSize:11,fontWeight:700,color:"#6D28D9",marginBottom:2}}>Steg 4 — Bruker aktiverer konto</div>
              <div style={{fontSize:9,color:"#5B21B6",lineHeight:1.55}}>Koordinatoren klikker lenken i invitasjonse-posten og setter passord (eller logger inn med Google Workspace). Tilgangen aktiveres automatisk — ingen manuell handling fra EiraNova.</div>
            </div>

            <button onClick={()=>setB2bModal(null)} className="btn bp bf" style={{borderRadius:11}}>Lukk</button>
          </div>
        </ModalPortal>
      )}

      {/* Modal: Revisjonsspor */}
      {revisjonModal&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.45)",padding:16}}>
          <div style={{background:"white",borderRadius:16,padding:20,width:"100%",maxWidth:400,boxShadow:"0 8px 40px rgba(0,0,0,.2)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div>
                <div className="fr" style={{fontSize:15,fontWeight:600,color:C.navy}}>Revisjonsspor</div>
                <div style={{fontSize:10,color:C.soft}}>{revisjonModal.name}</div>
              </div>
              <button onClick={()=>setRevisjonModal(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.soft}}>✕</button>
            </div>
            <div style={{background:C.softBg,borderRadius:9,padding:"4px 0",marginBottom:14}}>
              {(revisjonModal.revisjon||[]).map((r,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"9px 12px",borderBottom:i<(revisjonModal.revisjon.length-1)?`1px solid ${C.border}`:"none"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:0}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:C.green,flexShrink:0,marginTop:3}}/>
                    {i<revisjonModal.revisjon.length-1&&<div style={{width:1.5,flex:1,background:C.border,marginTop:2}}/>}
                  </div>
                  <div style={{flex:1,paddingBottom:i<revisjonModal.revisjon.length-1?6:0}}>
                    <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{r.handling}</div>
                    <div style={{fontSize:9,color:C.soft}}>{r.dato} · Av: {r.av}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{fontSize:9,color:C.soft,lineHeight:1.5,marginBottom:12}}>
              Dette revisjonslogg lagres i Supabase og kan ikke slettes. GDPR-dokumentasjon for tilgangsstyring.
            </div>
            <button onClick={()=>setRevisjonModal(null)} className="btn bp bf" style={{borderRadius:10}}>Lukk</button>
          </div>
        </ModalPortal>
      )}


      {/* Modal: Slett intern ansatt */}
      {del&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.45)",padding:16}}>
          <div style={{background:"white",borderRadius:16,padding:22,width:"100%",maxWidth:380,boxShadow:"0 8px 40px rgba(0,0,0,.2)"}}>
            <div style={{fontSize:30,textAlign:"center",marginBottom:10}}>⚠️</div>
            <div className="fr" style={{fontSize:15,fontWeight:600,color:C.navy,textAlign:"center",marginBottom:7}}>Fjern ansatt?</div>
            <div style={{fontSize:11,color:C.soft,textAlign:"center",lineHeight:1.6,marginBottom:14}}><strong>{del.name}</strong> fjernes fra Supabase og Google Workspace @eiranova.no.</div>
            <div style={{background:C.dangerBg,borderRadius:9,padding:"9px 12px",marginBottom:14,fontSize:10,color:C.danger,lineHeight:1.7}}>
              <div>✗ Mister tilgang umiddelbart</div>
              <div>✗ @eiranova.no Workspace-konto slettes</div>
              <div>✗ Aktive oppdrag må overføres manuelt</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setDel(null)} style={{flex:1,padding:11,background:C.softBg,color:C.soft,border:"none",borderRadius:10,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Avbryt</button>
              <button onClick={()=>remove(del)} style={{flex:1,padding:11,background:C.danger,color:"white",border:"none",borderRadius:10,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Ja, fjern</button>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}

function ADrawer({type,onClose}){
  if(!type)return null;
  const fields=type==="b2b"
    ?[["Organisasjonsnummer","922456789"],["Firmanavn","Automatisk utfylt"],["Kundetype","Kommune / Borettslag / Bedrift"],["Kontakt e-post","faktura@bedrift.no"],["Betalingsfrist","14 / 30 dager"]]
    :[["Pasient","Søk eller velg kunde..."],["Tjeneste","Velg tjeneste..."],["Dato","Velg dato..."],["Sykepleier","Tildel (valgfritt)"]];
  return(
    <ModalPortal overlayStyle={{background:"rgba(0,0,0,.42)",padding:20}}>
      <div style={{background:"white",borderRadius:16,padding:"18px 18px 28px",width:"100%",maxWidth:540,maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <span className="fr" style={{fontSize:16,fontWeight:600,color:C.navy}}>{type==="b2b"?"Legg til B2B-kunde":"Nytt oppdrag"}</span>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.soft}}>✕</button>
        </div>
        {fields.map(([label,ph])=>(
          <div key={label} style={{marginBottom:10}}><label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>{label}</label><input className="inp" placeholder={ph}/></div>
        ))}
        {type==="b2b"&&<div style={{marginBottom:12,background:C.greenBg,borderRadius:8,padding:"9px 12px",fontSize:11,color:C.greenDark}}>✓ Registrert i ELMA — EHF-faktura sendes automatisk via PEPPOL</div>}
        <button onClick={onClose} className="btn bp bf" style={{borderRadius:10}}>{type==="b2b"?"Legg til kunde":"Opprett oppdrag"}</button>
      </div>
    </ModalPortal>
  );
}


/* ═══════════════════════════════════════════════════════════════
   B2B DATA
   ═══════════════════════════════════════════════════════════════ */
const B2B_COORD_BRUKERE=[
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

const PAKKER=[
  {id:"ringetilsyn",navn:"Ringetilsyn",ikon:"📞",beskrivelse:"Daglige påminnelser og tilsynssamtaler",pris:190,frekvens:"per gang"},
  {id:"praktisk",navn:"Praktisk bistand",ikon:"🏠",beskrivelse:"Rengjøring, matlaging og handling",pris:390,frekvens:"per gang"},
  {id:"morgensstell",navn:"Morgensstell",ikon:"🚿",beskrivelse:"Fullstendig morgenstell og dusj",pris:490,frekvens:"per gang"},
  {id:"besok",navn:"Besøksvenn",ikon:"☕",beskrivelse:"Samtale, selskap og tur",pris:320,frekvens:"per gang"},
  {id:"ukespakke_basis",navn:"Ukespakke Basis",ikon:"📋",beskrivelse:"3x ringetilsyn + 2x praktisk per uke",pris:1470,frekvens:"per mnd"},
  {id:"ukespakke_pluss",navn:"Ukespakke Pluss",ikon:"⭐",beskrivelse:"5x morgensstell + 3x praktisk per uke",pris:2850,frekvens:"per mnd"},
];

/* ═══════════════════════════════════════════════════════════════
   B2B KOORDINATOR-PORTAL
   ═══════════════════════════════════════════════════════════════ */
function B2BOnboarding({onNav}){
  const org=B2B_C[0];
  const avtaleLabel=org.prismodell==="rammeavtale"?"Rammeavtale":"Per bestilling";
  const[steg,setSteg]=useState(0);
  const[fulltNavn,setFulltNavn]=useState("Bjørn Haugen");
  const[telefon,setTelefon]=useState("");
  const[fakturaAdr,setFakturaAdr]=useState("Postmottak helse og omsorg\n1501 Moss");
  const[ehfPå,setEhfPå]=useState(org.type==="kommune");
  const[forsteBrukerNavn,setForsteBrukerNavn]=useState("");
  const[forsteBrukerEpost,setForsteBrukerEpost]=useState("");
  const totalSteg=3;
  const kanSendeForsteBruker=forsteBrukerNavn.trim().length>0&&erGyldigEpost(forsteBrukerEpost);
  const progressW=`${Math.round((steg/Math.max(totalSteg-1,1))*100)}%`;
  const fullfør=(dest)=>onNav(dest,undefined,{b2bOnboardingDone:true});

  return(
    <div className="phone fu" style={{background:C.cream}}>
      <div style={{height:3,background:C.border,flexShrink:0}}>
        <div style={{height:"100%",background:C.green,width:progressW,transition:"width .4s ease"}}/>
      </div>
      <div style={{padding:"16px 20px 0",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:540,margin:"0 auto",width:"100%"}}>
        <span style={{fontSize:10,color:C.soft}}>{steg+1} av {totalSteg}</span>
        {steg<totalSteg-1&&(
          <button type="button" onClick={()=>fullfør("b2b-dashboard")} style={{fontSize:10,color:C.soft,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Hopp over</button>
        )}
      </div>
      <div className="sa" style={{padding:"20px 22px",maxWidth:540,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
        {steg===0&&(
          <>
            <div className="fr" style={{fontSize:20,fontWeight:700,color:C.navy,marginBottom:8}}>Velkommen, {fulltNavn.split(" ")[0]}! 🏢</div>
            <div style={{background:"white",borderRadius:13,padding:"14px 16px",border:`1.5px solid ${C.border}`,marginBottom:14,fontSize:12,color:C.navy}}>
              <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}><span style={{color:C.soft}}>Organisasjon</span><span style={{fontWeight:600}}>{org.name}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}><span style={{color:C.soft}}>Org.nr.</span><span style={{fontWeight:600}}>{org.org}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{color:C.soft}}>Avtale</span><span style={{fontWeight:600}}>{avtaleLabel}</span></div>
            </div>
            <div style={{fontSize:11,color:C.soft,lineHeight:1.65,marginBottom:8}}>
              Din rammeavtale med EiraNova er aktiv. La oss sette opp koordinatorkontoen.
            </div>
          </>
        )}
        {steg===1&&(
          <>
            <div className="fr" style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:6}}>Kontaktinformasjon</div>
            <div style={{fontSize:11,color:C.soft,marginBottom:14,lineHeight:1.6}}>Disse opplysningene brukes av EiraNova ved behov for avklaring og på faktura.</div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Fullt navn</label>
              <input className="inp" value={fulltNavn} onChange={e=>setFulltNavn(e.target.value)} placeholder="Fornavn Etternavn"/>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Direkte telefon</label>
              <input className="inp" value={telefon} onChange={e=>setTelefon(e.target.value)} placeholder="415 00 000"/>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Fakturaadresse</label>
              <textarea className="inp" value={fakturaAdr} onChange={e=>setFakturaAdr(e.target.value)} rows={3} style={{resize:"vertical",minHeight:72}}/>
            </div>
            <div style={{background:"white",borderRadius:13,padding:"12px 14px",border:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:C.navy}}>EHF-aktivert</div>
                <div style={{fontSize:9,color:C.soft,marginTop:2,lineHeight:1.45}}>Fakturaer sendes via PEPPOL til kommunens fakturasystem</div>
              </div>
              <button type="button" className="settings-toggle" onClick={()=>setEhfPå(v=>!v)} aria-pressed={ehfPå} style={{position:"relative",background:ehfPå?C.green:"#D1D5DB",flexShrink:0}}>
                <span style={{position:"absolute",top:4,left:ehfPå?26:4,width:22,height:22,borderRadius:"50%",background:"white",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)",pointerEvents:"none"}}/>
              </button>
            </div>
          </>
        )}
        {steg===2&&(
          <>
            <div className="fr" style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:8}}>Dine brukere</div>
            <div style={{fontSize:12,color:C.soft,lineHeight:1.65,marginBottom:16}}>
              Du kan nå legge til brukere som skal motta tjenester fra EiraNova.
            </div>
            <div style={{background:"white",borderRadius:13,padding:"14px 16px",border:`1.5px solid ${C.border}`}}>
              <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:12}}>Første bruker</div>
              <div style={{marginBottom:12}}>
                <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Fullt navn</label>
                <input className="inp" value={forsteBrukerNavn} onChange={e=>setForsteBrukerNavn(e.target.value)} placeholder="Ola Nordmann" autoComplete="name"/>
              </div>
              <div>
                <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>E-post</label>
                <input className="inp" type="email" value={forsteBrukerEpost} onChange={e=>setForsteBrukerEpost(e.target.value)} placeholder="ola@eksempel.no" autoComplete="email"/>
              </div>
            </div>
            <div style={{marginTop:12,fontSize:10,color:C.soft,lineHeight:1.55}}>
              Brukeren får invitasjon på e-post for å aktivere kontoen og kan deretter motta bestillinger.
            </div>
          </>
        )}
      </div>
      <div style={{padding:"16px 22px 24px",flexShrink:0,maxWidth:540,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
        {steg===0&&(
          <button type="button" onClick={()=>setSteg(1)} className="btn bp" style={{width:"100%",padding:"14px 0",fontSize:14,borderRadius:13}}>Kom i gang →</button>
        )}
        {steg===1&&(
          <button type="button" onClick={()=>telefon.trim()&&setSteg(2)} className="btn bp" style={{width:"100%",padding:"14px 0",fontSize:14,borderRadius:13,opacity:telefon.trim()?1:.4}}>Neste →</button>
        )}
        {steg===2&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button type="button" onClick={()=>kanSendeForsteBruker&&fullfør("b2b-bestill")} className="btn bp" style={{width:"100%",padding:"14px 0",fontSize:14,borderRadius:13,opacity:kanSendeForsteBruker?1:.4}}>Legg til første bruker nå →</button>
            <button type="button" onClick={()=>fullfør("b2b-dashboard")} className="btn" style={{width:"100%",padding:"14px 0",fontSize:14,borderRadius:13,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Gjør dette senere →</button>
          </div>
        )}
      </div>
    </div>
  );
}

function B2BBrukerAktivering({onNav}){
  const orgNavn=B2B_C[0].name;
  const[steg,setSteg]=useState(0);
  const[fulltNavn,setFulltNavn]=useState("");
  const[fdato,setFdato]=useState("");
  const[pin,setPin]=useState("");
  const[pinBek,setPinBek]=useState("");
  const[feil,setFeil]=useState({fn:"",fd:"",pin:""});

  const validerOgAktiver=()=>{
    const e={fn:"",fd:"",pin:""};
    if(!fulltNavn.trim())e.fn="Fullt navn er påkrevd.";
    if(!/^\d{2}\.\d{2}\.\d{4}$/.test(fdato.trim()))e.fd="Fødselsdato må være DD.MM.ÅÅÅÅ.";
    if(!/^\d{4}$/.test(pin))e.pin="PIN må være nøyaktig 4 siffer.";
    else if(pin!==pinBek)e.pin="PIN og bekreft PIN er ikke like.";
    setFeil(e);
    if(e.fn||e.fd||e.pin)return;
    setSteg(1);
  };

  if(steg===1)return(
    <div className="phone fu" style={{background:C.cream}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 28px",textAlign:"center",maxWidth:540,margin:"0 auto",width:"100%"}}>
        <div style={{fontSize:52,marginBottom:12}}>✅</div>
        <div className="fr" style={{fontSize:20,fontWeight:700,color:C.navy,marginBottom:8}}>Konto aktivert!</div>
        <div style={{fontSize:13,color:C.navy,fontWeight:600,marginBottom:10}}>{fulltNavn.trim()}</div>
        <div style={{fontSize:12,color:C.soft,lineHeight:1.65,marginBottom:24,maxWidth:400}}>
          Du er koblet til <strong style={{color:C.navy}}>{orgNavn}</strong>. Din koordinator vil nå sette opp tjenester for deg.
        </div>
        <button type="button" onClick={()=>onNav("b2b-bruker")} className="btn bp" style={{width:"100%",maxWidth:400,padding:"14px 0",fontSize:14,borderRadius:13}}>Gå til min oversikt →</button>
      </div>
    </div>
  );

  return(
    <div className="phone fu" style={{background:C.cream}}>
      <div style={{padding:"22px 20px 18px",background:`linear-gradient(160deg,#1A2E24,#2C5C52)`,flexShrink:0}}>
        <button type="button" onClick={()=>onNav("login")} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>← Tilbake</button>
        <div className="fr" style={{fontSize:18,fontWeight:600,color:"white",marginBottom:4}}>Aktiver din konto</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,.65)",lineHeight:1.5}}>Du har mottatt en invitasjon fra {orgNavn}.</div>
      </div>
      <div style={{padding:"16px 20px 0",display:"flex",justifyContent:"flex-end",maxWidth:540,margin:"0 auto",width:"100%"}}>
        <button type="button" onClick={()=>onNav("b2b-bruker")} style={{fontSize:10,color:C.soft,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Hopp over</button>
      </div>
      <div className="sa" style={{padding:"12px 22px 24px",maxWidth:540,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
        <div style={{marginBottom:12}}>
          <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Fullt navn</label>
          <input className="inp" value={fulltNavn} onChange={e=>{setFulltNavn(e.target.value);if(feil.fn)setFeil(f=>({...f,fn:""}));}} placeholder="Ola Nordmann"/>
          {feil.fn&&<div style={{fontSize:11,color:C.danger,marginTop:6}}>{feil.fn}</div>}
        </div>
        <div style={{marginBottom:12}}>
          <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Fødselsdato</label>
          <input className="inp" value={fdato} onChange={e=>{setFdato(e.target.value);if(feil.fd)setFeil(f=>({...f,fd:""}));}} placeholder="DD.MM.ÅÅÅÅ" inputMode="numeric"/>
          {feil.fd&&<div style={{fontSize:11,color:C.danger,marginTop:6}}>{feil.fd}</div>}
        </div>
        <div style={{marginBottom:12}}>
          <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Ny PIN (4 siffer)</label>
          <input className="inp" type="password" inputMode="numeric" value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,"").slice(0,4))}/>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Bekreft PIN</label>
          <input className="inp" type="password" inputMode="numeric" value={pinBek} onChange={e=>{setPinBek(e.target.value.replace(/\D/g,"").slice(0,4));if(feil.pin)setFeil(f=>({...f,pin:""}));}}/>
          {feil.pin&&<div style={{fontSize:11,color:C.danger,marginTop:6}}>{feil.pin}</div>}
        </div>
        <button type="button" onClick={validerOgAktiver} className="btn bp" style={{width:"100%",padding:"14px 0",fontSize:14,borderRadius:13}}>Aktiver konto →</button>
      </div>
    </div>
  );
}

function B2BLogin({onNav}){
  // B2B-innlogging skjer nå via Kunde-app → Login → Bedriftskunde
  // Denne komponenten er beholdt for bakoverkompatibilitet men ruter direkte videre
  useEffect(()=>{ onNav("login"); },[]);
  return null;
}


function B2BDashboard({onNav}){
  const totalMnd=B2B_COORD_BRUKERE.filter(b=>b.aktiv).reduce((s,b)=>s+b.mnd_pris,0);
  return(
    <div className="phone fu">
      <div style={{padding:"14px 14px 18px",background:`linear-gradient(160deg,#1A2E24,#2C5C52)`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div>
            <div className="fr" style={{fontSize:16,fontWeight:600,color:"white"}}>Moss Kommune</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>Koordinatorpanel · Rammeavtale</div>
          </div>
          <div style={{width:34,height:34,borderRadius:9,background:"#1A73E8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"white"}}>MK</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[[`${B2B_COORD_BRUKERE.filter(b=>b.aktiv).length}`,"Aktive brukere"],[`${totalMnd.toLocaleString("nb-NO")} kr`,"Mnd. kostnad"],["EHF","Fakturering"]].map(([v,l])=>(
            <div key={l} style={{flex:1,background:"rgba(255,255,255,.12)",borderRadius:9,padding:"7px 9px",textAlign:"center"}}>
              <div className="fr" style={{fontSize:14,fontWeight:600,color:"white"}}>{v}</div>
              <div style={{fontSize:8,color:"rgba(255,255,255,.6)"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sa" style={{padding:13}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>Dine brukere</div>
          <button onClick={()=>onNav("b2b-bestill")} className="btn bp" style={{fontSize:10,padding:"6px 12px"}}>+ Legg til bruker</button>
        </div>

        {B2B_COORD_BRUKERE.map(b=>(
          <div key={b.id} onClick={()=>onNav("b2b-bruker-detalj")} className="card" style={{marginBottom:8,cursor:"pointer",opacity:b.aktiv?1:.55}}>
            <div style={{padding:"11px 13px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:b.aktiv?C.greenDark:C.soft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white",flexShrink:0}}>
                {b.name.split(" ").map(p=>p[0]).join("").slice(0,2)}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                  <span style={{fontSize:12,fontWeight:600,color:C.navy}}>{b.name}</span>
                  {!b.aktiv&&<span style={{fontSize:8,background:C.softBg,color:C.soft,padding:"1px 6px",borderRadius:50}}>Inaktiv</span>}
                  {!b.digitalt&&<span style={{fontSize:8,background:C.goldBg,color:C.goldDark,padding:"1px 6px",borderRadius:50}}>Koordinator bestiller</span>}
                </div>
                <div style={{fontSize:9,color:C.soft,marginBottom:4}}>{b.adresse} · f. {b.dob}</div>
                <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                  {b.ukeplan.slice(0,3).map((u,i)=>(
                    <span key={i} style={{fontSize:8,background:C.greenXL,color:C.green,padding:"1px 6px",borderRadius:4,border:`0.5px solid ${C.border}`}}>{u.dag} {u.tjeneste.split(" ")[0]}</span>
                  ))}
                  {b.ukeplan.length>3&&<span style={{fontSize:8,color:C.soft}}>+{b.ukeplan.length-3}</span>}
                </div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{b.mnd_pris.toLocaleString("nb-NO")} kr</div>
                <div style={{fontSize:8,color:C.soft}}>per mnd</div>
              </div>
            </div>
          </div>
        ))}

        {/* Hurtigbestilling */}
        <div style={{marginTop:6,background:C.greenXL,borderRadius:12,padding:"12px 13px",border:`1px solid ${C.border}`}}>
          <div className="fr" style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:6}}>Hurtigbestilling</div>
          <div style={{fontSize:10,color:C.soft,marginBottom:10}}>Bestill ekstra tjeneste for en bruker nå</div>
          <button onClick={()=>onNav("b2b-bestill")} className="btn bp" style={{width:"100%",padding:"9px 0",fontSize:11,borderRadius:9}}>Bestill på vegne av bruker →</button>
        </div>
      </div>

      <nav className="bnav">
        {[{icon:"🏠",label:"Hjem"},{icon:"📋",label:"Oppdrag"},{icon:"🧾",label:"Faktura"},{icon:"👤",label:"Konto"}].map((it,i)=>(
          <button key={i} className="bi"><span style={{fontSize:20}}>{it.icon}</span><span style={{fontSize:9,fontWeight:i===0?600:400,color:i===0?C.green:C.soft}}>{it.label}</span></button>
        ))}
      </nav>
    </div>
  );
}

function B2BBestill({onNav}){
  const[valgtBruker,setValgtBruker]=useState(null);
  const[valgtPakke,setValgtPakke]=useState(null);
  const[step,setStep]=useState(1);

  if(step===3)return(
    <div className="phone fu">
      <PH title="Bekreft bestilling" onBack={()=>setStep(2)} backLabel="Velg tjeneste" centerTitle/>
      <div className="sa" style={{padding:14}}>
        <div style={{textAlign:"center",padding:"20px 0 16px"}}>
          <div style={{fontSize:48,marginBottom:10}}>✅</div>
          <div className="fr" style={{fontSize:18,fontWeight:600,color:C.navy,marginBottom:6}}>Bestilling registrert!</div>
          <div style={{fontSize:11,color:C.soft,lineHeight:1.6}}>Faktura legges til neste månedlige samlefaktura til Moss Kommune via EHF/PEPPOL.</div>
        </div>
        <div className="card cp" style={{marginBottom:14}}>
          {[["Bruker",valgtBruker?.name||"—"],["Tjeneste",valgtPakke?.navn||"—"],["Pris",valgtPakke?`${valgtPakke.pris.toLocaleString("nb-NO")} kr ${valgtPakke.frekvens}`:"—"],["Faktura","Samlefaktura · EHF/PEPPOL"],["Betalingsfrist","30 dager (kommune)"]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:11}}>
              <span style={{color:C.soft}}>{l}</span><span style={{fontWeight:600,color:C.navy}}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={()=>onNav("b2b-dashboard")} className="btn bp bf" style={{borderRadius:11}}>Tilbake til oversikt</button>
      </div>
    </div>
  );

  if(step===2)return(
    <div className="phone fu">
      <PH title={`Velg tjeneste — ${valgtBruker?.name}`} onBack={()=>setStep(1)} backLabel="Velg bruker" centerTitle/>
      <div className="sa" style={{padding:13}}>
        <div style={{background:C.greenXL,borderRadius:9,padding:"9px 12px",marginBottom:12,border:`1px solid ${C.border}`,fontSize:10,color:C.navyMid}}>
          Priser er basert på <strong>rammeavtalen</strong> med Moss Kommune
        </div>
        <div className="fr" style={{fontSize:11,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Enkeltbestilling</div>
        {PAKKER.filter(p=>!p.id.includes("ukespakke")).map(p=>(
          <div key={p.id} onClick={()=>setValgtPakke(p)} className="card" style={{padding:"11px 13px",marginBottom:7,cursor:"pointer",border:`2px solid ${valgtPakke?.id===p.id?C.green:C.border}`,background:valgtPakke?.id===p.id?C.greenBg:"white"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:9,background:C.greenXL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{p.ikon}</div>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.navy}}>{p.navn}</div><div style={{fontSize:9,color:C.soft}}>{p.beskrivelse}</div></div>
              <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:12,fontWeight:700,color:C.sky}}>{p.pris} kr</div><div style={{fontSize:8,color:C.soft}}>{p.frekvens}</div></div>
            </div>
          </div>
        ))}
        <div className="fr" style={{fontSize:11,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:1,marginBottom:8,marginTop:4}}>Fast ukespakke</div>
        {PAKKER.filter(p=>p.id.includes("ukespakke")).map(p=>(
          <div key={p.id} onClick={()=>setValgtPakke(p)} className="card" style={{padding:"11px 13px",marginBottom:7,cursor:"pointer",border:`2px solid ${valgtPakke?.id===p.id?C.green:C.border}`,background:valgtPakke?.id===p.id?C.greenBg:"white"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:9,background:valgtPakke?.id===p.id?C.green:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{p.ikon}</div>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.navy}}>{p.navn}</div><div style={{fontSize:9,color:C.soft}}>{p.beskrivelse}</div></div>
              <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:12,fontWeight:700,color:"#6D28D9"}}>{p.pris.toLocaleString("nb-NO")} kr</div><div style={{fontSize:8,color:C.soft}}>{p.frekvens}</div></div>
            </div>
          </div>
        ))}
        <button onClick={()=>valgtPakke&&setStep(3)} className="btn bf" style={{borderRadius:11,background:valgtPakke?C.green:C.border,color:"white",marginTop:4}}>
          {valgtPakke?`Bestill ${valgtPakke.navn} →`:"Velg en tjeneste"}
        </button>
      </div>
    </div>
  );

  return(
    <div className="phone fu">
      <PH title="Bestill på vegne av bruker" onBack={()=>onNav("b2b-dashboard")} backLabel="Dashboard" centerTitle/>
      <div className="sa" style={{padding:13}}>
        <div style={{fontSize:10,color:C.soft,marginBottom:10,lineHeight:1.5}}>Velg hvilken bruker du vil bestille for. Fakturaen legges automatisk til kommunens samlefaktura.</div>
        {B2B_COORD_BRUKERE.filter(b=>b.aktiv).map(b=>(
          <div key={b.id} onClick={()=>{setValgtBruker(b);setStep(2);}} className="card" style={{padding:"12px 13px",marginBottom:8,cursor:"pointer",border:`2px solid ${valgtBruker?.id===b.id?C.green:C.border}`,background:valgtBruker?.id===b.id?C.greenBg:"white"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:C.greenDark,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"white",flexShrink:0}}>
                {b.name.split(" ").map(p=>p[0]).join("").slice(0,2)}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:2}}>{b.name}</div>
                <div style={{fontSize:9,color:C.soft,marginBottom:4}}>{b.adresse} · f. {b.dob}</div>
                <div style={{fontSize:9,color:C.green,fontWeight:500}}>Aktiv · {b.mnd_pris.toLocaleString("nb-NO")} kr/mnd</div>
              </div>
              {!b.digitalt&&<span style={{fontSize:8,background:C.goldBg,color:C.goldDark,padding:"2px 7px",borderRadius:50,fontWeight:600,flexShrink:0}}>Trenger koordinator</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   B2B BRUKER-APP (forenklet — for digitale pasienter)
   ═══════════════════════════════════════════════════════════════ */
function B2BBruker({onNav}){
  const bruker=B2B_COORD_BRUKERE[0]; // Astrid
  const[ekstraModal,setEkstraModal]=useState(false);
  return(
    <div className="phone fu">
      {/* Header */}
      <div style={{padding:"16px 14px 20px",background:`linear-gradient(160deg,#1A2E24,#2C5C52)`,flexShrink:0}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,.5)",marginBottom:2}}>Moss Kommune · Din pleieplan</div>
        <div className="fr" style={{fontSize:19,fontWeight:600,color:"white",marginBottom:6}}>God dag, Astrid! 👋</div>
        <div style={{background:"rgba(255,255,255,.12)",borderRadius:10,padding:"9px 12px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:C.sidebarAccent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white",flexShrink:0}}>SL</div>
          <div>
            <div style={{fontSize:11,fontWeight:600,color:"white"}}>Sara Lindgren er din faste sykepleier</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,.6)"}}>Neste besøk: I morgen kl. 08:00</div>
          </div>
        </div>
      </div>

      <div className="sa" style={{padding:13}}>
        {/* Ukesplan */}
        <div className="fr" style={{fontSize:14,fontWeight:600,color:C.navy,marginBottom:9}}>Din ukesplan</div>
        <div className="card" style={{marginBottom:12}}>
          {bruker.ukeplan.map((u,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 13px",borderBottom:i<bruker.ukeplan.length-1?`1px solid ${C.border}`:"none"}}>
              <div style={{width:32,textAlign:"center",flexShrink:0}}>
                <div style={{fontSize:9,fontWeight:700,color:C.soft,textTransform:"uppercase"}}>{u.dag}</div>
              </div>
              <div style={{width:1,height:28,background:C.border}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{u.tjeneste}</div>
                <div style={{fontSize:9,color:C.soft}}>{u.tid} · {u.sykepleier}</div>
              </div>
              <Bdg status={u.status}/>
            </div>
          ))}
        </div>

        {/* Pakke-info */}
        <div style={{background:C.greenXL,borderRadius:12,padding:"12px 13px",border:`1px solid ${C.border}`,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
            <div className="fr" style={{fontSize:12,fontWeight:600,color:C.navy}}>Din pakke</div>
            <span style={{fontSize:9,background:C.greenBg,color:C.green,padding:"2px 8px",borderRadius:50,fontWeight:600}}>Ukespakke Pluss</span>
          </div>
          <div style={{fontSize:10,color:C.soft,lineHeight:1.55}}>5x morgensstell + 3x praktisk bistand per uke. Betales av Moss Kommune.</div>
          <div style={{marginTop:8,fontSize:10,color:C.navyMid,fontWeight:500}}>💡 Du kan legge til ekstratjenester når du trenger det</div>
        </div>

        {/* Ekstrabestilling */}
        <button onClick={()=>setEkstraModal(true)} className="btn bp" style={{width:"100%",padding:"11px 0",fontSize:12,borderRadius:11,marginBottom:8}}>
          + Bestill ekstra tjeneste
        </button>
        <button onClick={()=>onNav("chat-kunde")} className="btn" style={{width:"100%",padding:"11px 0",fontSize:12,borderRadius:11,background:"white",color:C.green,border:`1.5px solid ${C.border}`}}>
          <span>💬</span> Send melding til Sara
        </button>
      </div>

      {/* Ekstra-modal */}
      {ekstraModal&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.45)",padding:20}}>
          <div style={{background:"white",borderRadius:16,padding:"18px 16px 28px",width:"100%",maxWidth:420,maxHeight:"75vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span className="fr" style={{fontSize:15,fontWeight:600,color:C.navy}}>Ekstra tjeneste</span>
              <button onClick={()=>setEkstraModal(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.soft}}>✕</button>
            </div>
            <div style={{fontSize:10,color:C.soft,marginBottom:12,lineHeight:1.5}}>Ekstrabestillinger faktureres til Moss Kommune på neste samlefaktura.</div>
            {PAKKER.filter(p=>!p.id.includes("ukespakke")).map(p=>(
              <div key={p.id} onClick={()=>setEkstraModal(false)} className="card" style={{padding:"11px 12px",marginBottom:7,cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:8,background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{p.ikon}</div>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.navy}}>{p.navn}</div><div style={{fontSize:9,color:C.soft}}>{p.beskrivelse}</div></div>
                <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:11,fontWeight:700,color:C.sky}}>{p.pris} kr</div></div>
              </div>
            ))}
          </div>
        </ModalPortal>
      )}

      <nav className="bnav">
        {[{icon:"🏠",label:"Hjem"},{icon:"📋",label:"Mine avtaler"},{icon:"💬",label:"Meldinger"},{icon:"👤",label:"Profil"}].map((it,i)=>(
          <button key={i} className="bi"><span style={{fontSize:20}}>{it.icon}</span><span style={{fontSize:9,fontWeight:i===0?600:400,color:i===0?C.green:C.soft}}>{it.label}</span></button>
        ))}
      </nav>
    </div>
  );
}


const ANSATTE_LONN=[
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

const TARIFF_INFO={
  avtale:"NSF / Spekter helseforetak",
  sone:"Sone 1 (Moss/Østfold)",
  agAvgiftSats:14.1,
  otpSats:2.0,
  feriepengeSats:12.0,
  sykeAGDager:16,
  minstelonn:{sykepleier:42000,hjelpepleier:34000},
  tillegg:{helgProsent:45,kveldKr:58,nattKr:88,overtidProsent:50},
};

const LONNKJORINGER=[
  {maaned:"Mars 2026",status:"planlagt",utbetalingsDato:"2026-03-25",totalBrutto:232800,totalNetto:153429,agAvgift:32837,feriepenger:26508},
  {maaned:"Feb 2026", status:"utbetalt",  utbetalingsDato:"2026-02-25",totalBrutto:228400,totalNetto:150744,agAvgift:32205,feriepenger:27408},
  {maaned:"Jan 2026", status:"utbetalt",  utbetalingsDato:"2026-01-25",totalBrutto:215900,totalNetto:142194,agAvgift:30443,feriepenger:25908},
];

function LonnPanel({lonnTab,setLonnTab}){
  const{toast,ToastContainer}=useToast();
  const[valgtAnsatt,setValgtAnsatt]=useState(null);
  const[visDetaljer,setVisDetaljer]=useState(false);
  const totalBrutto=ANSATTE_LONN.reduce((s,a)=>s+a.bruttoLonn,0);
  const totalNetto=ANSATTE_LONN.reduce((s,a)=>s+a.nettoUtbetalt,0);
  const totalAG=ANSATTE_LONN.reduce((s,a)=>s+a.agAvgift,0);
  const totalFerie=ANSATTE_LONN.reduce((s,a)=>s+a.feriepenger,0);
  const lonnKjoring=LONNKJORINGER[0]; // Mars = planlagt

  return(
    <div>
      <ToastContainer/>
      {/* KPI-strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:18}}>
        {[
          {l:"Total bruttolønn",v:`${(totalBrutto/1000).toFixed(1)}k kr`,s:`${ANSATTE_LONN.length} ansatte`,icon:"💼",c:C.navy},
          {l:"Total nettoutbetaling",v:`${(totalNetto/1000).toFixed(1)}k kr`,s:"Til ansattes kontoer",icon:"🏦",c:C.green},
          {l:"Arbeidsgiveravgift",v:`${(totalAG/1000).toFixed(1)}k kr`,s:`${TARIFF_INFO.agAvgiftSats}% av bruttolønn`,icon:"🏛️",c:C.gold},
          {l:"Feriepenger",v:`${(totalFerie/1000).toFixed(1)}k kr`,s:`${TARIFF_INFO.feriepengeSats}% avsatt`,icon:"🌴",c:C.sky},
          {l:"OTP-pensjon",v:`${(ANSATTE_LONN.reduce((s,a)=>s+a.pensjon,0)/1000).toFixed(1)}k kr`,s:`Min ${TARIFF_INFO.otpSats}% av lønn`,icon:"🔐",c:C.navyMid},
        ].map(k=>(
          <div key={k.l} className="card cp">
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.5,lineHeight:1.3}}>{k.l}</span><span>{k.icon}</span></div>
            <div className="fr" style={{fontSize:19,fontWeight:700,color:k.c,marginBottom:2}}>{k.v}</div>
            <div style={{fontSize:9,color:C.soft}}>{k.s}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{display:"flex",background:"white",borderRadius:9,padding:3,marginBottom:16,border:`1px solid ${C.border}`,width:"fit-content"}}>
        {[["oversikt","👥 Ansatte"],["lonnkjoring","▶️ Lønnskjøring"],["skatt","🏛️ Skattetrekk & avgift"],["tariff","📋 Tariff & regler"],["amelding","📤 A-melding"]].map(([t,l])=>(
          <button key={t} onClick={()=>setLonnTab(t)} style={{padding:"6px 14px",borderRadius:7,fontSize:11,fontWeight:lonnTab===t?600:400,cursor:"pointer",border:"none",background:lonnTab===t?C.greenBg:"transparent",color:lonnTab===t?C.green:C.soft,fontFamily:"inherit",whiteSpace:"nowrap"}}>{l}</button>
        ))}
      </div>

      {/* ── OVERSIKT ── */}
      {lonnTab==="oversikt"&&(
        <div>
          {valgtAnsatt&&(
            <ModalPortal overlayStyle={{background:"rgba(0,0,0,.45)",padding:20}}>
              <div style={{background:"white",borderRadius:18,width:"100%",maxWidth:560,maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
                <div style={{padding:"18px 22px",background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,borderRadius:"18px 18px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDark},${C.sidebarAccent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"white"}}>{valgtAnsatt.av}</div>
                    <div>
                      <div style={{fontSize:16,fontWeight:600,color:"white"}}>{valgtAnsatt.navn}</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>{valgtAnsatt.tittel} · {valgtAnsatt.stillingsprosent}%</div>
                    </div>
                  </div>
                  <button onClick={()=>setValgtAnsatt(null)} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16}}>×</button>
                </div>
                <div style={{padding:"20px 22px"}}>
                  {/* Lønnsspesifikasjon */}
                  <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:12}}>Lønnsspesifikasjon — Mars 2026</div>
                  {[
                    {l:"Grunnlønn",v:valgtAnsatt.grunnlonn,type:"inntekt"},
                    {l:"Helgetillegg",v:valgtAnsatt.tilleggHelg,type:"tillegg"},
                    {l:"Kvelstillegg",v:valgtAnsatt.tilleggKveld,type:"tillegg"},
                    {l:"Reisegodtgjørelse",v:valgtAnsatt.reise,type:"tillegg"},
                    {l:"Bruttolønn",v:valgtAnsatt.bruttoLonn,type:"sum"},
                    {l:`Skattetrekk (${valgtAnsatt.trekkProsent}%)`,v:-(valgtAnsatt.bruttoLonn-valgtAnsatt.nettoUtbetalt),type:"trekk"},
                    {l:"Netto utbetalt",v:valgtAnsatt.nettoUtbetalt,type:"netto"},
                  ].map(r=>(
                    <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:`${r.type==="sum"||r.type==="netto"?"9px":"6px"} 0`,borderBottom:`1px solid ${C.border}`,borderTop:r.type==="sum"?`2px solid ${C.border}`:"none"}}>
                      <span style={{fontSize:12,fontWeight:r.type==="sum"||r.type==="netto"?700:400,color:C.navyMid}}>{r.l}</span>
                      <span style={{fontSize:12,fontWeight:r.type==="sum"||r.type==="netto"?700:500,color:r.type==="trekk"?C.danger:r.type==="netto"?C.green:C.navy}}>{r.v>0?"+":""}{r.v.toLocaleString("nb-NO")} kr</span>
                    </div>
                  ))}
                  {/* AG-kostnader */}
                  <div style={{marginTop:16,background:C.goldBg,borderRadius:9,padding:"12px 14px"}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.goldDark,marginBottom:8}}>Arbeidsgiverside (ikke synlig for ansatt)</div>
                    {[
                      {l:"Bruttolønn",v:valgtAnsatt.bruttoLonn},
                      {l:`Arbeidsgiveravgift (${TARIFF_INFO.agAvgiftSats}%)`,v:valgtAnsatt.agAvgift},
                      {l:`Feriepenger avsatt (${TARIFF_INFO.feriepengeSats}%)`,v:valgtAnsatt.feriepenger},
                      {l:`OTP-pensjon (${TARIFF_INFO.otpSats}%)`,v:valgtAnsatt.pensjon},
                    ].map(r=>(
                      <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid rgba(196,149,106,.2)`,fontSize:11}}>
                        <span style={{color:C.goldDark}}>{r.l}</span>
                        <span style={{fontWeight:600,color:C.goldDark}}>{r.v.toLocaleString("nb-NO")} kr</span>
                      </div>
                    ))}
                    <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,fontSize:12,fontWeight:700,color:C.goldDark}}>
                      <span>Total kostnad for EiraNova</span>
                      <span>{(valgtAnsatt.bruttoLonn+valgtAnsatt.agAvgift+valgtAnsatt.feriepenger+valgtAnsatt.pensjon).toLocaleString("nb-NO")} kr</span>
                    </div>
                  </div>
                  <div style={{marginTop:14,display:"flex",gap:8}}>
                    <button onClick={()=>toast("Lønnslipp genereres fra Tripletex")} style={{flex:1,padding:"9px 0",fontSize:12,borderRadius:9,background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>📄 Last ned lønnslipp</button>
                    <button onClick={()=>toast("Lønnsendring registreres i Tripletex","warn")} style={{flex:1,padding:"9px 0",fontSize:12,borderRadius:9,background:"white",color:C.navy,border:`1px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>✏️ Endre lønn</button>
                  </div>
                </div>
              </div>
            </ModalPortal>
          )}
          <div className="card tw">
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>Ansatte — lønnsdetaljer</span>
              <button onClick={()=>toast("Åpner ansatt-registrering — kobles til Tripletex Lønn","warn")} className="btn bp" style={{fontSize:11,padding:"6px 14px"}}>+ Ny ansatt</button>
            </div>
            <table className="tbl">
              <thead><tr><th>Navn</th><th>Stilling</th><th>Prosent</th><th>Grunnlønn</th><th>Brutto</th><th>Netto utbetalt</th><th>AG-kostnad</th><th>Status</th><th></th></tr></thead>
              <tbody>{ANSATTE_LONN.map(a=>(
                <tr key={a.id} style={{cursor:"pointer"}} onClick={()=>setValgtAnsatt(a)}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDark},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white",flexShrink:0}}>{a.av}</div>
                      <div>
                        <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{a.navn}</div>
                        <div style={{fontSize:9,color:C.soft}}>{a.lonnstrinn}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{fontSize:11}}>{a.tittel}</td>
                  <td style={{fontSize:11}}>{a.stillingsprosent}%</td>
                  <td style={{fontSize:11}}>{a.grunnlonn.toLocaleString("nb-NO")} kr</td>
                  <td style={{fontSize:11,fontWeight:600}}>{a.bruttoLonn.toLocaleString("nb-NO")} kr</td>
                  <td style={{fontSize:11,color:C.green,fontWeight:600}}>{a.nettoUtbetalt.toLocaleString("nb-NO")} kr</td>
                  <td style={{fontSize:11,color:C.goldDark}}>{(a.bruttoLonn+a.agAvgift+a.feriepenger+a.pensjon).toLocaleString("nb-NO")} kr</td>
                  <td><span style={{fontSize:9,padding:"2px 8px",borderRadius:50,background:a.sykmeldt?"#FFF3E0":"#F0FDF4",color:a.sykmeldt?"#E65100":"#16A34A",fontWeight:600}}>{a.sykmeldt?"Sykmeldt":"Aktiv"}</span></td>
                  <td><button style={{fontSize:10,padding:"3px 9px",background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit"}} onClick={e=>{e.stopPropagation();setValgtAnsatt(a);}}>Detaljer</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── LØNNSKJØRING ── */}
      {lonnTab==="lonnkjoring"&&(
        <div>
          {/* Neste kjøring */}
          <div className="card" style={{marginBottom:16}}>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
              <div>
                <div className="fr" style={{fontSize:15,fontWeight:600,color:C.navy}}>Mars 2026 — Planlagt kjøring</div>
                <div style={{fontSize:11,color:C.soft}}>Utbetalingsdato: 25. mars 2026</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>toast("PDF-forhåndsvisning genereres fra Tripletex")} style={{fontSize:12,padding:"8px 16px",borderRadius:9,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>📄 Forhåndsvis lønnsslipp</button>
                <button onClick={()=>toast("Lønnskjøring startet — betaling 25. mars","ok")} className="btn bp" style={{fontSize:12,padding:"8px 18px",borderRadius:9}}>▶️ Kjør lønn nå</button>
              </div>
            </div>
            <div style={{padding:"16px 18px"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:16}}>
                {[
                  {l:"Brutto å utbetale",v:`${(lonnKjoring.totalBrutto/1000).toFixed(1)}k kr`},
                  {l:"Netto til ansatte",v:`${(lonnKjoring.totalNetto/1000).toFixed(1)}k kr`},
                  {l:"Skattetrekk",v:`${((lonnKjoring.totalBrutto-lonnKjoring.totalNetto)/1000).toFixed(1)}k kr`},
                  {l:"Arbeidsgiveravgift",v:`${(lonnKjoring.agAvgift/1000).toFixed(1)}k kr`},
                  {l:"Feriepenger avsatt",v:`${(lonnKjoring.feriepenger/1000).toFixed(1)}k kr`},
                ].map(k=>(
                  <div key={k.l} style={{background:C.greenXL,borderRadius:9,padding:"10px 12px",border:`1px solid ${C.border}`}}>
                    <div style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.4,marginBottom:3}}>{k.l}</div>
                    <div className="fr" style={{fontSize:16,fontWeight:700,color:C.navy}}>{k.v}</div>
                  </div>
                ))}
              </div>
              {/* Betalingsplan */}
              <div style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:10}}>Betalingsplan</div>
              {[
                {dato:"25. mars",hva:"Nettoutbetaling til 5 ansatte",belop:`${(lonnKjoring.totalNetto/1000).toFixed(1)}k kr`,fra:"DNB bedriftskonto → private kontoer",ok:false},
                {dato:"28. mars",hva:"Skattetrekk til Skatteetaten",belop:`${((lonnKjoring.totalBrutto-lonnKjoring.totalNetto)/1000).toFixed(1)}k kr`,fra:"DNB bedriftskonto → Skatteetaten (KID)",ok:false},
                {dato:"15. april",hva:"Arbeidsgiveravgift (termin 2)",belop:`${(lonnKjoring.agAvgift/1000).toFixed(1)}k kr`,fra:"DNB bedriftskonto → Skatteetaten",ok:false},
              ].map((b,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:9,border:`1px solid ${C.border}`,background:"white",marginBottom:7}}>
                  <div style={{width:36,height:36,borderRadius:9,background:b.ok?"#F0FDF4":C.goldBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{b.ok?"✓":"📅"}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{b.dato} — {b.hva}</div>
                    <div style={{fontSize:10,color:C.soft}}>{b.fra}</div>
                  </div>
                  <div style={{fontSize:12,fontWeight:700,color:C.navy,flexShrink:0}}>{b.belop}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Historikk */}
          <div className="card tw">
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
              <span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>Lønnskjøringshistorikk</span>
            </div>
            <table className="tbl">
              <thead><tr><th>Periode</th><th>Brutto</th><th>Netto utbetalt</th><th>AG-avgift</th><th>Feriepenger</th><th>Utbet.dato</th><th>Status</th><th></th></tr></thead>
              <tbody>{LONNKJORINGER.map(k=>(
                <tr key={k.maaned}>
                  <td style={{fontWeight:600}}>{k.maaned}</td>
                  <td>{k.totalBrutto.toLocaleString("nb-NO")} kr</td>
                  <td style={{color:C.green,fontWeight:600}}>{k.totalNetto.toLocaleString("nb-NO")} kr</td>
                  <td style={{color:C.goldDark}}>{k.agAvgift.toLocaleString("nb-NO")} kr</td>
                  <td style={{color:C.sky}}>{k.feriepenger.toLocaleString("nb-NO")} kr</td>
                  <td style={{color:C.soft,fontSize:11}}>{k.utbetalingsDato}</td>
                  <td><span style={{fontSize:9,padding:"2px 8px",borderRadius:50,fontWeight:600,background:k.status==="utbetalt"?"#F0FDF4":C.goldBg,color:k.status==="utbetalt"?"#16A34A":C.goldDark}}>{k.status==="utbetalt"?"✓ Utbetalt":"⏳ Planlagt"}</span></td>
                  <td><button style={{fontSize:10,padding:"3px 9px",background:C.softBg,color:C.navyMid,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit"}}>Last ned</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SKATTETREKK & AG-AVGIFT ── */}
      {lonnTab==="skatt"&&(
        <div style={{display:"flex",flexDirection:"column",gap:16}}>

          {/* Forklaringsboks */}
          <div style={{background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,borderRadius:14,padding:"18px 20px",color:"white"}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Slik fungerer skattetrekk hos EiraNova</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
              {[
                {n:"1",t:"Skattekort hentes",txt:"Tripletex henter skattekort automatisk fra Skatteetaten via Altinn API. Trekkprosent eller tabell leses inn per ansatt.",icon:"📥"},
                {n:"2",t:"Trekk holdes tilbake",txt:"Skattetrekket trekkes fra bruttolønn og settes på skattetrekkskontoen (sperret konto i DNB) — ikke på bedriftskontoen.",icon:"🔐"},
                {n:"3",t:"Innbetalt innen 3 dager",txt:"Senest 3 virkedager etter lønnsutbetaling betales skattetrekket til Skatteetaten med KID-nummer.",icon:"🏛️"},
                {n:"4",t:"AG-avgift 6 terminer/år",txt:"Arbeidsgiveravgiften (14,1%) betales ikke månedlig — den følger 6-termins-ordningen og forfaller annenhver måned.",icon:"📅"},
              ].map(s=>(
                <div key={s.n} style={{background:"rgba(255,255,255,.1)",borderRadius:10,padding:"12px 13px",border:"1px solid rgba(255,255,255,.15)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(74,188,158,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#4ABC9E",flexShrink:0}}>{s.n}</div>
                    <span style={{fontSize:11,fontWeight:600}}>{s.icon} {s.t}</span>
                  </div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,.7)",lineHeight:1.55}}>{s.txt}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:16}}>

            {/* Skattetrekkskonto */}
            <div className="card">
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
                <span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>Skattetrekkskonto</span>
              </div>
              <div style={{padding:"14px 16px"}}>
                <div style={{background:C.dangerBg,borderRadius:9,padding:"10px 13px",marginBottom:14,border:`1px solid rgba(225,29,72,.2)`,fontSize:10,color:C.danger,lineHeight:1.6}}>
                  ⚠️ <strong>Lovpålagt:</strong> Skattetrekket skal oppbevares på en <strong>særskilt sperret konto</strong> (skattetrekkskonto) eller dekkes av bankgaranti. Brudd kan medføre straff og personlig ansvar.
                </div>
                {[
                  {l:"Kontonummer",v:"1503.XX.XXXXX",note:"Opprettes i DNB — ikke satt opp ennå",ok:false},
                  {l:"Type",v:"Sperret skattetrekkskonto",note:"Alternativt: bankgaranti fra DNB",ok:null},
                  {l:"Saldo nå",v:"Ikke aktiv",note:"Aktiveres ved første lønnskjøring",ok:false},
                  {l:"Neste innbetaling",v:"25. mars 2026",note:"Innen 28. mars (3 virkedager)",ok:null},
                  {l:"Beløp å innbetale",v:`${(79371).toLocaleString("nb-NO")} kr`,note:"Mars skattetrekk alle ansatte",ok:null},
                ].map(r=>(
                  <div key={r.l} style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`,gap:12}}>
                    <div>
                      <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{r.l}</div>
                      <div style={{fontSize:9,color:r.ok===false?C.danger:C.soft}}>{r.note}</div>
                    </div>
                    <span style={{fontSize:11,fontWeight:600,color:r.ok===false?C.danger:C.navy,textAlign:"right",flexShrink:0}}>{r.v}</span>
                  </div>
                ))}
                <button onClick={()=>{window.open("https://dnb.no","_blank");}} className="btn bp" style={{width:"100%",marginTop:12,padding:"9px 0",fontSize:12,borderRadius:9}}>Opprett skattetrekkskonto i DNB →</button>
              </div>
            </div>

            {/* Skattekort-status */}
            <div className="card">
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>Skattekort — status</span>
                <button onClick={()=>toast("Skattekort hentet fra Altinn","ok")} style={{fontSize:10,padding:"4px 10px",background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>🔄 Hent fra Altinn</button>
              </div>
              <div style={{padding:"14px 16px"}}>
                <div style={{background:C.greenXL,borderRadius:9,padding:"9px 12px",fontSize:10,color:C.navyMid,marginBottom:12,lineHeight:1.55}}>
                  Tripletex henter skattekort automatisk via Altinn. Ansatte trenger ikke gjøre noe — skattekortet oppdateres automatisk ved endringer.
                </div>
                {ANSATTE_LONN.map(a=>(
                  <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDark},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"white",flexShrink:0}}>{a.av}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{a.navn}</div>
                      <div style={{fontSize:9,color:C.soft}}>Trekkprosent: {a.trekkProsent}% · Hentet: jan 2026</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:11,fontWeight:700,color:C.navy}}>{a.trekkProsent}%</div>
                      <div style={{fontSize:9,background:"#F0FDF4",color:"#16A34A",padding:"1px 6px",borderRadius:50,fontWeight:600}}>✓ Aktiv</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AG-avgift terminkalkulator */}
            <div className="card" style={{gridColumn:"1/-1"}}>
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
                <span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>Arbeidsgiveravgift — terminer 2026</span>
              </div>
              <div style={{padding:"14px 16px"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10,marginBottom:14}}>
                  {[
                    {termin:"Termin 1",periode:"Jan – Feb",forfall:"15. april 2026",belop:63448,status:"kommende"},
                    {termin:"Termin 2",periode:"Mar – Apr",forfall:"15. juni 2026",belop:65674,status:"fremtidig"},
                    {termin:"Termin 3",periode:"Mai – Jun",forfall:"15. aug 2026",belop:65674,status:"fremtidig"},
                    {termin:"Termin 4",periode:"Jul – Aug",forfall:"15. okt 2026",belop:65674,status:"fremtidig"},
                    {termin:"Termin 5",periode:"Sep – Okt",forfall:"15. des 2026",belop:65674,status:"fremtidig"},
                    {termin:"Termin 6",periode:"Nov – Des",forfall:"15. feb 2027",belop:65674,status:"fremtidig"},
                  ].map(t=>(
                    <div key={t.termin} style={{background:t.status==="kommende"?C.goldBg:C.softBg,borderRadius:10,padding:"12px 13px",border:`1px solid ${t.status==="kommende"?"rgba(196,149,106,.3)":C.border}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                        <span style={{fontSize:11,fontWeight:700,color:t.status==="kommende"?C.goldDark:C.navy}}>{t.termin}</span>
                        {t.status==="kommende"&&<span style={{fontSize:9,background:C.goldBg,color:C.goldDark,padding:"1px 7px",borderRadius:50,border:`1px solid rgba(196,149,106,.3)`,fontWeight:700}}>Neste</span>}
                      </div>
                      <div style={{fontSize:10,color:C.soft,marginBottom:4}}>{t.periode}</div>
                      <div style={{fontSize:14,fontWeight:700,color:t.status==="kommende"?C.goldDark:C.navy,marginBottom:2}}>{t.belop.toLocaleString("nb-NO")} kr</div>
                      <div style={{fontSize:9,color:C.soft}}>Forfall: {t.forfall}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:C.greenXL,borderRadius:9,padding:"9px 13px",fontSize:10,color:C.navyMid,lineHeight:1.6}}>
                  💡 AG-avgift beregnes som <strong>{TARIFF_INFO.agAvgiftSats}% av all utbetalt lønn</strong> i terminen. Tripletex akkumulerer beløpet automatisk og minner om forfallsdato. Betales med KID til Skatteetaten.
                </div>
              </div>
            </div>

            {/* Skattetrekk historikk */}
            <div className="card" style={{gridColumn:"1/-1"}}>
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
                <span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>Skattetrekk — innbetalingshistorikk</span>
              </div>
              <div className="tw">
                <table className="tbl">
                  <thead><tr><th>Lønnsperiode</th><th>Lønnsutbetaling</th><th>Frist innbetaling</th><th>Skattetrekk</th><th>KID</th><th>Status</th></tr></thead>
                  <tbody>
                    {[
                      {periode:"Mars 2026",lonn:"25. mars",frist:"28. mars",belop:79371,kid:"15030000143",status:"planlagt"},
                      {periode:"Feb 2026",lonn:"25. feb",frist:"28. feb",belop:77656,kid:"15030000137",status:"betalt"},
                      {periode:"Jan 2026",lonn:"25. jan",frist:"28. jan",belop:73706,kid:"15030000131",status:"betalt"},
                    ].map(r=>(
                      <tr key={r.periode}>
                        <td style={{fontWeight:600}}>{r.periode}</td>
                        <td style={{color:C.soft,fontSize:11}}>{r.lonn}</td>
                        <td style={{color:r.status==="planlagt"?C.gold:C.soft,fontSize:11,fontWeight:r.status==="planlagt"?600:400}}>{r.frist}</td>
                        <td style={{fontWeight:600,color:C.navy}}>{r.belop.toLocaleString("nb-NO")} kr</td>
                        <td style={{fontFamily:"monospace",fontSize:10,color:C.soft}}>{r.kid}</td>
                        <td><span style={{fontSize:9,padding:"2px 8px",borderRadius:50,fontWeight:600,background:r.status==="betalt"?"#F0FDF4":C.goldBg,color:r.status==="betalt"?"#16A34A":C.goldDark}}>{r.status==="betalt"?"✓ Betalt":"⏳ Planlagt"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TARIFF & REGLER ── */}
      {lonnTab==="tariff"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:16}}>
          <div className="card">
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}><span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>Tariffavtale</span></div>
            <div style={{padding:"14px 16px"}}>
              {[
                {l:"Avtale",v:TARIFF_INFO.avtale},
                {l:"Sone",v:TARIFF_INFO.sone},
                {l:"Arbeidsgiveravgift",v:`${TARIFF_INFO.agAvgiftSats}%`},
                {l:"OTP-pensjon (minimum)",v:`${TARIFF_INFO.otpSats}% av lønn`},
                {l:"Feriepenger",v:`${TARIFF_INFO.feriepengeSats}% av årslønn`},
                {l:"AG-sykdomsperiode",v:`${TARIFF_INFO.sykeAGDager} dager, deretter NAV`},
                {l:"Minstelønn sykepleier",v:`${TARIFF_INFO.minstelonn.sykepleier.toLocaleString("nb-NO")} kr/mnd`},
                {l:"Minstelønn hjelpepleier",v:`${TARIFF_INFO.minstelonn.hjelpepleier.toLocaleString("nb-NO")} kr/mnd`},
              ].map(r=>(
                <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:12}}>
                  <span style={{color:C.soft}}>{r.l}</span>
                  <span style={{fontWeight:600,color:C.navy}}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}><span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>Tillegg og kompensasjoner</span></div>
            <div style={{padding:"14px 16px"}}>
              {[
                {l:"Helgetillegg",v:`${TARIFF_INFO.tillegg.helgProsent}% av timelønn`,icon:"📅"},
                {l:"Kvelstillegg (17-21)",v:`${TARIFF_INFO.tillegg.kveldKr} kr/time`,icon:"🌆"},
                {l:"Nattillegg (21-06)",v:`${TARIFF_INFO.tillegg.nattKr} kr/time`,icon:"🌙"},
                {l:"Overtid",v:`${TARIFF_INFO.tillegg.overtidProsent}% tillegg`,icon:"⏰"},
                {l:"Reisegodtgjørelse",v:"4,50 kr/km (statssats)",icon:"🚗"},
                {l:"Diett korte reiser",v:"Ikke aktuelt (hjemmebasert)",icon:"🥗"},
              ].map(r=>(
                <div key={r.l} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontSize:16,flexShrink:0}}>{r.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{r.l}</div>
                  </div>
                  <span style={{fontSize:11,fontWeight:600,color:C.navy}}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}><span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>Frister og plikter</span></div>
            <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:8}}>
              {[
                {frist:"Innen 5. i måneden",hva:"A-melding sendes til Skatteetaten",status:"auto",color:C.green},
                {frist:"Utbet. 25. hver mnd",hva:"Nettoutbetaling til ansatte",status:"planlagt",color:C.sky},
                {frist:"Innen 3 virkedager",hva:"Skattetrekk innbetalt etter utbet.",status:"auto",color:C.green},
                {frist:"15. jan og 15. jul",hwa:"Arbeidsgiveravgift (terminvis)",status:"kalender",color:C.gold},
                {frist:"15. april",hva:"AG-avgift termin 1 (jan–feb)",status:"kalender",color:C.gold},
                {frist:"31. mai",hva:"Feriepenger utbetalt",status:"kalender",color:C.sky},
              ].filter(r=>r.hva).map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,background:C.softBg,border:`1px solid ${C.border}`}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:r.color,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:10,fontWeight:700,color:r.color}}>{r.frist}</div>
                    <div style={{fontSize:11,color:C.navy}}>{r.hva}</div>
                  </div>
                  <span style={{fontSize:9,padding:"2px 8px",borderRadius:50,background:`${r.color}18`,color:r.color,fontWeight:600}}>
                    {r.status==="auto"?"🤖 Auto":r.status==="planlagt"?"⏳ Planlagt":"📅 Kalender"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── A-MELDING ── */}
      {lonnTab==="amelding"&&(
        <div>
          <div style={{background:C.greenXL,borderRadius:10,padding:"12px 16px",marginBottom:16,border:`1px solid ${C.border}`,fontSize:11,color:C.navyMid,lineHeight:1.6}}>
            📤 <strong>A-melding</strong> sendes automatisk via Tripletex til Altinn innen 5. i måneden. Inneholder lønn, skattetrekk, arbeidsgiveravgift og feriepenger for alle ansatte. EiraNova har plikt til å sende A-melding fra første ansatt.
          </div>
          <div className="card tw">
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>A-meldingshistorikk</span>
              <button onClick={()=>toast("A-melding sendt til Altinn","ok")} className="btn bp" style={{fontSize:11,padding:"6px 14px"}}>Send A-melding nå</button>
            </div>
            <table className="tbl">
              <thead><tr><th>Periode</th><th>Sendt</th><th>Ansatte</th><th>Bruttolønn</th><th>Skattetrekk</th><th>Altinn ref.</th><th>Status</th></tr></thead>
              <tbody>
                {[
                  {periode:"Mars 2026",sendt:"—",ansatte:5,brutto:232800,trekk:79371,ref:"—",status:"planlagt"},
                  {periode:"Feb 2026",sendt:"2026-03-04",ansatte:5,brutto:228400,trekk:77656,ref:"A-2026-02-EN0044",status:"godkjent"},
                  {periode:"Jan 2026",sendt:"2026-02-03",ansatte:5,brutto:215900,trekk:73706,ref:"A-2026-01-EN0021",status:"godkjent"},
                ].map(r=>(
                  <tr key={r.periode}>
                    <td style={{fontWeight:600}}>{r.periode}</td>
                    <td style={{fontSize:11,color:C.soft}}>{r.sendt}</td>
                    <td>{r.ansatte}</td>
                    <td>{r.brutto.toLocaleString("nb-NO")} kr</td>
                    <td style={{color:C.danger}}>{r.trekk.toLocaleString("nb-NO")} kr</td>
                    <td style={{fontFamily:"monospace",fontSize:10,color:C.soft}}>{r.ref}</td>
                    <td><span style={{fontSize:9,padding:"2px 8px",borderRadius:50,fontWeight:600,background:r.status==="godkjent"?"#F0FDF4":C.goldBg,color:r.status==="godkjent"?"#16A34A":C.goldDark}}>{r.status==="godkjent"?"✓ Godkjent av Altinn":"⏳ Planlagt"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


function PrisKalkulator(){
  const[modell,setModell]=useState("vikar"); // "vikar" | "fast" | "hybrid"

  // ── Felles inputs ─────────────────────────────────────────
  const[oppdragPerMnd,setOppdragPerMnd]=useState(180);
  const[marginProsent,setMarginProsent]=useState(25);
  const[mvaApplicable,setMvaApplicable]=useState(false);
  const[kmPerOppdrag,setKmPerOppdrag]=useState(8);

  // ── Vikar-inputs ──────────────────────────────────────────
  const[vikarSatsHoyt,setVikarSatsHoyt]=useState(320);  // kr/oppdrag sykepleier-type
  const[vikarSatsLavt,setVikarSatsLavt]=useState(200);  // kr/oppdrag enkel tjeneste
  const[andelHoyt,setAndelHoyt]=useState(55);           // % høy-sats oppdrag
  const[vikarType,setVikarType]=useState("enk");        // "enk" | "midlertidig"

  // ── Fast ansatt-inputs ────────────────────────────────────
  const[snittVarighet,setSnittVarighet]=useState(60);
  const[timeLonnSpl,setTimeLonnSpl]=useState(275);
  const[timeLonnHj,setTimeLonnHj]=useState(225);
  const[sykeplAndel,setSykeplAndel]=useState(60);

  // ── Faste kostnader ───────────────────────────────────────
  const[lonnAdmin,setLonnAdmin]=useState(0);       // eierne tar utbytte, ikke lønn i oppstart
  const[kontorKost,setKontorKost]=useState(2500);
  const[systemKost,setSystemKost]=useState(4200);
  const[forsikring,setForsikring]=useState(3800);
  const[revisor,setRevisor]=useState(4500);
  const[marked,setMarked]=useState(5000);
  const[annetFast,setAnnetFast]=useState(2000);

  // ── Eierstruktur ──────────────────────────────────────────
  const[antallEiere,setAntallEiere]=useState(3);
  const[innskuttKapital,setInnskuttKapital]=useState(100000);
  const[skjermingsrente,setSkjermingsrente]=useState(4.0); // % 2026

  // ── Beregninger ───────────────────────────────────────────
  const totalFastPerMnd = (lonnAdmin>0?lonnAdmin*(1+0.141+0.12+0.02):0)
    +kontorKost+systemKost+forsikring+revisor+marked+annetFast;

  // Vikar-modell
  const vikarSnittSats = vikarSatsHoyt*(andelHoyt/100) + vikarSatsLavt*((100-andelHoyt)/100);
  const vikarAgAvgift  = vikarType==="midlertidig" ? vikarSnittSats*0.141 : 0;
  const vikarFeriepeng = vikarType==="midlertidig" ? vikarSnittSats*0.12  : 0;
  const reisePerOpp    = kmPerOppdrag*4.5;
  const direkteKostVikar = vikarSnittSats + vikarAgAvgift + vikarFeriepeng + reisePerOpp;
  const overheadVikar    = oppdragPerMnd>0 ? totalFastPerMnd/oppdragPerMnd : 0;
  const kostnadVikar     = direkteKostVikar + overheadVikar;
  const prisVikar        = Math.ceil(kostnadVikar/(1-(marginProsent/100)));
  const prisMedMvaVikar  = mvaApplicable ? Math.ceil(prisVikar*1.25) : prisVikar;
  const bidragPerOpp     = prisMedMvaVikar - direkteKostVikar;
  const mndInntektVikar  = prisMedMvaVikar * oppdragPerMnd;
  const mndBidrag        = bidragPerOpp * oppdragPerMnd;
  const mndResultat      = mndBidrag - totalFastPerMnd;

  // Fast-modell
  const timeLonnMix   = timeLonnSpl*(sykeplAndel/100)+timeLonnHj*((100-sykeplAndel)/100);
  const timer         = snittVarighet/60;
  const grunnLonn     = timeLonnMix*timer;
  const direkteKostFast = grunnLonn*(1+0.141+0.12+0.02)+reisePerOpp;
  const overheadFast  = oppdragPerMnd>0 ? totalFastPerMnd/oppdragPerMnd : 0;
  const kostnadFast   = direkteKostFast + overheadFast;
  const prisFast      = Math.ceil(kostnadFast/(1-(marginProsent/100)));

  // Utbytte-beregning
  const skjermingTotal = innskuttKapital * (skjermingsrente/100);
  const skjermingPerEier = skjermingTotal/antallEiere;
  const utbytteTilgjengelig = Math.max(0, mndResultat*12); // årlig
  const utbyttePerEier = utbytteTilgjengelig/antallEiere;
  const utbytteSkattefritt = Math.min(utbyttePerEier, skjermingPerEier);
  const utbytteSkattepliktig = Math.max(0, utbyttePerEier - skjermingPerEier);
  const utbytteSkatteVikar = utbytteSkattepliktig * 0.3784;
  const utbytteEtterSkatt = utbyttePerEier - utbytteSkatteVikar;

  const Slider=({label,value,setValue,min,max,step=1,unit="",hint})=>(
    <div style={{marginBottom:13}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}>
        <label style={{fontSize:11,fontWeight:600,color:C.navy}}>{label}</label>
        <span style={{fontSize:13,fontWeight:700,color:C.green}}>{Number(value).toLocaleString("nb-NO")}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e=>setValue(Number(e.target.value))}
        style={{width:"100%",accentColor:C.green,cursor:"pointer"}}/>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.soft,marginTop:1}}>
        <span>{min}{unit}</span>
        {hint&&<span style={{fontStyle:"italic",color:C.navyMid}}>{hint}</span>}
        <span>{max}{unit}</span>
      </div>
    </div>
  );
  const EditFelt=({label,value,setValue,hint})=>(
    <div style={{marginBottom:9}}>
      <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>{label}</label>
      <div style={{display:"flex",alignItems:"center"}}>
        <span style={{padding:"7px 9px",background:C.border,borderRadius:"7px 0 0 7px",fontSize:10,color:C.soft,fontWeight:600,flexShrink:0}}>kr</span>
        <input type="number" value={value} onChange={e=>setValue(Number(e.target.value))}
          style={{flex:1,padding:"7px 10px",border:`1px solid ${C.border}`,borderRadius:"0 7px 7px 0",fontSize:11,fontFamily:"inherit",background:C.greenXL,color:C.navy,outline:"none"}}/>
      </div>
      {hint&&<div style={{fontSize:9,color:C.soft,marginTop:2}}>{hint}</div>}
    </div>
  );

  return(
    <div>
      {/* ── Modell-velger ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginBottom:20}}>
        {[
          {key:"vikar",icon:"🤝",title:"Vikar per oppdrag",sub:"Vikarer fakturerer EiraNova (ENK) eller midlertidig ansatt. Ingen faste lønnskostnader. Eierne tar utbytte.",color:C.green,border:C.green},
          {key:"fast", icon:"👔",title:"Fast ansatte",sub:"Tradisjonell modell. Forutsigbar for ansatte. Høyere faste kostnader.",color:C.sky,border:C.sky},
          {key:"hybrid",icon:"⚖️",title:"Hybrid",sub:"Fast grunnstilling (60%) + oppdragstillegg. Fleksibelt, men mer administrativt.",color:C.gold,border:C.gold},
        ].map(m=>(
          <div key={m.key} onClick={()=>setModell(m.key)}
            style={{padding:"14px 16px",borderRadius:13,border:`2px solid ${modell===m.key?m.border:C.border}`,
              background:modell===m.key?`${m.color}0F`:"white",cursor:"pointer",transition:"all .15s"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontSize:22}}>{m.icon}</span>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:modell===m.key?C.navy:C.navyMid}}>{m.title}</div>
                {modell===m.key&&<span style={{fontSize:9,background:`${m.color}22`,color:m.color,padding:"1px 7px",borderRadius:50,fontWeight:600}}>Valgt</span>}
              </div>
            </div>
            <div style={{fontSize:10,color:C.soft,lineHeight:1.5}}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Resultatbanner ── */}
      <div style={{background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,borderRadius:14,padding:"18px 22px",marginBottom:20}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:10,textTransform:"uppercase",letterSpacing:.6}}>
          {modell==="vikar"?"Vikar per oppdrag":"Fast ansatt"} · {oppdragPerMnd} oppdrag/mnd · {marginProsent}% margin
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:16}}>
          {(modell==="vikar"?[
            {l:"Listepris per oppdrag",v:`${prisMedMvaVikar.toLocaleString("nb-NO")} kr`,sub:mvaApplicable?"inkl. MVA":"eks. MVA",c:"white",big:true},
            {l:"Vikarhonorar (snitt)",v:`-${Math.round(vikarSnittSats)} kr`,sub:vikarType==="enk"?"ENK-faktura":"Midl. ansatt",c:"rgba(255,255,255,.7)"},
            {l:"Bidrag per oppdrag",v:`${Math.round(bidragPerOpp)} kr`,sub:`${Math.round(bidragPerOpp/prisMedMvaVikar*100)}% bidragsmargin`,c:"#4ABC9E"},
            {l:"Månedlig inntekt",v:`${Math.round(mndInntektVikar/1000)}k kr`,sub:`${oppdragPerMnd} oppdrag`,c:"rgba(255,255,255,.85)"},
            {l:"Faste kostnader",v:`-${Math.round(totalFastPerMnd/1000)}k kr`,sub:"Per måned",c:"rgba(255,255,255,.7)"},
            {l:"Til utbytte/buffer",v:`${Math.round(mndResultat/1000)}k kr`,sub:"Per måned",c:mndResultat>0?"#4ABC9E":"#F87171",big:true},
          ]:[
            {l:"Listepris per oppdrag",v:`${prisFast.toLocaleString("nb-NO")} kr`,sub:`${snittVarighet} min`,c:"white",big:true},
            {l:"Direktekostnad",v:`${Math.round(direkteKostFast)} kr`,sub:"Lønn+AG+ferie+OTP+reise",c:"rgba(255,255,255,.7)"},
            {l:"Overhead per oppdrag",v:`${Math.round(overheadFast)} kr`,sub:"Faste kost ÷ oppdrag",c:"rgba(255,255,255,.7)"},
            {l:"Månedlig inntekt",v:`${Math.round(prisFast*oppdragPerMnd/1000)}k kr`,c:"rgba(255,255,255,.85)"},
            {l:"Månedlige kostnader",v:`-${Math.round((direkteKostFast*oppdragPerMnd+totalFastPerMnd)/1000)}k kr`,c:"rgba(255,255,255,.7)"},
            {l:"Månedlig overskudd",v:`${Math.round((prisFast*oppdragPerMnd-direkteKostFast*oppdragPerMnd-totalFastPerMnd)/1000)}k kr`,c:prisFast*oppdragPerMnd>direkteKostFast*oppdragPerMnd+totalFastPerMnd?"#4ABC9E":"#F87171",big:true},
          ]).map(k=>(
            <div key={k.l}>
              <div style={{fontSize:9,color:"rgba(255,255,255,.45)",marginBottom:3,textTransform:"uppercase",letterSpacing:.4}}>{k.l}</div>
              <div className="fr" style={{fontSize:k.big?20:15,fontWeight:700,color:k.c,lineHeight:1}}>{k.v}</div>
              {k.sub&&<div style={{fontSize:9,color:"rgba(255,255,255,.4)",marginTop:2}}>{k.sub}</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>

        {/* ── Venstre: Slidere ── */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>

          {/* Felles */}
          <div className="card">
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
              <span className="fr" style={{fontSize:13,fontWeight:600,color:C.navy}}>⚙️ Generelle parametere</span>
            </div>
            <div style={{padding:"14px 16px"}}>
              <Slider label="Oppdrag per måned" value={oppdragPerMnd} setValue={setOppdragPerMnd} min={20} max={400} step={10} hint="Kapasitet"/>
              <Slider label="Ønsket margin" value={marginProsent} setValue={setMarginProsent} min={5} max={50} unit="%" hint="Bransjenorm: 20-35%"/>
              <Slider label="Km per oppdrag (reise)" value={kmPerOppdrag} setValue={setKmPerOppdrag} min={0} max={30} unit=" km" hint="4,50 kr/km"/>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0"}}>
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:C.navy}}>MVA på tjenestene</div>
                  <div style={{fontSize:9,color:C.soft}}>Avventer juridisk avklaring</div>
                </div>
                <div onClick={()=>setMvaApplicable(v=>!v)} style={{width:38,height:22,borderRadius:11,background:mvaApplicable?C.green:"#D1D5DB",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
                  <div style={{position:"absolute",top:3,left:mvaApplicable?18:3,width:16,height:16,borderRadius:"50%",background:"white",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
                </div>
              </div>
            </div>
          </div>

          {/* Vikar-spesifikk */}
          {modell==="vikar"&&(
            <div className="card">
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
                <span className="fr" style={{fontSize:13,fontWeight:600,color:C.navy}}>🤝 Vikar-satser</span>
              </div>
              <div style={{padding:"14px 16px"}}>
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:8}}>Vikar-type</div>
                  <div style={{display:"flex",gap:8}}>
                    {[["enk","ENK-faktura","Vikar = selvstendig næringsdrivende. Ingen AG-avgift for EiraNova."],["midlertidig","Midl. ansatt","Teknisk ansatt per oppdrag. EiraNova betaler AG-avgift og feriepenger."]].map(([k,l,sub])=>(
                      <div key={k} onClick={()=>setVikarType(k)} style={{flex:1,padding:"10px 11px",borderRadius:9,border:`2px solid ${vikarType===k?C.green:C.border}`,background:vikarType===k?C.greenXL:"white",cursor:"pointer"}}>
                        <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:2}}>{l}</div>
                        <div style={{fontSize:9,color:C.soft,lineHeight:1.4}}>{sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {vikarType==="enk"&&(
                  <div style={{background:C.greenXL,borderRadius:9,padding:"8px 11px",fontSize:10,color:C.navyMid,marginBottom:12,lineHeight:1.6}}>
                    💡 ENK-vikar fakturerer EiraNova. EiraNova betaler <strong>ingen AG-avgift, feriepenger eller pensjon</strong>. Vikaren håndterer egen skatt og MVA. Enklest og billigst for EiraNova.
                  </div>
                )}
                {vikarType==="midlertidig"&&(
                  <div style={{background:C.goldBg,borderRadius:9,padding:"8px 11px",fontSize:10,color:C.goldDark,marginBottom:12,lineHeight:1.6}}>
                    ⚠️ Midlertidig ansatt utløser <strong>AG-avgift (14,1%) og feriepenger (12%)</strong> fra EiraNova. Høyere kostnad, men mer forutsigbart for vikaren.
                  </div>
                )}
                <Slider label="Honorar — kompleks tjeneste (sykepleier)" value={vikarSatsHoyt} setValue={setVikarSatsHoyt} min={150} max={600} step={10} unit=" kr" hint="Morgensstell, stell m.m."/>
                <Slider label="Honorar — enkel tjeneste" value={vikarSatsLavt} setValue={setVikarSatsLavt} min={80} max={400} step={10} unit=" kr" hint="Ringetilsyn, besøk m.m."/>
                <Slider label="Andel komplekse tjenester" value={andelHoyt} setValue={setAndelHoyt} min={0} max={100} step={5} unit="%" hint="Resten = enkle tjenester"/>
                <div style={{background:C.softBg,borderRadius:9,padding:"9px 12px",fontSize:10,color:C.navyMid,lineHeight:1.6}}>
                  Snitt vikarhonorar: <strong>{Math.round(vikarSnittSats)} kr/oppdrag</strong>
                  {vikarType==="midlertidig"&&<span> + AG/ferie: <strong>{Math.round(vikarAgAvgift+vikarFeriepeng)} kr</strong></span>}
                  {" "}· Total personalkost: <strong>{Math.round(vikarSnittSats+vikarAgAvgift+vikarFeriepeng)} kr</strong>
                </div>
              </div>
            </div>
          )}

          {/* Fast-spesifikk */}
          {(modell==="fast"||modell==="hybrid")&&(
            <div className="card">
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
                <span className="fr" style={{fontSize:13,fontWeight:600,color:C.navy}}>👩‍⚕️ Lønnssatser</span>
              </div>
              <div style={{padding:"14px 16px"}}>
                <Slider label="Varighet per oppdrag" value={snittVarighet} setValue={setSnittVarighet} min={15} max={180} step={15} unit=" min"/>
                <Slider label="Timelønn sykepleier" value={timeLonnSpl} setValue={setTimeLonnSpl} min={220} max={400} step={5} unit=" kr/t"/>
                <Slider label="Timelønn hjelpepleier" value={timeLonnHj} setValue={setTimeLonnHj} min={180} max={320} step={5} unit=" kr/t"/>
                <Slider label="Andel sykepleier-oppdrag" value={sykeplAndel} setValue={setSykeplAndel} min={0} max={100} step={5} unit="%"/>
                <div style={{background:C.goldBg,borderRadius:9,padding:"8px 11px",fontSize:10,color:C.goldDark,lineHeight:1.6}}>
                  Reell timekostnad inkl. AG/ferie/OTP: <strong>{Math.round(timeLonnMix*(1+0.141+0.12+0.02))} kr/t</strong>
                </div>
              </div>
            </div>
          )}

          {/* Eierstrategi */}
          <div className="card">
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
              <span className="fr" style={{fontSize:13,fontWeight:600,color:C.navy}}>🏦 Utbytte-kalkulator</span>
            </div>
            <div style={{padding:"14px 16px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>Antall eiere</label>
                  <input type="number" value={antallEiere} onChange={e=>setAntallEiere(Number(e.target.value))} min={1} max={10}
                    style={{width:"100%",padding:"7px 10px",border:`1px solid ${C.border}`,borderRadius:7,fontSize:12,fontFamily:"inherit",background:C.greenXL}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:3}}>Innskutt kapital (kr)</label>
                  <input type="number" value={innskuttKapital} onChange={e=>setInnskuttKapital(Number(e.target.value))}
                    style={{width:"100%",padding:"7px 10px",border:`1px solid ${C.border}`,borderRadius:7,fontSize:12,fontFamily:"inherit",background:C.greenXL}}/>
                </div>
              </div>
              <Slider label="Skjermingsrente 2026" value={skjermingsrente} setValue={setSkjermingsrente} min={0.5} max={8} step={0.1} unit="%" hint="Fastsettes av Skatteetaten"/>
              {[
                {l:"Disponibelt til utbytte (år)",v:`${Math.round(utbytteTilgjengelig/1000)}k kr`,c:utbytteTilgjengelig>0?C.green:C.danger},
                {l:"Utbytte per eier (år)",v:`${Math.round(utbyttePerEier/1000)}k kr`,c:C.navy},
                {l:`Skattefritt (skjerming)`,v:`${Math.round(utbytteSkattefritt/1000)}k kr`,c:"#16A34A"},
                {l:"Skattepliktig del (37,84%)",v:`${Math.round(utbytteSkattepliktig/1000)}k kr`,c:C.goldDark},
                {l:"Skatt å betale per eier",v:`${Math.round(utbytteSkatteVikar/1000)}k kr`,c:C.danger},
                {l:"Netto utbytte per eier",v:`${Math.round(utbytteEtterSkatt/1000)}k kr`,c:C.green,bold:true},
              ].map(r=>(
                <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontSize:11,color:C.navyMid}}>{r.l}</span>
                  <span style={{fontSize:11,fontWeight:r.bold?700:600,color:r.c}}>{r.v}</span>
                </div>
              ))}
              <div style={{marginTop:10,background:C.greenXL,borderRadius:9,padding:"9px 12px",fontSize:10,color:C.navyMid,lineHeight:1.6}}>
                💡 Skjermingsfradrag = innskutt kapital × skjermingsrente. Utbytte opp til dette er <strong>skattefritt</strong>. Over dette: 37,84% skatt (2026).
              </div>
            </div>
          </div>
        </div>

        {/* ── Høyre: Kostnadsnedbryting + faste kost + tjenestematrise ── */}
        <div>

          {/* Kostnadsnedbryting */}
          <div className="card" style={{marginBottom:16}}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
              <span className="fr" style={{fontSize:13,fontWeight:600,color:C.navy}}>📊 Kostnadsnedbryting per oppdrag</span>
            </div>
            <div style={{padding:"14px 16px"}}>
              {modell==="vikar"?(
                <>
                  <div style={{fontSize:11,fontWeight:700,color:C.green,marginBottom:4,textTransform:"uppercase",letterSpacing:.4}}>Personalkostnad</div>
                  {[
                    {l:"Vikarhonorar (snitt)",v:`${Math.round(vikarSnittSats)} kr`,sub:`${Math.round(vikarSatsHoyt)} kr × ${andelHoyt}% + ${Math.round(vikarSatsLavt)} kr × ${100-andelHoyt}%`},
                    ...(vikarType==="midlertidig"?[
                      {l:"AG-avgift (14,1%)",v:`${Math.round(vikarAgAvgift)} kr`},
                      {l:"Feriepenger (12%)",v:`${Math.round(vikarFeriepeng)} kr`},
                    ]:[]),
                    {l:"Reisegodtgjørelse",v:`${Math.round(reisePerOpp)} kr`,sub:`${kmPerOppdrag} km × 4,50 kr`},
                  ].map(r=>(
                    <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                      <div><div style={{fontSize:11,color:C.navyMid}}>{r.l}</div>{r.sub&&<div style={{fontSize:9,color:C.soft}}>{r.sub}</div>}</div>
                      <span style={{fontSize:11,fontWeight:500,color:C.navy}}>{r.v}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderTop:`2px solid ${C.border}`,marginTop:4}}>
                    <span style={{fontSize:11,fontWeight:700,color:C.navy}}>Sum personalkost</span>
                    <span style={{fontSize:12,fontWeight:700,color:C.navy}}>{Math.round(direkteKostVikar-reisePerOpp+reisePerOpp)} kr</span>
                  </div>
                </>
              ):(
                <>
                  {[
                    {l:"Grunnlønn",v:`${Math.round(grunnLonn)} kr`,sub:`${timer.toFixed(1)}t × ${Math.round(timeLonnMix)} kr/t`},
                    {l:"AG-avgift (14,1%)",v:`${Math.round(grunnLonn*0.141)} kr`},
                    {l:"Feriepenger (12%)",v:`${Math.round(grunnLonn*0.12)} kr`},
                    {l:"OTP-pensjon (2%)",v:`${Math.round(grunnLonn*0.02)} kr`},
                    {l:"Reisegodtgjørelse",v:`${Math.round(reisePerOpp)} kr`},
                  ].map(r=>(
                    <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                      <div><div style={{fontSize:11,color:C.navyMid}}>{r.l}</div>{r.sub&&<div style={{fontSize:9,color:C.soft}}>{r.sub}</div>}</div>
                      <span style={{fontSize:11,fontWeight:500,color:C.navy}}>{r.v}</span>
                    </div>
                  ))}
                </>
              )}
              <div style={{marginTop:12}}>
                <div style={{fontSize:11,fontWeight:700,color:C.gold,marginBottom:4,textTransform:"uppercase",letterSpacing:.4}}>Overhead (fordelt)</div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                  <div><div style={{fontSize:11,color:C.navyMid}}>Faste kostnader</div><div style={{fontSize:9,color:C.soft}}>{Math.round(totalFastPerMnd/1000)}k kr/mnd ÷ {oppdragPerMnd} oppdrag</div></div>
                  <span style={{fontSize:11,fontWeight:500,color:C.navy}}>{Math.round(overheadVikar)} kr</span>
                </div>
              </div>
              <div style={{marginTop:10}}>
                <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:`2px solid ${C.navy}`}}>
                  <span style={{fontSize:13,fontWeight:800,color:C.navy}}>TOTALKOSTNAD</span>
                  <span style={{fontSize:13,fontWeight:800,color:C.navy}}>{Math.round(modell==="vikar"?kostnadVikar:kostnadFast)} kr</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}>
                  <span style={{fontSize:12,fontWeight:700,color:C.green}}>+ Margin ({marginProsent}%)</span>
                  <span style={{fontSize:12,fontWeight:700,color:C.green}}>+ {Math.round((modell==="vikar"?prisMedMvaVikar:prisFast)-(modell==="vikar"?kostnadVikar:kostnadFast))} kr</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:`2px solid ${C.green}`,marginTop:4}}>
                  <span style={{fontSize:15,fontWeight:800,color:C.navy}}>LISTEPRIS</span>
                  <span style={{fontSize:17,fontWeight:800,color:C.green}}>{(modell==="vikar"?prisMedMvaVikar:prisFast).toLocaleString("nb-NO")} kr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Faste kostnader */}
          <div className="card">
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span className="fr" style={{fontSize:13,fontWeight:600,color:C.navy}}>🏢 Faste månedskostnader</span>
              <span style={{fontSize:11,fontWeight:700,color:C.navy}}>{Math.round(totalFastPerMnd/1000)}k kr/mnd</span>
            </div>
            <div style={{padding:"14px 16px"}}>
              {modell==="vikar"&&(
                <div style={{background:"#F0FDF4",borderRadius:9,padding:"8px 11px",fontSize:10,color:"#166534",marginBottom:12,lineHeight:1.55,border:"1px solid rgba(22,163,74,.2)"}}>
                  ✓ <strong>Vikar-modell:</strong> Admin-lønn er 0 kr — eierne tar utbytte istedenfor lønn i oppstartsfasen. Dramatisk lavere faste kostnader.
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
                <EditFelt label="Admin/lederlønn (brutto)" value={lonnAdmin} setValue={setLonnAdmin} hint={lonnAdmin===0?"Eierne tar utbytte":"AG-avg og ferie legges til"}/>
                <EditFelt label="Kontor & drift" value={kontorKost} setValue={setKontorKost}/>
                <EditFelt label="Systemer & lisenser" value={systemKost} setValue={setSystemKost} hint="Tripletex, Supabase, Vercel..."/>
                <EditFelt label="Forsikringer" value={forsikring} setValue={setForsikring}/>
                <EditFelt label="Revisor" value={revisor} setValue={setRevisor}/>
                <EditFelt label="Markedsføring" value={marked} setValue={setMarked}/>
                <EditFelt label="Annet fast" value={annetFast} setValue={setAnnetFast}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tjenestematrise */}
      <div className="card" style={{marginTop:20}}>
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>📋 Prismatrise per tjeneste — {modell==="vikar"?"vikar-modell":"fast ansatt"}</span>
          <span style={{fontSize:10,color:C.soft}}>Rød = nåværende pris er for lav · Grønn = pris OK</span>
        </div>
        <div className="tw">
          <table className="tbl">
            <thead>
              <tr>
                <th>Tjeneste</th>
                <th>Varighet</th>
                <th>{modell==="vikar"?"Vikarhonorar":"Direktekost"}</th>
                <th>Overhead</th>
                <th>Totalkost</th>
                <th>Anbefalt pris</th>
                <th>B2B (-15%)</th>
                <th>Nå-pris</th>
                <th>Diff</th>
              </tr>
            </thead>
            <tbody>
              {[
                {navn:"Morgensstell & dusj",  min:75, type:"hoyt",  pris:590},
                {navn:"Praktisk bistand",      min:60, type:"mix",   pris:490},
                {navn:"Besøksvenn",            min:60, type:"lavt",  pris:390},
                {navn:"Transport & ærender",   min:90, type:"lavt",  pris:490},
                {navn:"Avlastning pårørende",  min:60, type:"lavt",  pris:490},
                {navn:"Ringetilsyn",           min:15, type:"lavt",  pris:190},
                {navn:"Barsel — Praktisk",     min:60, type:"hoyt",  pris:490},
                {navn:"Barsel — Trilleturer",  min:60, type:"lavt",  pris:390},
                {navn:"Barsel — Samtale",      min:60, type:"mix",   pris:390},
              ].map(sv=>{
                let direkte;
                if(modell==="vikar"){
                  const sats=sv.type==="hoyt"?vikarSatsHoyt:sv.type==="lavt"?vikarSatsLavt:(vikarSatsHoyt*0.6+vikarSatsLavt*0.4);
                  const agF=vikarType==="midlertidig"?sats*(0.141+0.12):0;
                  direkte=sats+agF+reisePerOpp*(sv.min/snittVarighet||1);
                } else {
                  const tl=sv.type==="hoyt"?timeLonnSpl:sv.type==="lavt"?timeLonnHj:(timeLonnSpl*0.6+timeLonnHj*0.4);
                  direkte=tl*(sv.min/60)*(1+0.141+0.12+0.02)+reisePerOpp;
                }
                const ov=oppdragPerMnd>0?totalFastPerMnd/oppdragPerMnd*(sv.min/(snittVarighet||60)):0;
                const kost=direkte+ov;
                const pris=Math.ceil(kost/(1-(marginProsent/100)));
                const b2b=Math.ceil(pris*0.85);
                const diff=pris-sv.pris;
                return(
                  <tr key={sv.navn} style={{background:diff>80?"#FFF5F5":diff<-80?"#F0FDF4":"white"}}>
                    <td style={{fontWeight:600,fontSize:11}}>{sv.navn}</td>
                    <td style={{fontSize:11,color:C.soft}}>{sv.min} min</td>
                    <td style={{fontSize:11}}>{Math.round(direkte-reisePerOpp*(sv.min/(snittVarighet||60)))} kr</td>
                    <td style={{fontSize:11,color:C.soft}}>{Math.round(ov)} kr</td>
                    <td style={{fontSize:11,fontWeight:600}}>{Math.round(kost)} kr</td>
                    <td style={{fontSize:12,fontWeight:700,color:C.green}}>{pris.toLocaleString("nb-NO")} kr</td>
                    <td style={{fontSize:11,color:C.sky}}>{b2b.toLocaleString("nb-NO")} kr</td>
                    <td style={{fontSize:11,color:C.soft}}>{sv.pris} kr</td>
                    <td style={{fontSize:11,fontWeight:700,color:diff>50?C.danger:diff<-50?"#16A34A":C.soft}}>
                      {diff>0?"+":""}{diff} kr
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


function OkonomiPage(){
  const[periode,setPeriode]=useState("mars-2026");
  const[eksportModal,setEksportModal]=useState(null);
  const[lonnTab,setLonnTab]=useState("oversikt");
  const[okonomiTab,setOkonomiTab]=useState("regnskap");

  // Mock månedstall
  const maaneder=["jan-2026","feb-2026","mars-2026"];
  const tall={
    "mars-2026":{inntektB2C:47820,inntektB2B:62300,refusjonerB2C:1370,kreditnoterB2B:1250,nettoInntekt:107500,kostnader:71200,resultat:36300,antOppdrag:187,vippsVolum:47820,stripeVolum:0,b2bFakturert:62300,utestaaende:33240},
    "feb-2026": {inntektB2C:41200,inntektB2B:54900,refusjonerB2C:780, kreditnoterB2B:490, nettoInntekt:94830,kostnader:64100,resultat:30730,antOppdrag:162,vippsVolum:41200,stripeVolum:0,b2bFakturert:54900,utestaaende:6000},
    "jan-2026": {inntektB2C:38500,inntektB2B:49200,refusjonerB2C:590, kreditnoterB2B:0,   nettoInntekt:87110,kostnader:61800,resultat:25310,antOppdrag:148,vippsVolum:38500,stripeVolum:0,b2bFakturert:49200,utestaaende:0},
  };
  const t=tall[periode]||tall["mars-2026"];

  const dagligBilag=[
    {dato:"2026-03-21",type:"Vipps oppgjør",ref:"VIPPS-DAG-0321",brutto:4890,refusjoner:390,netto:4500,status:"matchet",tripletexRef:"TT-24091"},
    {dato:"2026-03-20",type:"Vipps oppgjør",ref:"VIPPS-DAG-0320",brutto:5280,refusjoner:0,netto:5280,status:"matchet",tripletexRef:"TT-24088"},
    {dato:"2026-03-19",type:"B2B innbetaling",ref:"KID-18750-MK",brutto:18750,refusjoner:0,netto:18750,status:"matchet",tripletexRef:"TT-24082"},
    {dato:"2026-03-18",type:"Vipps oppgjør",ref:"VIPPS-DAG-0318",brutto:3910,refusjoner:0,netto:3910,status:"matchet",tripletexRef:"TT-24079"},
    {dato:"2026-03-17",type:"Vipps oppgjør",ref:"VIPPS-DAG-0317",brutto:4120,refusjoner:780,netto:3340,status:"avvik",tripletexRef:null},
    {dato:"2026-03-14",type:"B2B innbetaling",ref:"KID-6000-PB",brutto:6000,refusjoner:0,netto:6000,status:"matchet",tripletexRef:"TT-24071"},
  ];

  const mvaStatus=[
    {tjeneste:"Morgensstell & dusj",kategori:"Helsetjeneste",sats:"0% (unntatt §3-2)",risiko:"lav",notat:"Klar helsefaglig tjeneste"},
    {tjeneste:"Praktisk bistand",kategori:"Helsetjeneste",sats:"0% (unntatt §3-2)",risiko:"lav",notat:"Delegert fra kommunen"},
    {tjeneste:"Ringetilsyn",kategori:"Helsetjeneste",sats:"0% (unntatt §3-2)",risiko:"lav",notat:"Medisinsk oppfølging"},
    {tjeneste:"Transport & ærender",kategori:"Grå sone",sats:"Avklares",risiko:"medium",notat:"Avventer juridisk vurdering"},
    {tjeneste:"Avlastning pårørende",kategori:"Grå sone",sats:"Avklares",risiko:"medium",notat:"Kan tolkes som velferd"},
    {tjeneste:"Besøksvenn",kategori:"Velferdsteneste",sats:"Avklares",risiko:"høy",notat:"⚠️ Skatteetaten har krevd MVA her"},
    {tjeneste:"Trilleturer",kategori:"Velferdstjeneste",sats:"Avklares",risiko:"høy",notat:"⚠️ Ikke klar helsefaglig tjeneste"},
    {tjeneste:"Barsel — Praktisk bistand",kategori:"Helsetjeneste",sats:"0% (unntatt §3-2)",risiko:"lav",notat:"Jordmor-delegert omsorg"},
    {tjeneste:"Barsel — Samtale & støtte",kategori:"Grå sone",sats:"Avklares",risiko:"medium",notat:"Avventer vurdering"},
  ];

  const Kort=({label,value,sub,icon,color})=>(
    <div className="card cp">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
        <span style={{fontSize:9,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.5}}>{label}</span>
        <span style={{fontSize:17}}>{icon}</span>
      </div>
      <div className="fr" style={{fontSize:20,fontWeight:700,color:color||C.navy,marginBottom:2}}>{value}</div>
      <div style={{fontSize:9,color:C.soft}}>{sub}</div>
    </div>
  );

  return(
    <div className="fu">
      {/* Hoved-tabs */}
      <div style={{display:"flex",background:"white",borderRadius:10,padding:3,marginBottom:18,border:`1px solid ${C.border}`,width:"fit-content"}}>
        {[["regnskap","📊 Regnskap & bilag"],["lonn","💰 Lønn & ansatte"],["kalkulator","🧮 Priskalkulator"]].map(([t,l])=>(
          <button key={t} onClick={()=>setOkonomiTab(t)} style={{padding:"7px 18px",borderRadius:8,fontSize:12,fontWeight:okonomiTab===t?600:400,cursor:"pointer",border:"none",background:okonomiTab===t?C.greenBg:"transparent",color:okonomiTab===t?C.green:C.soft,fontFamily:"inherit"}}>{l}</button>
        ))}
      </div>

      {okonomiTab==="lonn"&&<LonnPanel lonnTab={lonnTab} setLonnTab={setLonnTab}/>}
      {okonomiTab==="kalkulator"&&<PrisKalkulator/>}
      {okonomiTab==="regnskap"&&<>

      {/* Eksport-modal */}
      {eksportModal&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.45)",padding:20}}>
          <div style={{background:"white",borderRadius:16,width:"100%",maxWidth:480,boxShadow:"0 20px 60px rgba(0,0,0,.2)"}}>
            <div style={{padding:"16px 20px",background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,borderRadius:"16px 16px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:15,fontWeight:600,color:"white"}}>📤 Eksporter til Tripletex</div>
              <button onClick={()=>setEksportModal(null)} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:14}}>×</button>
            </div>
            <div style={{padding:"20px"}}>
              <div style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:12}}>
                {eksportModal==="daglig"?"Daglig bilagseksport":"Månedlig regnskapsrapport"} — {periode}
              </div>
              {[
                {fmt:"Tripletex CSV",icon:"📊",sub:"Direkte import i Tripletex → Regnskap → Importer bilag"},
                {fmt:"Standard Visma/SAF-T XML",icon:"📄",sub:"SAF-T format — norsk standard for regnskapsdata"},
                {fmt:"PDF rapport",icon:"🖨️",sub:"Lesbar rapport for revisor og styret"},
              ].map(f=>(
                <div key={f.fmt} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:9,border:`1.5px solid ${C.border}`,cursor:"pointer",marginBottom:8,background:"white",transition:"all .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.green}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                  <span style={{fontSize:22}}>{f.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.navy}}>{f.fmt}</div>
                    <div style={{fontSize:10,color:C.soft}}>{f.sub}</div>
                  </div>
                  <button className="btn bp" style={{fontSize:10,padding:"5px 12px",borderRadius:7}}>Last ned</button>
                </div>
              ))}
              <div style={{background:C.greenXL,borderRadius:9,padding:"9px 12px",fontSize:10,color:C.navyMid,lineHeight:1.6,marginTop:4}}>
                💡 Tripletex-importen bruker bankfeed-matching automatisk. Kontaktperson: din regnskapsfører.
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Periode-velger + handlinger */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",gap:6}}>
          {maaneder.map(m=>(
            <button key={m} onClick={()=>setPeriode(m)} style={{padding:"6px 14px",borderRadius:50,fontSize:11,fontWeight:periode===m?600:400,border:periode===m?`1.5px solid ${C.green}`:`1px solid ${C.border}`,background:periode===m?C.greenBg:"white",color:periode===m?C.green:C.soft,cursor:"pointer",fontFamily:"inherit"}}>
              {m==="mars-2026"?"Mars 2026":m==="feb-2026"?"Feb 2026":"Jan 2026"}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setEksportModal("daglig")} style={{fontSize:11,padding:"7px 14px",borderRadius:9,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>📤 Eksporter bilag</button>
          <button onClick={()=>setEksportModal("maanedlig")} className="btn bp" style={{fontSize:11,padding:"7px 14px",borderRadius:9}}>📊 Månedlig rapport</button>
        </div>
      </div>

      {/* KPI-strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:20}}>
        <Kort label="Brutto inntekt" value={`${((t.inntektB2C+t.inntektB2B)/1000).toFixed(1)}k kr`} sub={`B2C: ${(t.inntektB2C/1000).toFixed(1)}k · B2B: ${(t.inntektB2B/1000).toFixed(1)}k`} icon="💰" color={C.green}/>
        <Kort label="Refusjoner / krediteringer" value={`-${((t.refusjonerB2C+t.kreditnoterB2B)/1000).toFixed(1)}k kr`} sub={`B2C: ${t.refusjonerB2C} · B2B: ${t.kreditnoterB2B}`} icon="↩️" color={C.danger}/>
        <Kort label="Netto inntekt" value={`${(t.nettoInntekt/1000).toFixed(1)}k kr`} sub="Etter refusjoner og kreditnoter" icon="📈" color={C.sky}/>
        <Kort label="Driftskostnader" value={`${(t.kostnader/1000).toFixed(1)}k kr`} sub="Lønn, drift, lisenser" icon="📉"/>
        <Kort label="Driftsresultat" value={`${(t.resultat/1000).toFixed(1)}k kr`} sub={`Margin: ${Math.round(t.resultat/t.nettoInntekt*100)}%`} icon="🏦" color={t.resultat>0?C.green:C.danger}/>
        <Kort label="Oppdrag gjennomført" value={t.antOppdrag} sub="Fakturerte oppdrag" icon="✅"/>
      </div>

      {/* To-kolonne: daglig bilag + Tripletex-status */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(400px,1fr))",gap:16,marginBottom:20}}>

        {/* Daglig bilagslogg */}
        <div className="card">
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>Daglig bilagslogg</span>
            <div style={{display:"flex",gap:5}}>
              <span style={{fontSize:9,background:"#F0FDF4",color:"#16A34A",padding:"2px 8px",borderRadius:50,fontWeight:600}}>5 matchet</span>
              <span style={{fontSize:9,background:C.dangerBg,color:C.danger,padding:"2px 8px",borderRadius:50,fontWeight:600}}>1 avvik</span>
            </div>
          </div>
          {dagligBilag.map((b,i)=>(
            <div key={b.ref} style={{padding:"10px 16px",borderBottom:i<dagligBilag.length-1?`1px solid ${C.border}`:"none",background:b.status==="avvik"?"#FFFBFB":"white"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:b.status==="matchet"?"#16A34A":C.danger,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:1}}>
                    <span style={{fontSize:11,fontWeight:600,color:C.navy}}>{b.type}</span>
                    {b.status==="avvik"&&<span style={{fontSize:9,background:C.dangerBg,color:C.danger,padding:"1px 6px",borderRadius:50,fontWeight:600}}>⚠️ Avvik</span>}
                  </div>
                  <div style={{display:"flex",gap:8,fontSize:9,color:C.soft}}>
                    <span>{b.dato}</span>
                    <span style={{fontFamily:"monospace"}}>{b.ref}</span>
                    {b.tripletexRef&&<span style={{color:C.green,fontFamily:"monospace"}}>{b.tripletexRef}</span>}
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.navy}}>{b.netto.toLocaleString("nb-NO")} kr</div>
                  {b.refusjoner>0&&<div style={{fontSize:9,color:C.danger}}>-{b.refusjoner} ref.</div>}
                </div>
              </div>
              {b.status==="avvik"&&(
                <div style={{marginTop:7,padding:"6px 10px",background:C.dangerBg,borderRadius:7,fontSize:10,color:C.danger,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>Bankfeed ikke matchet — manuell kontroll nødvendig</span>
                  <button style={{fontSize:10,padding:"2px 9px",background:C.danger,color:"white",border:"none",borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>Løs</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tripletex integrasjonsstatus */}
        <div>
          <div className="card" style={{marginBottom:12}}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
              <span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>Tripletex integrasjon</span>
            </div>
            <div style={{padding:"14px 16px"}}>
              {[
                {modul:"Bankfeed (DNB)",status:"aktiv",detalj:"Automatisk matching · Sist synkronisert: i dag 06:00",ok:true},
                {modul:"EHF/PEPPOL-faktura",status:"aktiv",detalj:"Fakturerer kommuner direkte fra Tripletex",ok:true},
                {modul:"Vipps-bilag",status:"aktiv",detalj:"Daglig CSV-import via Tripletex API",ok:true},
                {modul:"Lønn",status:"ikke satt opp",detalj:"Tripletex Lønn — må konfigureres",ok:false},
                {modul:"Årsoppgjør",status:"ikke aktuelt",detalj:"Aktiveres Nov/Des 2026",ok:null},
              ].map(m=>(
                <div key={m.modul} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:m.ok===true?"#16A34A":m.ok===false?C.danger:"#D1D5DB",flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{m.modul}</div>
                    <div style={{fontSize:10,color:C.soft}}>{m.detalj}</div>
                  </div>
                  <span style={{fontSize:9,padding:"2px 8px",borderRadius:50,fontWeight:600,
                    background:m.ok===true?"#F0FDF4":m.ok===false?C.dangerBg:C.softBg,
                    color:m.ok===true?"#16A34A":m.ok===false?C.danger:C.soft}}>
                    {m.status}
                  </span>
                </div>
              ))}
              <button onClick={()=>{window.open("https://tripletex.no","_blank");}} className="btn bp" style={{width:"100%",marginTop:12,padding:"9px 0",fontSize:12,borderRadius:9}}>
                Åpne Tripletex →
              </button>
            </div>
          </div>

          {/* Neste handlinger */}
          <div className="card">
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
              <span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>Neste handlinger</span>
            </div>
            <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:8}}>
              {[
                {prioritet:"høy",tekst:"Løs bilagsavvik 17. mars",detalj:"Vipps-bilag ikke matchet mot bank",color:C.danger,icon:"⚠️"},
                {prioritet:"høy",tekst:"Sett opp Tripletex Lønn",detalj:"Nødvendig for A-melding og arbeidsgiveravgift",color:C.danger,icon:"🧾"},
                {prioritet:"medium",tekst:"Avklar MVA-status med revisor",detalj:"Besøksvenn og Trilleturer — risiko for etterbetaling",color:C.gold,icon:"⚖️"},
                {prioritet:"lav",tekst:"Aktiver Tripletex Årsoppgjør",detalj:"Sett opp mot regnskapsfører",color:C.soft,icon:"📅"},
              ].map((h,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"9px 12px",borderRadius:9,background:h.prioritet==="høy"?C.dangerBg:h.prioritet==="medium"?C.goldBg:C.softBg,border:`1px solid ${h.color}22`}}>
                  <span style={{fontSize:16}}>{h.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{h.tekst}</div>
                    <div style={{fontSize:10,color:C.soft}}>{h.detalj}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MVA-status per tjeneste */}
      <div className="card">
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <span className="fr" style={{fontSize:14,fontWeight:600,color:C.navy}}>MVA-status per tjeneste</span>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <span style={{fontSize:9,background:"#F0FDF4",color:"#16A34A",padding:"2px 10px",borderRadius:50,fontWeight:600}}>✓ Lav risiko: 5</span>
            <span style={{fontSize:9,background:C.goldBg,color:C.goldDark,padding:"2px 10px",borderRadius:50,fontWeight:600}}>⚠ Medium: 2</span>
            <span style={{fontSize:9,background:C.dangerBg,color:C.danger,padding:"2px 10px",borderRadius:50,fontWeight:600}}>🔴 Høy: 2</span>
          </div>
        </div>
        <div style={{padding:"10px 16px 4px"}}>
          <div style={{background:"#FFF3E0",borderRadius:9,padding:"9px 12px",marginBottom:12,fontSize:10,color:"#92400E",lineHeight:1.6,border:"1px solid #FDE68A"}}>
            ⚖️ <strong>Viktig:</strong> MVA-sats er satt til 0% (unntatt) for alle tjenester inntil videre. Tjenester merket "Avklares" kan risikere etterbetaling av 25% MVA hvis Skatteetaten klassifiserer dem som velferdstjenester. <strong>Avklar med revisor før lansering.</strong>
          </div>
        </div>
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Tjeneste</th><th>Kategori</th><th>MVA-sats</th><th>Risikonivå</th><th>Notat</th></tr></thead>
            <tbody>
              {mvaStatus.map(m=>(
                <tr key={m.tjeneste} style={{background:m.risiko==="høy"?"#FFFBFB":m.risiko==="medium"?"#FFFDF5":"white"}}>
                  <td style={{fontWeight:600}}>{m.tjeneste}</td>
                  <td style={{fontSize:11,color:C.soft}}>{m.kategori}</td>
                  <td>
                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:50,fontWeight:600,
                      background:m.sats.includes("0%")?"#F0FDF4":C.softBg,
                      color:m.sats.includes("0%")?"#16A34A":C.navyMid}}>
                      {m.sats}
                    </span>
                  </td>
                  <td>
                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:50,fontWeight:600,
                      background:m.risiko==="lav"?"#F0FDF4":m.risiko==="medium"?C.goldBg:C.dangerBg,
                      color:m.risiko==="lav"?"#16A34A":m.risiko==="medium"?C.goldDark:C.danger}}>
                      {m.risiko==="lav"?"✓ Lav":m.risiko==="medium"?"⚠ Medium":"🔴 Høy"}
                    </span>
                  </td>
                  <td style={{fontSize:10,color:C.soft}}>{m.notat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
    }
    </div>
  );
}

function InnstillingerPage(){
  const{toast,ToastContainer}=useToast();
  const VARSEL_TYPER=[
    {key:"nyBestilling", label:"Ny bestilling",      ikon:"📋", sub:"Umiddelbart ved ny ordre"},
    {key:"betaling",     label:"Betaling",            ikon:"💳", sub:"Mottatt eller feilet (Vipps/Stripe/EHF)"},
    {key:"avvik",        label:"Avvik & hendelser",   ikon:"⚠️", sub:"SEV1/SEV2 og innsjekk-avvik"},
    {key:"dagrapport",   label:"Dagsrapport",         ikon:"📊", sub:"Sammendrag kl. 21:00 hver dag"},
    {key:"ukesrapport",  label:"Ukesrapport",         ikon:"📅", sub:"Sammendrag mandag morgen"},
    {key:"lonn",         label:"Lønnskjøring",        ikon:"💰", sub:"Bekreftelse og avvik ved lønnskjøring"},
    {key:"vikarVarsel",  label:"Vikar-tilkalling",    ikon:"🤝", sub:"Ingen vikar funnet innen fristen"},
    {key:"kreditering",  label:"Krediteringer",       ikon:"↩️", sub:"Refusjon over 1 000 kr godkjent"},
  ];
  const initMottakere=[
    {id:"m1",navn:"Lise Andersen",epost:"lise@eiranova.no",rolle:"Daglig leder",
     varsler:{nyBestilling:true,betaling:true,avvik:true,dagrapport:true,ukesrapport:true,lonn:true,vikarVarsel:true,kreditering:true},
     kanal:{epost:true,push:true,sms:false},aktiv:true},
    {id:"m2",navn:"Ko-founder 2",epost:"partner@eiranova.no",rolle:"Medeier",
     varsler:{nyBestilling:false,betaling:true,avvik:true,dagrapport:false,ukesrapport:true,lonn:true,vikarVarsel:false,kreditering:true},
     kanal:{epost:true,push:false,sms:false},aktiv:true},
    {id:"m3",navn:"Ko-founder 3",epost:"founder3@eiranova.no",rolle:"Medeier",
     varsler:{nyBestilling:false,betaling:false,avvik:false,dagrapport:false,ukesrapport:true,lonn:true,vikarVarsel:false,kreditering:false},
     kanal:{epost:true,push:false,sms:false},aktiv:true},
  ];
  const[mottakere,setMottakere]=useState(initMottakere);
  const[mottakerModal,setMottakerModal]=useState(null); // null | "ny" | mottaker-obj
  const[mottakerForm,setMottakerForm]=useState({id:"",navn:"",epost:"",rolle:"",varsler:Object.fromEntries(VARSEL_TYPER.map(v=>[v.key,false])),kanal:{epost:true,push:false,sms:false},aktiv:true});
  const[areas,setAreas]=useState([
    {id:"moss",       name:"Moss",        fylke:"Østfold",aktiv:true, apner:"07:00",stenges:"20:00"},
    {id:"fredrikstad",name:"Fredrikstad", fylke:"Østfold",aktiv:true, apner:"07:00",stenges:"20:00"},
    {id:"sarpsborg",  name:"Sarpsborg",   fylke:"Østfold",aktiv:true, apner:"07:00",stenges:"18:00"},
    {id:"råde",       name:"Råde",        fylke:"Østfold",aktiv:false,apner:"08:00",stenges:"17:00"},
    {id:"vestby",     name:"Vestby",      fylke:"Akershus",aktiv:true,apner:"07:00",stenges:"20:00"},
    {id:"ås",         name:"Ås",          fylke:"Akershus",aktiv:false,apner:"08:00",stenges:"17:00"},
    {id:"ski",        name:"Ski",         fylke:"Akershus",aktiv:true, apner:"07:00",stenges:"20:00"},
  ]);
  const[areaModal,setAreaModal]=useState(null); // null | "ny" | area-obj
  const[areaForm,setAreaForm]=useState({id:"",name:"",fylke:"",aktiv:true,apner:"07:00",stenges:"20:00"});
  const[showKey,setShowKey]=useState({});
  const[b2bAktiv,setB2bAktiv]=useState(true);
  const[b2bBekreft,setB2bBekreft]=useState(false);
  // ── Journal-modul toggle (samme mønster som B2B) ──────────────
  const[journalAktiv,setJournalAktiv]=useState(false);
  const[journalModus,setJournalModus]=useState("ekstern"); // "ekstern" | "intern"
  const[journalEksternUrl,setJournalEksternUrl]=useState("");
  const[journalEksternNavn,setJournalEksternNavn]=useState("CGM Pridok");
  const[journalBekreft,setJournalBekreft]=useState(false);

  const Toggle=({on,onToggle})=>(
    <button type="button" className="settings-toggle" onClick={onToggle} aria-pressed={on} style={{background:on?"#4A7C6F":"#D1D5DB"}}>
      <span style={{position:"absolute",top:4,left:on?26:4,width:22,height:22,borderRadius:"50%",background:"white",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)",pointerEvents:"none"}}/>
    </button>
  );
  const Section=({title,icon,children})=>(
    <div className="card" style={{marginBottom:18}}>
      <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:9}}>
        <span style={{fontSize:18}}>{icon}</span>
        <span className="fr" style={{fontSize:15,fontWeight:600,color:C.navy}}>{title}</span>
      </div>
      <div style={{padding:"16px 18px"}}>{children}</div>
    </div>
  );
  const Field=({label,value,type="text",hint})=>(
    <div style={{marginBottom:14}}>
      <label style={{fontSize:12,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>{label}</label>
      <input defaultValue={value} type={type} className="inp" style={{width:"100%"}}/>
      {hint&&<div style={{fontSize:10,color:C.soft,marginTop:3}}>{hint}</div>}
    </div>
  );

  return(
    <div className="fu" style={{width:"100%",maxWidth:780,margin:"0 auto"}}>

      {/* ── B2B bekreftelsesmodal ── */}
      {b2bBekreft&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.45)",padding:20}}>
          <div style={{background:"white",borderRadius:16,width:"100%",maxWidth:440,boxShadow:"0 20px 60px rgba(0,0,0,.22)",padding:"24px"}}>
            <div style={{fontSize:32,textAlign:"center",marginBottom:12}}>{b2bAktiv?"⚠️":"🏢"}</div>
            <div style={{fontSize:15,fontWeight:700,color:C.navy,textAlign:"center",marginBottom:8}}>
              {b2bAktiv?"Deaktiver B2B-funksjoner?":"Aktiver B2B-funksjoner?"}
            </div>
            <div style={{fontSize:12,color:C.soft,textAlign:"center",marginBottom:14,lineHeight:1.7}}>
              {b2bAktiv
                ?<>Dette vil <strong>skjule B2B-portalen</strong>, deaktivere B2B-innlogging og fjerne B2B-fanene i adminpanelet. Eksisterende kunder og fakturaer påvirkes ikke.</>
                :<>Dette vil <strong>aktivere B2B-portalen</strong>, B2B-innlogging og alle B2B-funksjoner i adminpanelet.</>
              }
            </div>
            {b2bAktiv&&(
              <div style={{background:C.dangerBg,borderRadius:9,padding:"10px 13px",marginBottom:16,fontSize:10,color:C.danger,lineHeight:1.6}}>
                ⚠️ B2B-kunder vil ikke kunne logge inn eller gjøre bestillinger mens funksjonen er deaktivert.
              </div>
            )}
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setB2bBekreft(false)} style={{flex:1,padding:"10px 0",fontSize:12,borderRadius:10,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>Avbryt</button>
              <button onClick={()=>{setB2bAktiv(v=>!v);setB2bBekreft(false);}}
                style={{flex:1,padding:"10px 0",fontSize:12,borderRadius:10,background:b2bAktiv?C.danger:C.green,color:"white",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
                {b2bAktiv?"Deaktiver B2B":"Aktiver B2B"}
              </button>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── B2B Global toggle — øverst ── */}
      <div style={{borderRadius:14,border:`2px solid ${b2bAktiv?C.green:C.danger}`,background:b2bAktiv?C.greenXL:C.dangerBg,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <div style={{width:48,height:48,borderRadius:12,background:b2bAktiv?C.green:C.danger,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>🏢</div>
        <div style={{flex:1,minWidth:180}}>
          <div style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:3}}>
            B2B-funksjoner — {b2bAktiv?<span style={{color:C.green}}>Aktiv</span>:<span style={{color:C.danger}}>Deaktivert</span>}
          </div>
          <div style={{fontSize:11,color:C.navyMid,lineHeight:1.6}}>
            {b2bAktiv
              ?"B2B-portal, innlogging, fakturering og adminpanel-faner er synlige og operative."
              :"B2B-portalen og innlogging er skjult. Adminpanel viser ikke B2B-faner. Eksisterende data beholdes."
            }
          </div>
          {b2bAktiv&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>
              {["✓ B2B-portal",`✓ Koordinator-innlogging`,"✓ EHF/PEPPOL-faktura","✓ Rammeavtaler","✓ Admin B2B-fane"].map(t=>(
                <span key={t} style={{fontSize:9,background:"white",color:C.green,padding:"2px 8px",borderRadius:50,fontWeight:600,border:`1px solid ${C.border}`}}>{t}</span>
              ))}
            </div>
          )}
          {!b2bAktiv&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>
              {["✗ B2B-portal skjult","✗ Innlogging blokkert","✗ EHF-faktura stanset","✗ Rammeavtaler inaktive"].map(t=>(
                <span key={t} style={{fontSize:9,background:"white",color:C.danger,padding:"2px 8px",borderRadius:50,fontWeight:600,border:`1px solid rgba(225,29,72,.2)`}}>{t}</span>
              ))}
            </div>
          )}
        </div>
        <button onClick={()=>setB2bBekreft(true)}
          style={{padding:"10px 22px",fontSize:12,fontWeight:600,borderRadius:10,cursor:"pointer",fontFamily:"inherit",border:"none",background:b2bAktiv?C.danger:C.green,color:"white",flexShrink:0}}>
          {b2bAktiv?"Deaktiver B2B":"Aktiver B2B"}
        </button>
      </div>

      {/* ── Journal bekreftelsesmodal ── */}
      {journalBekreft&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.45)",padding:20}}>
          <div style={{background:"white",borderRadius:16,width:"100%",maxWidth:460,boxShadow:"0 20px 60px rgba(0,0,0,.22)",padding:"24px"}}>
            <div style={{fontSize:32,textAlign:"center",marginBottom:12}}>{journalAktiv?"⚠️":"📋"}</div>
            <div style={{fontSize:15,fontWeight:700,color:C.navy,textAlign:"center",marginBottom:8}}>
              {journalAktiv?"Deaktiver journalmodulen?":"Aktiver journalmodulen?"}
            </div>
            <div style={{fontSize:12,color:C.soft,textAlign:"center",marginBottom:14,lineHeight:1.7}}>
              {journalAktiv
                ?<>Dette vil <strong>skjule journalfunksjonen</strong> for alle sykepleiere. Eksisterende journaldata beholdes.</>
                :<>Dette aktiverer <strong>journalfunksjonen</strong> for sykepleiere i henhold til valgt modus.</>
              }
            </div>
            {!journalAktiv&&(
              <div style={{marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:8}}>Velg journalmodus:</div>
                {[["ekstern","🔗 Ekstern EPJ","Sykepleier åpner ekstern EPJ-løsning (CGM Pridok, Aidn) i nettleseren via knapp i appen. Raskest å aktivere — 1–2 dagers arbeid."],
                  ["intern","🏠 Intern journal","Journal lagres direkte i EiraNova-appen (Supabase). Krever K-JOURNAL-001 ferdig og NHN-sertifisering."]
                ].map(([m,label,sub])=>(
                  <div key={m} onClick={()=>setJournalModus(m)}
                    style={{padding:"11px 14px",borderRadius:10,border:`2px solid ${journalModus===m?C.green:C.border}`,background:journalModus===m?C.greenXL:"white",cursor:"pointer",marginBottom:8}}>
                    <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:3}}>{label}</div>
                    <div style={{fontSize:10,color:C.soft,lineHeight:1.5}}>{sub}</div>
                  </div>
                ))}
                {journalModus==="ekstern"&&(
                  <div style={{marginTop:10}}>
                    <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:6}}>EPJ-system og URL:</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                      {["CGM Pridok","Aidn","Visma Flyt Helse","Annet"].map(n=>(
                        <div key={n} onClick={()=>setJournalEksternNavn(n)}
                          style={{padding:"7px 10px",borderRadius:8,border:`1.5px solid ${journalEksternNavn===n?C.green:C.border}`,background:journalEksternNavn===n?C.greenXL:"white",cursor:"pointer",fontSize:11,fontWeight:journalEksternNavn===n?600:400,color:C.navy,textAlign:"center"}}>
                          {n}
                        </div>
                      ))}
                    </div>
                    <input value={journalEksternUrl} onChange={e=>setJournalEksternUrl(e.target.value)}
                      placeholder="https://minvirksomhet.pridok.no"
                      style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:11,fontFamily:"inherit",background:C.greenXL,color:C.navy,outline:"none",boxSizing:"border-box"}}/>
                    <div style={{fontSize:9,color:C.soft,marginTop:4}}>Sykepleier-appen åpner denne URL-en når de trykker «Åpne journal»</div>
                  </div>
                )}
              </div>
            )}
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setJournalBekreft(false)} style={{flex:1,padding:"10px 0",fontSize:12,borderRadius:10,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>Avbryt</button>
              <button onClick={()=>{setJournalAktiv(v=>!v);setJournalBekreft(false);toast(journalAktiv?"Journalmodul deaktivert":"Journalmodul aktivert — "+journalModus);}}
                style={{flex:1,padding:"10px 0",fontSize:12,borderRadius:10,background:journalAktiv?C.danger:C.green,color:"white",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
                {journalAktiv?"Deaktiver journal":"Aktiver journal"}
              </button>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── Journalmodul-toggle ── */}
      <div style={{borderRadius:14,border:`2px solid ${journalAktiv?(journalModus==="intern"?"#6D28D9":C.green):C.border}`,background:journalAktiv?(journalModus==="intern"?"#F5F3FF":C.greenXL):"#F9FAFB",padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <div style={{width:48,height:48,borderRadius:12,background:journalAktiv?(journalModus==="intern"?"#6D28D9":C.green):"#D1D5DB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>📋</div>
        <div style={{flex:1,minWidth:180}}>
          <div style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:3}}>
            Journalmodul —{" "}
            {journalAktiv
              ?<span style={{color:journalModus==="intern"?"#6D28D9":C.green}}>{journalModus==="intern"?"Intern (EiraNova)":"Ekstern EPJ"}</span>
              :<span style={{color:C.soft}}>Deaktivert</span>
            }
          </div>
          <div style={{fontSize:11,color:C.navyMid,lineHeight:1.6}}>
            {journalAktiv&&journalModus==="ekstern"
              ?<>Sykepleiere ser «Åpne journal»-knapp i appen. Trykk → åpner <strong>{journalEksternNavn||"ekstern EPJ"}</strong> i nettleseren. Journal lagres hos ekstern leverandør.</>
              :journalAktiv&&journalModus==="intern"
              ?<>Journal lagres direkte i EiraNova (Supabase). Full audit-log, pasientinnsyn og internkontroll aktivert. Krever NHN-sertifisering.</>
              :"Journalmodulen er deaktivert. Sykepleiere ser ingen journal-funksjon i appen. Ingen journalplikt aktiv."
            }
          </div>
          {journalAktiv&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>
              {(journalModus==="ekstern"
                ?["✓ Ekstern EPJ aktiv",`✓ ${journalEksternNavn||"EPJ"}`,`✓ ${journalEksternUrl||"URL satt"}`,]
                :["✓ Intern journal","✓ Supabase lagring","✓ Audit-log","✓ Pasientinnsyn"]
              ).map(t=>(
                <span key={t} style={{fontSize:9,background:"white",color:journalModus==="intern"?"#6D28D9":C.green,padding:"2px 8px",borderRadius:50,fontWeight:600,border:`1px solid ${C.border}`}}>{t}</span>
              ))}
            </div>
          )}
          {!journalAktiv&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>
              {["Ingen journalplikt aktiv","Stell ikke aktivert","Start med K-JOURNAL-EXT-001"].map(t=>(
                <span key={t} style={{fontSize:9,background:"white",color:C.soft,padding:"2px 8px",borderRadius:50,fontWeight:600,border:`1px solid ${C.border}`}}>{t}</span>
              ))}
            </div>
          )}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,flexShrink:0,alignItems:"flex-end"}}>
          {journalAktiv&&(
            <select value={journalModus} onChange={e=>setJournalModus(e.target.value)}
              style={{padding:"6px 10px",fontSize:11,borderRadius:8,border:`1.5px solid ${C.border}`,background:"white",cursor:"pointer",fontFamily:"inherit",color:C.navy}}>
              <option value="ekstern">🔗 Ekstern EPJ</option>
              <option value="intern">🏠 Intern journal</option>
            </select>
          )}
          <button onClick={()=>setJournalBekreft(true)}
            style={{padding:"10px 22px",fontSize:12,fontWeight:600,borderRadius:10,cursor:"pointer",fontFamily:"inherit",border:"none",background:journalAktiv?C.danger:C.green,color:"white"}}>
            {journalAktiv?"Deaktiver journal":"Aktiver journal"}
          </button>
        </div>
      </div>

      {/* ── Regnskap-notat ── */}
      <div style={{background:"#EFF6FF",borderRadius:12,padding:"12px 16px",marginBottom:20,border:"1px solid rgba(37,99,235,.15)",fontSize:11,color:"#1e40af",lineHeight:1.7}}>
        <div style={{fontWeight:700,marginBottom:4}}>📊 Regnskapsoppsett — Tripletex for alt</div>
        <div>EiraNova bruker <strong>Tripletex</strong> som master for hele regnskapet — både B2C og B2B. Fiken ble vurdert, men valgt bort fordi Tripletex håndterer lønn, A-melding og PEPPOL i ett system. <strong>Merk:</strong> Tripletex kan sende EHF/PEPPOL direkte til kommuner, men om ønskelig kan Fiken brukes som ren PEPPOL-gateway (sending-adapter) mens Tripletex bokfører.</div>
      </div>

      {/* ── Organisasjon ── */}
      <Section title="Organisasjon" icon="🏢">
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:0}}>
          <div style={{paddingRight:16}}>
            <Field label="Organisasjonsnavn" value="EiraNova AS"/>
            <Field label="Org.nr" value="923 456 789" hint="Brukes på fakturaer og EHF"/>
            <Field label="Kontakt-epost" value="post@eiranova.no"/>
          </div>
          <div>
            <Field label="Telefon" value="900 12 345"/>
            <Field label="Adresse" value="Storgata 1, 1530 Moss"/>
            <Field label="Nettside" value="eiranova.no"/>
          </div>
        </div>
        <button className="btn bp" style={{padding:"8px 20px",fontSize:12,borderRadius:9,marginTop:4}}>Lagre endringer</button>
      </Section>

      {/* ── Notifikasjoner ── */}
      {mottakerModal&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.48)",padding:20}}>
          <div style={{background:"white",borderRadius:18,width:"100%",maxWidth:540,maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
            <div style={{padding:"16px 20px",background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,borderRadius:"18px 18px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:2}}>{mottakerModal==="ny"?"Ny varslingsmottaker":"Rediger mottaker"}</div>
                <div style={{fontSize:15,fontWeight:600,color:"white"}}>{mottakerForm.navn||"Ny mottaker"}</div>
              </div>
              <button onClick={()=>setMottakerModal(null)} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:15}}>×</button>
            </div>
            <div style={{padding:"18px 20px"}}>
              {/* Basis */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Navn</label>
                  <input value={mottakerForm.navn} onChange={e=>setMottakerForm(f=>({...f,navn:e.target.value}))}
                    style={{width:"100%",padding:"9px 11px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}} placeholder="Fullt navn"/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Rolle</label>
                  <input value={mottakerForm.rolle} onChange={e=>setMottakerForm(f=>({...f,rolle:e.target.value}))}
                    style={{width:"100%",padding:"9px 11px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}} placeholder="F.eks. Daglig leder"/>
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>E-postadresse</label>
                <input type="email" value={mottakerForm.epost} onChange={e=>setMottakerForm(f=>({...f,epost:e.target.value}))}
                  style={{width:"100%",padding:"9px 11px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}} placeholder="navn@eiranova.no"/>
              </div>
              {/* Kanaler */}
              <div style={{marginBottom:14}}>
                <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:8}}>Varslingskanaler</label>
                <div style={{display:"flex",gap:8}}>
                  {[["epost","📧 E-post"],["push","📱 Push"],["sms","💬 SMS"]].map(([k,l])=>(
                    <div key={k} onClick={()=>setMottakerForm(f=>({...f,kanal:{...f.kanal,[k]:!f.kanal[k]}}))}
                      style={{flex:1,padding:"8px 10px",borderRadius:9,border:`2px solid ${mottakerForm.kanal[k]?C.green:C.border}`,background:mottakerForm.kanal[k]?C.greenXL:"white",cursor:"pointer",textAlign:"center",fontSize:11,fontWeight:mottakerForm.kanal[k]?600:400,color:mottakerForm.kanal[k]?C.navy:C.soft}}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
              {/* Varseltyper */}
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy}}>Varseltyper</label>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>setMottakerForm(f=>({...f,varsler:Object.fromEntries(VARSEL_TYPER.map(v=>[v.key,true]))}))}
                      style={{fontSize:9,padding:"2px 8px",background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,borderRadius:5,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Velg alle</button>
                    <button onClick={()=>setMottakerForm(f=>({...f,varsler:Object.fromEntries(VARSEL_TYPER.map(v=>[v.key,false]))}))}
                      style={{fontSize:9,padding:"2px 8px",background:C.softBg,color:C.soft,border:`1px solid ${C.border}`,borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>Fjern alle</button>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {VARSEL_TYPER.map(v=>(
                    <div key={v.key} onClick={()=>setMottakerForm(f=>({...f,varsler:{...f.varsler,[v.key]:!f.varsler[v.key]}}))}
                      style={{display:"flex",alignItems:"center",gap:10,padding:"8px 11px",borderRadius:8,border:`1.5px solid ${mottakerForm.varsler[v.key]?C.green:C.border}`,background:mottakerForm.varsler[v.key]?C.greenXL:"white",cursor:"pointer",transition:"all .12s"}}>
                      <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${mottakerForm.varsler[v.key]?C.green:C.border}`,background:mottakerForm.varsler[v.key]?C.green:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"white",fontWeight:700,flexShrink:0}}>
                        {mottakerForm.varsler[v.key]?"✓":""}
                      </div>
                      <span style={{fontSize:16,flexShrink:0}}>{v.ikon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{v.label}</div>
                        <div style={{fontSize:9,color:C.soft}}>{v.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                {mottakerModal!=="ny"&&(
                  <button onClick={()=>{setMottakere(p=>p.filter(m=>m.id!==mottakerForm.id));setMottakerModal(null);}}
                    style={{padding:"9px 13px",fontSize:11,borderRadius:9,background:C.dangerBg,color:C.danger,border:`1px solid rgba(225,29,72,.2)`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>🗑</button>
                )}
                <button onClick={()=>setMottakerModal(null)} style={{padding:"9px 13px",fontSize:11,borderRadius:9,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>Avbryt</button>
                <button onClick={()=>{
                  if(mottakerModal==="ny"){
                    setMottakere(p=>[...p,{...mottakerForm,id:"m"+(p.length+1)}]);
                  } else {
                    setMottakere(p=>p.map(m=>m.id===mottakerForm.id?{...mottakerForm}:m));
                  }
                  setMottakerModal(null);
                }} className="btn bp" style={{flex:1,padding:"9px 0",fontSize:12,borderRadius:9,opacity:mottakerForm.navn&&mottakerForm.epost?1:.5}}>
                  {mottakerModal==="ny"?"+ Legg til":"✓ Lagre"}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      <Section title="Notifikasjoner" icon="🔔">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:11,color:C.soft}}>Hvem mottar varsler og for hvilke hendelser?</div>
          <button onClick={()=>{setMottakerForm({id:"",navn:"",epost:"",rolle:"",varsler:Object.fromEntries(VARSEL_TYPER.map(v=>[v.key,false])),kanal:{epost:true,push:false,sms:false},aktiv:true});setMottakerModal("ny");}}
            style={{fontSize:11,padding:"5px 13px",background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,borderRadius:7,cursor:"pointer",fontFamily:"inherit",fontWeight:600,whiteSpace:"nowrap"}}>
            + Legg til mottaker
          </button>
        </div>

        {/* Mottakere */}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
          {mottakere.map(m=>{
            const aktiveVarsler=VARSEL_TYPER.filter(v=>m.varsler[v.key]);
            return(
              <div key={m.id} style={{borderRadius:11,border:`1.5px solid ${C.border}`,overflow:"hidden",background:m.aktiv?"white":C.softBg,opacity:m.aktiv?1:.6}}>
                {/* Header */}
                <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${C.border}`,background:C.greenXL}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDark},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"white",flexShrink:0}}>
                    {m.navn.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:700,color:C.navy}}>{m.navn}</div>
                    <div style={{fontSize:10,color:C.soft}}>{m.rolle} · {m.epost}</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                    {/* Kanaler */}
                    {m.kanal.epost&&<span style={{fontSize:9,background:"#EFF6FF",color:C.sky,padding:"1px 6px",borderRadius:50,fontWeight:600}}>📧</span>}
                    {m.kanal.push&&<span style={{fontSize:9,background:C.greenBg,color:C.green,padding:"1px 6px",borderRadius:50,fontWeight:600}}>📱</span>}
                    {m.kanal.sms&&<span style={{fontSize:9,background:C.goldBg,color:C.goldDark,padding:"1px 6px",borderRadius:50,fontWeight:600}}>💬</span>}
                    <button onClick={()=>{setMottakerForm({...m});setMottakerModal(m);}}
                      style={{fontSize:10,padding:"3px 10px",background:"white",color:C.navy,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit",marginLeft:4}}>✏️</button>
                    <Toggle on={m.aktiv} onToggle={()=>setMottakere(p=>p.map(x=>x.id===m.id?{...x,aktiv:!x.aktiv}:x))}/>
                  </div>
                </div>
                {/* Varsler */}
                <div style={{padding:"8px 14px"}}>
                  {aktiveVarsler.length===0
                    ?<div style={{fontSize:10,color:C.soft,fontStyle:"italic"}}>Ingen aktive varsler — klikk ✏️ for å konfigurere</div>
                    :<div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {aktiveVarsler.map(v=>(
                        <span key={v.key} style={{fontSize:9,background:C.greenBg,color:C.green,padding:"2px 8px",borderRadius:50,fontWeight:500,border:`0.5px solid ${C.border}`}}>
                          {v.ikon} {v.label}
                        </span>
                      ))}
                    </div>
                  }
                </div>
              </div>
            );
          })}
        </div>

        {/* Varseltyper oversikt */}
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14}}>
          <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:10}}>Alle varseltyper</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:6}}>
            {VARSEL_TYPER.map(v=>{
              const antall=mottakere.filter(m=>m.aktiv&&m.varsler[v.key]).length;
              return(
                <div key={v.key} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,background:antall>0?C.greenXL:C.softBg,border:`1px solid ${antall>0?C.border:"transparent"}`}}>
                  <span style={{fontSize:15}}>{v.ikon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:10,fontWeight:600,color:C.navy}}>{v.label}</div>
                    <div style={{fontSize:9,color:C.soft,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.sub}</div>
                  </div>
                  <span style={{fontSize:10,fontWeight:700,color:antall>0?C.green:C.soft,flexShrink:0}}>{antall} mottaker{antall!==1?"e":""}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ── Dekningsområder ── */}
      {areaModal&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.45)",padding:20}}>
          <div style={{background:"white",borderRadius:16,width:"100%",maxWidth:420,boxShadow:"0 20px 60px rgba(0,0,0,.22)"}}>
            <div style={{padding:"15px 20px",background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,borderRadius:"16px 16px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:14,fontWeight:600,color:"white"}}>{areaModal==="ny"?"+ Nytt dekningsområde":"✏️ Rediger område"}</div>
              <button onClick={()=>setAreaModal(null)} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:14}}>×</button>
            </div>
            <div style={{padding:"18px 20px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Kommunenavn</label>
                  <input value={areaForm.name} onChange={e=>setAreaForm(f=>({...f,name:e.target.value}))}
                    style={{width:"100%",padding:"9px 11px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:13,fontFamily:"inherit",background:C.greenXL,fontWeight:600}}
                    placeholder="F.eks. Halden"/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Fylke</label>
                  <input value={areaForm.fylke} onChange={e=>setAreaForm(f=>({...f,fylke:e.target.value}))}
                    style={{width:"100%",padding:"9px 11px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}}
                    placeholder="F.eks. Østfold"/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Åpner</label>
                  <input type="time" value={areaForm.apner} onChange={e=>setAreaForm(f=>({...f,apner:e.target.value}))}
                    style={{width:"100%",padding:"9px 11px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Stenger</label>
                  <input type="time" value={areaForm.stenges} onChange={e=>setAreaForm(f=>({...f,stenges:e.target.value}))}
                    style={{width:"100%",padding:"9px 11px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}}/>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderTop:`1px solid ${C.border}`,marginBottom:16}}>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:C.navy}}>Aktivt område</div>
                  <div style={{fontSize:10,color:C.soft}}>Vises i bestillingsflyt og vikar-søk</div>
                </div>
                <Toggle on={areaForm.aktiv} onToggle={()=>setAreaForm(f=>({...f,aktiv:!f.aktiv}))}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                {areaModal!=="ny"&&(
                  <button onClick={()=>{setAreas(p=>p.filter(a=>a.id!==areaForm.id));setAreaModal(null);}}
                    style={{padding:"9px 13px",fontSize:11,borderRadius:9,background:C.dangerBg,color:C.danger,border:`1px solid rgba(225,29,72,.2)`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
                    🗑 Slett
                  </button>
                )}
                <button onClick={()=>setAreaModal(null)} style={{padding:"9px 13px",fontSize:11,borderRadius:9,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>Avbryt</button>
                <button onClick={()=>{
                  if(areaModal==="ny"){
                    const id=areaForm.name.toLowerCase().replace(/\s+/g,"-").replace(/[æ]/g,"ae").replace(/[øö]/g,"oe").replace(/[åä]/g,"aa");
                    setAreas(p=>[...p,{...areaForm,id}]);
                  } else {
                    setAreas(p=>p.map(a=>a.id===areaForm.id?{...areaForm}:a));
                  }
                  setAreaModal(null);
                }} className="btn bp" style={{flex:1,padding:"9px 0",fontSize:12,borderRadius:9,opacity:areaForm.name?1:.5}}>
                  {areaModal==="ny"?"+ Legg til":"✓ Lagre"}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      <Section title="Dekningsområder & åpningstider" icon="📍">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:11,color:C.soft}}>
            {areas.filter(a=>a.aktiv).length} aktive · {areas.filter(a=>!a.aktiv).length} inaktive
          </div>
          <button onClick={()=>{setAreaForm({id:"",name:"",fylke:"",aktiv:true,apner:"07:00",stenges:"20:00"});setAreaModal("ny");}}
            style={{fontSize:11,padding:"5px 13px",background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,borderRadius:7,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
            + Legg til kommune
          </button>
        </div>
        {/* Aktive */}
        {areas.filter(a=>a.aktiv).map((a,i,arr)=>(
          <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.border}`,flexWrap:"wrap"}}>
            <Toggle on={a.aktiv} onToggle={()=>setAreas(ar=>ar.map(x=>x.id===a.id?{...x,aktiv:!x.aktiv}:x))}/>
            <div style={{flex:"0 0 140px"}}>
              <div style={{fontSize:12,fontWeight:600,color:C.navy}}>📍 {a.name}</div>
              {a.fylke&&<div style={{fontSize:9,color:C.soft}}>{a.fylke}</div>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
              <span style={{fontSize:11,color:C.soft}}>Åpner</span>
              <input type="time" value={a.apner} onChange={e=>setAreas(ar=>ar.map(x=>x.id===a.id?{...x,apner:e.target.value}:x))}
                style={{width:80,padding:"4px 8px",border:`1px solid ${C.border}`,borderRadius:6,fontSize:11,fontFamily:"inherit",background:C.greenXL}}/>
              <span style={{fontSize:11,color:C.soft}}>Stenger</span>
              <input type="time" value={a.stenges} onChange={e=>setAreas(ar=>ar.map(x=>x.id===a.id?{...x,stenges:e.target.value}:x))}
                style={{width:80,padding:"4px 8px",border:`1px solid ${C.border}`,borderRadius:6,fontSize:11,fontFamily:"inherit",background:C.greenXL}}/>
            </div>
            <button onClick={()=>{setAreaForm({...a});setAreaModal(a);}}
              style={{fontSize:10,padding:"3px 10px",background:C.softBg,color:C.navyMid,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit"}}>
              ✏️
            </button>
          </div>
        ))}
        {/* Inaktive */}
        {areas.filter(a=>!a.aktiv).length>0&&(
          <div style={{marginTop:8}}>
            <div style={{fontSize:10,fontWeight:600,color:C.soft,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Inaktive</div>
            {areas.filter(a=>!a.aktiv).map(a=>(
              <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}`,opacity:.55}}>
                <Toggle on={false} onToggle={()=>setAreas(ar=>ar.map(x=>x.id===a.id?{...x,aktiv:true}:x))}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,color:C.soft}}>📍 {a.name}</div>
                  {a.fylke&&<div style={{fontSize:9,color:C.soft}}>{a.fylke}</div>}
                </div>
                <span style={{fontSize:10,color:C.soft}}>{a.apner}–{a.stenges}</span>
                <button onClick={()=>{setAreaForm({...a});setAreaModal(a);}}
                  style={{fontSize:10,padding:"3px 10px",background:C.softBg,color:C.navyMid,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit"}}>✏️</button>
              </div>
            ))}
          </div>
        )}
        <button onClick={()=>toast("Åpningstider lagret")} className="btn bp" style={{padding:"8px 20px",fontSize:12,borderRadius:9,marginTop:14}}>Lagre åpningstider</button>
      </Section>

      {/* ── Integrasjoner ── */}
      <Section title="Integrasjoner" icon="🔌">
        {[
          {navn:"Vipps MobilePay",status:"aktiv",detalj:"Merchant Serial: 123456 · ePayment API",color:"#FF5B24",icon:"💜"},
          {navn:"Stripe",status:"aktiv",detalj:"Live-modus · Automatiske utbetalinger aktiv",color:C.sky,icon:"💳"},
          {navn:"Tripletex (EHF/PEPPOL)",status:"aktiv",detalj:"Firma: eiranova · PEPPOL-registrert",color:"#2563EB",icon:"📄"},
          {navn:"Google Workspace",status:"aktiv",detalj:"Domain: eiranova.no · 6 aktive kontoer",color:"#1A73E8",icon:"🔷"},
          {navn:"Supabase",status:"aktiv",detalj:"eu-central-1 (Frankfurt) · Prosjekt: prod",color:"#3ECF8E",icon:"🗄️"},
        ].map(int=>(
          <div key={int.navn} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:36,height:36,borderRadius:9,background:`${int.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{int.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:2}}>{int.navn}</div>
              <div style={{fontSize:10,color:C.soft}}>{int.detalj}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#16A34A"}}/>
              <span style={{fontSize:10,color:"#16A34A",fontWeight:600}}>Aktiv</span>
            </div>
            <button style={{fontSize:10,padding:"4px 11px",background:C.softBg,color:C.navyMid,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit"}}>Konfigurer</button>
          </div>
        ))}
      </Section>

      {/* ── Faktura ── */}
      <Section title="B2B Fakturering" icon="🧾">
        <div style={{background:C.skyBg,borderRadius:9,padding:"9px 13px",fontSize:10,color:"#1e40af",lineHeight:1.6,marginBottom:16,border:"1px solid rgba(37,99,235,.15)"}}>
          <strong>Kun for B2B-kunder.</strong> Privatkunder betaler alltid ved bestilling (Vipps/kort) — ingen faktura eller purring for disse.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:0,marginBottom:14}}>
          <div style={{paddingRight:16}}>
            <Field label="Standard betalingsfrist (dager)" value="14" hint="Kommuner: 30 dager anbefalt"/>
            <Field label="Standard fakturatekst" value="Takk for din bestilling hos EiraNova AS."/>
          </div>
          <div>
            <Field label="Faktura-prefiks" value="EIR-2026-" hint="F.eks. EIR-2026-0043"/>
            <Field label="MVA-type helsetjenester" value="Unntatt (0%)" hint="Jf. merverdiavgiftsloven §3-2"/>
          </div>
        </div>
        <div style={{background:C.greenXL,borderRadius:9,padding:"9px 13px",fontSize:10,color:C.navyMid,lineHeight:1.6,marginBottom:14}}>
          <strong>EHF/PEPPOL:</strong> Fakturaer til kommuner og EHF-registrerte bedrifter sendes automatisk via Tripletex. Konfigurasjon under Integrasjoner → Tripletex.
        </div>
        <button className="btn bp" style={{padding:"8px 20px",fontSize:12,borderRadius:9}}>Lagre fakturainnstillinger</button>
      </Section>

      {/* ── Purring & Inkasso (kun B2B) ── */}
      <Section title="Purring & Inkasso — B2B" icon="⚖️">
        <div style={{background:"#FFF3E0",borderRadius:9,padding:"9px 13px",fontSize:10,color:"#92400E",lineHeight:1.6,marginBottom:16,border:"1px solid #FDE68A"}}>
          <strong>Norske regler:</strong> Maks purregebyr <strong>kr 70</strong> per purring (inkassoloven §17). Minimum <strong>14 dager</strong> mellom purring og inkassovarsel. Forsinkelsesrente: <strong>9,25% p.a.</strong> fra forfallsdato.
        </div>

        {/* Purre-flyt visuell */}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:10}}>Automatisk purreflyt</div>
          <div style={{display:"flex",gap:0,alignItems:"stretch",flexWrap:"wrap"}}>
            {[
              {dag:"Dag 0",label:"Faktura sendt",icon:"📄",color:C.sky,sub:"EHF/PDF"},
              {dag:"Dag +15",label:"Purring 1",icon:"📩",color:C.gold,sub:"+ kr 70 gebyr"},
              {dag:"Dag +29",label:"Purring 2",icon:"📩",color:"#E65100",sub:"Inkassovarsel"},
              {dag:"Dag +43",label:"Inkasso",icon:"⚖️",color:C.danger,sub:"Manuell godkj."},
            ].map((s,i)=>(
              <div key={s.dag} style={{display:"flex",alignItems:"center",gap:0}}>
                <div style={{textAlign:"center",minWidth:100}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,margin:"0 auto 5px",color:"white"}}>{s.icon}</div>
                  <div style={{fontSize:10,fontWeight:600,color:s.color}}>{s.dag}</div>
                  <div style={{fontSize:10,fontWeight:600,color:C.navy}}>{s.label}</div>
                  <div style={{fontSize:9,color:C.soft}}>{s.sub}</div>
                </div>
                {i<3&&<div style={{width:24,height:2,background:C.border,flexShrink:0,marginBottom:20}}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Innstillinger */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:16}}>
          <div>
            <Field label="Dager til purring 1 (etter forfall)" value="15" hint="Min. 1 dag etter forfall"/>
            <Field label="Purregebyr 1 (maks kr 70)" value="70"/>
          </div>
          <div>
            <Field label="Dager til purring 2" value="14" hint="Min. 14 dager etter purring 1"/>
            <Field label="Purregebyr 2 (maks kr 70)" value="70"/>
          </div>
        </div>

        {/* Automatisk vs manuell */}
        {[
          {label:"Automatisk purring 1",sub:"Sendes automatisk etter angitt antall dager",key:"autoPurring1",on:true},
          {label:"Automatisk purring 2 / inkassovarsel",sub:"Krever at purring 1 ikke er betalt",key:"autoPurring2",on:true},
          {label:"Automatisk oversendelse til inkasso",sub:"Deaktivert → krever manuell godkjenning per sak",key:"autoInkasso",on:false},
        ].map((item,i,arr)=>{
          const[on,setOn]=useState(item.on);
          return(
            <div key={item.key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:C.navy}}>{item.label}</div>
                <div style={{fontSize:10,color:C.soft}}>{item.sub}</div>
              </div>
              <div onClick={()=>setOn(v=>!v)} style={{width:38,height:22,borderRadius:11,background:on?"#4A7C6F":"#D1D5DB",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
                <div style={{position:"absolute",top:3,left:on?18:3,width:16,height:16,borderRadius:"50%",background:"white",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
              </div>
            </div>
          );
        })}

        {/* Inkasso-innstillinger */}
        <div style={{marginTop:16,background:C.softBg,borderRadius:10,padding:"12px 14px",border:`1px solid ${C.border}`}}>
          <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:10}}>Inkassobyrå-innstillinger</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:0}}>
            <div style={{paddingRight:16}}>
              <Field label="Inkassobyrå" value="Kredinor AS"/>
              <Field label="Kundenummer hos byrå" value="EIR-48291"/>
            </div>
            <div>
              <div style={{marginBottom:8}}>
                <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Unntatt fra automatisk inkasso</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {["Kommune","Stat/offentlig"].map(t=>(
                    <div key={t} style={{fontSize:10,background:C.greenBg,color:C.green,padding:"3px 10px",borderRadius:50,border:`1px solid ${C.border}`,cursor:"pointer",fontWeight:500}}>✓ {t}</div>
                  ))}
                  <div style={{fontSize:10,background:"white",color:C.soft,padding:"3px 10px",borderRadius:50,border:`1px solid ${C.border}`,cursor:"pointer"}}>+ Legg til</div>
                </div>
                <div style={{fontSize:9,color:C.soft,marginTop:4}}>Kommuner håndteres alltid manuelt — ring kontaktpersonen først</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{marginTop:14,display:"flex",gap:10,flexWrap:"wrap"}}>
          <button className="btn bp" style={{padding:"8px 20px",fontSize:12,borderRadius:9}}>Lagre purreinnstillinger</button>
          <button style={{padding:"8px 16px",fontSize:12,borderRadius:9,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>Se purrelogg →</button>
        </div>
      </Section>

      {/* ── Kanselleringsregler ── */}
      <Section title="Kanselleringsregler — privatkunder" icon="🚫">
        <div style={{background:C.skyBg,borderRadius:9,padding:"9px 13px",fontSize:10,color:"#1e40af",lineHeight:1.6,marginBottom:16,border:"1px solid rgba(37,99,235,.15)"}}>
          Gjelder <strong>privatkunder</strong> som betaler med Vipps/kort. B2B-avlysninger håndteres etter rammeavtale med organisasjonen.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:16}}>
          <div>
            <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Gratis avlysning inntil (timer)</label>
            <input defaultValue="24" style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}} type="number"/>
            <div style={{fontSize:9,color:C.soft,marginTop:3}}>Avlysning mer enn X timer før → full refusjon</div>
          </div>
          <div>
            <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>50% gebyr under (timer)</label>
            <input defaultValue="12" style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}} type="number"/>
            <div style={{fontSize:9,color:C.soft,marginTop:3}}>Avlysning mellom 12-24t → 50% belastes</div>
          </div>
          <div>
            <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>100% gebyr under (timer)</label>
            <input defaultValue="4" style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}} type="number"/>
            <div style={{fontSize:9,color:C.soft,marginTop:3}}>Avlysning under 4t → fullt beløp belastes</div>
          </div>
        </div>
        {/* Visuell tidslinje */}
        <div style={{background:C.softBg,borderRadius:10,padding:"12px 14px",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:10}}>Slik ser det ut for kunden</div>
          <div style={{display:"flex",alignItems:"center",gap:0,flexWrap:"wrap"}}>
            {[
              {fra:"Nå",til:"4t før",txt:"Fullt gebyr",bg:C.dangerBg,c:C.danger},
              {fra:"4t",til:"12t før",txt:"50% gebyr",bg:C.goldBg,c:C.goldDark},
              {fra:"12t",til:"24t før",txt:"50% gebyr",bg:C.goldBg,c:C.goldDark},
              {fra:"24t+",til:"",txt:"Gratis",bg:"#F0FDF4",c:"#166534"},
            ].map((s,i)=>(
              <div key={i} style={{flex:1,minWidth:80,background:s.bg,padding:"8px 10px",textAlign:"center",borderRight:i<3?`1px solid white`:"",[i===0?"borderRadius":""]:"8px 0 0 8px",[i===3?"borderRadius":""]:"0 8px 8px 0"}}>
                <div style={{fontSize:9,color:s.c,fontWeight:700}}>{s.txt}</div>
                <div style={{fontSize:8,color:s.c,opacity:.7}}>{s.fra}{s.til?` – ${s.til}`:""}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>EiraNova avlyser (sykepleier syk)</label>
          <div style={{padding:"10px 13px",background:"#F0FDF4",borderRadius:8,fontSize:11,color:"#166534",fontWeight:500}}>
            ✓ Alltid full refusjon — automatisk via Vipps/Stripe API. Kunden varsles umiddelbart.
          </div>
        </div>
        <button className="btn bp" style={{padding:"8px 20px",fontSize:12,borderRadius:9}}>Lagre kanselleringsregler</button>
      </Section>

      {/* ── API-nøkler ── */}
      <Section title="API-nøkler" icon="🔑">
        <div style={{fontSize:11,color:C.soft,marginBottom:14}}>Nøkler brukes av Cursor/utviklere. Del aldri med uvedkommende.</div>
        {[
          {navn:"Vipps Client Secret",key:"sk_vipps_••••••••••••••••3f9a",env:"VIPPS_CLIENT_SECRET"},
          {navn:"Stripe Secret Key",key:"sk_live_••••••••••••••••8k2m",env:"STRIPE_SECRET_KEY"},
          {navn:"Anthropic API Key",key:"sk-ant-••••••••••••••••••••••••4xQ",env:"ANTHROPIC_API_KEY"},
          {navn:"Supabase Service Key",key:"eyJhbGci••••••••••••••••••••••••",env:"SUPABASE_SERVICE_ROLE_KEY"},
        ].map(k=>(
          <div key={k.navn} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4,flexWrap:"wrap",gap:8}}>
              <span style={{fontSize:12,fontWeight:600,color:C.navy}}>{k.navn}</span>
              <span style={{fontSize:9,background:C.softBg,color:C.soft,padding:"2px 8px",borderRadius:50,fontFamily:"monospace"}}>{k.env}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{flex:1,padding:"7px 10px",background:"#1E1E2E",borderRadius:7,fontSize:11,fontFamily:"monospace",color:"#A8B5C8"}}>
                {showKey[k.env]?"sk_live_real_key_would_show_here":k.key}
              </div>
              <button onClick={()=>setShowKey(s=>({...s,[k.env]:!s[k.env]}))} style={{fontSize:10,padding:"5px 10px",background:C.softBg,color:C.navyMid,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
                {showKey[k.env]?"Skjul":"Vis"}
              </button>
              <button style={{fontSize:10,padding:"5px 10px",background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Kopier</button>
            </div>
          </div>
        ))}
        <div style={{marginTop:14,padding:"10px 13px",background:C.dangerBg,borderRadius:9,fontSize:10,color:C.danger,lineHeight:1.6}}>
          ⚠️ API-nøkler skal aldri deles eller committes til Git. Bruk miljøvariabler i Vercel/Cursor.
        </div>
      </Section>

    </div>
  );
}

function InstruktionEditor({instruks,onChange,tjenestNavn}){
  const[vis,setVis]=useState(false);
  const[fane,setFane]=useState("kunde"); // kunde | sykepleier | lister
  const[inkl,setInkl]=useState("");
  const[ikkeInkl,setIkkeInkl]=useState("");

  const upd=(felt,val)=>onChange({...instruks,[felt]:val,endretDato:new Date().toISOString().slice(0,10)});
  const addInkl=(type,val)=>{
    if(!val.trim())return;
    const key=type==="inkl"?"inkluderer":"inkludererIkke";
    onChange({...instruks,[key]:[...(instruks[key]||[]),val.trim()],endretDato:new Date().toISOString().slice(0,10)});
    if(type==="inkl")setInkl(""); else setIkkeInkl("");
  };
  const removeInkl=(type,idx)=>{
    const key=type==="inkl"?"inkluderer":"inkludererIkke";
    onChange({...instruks,[key]:(instruks[key]||[]).filter((_,i)=>i!==idx),endretDato:new Date().toISOString().slice(0,10)});
  };

  const harInstruks=instruks?.kundeversjon||instruks?.sykepleiersjon;

  return(
    <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14,marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:vis?12:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,fontWeight:700,color:C.navy}}>📋 Tjenesteinstruks</span>
          {harInstruks
            ?<span style={{fontSize:9,background:"#F0FDF4",color:"#16A34A",padding:"2px 8px",borderRadius:50,fontWeight:600}}>✓ Opprettet v{instruks?.versjon||1}</span>
            :<span style={{fontSize:9,background:C.goldBg,color:C.goldDark,padding:"2px 8px",borderRadius:50,fontWeight:600}}>⚠ Mangler</span>
          }
        </div>
        <button onClick={()=>setVis(v=>!v)} style={{fontSize:10,padding:"4px 12px",background:vis?C.softBg:C.greenBg,color:vis?C.soft:C.green,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
          {vis?"Skjul ▲":"Rediger ▼"}
        </button>
      </div>

      {!vis&&!harInstruks&&(
        <div style={{background:"#FFF3E0",borderRadius:8,padding:"8px 12px",marginTop:8,fontSize:10,color:"#92400E",lineHeight:1.6}}>
          Ingen instruks opprettet. Klikk "Rediger" for å legge til forventninger for kunder og sykepleiere.
        </div>
      )}

      {vis&&(
        <div style={{background:C.greenXL,borderRadius:12,padding:"14px 16px",border:`1px solid ${C.border}`}}>
          <div style={{fontSize:10,color:C.soft,marginBottom:12,lineHeight:1.6}}>
            Instruksen vises til kunden i appen og til sykepleieren i oppdragsoversikten. Den setter forventninger og gir juridisk klarhet.
          </div>

          {/* Fane-velger */}
          <div style={{display:"flex",background:"white",borderRadius:8,padding:3,marginBottom:14,border:`1px solid ${C.border}`,width:"fit-content"}}>
            {[["kunde","👤 Til kunden"],["sykepleier","🩺 Til sykepleier"],["lister","📝 Inkl. / Ikke inkl."]].map(([f,l])=>(
              <button key={f} onClick={()=>setFane(f)} style={{padding:"5px 12px",borderRadius:6,fontSize:10,fontWeight:fane===f?600:400,cursor:"pointer",border:"none",background:fane===f?C.greenBg:"transparent",color:fane===f?C.green:C.soft,fontFamily:"inherit",whiteSpace:"nowrap"}}>{l}</button>
            ))}
          </div>

          {/* Kundeversjon */}
          {fane==="kunde"&&(
            <div>
              <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:6}}>
                Tekst som vises til kunden i bestillingsbekreftelse og app
              </div>
              <div style={{background:"#EFF6FF",borderRadius:8,padding:"8px 11px",fontSize:9,color:"#1e40af",marginBottom:8,lineHeight:1.5}}>
                💡 Bruk et enkelt, vennlig språk. Unngå fagtermer. Fokuser på hva kunden kan forvente — ikke hva sykepleieren gjør.
              </div>
              <textarea value={instruks?.kundeversjon||""} onChange={e=>upd("kundeversjon",e.target.value)}
                rows={5} style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${C.border}`,borderRadius:9,fontSize:12,fontFamily:"inherit",background:"white",resize:"vertical",lineHeight:1.6}}
                placeholder={`F.eks. "Du mottar hjelp til ${tjenestNavn||"tjenesten"} i ditt eget tempo. Sykepleieren er der for deg — ikke for å stresse deg..."`}/>
              <div style={{fontSize:9,color:C.soft,marginTop:4,textAlign:"right"}}>{(instruks?.kundeversjon||"").length} tegn</div>
            </div>
          )}

          {/* Sykepleierversjon */}
          {fane==="sykepleier"&&(
            <div>
              <div style={{fontSize:10,fontWeight:600,color:C.navy,marginBottom:6}}>
                Faglig instruks til sykepleier — vises i oppdragskortet
              </div>
              <div style={{background:"#F0FDF4",borderRadius:8,padding:"8px 11px",fontSize:9,color:"#166534",marginBottom:8,lineHeight:1.5}}>
                💡 Vær konkret og faglig. Inkluder dokumentasjonskrav, sikkerhetspunkter og hva som skal rapporteres.
              </div>
              <textarea value={instruks?.sykepleiersjon||""} onChange={e=>upd("sykepleiersjon",e.target.value)}
                rows={6} style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${C.border}`,borderRadius:9,fontSize:12,fontFamily:"inherit",background:"white",resize:"vertical",lineHeight:1.6}}
                placeholder="F.eks. Gjennomfør fullt morgenstell inkl. dusj/vask, tannpuss og påkledning. Dokumenter hudtilstand ved avvik..."/>
              <div style={{fontSize:9,color:C.soft,marginTop:4,textAlign:"right"}}>{(instruks?.sykepleiersjon||"").length} tegn</div>
            </div>
          )}

          {/* Inkludert/ikke inkludert */}
          {fane==="lister"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {/* Inkludert */}
              <div>
                <div style={{fontSize:10,fontWeight:600,color:"#16A34A",marginBottom:8}}>✓ Inkludert i tjenesten</div>
                {(instruks?.inkluderer||[]).map((item,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 9px",background:"#F0FDF4",borderRadius:7,marginBottom:5,border:"1px solid rgba(22,163,74,.15)"}}>
                    <span style={{fontSize:14,flexShrink:0}}>✓</span>
                    <span style={{fontSize:11,color:"#166534",flex:1}}>{item}</span>
                    <button onClick={()=>removeInkl("inkl",i)} style={{background:"none",border:"none",color:"#16A34A",cursor:"pointer",fontSize:14,padding:"0 2px",opacity:.6}}>×</button>
                  </div>
                ))}
                <div style={{display:"flex",gap:6,marginTop:6}}>
                  <input value={inkl} onChange={e=>setInkl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addInkl("inkl",inkl)}
                    style={{flex:1,padding:"6px 9px",border:`1px solid ${C.border}`,borderRadius:7,fontSize:11,fontFamily:"inherit",background:"white"}}
                    placeholder="F.eks. Dusj eller vask"/>
                  <button onClick={()=>addInkl("inkl",inkl)} style={{padding:"6px 10px",background:"#16A34A",color:"white",border:"none",borderRadius:7,cursor:"pointer",fontSize:14,fontWeight:700}}>+</button>
                </div>
              </div>
              {/* Ikke inkludert */}
              <div>
                <div style={{fontSize:10,fontWeight:600,color:C.danger,marginBottom:8}}>✗ Ikke inkludert</div>
                {(instruks?.inkludererIkke||[]).map((item,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 9px",background:C.dangerBg,borderRadius:7,marginBottom:5,border:"1px solid rgba(225,29,72,.1)"}}>
                    <span style={{fontSize:14,flexShrink:0,color:C.danger}}>✗</span>
                    <span style={{fontSize:11,color:C.danger,flex:1}}>{item}</span>
                    <button onClick={()=>removeInkl("ikkeinkl",i)} style={{background:"none",border:"none",color:C.danger,cursor:"pointer",fontSize:14,padding:"0 2px",opacity:.6}}>×</button>
                  </div>
                ))}
                <div style={{display:"flex",gap:6,marginTop:6}}>
                  <input value={ikkeInkl} onChange={e=>setIkkeInkl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addInkl("ikkeinkl",ikkeInkl)}
                    style={{flex:1,padding:"6px 9px",border:`1px solid ${C.border}`,borderRadius:7,fontSize:11,fontFamily:"inherit",background:"white"}}
                    placeholder="F.eks. Rengjøring av bad"/>
                  <button onClick={()=>addInkl("ikkeinkl",ikkeInkl)} style={{padding:"6px 10px",background:C.danger,color:"white",border:"none",borderRadius:7,cursor:"pointer",fontSize:14,fontWeight:700}}>+</button>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div style={{marginTop:12,paddingTop:10,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:9,color:C.soft}}>
              {instruks?.endretDato&&`Sist endret: ${instruks.endretDato} · `}Versjon {instruks?.versjon||1}
              {instruks?.endretAv&&` · ${instruks.endretAv}`}
            </div>
            <button onClick={()=>onChange({...instruks,versjon:(instruks?.versjon||1)+1,endretDato:new Date().toISOString().slice(0,10)})}
              style={{fontSize:9,padding:"3px 10px",background:C.softBg,color:C.navyMid,border:`1px solid ${C.border}`,borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>
              Bump versjon → v{(instruks?.versjon||1)+1}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TjenesteKalkulator({varighet,navnTjeneste}){
  const[vis,setVis]=useState(false);
  const[margin,setMargin]=useState(25);
  const[km,setKm]=useState(8);

  // Faste kostnader (samme defaults som PrisKalkulator)
  const fastPerMnd=2500+4200+3800+4500+5000+2000; // kontor+sys+fors+rev+mkt+annet
  const oppdragPerMnd=180; // typisk volum

  // ── Tre modeller ─────────────────────────────────────────
  const t=varighet/60;
  const reise=km*4.5;
  const overhead=fastPerMnd/oppdragPerMnd*(varighet/60); // skaleres med varighet

  // Vikar ENK
  const vikarSatsHoyt=320, vikarSatsLavt=200;
  const vikarSnitt=vikarSatsHoyt*0.55+vikarSatsLavt*0.45;
  const direkteVikar=vikarSnitt+reise;
  const kostVikar=direkteVikar+overhead;
  const breakEvenVikar=Math.ceil(kostVikar);
  const prisVikar=Math.ceil(kostVikar/(1-margin/100));

  // Fast ansatt (sykepleier-mix)
  const timeLonnMix=275*0.6+225*0.4;
  const direkteFast=timeLonnMix*t*(1+0.141+0.12+0.02)+reise;
  const kostFast=direkteFast+overhead;
  const breakEvenFast=Math.ceil(kostFast);
  const prisFast=Math.ceil(kostFast/(1-margin/100));

  // Hybrid (60% fast grunnstilling + oppdragstillegg)
  const grunnBase=timeLonnMix*t*0.6*(1+0.141+0.12+0.02); // 60% fast del
  const tilleggDel=timeLonnMix*t*0.4*(1+0.141+0.12+0.02); // 40% variabel del
  const direkteHybrid=grunnBase+tilleggDel+reise;
  const kostHybrid=direkteHybrid+overhead;
  const breakEvenHybrid=Math.ceil(kostHybrid);
  const prisHybrid=Math.ceil(kostHybrid/(1-margin/100));

  // Beregn overskudd per oppdrag over break-even
  const modeller=[
    {key:"vikar",label:"🤝 Vikar ENK",breakEven:breakEvenVikar,anbefalt:prisVikar,direkteKost:Math.round(direkteVikar),overhead:Math.round(overhead),color:C.green,fordel:"Ingen faste lønnskostnader. Enkelt å skalere.",ulempe:"Vikaren er selvstendig — EiraNova har mindre kontroll."},
    {key:"fast", label:"👔 Fast ansatt",breakEven:breakEvenFast,anbefalt:prisFast,direkteKost:Math.round(direkteFast),overhead:Math.round(overhead),color:C.sky,fordel:"Forutsigbarhet. Full kontroll over kvalitet og tilgjengelighet.",ulempe:"Høye faste kostnader. Risiko ved lavt volum."},
    {key:"hybrid",label:"⚖️ Hybrid",breakEven:breakEvenHybrid,anbefalt:prisHybrid,direkteKost:Math.round(direkteHybrid),overhead:Math.round(overhead),color:C.gold,fordel:"Fleksibilitet. Grunnstilling gir trygghet for ansatt.",ulempe:"Mer administrativt komplekst."},
  ];

  const billigst=modeller.reduce((a,b)=>a.breakEven<b.breakEven?a:b);
  const dyreste=modeller.reduce((a,b)=>a.breakEven>b.breakEven?a:b);

  if(!vis) return(
    <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14,marginBottom:16}}>
      <button onClick={()=>setVis(true)} style={{width:"100%",padding:"10px 0",fontSize:12,borderRadius:9,background:"#F5F3FF",color:"#5B21B6",border:"1px solid #C4B5FD",cursor:"pointer",fontFamily:"inherit",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
        <span>🧮</span> Beregn minimumspris & sammenlign modeller for {varighet} min
      </button>
    </div>
  );

  return(
    <div style={{borderTop:`1px solid ${C.border}`,paddingTop:16,marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:2}}>🧮 Prisberegning — {navnTjeneste||"tjeneste"} ({varighet} min)</div>
          <div style={{fontSize:10,color:C.soft}}>Basert på {oppdragPerMnd} oppdrag/mnd og {km} km reise</div>
        </div>
        <button onClick={()=>setVis(false)} style={{fontSize:10,color:C.soft,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Skjul ×</button>
      </div>

      {/* Margin-slider */}
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
          <span style={{fontSize:10,fontWeight:600,color:C.navy}}>Ønsket margin</span>
          <span style={{fontSize:12,fontWeight:700,color:C.green}}>{margin}%</span>
        </div>
        <input type="range" min={5} max={50} value={margin} onChange={e=>setMargin(Number(e.target.value))}
          style={{width:"100%",accentColor:C.green,cursor:"pointer"}}/>
      </div>

      {/* Tre modeller side om side */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
        {modeller.map(m=>(
          <div key={m.key} style={{borderRadius:11,border:`2px solid ${m.key===billigst.key?m.color:C.border}`,overflow:"hidden",background:m.key===billigst.key?`${m.color}08`:"white",position:"relative"}}>
            {m.key===billigst.key&&(
              <div style={{position:"absolute",top:-1,right:-1,background:m.color,color:"white",fontSize:8,fontWeight:700,padding:"2px 8px",borderRadius:"0 9px 0 6px"}}>BILLIGST</div>
            )}
            <div style={{padding:"10px 10px 4px"}}>
              <div style={{fontSize:10,fontWeight:700,color:m.color,marginBottom:6}}>{m.label}</div>
              <div style={{fontSize:9,color:C.soft,marginBottom:4}}>Break-even:</div>
              <div className="fr" style={{fontSize:16,fontWeight:800,color:C.danger,marginBottom:2}}>{m.breakEven.toLocaleString("nb-NO")} kr</div>
              <div style={{fontSize:9,color:C.soft,marginBottom:8}}>Anbefalt ({margin}% margin):</div>
              <div className="fr" style={{fontSize:18,fontWeight:800,color:m.color,marginBottom:10}}>{m.anbefalt.toLocaleString("nb-NO")} kr</div>
              <div style={{borderTop:`1px solid ${C.border}`,paddingTop:7}}>
                {[
                  {l:"Personalkost",v:`${m.direkteKost} kr`},
                  {l:"Overhead",v:`${m.overhead} kr`},
                ].map(r=>(
                  <div key={r.l} style={{display:"flex",justifyContent:"space-between",fontSize:9,marginBottom:3}}>
                    <span style={{color:C.soft}}>{r.l}</span>
                    <span style={{color:C.navyMid,fontWeight:600}}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{padding:"8px 10px",background:`${m.color}10`,borderTop:`1px solid ${C.border}`}}>
              <div style={{fontSize:8,color:C.green,fontWeight:600,marginBottom:2}}>✓ {m.fordel}</div>
              <div style={{fontSize:8,color:C.soft}}>⚠ {m.ulempe}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Oppsummering */}
      <div style={{background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,borderRadius:10,padding:"12px 14px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.5)",marginBottom:3,textTransform:"uppercase",letterSpacing:.5}}>Billigst å drifte med</div>
          <div style={{fontSize:13,fontWeight:700,color:"white"}}>{billigst.label}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>Break-even: {billigst.breakEven.toLocaleString("nb-NO")} kr</div>
        </div>
        <div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.5)",marginBottom:3,textTransform:"uppercase",letterSpacing:.5}}>Prisforskjell (billigst vs dyreste)</div>
          <div style={{fontSize:13,fontWeight:700,color:"#4ABC9E"}}>+{(dyreste.anbefalt-billigst.anbefalt).toLocaleString("nb-NO")} kr/oppdrag</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>= {Math.round((dyreste.anbefalt-billigst.anbefalt)*oppdragPerMnd/1000)}k kr/mnd på {oppdragPerMnd} oppdrag</div>
        </div>
      </div>

      <div style={{marginTop:10,background:C.greenXL,borderRadius:8,padding:"8px 12px",fontSize:10,color:C.navyMid,lineHeight:1.6}}>
        💡 Break-even = minimumspris for å ikke tape penger. Anbefalt pris inkluderer {margin}% margin til buffer og utbytte. Overhead fordeles på {oppdragPerMnd} oppdrag/mnd — økt volum gir lavere overhead per oppdrag.
      </div>
    </div>
  );
}

function TjenesteAdmin({tjenesterCatalog,setTjenesterCatalog}){
  const[modal,setModal]=useState(null);      // null | "ny" | tjeneste-objekt
  const[slettModal,setSlettModal]=useState(null);
  const[filter,setFilter]=useState("alle");  // alle | eldre | barsel | inaktiv

  const initKategorier=[
    {id:"eldre",  label:"Eldre & Pårørende", ikon:"🏡", farge:C.green,  gradient:`linear-gradient(90deg,${C.green},${C.greenLight})`},
    {id:"barsel", label:"Barselstøtte",       ikon:"🤱", farge:"#B05C4A",gradient:`linear-gradient(90deg,${C.rose},${C.gold})`},
  ];
  const[kategorier,setKategorier]=useState(initKategorier);
  const[katModal,setKatModal]=useState(null); // null | "ny" | kategori-obj
  const[katForm,setKatForm]=useState({id:"",label:"",ikon:"📋",farge:C.sky});

  const initInstruks={kundeversjon:"",sykepleiersjon:"",inkluderer:[],inkludererIkke:[],endretAv:"Lise Andersen",endretDato:new Date().toISOString().slice(0,10),versjon:1};
  const initForm={id:null,navn:"",ikon:"🏥",kategori:kategorier[0]?.id||"eldre",beskrivelse:"",pris:"",b2bPris:"",varighet:60,mva:"avklares",mvaRisiko:"medium",aktiv:true,utfoertAv:["hjelpepleier"],tagline:"",kundeInkluderer:["","","",""],kundeType:"",instruks:{kundeversjon:"",sykepleiersjon:"",inkluderer:[],inkludererIkke:[],endretAv:"Lise Andersen",endretDato:new Date().toISOString().slice(0,10),versjon:1}};
  const[form,setForm]=useState(initForm);

  const filterte=tjenesterCatalog.filter(t=>{
    if(filter==="inaktiv") return !t.aktiv;
    if(filter==="eldre")   return t.kategori==="eldre"&&t.aktiv;
    if(filter==="barsel")  return t.kategori==="barsel"&&t.aktiv;
    return t.aktiv;
  });

  const apneModal=(t)=>{
    if(t){
      const ink=Array.isArray(t.kundeInkluderer)&&t.kundeInkluderer.length?t.kundeInkluderer.map(x=>String(x??"")):["","","",""];
      while(ink.length<4) ink.push("");
      setForm({...t,instruks:t.instruks||{...initInstruks},tagline:t.tagline||"",kundeInkluderer:ink.slice(0,6),kundeType:t.kundeType||""});
    }else{
      setForm({...initForm,id:"t"+(tjenesterCatalog.length+1),tagline:"",kundeInkluderer:["","","",""],kundeType:""});
    }
    setModal(t||"ny");
  };

  const lagreTjeneste=()=>{
    const trimmedTag=String(form.tagline||"").trim().slice(0,80);
    const inkRå=Array.isArray(form.kundeInkluderer)?form.kundeInkluderer.map(x=>String(x??"").trim()):[];
    let kt=String(form.kundeType||"").trim();
    if(!kt){
      const fraNavn=String(form.navn||"").toLowerCase().replace(/[^a-z0-9æøå]+/gi,"_").replace(/^_|_$/g,"").slice(0,48);
      kt=fraNavn||String(form.id||"tjeneste");
    }
    const payload={...form,tagline:trimmedTag,kundeInkluderer:inkRå,kundeType:kt};
    if(modal==="ny"){
      setTjenesterCatalog(p=>[...p,{...payload,opprettet:new Date().toISOString().slice(0,10)}]);
    } else {
      setTjenesterCatalog(p=>p.map(t=>t.id===form.id?{...payload}:t));
    }
    setModal(null);
  };

  const toggleAktiv=(id)=>setTjenesterCatalog(p=>p.map(t=>t.id===id?{...t,aktiv:!t.aktiv}:t));

  const Toggle=({on,onToggle})=>(
    <div onClick={onToggle} style={{width:38,height:22,borderRadius:11,background:on?C.green:"#D1D5DB",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
      <div style={{position:"absolute",top:3,left:on?18:3,width:16,height:16,borderRadius:"50%",background:"white",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
    </div>
  );

  const mvaFarge=(r)=>r==="lav"?"#16A34A":r==="medium"?C.goldDark:C.danger;
  const mvaBg=(r)=>r==="lav"?"#F0FDF4":r==="medium"?C.goldBg:C.dangerBg;

  return(
    <div className="fu">
      {/* ── Tjeneste-modal ── */}
      {modal&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.48)",padding:20}}>
          <div style={{background:"white",borderRadius:18,width:"100%",maxWidth:580,maxHeight:"92vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
            <div style={{padding:"18px 22px",background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,borderRadius:"18px 18px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:2,textTransform:"uppercase",letterSpacing:.6}}>{modal==="ny"?"Ny tjeneste":"Rediger tjeneste"}</div>
                <div style={{fontSize:16,fontWeight:600,color:"white"}}>{form.ikon} {form.navn||"Ny tjeneste"}</div>
              </div>
              <button onClick={()=>setModal(null)} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16}}>×</button>
            </div>
            <div style={{padding:"20px 22px"}}>
              {/* Basisinfo */}
              <div style={{display:"grid",gridTemplateColumns:"64px 1fr",gap:12,marginBottom:14}}>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Ikon</label>
                  <input value={form.ikon} onChange={e=>setForm(f=>({...f,ikon:e.target.value}))}
                    style={{width:"100%",padding:"10px 8px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:22,textAlign:"center",background:C.greenXL,fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Tjenestenavn</label>
                  <input value={form.navn} onChange={e=>setForm(f=>({...f,navn:e.target.value}))}
                    style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:13,fontFamily:"inherit",background:C.greenXL,fontWeight:600}}
                    placeholder="F.eks. Kveldsstell"/>
                </div>
              </div>
              <div style={{marginBottom:12}}>
                <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Beskrivelse</label>
                <input value={form.beskrivelse} onChange={e=>setForm(f=>({...f,beskrivelse:e.target.value}))}
                  style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}}
                  placeholder="Kort beskrivelse som vises til kunden"/>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy}}>Tagline (kundeside)</label>
                  <span style={{fontSize:9,color:C.soft}}>{String(form.tagline||"").length}/80</span>
                </div>
                <input value={form.tagline||""} onChange={e=>setForm(f=>({...f,tagline:e.target.value.slice(0,80)}))}
                  style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}}
                  placeholder="Kort setning under tjenestenavnet"/>
              </div>
              <div style={{marginBottom:12}}>
                <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Kundetype (slug)</label>
                <input value={form.kundeType||""} onChange={e=>setForm(f=>({...f,kundeType:e.target.value.replace(/\s+/g,"_").slice(0,48)}))}
                  style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"monospace",background:C.softBg}}
                  placeholder="Tom = genereres fra tjenestenavn ved lagring"/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:6}}>Hva inngår (kundeside)</label>
                {(form.kundeInkluderer||[]).map((linje,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <input value={linje} onChange={e=>setForm(f=>{
                      const k=[...(f.kundeInkluderer||[])];
                      k[i]=e.target.value;
                      return {...f,kundeInkluderer:k};
                    })}
                      style={{flex:1,padding:"8px 11px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.greenXL}}
                      placeholder={`Punkt ${i+1}`}/>
                    <button type="button" aria-label={`Slett punkt ${i+1}`} onClick={()=>setForm(f=>({...f,kundeInkluderer:(f.kundeInkluderer||[]).filter((_,j)=>j!==i)}))}
                      style={{flexShrink:0,width:36,height:36,borderRadius:8,border:`1px solid ${C.border}`,background:"white",cursor:"pointer",fontSize:16}}>🗑</button>
                  </div>
                ))}
                <button type="button" disabled={(form.kundeInkluderer||[]).length>=6} onClick={()=>setForm(f=>({...f,kundeInkluderer:[...(f.kundeInkluderer||[]),""]}))}
                  style={{fontSize:11,padding:"6px 12px",borderRadius:8,background:(form.kundeInkluderer||[]).length>=6?C.softBg:C.greenBg,color:(form.kundeInkluderer||[]).length>=6?C.soft:C.green,border:`1px solid ${C.border}`,cursor:(form.kundeInkluderer||[]).length>=6?"not-allowed":"pointer",fontFamily:"inherit",fontWeight:600}}>
                  + Legg til punkt
                </button>
              </div>
              {/* Kategori — dynamisk */}
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy}}>Kategori</label>
                  <button onClick={()=>{setKatForm({id:"",label:"",ikon:"📋",farge:C.sky});setKatModal("ny");}} style={{fontSize:9,padding:"2px 9px",background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,borderRadius:5,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>+ Ny kategori</button>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {kategorier.map(k=>(
                    <div key={k.id} onClick={()=>setForm(f=>({...f,kategori:k.id}))}
                      style={{flex:"1 1 120px",padding:"9px 12px",borderRadius:9,border:`2px solid ${form.kategori===k.id?k.farge:C.border}`,background:form.kategori===k.id?`${k.farge}12`:"white",cursor:"pointer",textAlign:"center",fontSize:12,fontWeight:form.kategori===k.id?600:400,color:form.kategori===k.id?C.navy:C.soft,transition:"all .15s"}}>
                      {k.ikon} {k.label}
                    </div>
                  ))}
                </div>
              </div>
              {/* Pris og varighet */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Listepris (kr)</label>
                  <input type="number" value={form.pris} onChange={e=>setForm(f=>({...f,pris:Number(e.target.value)}))}
                    style={{width:"100%",padding:"9px 10px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:13,fontFamily:"inherit",background:C.greenXL,fontWeight:600,color:C.green}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>B2B-pris (kr)</label>
                  <input type="number" value={form.b2bPris||""} onChange={e=>setForm(f=>({...f,b2bPris:e.target.value?Number(e.target.value):null}))}
                    style={{width:"100%",padding:"9px 10px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:13,fontFamily:"inherit",background:C.greenXL}}
                    placeholder="Blank = ingen B2B"/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Varighet (min)</label>
                  <input type="number" value={form.varighet} onChange={e=>setForm(f=>({...f,varighet:Number(e.target.value)}))}
                    style={{width:"100%",padding:"9px 10px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:13,fontFamily:"inherit",background:C.greenXL}}/>
                </div>
              </div>
              {/* Hvem kan utføre */}
              <div style={{marginBottom:14}}>
                <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:6}}>Kan utføres av</label>
                <div style={{display:"flex",gap:8}}>
                  {[["sykepleier","🩺 Sykepleier"],["hjelpepleier","👩‍⚕️ Hjelpepleier"]].map(([k,l])=>{
                    const valgt=form.utfoertAv.includes(k);
                    return(
                      <div key={k} onClick={()=>setForm(f=>({...f,utfoertAv:valgt?f.utfoertAv.filter(v=>v!==k):[...f.utfoertAv,k]}))}
                        style={{flex:1,padding:"9px 12px",borderRadius:9,border:`2px solid ${valgt?C.green:C.border}`,background:valgt?C.greenXL:"white",cursor:"pointer",textAlign:"center",fontSize:12,fontWeight:valgt?600:400,color:valgt?C.navy:C.soft}}>
                        {l}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* MVA */}
              <div style={{marginBottom:16}}>
                <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:6}}>MVA-status</label>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  {[["0%","0% — Unntatt helsetjeneste","lav"],["avklares","Avklares — grå sone","medium"],["25%","25% — MVA-pliktig","høy"]].map(([v,l,r])=>(
                    <div key={v} onClick={()=>setForm(f=>({...f,mva:v,mvaRisiko:r}))}
                      style={{flex:1,minWidth:120,padding:"8px 10px",borderRadius:8,border:`2px solid ${form.mva===v?mvaFarge(r):C.border}`,background:form.mva===v?mvaBg(r):"white",cursor:"pointer",textAlign:"center"}}>
                      <div style={{fontSize:11,fontWeight:600,color:form.mva===v?mvaFarge(r):C.navyMid}}>{v}</div>
                      <div style={{fontSize:9,color:C.soft,marginTop:1}}>{l.split("—")[1]?.trim()}</div>
                    </div>
                  ))}
                </div>
                {form.mva==="avklares"&&(
                  <div style={{marginTop:8,background:C.goldBg,borderRadius:8,padding:"7px 11px",fontSize:10,color:C.goldDark,lineHeight:1.5}}>
                    ⚠️ Avklar med revisor før lansering. Risiko for etterbetaling av 25% MVA.
                  </div>
                )}
              </div>
              {/* Aktiv */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderTop:`1px solid ${C.border}`,marginBottom:16}}>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:C.navy}}>Tjenesten er aktiv</div>
                  <div style={{fontSize:10,color:C.soft}}>Inaktive tjenester vises ikke til kunder</div>
                </div>
                <Toggle on={form.aktiv} onToggle={()=>setForm(f=>({...f,aktiv:!f.aktiv}))}/>
              </div>
              {/* ── Instrukser ── */}
              <InstruktionEditor
                instruks={form.instruks}
                onChange={instruks=>setForm(f=>({...f,instruks}))}
                tjenestNavn={form.navn}
              />

              {/* ── Prisberegning ── */}
              <TjenesteKalkulator varighet={form.varighet} navnTjeneste={form.navn}/>

              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setModal(null)} style={{padding:"10px 18px",fontSize:12,borderRadius:10,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>Avbryt</button>
                <button onClick={lagreTjeneste} className="btn bp" style={{flex:1,padding:"10px 0",fontSize:13,borderRadius:10,opacity:form.navn&&form.pris?1:.5}}>
                  {modal==="ny"?"✓ Opprett tjeneste":"✓ Lagre endringer"}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Slett-bekreftelse */}
      {slettModal&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.48)",padding:20}}>
          <div style={{background:"white",borderRadius:16,width:"100%",maxWidth:400,padding:"24px",boxShadow:"0 20px 60px rgba(0,0,0,.2)"}}>
            <div style={{fontSize:32,textAlign:"center",marginBottom:12}}>⚠️</div>
            <div style={{fontSize:15,fontWeight:700,color:C.navy,textAlign:"center",marginBottom:8}}>Deaktiver tjeneste?</div>
            <div style={{fontSize:12,color:C.soft,textAlign:"center",marginBottom:6,lineHeight:1.6}}>
              <strong>{slettModal.ikon} {slettModal.navn}</strong> vil skjules for kunder og kan ikke bestilles.
            </div>
            <div style={{background:C.greenXL,borderRadius:9,padding:"9px 13px",fontSize:10,color:C.navyMid,marginBottom:20,lineHeight:1.6}}>
              💡 Tjenesten <strong>slettes ikke</strong> — den deaktiveres. Historikk og bestillinger beholdes. Du kan reaktivere når som helst.
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setSlettModal(null)} style={{flex:1,padding:"10px 0",fontSize:12,borderRadius:10,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>Avbryt</button>
              <button onClick={()=>{toggleAktiv(slettModal.id);setSlettModal(null);}} style={{flex:1,padding:"10px 0",fontSize:12,borderRadius:10,background:C.dangerBg,color:C.danger,border:`1px solid rgba(225,29,72,.2)`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
                Deaktiver
              </button>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── Kategori-modal ── */}
      {katModal&&(
        <ModalPortal overlayStyle={{background:"rgba(0,0,0,.45)",padding:20}}>
          <div style={{background:"white",borderRadius:16,width:"100%",maxWidth:400,boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
            <div style={{padding:"16px 20px",background:`linear-gradient(135deg,${C.navy},${C.greenDark})`,borderRadius:"16px 16px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:14,fontWeight:600,color:"white"}}>{katModal==="ny"?"+ Ny kategori":"✏️ Rediger kategori"}</div>
              <button onClick={()=>setKatModal(null)} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:14}}>×</button>
            </div>
            <div style={{padding:"18px 20px"}}>
              <div style={{display:"grid",gridTemplateColumns:"56px 1fr",gap:10,marginBottom:12}}>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Ikon</label>
                  <input value={katForm.ikon} onChange={e=>setKatForm(f=>({...f,ikon:e.target.value}))}
                    style={{width:"100%",padding:"9px 6px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:22,textAlign:"center",background:C.greenXL,fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>Kategorinavn</label>
                  <input value={katForm.label} onChange={e=>setKatForm(f=>({...f,label:e.target.value}))}
                    style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:13,fontFamily:"inherit",background:C.greenXL,fontWeight:600}}
                    placeholder="F.eks. Rehabilitering"/>
                </div>
              </div>
              {katModal!=="ny"&&(
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:4}}>ID (endres ikke)</label>
                  <input value={katForm.id} disabled style={{width:"100%",padding:"8px 12px",border:`1px solid ${C.border}`,borderRadius:7,fontSize:11,fontFamily:"monospace",background:C.softBg,color:C.soft}}/>
                </div>
              )}
              {/* Fargevalg */}
              <div style={{marginBottom:14}}>
                <label style={{fontSize:10,fontWeight:600,color:C.navy,display:"block",marginBottom:6}}>Farge</label>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {[C.green,C.sky,"#B05C4A",C.gold,"#6D28D9","#0891B2","#BE185D",C.navyMid].map(c=>(
                    <div key={c} onClick={()=>setKatForm(f=>({...f,farge:c}))}
                      style={{width:32,height:32,borderRadius:"50%",background:c,cursor:"pointer",border:`3px solid ${katForm.farge===c?"white":"transparent"}`,boxShadow:katForm.farge===c?`0 0 0 2px ${c}`:"none",transition:"all .15s"}}/>
                  ))}
                </div>
              </div>
              {/* Forhåndsvisning */}
              <div style={{marginBottom:16,padding:"10px 13px",borderRadius:9,border:`2px solid ${katForm.farge}`,background:`${katForm.farge}10`,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>{katForm.ikon}</span>
                <span style={{fontSize:13,fontWeight:600,color:C.navy}}>{katForm.label||"Kategorinavn"}</span>
                <span style={{marginLeft:"auto",fontSize:10,color:katForm.farge,fontWeight:600}}>Forhåndsvisning</span>
              </div>
              <div style={{display:"flex",gap:8}}>
                {katModal!=="ny"&&(
                  <button onClick={()=>{
                    if(tjenesterCatalog.some(t=>t.kategori===katForm.id)){
                      alert("Kan ikke slette — kategorien har aktive tjenester.");return;
                    }
                    setKategorier(p=>p.filter(k=>k.id!==katForm.id));setKatModal(null);
                  }} style={{padding:"9px 14px",fontSize:11,borderRadius:9,background:C.dangerBg,color:C.danger,border:`1px solid rgba(225,29,72,.2)`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
                    🗑 Slett
                  </button>
                )}
                <button onClick={()=>setKatModal(null)} style={{padding:"9px 14px",fontSize:11,borderRadius:9,background:"white",color:C.navy,border:`1.5px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit"}}>Avbryt</button>
                <button onClick={()=>{
                  if(katModal==="ny"){
                    const id=katForm.label.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
                    setKategorier(p=>[...p,{...katForm,id,gradient:`linear-gradient(90deg,${katForm.farge},${katForm.farge}99)`}]);
                  } else {
                    setKategorier(p=>p.map(k=>k.id===katForm.id?{...katForm,gradient:`linear-gradient(90deg,${katForm.farge},${katForm.farge}99)`}:k));
                  }
                  setKatModal(null);
                }} className="btn bp" style={{flex:1,padding:"9px 0",fontSize:12,borderRadius:9,opacity:katForm.label?1:.5}}>
                  {katModal==="ny"?"+ Opprett":"✓ Lagre"}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ── Kategorier-oversikt ── */}
      <div style={{marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:12,fontWeight:600,color:C.navy}}>Kategorier ({kategorier.length})</span>
          <button onClick={()=>{setKatForm({id:"",label:"",ikon:"📋",farge:C.sky});setKatModal("ny");}} style={{fontSize:10,padding:"4px 12px",background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>+ Ny kategori</button>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {kategorier.map(k=>(
            <div key={k.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 13px",borderRadius:9,border:`1.5px solid ${k.farge}44`,background:`${k.farge}08`,cursor:"pointer",transition:"all .15s"}}
              onClick={()=>{setKatForm({...k});setKatModal(k);}}>
              <span style={{fontSize:16}}>{k.ikon}</span>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:C.navy}}>{k.label}</div>
                <div style={{fontSize:9,color:C.soft}}>{tjenesterCatalog.filter(t=>t.kategori===k.id&&t.aktiv).length} tjenester</div>
              </div>
              <span style={{fontSize:10,color:k.farge,marginLeft:4}}>✏️</span>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <div className="fr" style={{fontSize:16,fontWeight:600,color:C.navy,marginBottom:2}}>Tjenester & priser</div>
          <div style={{fontSize:11,color:C.soft}}>{tjenesterCatalog.filter(t=>t.aktiv).length} aktive · {tjenesterCatalog.filter(t=>!t.aktiv).length} inaktive</div>
        </div>
        <button onClick={()=>apneModal(null)} className="btn bp" style={{fontSize:12,padding:"9px 18px",borderRadius:10}}>
          + Legg til tjeneste
        </button>
      </div>

      {/* Filter-tabs — dynamisk fra kategorier */}
      <div style={{display:"flex",flexWrap:"wrap",background:"white",borderRadius:9,padding:3,marginBottom:16,border:`1px solid ${C.border}`,width:"fit-content",gap:0}}>
        {[["alle","Alle"],...kategorier.map(k=>[k.id,`${k.ikon} ${k.label}`]),["inaktiv","⏸ Inaktive"]].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{padding:"6px 14px",borderRadius:7,fontSize:11,fontWeight:filter===k?600:400,cursor:"pointer",border:"none",background:filter===k?C.greenBg:"transparent",color:filter===k?C.green:C.soft,fontFamily:"inherit",whiteSpace:"nowrap"}}>{l}</button>
        ))}
      </div>

      {/* Tjeneste-grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,340px),1fr))",gap:12,marginBottom:20}}>
        {filterte.map(t=>(
          <div key={t.id} className="card" style={{opacity:t.aktiv?1:.55,overflow:"hidden"}}>
            {/* Fargede topp-striper */}
            <div style={{height:4,background:(kategorier.find(k=>k.id===t.kategori)?.gradient||`linear-gradient(90deg,${C.green},${C.greenLight})`)}}/>
            <div style={{padding:"14px 16px"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:10}}>
                <div style={{width:44,height:44,borderRadius:11,background:`${(kategorier.find(k=>k.id===t.kategori)?.farge||C.green)}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{t.ikon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:2}}>{t.navn}</div>
                  <div style={{fontSize:10,color:C.soft,marginBottom:4}}>{t.beskrivelse}</div>
                  {t.tagline?<div style={{fontSize:9,color:C.navyMid,marginBottom:4,lineHeight:1.35,fontStyle:"italic"}}>{t.tagline}</div>:null}
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {t.utfoertAv.map(u=>(
                      <span key={u} style={{fontSize:9,background:C.softBg,color:C.navyMid,padding:"1px 7px",borderRadius:50,fontWeight:500}}>
                        {u==="sykepleier"?"🩺 Sykepleier":"👩‍⚕️ Hjelpepleier"}
                      </span>
                    ))}
                    <span style={{fontSize:9,background:C.greenXL,color:C.green,padding:"1px 7px",borderRadius:50,fontWeight:500}}>⏱ {t.varighet} min</span>
                  </div>
                </div>
                <Toggle on={t.aktiv} onToggle={()=>t.aktiv?setSlettModal(t):toggleAktiv(t.id)}/>
              </div>
              {/* Priser */}
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <div style={{flex:1,background:C.greenXL,borderRadius:8,padding:"8px 10px",textAlign:"center",border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:9,color:C.soft,marginBottom:1}}>Listepris</div>
                  <div style={{fontSize:15,fontWeight:700,color:C.green}}>{t.pris.toLocaleString("nb-NO")} kr</div>
                </div>
                {t.b2bPris?(
                  <div style={{flex:1,background:"#EEF2FF",borderRadius:8,padding:"8px 10px",textAlign:"center",border:`1px solid #C7D2FE`}}>
                    <div style={{fontSize:9,color:C.soft,marginBottom:1}}>B2B-pris</div>
                    <div style={{fontSize:15,fontWeight:700,color:"#3B82F6"}}>{t.b2bPris.toLocaleString("nb-NO")} kr</div>
                  </div>
                ):(
                  <div style={{flex:1,background:C.softBg,borderRadius:8,padding:"8px 10px",textAlign:"center",border:`1px solid ${C.border}`}}>
                    <div style={{fontSize:9,color:C.soft,marginBottom:1}}>B2B-pris</div>
                    <div style={{fontSize:11,color:C.soft,fontStyle:"italic"}}>Listepris</div>
                  </div>
                )}
                <div style={{flex:1,background:mvaBg(t.mvaRisiko),borderRadius:8,padding:"8px 10px",textAlign:"center",border:`1px solid ${mvaFarge(t.mvaRisiko)}22`}}>
                  <div style={{fontSize:9,color:C.soft,marginBottom:1}}>MVA</div>
                  <div style={{fontSize:11,fontWeight:700,color:mvaFarge(t.mvaRisiko)}}>{t.mva}</div>
                </div>
              </div>
              {/* Instruks-status */}
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8,fontSize:9}}>
                {t.instruks?.kundeversjon
                  ?<span style={{background:"#F0FDF4",color:"#16A34A",padding:"2px 8px",borderRadius:50,fontWeight:600}}>✓ Instruks opprettet</span>
                  :<span style={{background:C.goldBg,color:C.goldDark,padding:"2px 8px",borderRadius:50,fontWeight:600}}>⚠ Mangler instruks</span>
                }
                {t.instruks?.versjon&&<span style={{color:C.soft}}>v{t.instruks.versjon} · {t.instruks.endretDato}</span>}
              </div>
              {/* Handlinger */}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>apneModal(t)} style={{flex:1,padding:"7px 0",fontSize:11,borderRadius:8,background:C.greenBg,color:C.green,border:`1px solid ${C.border}`,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
                  ✏️ Rediger
                </button>
                <button onClick={()=>setSlettModal(t)} style={{padding:"7px 14px",fontSize:11,borderRadius:8,background:t.aktiv?C.dangerBg:C.greenBg,color:t.aktiv?C.danger:C.green,border:`1px solid ${t.aktiv?"rgba(225,29,72,.2)":C.border}`,cursor:"pointer",fontFamily:"inherit"}}>
                  {t.aktiv?"⏸ Deaktiver":"▶️ Aktiver"}
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* Tom-kort for "Ny tjeneste" */}
        <div onClick={()=>apneModal(null)} style={{border:`2px dashed ${C.border}`,borderRadius:14,padding:"24px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer",minHeight:180,transition:"border-color .15s",background:"white"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor=C.green}
          onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
          <div style={{width:44,height:44,borderRadius:"50%",background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>+</div>
          <div style={{fontSize:12,fontWeight:600,color:C.green}}>Legg til tjeneste</div>
          <div style={{fontSize:10,color:C.soft,textAlign:"center"}}>Klikk for å opprette en ny tjeneste</div>
        </div>
      </div>

      {/* MVA-advarsel-boks */}
      {tjenesterCatalog.filter(t=>t.aktiv&&t.mvaRisiko==="høy").length>0&&(
        <div style={{background:C.dangerBg,borderRadius:12,padding:"13px 16px",border:`1px solid rgba(225,29,72,.2)`,display:"flex",gap:12,alignItems:"flex-start"}}>
          <span style={{fontSize:20,flexShrink:0}}>⚖️</span>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:C.danger,marginBottom:4}}>MVA-advarsel — {tjenesterCatalog.filter(t=>t.aktiv&&t.mvaRisiko==="høy").length} tjenester med høy risiko</div>
            <div style={{fontSize:11,color:C.navyMid,lineHeight:1.6}}>
              {tjenesterCatalog.filter(t=>t.aktiv&&t.mvaRisiko==="høy").map(t=>t.navn).join(", ")} — Skatteetaten har i tidligere saker krevd etterbetaling av 25% MVA for disse tjenestetypene. <strong>Avklar med revisor før lansering.</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function Admin({initPage="dashboard",onLogout,tjenesterCatalog,setTjenesterCatalog,orders:ordersProp,setOrders:setOrdersProp,nursesCatalog:nursesProp,setNursesCatalog:setNursesProp,ventendeProfilendringer:ventProp,setVentendeProfilendringer:setVentProp}){
  const[fallbackOrders,setFallbackOrders]=useState(()=>JSON.parse(JSON.stringify(ORDERS)));
  const orders=ordersProp??fallbackOrders;
  const setOrders=setOrdersProp??setFallbackOrders;
  const[fallbackNurses,setFallbackNurses]=useState(()=>JSON.parse(JSON.stringify(NURSES)));
  const nurses=nursesProp??fallbackNurses;
  const setNurses=setNursesProp??setFallbackNurses;
  const[fallbackVent,setFallbackVent]=useState([]);
  const ventendeProfil=ventProp??fallbackVent;
  const setVentendeProfil=setVentProp??setFallbackVent;
  const onGodkjennNurseProfil=useCallback(id=>{
    setVentendeProfil(curr=>{
      const p=curr.find(x=>x.id===id);
      if(p){
        setNurses(nc=>nc.map((nu,i)=>{
          if(i!==p.nurseIndex)return nu;
          const ekstra=(nu.spesialitet||[]).filter(s=>!NURSE_PROFIL_SPESIALITETER_CHIPS.includes(s));
          return{...nu,bio:p.apply.bio,tittel:p.apply.tittel,erfaring:p.apply.erfaring,spesialitet:[...new Set([...p.apply.spesialitet,...ekstra])],omrade:p.apply.omrade};
        }));
      }
      return curr.filter(x=>x.id!==id);
    });
  },[setNurses,setVentendeProfil]);
  const onAvvisNurseProfil=useCallback(id=>{setVentendeProfil(c=>c.filter(x=>x.id!==id));},[setVentendeProfil]);
  const[open,setOpen]=useState(false);
  const[page,setPage]=useState(initPage);
  const[drawer,setDrawer]=useState(null);
  const[koordinatorPrefillEmail,setKoordinatorPrefillEmail]=useState(null);
  const onKoordinatorPrefillConsumed=useCallback(()=>setKoordinatorPrefillEmail(null),[]);
  const pages={
    dashboard:<ADashboard nurses={nurses}/>,oppdrag:<AOppdrag setDrawer={setDrawer} orders={orders} setOrders={setOrders} nurses={nurses}/>,
    betalinger:<ABetalinger/>,b2b:<AB2B setDrawer={setDrawer} onOpprettKoordinator={email=>{setKoordinatorPrefillEmail(String(email||"").trim());setPage("ansatte");}}/>,
    ansatte:<AAnsatte ventendeProfilendringer={ventendeProfil} onGodkjennNurseProfil={onGodkjennNurseProfil} onAvvisNurseProfil={onAvvisNurseProfil} koordinatorPrefillEmail={koordinatorPrefillEmail} onKoordinatorPrefillConsumed={onKoordinatorPrefillConsumed}/>,
    okonomi:<OkonomiPage/>,
    tjenester:<TjenesteAdmin tjenesterCatalog={tjenesterCatalog} setTjenesterCatalog={setTjenesterCatalog}/>,
    innstillinger:<InnstillingerPage/>,
  };
  return(
    <div className="al">
      <ASidebar current={page} open={open} onClose={()=>setOpen(false)} onNav={p=>{setPage(p);setOpen(false);}} onLogout={onLogout}/>
      <div className="am">
        <AHeader onMenuClick={()=>setOpen(true)} page={page}/>
        <div className="ac">{pages[page]??pages.dashboard}</div>
      </div>
      <ADrawer type={drawer} onClose={()=>setDrawer(null)}/>
    </div>
  );
}

// ══ ROOT ══════════════════════════════════════════════════════
const TABS=[{id:"kunde",label:"📱 Kunde-app",def:"landing"},{id:"nurse",label:"🩺 Sykepleier",def:"nurse-login"},{id:"b2b",label:"🏢 B2B-portal",def:"b2b-login"},{id:"admin",label:"🖥️ Adminpanel",def:"admin"}];
const ADMIN_SC=[["dashboard","📊 Dashboard"],["betalinger","💳 Betalinger"],["ansatte","👥 Ansatte"],["b2b","🏢 B2B"],["oppdrag","📋 Oppdrag"],["okonomi","📈 Økonomi"],["tjenester","🏥 Tjenester"]];
function IngenInvitasjonInfo({onNav}){
  const{toast,ToastContainer}=useToast();
  return(
    <div className="phone fu">
      <ToastContainer/>
      <div style={{padding:"22px 18px 20px",background:`linear-gradient(160deg,${C.navy},${C.greenDark})`}}>
        <button onClick={()=>onNav("login")} style={{background:"rgba(255,255,255,.16)",border:"none",color:"white",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>← Tilbake</button>
        <div className="fr" style={{fontSize:18,fontWeight:600,color:"white",marginBottom:2}}>Ikke mottatt invitasjon?</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>Slik kommer du i gang</div>
      </div>
      <div className="sa" style={{padding:"16px 18px"}}>

        {/* Privat kunde */}
        <div style={{background:"white",borderRadius:13,padding:"14px 15px",marginBottom:12,border:`1.5px solid ${C.green}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{width:38,height:38,borderRadius:10,background:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>👤</div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:C.navy}}>Er du privatperson?</div>
              <div style={{fontSize:10,color:C.soft}}>Du trenger ingen invitasjon</div>
            </div>
          </div>
          <div style={{fontSize:10,color:C.navyMid,lineHeight:1.6,marginBottom:10}}>
            Private kunder oppretter konto selv. Logg inn, velg "Privat kunde" og registrer deg — alt er klart på få minutter.
          </div>
          <button onClick={()=>onNav("login")} className="btn bp" style={{width:"100%",padding:"9px 0",fontSize:11,borderRadius:9}}>
            Opprett privat konto →
          </button>
        </div>

        {/* B2B koordinator */}
        <div style={{background:"white",borderRadius:13,padding:"14px 15px",marginBottom:12,border:`1.5px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{width:38,height:38,borderRadius:10,background:"#EEF2FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🏢</div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:C.navy}}>Er du koordinator for en organisasjon?</div>
              <div style={{fontSize:10,color:C.soft}}>Tilgang gis av EiraNova</div>
            </div>
          </div>
          <div style={{fontSize:10,color:C.navyMid,lineHeight:1.6,marginBottom:10}}>
            Koordinatortilgang kan ikke opprettes selv. Din organisasjon må ha en aktiv avtale med EiraNova, og du må inviteres personlig av en EiraNova-administrator.
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {[
              {t:"Har din organisasjon avtale med EiraNova?",sub:"Ta kontakt for å komme i gang",btn:"Ring oss: 900 12 345",btnStyle:{background:C.green,color:"white"}},
              {t:"Organisasjonen har avtale, men du er ikke invitert?",sub:"Be din leder eller IT-kontakt ta kontakt med EiraNova",btn:null},
            ].map((s,i)=>(
              <div key={i} style={{background:C.softBg,borderRadius:9,padding:"10px 12px"}}>
                <div style={{fontSize:11,fontWeight:600,color:C.navy,marginBottom:2}}>{s.t}</div>
                <div style={{fontSize:9,color:C.soft,marginBottom:s.btn?7:0,lineHeight:1.5}}>{s.sub}</div>
                {s.btn&&<button style={{fontSize:10,padding:"5px 13px",border:"none",borderRadius:7,cursor:"pointer",fontFamily:"inherit",fontWeight:600,...s.btnStyle}}>{s.btn}</button>}
              </div>
            ))}
          </div>
        </div>

        {/* B2B bruker / pasient */}
        <div style={{background:"white",borderRadius:13,padding:"14px 15px",border:`1.5px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{width:38,height:38,borderRadius:10,background:"#F5F3FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>👴</div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:C.navy}}>Er du pasient / bruker via kommune?</div>
              <div style={{fontSize:10,color:C.soft}}>Invitasjonen sendes av din koordinator</div>
            </div>
          </div>
          <div style={{fontSize:10,color:C.navyMid,lineHeight:1.6,marginBottom:10}}>
            Din kommunekoordinator eller borettslagets kontaktperson legger deg til i systemet og sender invitasjonen. Ta kontakt med dem — ikke med EiraNova direkte.
          </div>
          <div style={{background:"#F5F3FF",borderRadius:8,padding:"9px 11px",fontSize:10,color:"#5B21B6",lineHeight:1.5}}>
            Sjekk søppelpost-mappen din — invitasjonen kan ha havnet der.
          </div>
        </div>

        <div style={{height:20}}/>
      </div>
    </div>
  );
}


function LoginGate({onNav}){
  return(
    <div className="phone fu">
      <div style={{padding:"26px 18px 22px",background:`linear-gradient(160deg,${C.navy},${C.greenDark})`,textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:10}}>🔒</div>
        <div className="fr" style={{fontSize:18,fontWeight:600,color:"white",marginBottom:4}}>Innlogging kreves</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.7)"}}>Du må logge inn for å bestille</div>
      </div>
      <div className="sa" style={{padding:"22px 18px"}}>
        <div style={{background:C.greenXL,borderRadius:12,padding:"12px 14px",marginBottom:16,border:`1px solid ${C.border}`,fontSize:10,color:C.navyMid,lineHeight:1.6}}>
          For å bestille tjenester trenger vi å vite hvem du er, slik at vi kan sende bekreftelse og knytte bestillingen til din konto.
        </div>
        <button onClick={()=>onNav("login")} className="btn bp bf" style={{borderRadius:11,marginBottom:10,fontSize:13}}>
          Logg inn
        </button>
        <button onClick={()=>onNav("login")} style={{width:"100%",padding:"12px 0",background:"white",color:C.navy,border:`1.5px solid ${C.border}`,borderRadius:11,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",marginBottom:14}}>
          Opprett konto
        </button>
        <div style={{textAlign:"center",fontSize:10,color:C.soft,lineHeight:1.6}}>
          Vil du bare se hva vi tilbyr?{" "}
          <span onClick={()=>onNav("landing")} style={{color:C.green,cursor:"pointer",fontWeight:600}}>Se tjenester →</span>
        </div>
      </div>
    </div>
  );
}


const KREDITERINGER=[
  {id:"KRD-001",type:"b2c",method:"vipps",kunde:"Astrid Hansen",oppdrag:"Morgensstell & dusj",dato:"2026-03-10",belop:590,arsak:"Oppdrag ikke gjennomført — sykepleier syk",status:"refundert",godkjentAv:"Lise Andersen",ref:"vipps_ref_8823x"},
  {id:"KRD-002",type:"b2c",method:"stripe",kunde:"Maria Olsen",oppdrag:"Besøksvenn",dato:"2026-03-08",belop:390,arsak:"Feil pris belastet — dobbeltbestilling",status:"refundert",godkjentAv:"Lise Andersen",ref:"pi_stripe_99kl2"},
  {id:"KRD-003",type:"b2b",method:"kreditnota",kunde:"Moss Kommune",oppdrag:"Ringetilsyn × 4",dato:"2026-03-05",belop:760,arsak:"4 oppdrag ikke gjennomført i uke 9",status:"sendt",godkjentAv:"Lise Andersen",ref:"KN-2026-003",kreditnotaNr:"KN-2026-003"},
  {id:"KRD-004",type:"b2b",method:"kreditnota",kunde:"Parkveien Borettslag",oppdrag:"Praktisk bistand",dato:"2026-02-28",belop:490,arsak:"Prisavvik — feil rammeavtalepris fakturert",status:"sendt",godkjentAv:"Lise Andersen",ref:"KN-2026-002",kreditnotaNr:"KN-2026-002"},
  {id:"KRD-005",type:"b2c",method:"vipps",kunde:"Sara Berg",oppdrag:"Barsel — Trilleturer",dato:"2026-02-20",belop:390,arsak:"Avlyst av kunde — varsel innen 24t",status:"refundert",godkjentAv:"System (auto)",ref:"vipps_ref_7712a"},
];

const KANSELLERING_REGLER={
  fristTimer:24,        // timer før oppdrag — gratis avlysning
  gebyrProsent50:12,    // under X timer → 50% gebyr
  gebyrProsent100:4,    // under X timer → 100% gebyr
  sykepleierSyk:"full_refusjon",  // alltid full refusjon
  erstatningsvarsel:true,          // varsle kunde om bytte
};

const SC={
  kunde:[["landing","Start"],["login","Login"],["push-tillatelse","Push"],["samtykke","Samtykke"],["epost-bekreftelse","E-post"],["onboarding","Onboarding"],["glemt-passord","Glemt pw"],["hjem","Hjem"],["bestill","Bestill"],["betaling","Betaling"],["bekreftelse","OK"],["mine","Mine"],["kunde-oppdrag-detalj","Ordre"],["kunde-profil","Profil"],["kunde-avtale-detalj","Avtale"],["oppdrag-i-gang","Pågår"],["chat-kunde","Chat"],["b2b-dashboard","B2B koordinator"],["b2b-onboarding","B2B ny"],["b2b-bestill","B2B bestill"],["b2b-bruker","B2B bruker"],["b2b-bruker-aktivering","B2B aktiver"]],
  nurse:[["nurse-login","Login"],["nurse-rolle","Rolle"],["nurse-onboarding","SP onboard"],["nurse-hjem","Hjem"],["nurse-oppdrag","Oppdrag"],["nurse-innsjekk","Innsjekk"],["nurse-rapport","Rapport"],["nurse-profil","Profil"]],
  b2b:[["b2b-login","B2B intro"],["login","Kunde-login"],["b2b-onboarding","Koord. onboard"],["b2b-dashboard","Dashboard"],["b2b-bestill","Bestill"],["b2b-bruker","Bruker"],["b2b-bruker-aktivering","Aktivering"]],
};
const SCREENS={
  landing:Landing,login:Login,"push-tillatelse":PushTillatelse,samtykke:Samtykke,"epost-bekreftelse":EpostBekreftelse,onboarding:Onboarding,"glemt-passord":GlemtPassord,"kunde-profil":KundeProfil,"kunde-avtale-detalj":KundeAvtaleDetalj,"oppdrag-i-gang":OppdragIGang,hjem:Hjem,bestill:Bestill,
  betaling:p=><Betaling {...p} date="Tirsdag 4. mars" time="09:00"/>,
  bekreftelse:Bekreftelse,mine:Mine,"kunde-oppdrag-detalj":KundeOppdragDetalj,"chat-kunde":ChatKunde,
  "nurse-login":NurseLogin,"nurse-rolle":NurseRolle,"nurse-onboarding":NurseOnboarding,"nurse-hjem":NurseHjem,"nurse-oppdrag":NurseOppdrag,
  "nurse-innsjekk":p=><NurseInnsjekk {...p} focusOppdragId={p.focusOppdragId}/>,
  "nurse-rapport":NurseRapport,"nurse-profil":NurseProfil,
  "admin-panel":p=><Admin initPage="dashboard" tjenesterCatalog={p.tjenesterCatalog} setTjenesterCatalog={p.setTjenesterCatalog} orders={p.orders} setOrders={p.setOrders} nursesCatalog={p.nursesCatalog} setNursesCatalog={p.setNursesCatalog} ventendeProfilendringer={p.ventendeProfilendringer} setVentendeProfilendringer={p.setVentendeProfilendringer}/>,
  "b2b-login":B2BLogin,"b2b-onboarding":B2BOnboarding,"b2b-dashboard":B2BDashboard,"b2b-bestill":B2BBestill,"b2b-bruker":B2BBruker,"b2b-bruker-aktivering":B2BBrukerAktivering,"ingen-invitasjon":IngenInvitasjonInfo,"login-gate":LoginGate,
};

const KUNDE_SCREEN_PATH={
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

export default function App({
  forcedTab=null,
  forcedScreen=null,
  showPrototypeToolbar=true,
  kundeSessionActive=false,
  kundeOnLogout,
  kundeRouterPush,
}){
  const defaultScreenByTab={kunde:"landing",nurse:"nurse-login",admin:"admin-panel"};
  const initialTab=forcedTab??"kunde";
  const initialScreen=forcedScreen??defaultScreenByTab[initialTab]??"landing";
  const[tab,setTab]=useState(initialTab);
  const[screen,setScreen]=useState(initialScreen);
  const[loggedIn,setLoggedIn]=useState(()=>Boolean(kundeSessionActive));
  const[ap,setAp]=useState("dashboard");
  const[nurseLoggedIn,setNurseLoggedIn]=useState(false);
  const[bestillPreselect,setBestillPreselect]=useState(null);
  const[nurseFocusOppdragId,setNurseFocusOppdragId]=useState(null);
  const[kundeRegEpost,setKundeRegEpost]=useState("");
  const[isNyKoordinator,setIsNyKoordinator]=useState(true);
  const[glemtPassordNurseMode,setGlemtPassordNurseMode]=useState(false);
  const[kundeOrdreDetaljId,setKundeOrdreDetaljId]=useState(null);
  const[tjenesterCatalog,setTjenesterCatalog]=useState(()=>JSON.parse(JSON.stringify(INIT_TJENESTER_CATALOG)));
  const[mockOrders,setMockOrders]=useState(()=>JSON.parse(JSON.stringify(ORDERS)));
  const[nursesCatalog,setNursesCatalog]=useState(()=>JSON.parse(JSON.stringify(NURSES)));
  const[ventendeProfilendringer,setVentendeProfilendringer]=useState([]);
  const customerServices=useMemo(()=>catalogTilKundeServices(tjenesterCatalog),[tjenesterCatalog]);
  useEffect(()=>{ setLoggedIn(Boolean(kundeSessionActive)); },[kundeSessionActive]);
  useEffect(()=>{ if(forcedScreen!=null)setScreen(forcedScreen); },[forcedScreen]);
  const onNurseProfilTilGodkjenning=useCallback(entry=>{
    setVentendeProfilendringer(v=>[...v,{...entry,id:`pe_${Date.now()}`}]);
  },[]);
  const onKundeOrderAvbestill=useCallback(orderId=>{
    // TODO: Resend - send avbestillingsbekreftelse til kunde der e-posten ville blitt sendt i prod.
    setMockOrders(prev=>prev.map(o=>{
      if(String(o.id)!==String(orderId))return o;
      const baseEndringer=Array.isArray(o.endringer)?o.endringer:[];
      const dato=new Date().toLocaleString("nb-NO");
      return{
        ...o,
        status:"cancelled",
        endringer:[
          ...baseEndringer,
          {dato,av:"Kunde (app)",handling:"Avbestilt — selvbetjening innen frist",arsak:null},
          {dato,av:"System",handling:`Avbestillingsbekreftelse sendt til ${MOCK_KUNDE_INNLOGGET_EPOST}`,arsak:null},
        ],
      };
    }));
  },[]);
  const mockKundeLogin=useCallback(()=>{setLoggedIn(true);setScreen("hjem");},[]);
  const mockNurseLogin=useCallback(()=>{setNurseLoggedIn(true);setScreen("nurse-rolle");},[]);
  const isTabLocked=Boolean(forcedTab);
  const activeTab=isTabLocked?forcedTab:tab;
  const isAdmin=activeTab==="admin";
  const isAdminPanel=screen==="admin-panel"; // sykepleier valgte koordinator-rolle
  const navTo=(s,serviceType,opts)=>{
    const o=opts&&typeof opts==="object"?opts:null;
    if(o?.kundeRegEpost!=null)setKundeRegEpost(String(o.kundeRegEpost));
    if(s==="logout"){
      if(kundeOnLogout){kundeOnLogout();return;}
      setLoggedIn(false);setBestillPreselect(null);setKundeOrdreDetaljId(null);setScreen("login");return;
    }
    if(s==="glemt-passord")setGlemtPassordNurseMode(false);
    const krevInnlogging=["bestill","mine","kunde-profil","kunde-avtale-detalj","kunde-oppdrag-detalj","oppdrag-i-gang","chat-kunde"];
    if(krevInnlogging.includes(s)&&!loggedIn){setScreen("login-gate");return;}
    if(o?.b2bOnboardingDone)setIsNyKoordinator(false);
    let dest=s;
    if(s==="b2b-dashboard"&&isNyKoordinator&&!o?.b2bOnboardingDone)dest="b2b-onboarding";
    if(dest==="bestill")setBestillPreselect(serviceType??null);
    else setBestillPreselect(null);
    if(dest==="kunde-oppdrag-detalj"&&o?.orderId!=null)setKundeOrdreDetaljId(String(o.orderId));
    else if(dest!=="kunde-oppdrag-detalj")setKundeOrdreDetaljId(null);
    setScreen(dest);
    if(kundeRouterPush&&activeTab==="kunde"&&KUNDE_SCREEN_PATH[dest]){
      kundeRouterPush(KUNDE_SCREEN_PATH[dest]);
    }
    if(dest==="hjem"||dest==="onboarding")setLoggedIn(true);
    if(dest==="landing"&&o?.scrollTo){
      const sid=String(o.scrollTo).replace(/^#/,"");
      setTimeout(()=>document.getElementById(sid)?.scrollIntoView({behavior:"smooth",block:"start"}),200);
    }
  };
  const nurseNav=(s,meta)=>{
    if(s==="nurse-login"){
      setNurseLoggedIn(false);
      setNurseFocusOppdragId(null);
      setGlemtPassordNurseMode(false);
      setScreen(s);
      return;
    }
    if(s==="glemt-passord"){
      setGlemtPassordNurseMode(Boolean(meta?.nurseMode));
      setNurseFocusOppdragId(null);
      setScreen("glemt-passord");
      return;
    }
    const kreveNurseSessjon=["nurse-rolle","nurse-onboarding","nurse-hjem","nurse-oppdrag","nurse-innsjekk","nurse-profil","nurse-rapport"];
    if(kreveNurseSessjon.includes(s)&&!nurseLoggedIn){
      setScreen("nurse-login");
      return;
    }
    if(s==="nurse-innsjekk"&&meta?.oppdragId!=null)setNurseFocusOppdragId(String(meta.oppdragId));
    else if(s!=="nurse-innsjekk")setNurseFocusOppdragId(null);
    setScreen(s);
  };
  /** Sykepleierflyt må alltid bruke nurseNav + mock når innloggingsskjerm vises — ellers hopper nurseNav tilbake til login. */
  const sykepleierSkjerm=(screen==="glemt-passord"&&glemtPassordNurseMode)||/^nurse-/.test(String(screen||""));
  const prototypeOnNav=sykepleierSkjerm?nurseNav:activeTab==="kunde"?navTo:setScreen;
  const Comp=SCREENS[screen];
  return(
    <>
      <style>{CSS}</style>
      {showPrototypeToolbar&&(
        <div className="pb">
          <div className="fr" style={{fontSize:14,fontWeight:600,color:"white",padding:"9px 8px 9px 4px",marginRight:6}}>Eira<span style={{color:"#E8C4A4"}}>Nova</span></div>
          {!isTabLocked&&TABS.map(t=><button key={t.id} className={`pt${activeTab===t.id?" on":""}`} onClick={()=>{setTab(t.id);if(t.id!=="admin"){setScreen(t.def);if(t.id!=="nurse"){setNurseFocusOppdragId(null);setNurseLoggedIn(false);}if(t.id!=="kunde")setLoggedIn(false);}}}>{t.label}</button>)}
          <div className="ps">
            {(isAdmin||isAdminPanel)
              ?ADMIN_SC.map(([p,l])=><button key={p} className={`sc${ap===p?" on":""}`} onClick={()=>setAp(p)}>{l}</button>)
              :(SC[activeTab]??[]).map(([scr,l])=><button key={scr} className={`sc${screen===scr?" on":""}`} onClick={()=>activeTab==="kunde"?navTo(scr):activeTab==="nurse"?nurseNav(scr):setScreen(scr)}>{l}</button>)
            }
          </div>
        </div>
      )}
      {(isAdmin||isAdminPanel)
        ?<Admin initPage={isAdminPanel?"dashboard":ap} key={ap} onLogout={()=>{if(!isTabLocked){setTab("kunde");setScreen("landing");}}} tjenesterCatalog={tjenesterCatalog} setTjenesterCatalog={setTjenesterCatalog} orders={mockOrders} setOrders={setMockOrders} nursesCatalog={nursesCatalog} setNursesCatalog={setNursesCatalog} ventendeProfilendringer={ventendeProfilendringer} setVentendeProfilendringer={setVentendeProfilendringer}/>
        :<div className={`pw${showPrototypeToolbar?"":" pw-app"}`}>
          {Comp
            ?<Comp onNav={prototypeOnNav} onBack={()=>{}} onMockKundeLogin={activeTab==="kunde"?mockKundeLogin:undefined} onMockNurseLogin={screen==="nurse-login"?mockNurseLogin:undefined} services={customerServices} tjenesterCatalog={tjenesterCatalog} setTjenesterCatalog={setTjenesterCatalog} {...(screen==="landing"?{nurses:nursesCatalog}:{})} {...(screen==="bestill"?{preselectedType:bestillPreselect,nurses:nursesCatalog}:{})} {...(screen==="kunde-oppdrag-detalj"?{orderId:kundeOrdreDetaljId}:{})} {...(screen==="nurse-innsjekk"?{focusOppdragId:nurseFocusOppdragId}:{})} {...(screen==="nurse-profil"?{nurses:nursesCatalog,onNurseProfilTilGodkjenning}:{})} {...(screen==="epost-bekreftelse"?{regEpost:kundeRegEpost}:{})} {...(screen==="glemt-passord"?{nurseMode:glemtPassordNurseMode}:{})} {...(screen==="hjem"?{orders:mockOrders}:{})} {...(screen==="mine"||screen==="kunde-oppdrag-detalj"?{orders:mockOrders,onKundeOrderAvbestill}:{})} {...(screen==="admin-panel"?{orders:mockOrders,setOrders:setMockOrders,nursesCatalog,setNursesCatalog,ventendeProfilendringer,setVentendeProfilendringer}:{})}/>
            :<div style={{padding:40,textAlign:"center",color:C.soft}}>Skjerm: {screen}</div>}
        </div>
      }
    </>
  );
}

export { CSS, C, PH, Login, PushTillatelse, Samtykke, Onboarding, GlemtPassord, Landing, Hjem };
