import Link from "next/link";
import type { Language, Session } from "@/types";

type Props = {
  language: Language;
  lastSession?: Session | null;
};

export default function LanguageCard({ language, lastSession }: Props) {
  const score = lastSession?.overallScore;
  const date = lastSession?.completedAt
    ? new Date(lastSession.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  return (
    <Link
      href={`/practice/${language.code}`}
      className="block rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-lg font-semibold leading-tight">{language.name}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">{language.code}</p>
        </div>
        {score != null && (
          <span
            className="text-sm font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#7c6ff720", color: "#7c6ff7" }}
          >
            {score.toFixed(1)}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{date ? `Last session: ${date}` : "No sessions yet"}</span>
        <span className="text-primary font-medium">Practice →</span>
      </div>
    </Link>
  );
}
