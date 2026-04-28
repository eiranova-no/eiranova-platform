import { Suspense } from "react";

import { Rolle } from "@/components/screens/Rolle/Rolle";

export default function RollePage() {
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
        <Rolle />
      </div>
    </Suspense>
  );
}
