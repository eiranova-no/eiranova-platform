import { Suspense } from "react";
import { redirect } from "next/navigation";

import { Mine } from "@/components/screens/Mine/Mine";
import { getServerSession } from "@/lib/auth/server";

export default async function MinePage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?returUrl=" + encodeURIComponent("/mine"));
  }

  return (
    <div className="pw-app">
      <Suspense
        fallback={
          <div
            className="pw-app"
            style={{
              minHeight: "100dvh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "DM Sans, system-ui, sans-serif",
              color: "#2C3E35",
            }}
          >
            Laster …
          </div>
        }
      >
        <Mine />
      </Suspense>
    </div>
  );
}
