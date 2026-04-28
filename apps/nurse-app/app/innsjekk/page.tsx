import { Suspense } from "react";

import { Innsjekk } from "@/components/screens/Innsjekk/Innsjekk";

export default function InnsjekkPage() {
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
        <Innsjekk />
      </div>
    </Suspense>
  );
}
