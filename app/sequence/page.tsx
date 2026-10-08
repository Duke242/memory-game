"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import GameShell from "@/components/game/GameShell"
import { Button, Panel, ResultHeader, cx } from "@/components/game/ui"
import { useBestScore } from "@/libs/useBestScore"

type Phase = "idle" | "showing" | "input" | "success" | "over"

const GRID = 3
const TILES = GRID * GRID

const randomTile = () => Math.floor(Math.random() * TILES)

// Playback speeds up slightly as the sequence grows, down to a floor.
const flashDuration = (level: number) => Math.max(260, 520 - level * 18)
const FLASH_GAP = 180

const SequencePage = () => {
  const [phase, setPhase] = useState<Phase>("idle")
  const [sequence, setSequence] = useState<number[]>([])
  const [inputIndex, setInputIndex] = useState(0)
  const [lit, setLit] = useState<number | null>(null)
  const [pressed, setPressed] = useState<number | null>(null)
  const [mistake, setMistake] = useState<{ picked: number; expected: number } | null>(null)
  const [isNewBest, setIsNewBest] = useState(false)
  const timeouts = useRef<number[]>([])
  const { best, submit } = useBestScore("sequence")

  const clearTimers = () => {
    timeouts.current.forEach((t) => window.clearTimeout(t))
    timeouts.current = []
  }
  const later = (fn: () => void, ms: number) => {
    timeouts.current.push(window.setTimeout(fn, ms))
  }

  useEffect(() => clearTimers, [])

  // Play the sequence back, then hand control to the player.
  useEffect(() => {
    if (phase !== "showing") return
    const on = flashDuration(sequence.length)
    let t = 500
    sequence.forEach((tile) => {
      later(() => setLit(tile), t)
      later(() => setLit(null), t + on)
      t += on + FLASH_GAP
    })
    later(() => {
      setInputIndex(0)
      setPhase("input")
    }, t)
    return clearTimers
  }, [phase, sequence])

  const start = () => {
    clearTimers()
    setMistake(null)
    setIsNewBest(false)
    setLit(null)
    setSequence([randomTile()])
    setPhase("showing")
  }

  const handleTile = useCallback(
    (tile: number) => {
      if (phase !== "input") return

      setPressed(tile)
      later(() => setPressed((p) => (p === tile ? null : p)), 180)

      if (sequence[inputIndex] !== tile) {
        clearTimers()
        setPressed(null)
        setMistake({ picked: tile, expected: sequence[inputIndex] })
        const completed = sequence.length - 1
        setIsNewBest(completed > 0 && submit(completed))
        setPhase("over")
        return
      }

      if (inputIndex + 1 === sequence.length) {
        setPhase("success")
        later(() => {
          setSequence((s) => [...s, randomTile()])
          setPhase("showing")
        }, 700)
      } else {
        setInputIndex(inputIndex + 1)
      }
    },
    [phase, sequence, inputIndex, submit]
  )

  const level = sequence.length
  const completed = Math.max(0, level - 1)

  const status = (() => {
    switch (phase) {
      case "idle":
        return "Watch the tiles, then repeat them in order."
      case "showing":
        return "Watch closely…"
      case "input":
        return `Your turn: ${inputIndex} of ${level}`
      case "success":
        return "Nice! One more tile coming."
      case "over":
        return "Wrong tile."
    }
  })()

  return (
    <GameShell gameId="sequence" best={best}>
      <Panel>
        <div className="mb-5 flex items-center justify-between">
          <span className="text-sm font-medium text-muted">Level</span>
          <span className="text-2xl font-semibold tabular-nums">
            {phase === "idle" ? "—" : level}
          </span>
        </div>

        <div
          className={cx(
            "mx-auto grid aspect-square max-w-sm gap-2.5 sm:gap-3",
            phase === "success" && "animate-pop",
            phase === "over" && "animate-shake"
          )}
          style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: TILES }, (_, tile) => {
            const isLit = lit === tile || pressed === tile
            const isExpected = phase === "over" && mistake?.expected === tile
            const isWrong = phase === "over" && mistake?.picked === tile
            return (
              <button
                key={tile}
                type="button"
                aria-label={`Tile ${tile + 1}`}
                disabled={phase !== "input"}
                onClick={() => handleTile(tile)}
                className={cx(
                  "focus-ring rounded-xl transition-all duration-150 disabled:cursor-default",
                  isWrong
                    ? "bg-bad"
                    : isExpected
                    ? "bg-good"
                    : isLit
                    ? "scale-[0.97] bg-brand shadow-lg shadow-brand/30"
                    : phase === "success"
                    ? "bg-good-soft"
                    : "bg-surface-2",
                  phase === "input" && !isLit && "hover:bg-line"
                )}
              />
            )
          })}
        </div>

        <p
          className="mt-5 min-h-[1.5rem] text-center text-sm text-muted"
          aria-live="polite"
        >
          {status}
        </p>

        {phase === "idle" && (
          <div className="mt-6">
            <Button fullWidth onClick={start}>
              Start
            </Button>
          </div>
        )}

        {phase === "over" && (
          <div className="mt-8 space-y-6 border-t border-line pt-8">
            <ResultHeader
              eyebrow="You reached"
              title={`Level ${completed}`}
              description={
                completed === 0
                  ? "The first one is the hardest. Give it another go."
                  : `You repeated a sequence of ${completed} tile${completed === 1 ? "" : "s"}. The green tile was next.`
              }
              newBest={isNewBest}
            />
            <Button fullWidth onClick={start}>
              Play again
            </Button>
          </div>
        )}
      </Panel>
    </GameShell>
  )
}

export default SequencePage
