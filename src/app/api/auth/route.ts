import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { passphrase } = await req.json();
  const secret = process.env.AUTH_PASSPHRASE;

  if (!secret) {
    // No passphrase configured — allow everyone (dev mode)
    const res = NextResponse.json({ ok: true });
    res.cookies.set("wahhaha-auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90, // 90 days
    });
    return res;
  }

  if (passphrase === secret) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("wahhaha-auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90, // 90 days
    });
    return res;
  }

  return NextResponse.json({ ok: false, error: "Wrong passphrase" }, { status: 401 });
}
