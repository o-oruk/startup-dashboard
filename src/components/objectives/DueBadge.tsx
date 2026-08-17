import { dueCountdownParts } from '../../lib/dueDate'

export function DueBadge({
  dueDate,
  today,
  isUrgent,
}: {
  dueDate: string
  today: string
  isUrgent: boolean
}) {
  const { prefix, redPart, suffix } = dueCountdownParts(dueDate, today)

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
        isUrgent ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'
      }`}
    >
      {prefix}
      {redPart !== null && <span className="text-red-600">{redPart}</span>}
      {suffix}
    </span>
  )
}
