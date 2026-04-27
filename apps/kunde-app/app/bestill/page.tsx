import { redirect } from "next/navigation";

import { Bestill } from "@/components/screens/Bestill/Bestill";
import { getServerSession } from "@/lib/auth/server";

export default async function BestillPage({
  searchParams,
}: {
  searchParams: Promise<{ tjeneste?: string }>;
}) {
  const session = await getServerSession();
  if (!session) {
    const params = await searchParams;
    const tjeneste = params.tjeneste;
    const ret = tjeneste
      ? `/bestill?${new URLSearchParams({ tjeneste }).toString()}`
      : "/bestill";
    redirect("/login?returUrl=" + encodeURIComponent(ret));
  }

  const params = await searchParams;

  return (
    <div className="pw-app">
      <Bestill preselectTjeneste={params.tjeneste} />
    </div>
  );
}
