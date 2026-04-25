import { Suspense } from "react";
import { LoginGate } from "./LoginGate";

export default function LoginPage() {
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
      <LoginGate />
    </Suspense>
  );
}
