import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import BenefitsSection from "@/components/BenefitsSection"
import Logo from "@/components/Logo"
import SiteFooter from "@/components/SiteFooter"
import { ButtonLink } from "@/components/game/ui"
import GamePreview from "@/components/home/GamePreview"
import BestScore from "@/components/home/BestScore"
import { games } from "@/libs/games"

export default function Page() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="#games"
              className="focus-ring hidden rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-ink sm:block"
            >
              Games
            </Link>
            <Link
              href="/progress"
              className="focus-ring hidden rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-ink sm:block"
            >
              Your progress
            </Link>
            <Link
              href="#benefits"
              className="focus-ring hidden rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-ink sm:block"
            >
              Why it works
            </Link>
            <ButtonLink href="/sequence" size="md">
              Play now
            </ButtonLink>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div className="animate-fade-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-good" aria-hidden />
              {games.length} free games · no sign-up
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Train your memory,
              <br />
              <span className="text-brand-ink">one round at a time.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Quick games that test how much you can hold in your head: digits,
              patterns, sequences and words. Play for two minutes and beat your
              personal best.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#games">
                Browse games
                <ArrowRight size={18} aria-hidden />
              </ButtonLink>
              <ButtonLink href="/sequence" variant="secondary">
                Try Sequence Memory
              </ButtonLink>
            </div>
          </div>

          <div aria-hidden className="hidden grid-cols-2 gap-4 lg:grid">
            {["sequence", "card-match", "number", "word-recall"].map((id, i) => (
              <div
                key={id}
                className={`animate-fade-up overflow-hidden rounded-2xl border border-line bg-surface shadow-sm ${
                  i % 2 === 1 ? "mt-8" : "mb-8"
                }`}
                style={{ animationDelay: `${120 + i * 80}ms` }}
              >
                <GamePreview id={id} />
              </div>
            ))}
          </div>
        </section>

        <section id="games" className="scroll-mt-20 border-t border-line bg-surface/50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-10 max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight">Pick a game</h2>
              <p className="mt-3 text-muted">
                Each one trains a different kind of memory. Your results are
                saved on this device, so you can{" "}
                <Link href="/progress" className="font-medium text-brand-ink hover:underline">
                  track your progress
                </Link>
                .
              </p>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {games.map((game) => (
                <li key={game.id}>
                  <Link
                    href={game.href}
                    className="focus-ring group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
                  >
                    <GamePreview id={game.id} />
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{game.title}</h3>
                        {game.isNew && (
                          <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-ink">
                            New
                          </span>
                        )}
                      </div>
                      <p className="flex-1 text-sm text-muted">{game.description}</p>
                      <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
                        <BestScore gameId={game.id} />
                        <span className="inline-flex items-center gap-1 font-medium text-brand-ink">
                          Play
                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-0.5"
                            aria-hidden
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <BenefitsSection />
      </main>

      <SiteFooter />
    </div>
  )
}
