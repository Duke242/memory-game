"use client"

import React, { useEffect, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Anchor,
  Apple,
  Bell,
  Bike,
  Bird,
  Cake,
  Camera,
  Cat,
  Cloud,
  Coffee,
  Crown,
  Dog,
  Feather,
  Fish,
  Flame,
  Flower2,
  Gift,
  Heart,
  Key,
  Leaf,
  Moon,
  Music,
  Plane,
  Rabbit,
  Rocket,
  RotateCcw,
  Snowflake,
  Star,
  Sun,
  Umbrella,
  Zap,
} from "lucide-react"
import GameShell from "@/components/game/GameShell"
import {
  Button,
  Field,
  Panel,
  ResultHeader,
  SegmentedControl,
  Stat,
  cx,
} from "@/components/game/ui"
import { shuffle } from "@/libs/shuffle"
import { useBestScore } from "@/libs/useBestScore"

const SYMBOLS: { name: string; icon: LucideIcon }[] = [
  { name: "anchor", icon: Anchor },
  { name: "apple", icon: Apple },
  { name: "bell", icon: Bell },
  { name: "bike", icon: Bike },
  { name: "bird", icon: Bird },
  { name: "cake", icon: Cake },
  { name: "camera", icon: Camera },
  { name: "cat", icon: Cat },
  { name: "cloud", icon: Cloud },
  { name: "coffee", icon: Coffee },
  { name: "crown", icon: Crown },
  { name: "dog", icon: Dog },
  { name: "feather", icon: Feather },
  { name: "fish", icon: Fish },
  { name: "flame", icon: Flame },
  { name: "flower", icon: Flower2 },
  { name: "gift", icon: Gift },
  { name: "heart", icon: Heart },
  { name: "key", icon: Key },
  { name: "leaf", icon: Leaf },
  { name: "moon", icon: Moon },
  { name: "music", icon: Music },
  { name: "plane", icon: Plane },
  { name: "rabbit", icon: Rabbit },
  { name: "rocket", icon: Rocket },
  { name: "snowflake", icon: Snowflake },
  { name: "star", icon: Star },
  { name: "sun", icon: Sun },
  { name: "umbrella", icon: Umbrella },
  { name: "zap", icon: Zap },
]

type Difficulty = "easy" | "medium" | "hard"

const DIFFICULTIES: Record<
  Difficulty,
  { label: string; columns: number; pairs: number }
> = {
  easy: { label: "4×3", columns: 4, pairs: 6 },
  medium: { label: "4×4", columns: 4, pairs: 8 },
  hard: { label: "6×4", columns: 6, pairs: 12 },
}

interface Card {
  key: number
  symbol: number
  matched: boolean
}

type Phase = "setup" | "playing" | "done"

