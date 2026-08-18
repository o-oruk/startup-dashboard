import type { Objective, Profile, Task } from '../../types'
import { Avatar } from '../layout/Avatar'
import { WeightBadge } from '../objectives/WeightBadge'

export function DayTasksModal({
  date,
  tasks,
  profiles,
  objectives,
  showAssignee,
  onClose,
}: {
  date: string
  tasks: Task[]
  profiles: Profile[]
  objectives: Objective[]
  showAssignee: boolean
  onClose: () => void
}) {
  const label = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
  const totalPoints = tasks.reduce((sum, t) => sum + t.weight, 0)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{label}</h3>
            <p className="text-xs text-slate-500">
              {tasks.length} task{tasks.length === 1 ? '' : 's'} completed · {totalPoints} point
              {totalPoints === 1 ? '' : 's'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">Nothing completed on this day.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => {
              const objective = objectives.find((o) => o.id === task.objective_id)
              const completer = profiles.find((p) => p.id === task.completed_by)
              return (
                <li
                  key={task.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
                >
                  {showAssignee && <Avatar profile={completer} size="sm" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-800">{task.title}</p>
                    <p className="truncate text-xs text-slate-400">
                      {showAssignee && completer ? `${completer.name} · ` : ''}
                      {objective?.title ?? 'No objective'}
                    </p>
                  </div>
                  <WeightBadge weight={task.weight} />
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
