import type { Objective, Task } from '../../types'
import { WeightBadge } from '../objectives/WeightBadge'

export function DailyTaskCard({
  task,
  objective,
  onComplete,
}: {
  task: Task
  objective: Objective | undefined
  onComplete: () => Promise<void>
}) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <input
        type="checkbox"
        onChange={() => void onComplete()}
        className="h-4 w-4 shrink-0 rounded border-slate-300 text-accent focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Mark done"
      />
      <div className="min-w-[140px] flex-1">
        <p className="text-sm text-slate-800">{task.title}</p>
        {objective && <p className="text-xs text-slate-400">{objective.title}</p>}
      </div>
      <WeightBadge weight={task.weight} />
    </li>
  )
}
