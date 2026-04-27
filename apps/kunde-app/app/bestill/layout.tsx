import { BestillFlowProvider } from "@/components/screens/Bestill/BestillFlowContext";

/**
 * Deler ordrestate mellom bestill, betaling og bekreftelse under /bestill/*.
 */
export default function BestillLayout({ children }: { children: React.ReactNode }) {
  return <BestillFlowProvider>{children}</BestillFlowProvider>;
}
