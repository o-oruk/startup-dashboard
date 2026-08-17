import { WEIGHT_LABELS, type TaskWeight } from '../../types'

const DOT_COUNT: Record<TaskWeight, number> = { 1: 1, 2: 2, 3: 3 }

export function WeightBadge({ weight }: { weight: TaskWeight }) {
  return (
    <span
      title={`${WEIGHT_LABELS[weight]} (${weight} point${weight > 1 ? 's' : ''})`}
      className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
    >
      {Array.from({ length: DOT_COUNT[weight] }).map((_, i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-slate-500" />
      ))}
      <span className="ml-1">{WEIGHT_LABELS[weight]}</span>
    </span>
  )
}
