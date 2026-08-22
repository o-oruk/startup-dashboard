import {
  MONTH_LABEL,
  WEEKDAY_LABELS,
  addMonths,
  monthMatrix,
  toISODate,
  type AgendaEvent,
} from '../../lib/calendar'
import { DATE_TYPE_COLOR } from '../../types'

export function MonthCalendar({
  monthDate,
  onMonthChange,
  eventsByDate,
  today,
  selectedDate,
  onSelectDate,
}: {
  monthDate: Date
  onMonthChange: (d: Date) => void
  eventsByDate: Map<string, AgendaEvent[]>
  today: string
  selectedDate: string
  onSelectDate: (date: string) => void
}) {
  const days = monthMatrix(monthDate)
  const currentMonth = monthDate.getMonth()

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">{MONTH_LABEL(monthDate)}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMonthChange(addMonths(monthDate, -1))}
            aria-label="Previous month"
            className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
          >
            ‹
          </button>
          <button
            onClick={() => onMonthChange(new Date())}
            className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
          >
            Today
          </button>
          <button
            onClick={() => onMonthChange(addMonths(monthDate, 1))}
            aria-label="Next month"
            className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const iso = toISODate(day)
          const inMonth = day.getMonth() === currentMonth
          const isToday = iso === today
          const isSelected = iso === selectedDate
          const isPast = iso < today
          const dayEvents = eventsByDate.get(iso) ?? []

          return (
            <button
              key={iso}
              onClick={() => onSelectDate(iso)}
              className={`flex min-h-[64px] flex-col items-start rounded-md border p-1.5 text-left transition-colors ${
                isSelected
                  ? 'border-accent bg-accent-light'
                  : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span
                className={`mb-1 flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                  isToday
                    ? 'bg-accent font-semibold text-white'
                    : inMonth
                      ? 'text-slate-700'
                      : 'text-slate-300'
              }`}
              >
                {day.getDate()}
              </span>
              <div className="flex w-full flex-col gap-0.5">
                {dayEvents.slice(0, 2).map((event) => (
                  <span
                    key={event.id}
                    title={event.title}
                    className="truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight"
                    style={{
                      backgroundColor: DATE_TYPE_COLOR[event.type],
                      color: 'white',
                      opacity: isPast ? 0.45 : 1,
                    }}
                  >
                    {event.title}
                  </span>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[10px] text-slate-400">+{dayEvents.length - 2} more</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
