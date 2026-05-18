# Accentr

A real-time AI pronunciation coach. Users have a live voice conversation with an AI that listens, identifies accent errors, and gives targeted feedback — like a 1-on-1 session with a language tutor.

## How it works

1. User picks a language and starts a session
2. They speak naturally into the mic
3. ElevenLabs transcribes speech in real-time
4. Claude analyzes pronunciation, identifies phoneme errors, and generates coaching feedback
5. ElevenLabs speaks the feedback back to the user
6. The conversation continues until the session ends
7. A summary of errors, score, and progress is saved to the database

## Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui (New York, Mira palette)
- **Auth**: Supabase Auth (email/password, session management)
- **Database**: PostgreSQL (Supabase + Prisma)
- **AI**: Anthropic Claude API — pronunciation analysis and coaching
- **Voice**: ElevenLabs Conversational AI — real-time STT + TTS
- **Language**: TypeScript

## Folder Structure

```
app/
  page.tsx                    # Landing page
  auth/
    signin/page.tsx           # Sign in
    signup/page.tsx           # Sign up
  dashboard/page.tsx          # User dashboard — language cards + history
  practice/[lang]/page.tsx    # Live conversation session
  api/
    auth/[...nextauth]/       # Auth handler
    analyze/                  # POST: Claude pronunciation analysis
    languages/                # GET + POST: user languages
    sessions/                 # POST: save completed session
components/
  LanguageCard.tsx            # Language + last session stats, links to practice
  AddLanguageModal.tsx        # Add a new language to practice
  ConversationView.tsx        # Live voice UI — mic, waveform, transcript, AI replies
  SessionSummary.tsx          # Post-session score, errors, tips
lib/
  elevenlabs.ts               # ElevenLabs Conversational AI client
  anthropic.ts                # Anthropic client
  phonemes.ts                 # Phoneme parsing utilities
  auth.ts                     # JWT session helpers
  prisma.ts                   # Prisma client singleton
prisma/
  schema.prisma               # Database schema
types/
  index.ts                    # Shared TypeScript types
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Supabase anon/public key
DATABASE_URL=                   # Supabase pooled connection (for Prisma)
DIRECT_URL=                     # Supabase direct connection (for migrations)
ANTHROPIC_API_KEY=              # Claude API key
ELEVENLABS_API_KEY=             # ElevenLabs API key
```

## Getting Started

1. Copy `.env.local.example` to `.env.local` and fill in your keys
2. Run `npx prisma migrate dev` to apply the schema
3. Run `npm run dev` to start the dev server
