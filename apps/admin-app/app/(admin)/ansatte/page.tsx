import { Suspense } from "react";

import { Ansatte } from "@/components/screens/Ansatte/Ansatte";

export default function AnsattePage() {
  return (
    <Suspense
      fallback={<div style={{ padding: 24, fontFamily: "DM Sans, system-ui, sans-serif" }}>Laster …</div>}
    >
      <Ansatte />
    </Suspense>
  );
}
