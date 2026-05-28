"use client";

import { useRouter } from "next/navigation";
import AddLanguageModal from "@/components/AddLanguageModal";

export default function AddLanguageButton() {
  const router = useRouter();
  return <AddLanguageModal onAdded={() => router.refresh()} />;
}