const dealCards = (pairs: number): Card[] => {
  const symbols = shuffle(SYMBOLS.map((_, i) => i)).slice(0, pairs)
  return shuffle([...symbols, ...symbols]).map((symbol, key) => ({
    key,
    symbol,
    matched: false,
  }))
}

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`

const MISMATCH_DELAY = 850

const CardMatchPage = () => {
  const [phase, setPhase] = useState<Phase>("setup")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [isNewBest, setIsNewBest] = useState(false)
  const timeout = useRef<number | null>(null)
  const { best, submit } = useBestScore(`card-match:${difficulty}`, {
    lowerIsBetter: true,
  })

  const config = DIFFICULTIES[difficulty]
  const matchedPairs = cards.filter((c) => c.matched).length / 2

  useEffect(
    () => () => {
      if (timeout.current) window.clearTimeout(timeout.current)
    },
    []
  )

  // The clock starts on the first flip and stops when the board is cleared.
  useEffect(() => {
    if (phase !== "playing" || startedAt === null) return
    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000))
    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [phase, startedAt])

  const start = () => {
    if (timeout.current) window.clearTimeout(timeout.current)
    setCards(dealCards(config.pairs))
    setFlipped([])
    setMoves(0)
    setStartedAt(null)
    setElapsed(0)
    setIsNewBest(false)
    setPhase("playing")
  }

  const flip = (index: number) => {
    if (phase !== "playing" || flipped.length === 2) return
    if (cards[index].matched || flipped.includes(index)) return

    if (startedAt === null) setStartedAt(Date.now())

    const next = [...flipped, index]
    setFlipped(next)
    if (next.length < 2) return

    const totalMoves = moves + 1
    setMoves(totalMoves)
    const [a, b] = next

    if (cards[a].symbol === cards[b].symbol) {
      const updated = cards.map((c, i) =>
        i === a || i === b ? { ...c, matched: true } : c
      )
      setCards(updated)
      setFlipped([])
      if (updated.every((c) => c.matched)) {
        setElapsed(Math.floor((Date.now() - (startedAt ?? Date.now())) / 1000))
        setIsNewBest(submit(totalMoves))
        setPhase("done")
      }
    } else {
      timeout.current = window.setTimeout(() => setFlipped([]), MISMATCH_DELAY)
    }
  }

  if (phase === "setup") {
    return (
      <GameShell gameId="card-match" best={best} bestMode={config.label}>
        <Panel className="space-y-6">
          <p className="text-muted">
            Every card has a twin. Flip two at a time: if they match they stay
            face up, if not they flip back. Clear the board in as few moves as
            possible.
          </p>
          <Field label="Board size" hint={`${config.pairs} pairs`}>
            <SegmentedControl<Difficulty>
              label="Board size"
              value={difficulty}
              onChange={setDifficulty}
              options={(Object.keys(DIFFICULTIES) as Difficulty[]).map((d) => ({
                value: d,
                label: DIFFICULTIES[d].label,
              }))}
            />
          </Field>
          <Button fullWidth onClick={start}>
            Deal cards
          </Button>
        </Panel>
      </GameShell>
    )
  }

  return (
    <GameShell gameId="card-match" best={best} bestMode={config.label}>
      <Panel>
        <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">
          <Stat label="Moves" value={moves} />
          <Stat label="Pairs" value={`${matchedPairs}/${config.pairs}`} />
          <Stat label="Time" value={formatTime(elapsed)} />
        </div>

        <div
          className="grid gap-2 sm:gap-3"
          style={{ gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))` }}
        >
          {cards.map((card, index) => {
            const faceUp = card.matched || flipped.includes(index)
            const Icon = SYMBOLS[card.symbol].icon
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => flip(index)}
                aria-label={
                  faceUp ? SYMBOLS[card.symbol].name : `Card ${index + 1}, face down`
                }
                disabled={card.matched || phase !== "playing"}
                className="focus-ring group aspect-[3/4] rounded-xl [perspective:800px] disabled:cursor-default"
              >
                <span
                  className={cx(
                    "relative block h-full w-full rounded-xl transition-transform duration-300 [transform-style:preserve-3d]",
                    faceUp && "[transform:rotateY(180deg)]"
                  )}
                >
                  {/* Back */}
                  <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-brand [backface-visibility:hidden] group-hover:bg-brand/90">
                    <span className="aspect-square w-2/5 rounded-full border-2 border-white/30" />
                  </span>
                  {/* Face */}
                  <span
                    className={cx(
                      "absolute inset-0 flex items-center justify-center rounded-xl border [backface-visibility:hidden] [transform:rotateY(180deg)]",
                      card.matched
                        ? "border-good/40 bg-good-soft text-good"
                        : "border-line bg-surface-2 text-brand-ink"
                    )}
                  >
                    <Icon className="h-1/2 w-1/2" strokeWidth={1.75} aria-hidden />
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {phase === "playing" && (
          <div className="mt-5 flex justify-center">
            <Button variant="ghost" size="md" onClick={start}>
              <RotateCcw size={16} aria-hidden />
              Restart
            </Button>
          </div>
        )}

        {phase === "done" && (
          <div className="mt-8 space-y-6 border-t border-line pt-8">
            <ResultHeader
              eyebrow="Board cleared"
              title={`${moves} moves`}
              description={`${formatTime(elapsed)} on ${config.label}. A perfect game is ${config.pairs} moves.`}
              newBest={isNewBest}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Button fullWidth onClick={start}>
                Play again
              </Button>
              <Button fullWidth variant="secondary" onClick={() => setPhase("setup")}>
                Change board
              </Button>
            </div>
          </div>
        )}
      </Panel>
    </GameShell>
  )
}

export default CardMatchPage
