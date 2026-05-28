import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import LanguageCard from "@/components/LanguageCard";
import AddLanguageModal from "@/components/AddLanguageModal";
import type { Language, Session } from "@/types";

async function getData() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  await prisma.userProfile.upsert({
    where: { id: user.id },
    create: { id: user.id },
    update: {},
  });

  const [languages, profile, recentSessions] = await Promise.all([
    prisma.language.findMany({ where: { userId: user.id }, orderBy: { addedAt: "asc" } }),
    prisma.userProfile.findUnique({ where: { id: user.id } }),
    prisma.session.findMany({
      where: { userId: user.id, completedAt: { not: null } },
      orderBy: { completedAt: "desc" },
      take: 6,
      include: { language: true },
    }),
  ]);

  const lastSessionByLang: Record<string, Session> = {};
  for (const s of recentSessions) {
    if (!lastSessionByLang[s.languageId]) {
      lastSessionByLang[s.languageId] = s as unknown as Session;
    }
  }

  return { user, languages, profile, recentSessions, lastSessionByLang };
}

export default async function DashboardPage() {
  const { languages, profile, recentSessions, lastSessionByLang } = await getData();

  return (
    <div className="min-h-svh flex flex-col" style={{ backgroundColor: "#f0ede8" }}>
      {/* Nav */}
      <header className="w-full px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-semibold tracking-tight">Accentr</Link>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {profile && (
            <>
              <span>{profile.totalXp} XP</span>
              <span>🔥 {profile.streak}</span>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 px-8 py-6 max-w-4xl mx-auto w-full">
        {/* Languages */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your languages</h2>
            <AddLanguageButton />
          </div>

          {languages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
              Add a language to start practicing.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {languages.map((lang) => (
                <LanguageCard
                  key={lang.id}
                  language={lang as unknown as Language}
                  lastSession={lastSessionByLang[lang.id] ?? null}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent sessions */}
        {recentSessions.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Recent sessions</h2>
            <div className="space-y-2">
              {recentSessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm"
                >
                  <div>
                    <span className="font-medium">{(s as any).language?.name}</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      {s.completedAt
                        ? new Date(s.completedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                  {s.overallScore != null && (
                    <span className="font-semibold" style={{ color: "#7c6ff7" }}>
                      {s.overallScore.toFixed(1)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

import AddLanguageButton from "./ClientRefresh";
