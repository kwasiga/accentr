import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import PracticeClient from "./PracticeClient";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function PracticePage({ params }: Props) {
  const { lang } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin");

  const language = await prisma.language.findUnique({
    where: { userId_code: { userId: user.id, code: lang } },
  });

  if (!language) notFound();

  return (
    <PracticeClient
      languageId={language.id}
      languageCode={language.code}
      languageName={language.name}
    />
  );
}
