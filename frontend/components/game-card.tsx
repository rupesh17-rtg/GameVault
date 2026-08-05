'use client'

import { Edit2, Trash2, CheckCircle2 } from 'lucide-react'

interface GameCardProps {
  id: string
  title: string
  platform: string
  completed: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function GameCard({
  id,
  title,
  platform,
  completed,
  onEdit,
  onDelete,
}: GameCardProps) {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className={`text-lg font-bold transition-colors ${completed ? 'line-through text-foreground/45' : 'text-foreground'}`}>
            {title}
          </h3>
        </div>
        {completed && <CheckCircle2 size={22} className="text-foreground flex-shrink-0" />}
      </div>

      <div className="flex items-center gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-semibold border border-foreground/10 bg-foreground/5 text-foreground/80">
          {platform}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={() => onEdit(id)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/80 hover:text-foreground transition-all duration-200 flex-1 justify-center border border-foreground/10 cursor-pointer"
        >
          <Edit2 size={15} />
          <span className="text-sm font-semibold">Edit</span>
        </button>
        <button
          onClick={() => onDelete(id)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/15 text-foreground/80 hover:text-foreground transition-all duration-200 flex-1 justify-center border border-foreground/10 cursor-pointer"
        >
          <Trash2 size={15} />
          <span className="text-sm font-semibold">Delete</span>
        </button>
      </div>
    </div>
  )
}