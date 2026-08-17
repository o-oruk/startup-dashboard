import { useState, type FormEvent } from 'react'

export function ImportantDateForm({
  onSubmit,
}: {
  onSubmit: (input: { title: string; date: string; note: string | null }) => Promise<void>
}) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim() || !date) return
    setBusy(true)
    try {
      await onSubmit({ title: title.trim(), date, note: note.trim() || null })
      setTitle('')
      setDate('')
      setNote('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-slate-300 p-3"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What's the date for?"
        className="min-w-[160px] flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-accent"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-accent"
      />
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (optional)"
        className="min-w-[140px] flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-accent"
      />
      <button
        type="submit"
        disabled={busy || !title.trim() || !date}
        className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
      >
        Add date
      </button>
    </form>
  )
}
