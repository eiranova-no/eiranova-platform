import { redirect } from "next/navigation";

import { ChatKunde } from "@/components/screens/ChatKunde/ChatKunde";
import { getServerSession } from "@/lib/auth/server";

export default async function ChatKundePage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?returUrl=" + encodeURIComponent("/chat"));
  }

  return (
    <div className="pw-app">
      <ChatKunde />
    </div>
  );
}
