"use client"

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import GameShell from "@/components/game/GameShell"
import BaselineNote from "@/components/game/BaselineNote"
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
import { useBestScore } from "@/libs/useBestScore"
import { recordResult, type Comparison } from "@/libs/history"

// Parameters follow the 3-minute PVT-B (Basner et al., 2011). The 1-minute
// quick check uses the same rules but is noisier, so it keeps its own history.
const MIN_GAP_MS = 1000
const MAX_GAP_MS = 4000
const LAPSE_MS = 355
const FALSE_START_MS = 100
const TIMEOUT_MS = 5000
const FEEDBACK_MS = 600

interface Length {
  minutes: number
  /** History and best-score key; the 3-minute test keeps the original key. */
  key: string
  /** Fewest reactions for a result worth saving (about a third of a typical run). */
  minResponses: number
}

const LENGTHS: Length[] = [
  { minutes: 1, key: "alertness:1m", minResponses: 8 },
  { minutes: 3, key: "alertness", minResponses: 20 },
]

type Phase = "intro" | "running" | "aborted" | "done"
type Trial = "wait" | "stimulus" | "feedback" | "early"

interface Results {
  median: number
  lapses: number
  falseStarts: number
  responses: number
  fastest10: number
  slowest10: number
}

const randomGap = () => MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS)

const summarize = (rts: number[], falseStarts: number): Results => {
  const sorted = [...rts].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  const median =
    sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
  const tenth = Math.max(1, Math.round(sorted.length / 10))
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
  return {
    median: Math.round(median),
    lapses: rts.filter((rt) => rt >= LAPSE_MS).length,
    falseStarts,
    responses: rts.length,
    fastest10: Math.round(mean(sorted.slice(0, tenth))),
    slowest10: Math.round(mean(sorted.slice(-tenth))),
  }
}

