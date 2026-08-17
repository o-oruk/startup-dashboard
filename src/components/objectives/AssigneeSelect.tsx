import type { Profile } from '../../types'

export function AssigneeSelect({
  profiles,
  value,
  onChange,
  className = '',
}: {
  profiles: Profile[]
  value: string | null
  onChange: (id: string | null) => void
  className?: string
}) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      className={`rounded-md border border-slate-300 px-2 py-1 text-sm focus-visible:ring-2 focus-visible:ring-accent ${className}`}
    >
      <option value="">Unassigned</option>
      {profiles
        .filter((p) => p.claimed)
        .map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
    </select>
  )
}
