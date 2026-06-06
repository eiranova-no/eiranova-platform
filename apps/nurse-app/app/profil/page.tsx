import { Suspense } from "react";

import { Profil } from "@/components/screens/Profil/Profil";

export default function ProfilPage() {
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
        <Profil />
      </div>
    </Suspense>
  );
}
