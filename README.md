# Accentr

An AI-powered language accent training app.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js
- **Database**: PostgreSQL (via Prisma)
- **AI**: Anthropic Claude API
- **TTS/STT**: ElevenLabs API
- **Language**: TypeScript

## Folder Structure

```
app/
  page.tsx              # Landing page
  auth/
    signin/page.tsx     # Sign in page
    signup/page.tsx     # Sign up page
  dashboard/page.tsx    # User dashboard
  practice/[lang]/page.tsx  # Practice session for a language
  api/
    auth/[...nextauth]/ # NextAuth handler
    phrases/            # Phrases CRUD
    tts/                # Text-to-speech
    stt/                # Speech-to-text
    analyze/            # Pronunciation analysis
    languages/          # User languages CRUD
components/
  LanguageCard.tsx
  AddLanguageModal.tsx
  PhraseCard.tsx
  RecordButton.tsx
  FeedbackPanel.tsx
  WaveformVisualizer.tsx
  SessionChat.tsx
lib/
  elevenlabs.ts         # ElevenLabs client
  anthropic.ts          # Anthropic client
  phonemes.ts           # Phoneme utilities
  auth.ts               # Auth config
  prisma.ts             # Prisma client singleton
prisma/
  schema.prisma         # Database schema
types/
  index.ts              # Shared TypeScript types
```

## Getting Started

1. Copy `.env.local.example` to `.env.local` and fill in your API keys
2. Run `npx prisma migrate dev` to set up the database
3. Run `npm run dev` to start the development server
