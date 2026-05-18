import type { Feedback, PhonemeError } from "@/types";

// Parses the JSON block Claude returns inside its analysis response.
// Expected shape: { score: number, overallTip: string, phonemeErrors: PhonemeError[] }
export function parseFeedback(raw: string): Feedback {
  const match = raw.match(/```json\s*([\s\S]*?)\s*```/) ?? raw.match(/(\{[\s\S]*\})/);
  if (!match) throw new Error("No JSON block found in Claude response");

  const parsed = JSON.parse(match[1]) as Feedback;
  return parsed;
}

// Returns the most frequent phoneme errors across all turns, sorted by count.
export function topPhonemeErrors(
  errors: PhonemeError[][],
  limit = 5
): (PhonemeError & { count: number })[] {
  const counts = new Map<string, { error: PhonemeError; count: number }>();

  for (const turnErrors of errors) {
    for (const err of turnErrors) {
      const key = `${err.phoneme}:${err.expected}:${err.actual}`;
      const existing = counts.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(key, { error: err, count: 1 });
      }
    }
  }

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(({ error, count }) => ({ ...error, count }));
}
