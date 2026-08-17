import type { Objective, Task } from '../../types'
import { dueCountdown, isUrgentDue } from '../../lib/dueDate'
import { WeightBadge } from '../objectives/WeightBadge'

export function DailyTaskCard({
  task,
  objective,
  today,
  onComplete,
  onReturnToBacklog,
}: {
  task: Task
  objective: Objective | undefined
  today: string
  onComplete: () => Promise<void>
  onReturnToBacklog: () => Promise<void>
}) {
  const isUrgent = isUrgentDue(task.due_date, false, today)

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
      {task.due_date && (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            isUrgent ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {dueCountdown(task.due_date, today)}
        </span>
      )}
      <button
        onClick={() => void onReturnToBacklog()}
        className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-800"
      >
        Remove from today's list
      </button>
    </li>
  )
}
