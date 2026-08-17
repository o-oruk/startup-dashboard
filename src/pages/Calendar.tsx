import { useAuth } from '../hooks/useAuth'
import { useImportantDates } from '../hooks/useImportantDates'
import { useObjectives } from '../hooks/useObjectives'
import { useProfiles } from '../hooks/useProfiles'
import { useTasks, todayISO } from '../hooks/useTasks'
import { Avatar } from '../components/layout/Avatar'
import { ImportantDateForm } from '../components/calendar/ImportantDateForm'
import { WeightBadge } from '../components/objectives/WeightBadge'

type AgendaEvent =
  | { kind: 'date'; id: string; date: string; title: string; note: string | null }
  | {
      kind: 'task'
      id: string
      date: string
      title: string
      weight: 1 | 2 | 3
      assigneeId: string | null
      done: boolean
      objectiveTitle: string | undefined
    }

export function Calendar() {
  const { profile } = useAuth()
  const { dates, addDate, deleteDate } = useImportantDates()
  const { tasks } = useTasks()
  const { objectives } = useObjectives()
  const { profiles } = useProfiles()
  const today = todayISO()

  const events: AgendaEvent[] = [
    ...dates.map((d) => ({ kind: 'date' as const, id: d.id, date: d.date, title: d.title, note: d.note })),
    ...tasks
      .filter((t) => t.scheduled_date)
      .map((t) => ({
        kind: 'task' as const,
        id: t.id,
        date: t.scheduled_date as string,
        title: t.title,
        weight: t.weight,
        assigneeId: t.assignee_id,
        done: t.status === 'done',
        objectiveTitle: objectives.find((o) => o.id === t.objective_id)?.title,
      })),
  ].sort((a, b) => a.date.localeCompare(b.date))

  const grouped = new Map<string, AgendaEvent[]>()
  for (const event of events) {
    grouped.set(event.date, [...(grouped.get(event.date) ?? []), event])
  }
  const sortedDates = [...grouped.keys()].sort()

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-semibold text-slate-900">Calendar</h1>

      {profile && (
        <ImportantDateForm
          onSubmit={(input) => addDate({ ...input, createdBy: profile.id })}
        />
      )}

      {sortedDates.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No dates yet. Add a deadline or milestone above — scheduled tasks will also show up here
          automatically.
        </div>
      ) : (
        <ul className="space-y-4">
          {sortedDates.map((date) => (
            <li key={date}>
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={`text-sm font-semibold ${date === today ? 'text-accent' : 'text-slate-700'}`}
                >
                  {date}
                </span>
                {date === today && (
                  <span className="rounded-full bg-accent-light px-2 py-0.5 text-xs text-accent">
                    Today
                  </span>
                )}
                {date < today && <span className="text-xs text-slate-400">Past</span>}
              </div>
              <ul className="space-y-1.5">
                {grouped.get(date)!.map((event) =>
                  event.kind === 'date' ? (
                    <li
                      key={event.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">{event.title}</p>
                        {event.note && <p className="text-xs text-slate-500">{event.note}</p>}
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${event.title}"?`)) void deleteDate(event.id)
                        }}
                        className="rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </li>
                  ) : (
                    <li
                      key={event.id}
                      className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-2"
                    >
                      <span
                        className={`text-sm ${event.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                      >
                        {event.title}
                      </span>
                      {event.objectiveTitle && (
                        <span className="text-xs text-slate-400">{event.objectiveTitle}</span>
                      )}
                      <WeightBadge weight={event.weight} />
                      <Avatar profile={profiles.find((p) => p.id === event.assigneeId)} size="sm" />
                    </li>
                  ),
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
