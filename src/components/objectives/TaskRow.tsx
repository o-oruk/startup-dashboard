import { useState } from 'react'
import type { Profile, Task } from '../../types'
import { Avatar } from '../layout/Avatar'
import { AssigneeSelect } from './AssigneeSelect'
import { WeightBadge } from './WeightBadge'

const STATUS_LABEL: Record<Task['status'], string> = {
  backlog: 'Backlog',
  daily: "On today's list",
  done: 'Done',
}

export function TaskRow({
  task,
  profiles,
  onUpdate,
  onDelete,
  onPushToDaily,
  onComplete,
  onReopen,
}: {
  task: Task
  profiles: Profile[]
  onUpdate: (fields: Partial<Pick<Task, 'title' | 'weight' | 'assignee_id'>>) => Promise<void>
  onDelete: () => Promise<void>
  onPushToDaily: () => Promise<void>
  onComplete: () => Promise<void>
  onReopen: () => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const assignee = profiles.find((p) => p.id === task.assignee_id)
  const completedBy = profiles.find((p) => p.id === task.completed_by)

  async function saveTitle() {
    setEditing(false)
    const trimmed = title.trim()
    if (trimmed && trimmed !== task.title) await onUpdate({ title: trimmed })
    else setTitle(task.title)
  }

  return (
    <li className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <input
        type="checkbox"
        checked={task.status === 'done'}
        onChange={() => (task.status === 'done' ? onReopen() : onComplete())}
        className="h-4 w-4 shrink-0 rounded border-slate-300 text-accent focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={task.status === 'done' ? 'Mark not done' : 'Mark done'}
      />

      <div className="min-w-[160px] flex-1">
        {editing ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
            className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus-visible:ring-2 focus-visible:ring-accent"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className={`text-left text-sm ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800'}`}
          >
            {task.title}
          </button>
        )}
        {task.status === 'done' && completedBy && (
          <p className="mt-0.5 text-xs text-slate-400">
            Completed by {completedBy.name} on {task.completed_date}
          </p>
        )}
      </div>

      <WeightBadge weight={task.weight} />

      {task.status === 'backlog' ? (
        <AssigneeSelect
          profiles={profiles}
          value={task.assignee_id}
          onChange={(id) => onUpdate({ assignee_id: id })}
        />
      ) : (
        <Avatar profile={assignee} size="sm" />
      )}

      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
        {STATUS_LABEL[task.status]}
      </span>

      <div className="ml-auto flex items-center gap-2">
        {task.status === 'backlog' && (
          <button
            onClick={onPushToDaily}
            className="rounded-md bg-accent-light px-2 py-1 text-xs font-medium text-accent hover:bg-accent/20"
          >
            Push to today
          </button>
        )}
        <button
          onClick={() => {
            if (confirm(`Delete "${task.title}"? This can't be undone.`)) void onDelete()
          }}
          className="rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-red-50 hover:text-red-600"
        >
          Delete
        </button>
      </div>
    </li>
  )
}
