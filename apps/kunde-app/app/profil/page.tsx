import { redirect } from "next/navigation";

import { KundeProfil } from "@/components/screens/KundeProfil/KundeProfil";
import { getServerSession } from "@/lib/auth/server";

export default async function ProfilPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?returUrl=" + encodeURIComponent("/profil"));
  }

  return (
    <div className="pw-app">
      <KundeProfil />
    </div>
  );
}
