import { useState } from 'react'
import type { Profile, Task } from '../../types'
import { DatePicker } from '../shared/DatePicker'
import { AssigneePicker } from './AssigneePicker'
import { DueBadge } from './DueBadge'
import { WeightPicker } from './WeightPicker'
import { todayISO } from '../../hooks/useTasks'
import { isUrgentDue } from '../../lib/dueDate'

const STATUS_LABEL: Record<Task['status'], string> = {
  backlog: 'Backlog',
  daily: "On today's list",
  done: 'Done',
}

export function TaskRow({
  task,
  profiles,
  onUpdate,
  onToggleAssignee,
  onDelete,
  onPushToDaily,
  onReopen,
}: {
  task: Task
  profiles: Profile[]
  onUpdate: (fields: Partial<Pick<Task, 'title' | 'weight' | 'due_date'>>) => Promise<void>
  onToggleAssignee: (profileId: string, assign: boolean) => void
  onDelete: () => Promise<void>
  onPushToDaily: () => Promise<void>
  onReopen: () => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const completedBy = profiles.find((p) => p.id === task.completed_by)
  const today = todayISO()
  const isUrgent = isUrgentDue(task.due_date, task.status === 'done', today)

  async function saveTitle() {
    setEditing(false)
    const trimmed = title.trim()
    if (trimmed && trimmed !== task.title) await onUpdate({ title: trimmed })
    else setTitle(task.title)
  }

  return (
    <li className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
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
        {task.status === 'done' && (
          <p className="mt-0.5 text-xs text-slate-400">
            {completedBy && `Completed by ${completedBy.name} on ${task.completed_date}`}
            <button
              onClick={() => void onReopen()}
              className="ml-2 font-medium text-slate-400 underline hover:text-accent"
            >
              Undo
            </button>
          </p>
        )}
      </div>

      <WeightPicker value={task.weight} onChange={(weight) => onUpdate({ weight })} />

      <div className="flex items-center gap-1.5">
        <DatePicker
          value={task.due_date ?? ''}
          onChange={(date) => onUpdate({ due_date: date || null })}
          placeholder="Deadline"
          clearable
        />
        {task.due_date && <DueBadge dueDate={task.due_date} today={today} isUrgent={isUrgent} />}
      </div>

      <AssigneePicker profiles={profiles} selectedIds={task.assignee_ids} onToggle={onToggleAssignee} />

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
          className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-red-50 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </li>
  )
}
