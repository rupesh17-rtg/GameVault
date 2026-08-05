'use client'

import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'

interface Game {
  id: string
  title: string
  platform: string
  completed: boolean
}

interface EditGameModalProps {
  game: Game | null
  onClose: () => void
  onSave: (id: string, updatedFields: Omit<Game, 'id'>) => Promise<void>
}

export function EditGameModal({ game, onClose, onSave }: EditGameModalProps) {
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState('PC')
  const [completed, setCompleted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (game) {
      setTitle(game.title)
      setPlatform(game.platform)
      setCompleted(game.completed)
    }
  }, [game])

  if (!game) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSaving(true)
    try {
      await onSave(game.id, {
        title: title.trim(),
        platform,
        completed,
      })
      onClose()
    } catch (err) {
      console.error('Failed to update game:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
      <div className="glass-card w-full max-w-lg p-8 relative flex flex-col gap-6 shadow-2xl border border-foreground/10 animate-fade-in animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
          <h2 className="text-2xl font-black text-foreground tracking-tight">
            Edit Game
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-foreground/5 rounded-lg text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-foreground/80 text-sm font-medium mb-2">
              Game Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter game title..."
              className="glass-input w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-foreground/80 text-sm font-medium mb-2">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="glass-input w-full appearance-none cursor-pointer"
              >
                <option value="PC">PC</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
                <option value="Nintendo Switch">Nintendo Switch</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer pb-3">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
                />
                <span className="text-foreground/80 font-medium">Completed</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-foreground/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-foreground/5 hover:bg-foreground/10 text-foreground/80 hover:text-foreground transition-colors font-semibold border border-foreground/10 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="glow-button px-6 py-2.5 flex items-center gap-2 disabled:opacity-55 cursor-pointer"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}