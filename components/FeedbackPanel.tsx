"use client";

import type { Feedback } from "@/types";

type Props = {
  feedback: Feedback | null;
  loading: boolean;
};

export default function FeedbackPanel({ feedback, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-muted/50 p-4 animate-pulse">
        <div className="h-3 bg-muted rounded w-3/4 mb-2" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground text-center">
        Pronunciation feedback will appear here after you speak.
      </div>
    );
  }

  const scoreColor =
    feedback.score >= 8 ? "#22c55e" : feedback.score >= 5 ? "#f4814a" : "#ef4444";

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <span
          className="text-2xl font-bold"
          style={{ color: scoreColor }}
        >
          {feedback.score.toFixed(1)}
        </span>
        <span className="text-xs text-muted-foreground">/10</span>
        <span className="flex-1 text-sm">{feedback.overallTip}</span>
      </div>

      {feedback.phonemeErrors.length > 0 && (
        <div className="space-y-2">
          {feedback.phonemeErrors.map((err, i) => (
            <div key={i} className="rounded-xl bg-muted/60 p-3 text-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs px-1.5 py-0.5 bg-background rounded border border-border">
                  /{err.phoneme}/
                </span>
                <span className="font-medium">{err.word}</span>
              </div>
              <p className="text-muted-foreground text-xs">{err.tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
