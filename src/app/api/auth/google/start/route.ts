import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { success: false, error: "GOOGLE_CLIENT_ID not configured" },
      { status: 500 }
    );
  }
  const url = new URL(req.url);
  const next = url.searchParams.get("next") ?? "/";
  const origin = url.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;
  const state = crypto.randomBytes(16).toString("hex") + "|" + encodeURIComponent(next);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
    access_type: "online",
  });

  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
  res.cookies.set("g_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
