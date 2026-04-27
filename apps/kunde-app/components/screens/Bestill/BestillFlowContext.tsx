"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import type { KundeFacingService } from "@eiranova/mock-data";

const STORAGE_KEY = "bestill-ordre-v1";

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

function readOrdreFromStorage(): BestillOrdreState {
  if (typeof window === "undefined") {
    return defaultState;
  }
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;
    const parsed = JSON.parse(stored) as BestillOrdreState;
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
    return defaultState;
  } catch {
    return defaultState;
  }
}

interface BestillFlowContextValue {
  ordre: BestillOrdreState;
  setOrdre: (partial: Partial<BestillOrdreState>) => void;
  resetOrdre: () => void;
}

const BestillFlowContext = createContext<BestillFlowContextValue | null>(null);

export function BestillFlowProvider({ children }: { children: ReactNode }) {
  const [ordre, setOrdreState] = useState<BestillOrdreState>(() => readOrdreFromStorage());

  const setOrdre = useCallback((partial: Partial<BestillOrdreState>) => {
    setOrdreState((prev) => {
      const next: BestillOrdreState = { ...prev, ...partial };
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* quota / private mode */
        }
      }
      return next;
    });
  }, []);

  const resetOrdre = useCallback(() => {
    setOrdreState({ ...defaultState });
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
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
