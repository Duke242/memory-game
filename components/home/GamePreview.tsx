import React from "react"
import { Heart, Star } from "lucide-react"
import { cx } from "@/components/game/ui"

// Small static illustrations of each game, drawn with the design tokens so
// they follow light and dark mode.
const Grid = ({ size, lit }: { size: number; lit: number[] }) => (
  <div
    className="grid w-24 gap-1.5"
    style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
  >
    {Array.from({ length: size * size }, (_, i) => (
      <span
        key={i}
        className={cx(
          "aspect-square rounded-md",
          lit.includes(i) ? "bg-brand" : "bg-surface"
        )}
      />
    ))}
  </div>
)

const previews: Record<string, () => React.ReactElement> = {
  sequence: () => (
    <div className="relative">
      <Grid size={3} lit={[4]} />
      <span className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-semibold text-canvas">
        3
      </span>
    </div>
  ),
  "card-match": () => (
    <div className="flex gap-2">
      <span className="flex h-16 w-12 items-center justify-center rounded-lg border border-line bg-surface text-brand-ink">
        <Star size={20} aria-hidden />
      </span>
      <span className="h-16 w-12 rounded-lg bg-brand" />
      <span className="flex h-16 w-12 items-center justify-center rounded-lg border border-line bg-surface text-brand-ink">
        <Heart size={20} aria-hidden />
      </span>
      <span className="h-16 w-12 rounded-lg bg-brand" />
    </div>
  ),
  "word-recall": () => (
    <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
      {["Anchor", "Violin", "Tulip", "Wagon"].map((w, i) => (
        <span
          key={w}
          className={cx(
            "rounded-md px-3 py-1.5 text-center",
            i === 1 ? "bg-brand text-white" : "bg-surface text-ink"
          )}
        >
          {w}
        </span>
      ))}
    </div>
  ),
  number: () => (
    <span className="rounded-lg bg-surface px-4 py-2 font-mono text-2xl font-semibold tracking-[0.2em]">
      4 8 1 5 9
    </span>
  ),
  box: () => <Grid size={4} lit={[1, 6, 8, 15]} />,
  anagrams: () => (
    <div className="flex gap-1.5">
      {"PLANET".split("").map((l, i) => (
        <span
          key={i}
          className={cx(
            "flex h-9 w-9 items-center justify-center rounded-md text-base font-semibold",
            i < 4 ? "bg-surface" : "bg-brand text-white"
          )}
        >
          {l}
        </span>
      ))}
    </div>
  ),
}

const GamePreview = ({ id }: { id: string }) => {
  const Preview = previews[id]
  return (
    <div
      aria-hidden
      className="flex h-36 items-center justify-center bg-surface-2 transition-colors duration-200 group-hover:bg-brand-soft"
    >
      {Preview && <Preview />}
    </div>
  )
}

export default GamePreview
