import { useEffect, useRef, useState } from 'react'
import type { Profile } from '../../types'
import { usePresence } from '../../hooks/usePresence'
import { Avatar } from '../layout/Avatar'

export function AssigneePicker({
  profiles,
  selectedIds,
  onToggle,
}: {
  profiles: Profile[]
  selectedIds: string[]
  onToggle: (profileId: string, assign: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const presence = usePresence()

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const claimed = profiles.filter((p) => p.claimed)
  const selected = claimed.filter((p) => selectedIds.includes(p.id))

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md border border-slate-300 px-2 py-1 text-sm hover:border-accent"
      >
        {selected.length === 0 ? (
          <span className="text-slate-400">Unassigned</span>
        ) : (
          <div className="flex -space-x-1.5">
            {selected.map((p) => (
              <Avatar key={p.id} profile={p} size="sm" />
            ))}
          </div>
        )}
        <svg viewBox="0 0 12 8" className="h-2 w-2.5 shrink-0 text-slate-400" fill="none">
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-44 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg">
          {claimed.length === 0 ? (
            <p className="px-2 py-1.5 text-xs text-slate-400">No teammates yet</p>
          ) : (
            claimed.map((p) => {
              const isSelected = selectedIds.includes(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onToggle(p.id, !isSelected)}
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-slate-50 ${
                    isSelected ? 'bg-accent-light' : ''
                  }`}
                >
                  <Avatar profile={p} size="sm" status={presence[p.id]} />
                  <span className="flex-1 truncate text-slate-700">{p.name}</span>
                  {isSelected && (
                    <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 shrink-0 text-accent" fill="none">
                      <path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
