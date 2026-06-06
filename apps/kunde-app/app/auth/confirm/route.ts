import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_OTP_TYPES = new Set<EmailOtpType>([
  "signup",
  "email",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
]);

function safeNextPath(next: string | null): string {
  const path = next?.trim() || "/onboarding/push";
  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/onboarding/push";
  }
  return path;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const rawType = searchParams.get("type");
  const next = safeNextPath(searchParams.get("next"));

  if (!tokenHash || !rawType || !ALLOWED_OTP_TYPES.has(rawType as EmailOtpType)) {
    return NextResponse.redirect(`${origin}/login?confirm=feilet`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: rawType as EmailOtpType,
  });

  if (error) {
    console.error("[auth/confirm] verifyOtp failed:", error.message);
    return NextResponse.redirect(`${origin}/login?confirm=feilet`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
