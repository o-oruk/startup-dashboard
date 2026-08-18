import { useState } from 'react'
import type { Profile } from '../../types'
import type { PresenceStatus } from '../../hooks/usePresence'
import { Avatar } from '../layout/Avatar'

const STATUS_TEXT: Record<PresenceStatus, string> = {
  online: 'Online now',
  away: 'Away',
  offline: 'Offline',
}

const STATUS_DOT: Record<PresenceStatus, string> = {
  online: 'bg-emerald-500',
  away: 'bg-amber-400',
  offline: 'bg-slate-300',
}

export function MemberModal({
  profile,
  status,
  canEdit,
  onSaveName,
  onClose,
}: {
  profile: Profile
  status: PresenceStatus
  canEdit: boolean
  onSaveName: (name: string) => Promise<void>
  onClose: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile.name)
  const [busy, setBusy] = useState(false)

  async function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) {
      setName(profile.name)
      setEditing(false)
      return
    }
    if (trimmed === profile.name) {
      setEditing(false)
      return
    }
    setBusy(true)
    try {
      await onSaveName(trimmed)
      setEditing(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex justify-end">
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <Avatar profile={profile} size="lg" />
          <h3 className="mt-3 text-base font-semibold text-slate-900">{profile.name}</h3>
          <span className="mt-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {profile.role === 'admin' ? 'Admin' : 'Member'}
          </span>
          <span className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
            {STATUS_TEXT[status]}
          </span>
        </div>

        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Username</p>
              {canEdit && !editing && (
                <button
                  onClick={() => {
                    setName(profile.name)
                    setEditing(true)
                  }}
                  className="text-xs font-medium text-accent hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            {editing ? (
              <div className="mt-1 flex items-center gap-1.5">
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="min-w-0 flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm focus-visible:ring-2 focus-visible:ring-accent"
                />
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={busy}
                  className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-white hover:bg-accent/90 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="mt-0.5 text-sm text-slate-800">{profile.name}</p>
            )}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Email</p>
            {profile.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="mt-0.5 block truncate text-sm text-accent hover:underline"
              >
                {profile.email}
              </a>
            ) : (
              <p className="mt-0.5 text-sm text-slate-400">Not available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
