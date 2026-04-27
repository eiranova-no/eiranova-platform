"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import type { KundeFacingService } from "@eiranova/mock-data";

/**
 * Delvis utfylt bestilling, synket til Betaling/Bekreftelse (når de migreres) via layout-provider.
 * `sykepleierNavn === null` betyr «EiraNova velger for meg».
 */
export interface BestillOrdreState {
  tjeneste: KundeFacingService | null;
  dato: string | null;
  tidspunkt: string | null;
  adresse: string;
  sykepleierNavn: string | null;
}

const defaultState: BestillOrdreState = {
  tjeneste: null,
  dato: null,
  tidspunkt: null,
  adresse: "",
  sykepleierNavn: null,
};

interface BestillFlowContextValue {
  ordre: BestillOrdreState;
  setOrdre: (partial: Partial<BestillOrdreState>) => void;
  resetOrdre: () => void;
}

const BestillFlowContext = createContext<BestillFlowContextValue | null>(null);

export function BestillFlowProvider({ children }: { children: ReactNode }) {
  const [ordre, setOrdreState] = useState<BestillOrdreState>(defaultState);

  const setOrdre = useCallback((partial: Partial<BestillOrdreState>) => {
    setOrdreState((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetOrdre = useCallback(() => {
    setOrdreState(defaultState);
  }, []);

  return (
    <BestillFlowContext.Provider value={{ ordre, setOrdre, resetOrdre }}>{children}</BestillFlowContext.Provider>
  );
}

export function useBestillFlow(): BestillFlowContextValue {
  const v = useContext(BestillFlowContext);
  if (!v) {
    throw new Error("useBestillFlow må brukes under BestillFlowProvider (app/bestill/layout).");
  }
  return v;
}
