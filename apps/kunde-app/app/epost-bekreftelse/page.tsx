import { EpostBekreftelse } from "@/components/screens/EpostBekreftelse/EpostBekreftelse";

type PageProps = {
  searchParams: Promise<{ epost?: string | string[] }>;
};

function normalizeEpost(v: string | string[] | undefined): string {
  if (v === undefined) return "";
  if (Array.isArray(v)) return v[0] ?? "";
  return v;
}

export default async function EpostBekreftelsePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const regEpost = normalizeEpost(sp.epost);

  return (
    <div className="pw-app">
      <EpostBekreftelse regEpost={regEpost} />
    </div>
  );
}
