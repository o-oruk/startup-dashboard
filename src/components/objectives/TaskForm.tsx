import { useState, type FormEvent } from 'react'
import type { Profile, TaskWeight } from '../../types'
import { WEIGHT_LABELS } from '../../types'
import { AssigneeSelect } from './AssigneeSelect'

export function TaskForm({
  profiles,
  onSubmit,
}: {
  profiles: Profile[]
  onSubmit: (input: { title: string; weight: TaskWeight; assigneeId: string | null }) => Promise<void>
}) {
  const [title, setTitle] = useState('')
  const [weight, setWeight] = useState<TaskWeight>(1)
  const [assigneeId, setAssigneeId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setBusy(true)
    try {
      await onSubmit({ title: title.trim(), weight, assigneeId })
      setTitle('')
      setWeight(1)
      setAssigneeId(null)
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
      <select
        value={weight}
        onChange={(e) => setWeight(Number(e.target.value) as TaskWeight)}
        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-accent"
      >
        {([1, 2, 3] as TaskWeight[]).map((w) => (
          <option key={w} value={w}>
            {WEIGHT_LABELS[w]}
          </option>
        ))}
      </select>
      <AssigneeSelect profiles={profiles} value={assigneeId} onChange={setAssigneeId} />
      <button
        type="submit"
        disabled={busy || !title.trim()}
        className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
      >
        Add task
      </button>
    </form>
  )
}
