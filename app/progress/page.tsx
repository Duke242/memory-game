"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Minus, Trash2 } from "lucide-react"
import Logo from "@/components/Logo"
import SiteFooter from "@/components/SiteFooter"
import ProgressChart, { formatDate } from "@/components/progress/ProgressChart"
import { ButtonLink, Button, SegmentedControl, cx } from "@/components/game/ui"
import { describeHistoryKey, games, type GameMeta } from "@/libs/games"
import {
  baselineFrom,
  clearAllHistory,
  compare,
  currentDevice,
  listHistoryKeys,
  onHistoryChange,
  readHistory,
  type Device,
  type HistoryEntry,
} from "@/libs/history"

const CHART_ROUNDS = 30

interface Track {
  key: string
  game: GameMeta
  mode: string | null
  entries: HistoryEntry[]
}

const loadTracks = (): Track[] =>
  listHistoryKeys()
    .map((key) => {
      const info = describeHistoryKey(key)
      return info ? { key, ...info, entries: readHistory(key) } : null
    })
    .filter((t): t is Track => t !== null && t.entries.length > 0)
    .sort(
      (a, b) =>
        games.indexOf(a.game) - games.indexOf(b.game) || a.key.localeCompare(b.key)
    )

const bandStyles = {
  above: { icon: ArrowUpRight, label: "Better than usual", tone: "bg-good-soft text-good" },
  within: { icon: Minus, label: "Within usual range", tone: "bg-brand-soft text-brand-ink" },
  below: { icon: ArrowDownRight, label: "Weaker than usual", tone: "bg-bad-soft text-bad" },
}

const TrackCard = ({ track }: { track: Track }) => {
  const { game, mode, entries } = track
  const lowerIsBetter = !!game.lowerIsBetter
  const device = entries[entries.length - 1].d
  const latest = entries[entries.length - 1]
  const latestVsUsual = compare(entries.slice(0, -1), latest.v, device, lowerIsBetter)
  const usual = baselineFrom(entries, device)
  const band = usual.ready ? { low: Math.max(0, usual.low), high: usual.high } : null
  const shown = entries.slice(-CHART_ROUNDS)
  const title = `${game.title}${mode ? `, ${mode}` : ""}`
  const Icon = game.icon

  return (
    <article className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <header className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
            <Icon size={20} aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="font-semibold">{game.title}</h2>
            <p className="text-sm text-muted">
              {mode ?? game.skill}
              {lowerIsBetter && " · lower is better"}
            </p>
          </div>
        </div>
        <Link
          href={game.href}
          className="focus-ring inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-brand-ink hover:underline"
        >
          Play
          <ArrowRight size={16} aria-hidden />
        </Link>
      </header>

      <dl className="mb-5 grid grid-cols-3 gap-2 text-sm sm:gap-3">
        <div className="rounded-xl bg-surface-2 px-3 py-2.5">
          <dt className="text-xs text-muted">Latest</dt>
          <dd className="mt-0.5 text-lg font-semibold">
            {latest.v.toLocaleString()} <span className="text-sm font-normal text-muted">{game.unit}</span>
          </dd>
        </div>
        <div className="rounded-xl bg-surface-2 px-3 py-2.5">
          <dt className="text-xs text-muted">Usual range</dt>
          <dd className="mt-0.5 whitespace-nowrap text-base font-semibold sm:text-lg">
            {band ? (
              <>
                {Math.round(band.low).toLocaleString()}–{Math.round(band.high).toLocaleString()}
              </>
            ) : (
              <span className="whitespace-normal text-sm font-normal text-muted">
                {usual.ready ? "" : `${usual.needed} more round${usual.needed === 1 ? "" : "s"}`}
              </span>
            )}
          </dd>
        </div>
        <div className="rounded-xl bg-surface-2 px-3 py-2.5">
          <dt className="text-xs text-muted">Rounds</dt>
          <dd className="mt-0.5 text-lg font-semibold">{entries.length}</dd>
        </div>
      </dl>

      {latestVsUsual.status === "ready" && (
        <p className="mb-4 text-sm">
          <span
            className={cx(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold",
              bandStyles[latestVsUsual.band].tone
            )}
          >
            {React.createElement(bandStyles[latestVsUsual.band].icon, { size: 14, "aria-hidden": true })}
            Latest round: {bandStyles[latestVsUsual.band].label.toLowerCase()}
          </span>
        </p>
      )}

      <ProgressChart entries={shown} band={band} unit={game.unit} title={title} />

      <details className="mt-4 text-sm">
        <summary className="focus-ring cursor-pointer rounded font-medium text-muted hover:text-ink">
          Show as table
        </summary>
        <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-line">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-surface-2 text-xs text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 text-right font-medium">Result</th>
                {game.id === "alertness" && <th className="px-3 py-2 text-right font-medium">Lapses</th>}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {[...entries].reverse().map((e) => (
                <tr key={e.t} className="border-t border-line">
                  <td className="px-3 py-2 text-muted">
                    {formatDate(e.t)},{" "}
                    {new Date(e.t).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {e.v.toLocaleString()} {game.unit}
                  </td>
                  {game.id === "alertness" && (
                    <td className="px-3 py-2 text-right">{e.x?.lapses ?? "—"}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </article>
  )
}

const ProgressPage = () => {
  const [tracks, setTracks] = useState<Track[] | null>(null)
  const [device, setDevice] = useState<Device>("mouse")

  useEffect(() => {
    setDevice(currentDevice())
    const load = () => setTracks(loadTracks())
    load()
    return onHistoryChange(load)
  }, [])

  const devices = new Set(tracks?.flatMap((t) => t.entries.map((e) => e.d)) ?? [])
  const activeDevice: Device = devices.has(device) ? device : devices.has("touch") ? "touch" : "mouse"
  const visible = (tracks ?? [])
    .map((t) => ({ ...t, entries: t.entries.filter((e) => e.d === activeDevice) }))
    .filter((t) => t.entries.length > 0)

  const clear = () => {
    if (window.confirm("Delete all saved results from this browser? Best scores are kept.")) {
      clearAllHistory()
    }
  }

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

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight">Your progress</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Each result is compared with your own usual range from earlier rounds on
          the same device. Everything is stored only in this browser.
        </p>

        {devices.size > 1 && (
          <div className="mt-6 max-w-xs">
            <SegmentedControl<Device>
              label="Device"
              value={activeDevice}
              onChange={setDevice}
              options={[
                { value: "mouse", label: "Mouse & keyboard" },
                { value: "touch", label: "Touch" },
              ]}
            />
          </div>
        )}

        <div className="mt-8 space-y-5">
          {tracks === null ? (
            <div className="h-64 animate-pulse rounded-2xl bg-surface-2" />
          ) : visible.length === 0 ? (
            <div className="rounded-2xl border border-line bg-surface p-8 text-center">
              <h2 className="text-lg font-semibold">No results yet</h2>
              <p className="mx-auto mt-2 max-w-sm text-muted">
                Finish a few rounds of any game and your history will show up
                here. The Alertness Check is the best way to track how sharp you
                are day to day.
              </p>
              <div className="mt-6 flex justify-center">
                <ButtonLink href="/alertness">Take the Alertness Check</ButtonLink>
              </div>
            </div>
          ) : (
            visible.map((track) => <TrackCard key={track.key} track={track} />)
          )}
        </div>

        {visible.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Button variant="ghost" size="md" onClick={clear}>
              <Trash2 size={16} aria-hidden />
              Clear history
            </Button>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

export default ProgressPage
