import { redirect } from "next/navigation";

import { OppdragIGang } from "@/components/screens/OppdragIGang/OppdragIGang";
import { getServerSession } from "@/lib/auth/server";

export default async function OppdragIGangPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?returUrl=" + encodeURIComponent("/oppdrag-i-gang"));
  }

  return (
    <div className="pw-app">
      <OppdragIGang />
    </div>
  );
}