const AlertnessPage = () => {
  const [length, setLength] = useState<Length>(LENGTHS[0])
  const [phase, setPhase] = useState<Phase>("intro")
  const [trial, setTrial] = useState<Trial>("wait")
  const [counter, setCounter] = useState(0)
  const [lastRt, setLastRt] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(100)
  const [results, setResults] = useState<Results | null>(null)
  const [comparison, setComparison] = useState<Comparison | null>(null)
  const [isNewBest, setIsNewBest] = useState(false)
  const { best, submit } = useBestScore(length.key, { lowerIsBetter: true })

  const startedAt = useRef(0)
  const onset = useRef<number | null>(null)
  const rts = useRef<number[]>([])
  const falseStarts = useRef(0)
  const timers = useRef<number[]>([])
  const frame = useRef<number | null>(null)
  const trialRef = useRef<Trial>("wait")
  const testMs = length.minutes * 60 * 1000

  const setTrialState = (t: Trial) => {
    trialRef.current = t
    setTrial(t)
  }

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
  }
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const finish = useCallback(() => {
    clearTimers()
    const summary = summarize(rts.current, falseStarts.current)
    setResults(summary)
    if (summary.responses >= length.minResponses) {
      setComparison(
        recordResult(length.key, summary.median, {
          lowerIsBetter: true,
          extra: {
            lapses: summary.lapses,
            falseStarts: summary.falseStarts,
            slowest10: summary.slowest10,
          },
        })
      )
      setIsNewBest(submit(summary.median))
    }
    setPhase("done")
  }, [submit, length])

  // Schedule the next stimulus after a random gap, unless the test is over.
  const scheduleNext = useCallback(
    (fromNow: number) => {
      const gap = randomGap()
      if (performance.now() - startedAt.current + gap > testMs) {
        later(finish, Math.max(0, testMs - (performance.now() - startedAt.current)))
        return
      }
      later(() => {
        onset.current = null
        setCounter(0)
        setTrialState("stimulus")
      }, Math.max(fromNow, gap))
    },
    [finish, testMs]
  )

  // Time the stimulus from the frame it is painted in, and run the counter.
  useLayoutEffect(() => {
    if (phase !== "running" || trial !== "stimulus") return
    const tick = () => {
      const now = performance.now()
      if (onset.current === null) onset.current = now
      const elapsed = now - onset.current
      setCounter(Math.floor(elapsed))
      if (elapsed >= TIMEOUT_MS) {
        // No response: count it as the slowest possible reaction.
        rts.current.push(TIMEOUT_MS)
        setLastRt(TIMEOUT_MS)
        setTrialState("feedback")
        later(() => setTrialState("wait"), FEEDBACK_MS)
        scheduleNext(FEEDBACK_MS)
        return
      }
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [phase, trial, scheduleNext])

  // Overall test clock.
  useEffect(() => {
    if (phase !== "running") return
    const id = window.setInterval(() => {
      const left = 100 - ((performance.now() - startedAt.current) / testMs) * 100
      setRemaining(Math.max(0, left))
    }, 250)
    return () => window.clearInterval(id)
  }, [phase, testMs])

  // Switching tabs or apps makes the reaction times meaningless.
  useEffect(() => {
    if (phase !== "running") return
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        clearTimers()
        setPhase("aborted")
      }
    }
    document.addEventListener("visibilitychange", onHide)
    return () => document.removeEventListener("visibilitychange", onHide)
  }, [phase])

  useEffect(() => clearTimers, [])

  const respond = useCallback(
    (timeStamp: number) => {
      if (phase !== "running") return
      const current = trialRef.current
      if (current === "stimulus" && onset.current !== null) {
        const rt = timeStamp - onset.current
        if (frame.current !== null) cancelAnimationFrame(frame.current)
        if (rt < FALSE_START_MS) {
          falseStarts.current += 1
          setTrialState("early")
        } else {
          rts.current.push(Math.round(rt))
          setLastRt(Math.round(rt))
          setTrialState("feedback")
        }
        later(() => setTrialState("wait"), FEEDBACK_MS)
        scheduleNext(FEEDBACK_MS)
      } else if (current === "wait") {
        // Responding before anything appeared: restart the wait.
        falseStarts.current += 1
        clearTimers()
        setTrialState("early")
        later(() => setTrialState("wait"), FEEDBACK_MS)
        scheduleNext(FEEDBACK_MS)
      }
    },
    [phase, scheduleNext]
  )

  useEffect(() => {
    if (phase !== "running") return
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return
      e.preventDefault()
      respond(e.timeStamp)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [phase, respond])

  const start = () => {
    clearTimers()
    rts.current = []
    falseStarts.current = 0
    setResults(null)
    setComparison(null)
    setIsNewBest(false)
    setLastRt(null)
    setRemaining(100)
    startedAt.current = performance.now()
    setTrialState("wait")
    setPhase("running")
    scheduleNext(0)
  }

  const secondsLeft = Math.ceil((remaining / 100) * (testMs / 1000))

  return (
    <GameShell gameId="alertness" best={best} bestMode={`${length.minutes} min`}>
      {phase === "intro" && (
        <Panel className="space-y-6">
          <div className="space-y-3 text-muted">
            <p>
              A {length.minutes}-minute reaction test. A counter will appear at random moments:
              tap the box or press <kbd className="rounded border border-line bg-surface-2 px-1.5 py-0.5 text-xs font-semibold text-ink">Space</kbd>{" "}
              as fast as you can. Don&apos;t tap before it appears.
            </p>
            <p>
              It&apos;s based on the Psychomotor Vigilance Task researchers use to
              measure alertness. Your result is compared with your own earlier
              results on this device, not with other people.
            </p>
          </div>
          <Field
            label="Test length"
            hint={length.minutes === 1 ? "Quick check" : "Most reliable"}
          >
            <SegmentedControl<number>
              label="Test length"
              value={length.minutes}
              onChange={(m) => setLength(LENGTHS.find((l) => l.minutes === m) ?? LENGTHS[0])}
              options={LENGTHS.map((l) => ({ value: l.minutes, label: `${l.minutes} min` }))}
            />
          </Field>
          <ul className="space-y-2 rounded-xl bg-surface-2 p-4 text-sm text-muted">
            <li>• Use the same device and length each time for comparable results.</li>
            <li>• Find a quiet moment: switching tabs cancels the test.</li>
            <li>• This is a self-check for fun, not a medical test.</li>
          </ul>
          <Button fullWidth onClick={start}>
            Start the {length.minutes}-minute test
          </Button>
        </Panel>
      )}

      {phase === "running" && (
        <Panel className="space-y-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              {trial === "stimulus" ? "Tap now!" : "Wait for the counter…"}
            </span>
            <span className="tabular-nums text-muted">{secondsLeft}s left</span>
          </div>
          <ProgressBar value={remaining} label="Test time remaining" />
          <button
            type="button"
            aria-label="Reaction target: tap when the counter appears"
            onPointerDown={(e) => {
              e.preventDefault()
              respond(e.timeStamp)
            }}
            className={cx(
              "flex h-72 w-full touch-manipulation select-none items-center justify-center rounded-2xl transition-colors duration-75 focus:outline-none",
              trial === "stimulus" ? "bg-brand" : trial === "early" ? "bg-bad-soft" : "bg-surface-2"
            )}
          >
            {trial === "stimulus" && (
              <span className="font-mono text-6xl font-semibold tabular-nums text-white">
                {counter}
              </span>
            )}
            {trial === "feedback" && lastRt !== null && (
              <span
                className={cx(
                  "font-mono text-5xl font-semibold tabular-nums",
                  lastRt >= LAPSE_MS ? "text-bad" : "text-ink"
                )}
              >
                {lastRt} <span className="text-2xl text-muted">ms</span>
              </span>
            )}
            {trial === "early" && (
              <span className="text-xl font-semibold text-bad">Too soon</span>
            )}
          </button>
          <p className="text-center text-sm text-muted">
            Responses so far: <span className="tabular-nums text-ink">{rts.current.length}</span>
          </p>
        </Panel>
      )}

      {phase === "aborted" && (
        <Panel className="space-y-6 text-center">
          <ResultHeader
            eyebrow="Test cancelled"
            title="Paused"
            description="You left the page during the test, so the results wouldn't be accurate. Nothing was saved."
          />
          <Button fullWidth onClick={start}>
            Start again
          </Button>
        </Panel>
      )}

      {phase === "done" && results && (
        <Panel className="space-y-8">
          {results.responses >= length.minResponses ? (
            <>
              <ResultHeader
                eyebrow="Median reaction time"
                title={`${results.median} ms`}
                description={`${results.responses} reactions in ${length.minutes} minute${length.minutes === 1 ? "" : "s"}.`}
                newBest={isNewBest}
              />
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Stat
                  label={`Lapses (≥${LAPSE_MS} ms)`}
                  value={results.lapses}
                  tone={results.lapses > 2 ? "bad" : "neutral"}
                />
                <Stat label="False starts" value={results.falseStarts} />
                <Stat label="Fastest 10%" value={`${results.fastest10} ms`} />
                <Stat label="Slowest 10%" value={`${results.slowest10} ms`} />
              </div>
              <BaselineNote comparison={comparison} unit="ms" />
              <p className="text-center text-xs text-muted">
                Lower is better. Lapses and the slowest 10% usually change first
                when you&apos;re tired.
              </p>
            </>
          ) : (
            <ResultHeader
              eyebrow="Not enough reactions"
              title={`${results.responses} / ${length.minResponses}`}
              description={`We need at least ${length.minResponses} reactions for a reliable result, so this one wasn't saved.`}
            />
          )}
          <Button fullWidth onClick={start}>
            Test again
          </Button>
        </Panel>
      )}
    </GameShell>
  )
}

export default AlertnessPage
