import { Suspense } from "react";

import { Onboarding } from "@/components/screens/Onboarding/Onboarding";

export default function NurseOnboardingPage() {
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
        <Onboarding />
      </div>
    </Suspense>
  );
}
