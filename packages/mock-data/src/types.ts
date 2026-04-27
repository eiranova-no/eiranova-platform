/**
 * Shared types for HANDOFF mock fixtures (Fase A — structural parity with prototype).
 */

export interface TjenesteInstruks {
  kundeversjon: string;
  sykepleiersjon: string;
  inkluderer: string[];
  inkludererIkke: string[];
  endretAv: string;
  endretDato: string;
  versjon: number;
}

export interface TjenesteCatalogEntry {
  id: string;
  kundeType: string;
  navn: string;
  ikon: string;
  kategori: string;
  beskrivelse: string;
  pris: number;
  b2bPris: number | null;
  varighet: number;
  mva: string;
  mvaRisiko: string;
  aktiv: boolean;
  utfoertAv: string[];
  opprettet: string;
  tagline?: string;
  kundeInkluderer?: string[];
  instruks: TjenesteInstruks | null;
}

export interface KundeFacingService {
  type: string;
  name: string;
  detail: string;
  icon: string;
  price: number;
  duration: number;
  cat: string;
  tagline: string;
  inkluderer: string[];
}

export interface MockOrder {
  id: string;
  service: string;
  customer: string;
  nurse: string;
  time: string;
  status: string;
  paid: boolean;
  amount: number;
  cat: string;
  date: string;
  betaltVia: string;
  b2bOrg?: string;
  b2bUserId?: string;
  oppdragId?: string;
  startIso?: string;
}

export interface MockNurse {
  name: string;
  status: string;
  current: string;
  av: string;
  tittel: string;
  erfaring: string;
  bio: string;
  spesialitet: string[];
  språk: string[];
  rating: number;
  antallOppdrag: number;
  sertifisert: boolean;
  omrade: string;
}

export interface OppdragEndring {
  dato: string;
  av: string;
  handling: string;
  arsak: string | null;
}

export interface OppdragEntry {
  id: string;
  time: string;
  date: string;
  customer: string;
  phone: string;
  address: string;
  service: string;
  icon: string;
  cat: string;
  status: string;
  nurse: string;
  amount: number;
  betaltVia: string;
  opprettet: string;
  startIso: string;
  endringer: OppdragEndring[];
}

export interface ChatMessage {
  from: string;
  text: string;
  time: string;
}

export interface NurseProfileLike {
  bio?: string;
  tittel?: string;
  erfaring?: string;
  spesialitet?: string[];
  omrade?: string;
}
