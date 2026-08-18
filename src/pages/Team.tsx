import { useProfiles } from '../hooks/useProfiles'
import { usePresence, type PresenceStatus } from '../hooks/usePresence'
import { Avatar } from '../components/layout/Avatar'

const STATUS_TEXT: Record<PresenceStatus | 'offline', string> = {
  online: 'Online',
  away: 'Away',
  offline: 'Offline',
}

export function Team() {
  const { profiles, loading } = useProfiles()
  const presence = usePresence()
  const claimed = profiles.filter((p) => p.claimed)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Team</h1>
        <p className="text-sm text-slate-500">Everyone who's signed up so far.</p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : claimed.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No one has signed up yet. Share the app URL with your co-founders to get started.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {claimed.map((p) => {
            const status = presence[p.id]
            return (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
              >
                <Avatar profile={p} size="lg" status={status} />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-500">
                    {p.role === 'admin' ? 'Admin' : 'Member'} · {STATUS_TEXT[status ?? 'offline']}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
