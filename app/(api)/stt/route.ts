import { NextResponse } from "next/server";
import { getElevenLabsSessionToken } from "@/lib/elevenlabs";

export async function GET() {
  const agentId = process.env.ELEVENLABS_AGENT_ID;
  if (!agentId) {
    return NextResponse.json({ error: "ELEVENLABS_AGENT_ID not configured" }, { status: 503 });
  }

  try {
    const token = await getElevenLabsSessionToken(agentId);
    return NextResponse.json({ token });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
