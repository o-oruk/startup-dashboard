import { useState, type FormEvent } from 'react'
import type { Objective } from '../../types'

export function ObjectiveTabs({
  objectives,
  activeId,
  onSelect,
  onAdd,
  onDelete,
}: {
  objectives: Objective[]
  activeId: string | null
  onSelect: (id: string) => void
  onAdd: (title: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    await onAdd(title.trim())
    setTitle('')
    setAdding(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
      {objectives.map((obj) => (
        <div key={obj.id} className="group relative">
          <button
            onClick={() => onSelect(obj.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeId === obj.id
                ? 'bg-accent text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {obj.title}
          </button>
          <button
            onClick={() => void onDelete(obj.id)}
            aria-label={`Delete ${obj.title}`}
            className={`absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-slate-400 text-[10px] leading-none text-white hover:bg-red-500 group-hover:flex ${
              activeId === obj.id ? 'flex' : ''
            }`}
          >
            ×
          </button>
        </div>
      ))}

      {adding ? (
        <form onSubmit={handleAdd} className="flex items-center gap-1">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => !title.trim() && setAdding(false)}
            placeholder="New objective title"
            className="rounded-full border border-slate-300 px-3 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-accent"
          />
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-500 hover:border-accent hover:text-accent"
        >
          + Objective
        </button>
      )}
    </div>
  )
}
