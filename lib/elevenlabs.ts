// ElevenLabs Conversational AI is used via the @elevenlabs/react hooks in components.
// This file exports config helpers consumed by ConversationProvider.

export const ELEVENLABS_AGENT_CONFIG = {
  // Server-side: used in /api/analyze to build the system prompt
  systemPrompt: `You are Accentr, an linguistic pronunciation coach.
The user is practicing spoken language. After each thing they say,
analyze their pronunciation, identify specific phoneme errors,
give a score from 0-10, and provide a concise, encouraging tip to improve.
Keep responses short and conversational — this is a live voice session.`,
};

// Returns the signed URL or public agent ID for starting a session.
// Called server-side so the API key is never exposed to the browser.
export async function getElevenLabsSessionToken(agentId: string): Promise<string> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agentId}`,
    {
      headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY! },
    }
  );

  if (!res.ok) {
    throw new Error(`ElevenLabs token request failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data.token as string;
}
