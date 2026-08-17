import type { Profile } from '../../types'
import type { PresenceStatus } from '../../hooks/usePresence'

const SIZES = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-11 w-11 text-base',
} as const

const DOT_SIZES = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
} as const

const STATUS_COLOR: Record<PresenceStatus, string> = {
  online: 'bg-emerald-500',
  away: 'bg-amber-400',
}

const STATUS_LABEL: Record<PresenceStatus, string> = {
  online: 'Online',
  away: 'Away',
}

export function Avatar({
  profile,
  size = 'md',
  status,
}: {
  profile: Pick<Profile, 'initials' | 'color' | 'name'> | null | undefined
  size?: keyof typeof SIZES
  status?: PresenceStatus
}) {
  const dot = status && (
    <span
      title={STATUS_LABEL[status]}
      className={`absolute -bottom-0.5 -right-0.5 rounded-full ring-2 ring-white ${DOT_SIZES[size]} ${STATUS_COLOR[status]}`}
    />
  )

  if (!profile) {
    return (
      <span className="relative inline-flex shrink-0">
        <span
          title="Unassigned"
          className={`inline-flex items-center justify-center rounded-full border-2 border-dashed border-slate-300 font-medium text-slate-400 ${SIZES[size]}`}
        >
          ?
        </span>
        {dot}
      </span>
    )
  }
  return (
    <span className="relative inline-flex shrink-0">
      <span
        title={profile.name || 'Unnamed'}
        className={`inline-flex items-center justify-center rounded-full font-semibold text-white ${SIZES[size]}`}
        style={{ backgroundColor: profile.color }}
      >
        {profile.initials || '?'}
      </span>
      {dot}
    </span>
  )
}
