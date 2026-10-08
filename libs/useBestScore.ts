"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// Personal bests live in this browser only (localStorage). Every access is
// guarded because storage can be unavailable (private mode, blocked cookies).
const PREFIX = "memorymaster:best:"
const EVENT = "memorymaster:best-change"

export const readBestScore = (key: string): number | null => {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw === null) return null
    const value = Number(raw)
    return Number.isFinite(value) ? value : null
  } catch {
    return null
  }
}

const writeBestScore = (key: string, value: number) => {
  try {
    window.localStorage.setItem(PREFIX + key, String(value))
  } catch {
    // Storage unavailable: the best score just won't persist.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }))
}

/**
 * Tracks the personal best for `key`. `submit` records a finished game's
 * score and returns true when it beats the previous best.
 */
export const useBestScore = (
  key: string,
  { lowerIsBetter = false }: { lowerIsBetter?: boolean } = {}
) => {
  const [best, setBest] = useState<number | null>(null)
  // Mirrors `best` so comparisons still work when storage is unavailable.
  const bestRef = useRef<number | null>(null)

  useEffect(() => {
    bestRef.current = readBestScore(key)
    setBest(bestRef.current)
    // Pick up writes from other tabs or components. A failed read (null)
    // never wipes a best we already know about.
    const sync = () => {
      const stored = readBestScore(key)
      if (stored === null) return
      bestRef.current = stored
      setBest(stored)
    }
    window.addEventListener(EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [key])

  const submit = useCallback(
    (score: number): boolean => {
      const previous = readBestScore(key) ?? bestRef.current
      const isBetter =
        previous === null ||
        (lowerIsBetter ? score < previous : score > previous)
      if (isBetter) {
        bestRef.current = score
        setBest(score)
        writeBestScore(key, score)
      }
      return isBetter
    },
    [key, lowerIsBetter]
  )

  return { best, submit }
}
