"use client"

import React, { useEffect, useRef, useState } from "react"
import { Shuffle } from "lucide-react"
import GameShell from "@/components/game/GameShell"
import { Button, Panel, ProgressBar, ResultHeader, Stat, cx } from "@/components/game/ui"
import { useBestScore } from "@/libs/useBestScore"
import { anagrams } from "./lettersAndWords"

const GAME_SECONDS = 60
const letterSets = Object.keys(anagrams) as (keyof typeof anagrams)[]

interface GameState {
  letters: string
  shuffledLetters: string
  userGuess: string
  score: number
  timeLeft: number
  isGameActive: boolean
  hasStarted: boolean
  usedWords: string[]
  randomIndex: number
}

type Feedback = { ok: boolean; text: string } | null

const shuffleLetters = (letters: string): string => {
  const array = letters.split("")
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array.join("")
}

const newGame = (): GameState => {
  const randomIndex = Math.floor(Math.random() * letterSets.length)
  const letters = letterSets[randomIndex]
  return {
    randomIndex,
    letters,
    shuffledLetters: shuffleLetters(letters),
    userGuess: "",
    score: 0,
    timeLeft: GAME_SECONDS,
    isGameActive: true,
    hasStarted: false,
    usedWords: [],
  }
}

const getWordScore = (length: number): number => {
  switch (length) {
    case 3:
      return 100
    case 4:
      return 400
    case 5:
      return 1200
    case 6:
      return 2000
    default:
      return 0
  }
}

const Anagrams: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [isNewBest, setIsNewBest] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { best, submit } = useBestScore("anagrams")

  // Pick letters on the client to avoid a server/client mismatch.
  useEffect(() => setGameState(newGame()), [])

  useEffect(() => {
    if (!gameState?.isGameActive || !gameState?.hasStarted) return
    const timer = window.setInterval(() => {
      setGameState((prev) => {
        if (!prev) return prev
        const timeLeft = prev.timeLeft - 1
        if (timeLeft <= 0) {
          window.clearInterval(timer)
          return { ...prev, timeLeft: 0, isGameActive: false }
        }
        return { ...prev, timeLeft }
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [gameState?.isGameActive, gameState?.hasStarted])

  // Record the score once when the clock runs out.
  const isOver = gameState !== null && !gameState.isGameActive
  useEffect(() => {
    if (isOver && gameState) setIsNewBest(gameState.score > 0 && submit(gameState.score))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOver])

  if (!gameState) {
    return (
      <GameShell gameId="anagrams" best={best}>
        <Panel className="h-80 animate-pulse">{null}</Panel>
      </GameShell>
    )
  }

  const possibleWords = anagrams[letterSets[gameState.randomIndex]]

  const startNewGame = () => {
    setGameState(newGame())
    setFeedback(null)
    setIsNewBest(false)
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleShuffle = () => {
    if (!gameState.isGameActive) return
    setGameState((prev) => ({ ...prev!, shuffledLetters: shuffleLetters(prev!.letters) }))
    inputRef.current?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!gameState.isGameActive) return
    const guess = gameState.userGuess.trim().toUpperCase()
    if (!guess) return

    const clear = () => setGameState((prev) => ({ ...prev!, userGuess: "" }))

    if (gameState.usedWords.includes(guess)) {
      setFeedback({ ok: false, text: `You already found ${guess}` })
      clear()
    } else if (guess.length < 3) {
      setFeedback({ ok: false, text: "Words need at least 3 letters" })
    } else if (guess.length > 6 || !possibleWords.includes(guess.toLowerCase())) {
      setFeedback({ ok: false, text: `${guess} isn't in the word list` })
      clear()
    } else {
      const points = getWordScore(guess.length)
      setFeedback({ ok: true, text: `${guess} +${points.toLocaleString()}` })
      setGameState((prev) => ({
        ...prev!,
        score: prev!.score + points,
        userGuess: "",
        usedWords: [...prev!.usedWords, guess],
      }))
    }
    inputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!gameState.isGameActive) return
    const userGuess = e.target.value.toUpperCase().replace(/[^A-Z]/g, "")
    setGameState((prev) => ({
      ...prev!,
      userGuess,
      hasStarted: prev!.hasStarted || userGuess.length > 0,
    }))
  }

  if (isOver) {
    return (
      <GameShell gameId="anagrams" best={best}>
        <Panel className="space-y-8">
          <ResultHeader
            eyebrow="Time's up"
            title={`${gameState.score.toLocaleString()} pts`}
            description={`You found ${gameState.usedWords.length} of ${possibleWords.length} possible words from ${gameState.letters.toUpperCase()}.`}
            newBest={isNewBest}
          />
          {gameState.usedWords.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-2">
              {gameState.usedWords.map((word) => (
                <li
                  key={word}
                  className="rounded-full bg-good-soft px-3 py-1 text-sm font-medium text-good"
                >
                  {word}
                </li>
              ))}
            </ul>
          )}
          <Button fullWidth onClick={startNewGame}>
            Play again
          </Button>
        </Panel>
      </GameShell>
    )
  }

  return (
    <GameShell gameId="anagrams" best={best}>
      <Panel className="space-y-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Stat label="Score" value={gameState.score.toLocaleString()} tone="brand" />
          <Stat label="Words" value={gameState.usedWords.length} />
          <Stat label="Time" value={`${gameState.timeLeft}s`} />
        </div>

        <ProgressBar
          value={(gameState.timeLeft / GAME_SECONDS) * 100}
          label="Time remaining"
        />

        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {gameState.shuffledLetters.split("").map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-surface-2 text-2xl font-semibold sm:h-14 sm:w-14"
            >
              {letter.toUpperCase()}
            </span>
          ))}
          <button
            type="button"
            onClick={handleShuffle}
            title="Shuffle letters"
            aria-label="Shuffle letters"
            className="focus-ring ml-1 flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-surface-2 hover:text-ink"
          >
            <Shuffle size={18} aria-hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            value={gameState.userGuess}
            onChange={handleInputChange}
            placeholder="Type a word"
            aria-label="Your word"
            maxLength={7}
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            autoFocus
            className="focus-ring h-12 min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 text-base font-medium uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:text-muted"
          />
          <Button type="submit" className="shrink-0">
            Enter
          </Button>
        </form>

        <p
          aria-live="polite"
          className={cx(
            "min-h-[1.25rem] text-center text-sm font-medium",
            feedback ? (feedback.ok ? "text-good" : "text-bad") : "text-muted"
          )}
        >
          {feedback?.text ??
            (gameState.hasStarted ? "" : "The 60-second clock starts on your first letter.")}
        </p>

        <div className="grid grid-cols-4 gap-2 text-center text-xs text-muted">
          {[3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-lg bg-surface-2 py-2">
              <div className="font-semibold text-ink">{n} letters</div>
              <div className="tabular-nums">{getWordScore(n).toLocaleString()} pts</div>
            </div>
          ))}
        </div>
      </Panel>
    </GameShell>
  )
}

export default Anagrams
