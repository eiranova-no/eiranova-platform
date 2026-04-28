import { Suspense } from "react";

import { Oppdrag } from "@/components/screens/Oppdrag/Oppdrag";

export default function OppdragPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "DM Sans, system-ui, sans-serif",
          }}
        >
          Laster …
        </div>
      }
    >
      <div className="pw-app">
        <Oppdrag />
      </div>
    </Suspense>
  );
}
