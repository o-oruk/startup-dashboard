import type { Objective, Task } from '../../types'
import { isUrgentDue } from '../../lib/dueDate'
import { DueBadge } from '../objectives/DueBadge'
import { WeightBadge } from '../objectives/WeightBadge'

export function DailyTaskCard({
  task,
  objective,
  today,
  canComplete,
  onComplete,
  onReturnToBacklog,
}: {
  task: Task
  objective: Objective | undefined
  today: string
  canComplete: boolean
  onComplete: () => Promise<void>
  onReturnToBacklog?: () => Promise<void>
}) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <input
        type="checkbox"
        disabled={!canComplete}
        onChange={() => void onComplete()}
        title={canComplete ? undefined : "Only this task's assignee can mark it done"}
        className="h-4 w-4 shrink-0 rounded border-slate-300 text-accent focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Mark done"
      />
      <div className="min-w-[140px] flex-1">
        <p className="text-sm text-slate-800">{task.title}</p>
        {objective && <p className="text-xs text-slate-400">{objective.title}</p>}
      </div>
      <WeightBadge weight={task.weight} />
      {task.due_date && (
        <DueBadge dueDate={task.due_date} today={today} isUrgent={isUrgentDue(task.due_date, false, today)} />
      )}
      {onReturnToBacklog ? (
        <button
          onClick={() => void onReturnToBacklog()}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-800"
        >
          Remove from today's list
        </button>
      ) : (
        <span
          title="This task showed up automatically because it's due"
          className="rounded-full bg-accent-light px-2 py-1 text-xs font-medium text-accent"
        >
          Due
        </span>
      )}
    </li>
  )
}
