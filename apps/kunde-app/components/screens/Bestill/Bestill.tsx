"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { KundeFacingService, MockNurse } from "@eiranova/mock-data";
import { BN_K, DEFAULT_KUNDE_SERVICES, NURSES } from "@eiranova/mock-data";

import { useBestillFlow } from "./BestillFlowContext";
import { BestillSteg1Tjeneste, type BestillKundeNav } from "./BestillSteg1Tjeneste";
import { BestillSteg2DatoTid } from "./BestillSteg2DatoTid";
import { BestillSteg3Sykepleier } from "./BestillSteg3Sykepleier";

export interface BestillProps {
  /** URL `?tjeneste=` — prefiller tjeneste og hopper til steg 2 (dato/tid). */
  preselectTjeneste?: string;
  services?: KundeFacingService[];
  nurses?: MockNurse[];
}

/**
 * Kunde: 3-stegs bestillingswizard (prototype `Bestill` — tjeneste → dato/tid → sykepleier).
 * Betaling er egen rute i Fase B2 Steg 3.
 */
export function Bestill({
  preselectTjeneste,
  services = DEFAULT_KUNDE_SERVICES,
  nurses = NURSES,
}: BestillProps) {
  const router = useRouter();
  const { setOrdre } = useBestillFlow();

  const defaultService = services.find((s) => s.type === "morgensstell") ?? services[0];
  const fromType = useCallback(
    (t: string) => services.find((s) => s.type === t) ?? defaultService,
    [services, defaultService],
  );

  const [step, setStep] = useState(() => (preselectTjeneste ? 1 : 0));
  const [sel, setSel] = useState<KundeFacingService | null>(() => {
    if (!preselectTjeneste) return null;
    const d = services.find((s) => s.type === "morgensstell") ?? services[0];
    return services.find((s) => s.type === preselectTjeneste) ?? d;
  });
  const [chosenNurse, setChosenNurse] = useState<string | null>(null);
  const [date, setDate] = useState("Tirsdag 4. mars");
  const [time, setTime] = useState("09:00");
  const [adresse, setAdresse] = useState("Konggata 12, 1530 Moss");

  useEffect(() => {
    if (preselectTjeneste) {
      setSel(fromType(preselectTjeneste));
      setStep(1);
    } else {
      setSel(null);
      setStep(0);
    }
  }, [preselectTjeneste, fromType]);

  const onNav: BestillKundeNav = useCallback(
    (id, _arg2, meta) => {
      if (id === "bestill" && typeof _arg2 === "string") {
        void router.push(`/bestill?tjeneste=${encodeURIComponent(_arg2)}`);
        return;
      }
      const paths: Record<string, string> = {
        hjem: "/",
        bestill: "/bestill",
        mine: "/mine",
        "chat-kunde": "/chat",
        "kunde-profil": "/profil",
        "kunde-avtale-detalj": "/mine?vis=avtale",
        "kunde-oppdrag-detalj": meta?.orderId ? `/mine?order=${encodeURIComponent(meta.orderId)}` : "/mine",
      };
      void router.push(paths[id] ?? "/");
    },
    [router],
  );

  const velgTjeneste = useCallback((sv: KundeFacingService) => {
    setSel(sv);
    setChosenNurse(null);
    setStep(1);
  }, []);

  const handleSteg2Back = useCallback(() => {
    if (preselectTjeneste) {
      void router.push("/");
    } else {
      setStep(0);
    }
  }, [preselectTjeneste, router]);

  const handleGaaTilBetaling = useCallback(
    (sykepleierNavn: string | null) => {
      if (!sel) return;
      setChosenNurse(sykepleierNavn);
      setOrdre({
        tjeneste: sel,
        dato: date,
        tidspunkt: time,
        adresse,
        sykepleierNavn,
      });
      void router.push("/bestill/betaling");
    },
    [sel, date, time, adresse, setOrdre, router],
  );

  if (step === 0 || !sel) {
    return <BestillSteg1Tjeneste services={services} navItems={BN_K} onNav={onNav} onVelgTjeneste={velgTjeneste} />;
  }

  if (step === 1) {
    return (
      <BestillSteg2DatoTid
        tjeneste={sel}
        dato={date}
        tidspunkt={time}
        adresse={adresse}
        onChangeDato={setDate}
        onChangeTid={setTime}
        onChangeAdresse={setAdresse}
        onBack={handleSteg2Back}
        onNext={() => setStep(2)}
        tjenestePreutfylt={Boolean(preselectTjeneste)}
      />
    );
  }

  return (
    <BestillSteg3Sykepleier
      nurses={nurses}
      chosenNurse={chosenNurse}
      onSetChosen={setChosenNurse}
      onBack={() => setStep(1)}
      onGaaTilBetaling={handleGaaTilBetaling}
    />
  );
}
