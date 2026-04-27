"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import type { KundeFacingService } from "@eiranova/mock-data";
import { DEFAULT_KUNDE_SERVICES, NURSES } from "@eiranova/mock-data";
import { useViewportMin768 } from "@eiranova/ui";

import { LandKundeDesktop } from "./LandKundeDesktop";
import { LandKundeMobile } from "./LandKundeMobile";

export interface LandingProps {
  services?: typeof DEFAULT_KUNDE_SERVICES;
  nurses?: typeof NURSES;
}

export function Landing({ services = DEFAULT_KUNDE_SERVICES, nurses = NURSES }: LandingProps) {
  const router = useRouter();
  const desktop = useViewportMin768();

  const onNavigate = useCallback(
    (dest: "bestill" | "login") => {
      if (dest === "bestill") void router.push("/bestill");
      else void router.push("/login");
    },
    [router],
  );

  const onContinueToBestill = useCallback(
    (_service: KundeFacingService) => {
      void router.push("/bestill");
    },
    [router],
  );

  if (desktop) {
    return (
      <LandKundeDesktop
        services={services}
        nurses={nurses}
        onNavigate={onNavigate}
        onContinueToBestill={onContinueToBestill}
      />
    );
  }

  return (
    <LandKundeMobile
      services={services}
      nurses={nurses}
      onNavigate={onNavigate}
      onContinueToBestill={onContinueToBestill}
    />
  );
}
