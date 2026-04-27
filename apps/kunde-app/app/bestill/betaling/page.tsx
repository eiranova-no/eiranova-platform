import { redirect } from "next/navigation";

import { Betaling } from "@/components/screens/Betaling/Betaling";
import { getServerSession } from "@/lib/auth/server";

export default async function BetalingPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?returUrl=" + encodeURIComponent("/bestill/betaling"));
  }
  return (
    <div className="pw-app">
      <Betaling />
    </div>
  );
}
