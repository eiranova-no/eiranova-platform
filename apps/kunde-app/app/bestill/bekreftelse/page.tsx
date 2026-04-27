import { redirect } from "next/navigation";

import { Bekreftelse } from "@/components/screens/Bekreftelse/Bekreftelse";
import { getServerSession } from "@/lib/auth/server";

export default async function BekreftelsePage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?returUrl=" + encodeURIComponent("/bestill/bekreftelse"));
  }
  return (
    <div className="pw-app">
      <Bekreftelse />
    </div>
  );
}
