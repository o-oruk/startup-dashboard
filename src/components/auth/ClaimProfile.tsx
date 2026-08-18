import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useProfiles } from '../../hooks/useProfiles'
import { Avatar } from '../layout/Avatar'
import { ColorSwatchPicker } from '../shared/ColorSwatchPicker'
import { MEMBER_PALETTE } from '../../lib/color'

function initialsFromName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function ClaimProfile() {
  const { session, refreshProfile } = useAuth()
  const { profiles, loading: profilesLoading } = useProfiles()
  const [name, setName] = useState('')
  const [initials, setInitials] = useState('')
  const [color, setColor] = useState<string>(MEMBER_PALETTE[0])
  const [colorTouched, setColorTouched] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // Pre-fill from what was typed on the signup form, so no one has to retype their name here.
  useEffect(() => {
    const username = (session?.user.user_metadata?.username as string | undefined)?.trim()
    if (username) {
      setName(username)
      setInitials(initialsFromName(username))
    }
  }, [session])

  const takenColors = profiles.filter((p) => p.claimed).map((p) => p.color)
  const currentAdmin = profiles.find((p) => p.claimed && p.role === 'admin')
  const adminTaken = !!currentAdmin

  // Default to the first color nobody's using yet, instead of always red, so
  // hitting Save without touching the picker can never collide with a teammate.
  useEffect(() => {
    if (profilesLoading || colorTouched) return
    const takenSet = new Set(takenColors.map((c) => c.toUpperCase()))
    const available = MEMBER_PALETTE.find((swatch) => !takenSet.has(swatch.toUpperCase()))
    if (available) setColor(available)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profilesLoading])

  async function handleSave() {
    if (!session) return
    setError(null)
    if (!name.trim()) {
      setError('Give yourself a name.')
      return
    }
    if (!initials.trim()) {
      setError('Add 1-2 initials.')
      return
    }
    setBusy(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: name.trim(),
          initials: initials.trim().slice(0, 2).toUpperCase(),
          color,
          role: isAdmin && !adminTaken ? 'admin' : 'member',
          claimed: true,
        })
        .eq('id', session.user.id)
      if (error) throw error
      await refreshProfile()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your profile.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Welcome, {name || 'there'} 👋</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pick a color below — each teammate gets a unique one, used everywhere you show up in the
          dashboard.
        </p>

        {!profilesLoading && (
          <div className="mt-5">
            <ColorSwatchPicker
              value={color}
              onChange={(c) => {
                setColor(c)
                setColorTouched(true)
              }}
              takenColors={takenColors}
            />
          </div>
        )}

        {!profilesLoading && (
          <label
            className={`mt-4 flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
              adminTaken ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400' : 'border-slate-200'
            }`}
          >
            <input
              type="checkbox"
              checked={isAdmin && !adminTaken}
              disabled={adminTaken}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-accent focus-visible:ring-2 focus-visible:ring-accent"
            />
            {adminTaken
              ? `Admin is already assigned to ${currentAdmin?.name}`
              : "I'm the admin (can create/delete objectives)"}
          </label>
        )}

        <div className="mt-5 space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-accent"
              placeholder="e.g. Omar"
            />
          </div>
          <div>
            <label htmlFor="initials" className="block text-sm font-medium text-slate-700">
              Initials
            </label>
            <input
              id="initials"
              value={initials}
              onChange={(e) => setInitials(e.target.value)}
              maxLength={2}
              className="mt-1 w-24 rounded-md border border-slate-300 px-3 py-2 text-sm uppercase focus-visible:ring-2 focus-visible:ring-accent"
              placeholder="OM"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-md bg-slate-50 p-3">
          <Avatar profile={{ name, initials, color }} size="lg" />
          <span className="text-sm text-slate-500">This is how you'll appear to the team.</span>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          onClick={handleSave}
          disabled={busy}
          className="mt-5 w-full rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-60"
        >
          {busy ? 'Saving…' : 'Save and continue'}
        </button>
      </div>
    </div>
  )
}
