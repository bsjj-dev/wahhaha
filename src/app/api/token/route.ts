import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { roomName, participantName } = await req.json();

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json({
      mode: "local",
      message: "LiveKit not configured. Running in local demo mode.",
    });
  }

  // If you install livekit-server-sdk, this route will generate real tokens.
  // For now, return local mode.
  return NextResponse.json({
    mode: "local",
    message: "LiveKit token generation requires livekit-server-sdk. Running in local demo mode.",
  });
}
