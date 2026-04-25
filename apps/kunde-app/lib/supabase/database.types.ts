export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ansatte: {
        Row: {
          aktiv: boolean | null
          ansatt_dato: string | null
          created_at: string | null
          grunnlonn: number | null
          id: string
          kontonr: string | null
          lonnstrinn: number | null
          stillingsprosent: number | null
          timer_per_uke: number | null
          tittel: string | null
          user_id: string
        }
        Insert: {
          aktiv?: boolean | null
          ansatt_dato?: string | null
          created_at?: string | null
          grunnlonn?: number | null
          id?: string
          kontonr?: string | null
          lonnstrinn?: number | null
          stillingsprosent?: number | null
          timer_per_uke?: number | null
          tittel?: string | null
          user_id: string
        }
        Update: {
          aktiv?: boolean | null
          ansatt_dato?: string | null
          created_at?: string | null
          grunnlonn?: number | null
          id?: string
          kontonr?: string | null
          lonnstrinn?: number | null
          stillingsprosent?: number | null
          timer_per_uke?: number | null
          tittel?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ansatte_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      avtalemodeller: {
        Row: {
          aktiv: boolean | null
          beskrivelse: string | null
          betalingsfrist: number | null
          created_at: string | null
          faktura_type: Database["public"]["Enums"]["faktura_type"]
          fakturadag: number | null
          farge: string | null
          id: string
          ikon: string | null
          label: string
          system_modell: boolean | null
        }
        Insert: {
          aktiv?: boolean | null
          beskrivelse?: string | null
          betalingsfrist?: number | null
          created_at?: string | null
          faktura_type: Database["public"]["Enums"]["faktura_type"]
          fakturadag?: number | null
          farge?: string | null
          id?: string
          ikon?: string | null
          label: string
          system_modell?: boolean | null
        }
        Update: {
          aktiv?: boolean | null
          beskrivelse?: string | null
          betalingsfrist?: number | null
          created_at?: string | null
          faktura_type?: Database["public"]["Enums"]["faktura_type"]
          fakturadag?: number | null
          farge?: string | null
          id?: string
          ikon?: string | null
          label?: string
          system_modell?: boolean | null
        }
        Relationships: []
      }
      b2b_brukere: {
        Row: {
          adresse: string | null
          aktiv: boolean | null
          b2b_org_id: string
          created_at: string | null
          fodselsdato: string | null
          id: string
          navn: string
          pakke: string | null
          user_id: string | null
        }
        Insert: {
          adresse?: string | null
          aktiv?: boolean | null
          b2b_org_id: string
          created_at?: string | null
          fodselsdato?: string | null
          id?: string
          navn: string
          pakke?: string | null
          user_id?: string | null
        }
        Update: {
          adresse?: string | null
          aktiv?: boolean | null
          b2b_org_id?: string
          created_at?: string | null
          fodselsdato?: string | null
          id?: string
          navn?: string
          pakke?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "b2b_brukere_b2b_org_id_fkey"
            columns: ["b2b_org_id"]
            isOneToOne: false
            referencedRelation: "b2b_organisasjoner"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_brukere_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      b2b_fakturaer: {
        Row: {
          b2b_org_id: string
          belop: number | null
          created_at: string | null
          forfallsdato: string | null
          id: string
          pdf_url: string | null
          peppol_ref: string | null
          periode: string | null
          status: Database["public"]["Enums"]["b2b_faktura_status"] | null
        }
        Insert: {
          b2b_org_id: string
          belop?: number | null
          created_at?: string | null
          forfallsdato?: string | null
          id?: string
          pdf_url?: string | null
          peppol_ref?: string | null
          periode?: string | null
          status?: Database["public"]["Enums"]["b2b_faktura_status"] | null
        }
        Update: {
          b2b_org_id?: string
          belop?: number | null
          created_at?: string | null
          forfallsdato?: string | null
          id?: string
          pdf_url?: string | null
          peppol_ref?: string | null
          periode?: string | null
          status?: Database["public"]["Enums"]["b2b_faktura_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "b2b_fakturaer_b2b_org_id_fkey"
            columns: ["b2b_org_id"]
            isOneToOne: false
            referencedRelation: "b2b_organisasjoner"
            referencedColumns: ["id"]
          },
        ]
      }
      b2b_organisasjoner: {
        Row: {
          betalingsdager: number | null
          created_at: string | null
          id: string
          kontakt_epost: string | null
          maaneds_pris: number | null
          navn: string
          org_nr: string | null
          peppol_aktiv: boolean | null
          prismodell_id: string | null
          ramme_priser: Json | null
          type: Database["public"]["Enums"]["b2b_type"]
        }
        Insert: {
          betalingsdager?: number | null
          created_at?: string | null
          id?: string
          kontakt_epost?: string | null
          maaneds_pris?: number | null
          navn: string
          org_nr?: string | null
          peppol_aktiv?: boolean | null
          prismodell_id?: string | null
          ramme_priser?: Json | null
          type: Database["public"]["Enums"]["b2b_type"]
        }
        Update: {
          betalingsdager?: number | null
          created_at?: string | null
          id?: string
          kontakt_epost?: string | null
          maaneds_pris?: number | null
          navn?: string
          org_nr?: string | null
          peppol_aktiv?: boolean | null
          prismodell_id?: string | null
          ramme_priser?: Json | null
          type?: Database["public"]["Enums"]["b2b_type"]
        }
        Relationships: []
      }
      bemanningsbyraaer: {
        Row: {
          aktiv: boolean | null
          api_aktiv: boolean | null
          api_status: string | null
          api_url: string | null
          avtale: string | null
          created_at: string | null
          faktura_type: string | null
          id: string
          kontakt: string | null
          navn: string
          telefon: string | null
          timepris_hjelpepleier: number | null
          timepris_sykepleier: number | null
        }
        Insert: {
          aktiv?: boolean | null
          api_aktiv?: boolean | null
          api_status?: string | null
          api_url?: string | null
          avtale?: string | null
          created_at?: string | null
          faktura_type?: string | null
          id?: string
          kontakt?: string | null
          navn: string
          telefon?: string | null
          timepris_hjelpepleier?: number | null
          timepris_sykepleier?: number | null
        }
        Update: {
          aktiv?: boolean | null
          api_aktiv?: boolean | null
          api_status?: string | null
          api_url?: string | null
          avtale?: string | null
          created_at?: string | null
          faktura_type?: string | null
          id?: string
          kontakt?: string | null
          navn?: string
          telefon?: string | null
          timepris_hjelpepleier?: number | null
          timepris_sykepleier?: number | null
        }
        Relationships: []
      }
      betalinger: {
        Row: {
          belop: number
          ekstern_ref: string | null
          id: string
          kunde_id: string | null
          metode: Database["public"]["Enums"]["betaling_metode"]
          oppdrag_id: string | null
          opprettet_at: string | null
          status: Database["public"]["Enums"]["betaling_status"] | null
        }
        Insert: {
          belop: number
          ekstern_ref?: string | null
          id?: string
          kunde_id?: string | null
          metode: Database["public"]["Enums"]["betaling_metode"]
          oppdrag_id?: string | null
          opprettet_at?: string | null
          status?: Database["public"]["Enums"]["betaling_status"] | null
        }
        Update: {
          belop?: number
          ekstern_ref?: string | null
          id?: string
          kunde_id?: string | null
          metode?: Database["public"]["Enums"]["betaling_metode"]
          oppdrag_id?: string | null
          opprettet_at?: string | null
          status?: Database["public"]["Enums"]["betaling_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "betalinger_kunde_id_fkey"
            columns: ["kunde_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "betalinger_oppdrag_id_fkey"
            columns: ["oppdrag_id"]
            isOneToOne: false
            referencedRelation: "oppdrag"
            referencedColumns: ["id"]
          },
        ]
      }
      dekningsomraader: {
        Row: {
          aktiv: boolean | null
          apner: string | null
          created_at: string | null
          fylke: string | null
          id: string
          navn: string
          stenges: string | null
        }
        Insert: {
          aktiv?: boolean | null
          apner?: string | null
          created_at?: string | null
          fylke?: string | null
          id?: string
          navn: string
          stenges?: string | null
        }
        Update: {
          aktiv?: boolean | null
          apner?: string | null
          created_at?: string | null
          fylke?: string | null
          id?: string
          navn?: string
          stenges?: string | null
        }
        Relationships: []
      }
      innstillinger: {
        Row: {
          b2b_aktiv: boolean | null
          betalingsfrist: number | null
          fakturadag: number | null
          id: boolean
          kansellering_frister: Json | null
          kontakt_epost: string | null
          mva_sats: number | null
          org_navn: string | null
          org_nr: string | null
          updated_at: string | null
        }
        Insert: {
          b2b_aktiv?: boolean | null
          betalingsfrist?: number | null
          fakturadag?: number | null
          id?: boolean
          kansellering_frister?: Json | null
          kontakt_epost?: string | null
          mva_sats?: number | null
          org_navn?: string | null
          org_nr?: string | null
          updated_at?: string | null
        }
        Update: {
          b2b_aktiv?: boolean | null
          betalingsfrist?: number | null
          fakturadag?: number | null
          id?: boolean
          kansellering_frister?: Json | null
          kontakt_epost?: string | null
          mva_sats?: number | null
          org_navn?: string | null
          org_nr?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      krediteringer: {
        Row: {
          arsak: string | null
          arsak_type: string | null
          b2b_org_id: string | null
          belop: number
          godkjent_av: string | null
          id: string
          kreditnota_nr: string | null
          kunde_id: string | null
          metode: Database["public"]["Enums"]["kreditering_metode"] | null
          oppdrag_id: string | null
          opprettet_at: string | null
          status: Database["public"]["Enums"]["kreditering_status"] | null
          type: string | null
        }
        Insert: {
          arsak?: string | null
          arsak_type?: string | null
          b2b_org_id?: string | null
          belop: number
          godkjent_av?: string | null
          id?: string
          kreditnota_nr?: string | null
          kunde_id?: string | null
          metode?: Database["public"]["Enums"]["kreditering_metode"] | null
          oppdrag_id?: string | null
          opprettet_at?: string | null
          status?: Database["public"]["Enums"]["kreditering_status"] | null
          type?: string | null
        }
        Update: {
          arsak?: string | null
          arsak_type?: string | null
          b2b_org_id?: string | null
          belop?: number
          godkjent_av?: string | null
          id?: string
          kreditnota_nr?: string | null
          kunde_id?: string | null
          metode?: Database["public"]["Enums"]["kreditering_metode"] | null
          oppdrag_id?: string | null
          opprettet_at?: string | null
          status?: Database["public"]["Enums"]["kreditering_status"] | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "krediteringer_b2b_org_id_fkey"
            columns: ["b2b_org_id"]
            isOneToOne: false
            referencedRelation: "b2b_organisasjoner"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "krediteringer_godkjent_av_fkey"
            columns: ["godkjent_av"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "krediteringer_kunde_id_fkey"
            columns: ["kunde_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "krediteringer_oppdrag_id_fkey"
            columns: ["oppdrag_id"]
            isOneToOne: false
            referencedRelation: "oppdrag"
            referencedColumns: ["id"]
          },
        ]
      }
      lonnkjoringer: {
        Row: {
          ag_avgift: number | null
          created_at: string | null
          feriepenger: number | null
          id: string
          maaned: string
          status: string | null
          total_brutto: number | null
          total_netto: number | null
          utbetalings_dato: string | null
        }
        Insert: {
          ag_avgift?: number | null
          created_at?: string | null
          feriepenger?: number | null
          id?: string
          maaned: string
          status?: string | null
          total_brutto?: number | null
          total_netto?: number | null
          utbetalings_dato?: string | null
        }
        Update: {
          ag_avgift?: number | null
          created_at?: string | null
          feriepenger?: number | null
          id?: string
          maaned?: string
          status?: string | null
          total_brutto?: number | null
          total_netto?: number | null
          utbetalings_dato?: string | null
        }
        Relationships: []
      }
      oppdrag: {
        Row: {
          adresse: string | null
          b2b_bruker_id: string | null
          b2b_org_id: string | null
          belop: number | null
          betalt_via: Database["public"]["Enums"]["betaling_metode"] | null
          dato: string
          id: string
          kunde_id: string
          oppdatert_at: string | null
          opprettet_at: string | null
          parorende_id: string | null
          status: Database["public"]["Enums"]["oppdrag_status"] | null
          stripe_payment_intent: string | null
          sykepleier_id: string | null
          tid_slutt: string | null
          tid_start: string
          tjeneste_id: string | null
          vipps_payment_id: string | null
        }
        Insert: {
          adresse?: string | null
          b2b_bruker_id?: string | null
          b2b_org_id?: string | null
          belop?: number | null
          betalt_via?: Database["public"]["Enums"]["betaling_metode"] | null
          dato: string
          id?: string
          kunde_id: string
          oppdatert_at?: string | null
          opprettet_at?: string | null
          parorende_id?: string | null
          status?: Database["public"]["Enums"]["oppdrag_status"] | null
          stripe_payment_intent?: string | null
          sykepleier_id?: string | null
          tid_slutt?: string | null
          tid_start: string
          tjeneste_id?: string | null
          vipps_payment_id?: string | null
        }
        Update: {
          adresse?: string | null
          b2b_bruker_id?: string | null
          b2b_org_id?: string | null
          belop?: number | null
          betalt_via?: Database["public"]["Enums"]["betaling_metode"] | null
          dato?: string
          id?: string
          kunde_id?: string
          oppdatert_at?: string | null
          opprettet_at?: string | null
          parorende_id?: string | null
          status?: Database["public"]["Enums"]["oppdrag_status"] | null
          stripe_payment_intent?: string | null
          sykepleier_id?: string | null
          tid_slutt?: string | null
          tid_start?: string
          tjeneste_id?: string | null
          vipps_payment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oppdrag_b2b_bruker_id_fkey"
            columns: ["b2b_bruker_id"]
            isOneToOne: false
            referencedRelation: "b2b_brukere"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oppdrag_b2b_org_id_fkey"
            columns: ["b2b_org_id"]
            isOneToOne: false
            referencedRelation: "b2b_organisasjoner"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oppdrag_kunde_id_fkey"
            columns: ["kunde_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oppdrag_parorende_id_fkey"
            columns: ["parorende_id"]
            isOneToOne: false
            referencedRelation: "parorende"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oppdrag_sykepleier_id_fkey"
            columns: ["sykepleier_id"]
            isOneToOne: false
            referencedRelation: "sykepleiere"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oppdrag_tjeneste_id_fkey"
            columns: ["tjeneste_id"]
            isOneToOne: false
            referencedRelation: "tjenester"
            referencedColumns: ["id"]
          },
        ]
      }
      oppdrag_endringer: {
        Row: {
          arsak: string | null
          dato: string | null
          endret_av: string | null
          handling: string
          id: string
          ny_sykepleier_id: string | null
          oppdrag_id: string
        }
        Insert: {
          arsak?: string | null
          dato?: string | null
          endret_av?: string | null
          handling: string
          id?: string
          ny_sykepleier_id?: string | null
          oppdrag_id: string
        }
        Update: {
          arsak?: string | null
          dato?: string | null
          endret_av?: string | null
          handling?: string
          id?: string
          ny_sykepleier_id?: string | null
          oppdrag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oppdrag_endringer_endret_av_fkey"
            columns: ["endret_av"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oppdrag_endringer_ny_sykepleier_id_fkey"
            columns: ["ny_sykepleier_id"]
            isOneToOne: false
            referencedRelation: "sykepleiere"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oppdrag_endringer_oppdrag_id_fkey"
            columns: ["oppdrag_id"]
            isOneToOne: false
            referencedRelation: "oppdrag"
            referencedColumns: ["id"]
          },
        ]
      }
      parorende: {
        Row: {
          adresse: string | null
          created_at: string | null
          id: string
          navn: string
          postnr: string | null
          poststed: string | null
          relasjon: string | null
          user_id: string
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          id?: string
          navn: string
          postnr?: string | null
          poststed?: string | null
          relasjon?: string | null
          user_id: string
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          id?: string
          navn?: string
          postnr?: string | null
          poststed?: string | null
          relasjon?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parorende_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      push_varsler: {
        Row: {
          body: string | null
          created_at: string | null
          data: Json | null
          id: string
          lest: boolean | null
          tittel: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          lest?: boolean | null
          tittel: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          lest?: boolean | null
          tittel?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_varsler_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      samtykker: {
        Row: {
          godkjent_at: string | null
          id: string
          trukket_at: string | null
          type: Database["public"]["Enums"]["samtykke_type"]
          user_id: string
          versjon: string
        }
        Insert: {
          godkjent_at?: string | null
          id?: string
          trukket_at?: string | null
          type: Database["public"]["Enums"]["samtykke_type"]
          user_id: string
          versjon: string
        }
        Update: {
          godkjent_at?: string | null
          id?: string
          trukket_at?: string | null
          type?: Database["public"]["Enums"]["samtykke_type"]
          user_id?: string
          versjon?: string
        }
        Relationships: [
          {
            foreignKeyName: "samtykker_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      skattetrekk: {
        Row: {
          ansatt_id: string | null
          id: string
          innbetalt_dato: string | null
          kid: string | null
          lonnkjoring_id: string | null
          status: string | null
          trekk_belop: number | null
          trekk_prosent: number | null
        }
        Insert: {
          ansatt_id?: string | null
          id?: string
          innbetalt_dato?: string | null
          kid?: string | null
          lonnkjoring_id?: string | null
          status?: string | null
          trekk_belop?: number | null
          trekk_prosent?: number | null
        }
        Update: {
          ansatt_id?: string | null
          id?: string
          innbetalt_dato?: string | null
          kid?: string | null
          lonnkjoring_id?: string | null
          status?: string | null
          trekk_belop?: number | null
          trekk_prosent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skattetrekk_ansatt_id_fkey"
            columns: ["ansatt_id"]
            isOneToOne: false
            referencedRelation: "ansatte"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skattetrekk_lonnkjoring_id_fkey"
            columns: ["lonnkjoring_id"]
            isOneToOne: false
            referencedRelation: "lonnkjoringer"
            referencedColumns: ["id"]
          },
        ]
      }
      sykepleiere: {
        Row: {
          aktiv: boolean | null
          antall_oppdrag: number | null
          bio: string | null
          enk_org: string | null
          er_vikar: boolean | null
          erfaring_aar: number | null
          godkjent: boolean | null
          godkjent_dato: string | null
          hpr_nummer: string | null
          id: string
          kontonr: string | null
          omrade: string[] | null
          rating: number | null
          sertifisert: boolean | null
          spesialiteter: string[] | null
          sprak: string[] | null
          status: Database["public"]["Enums"]["sykepleier_status"] | null
          tittel: string | null
          user_id: string
          varsel_kanal: Database["public"]["Enums"]["varsel_kanal"] | null
        }
        Insert: {
          aktiv?: boolean | null
          antall_oppdrag?: number | null
          bio?: string | null
          enk_org?: string | null
          er_vikar?: boolean | null
          erfaring_aar?: number | null
          godkjent?: boolean | null
          godkjent_dato?: string | null
          hpr_nummer?: string | null
          id?: string
          kontonr?: string | null
          omrade?: string[] | null
          rating?: number | null
          sertifisert?: boolean | null
          spesialiteter?: string[] | null
          sprak?: string[] | null
          status?: Database["public"]["Enums"]["sykepleier_status"] | null
          tittel?: string | null
          user_id: string
          varsel_kanal?: Database["public"]["Enums"]["varsel_kanal"] | null
        }
        Update: {
          aktiv?: boolean | null
          antall_oppdrag?: number | null
          bio?: string | null
          enk_org?: string | null
          er_vikar?: boolean | null
          erfaring_aar?: number | null
          godkjent?: boolean | null
          godkjent_dato?: string | null
          hpr_nummer?: string | null
          id?: string
          kontonr?: string | null
          omrade?: string[] | null
          rating?: number | null
          sertifisert?: boolean | null
          spesialiteter?: string[] | null
          sprak?: string[] | null
          status?: Database["public"]["Enums"]["sykepleier_status"] | null
          tittel?: string | null
          user_id?: string
          varsel_kanal?: Database["public"]["Enums"]["varsel_kanal"] | null
        }
        Relationships: [
          {
            foreignKeyName: "sykepleiere_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_events: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          melding: string | null
          severity: Database["public"]["Enums"]["severity_level"] | null
          type: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          melding?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          type: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          melding?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          type?: string
        }
        Relationships: []
      }
      tjeneste_kategorier: {
        Row: {
          farge: string | null
          gradient: string | null
          id: string
          ikon: string | null
          label: string
          opprettet_at: string | null
        }
        Insert: {
          farge?: string | null
          gradient?: string | null
          id?: string
          ikon?: string | null
          label: string
          opprettet_at?: string | null
        }
        Update: {
          farge?: string | null
          gradient?: string | null
          id?: string
          ikon?: string | null
          label?: string
          opprettet_at?: string | null
        }
        Relationships: []
      }
      tjenester: {
        Row: {
          aktiv: boolean | null
          b2b_pris: number | null
          beskrivelse: string | null
          endret_av: string | null
          endret_dato: string | null
          id: string
          ikon: string | null
          inkluderer: string[] | null
          inkluderer_ikke: string[] | null
          instruks_kunde: string | null
          instruks_sykepleier: string | null
          kategori_id: string | null
          mva_risiko: Database["public"]["Enums"]["mva_risiko"] | null
          mva_sats: number | null
          navn: string
          opprettet_at: string | null
          pris: number
          utfoert_av: string[] | null
          varighet_min: number | null
          versjon: number | null
        }
        Insert: {
          aktiv?: boolean | null
          b2b_pris?: number | null
          beskrivelse?: string | null
          endret_av?: string | null
          endret_dato?: string | null
          id?: string
          ikon?: string | null
          inkluderer?: string[] | null
          inkluderer_ikke?: string[] | null
          instruks_kunde?: string | null
          instruks_sykepleier?: string | null
          kategori_id?: string | null
          mva_risiko?: Database["public"]["Enums"]["mva_risiko"] | null
          mva_sats?: number | null
          navn: string
          opprettet_at?: string | null
          pris: number
          utfoert_av?: string[] | null
          varighet_min?: number | null
          versjon?: number | null
        }
        Update: {
          aktiv?: boolean | null
          b2b_pris?: number | null
          beskrivelse?: string | null
          endret_av?: string | null
          endret_dato?: string | null
          id?: string
          ikon?: string | null
          inkluderer?: string[] | null
          inkluderer_ikke?: string[] | null
          instruks_kunde?: string | null
          instruks_sykepleier?: string | null
          kategori_id?: string | null
          mva_risiko?: Database["public"]["Enums"]["mva_risiko"] | null
          mva_sats?: number | null
          navn?: string
          opprettet_at?: string | null
          pris?: number
          utfoert_av?: string[] | null
          varighet_min?: number | null
          versjon?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tjenester_endret_av_fkey"
            columns: ["endret_av"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tjenester_kategori_id_fkey"
            columns: ["kategori_id"]
            isOneToOne: false
            referencedRelation: "tjeneste_kategorier"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          full_name: string | null
          gdpr_consent_at: string | null
          id: string
          marketing_consent: boolean | null
          phone: string | null
          postnr: string | null
          poststed: string | null
          push_enabled: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          terms_accepted_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          full_name?: string | null
          gdpr_consent_at?: string | null
          id: string
          marketing_consent?: boolean | null
          phone?: string | null
          postnr?: string | null
          poststed?: string | null
          push_enabled?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          terms_accepted_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          full_name?: string | null
          gdpr_consent_at?: string | null
          id?: string
          marketing_consent?: boolean | null
          phone?: string | null
          postnr?: string | null
          poststed?: string | null
          push_enabled?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          terms_accepted_at?: string | null
        }
        Relationships: []
      }
      varslingsmottakere: {
        Row: {
          aktiv: boolean | null
          created_at: string | null
          epost: string
          id: string
          kanaler: Json | null
          navn: string
          rolle: string | null
          varsler: Json | null
        }
        Insert: {
          aktiv?: boolean | null
          created_at?: string | null
          epost: string
          id?: string
          kanaler?: Json | null
          navn: string
          rolle?: string | null
          varsler?: Json | null
        }
        Update: {
          aktiv?: boolean | null
          created_at?: string | null
          epost?: string
          id?: string
          kanaler?: Json | null
          navn?: string
          rolle?: string | null
          varsler?: Json | null
        }
        Relationships: []
      }
      vikarer: {
        Row: {
          aktiv: boolean | null
          created_at: string | null
          enk: boolean | null
          enk_org: string | null
          id: string
          kontonr: string | null
          omrade: string[] | null
          responstid_snitt: number | null
          sykepleier_id: string
          tjenester: string[] | null
          varsel_kanal: Database["public"]["Enums"]["varsel_kanal"] | null
        }
        Insert: {
          aktiv?: boolean | null
          created_at?: string | null
          enk?: boolean | null
          enk_org?: string | null
          id?: string
          kontonr?: string | null
          omrade?: string[] | null
          responstid_snitt?: number | null
          sykepleier_id: string
          tjenester?: string[] | null
          varsel_kanal?: Database["public"]["Enums"]["varsel_kanal"] | null
        }
        Update: {
          aktiv?: boolean | null
          created_at?: string | null
          enk?: boolean | null
          enk_org?: string | null
          id?: string
          kontonr?: string | null
          omrade?: string[] | null
          responstid_snitt?: number | null
          sykepleier_id?: string
          tjenester?: string[] | null
          varsel_kanal?: Database["public"]["Enums"]["varsel_kanal"] | null
        }
        Relationships: [
          {
            foreignKeyName: "vikarer_sykepleier_id_fkey"
            columns: ["sykepleier_id"]
            isOneToOne: false
            referencedRelation: "sykepleiere"
            referencedColumns: ["id"]
          },
        ]
      }
      vurderinger: {
        Row: {
          created_at: string | null
          id: string
          kommentar: string | null
          kunde_id: string
          oppdrag_id: string
          stjerner: number | null
          sykepleier_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          kommentar?: string | null
          kunde_id: string
          oppdrag_id: string
          stjerner?: number | null
          sykepleier_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          kommentar?: string | null
          kunde_id?: string
          oppdrag_id?: string
          stjerner?: number | null
          sykepleier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vurderinger_kunde_id_fkey"
            columns: ["kunde_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vurderinger_oppdrag_id_fkey"
            columns: ["oppdrag_id"]
            isOneToOne: true
            referencedRelation: "oppdrag"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vurderinger_sykepleier_id_fkey"
            columns: ["sykepleier_id"]
            isOneToOne: false
            referencedRelation: "sykepleiere"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      next_kreditnota_nr: { Args: never; Returns: string }
    }
    Enums: {
      b2b_faktura_status: "usendt" | "sendt" | "forfalt" | "betalt"
      b2b_type: "kommune" | "borettslag" | "bedrift"
      betaling_metode: "vipps" | "stripe" | "ehf" | "kredittnota"
      betaling_status: "venter" | "betalt" | "feilet" | "refundert"
      faktura_type: "maanedlig" | "per_oppdrag" | "engang" | "kvartal"
      kreditering_metode: "vipps" | "stripe" | "kreditnota"
      kreditering_status: "initiert" | "refundert" | "sendt"
      mva_risiko: "lav" | "medium" | "høy"
      oppdrag_status:
        | "pending"
        | "bekreftet"
        | "tildelt"
        | "aktiv"
        | "fullfort"
        | "avlyst"
      samtykke_type: "gdpr" | "vilkaar" | "markedsfoering"
      severity_level: "SEV1" | "SEV2" | "SEV3" | "INFO"
      sykepleier_status: "aktiv" | "venter_godkjenning" | "inaktiv"
      user_role: "kunde" | "sykepleier" | "koordinator" | "admin"
      varsel_kanal: "push" | "sms"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      b2b_faktura_status: ["usendt", "sendt", "forfalt", "betalt"],
      b2b_type: ["kommune", "borettslag", "bedrift"],
      betaling_metode: ["vipps", "stripe", "ehf", "kredittnota"],
      betaling_status: ["venter", "betalt", "feilet", "refundert"],
      faktura_type: ["maanedlig", "per_oppdrag", "engang", "kvartal"],
      kreditering_metode: ["vipps", "stripe", "kreditnota"],
      kreditering_status: ["initiert", "refundert", "sendt"],
      mva_risiko: ["lav", "medium", "høy"],
      oppdrag_status: [
        "pending",
        "bekreftet",
        "tildelt",
        "aktiv",
        "fullfort",
        "avlyst",
      ],
      samtykke_type: ["gdpr", "vilkaar", "markedsfoering"],
      severity_level: ["SEV1", "SEV2", "SEV3", "INFO"],
      sykepleier_status: ["aktiv", "venter_godkjenning", "inaktiv"],
      user_role: ["kunde", "sykepleier", "koordinator", "admin"],
      varsel_kanal: ["push", "sms"],
    },
  },
} as const
