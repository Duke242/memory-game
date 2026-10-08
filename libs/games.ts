import type { LucideIcon } from "lucide-react"
import { Binary, Grid3x3, Shuffle, Workflow, Layers, ListChecks } from "lucide-react"

export type ScoreFormat = "digits" | "boxes" | "points" | "level" | "moves" | "words"

export interface GameMeta {
  id: string
  title: string
  href: string
  skill: string
  description: string
  icon: LucideIcon
  /** localStorage key suffix of the best score shown on the home page. */
  bestKey: string
  /** Label for the mode the home-page best score belongs to, if the game has several. */
  bestMode?: string
  format: ScoreFormat
  /** Total for formats shown as "x of y" (word recall). */
  formatTotal?: number
  isNew?: boolean
}

export const games: GameMeta[] = [
  {
    id: "sequence",
    title: "Sequence Memory",
    href: "/sequence",
    skill: "Sequence memory",
    description:
      "Tiles light up one after another. Repeat the pattern. It grows by one every round.",
    icon: Workflow,
    bestKey: "sequence",
    format: "level",
    isNew: true,
  },
  {
    id: "card-match",
    title: "Card Match",
    href: "/card-match",
    skill: "Visual memory",
    description:
      "Flip cards two at a time and find every pair in as few moves as you can.",
    icon: Layers,
    bestKey: "card-match:medium",
    bestMode: "4×4",
    format: "moves",
    isNew: true,
  },
  {
    id: "word-recall",
    title: "Word Recall",
    href: "/word-recall",
    skill: "Verbal memory",
    description:
      "Study a list of words, then type back as many as you can remember.",
    icon: ListChecks,
    bestKey: "word-recall:15",
    bestMode: "15 words",
    format: "words",
    formatTotal: 15,
    isNew: true,
  },
  {
    id: "number",
    title: "Number Memory",
    href: "/game",
    skill: "Short-term memory",
    description:
      "Memorize a number before it disappears. Each correct answer adds a digit.",
    icon: Binary,
    bestKey: "number",
    format: "digits",
  },
  {
    id: "box",
    title: "Box Memory",
    href: "/box-game",
    skill: "Spatial memory",
    description:
      "Remember which squares lit up on the grid, then pick them all out.",
    icon: Grid3x3,
    bestKey: "box",
    format: "boxes",
  },
  {
    id: "anagrams",
    title: "Anagrams",
    href: "/anagrams",
    skill: "Word skills",
    description:
      "Make as many words as you can from six letters before the minute runs out.",
    icon: Shuffle,
    bestKey: "anagrams",
    format: "points",
  },
]

export const getGame = (id: string): GameMeta => {
  const game = games.find((g) => g.id === id)
  if (!game) throw new Error(`Unknown game: ${id}`)
  return game
}

const plural = (n: number, one: string, many: string) =>
  `${n.toLocaleString()} ${n === 1 ? one : many}`

export const formatScore = (
  format: ScoreFormat,
  value: number,
  total?: number
): string => {
  switch (format) {
    case "digits":
      return plural(value, "digit", "digits")
    case "boxes":
      return plural(value, "box", "boxes")
    case "points":
      return plural(value, "pt", "pts")
    case "level":
      return `Level ${value}`
    case "moves":
      return plural(value, "move", "moves")
    case "words":
      return total ? `${value} / ${total} words` : plural(value, "word", "words")
  }
}
