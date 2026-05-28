import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { AchievementSlug, PhonemeError } from "@/types";

type TurnInput = {
  transcript: string;
  feedback: string;
  phonemeErrors: PhonemeError[];
  score: number;
};

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { languageId, turns, durationSecs } = await request.json() as {
    languageId: string;
    turns: TurnInput[];
    durationSecs: number;
  };

  const scores = turns.map((t) => t.score).filter((s) => typeof s === "number");
  const overallScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
  const xpEarned = overallScore != null ? Math.round(overallScore * 10) : 0;

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      languageId,
      overallScore,
      durationSecs,
      completedAt: new Date(),
      turns: {
        create: turns.map((t) => ({
          transcript: t.transcript,
          feedback: t.feedback,
          phonemeErrors: t.phonemeErrors as object[],
          score: t.score,
        })),
      },
    },
  });

  const profile = await prisma.userProfile.upsert({
    where: { id: user.id },
    create: { id: user.id, totalXp: xpEarned, streak: 1, lastSeenAt: new Date() },
    update: {},
  });

  const now = new Date();
  const lastSeen = new Date(profile.lastSeenAt);
  const daysSinceLastSeen = Math.floor((now.getTime() - lastSeen.getTime()) / 86_400_000);
  const newStreak = daysSinceLastSeen <= 1 ? profile.streak + 1 : 1;

  await prisma.userProfile.update({
    where: { id: user.id },
    data: {
      totalXp: { increment: xpEarned },
      streak: newStreak,
      lastSeenAt: now,
    },
  });

  const totalSessions = await prisma.session.count({ where: { userId: user.id } });

  const achievementsToCheck: Array<{ slug: AchievementSlug; condition: boolean }> = [
    { slug: "first_session", condition: totalSessions === 1 },
    { slug: "perfect_score", condition: overallScore != null && overallScore >= 9.5 },
    { slug: "7_day_streak", condition: newStreak >= 7 },
    { slug: "10_sessions", condition: totalSessions >= 10 },
    { slug: "50_sessions", condition: totalSessions >= 50 },
  ];

  const newAchievements: AchievementSlug[] = [];
  for (const { slug, condition } of achievementsToCheck) {
    if (!condition) continue;
    try {
      await prisma.achievement.create({ data: { userId: user.id, slug } });
      newAchievements.push(slug);
    } catch {
      // already unlocked (unique constraint)
    }
  }

  return NextResponse.json({ session, xpEarned, newAchievements });
}
