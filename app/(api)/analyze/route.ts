import { NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { parseFeedback } from "@/lib/phonemes";

export async function POST(request: Request) {
  const { transcript, language } = await request.json() as { transcript: string; language: string };

  if (!transcript || !language) {
    return NextResponse.json({ error: "transcript and language required" }, { status: 400 });
  }

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: `You are a pronunciation analysis expert. Analyze spoken ${language} transcripts and identify likely pronunciation errors based on common learner mistakes. Return ONLY a JSON code block with this exact shape:

\`\`\`json
{
  "score": <integer 0-10>,
  "overallTip": "<one sentence of encouraging, actionable coaching>",
  "phonemeErrors": [
    {
      "phoneme": "<IPA symbol>",
      "expected": "<correct sound>",
      "actual": "<likely mispronounced sound>",
      "word": "<the word>",
      "tip": "<how to fix it>"
    }
  ]
}
\`\`\`

If the transcript looks fluent and natural, give a high score and an empty phonemeErrors array. Keep phonemeErrors to 3 or fewer.`,
    messages: [
      {
        role: "user",
        content: `Language: ${language}\nTranscript: "${transcript}"`,
      },
    ],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const feedback = parseFeedback(raw);
    return NextResponse.json(feedback);
  } catch {
    return NextResponse.json({ error: "Failed to parse Claude response", raw }, { status: 500 });
  }
}
