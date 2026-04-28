import { Suspense } from "react";

import { B2BBruker } from "@/components/screens/B2BBruker/B2BBruker";

export default function B2BBrukerPage() {
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
        <B2BBruker />
      </div>
    </Suspense>
  );
}
