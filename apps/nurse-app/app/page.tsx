import { Suspense } from "react";

import { Hjem } from "@/components/screens/Hjem/Hjem";

export default function HjemPage() {
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
        <Hjem />
      </div>
    </Suspense>
  );
}
