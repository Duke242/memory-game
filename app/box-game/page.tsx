"use client"

import React, { useEffect, useState } from "react"
import { Check, X } from "lucide-react"
import toast from "react-hot-toast"
import GameShell from "@/components/game/GameShell"
import {
  Button,
  Field,
  Panel,
  ProgressBar,
  ResultHeader,
  SegmentedControl,
  Slider,
  Stat,
  cx,
} from "@/components/game/ui"
import { useBestScore } from "@/libs/useBestScore"

type GameState = "setup" | "display" | "recall" | "result"

const getMaxColoredBoxes = (gridSize: number) =>
  Math.min(Math.floor(gridSize * gridSize * 0.8), 20)

const BoxGamePage: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>("setup")
  const [coloredBoxes, setColoredBoxes] = useState<boolean[]>([])
  const [userSelection, setUserSelection] = useState<boolean[]>([])
  const [difficulty, setDifficulty] = useState<number>(4)
  const [numColoredBoxes, setNumColoredBoxes] = useState<number>(3)
  const [timeRemaining, setTimeRemaining] = useState<number>(100)
  const [displayTime, setDisplayTime] = useState<number>(3)
  const [score, setScore] = useState<number>(0)
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, missed: 0 })
  const [isNewBest, setIsNewBest] = useState(false)
  const { best, submit } = useBestScore("box")

  useEffect(() => {
    if (gameState !== "display") return
    const total = difficulty * difficulty
    const newColoredBoxes = Array(total).fill(false)
    let remainingBoxes = numColoredBoxes
    while (remainingBoxes > 0) {
      const randomIndex = Math.floor(Math.random() * total)
      if (!newColoredBoxes[randomIndex]) {
        newColoredBoxes[randomIndex] = true
        remainingBoxes--
      }
    }
    setColoredBoxes(newColoredBoxes)
    setUserSelection(Array(total).fill(false))
    setTimeRemaining(100)

    const startedAt = Date.now()
    const timer = window.setInterval(() => {
      const left = 100 - ((Date.now() - startedAt) / (displayTime * 1000)) * 100
      if (left <= 0) {
        window.clearInterval(timer)
        setGameState("recall")
      }
      setTimeRemaining(Math.max(0, left))
    }, 50)
    return () => window.clearInterval(timer)
  }, [gameState, difficulty, displayTime, numColoredBoxes])

  const handleStartGame = () => {
    setIsNewBest(false)
    setGameState("display")
  }

  const handleBoxClick = (index: number) => {
    if (gameState !== "recall") return
    setUserSelection((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  const handleSubmit = () => {
    let correct = 0
    let incorrect = 0
    let missed = 0
    coloredBoxes.forEach((isColored, index) => {
      if (isColored) {
        if (userSelection[index]) correct++
        else missed++
      } else if (userSelection[index]) {
        incorrect++
      }
    })

    // Wrong picks cancel out right ones, so selecting everything can't score 100%.
    const percentage = Math.round(
      (Math.max(0, correct - incorrect) / numColoredBoxes) * 100
    )
    setScore(percentage)
    setStats({ correct, incorrect, missed })
    setIsNewBest(percentage === 100 && submit(numColoredBoxes))
    setGameState("result")
  }

  const nextLevelPressed = () => {
    let newDifficulty = difficulty
    const newNumColoredBoxes = numColoredBoxes + 1

    if (difficulty === 3 && numColoredBoxes >= 7) {
      newDifficulty = 4
    } else if (difficulty === 4 && numColoredBoxes >= 12) {
      newDifficulty = 5
    } else if (difficulty === 5 && numColoredBoxes >= 20) {
      toast.success("Congratulations! You've beaten the highest level!", {
        duration: 3000,
        position: "top-center",
      })
      setGameState("setup")
      return
    }

    setDifficulty(newDifficulty)
    setNumColoredBoxes(newNumColoredBoxes)
    setIsNewBest(false)
    setGameState("display")
  }

  const selectedCount = userSelection.filter(Boolean).length

  const renderGrid = () => (
    <div
      className="mx-auto grid max-w-sm gap-2"
      style={{ gridTemplateColumns: `repeat(${difficulty}, minmax(0, 1fr))` }}
    >
      {coloredBoxes.map((isColored, index) => {
        const selected = userSelection[index]
        const showResult = gameState === "result"
        return (
          <button
            key={index}
            type="button"
            aria-label={`Box ${index + 1}`}
            aria-pressed={gameState === "recall" ? selected : undefined}
            disabled={gameState !== "recall"}
            onClick={() => handleBoxClick(index)}
            className={cx(
              "focus-ring relative flex aspect-square items-center justify-center rounded-lg transition-colors duration-150 disabled:cursor-default",
              gameState === "display" && (isColored ? "bg-brand" : "bg-surface-2"),
              gameState === "recall" &&
                (selected ? "bg-brand" : "bg-surface-2 hover:bg-line"),
              showResult &&
                (isColored && selected
                  ? "bg-good-soft text-good"
                  : selected
                  ? "bg-bad-soft text-bad"
                  : isColored
                  ? "border-2 border-dashed border-brand/60 bg-brand-soft"
                  : "bg-surface-2")
            )}
          >
            {showResult && isColored && selected && <Check size={20} aria-hidden />}
            {showResult && !isColored && selected && <X size={20} aria-hidden />}
          </button>
        )
      })}
    </div>
  )

  return (
    <GameShell gameId="box" best={best}>
      {gameState === "setup" && (
        <Panel className="space-y-6">
          <p className="text-muted">
            Some boxes light up for a moment. Once they go dark, pick out every
            one that was lit.
          </p>
          <Field label="Grid size">
            <SegmentedControl<number>
              label="Grid size"
              value={difficulty}
              onChange={(size) => {
                setDifficulty(size)
                setNumColoredBoxes(Math.min(3, getMaxColoredBoxes(size)))
              }}
              options={[3, 4, 5].map((size) => ({
                value: size,
                label: `${size}×${size}`,
              }))}
            />
          </Field>
          <Field label="Lit boxes" hint={numColoredBoxes}>
            <Slider
              label="Number of lit boxes"
              min={1}
              max={getMaxColoredBoxes(difficulty)}
              value={numColoredBoxes}
              onChange={setNumColoredBoxes}
            />
          </Field>
          <Field label="Display time" hint={`${displayTime}s`}>
            <Slider
              label="Display time, in seconds"
              min={1}
              max={10}
              value={displayTime}
              onChange={setDisplayTime}
            />
          </Field>
          <Button fullWidth onClick={handleStartGame}>
            Start
          </Button>
        </Panel>
      )}

      {gameState === "display" && (
        <Panel className="space-y-6">
          <p className="text-center text-sm font-medium text-muted">
            Memorize the {numColoredBoxes} lit boxes
          </p>
          {renderGrid()}
          <ProgressBar value={timeRemaining} label="Time remaining" />
        </Panel>
      )}

      {gameState === "recall" && (
        <Panel className="space-y-6">
          <p className="text-center text-sm font-medium text-muted">
            Select the boxes that were lit ·{" "}
            <span className="tabular-nums text-ink">
              {selectedCount} / {numColoredBoxes}
            </span>
          </p>
          {renderGrid()}
          <Button fullWidth onClick={handleSubmit}>
            Check
          </Button>
        </Panel>
      )}

      {gameState === "result" && (
        <Panel className="space-y-8">
          <ResultHeader
            eyebrow={score === 100 ? "Perfect" : "Your score"}
            title={`${score}%`}
            description={
              score === 100
                ? `All ${numColoredBoxes} boxes. Next level has ${numColoredBoxes + 1}.`
                : "Green were right, red were wrong, dashed ones were missed."
            }
            newBest={isNewBest}
          />
          {renderGrid()}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Stat label="Correct" value={stats.correct} tone="good" />
            <Stat label="Wrong" value={stats.incorrect} tone={stats.incorrect ? "bad" : "neutral"} />
            <Stat label="Missed" value={stats.missed} />
          </div>
          {score === 100 ? (
            <Button fullWidth onClick={nextLevelPressed}>
              Next level
            </Button>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Button fullWidth onClick={handleStartGame}>
                Try again
              </Button>
              <Button fullWidth variant="secondary" onClick={() => setGameState("setup")}>
                Change settings
              </Button>
            </div>
          )}
        </Panel>
      )}
    </GameShell>
  )
}

export default BoxGamePage
