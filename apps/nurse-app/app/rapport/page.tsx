import { Suspense } from "react";

import { Rapport } from "@/components/screens/Rapport/Rapport";

export default function RapportPage() {
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
        <Rapport />
      </div>
    </Suspense>
  );
}
