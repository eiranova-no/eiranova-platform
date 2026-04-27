import { Hjem } from "@/components/screens/Hjem/Hjem";
import { Landing } from "@/components/screens/Landing/Landing";
import { getServerSession } from "@/lib/auth/server";

export default async function HomePage() {
  const session = await getServerSession();
  if (!session) {
    return (
      <div className="pw pw-app">
        <Landing />
      </div>
    );
  }
  return (
    <div className="pw pw-app">
      <Hjem />
    </div>
  );
}
