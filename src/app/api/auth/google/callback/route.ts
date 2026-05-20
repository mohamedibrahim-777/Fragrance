import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = cookies().get("g_oauth_state")?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(`${url.origin}/login?error=oauth_state`);
  }
  cookies().delete("g_oauth_state");

  const next = decodeURIComponent(state.split("|")[1] ?? "/");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${url.origin}/login?error=oauth_config`);
  }
  const redirectUri = `${url.origin}/api/auth/google/callback`;

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.redirect(`${url.origin}/login?error=oauth_token`);
  }
  const tokens = (await tokenRes.json()) as { access_token?: string };
  if (!tokens.access_token) {
    return NextResponse.redirect(`${url.origin}/login?error=oauth_token`);
  }

  // Fetch user profile
  const profRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!profRes.ok) {
    return NextResponse.redirect(`${url.origin}/login?error=oauth_profile`);
  }
  const prof = (await profRes.json()) as {
    sub: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
  };
  if (!prof.email || prof.email_verified === false) {
    return NextResponse.redirect(`${url.origin}/login?error=oauth_email`);
  }

  // Upsert user
  const randomPassword = crypto.randomBytes(24).toString("hex");
  const hash = await bcrypt.hash(randomPassword, 12);
  const user = await prisma.user.upsert({
    where: { email: prof.email },
    update: { name: prof.name || undefined },
    create: {
      email: prof.email,
      name: prof.name || prof.email.split("@")[0],
      passwordHash: hash,
      role: "Customer",
    },
  });

  // Issue our JWT cookie
  const token = signToken(user.id);
  setAuthCookie(token);

  return NextResponse.redirect(`${url.origin}${next.startsWith("/") ? next : "/"}`);
}
