"use client";

import { useState, useCallback, useRef } from "react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import RecordButton from "@/components/RecordButton";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import SessionChat from "@/components/SessionChat";
import FeedbackPanel from "@/components/FeedbackPanel";
import SessionSummary from "@/components/SessionSummary";
import Link from "next/link";
import type { Feedback } from "@/types";
import type { MessagePayload } from "@elevenlabs/types";

type Message = { id: string; role: "user" | "agent"; text: string };
type TurnRecord = { transcript: string; feedback: Feedback };

type Props = {
  languageId: string;
  languageCode: string;
  languageName: string;
};

export default function PracticeClient(props: Props) {
  return (
    <ConversationProvider>
      <PracticeInner {...props} />
    </ConversationProvider>
  );
}

function PracticeInner({ languageId, languageCode, languageName }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [latestFeedback, setLatestFeedback] = useState<Feedback | null>(null);
  const [analyzingFeedback, setAnalyzingFeedback] = useState(false);
  const [sessionResult, setSessionResult] = useState<{ xpEarned: number; newAchievements: string[] } | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const turnsRef = useRef<TurnRecord[]>([]);
  const sessionStartRef = useRef<number>(0);

  const handleMessage = useCallback(
    async (payload: MessagePayload) => {
      const id = `${payload.role}-${Date.now()}`;
      setMessages((prev) => [...prev, { id, role: payload.role as "user" | "agent", text: payload.message }]);

      if (payload.role === "user" && payload.message.trim()) {
        setAnalyzingFeedback(true);
        try {
          const res = await fetch("/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transcript: payload.message, language: languageName }),
          });
          if (res.ok) {
            const feedback: Feedback = await res.json();
            setLatestFeedback(feedback);
            turnsRef.current.push({ transcript: payload.message, feedback });
          }
        } finally {
          setAnalyzingFeedback(false);
        }
      }
    },
    [languageName]
  );

  const conversation = useConversation({
    onMessage: handleMessage,
    onDisconnect: async () => {
      const durationSecs = Math.round((Date.now() - sessionStartRef.current) / 1000);
      const turns = turnsRef.current;
      if (turns.length === 0) return;

      const res = await fetch("/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageId,
          turns: turns.map((t) => ({
            transcript: t.transcript,
            feedback: t.feedback.overallTip,
            phonemeErrors: t.feedback.phonemeErrors,
            score: t.feedback.score,
          })),
          durationSecs,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSessionResult({ xpEarned: data.xpEarned, newAchievements: data.newAchievements });
        setShowSummary(true);
      }
    },
  });

  async function handleStart() {
    const tokenRes = await fetch("/stt");
    if (!tokenRes.ok) {
      alert("Could not start session. Please ensure ELEVENLABS_AGENT_ID is configured.");
      return;
    }
    const { token } = await tokenRes.json();
    sessionStartRef.current = Date.now();
    turnsRef.current = [];
    setMessages([]);
    setLatestFeedback(null);
    conversation.startSession({ signedUrl: token });
  }

  function handleStop() {
    conversation.endSession();
  }

  const getFrequencyData = useCallback(() => {
    return conversation.getInputByteFrequencyData?.() ?? new Uint8Array(0);
  }, [conversation]);

  const isActive = conversation.status === "connected";
  const status = conversation.status as "idle" | "connecting" | "connected" | "disconnecting";

  if (showSummary && sessionResult) {
    return (
      <div className="min-h-svh flex flex-col" style={{ backgroundColor: "#f0ede8" }}>
        <header className="w-full px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-xl font-semibold tracking-tight">Accentr</Link>
        </header>
        <div className="flex-1 flex items-start justify-center overflow-y-auto">
          <SessionSummary
            languageName={languageName}
            languageCode={languageCode}
            turns={turnsRef.current}
            xpEarned={sessionResult.xpEarned}
            newAchievements={sessionResult.newAchievements}
            onClose={() => {
              setShowSummary(false);
              setSessionResult(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh flex flex-col" style={{ backgroundColor: "#f0ede8" }}>
      {/* Nav */}
      <header className="w-full px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-semibold tracking-tight">Accentr</Link>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{languageName}</span>
          {isActive && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: "#22c55e20", color: "#22c55e" }}
            >
              Live
            </span>
          )}
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden max-w-5xl mx-auto w-full px-4 pb-4">
        {/* Left: chat */}
        <div className="flex-1 flex flex-col min-h-0 lg:pr-4 gap-4">
          <SessionChat messages={messages} />

          {/* Controls */}
          <div className="flex flex-col items-center gap-4 py-4">
            <WaveformVisualizer getFrequencyData={getFrequencyData} isActive={isActive} />
            <RecordButton status={status} onStart={handleStart} onStop={handleStop} />
            <p className="text-xs text-muted-foreground">
              {status === "idle" && "Tap to start your session"}
              {status === "connecting" && "Connecting…"}
              {status === "connected" && "Speak naturally — tap to end"}
              {status === "disconnecting" && "Saving session…"}
            </p>
          </div>
        </div>

        {/* Right: feedback */}
        <div className="lg:w-80 flex-shrink-0 lg:pt-0 pt-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
            Pronunciation feedback
          </p>
          <FeedbackPanel feedback={latestFeedback} loading={analyzingFeedback} />
        </div>
      </main>
    </div>
  );
}
