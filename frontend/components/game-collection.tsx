'use client'

import { GameCard } from './game-card'

interface Game {
  id: string
  title: string
  platform: string
  completed: boolean
}

interface GameCollectionProps {
  games: Game[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function GameCollection({ games, onEdit, onDelete }: GameCollectionProps) {
  if (games.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="text-4xl mb-4">🎮</div>
        <p className="text-foreground/60 text-lg">
          No games yet. Add your first game to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {games.map((game) => (
        <GameCard
          key={game.id}
          id={game.id}
          title={game.title}
          platform={game.platform}
          completed={game.completed}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}