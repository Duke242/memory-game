"use client"

import React, { useEffect, useRef, useState } from "react"
import type { HistoryEntry } from "@/libs/history"

const HEIGHT = 180
const PAD = { top: 12, right: 64, bottom: 28, left: 44 }

const niceStep = (range: number, target: number) => {
  const raw = range / target
  const pow = 10 ** Math.floor(Math.log10(raw || 1))
  const n = raw / pow
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow
}

export const formatDate = (t: number) =>
  new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" })

const formatDateTime = (t: number) =>
  new Date(t).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

/** Line chart of a game's recent rounds over the player's usual range. */
const ProgressChart = ({
  entries,
  band,
  unit,
  title,
}: {
  entries: HistoryEntry[]
  band: { low: number; high: number } | null
  unit: string
  title: string
}) => {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const values = entries.map((e) => e.v)
  const domainValues = band ? [...values, band.low, band.high] : values
  let min = Math.min(...domainValues)
  let max = Math.max(...domainValues)
  if (min === max) {
    min -= 1
    max += 1
  }
  // Whole-number scores get whole-number ticks.
  const integers = values.every(Number.isInteger)
  const step = integers
    ? Math.max(1, niceStep(max - min, 3))
    : niceStep(max - min, 3)
  min = Math.max(0, Math.floor(min / step) * step)
  max = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let v = min; v <= max + step / 2; v += step)
    ticks.push(Math.round(v * 100) / 100)

  const plotW = Math.max(0, width - PAD.left - PAD.right)
  const plotH = HEIGHT - PAD.top - PAD.bottom
  const x = (i: number) =>
    PAD.left +
    (entries.length === 1 ? plotW / 2 : (i / (entries.length - 1)) * plotW)
  const y = (v: number) => PAD.top + plotH - ((v - min) / (max - min)) * plotH

  const path = entries
    .map((e, i) => `${i ? "L" : "M"}${x(i)},${y(e.v)}`)
    .join(" ")
  const last = entries.length - 1

  const pick = (clientX: number) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect || entries.length === 0) return
    const px = clientX - rect.left
    let nearest = 0
    entries.forEach((_, i) => {
      if (Math.abs(x(i) - px) < Math.abs(x(nearest) - px)) nearest = i
    })
    setActive(nearest)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault()
      const delta = e.key === "ArrowLeft" ? -1 : 1
      setActive((a) => Math.max(0, Math.min(last, (a ?? last) + delta)))
    } else if (e.key === "Escape") {
      setActive(null)
    }
  }

  const activeEntry = active !== null ? entries[active] : null
  const tooltipLeft =
    active !== null ? Math.min(Math.max(x(active), 70), width - 70) : 0

  return (
    <div>
      <div
        ref={wrapRef}
        tabIndex={0}
        role="img"
        aria-label={`${title}: ${entries.length} rounds, latest ${values[last]} ${unit}${
          band
            ? `, usual range ${Math.round(band.low)} to ${Math.round(band.high)} ${unit}`
            : ""
        }. Use the arrow keys to read each round.`}
        onPointerMove={(e) => pick(e.clientX)}
        onPointerLeave={() => setActive(null)}
        onFocus={() => setActive((a) => a ?? last)}
        onBlur={() => setActive(null)}
        onKeyDown={onKeyDown}
        className="focus-ring relative rounded-lg outline-none"
        style={{ height: HEIGHT }}
      >
        {width > 0 && (
          <svg
            width={width}
            height={HEIGHT}
            className="block overflow-visible"
            aria-hidden
          >
            {/* Grid + y ticks */}
            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={PAD.left}
                  x2={PAD.left + plotW}
                  y1={y(t)}
                  y2={y(t)}
                  stroke="rgb(var(--mm-line))"
                  strokeWidth={1}
                />
                <text
                  x={PAD.left - 8}
                  y={y(t)}
                  dy="0.32em"
                  textAnchor="end"
                  className="fill-muted text-[11px] tabular-nums"
                >
                  {t.toLocaleString()}
                </text>
              </g>
            ))}

            {/* Usual range */}
            {band && (
              <g>
                <rect
                  x={PAD.left}
                  width={plotW}
                  y={y(Math.max(band.low, band.high))}
                  height={Math.max(2, Math.abs(y(band.low) - y(band.high)))}
                  fill="rgb(var(--mm-brand) / 0.1)"
                />
              </g>
            )}

            {/* X axis labels: first and last round */}
            {entries.length > 0 && (
              <>
                <text
                  x={x(0)}
                  y={HEIGHT - 8}
                  textAnchor={entries.length === 1 ? "middle" : "start"}
                  className="fill-muted text-[11px]"
                >
                  {formatDate(entries[0].t)}
                </text>
                {entries.length > 1 && (
                  <text
                    x={x(last)}
                    y={HEIGHT - 8}
                    textAnchor="end"
                    className="fill-muted text-[11px]"
                  >
                    {formatDate(entries[last].t)}
                  </text>
                )}
              </>
            )}

            {/* Crosshair */}
            {active !== null && (
              <line
                x1={x(active)}
                x2={x(active)}
                y1={PAD.top}
                y2={PAD.top + plotH}
                stroke="rgb(var(--mm-muted) / 0.5)"
                strokeWidth={1}
              />
            )}

            {/* Line + markers */}
            <path
              d={path}
              fill="none"
              stroke="rgb(var(--mm-brand))"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {entries.map((e, i) => (
              <circle
                key={e.t}
                cx={x(i)}
                cy={y(e.v)}
                r={i === active ? 5.5 : 4}
                fill="rgb(var(--mm-brand))"
                stroke="rgb(var(--mm-surface))"
                strokeWidth={2}
              />
            ))}

            {/* Latest value */}
            {entries.length > 0 && (
              <text
                x={x(last) + 10}
                y={y(values[last])}
                dy="0.32em"
                className="fill-ink text-xs font-semibold tabular-nums"
              >
                {values[last].toLocaleString()}
                <tspan className="fill-muted font-normal"> {unit}</tspan>
              </text>
            )}
          </svg>
        )}

        {activeEntry && (
          <div
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-md"
            style={{ left: tooltipLeft }}
          >
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-3 rounded-full bg-brand" aria-hidden />
              <span className="text-sm font-semibold text-ink">
                {activeEntry.v.toLocaleString()} {unit}
              </span>
            </div>
            <div className="mt-0.5 text-muted">
              {formatDateTime(activeEntry.t)}
            </div>
            {activeEntry.x?.lapses !== undefined && (
              <div className="text-muted">
                {activeEntry.x.lapses} lapse
                {activeEntry.x.lapses === 1 ? "" : "s"}
              </div>
            )}
          </div>
        )}
      </div>
      {band && (
        <p className="mt-2 flex items-center gap-2 text-xs text-muted">
          <span
            className="h-3 w-5 rounded-sm bg-brand/10 ring-1 ring-inset ring-brand/20"
            aria-hidden
          />
          Your usual range
        </p>
      )}
    </div>
  )
}

export default ProgressChart
