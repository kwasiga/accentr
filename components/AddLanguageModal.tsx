"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const SUPPORTED_LANGUAGES = [
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "zh", name: "Mandarin Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "hi", name: "Hindi" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "sv", name: "Swedish" },
  { code: "tr", name: "Turkish" },
];

type Props = {
  onAdded: () => void;
};

export default function AddLanguageModal({ onAdded }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  async function addLanguage(code: string, name: string) {
    setLoading(code);
    await fetch("/languages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, name }),
    });
    setLoading(null);
    setOpen(false);
    onAdded();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="rounded-full px-5" size="lg">
        + Add Language
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
          <div
            className="bg-card rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Add a language</h2>
            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {SUPPORTED_LANGUAGES.map(({ code, name }) => (
                <button
                  key={code}
                  onClick={() => addLanguage(code, name)}
                  disabled={!!loading}
                  className="text-left px-3 py-2 rounded-xl border border-border hover:bg-muted transition-colors text-sm disabled:opacity-50"
                >
                  {loading === code ? "Adding…" : name}
                </button>
              ))}
            </div>
            <Button variant="ghost" className="mt-4 w-full" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
