"use client";

import { Button } from "@/components/ui/button";

type Props = {
  status: "idle" | "connecting" | "connected" | "disconnecting";
  onStart: () => void;
  onStop: () => void;
};

export default function RecordButton({ status, onStart, onStop }: Props) {
  const isActive = status === "connected";
  const isLoading = status === "connecting" || status === "disconnecting";

  return (
    <button
      onClick={isActive ? onStop : onStart}
      disabled={isLoading}
      aria-label={isActive ? "End session" : "Start session"}
      className="relative flex items-center justify-center w-20 h-20 rounded-full transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{
        backgroundColor: isActive ? "#ef4444" : "#7c6ff7",
        boxShadow: isActive ? "0 0 0 8px #ef444430" : "0 0 0 8px #7c6ff730",
      }}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : isActive ? (
        <span className="w-5 h-5 bg-white rounded-sm" />
      ) : (
        <MicIcon />
      )}
    </button>
  );
}

function MicIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}
