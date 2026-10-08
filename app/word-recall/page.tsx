"use client"

import React, { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"
import GameShell from "@/components/game/GameShell"
import {
  Button,
  Field,
  Panel,
  ProgressBar,
  ResultHeader,
  SegmentedControl,
  Stat,
  cx,
} from "@/components/game/ui"
import BaselineNote from "@/components/game/BaselineNote"
import { recordResult, type Comparison } from "@/libs/history"
import { shuffle } from "@/libs/shuffle"
import { useBestScore } from "@/libs/useBestScore"
import { WORDS } from "./words"

type Phase = "setup" | "study" | "recall" | "result"

const LIST_SIZES = [10, 15, 20]
const STUDY_TIMES = [30, 45, 60]

const pickWords = (count: number) => shuffle(WORDS).slice(0, count)

const normalize = (input: string) => input.toLowerCase().replace(/[^a-z]/g, "")

// Accept simple plurals ("apples" for "apple", "boxes" for "box").
const findWord = (input: string, words: string[]) => {
  const guess = normalize(input)
  if (!guess) return null
  return words.find((w) => [w, `${w}s`, `${w}es`].includes(guess)) ?? null
}

type Feedback = { kind: "found" | "repeat" | "miss"; text: string } | null

const WordRecallPage = () => {
  const [phase, setPhase] = useState<Phase>("setup")
  const [listSize, setListSize] = useState(15)
  const [studyTime, setStudyTime] = useState(45)
  const [words, setWords] = useState<string[]>([])
  const [found, setFound] = useState<string[]>([])
  const [misses, setMisses] = useState<string[]>([])
  const [guess, setGuess] = useState("")
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [remaining, setRemaining] = useState(100)
  const [isNewBest, setIsNewBest] = useState(false)
  const [comparison, setComparison] = useState<Comparison | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { best, submit } = useBestScore(`word-recall:${listSize}`)

  useEffect(() => {
    if (phase !== "study") return
    const startedAt = Date.now()
    const id = window.setInterval(() => {
      const left = 100 - ((Date.now() - startedAt) / (studyTime * 1000)) * 100
      if (left <= 0) {
        window.clearInterval(id)
        setPhase("recall")
      }
      setRemaining(Math.max(0, left))
    }, 100)
    return () => window.clearInterval(id)
  }, [phase, studyTime])

  useEffect(() => {
    if (phase === "recall") inputRef.current?.focus()
  }, [phase])

  const start = () => {
    setWords(pickWords(listSize))
    setFound([])
    setMisses([])
    setGuess("")
    setFeedback(null)
    setRemaining(100)
    setIsNewBest(false)
    setComparison(null)
    setPhase("study")
  }

  const finish = (finalFound: string[]) => {
    setComparison(recordResult(`word-recall:${listSize}:${studyTime}s`, finalFound.length))
    setIsNewBest(finalFound.length > 0 && submit(finalFound.length))
    setPhase("result")
  }

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault()
    const typed = guess.trim()
    if (!typed) return
    setGuess("")
    const match = findWord(typed, words)

    if (!match) {
      setMisses((m) => [...m, typed])
      setFeedback({ kind: "miss", text: `“${typed}” wasn’t on the list` })
    } else if (found.includes(match)) {
      setFeedback({ kind: "repeat", text: `You already have “${match}”` })
    } else {
      const next = [...found, match]
      setFound(next)
      setFeedback({ kind: "found", text: `Got it: ${match}` })
      if (next.length === words.length) finish(next)
    }
  }

  const secondsLeft = Math.ceil((remaining / 100) * studyTime)

  return (
    <GameShell
      gameId="word-recall"
      best={best}
      bestMode={`${listSize} words`}
      bestTotal={listSize}
    >
      {phase === "setup" && (
        <Panel className="space-y-6">
          <p className="text-muted">
            You&apos;ll see a list of words for a short time. When it
            disappears, type back as many as you can remember, in any order.
          </p>
          <Field label="List length" hint={`${listSize} words`}>
            <SegmentedControl<number>
              label="List length"
              value={listSize}
              onChange={setListSize}
              options={LIST_SIZES.map((n) => ({ value: n, label: n }))}
            />
          </Field>
          <Field label="Study time" hint={`${studyTime} seconds`}>
            <SegmentedControl<number>
              label="Study time"
              value={studyTime}
              onChange={setStudyTime}
              options={STUDY_TIMES.map((n) => ({ value: n, label: `${n}s` }))}
            />
          </Field>
          <Button fullWidth onClick={start}>
            Show the words
          </Button>
        </Panel>
      )}

      {phase === "study" && (
        <Panel className="space-y-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Memorize these words</span>
            <span className="tabular-nums text-muted">{secondsLeft}s</span>
          </div>
          <ProgressBar value={remaining} label="Study time remaining" />
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {words.map((word, i) => (
              <li
                key={word}
                className="animate-fade-up rounded-lg bg-surface-2 px-3 py-2.5 text-center font-medium capitalize"
                style={{ animationDelay: `${i * 25}ms` }}
              >
                {word}
              </li>
            ))}
          </ul>
          <Button fullWidth variant="secondary" onClick={() => setPhase("recall")}>
            I&apos;m ready
          </Button>
        </Panel>
      )}

      {phase === "recall" && (
        <Panel className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Found" value={`${found.length} / ${words.length}`} tone="brand" />
            <Stat label="Not on list" value={misses.length} />
          </div>

          <form onSubmit={handleGuess} className="flex gap-2">
            <input
              ref={inputRef}
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Type a word and press Enter"
              aria-label="Word you remember"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={cx(
                "focus-ring h-12 min-w-0 flex-1 rounded-xl border bg-surface px-4 text-base placeholder:text-muted",
                feedback?.kind === "miss" ? "border-bad/60" : "border-line"
              )}
            />
            <Button type="submit" className="shrink-0">
              Add
            </Button>
          </form>

          <p
            aria-live="polite"
            className={cx(
              "min-h-[1.25rem] text-sm",
              feedback?.kind === "found" && "text-good",
              feedback?.kind === "miss" && "text-bad",
              feedback?.kind === "repeat" && "text-muted"
            )}
          >
            {feedback?.text}
          </p>

          {found.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {found.map((word) => (
                <li
                  key={word}
                  className="inline-flex animate-pop items-center gap-1.5 rounded-full bg-good-soft px-3 py-1 text-sm font-medium capitalize text-good"
                >
                  <Check size={14} aria-hidden />
                  {word}
                </li>
              ))}
            </ul>
          )}

          <Button fullWidth variant="secondary" onClick={() => finish(found)}>
            I&apos;m done
          </Button>
        </Panel>
      )}

      {phase === "result" && (
        <Panel className="space-y-8">
          <ResultHeader
            eyebrow="You remembered"
            title={`${found.length} / ${words.length}`}
            description={
              found.length === words.length
                ? "Every single word. Try a longer list or less study time."
                : `${Math.round((found.length / words.length) * 100)}% of the list${
                    misses.length
                      ? `, plus ${misses.length} ${misses.length === 1 ? "word that wasn’t" : "words that weren’t"} on it`
                      : ""
                  }.`
            }
            newBest={isNewBest}
          />
          <BaselineNote comparison={comparison} unit="words" />
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted">The full list</h3>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {words.map((word) => {
                const got = found.includes(word)
                return (
                  <li
                    key={word}
                    className={cx(
                      "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium capitalize",
                      got ? "bg-good-soft text-good" : "bg-surface-2 text-muted"
                    )}
                  >
                    {got && <Check size={14} aria-hidden />}
                    {word}
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button fullWidth onClick={start}>
              New list
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

export default WordRecallPage
