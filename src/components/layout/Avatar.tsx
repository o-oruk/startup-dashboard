import type { Profile } from '../../types'

const SIZES = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-11 w-11 text-base',
} as const

export function Avatar({
  profile,
  size = 'md',
}: {
  profile: Pick<Profile, 'initials' | 'color' | 'name'> | null | undefined
  size?: keyof typeof SIZES
}) {
  if (!profile) {
    return (
      <span
        title="Unassigned"
        className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-300 font-medium text-slate-400 ${SIZES[size]}`}
      >
        ?
      </span>
    )
  }
  return (
    <span
      title={profile.name || 'Unnamed'}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${SIZES[size]}`}
      style={{ backgroundColor: profile.color }}
    >
      {profile.initials || '?'}
    </span>
  )
}
