import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-svh" style={{ backgroundColor: "#f0ede8" }}>

      {/* Nav */}
      <header className="w-full px-10 py-3 flex items-center justify-between">
        <span className="text-2xl font-semibold tracking-tight">Accentr</span>
        <Button asChild className="rounded-full px-5 text-1xl"size="lg"  >
          <Link href="/auth/signup">Get started</Link>
        </Button>
      </header>

      {/* Hero */}
      <section className="flex-1 w-full px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">
        {/* Left: headline + CTA */}
        <div className="flex flex-col gap-8 max-w-xl z-10">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.05]">
            Speak like a native with your AI accent coach
          </h1>
          <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
            A live voice conversation with an AI tutor that listens, spots your pronunciation errors, and coaches you in real time.
          </p>
          <div className="flex gap-3">
            <Button size="lg" className="rounded-full px-6" asChild>
              <Link href="/auth/signup">Get started</Link>
            </Button>
          </div>
        </div>

        {/* Right: abstract visual */}
        <div className="relative w-full md:w-[480px] h-[320px] md:h-[420px] flex-shrink-0 flex items-end justify-center">
          {/* Large oval */}
          <div
            className="absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full"
            style={{ backgroundColor: "#e2ddd6" }}
          />
          {/* Small accent orbs */}
          <div
            className="absolute top-8 right-16 w-8 h-8 rounded-full"
            style={{ backgroundColor: "#7c6ff7" }}
          />
          <div
            className="absolute bottom-24 right-4 w-5 h-5 rounded-full"
            style={{ backgroundColor: "#f4814a" }}
          />
          <div
            className="absolute top-20 right-48 w-4 h-4 rounded-full"
            style={{ backgroundColor: "#4aaff4" }}
          />
        </div>
      </section>
      {/* Footer */}
      <footer className="w-full px-10 py-6 flex items-center justify-between text-xs text-muted-foreground" style={{ backgroundColor: "#f0ede8" }}>
        <span>Accentr</span>
        <span>© {new Date().getFullYear()} All rights reserved.</span>
      </footer>
    </div>
  );
}
