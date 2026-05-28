import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

async function getUserId() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const languages = await prisma.language.findMany({
    where: { userId },
    orderBy: { addedAt: "asc" },
  });

  return NextResponse.json(languages);
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code, name } = await request.json() as { code: string; name: string };
  if (!code || !name) return NextResponse.json({ error: "code and name required" }, { status: 400 });

  await prisma.userProfile.upsert({
    where: { id: userId },
    create: { id: userId },
    update: {},
  });

  const language = await prisma.language.upsert({
    where: { userId_code: { userId, code } },
    create: { userId, code, name },
    update: {},
  });

  return NextResponse.json(language, { status: 201 });
}
