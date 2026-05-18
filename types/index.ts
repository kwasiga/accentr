export type User = {
  id: string;
  email: string;
  profile: UserProfile | null;
};

export type UserProfile = {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  totalXp: number;
  streak: number;
  lastSeenAt: Date;
};

export type Language = {
  id: string;
  userId: string;
  code: string;
  name: string;
  addedAt: Date;
};

export type Session = {
  id: string;
  userId: string;
  languageId: string;
  language?: Language;
  turns?: Turn[];
  overallScore: number | null;
  durationSecs: number | null;
  completedAt: Date | null;
  createdAt: Date;
};

export type Turn = {
  id: string;
  sessionId: string;
  transcript: string;
  feedback: string;
  phonemeErrors: PhonemeError[] | null;
  score: number | null;
  createdAt: Date;
};

export type PhonemeError = {
  phoneme: string;
  expected: string;
  actual: string;
  word: string;
  tip: string;
};

export type Feedback = {
  score: number;
  overallTip: string;
  phonemeErrors: PhonemeError[];
};

export type Achievement = {
  id: string;
  userId: string;
  slug: AchievementSlug;
  unlockedAt: Date;
};

export type AchievementSlug =
  | "first_session"
  | "perfect_score"
  | "7_day_streak"
  | "10_sessions"
  | "50_sessions";
