import React from "react"
import Link from "next/link"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import type { Comparison } from "@/libs/history"
import { WARMUP_ROUNDS, MIN_BASELINE_ROUNDS } from "@/libs/history"
import { cx } from "@/components/game/ui"

const TOTAL = WARMUP_ROUNDS + MIN_BASELINE_ROUNDS

/** Shows how a finished round compares with the player's usual range. */
const BaselineNote = ({
  comparison,
  unit,
}: {
  comparison: Comparison | null
  /** Unit shown after the usual range, e.g. "digits" or "ms". */
  unit: string
}) => {
  if (!comparison) return null

  if (comparison.status === "warming-up") {
    // `needed` counts from before this round; this round has now been saved too.
    const remaining = Math.max(0, comparison.needed - 1)
    const done = TOTAL - remaining
    return (
      <div className="rounded-xl bg-surface-2 p-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium">Building your baseline</span>
          <span className="tabular-nums text-muted">
            {done} / {TOTAL} rounds
          </span>
        </div>
        <div className="mt-3 flex gap-1" aria-hidden>
          {Array.from({ length: TOTAL }, (_, i) => (
            <span
              key={i}
              className={cx("h-1.5 flex-1 rounded-full", i < done ? "bg-brand" : "bg-line")}
            />
          ))}
        </div>
        <p className="mt-3 text-muted">
          {remaining === 0
            ? "From your next round on this device, we'll tell you whether a result is better than, within or weaker than your usual."
            : `After ${remaining} more round${remaining === 1 ? "" : "s"} on this device, we'll tell you whether a result is better than, within or weaker than your usual.`}
        </p>
      </div>
    )
  }

  const { band, low, high } = comparison
  const lo = Math.max(0, Math.round(Math.min(low, high))).toLocaleString()
  const hi = Math.round(Math.max(low, high)).toLocaleString()
  const content: Record<
    "above" | "within" | "below",
    { icon: typeof Minus; title: string; tone: string; note: string | null }
  > = {
    above: {
      icon: ArrowUpRight,
      title: "Better than your usual",
      tone: "bg-good-soft text-good",
      note: null,
    },
    within: {
      icon: Minus,
      title: "Within your usual range",
      tone: "bg-brand-soft text-brand-ink",
      note: null,
    },
    below: {
      icon: ArrowDownRight,
      title: "Weaker than your usual",
      tone: "bg-bad-soft text-bad",
      note: "One round can be off. Tiredness, distraction or a different device can all play a part.",
    },
  }
  const { icon: Icon, title, tone, note } = content[band]

  return (
    <div className="rounded-xl bg-surface-2 p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={cx(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold",
            tone
          )}
        >
          <Icon size={14} aria-hidden />
          {title}
        </span>
        <span className="tabular-nums text-muted">
          Usual: {lo === hi ? lo : `${lo}–${hi}`} {unit}
        </span>
      </div>
      {note && <p className="mt-3 text-muted">{note}</p>}
      <p className="mt-3">
        <Link href="/progress" className="focus-ring rounded font-medium text-brand-ink hover:underline">
          See your progress →
        </Link>
      </p>
    </div>
  )
}

export default BaselineNote
