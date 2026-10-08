"use client"

import { Trophy } from "lucide-react"
import { formatScore, getGame } from "@/libs/games"
import { useBestScore } from "@/libs/useBestScore"

const BestScore = ({ gameId }: { gameId: string }) => {
  const game = getGame(gameId)
  const { best } = useBestScore(game.bestKey)

  if (best === null) return <span className="text-muted">Not played yet</span>

  return (
    <span className="inline-flex items-center gap-1.5">
      <Trophy size={14} className="text-brand-ink" aria-hidden />
      <span className="font-medium tabular-nums">
        {formatScore(game.format, best, game.formatTotal)}
      </span>
      {game.bestMode && <span className="text-muted">· {game.bestMode}</span>}
    </span>
  )
}

export default BestScore
