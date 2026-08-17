import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useProfiles } from '../../hooks/useProfiles'
import { Avatar } from '../layout/Avatar'
import { PROFILE_PRESETS } from '../../types'

export function ClaimProfile() {
  const { session, refreshProfile } = useAuth()
  const { profiles, loading: profilesLoading } = useProfiles()
  const [name, setName] = useState('')
  const [initials, setInitials] = useState('')
  const [color, setColor] = useState<string>(PROFILE_PRESETS[0].color)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const takenNames = new Set(profiles.filter((p) => p.claimed).map((p) => p.name))

  function pickPreset(preset: (typeof PROFILE_PRESETS)[number]) {
    setName(preset.name)
    setInitials(preset.initials)
    setColor(preset.color)
  }

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
      const role = name.trim() === 'Founder' ? 'founder' : 'member'
      const { error } = await supabase
        .from('profiles')
        .update({
          name: name.trim(),
          initials: initials.trim().slice(0, 2).toUpperCase(),
          color,
          role,
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
        <h1 className="text-xl font-semibold text-slate-900">Welcome — who are you?</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pick your spot below, or customize your name, initials and color. This is how you'll show
          up everywhere in the dashboard.
        </p>

        {!profilesLoading && (
          <div className="mt-5 grid grid-cols-2 gap-2">
            {PROFILE_PRESETS.map((preset) => {
              const taken = takenNames.has(preset.name)
              return (
                <button
                  key={preset.name}
                  type="button"
                  disabled={taken}
                  onClick={() => pickPreset(preset)}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                    taken
                      ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300'
                      : name === preset.name
                        ? 'border-accent bg-accent-light'
                        : 'border-slate-200 hover:border-accent'
                  }`}
                >
                  <Avatar profile={preset} size="sm" />
                  <span>{taken ? `${preset.name} (taken)` : preset.name}</span>
                </button>
              )
            })}
          </div>
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
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="initials" className="block text-sm font-medium text-slate-700">
                Initials
              </label>
              <input
                id="initials"
                value={initials}
                onChange={(e) => setInitials(e.target.value)}
                maxLength={2}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase focus-visible:ring-2 focus-visible:ring-accent"
                placeholder="OM"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="color" className="block text-sm font-medium text-slate-700">
                Color
              </label>
              <input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="mt-1 h-9 w-full rounded-md border border-slate-300"
              />
            </div>
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
