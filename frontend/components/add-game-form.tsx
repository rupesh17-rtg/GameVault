'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

interface AddGameFormProps {
  onAddGame: (game: {
    title: string
    platform: string
    completed: boolean
  }) => void
}

export function AddGameForm({ onAddGame }: AddGameFormProps) {
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState('PC')
  const [completed, setCompleted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddGame({
        title,
        platform,
        completed,
      })
      setTitle('')
      setPlatform('PC')
      setCompleted(false)
    }
  }

  return (
    <div className="glass-card p-6 w-full">
      <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
        <span>🎮</span> Add New Game
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-foreground/70 text-xs font-medium mb-1.5">
            Game Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Elden Ring..."
            className="glass-input w-full py-2.5 px-3.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-foreground/70 text-xs font-medium mb-1.5">
            Platform
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="glass-input w-full appearance-none cursor-pointer py-2.5 px-3.5 text-sm"
          >
            <option value="PC">PC</option>
            <option value="PlayStation">PlayStation</option>
            <option value="Xbox">Xbox</option>
            <option value="Nintendo Switch">Nintendo Switch</option>
          </select>
        </div>

        <div className="flex items-center pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
            />
            <span className="text-foreground/70 text-sm">Completed</span>
          </label>
        </div>

        <button
          type="submit"
          className="glow-button w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 mt-2 cursor-pointer"
        >
          <Plus size={16} />
          Add to Collection
        </button>
      </form>
    </div>
  )
}