import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useProfiles } from '../hooks/useProfiles'
import { usePresence } from '../hooks/usePresence'
import { Avatar } from '../components/layout/Avatar'
import { ColorSwatchPicker } from '../components/shared/ColorSwatchPicker'

export function MyProfile() {
  const { profile, refreshProfile } = useAuth()
  const { profiles, updateProfile } = useProfiles()
  const presence = usePresence()

  const [name, setName] = useState(profile?.name ?? '')
  const [initials, setInitials] = useState(profile?.initials ?? '')
  const [color, setColor] = useState(profile?.color ?? '')
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!profile) return null

  const otherColors = profiles.filter((p) => p.claimed && p.id !== profile.id).map((p) => p.color)
  const status = presence[profile.id] ?? 'offline'
  const dirty = name.trim() !== profile.name || initials.trim().toUpperCase() !== profile.initials || color !== profile.color

  async function handleSave() {
    if (!profile) return
    const trimmedName = name.trim() || profile.name
    const trimmedInitials = initials.trim().slice(0, 2).toUpperCase() || profile.initials
    setBusy(true)
    setSaved(false)
    try {
      await updateProfile(profile.id, { name: trimmedName, initials: trimmedInitials, color })
      await refreshProfile()
      setSaved(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">My profile</h1>
        <p className="text-sm text-slate-500">This is how you show up everywhere in the dashboard.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <Avatar profile={{ name, initials, color }} size="lg" status={status} />
          <div>
            <p className="text-base font-semibold text-slate-900">{profile.name}</p>
            <p className="text-sm text-slate-500">
              {profile.role === 'admin' ? 'Admin' : 'Member'} ·{' '}
              {status === 'online' ? 'Online now' : status === 'away' ? 'Away' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-slate-100 pt-5">
          <div>
            <label htmlFor="my-name" className="block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              id="my-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="my-initials" className="block text-sm font-medium text-slate-700">
              Initials
            </label>
            <input
              id="my-initials"
              value={initials}
              onChange={(e) => setInitials(e.target.value)}
              maxLength={2}
              className="mt-1 w-24 rounded-md border border-slate-300 px-3 py-2 text-sm uppercase focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <div>
            <p className="block text-sm font-medium text-slate-700">Color</p>
            <div className="mt-1">
              <ColorSwatchPicker value={color} onChange={setColor} takenColors={otherColors} />
            </div>
          </div>

          <div>
            <p className="block text-sm font-medium text-slate-700">Email</p>
            <p className="mt-1 text-sm text-slate-500">{profile.email ?? 'Not available'}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
          <button
            onClick={handleSave}
            disabled={busy || !dirty}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Save changes'}
          </button>
          {saved && !dirty && <span className="text-sm text-emerald-600">Saved</span>}
        </div>
      </div>
    </div>
  )
}
