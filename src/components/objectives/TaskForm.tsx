import { useState, type FormEvent } from 'react'
import type { Profile, TaskWeight } from '../../types'
import { AssigneePicker } from './AssigneePicker'
import { WeightPicker } from './WeightPicker'

export function TaskForm({
  profiles,
  onSubmit,
}: {
  profiles: Profile[]
  onSubmit: (input: {
    title: string
    weight: TaskWeight
    assigneeIds: string[]
    dueDate: string
  }) => Promise<void>
}) {
  const [title, setTitle] = useState('')
  const [weight, setWeight] = useState<TaskWeight | null>(null)
  const [assigneeIds, setAssigneeIds] = useState<string[]>([])
  const [dueDate, setDueDate] = useState('')
  const [busy, setBusy] = useState(false)

  const canSubmit = !!title.trim() && weight !== null && assigneeIds.length > 0 && !!dueDate

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit || weight === null) return
    setBusy(true)
    try {
      await onSubmit({ title: title.trim(), weight, assigneeIds, dueDate })
      setTitle('')
      setWeight(null)
      setAssigneeIds([])
      setDueDate('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-slate-300 p-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task…"
        className="min-w-[180px] flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-accent"
      />
      <WeightPicker value={weight} onChange={setWeight} />
      <AssigneePicker
        profiles={profiles}
        selectedIds={assigneeIds}
        onToggle={(profileId, assign) =>
          setAssigneeIds((ids) => (assign ? [...ids, profileId] : ids.filter((id) => id !== profileId)))
        }
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        title="Deadline"
        required
        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-600 focus-visible:ring-2 focus-visible:ring-accent"
      />
      <button
        type="submit"
        disabled={busy || !canSubmit}
        title={canSubmit ? undefined : 'Set a deadline, a size, and at least one assignee'}
        className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
      >
        Add task
      </button>
    </form>
  )
}
