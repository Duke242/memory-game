import React from "react"
import Link from "next/link"
import { ArrowLeft, Trophy } from "lucide-react"
import { formatScore, getGame } from "@/libs/games"
import Logo from "@/components/Logo"

const GameShell = ({
  gameId,
  best,
  bestMode,
  bestTotal,
  children,
}: {
  gameId: string
  /** Personal best for the current mode, or null if none yet. */
  best: number | null
  bestMode?: string
  bestTotal?: number
  children: React.ReactNode
}) => {
  const game = getGame(gameId)
  const Icon = game.icon

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Logo />
          <Link
            href="/#games"
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-muted hover:text-ink"
          >
            <ArrowLeft size={16} aria-hidden />
            All games
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8 sm:py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
              <Icon size={20} aria-hidden />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-tight">
                {game.title}
              </h1>
              <p className="text-sm text-muted">{game.skill} memory</p>
            </div>
          </div>
          <div
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm"
            title={bestMode ? `Personal best (${bestMode})` : "Personal best"}
          >
            <Trophy size={14} className="text-brand-ink" aria-hidden />
            <span className="text-muted">Best</span>
            <span className="font-semibold tabular-nums">
              {best === null ? "—" : formatScore(game.format, best, bestTotal)}
            </span>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}

export default GameShell
