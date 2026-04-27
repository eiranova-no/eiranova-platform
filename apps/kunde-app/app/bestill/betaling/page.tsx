import { redirect } from "next/navigation";

import { BestillBetalingPlassholder } from "@/components/screens/Bestill/BestillBetalingPlassholder";
import { getServerSession } from "@/lib/auth/server";

/**
 * Plassholder under Fase B2 Steg 3 — full `Betaling.tsx` byttes inn her.
 */
export default async function BetalingPlassholderPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?returUrl=" + encodeURIComponent("/bestill/betaling"));
  }
  return (
    <div className="pw-app">
      <BestillBetalingPlassholder />
    </div>
  );
}
