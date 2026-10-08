"use client"

// Every finished round is kept in this browser (localStorage) so results can be
// compared against the player's own usual range. Nothing is sent anywhere.

const PREFIX = "memorymaster:history:"
const EVENT = "memorymaster:history-change"
const MAX_ENTRIES = 300

// Baseline tuning: ignore the first rounds (practice gains are biggest there),
// then need a few more before showing a comparison.
export const WARMUP_ROUNDS = 2
export const MIN_BASELINE_ROUNDS = 4
const BASELINE_WINDOW = 20
const BAND_WIDTH = 1.5

export type Device = "touch" | "mouse"

export interface HistoryEntry {
  /** When the round finished (ms since epoch). */
  t: number
  /** The round's score. */
  v: number
  /** Input type: reaction times and tap speed differ between them. */
  d: Device
  /** Optional extra metrics (e.g. lapses for the alertness check). */
  x?: Record<string, number>
}

export type Comparison =
  | { status: "warming-up"; needed: number }
  | {
      status: "ready"
      band: "above" | "within" | "below"
      median: number
      low: number
      high: number
      rounds: number
    }

// Fallback when storage is unavailable, so comparisons still work this visit.
const memory = new Map<string, HistoryEntry[]>()

export const currentDevice = (): Device => {
  try {
    return window.matchMedia("(pointer: coarse)").matches ? "touch" : "mouse"
  } catch {
    return "mouse"
  }
}

export const readHistory = (key: string): HistoryEntry[] => {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as HistoryEntry[]
    }
  } catch {
    // Fall through to the in-memory copy.
  }
  return memory.get(key) ?? []
}

const writeHistory = (key: string, entries: HistoryEntry[]) => {
  memory.set(key, entries)
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(entries))
  } catch {
    // Storage unavailable: history lasts until the page is closed.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }))
}

/** All history keys stored in this browser. */
export const listHistoryKeys = (): string[] => {
  const keys = new Set(memory.keys())
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i)
      if (k?.startsWith(PREFIX)) keys.add(k.slice(PREFIX.length))
    }
  } catch {
    // Ignore.
  }
  return [...keys]
}

export const clearAllHistory = () => {
  for (const key of listHistoryKeys()) {
    memory.delete(key)
    try {
      window.localStorage.removeItem(PREFIX + key)
    } catch {
      // Ignore.
    }
  }
  window.dispatchEvent(new CustomEvent(EVENT))
}

export const onHistoryChange = (fn: () => void) => {
  window.addEventListener(EVENT, fn)
  window.addEventListener("storage", fn)
  return () => {
    window.removeEventListener(EVENT, fn)
    window.removeEventListener("storage", fn)
  }
}

const median = (values: number[]) => {
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

/**
 * The player's usual range from earlier rounds on the same device: the
 * median, plus or minus a robust spread (scaled median absolute deviation).
 */
export const baselineFrom = (prior: HistoryEntry[], device: Device) => {
  const eligible = prior.filter((e) => e.d === device).slice(WARMUP_ROUNDS)
  const recent = eligible.slice(-BASELINE_WINDOW).map((e) => e.v)
  if (recent.length < MIN_BASELINE_ROUNDS) {
    const seen = prior.filter((e) => e.d === device).length
    return { ready: false as const, needed: WARMUP_ROUNDS + MIN_BASELINE_ROUNDS - seen }
  }
  const m = median(recent)
  const mad = median(recent.map((v) => Math.abs(v - m)))
  // Floor the spread so very consistent players don't get flagged for tiny changes.
  const spread = Math.max(1.4826 * mad, Math.abs(m) * 0.05, 1)
  return {
    ready: true as const,
    median: m,
    low: m - BAND_WIDTH * spread,
    high: m + BAND_WIDTH * spread,
    rounds: recent.length,
  }
}

export const compare = (
  prior: HistoryEntry[],
  value: number,
  device: Device,
  lowerIsBetter: boolean
): Comparison => {
  const base = baselineFrom(prior, device)
  if (!base.ready) return { status: "warming-up", needed: base.needed }
  const better = lowerIsBetter ? value < base.low : value > base.high
  const worse = lowerIsBetter ? value > base.high : value < base.low
  return {
    status: "ready",
    band: better ? "above" : worse ? "below" : "within",
    median: base.median,
    low: base.low,
    high: base.high,
    rounds: base.rounds,
  }
}

/**
 * Saves a finished round and returns how it compares with the player's
 * earlier rounds (the new round is not part of its own baseline).
 */
export const recordResult = (
  key: string,
  value: number,
  { lowerIsBetter = false, extra }: { lowerIsBetter?: boolean; extra?: Record<string, number> } = {}
): Comparison => {
  const prior = readHistory(key)
  const device = currentDevice()
  const comparison = compare(prior, value, device, lowerIsBetter)
  const entry: HistoryEntry = { t: Date.now(), v: value, d: device, ...(extra && { x: extra }) }
  writeHistory(key, [...prior, entry].slice(-MAX_ENTRIES))
  return comparison
}
