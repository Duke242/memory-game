"use client"

import React, { useEffect, useState } from "react"
import { Check } from "lucide-react"
import GameShell from "@/components/game/GameShell"
import {
  Button,
  Field,
  Panel,
  ProgressBar,
  ResultHeader,
  SegmentedControl,
  Slider,
  cx,
} from "@/components/game/ui"
import { useBestScore } from "@/libs/useBestScore"

type Phase = "setup" | "memorize" | "input" | "correct" | "result"

// Built digit by digit so long numbers keep full precision.
const randomDigits = (length: number) =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join("")

const NumberGamePage = () => {
  const [phase, setPhase] = useState<Phase>("setup")
  const [startingDigits, setStartingDigits] = useState(1)
  const [memorizeSeconds, setMemorizeSeconds] = useState(7)
  const [digits, setDigits] = useState(0)
  const [roundsWon, setRoundsWon] = useState(0)
  const [currentNumber, setCurrentNumber] = useState("")
  const [answer, setAnswer] = useState("")
  const [lastAnswer, setLastAnswer] = useState("")
  const [remaining, setRemaining] = useState(100)
  const [isNewBest, setIsNewBest] = useState(false)
  const { best, submit } = useBestScore("number")

  useEffect(() => {
    if (phase !== "memorize") return
    setCurrentNumber(randomDigits(digits))
    setRemaining(100)
    const startedAt = Date.now()
    const id = window.setInterval(() => {
      const left = 100 - ((Date.now() - startedAt) / (memorizeSeconds * 1000)) * 100
      if (left <= 0) {
        window.clearInterval(id)
        setPhase("input")
      }
      setRemaining(Math.max(0, left))
    }, 50)
    return () => window.clearInterval(id)
  }, [phase, digits, memorizeSeconds])

  useEffect(() => {
    if (phase !== "correct") return
    const id = window.setTimeout(() => setPhase("memorize"), 900)
    return () => window.clearTimeout(id)
  }, [phase])

  const start = () => {
    setDigits(startingDigits)
    setRoundsWon(0)
    setAnswer("")
    setIsNewBest(false)
    setPhase("memorize")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLastAnswer(answer)
    setAnswer("")
    if (answer === currentNumber) {
      setRoundsWon((r) => r + 1)
      setDigits((d) => d + 1)
      setPhase("correct")
    } else {
      const recalled = roundsWon > 0 ? digits - 1 : 0
      setIsNewBest(recalled > 0 && submit(recalled))
      setPhase("result")
    }
  }

  const recalled = roundsWon > 0 ? digits - 1 : 0

  return (
    <GameShell gameId="number" best={best}>
      {phase === "setup" && (
        <Panel className="space-y-6">
          <p className="text-muted">
            A number flashes on screen. Type it back from memory. Every correct
            answer adds one more digit.
          </p>
          <Field label="Starting digits" hint={startingDigits}>
            <SegmentedControl<number>
              label="Starting digits"
              columns={8}
              value={startingDigits}
              onChange={setStartingDigits}
              options={Array.from({ length: 16 }, (_, i) => ({
                value: i + 1,
                label: i + 1,
              }))}
            />
          </Field>
          <Field label="Time to memorize" hint={`${memorizeSeconds}s`}>
            <Slider
              label="Time to memorize, in seconds"
              min={1}
              max={10}
              value={memorizeSeconds}
              onChange={setMemorizeSeconds}
            />
          </Field>
          <Button fullWidth onClick={start}>
            Start
          </Button>
        </Panel>
      )}

      {phase === "memorize" && (
        <Panel className="space-y-8 text-center">
          <p className="text-sm font-medium text-muted">
            Memorize this {digits}-digit number
          </p>
          <p className="break-all font-mono text-4xl font-semibold tracking-[0.15em] sm:text-5xl">
            {currentNumber}
          </p>
          <ProgressBar value={remaining} label="Time remaining" />
        </Panel>
      )}

      {phase === "input" && (
        <Panel>
          <form onSubmit={handleSubmit} className="space-y-6">
            <label htmlFor="answer" className="block text-center text-sm font-medium text-muted">
              What was the number?
            </label>
            <input
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              className="focus-ring h-16 w-full rounded-xl border border-line bg-surface px-4 text-center font-mono text-3xl tracking-[0.15em]"
            />
            <Button type="submit" fullWidth disabled={!answer}>
              Submit
            </Button>
          </form>
        </Panel>
      )}

      {phase === "correct" && (
        <Panel className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="flex h-14 w-14 animate-pop items-center justify-center rounded-full bg-good-soft text-good">
            <Check size={28} aria-hidden />
          </span>
          <p className="text-xl font-semibold">Correct</p>
          <p className="text-sm text-muted">Next up: {digits} digits</p>
        </Panel>
      )}

      {phase === "result" && (
        <Panel className="space-y-8">
          <ResultHeader
            eyebrow="You recalled"
            title={`${recalled} digit${recalled === 1 ? "" : "s"}`}
            description="Most people can hold about 7 digits in short-term memory."
            newBest={isNewBest}
          />
          <dl className="space-y-3 rounded-xl bg-surface-2 p-4 text-center">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                Number
              </dt>
              <dd className="mt-1 break-all font-mono text-xl tracking-[0.1em]">
                {currentNumber}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                Your answer
              </dt>
              <dd className="mt-1 break-all font-mono text-xl tracking-[0.1em]">
                {lastAnswer.split("").map((d, i) => (
                  <span key={i} className={cx(d === currentNumber[i] ? "text-good" : "text-bad")}>
                    {d}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button fullWidth onClick={start}>
              Play again
            </Button>
            <Button fullWidth variant="secondary" onClick={() => setPhase("setup")}>
              Change settings
            </Button>
          </div>
        </Panel>
      )}
    </GameShell>
  )
}

export default NumberGamePage
