"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { topPhonemeErrors } from "@/lib/phonemes";
import type { Feedback } from "@/types";

type TurnRecord = {
  transcript: string;
  feedback: Feedback;
};

type Props = {
  languageName: string;
  languageCode: string;
  turns: TurnRecord[];
  xpEarned: number;
  newAchievements: string[];
  onClose: () => void;
};

const ACHIEVEMENT_LABELS: Record<string, string> = {
  first_session: "First Session",
  perfect_score: "Perfect Score",
  "7_day_streak": "7-Day Streak",
  "10_sessions": "10 Sessions",
  "50_sessions": "50 Sessions",
};

export default function SessionSummary({ languageName, languageCode, turns, xpEarned, newAchievements, onClose }: Props) {
  const scores = turns.map((t) => t.feedback.score);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  const allErrors = turns.map((t) => t.feedback.phonemeErrors);
  const topErrors = topPhonemeErrors(allErrors, 3);

  const scoreColor = avgScore >= 8 ? "#22c55e" : avgScore >= 5 ? "#f4814a" : "#ef4444";

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto w-full py-8 px-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-1">Session complete — {languageName}</p>
        <div className="text-6xl font-bold" style={{ color: scoreColor }}>
          {avgScore.toFixed(1)}
        </div>
        <p className="text-muted-foreground text-sm mt-1">overall score</p>
      </div>

      <div className="flex items-center justify-center gap-6 text-center">
        <div>
          <p className="text-2xl font-semibold">+{xpEarned}</p>
          <p className="text-xs text-muted-foreground">XP earned</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{turns.length}</p>
          <p className="text-xs text-muted-foreground">turns</p>
        </div>
      </div>

      {newAchievements.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold mb-2">Achievements unlocked 🎉</p>
          <div className="flex flex-wrap gap-2">
            {newAchievements.map((slug) => (
              <span
                key={slug}
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ backgroundColor: "#7c6ff720", color: "#7c6ff7" }}
              >
                {ACHIEVEMENT_LABELS[slug] ?? slug}
              </span>
            ))}
          </div>
        </div>
      )}

      {topErrors.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <p className="text-sm font-semibold">Top pronunciation errors</p>
          {topErrors.map((err, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="font-mono text-xs px-1.5 py-0.5 bg-muted rounded border border-border mt-0.5">
                /{err.phoneme}/
              </span>
              <div>
                <span className="font-medium">{err.word}</span>
                <span className="text-muted-foreground ml-1 text-xs">×{err.count}</span>
                <p className="text-muted-foreground text-xs">{err.tip}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Button className="flex-1 rounded-full" asChild>
          <Link href={`/practice/${languageCode}`} onClick={onClose}>
            Practice again
          </Link>
        </Button>
        <Button variant="outline" className="flex-1 rounded-full" asChild>
          <Link href="/dashboard" onClick={onClose}>
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
