import { useEffect, useRef, useState } from 'react'
import { MONTH_LABEL, WEEKDAY_LABELS, addMonths, monthMatrix, startOfMonth, toISODate } from '../../lib/calendar'

export function DatePicker({
  value,
  onChange,
  placeholder = 'Date',
  clearable = false,
  triggerClassName = '',
}: {
  value: string
  onChange: (date: string) => void
  placeholder?: string
  clearable?: boolean
  triggerClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(value ? new Date(value + 'T00:00:00') : new Date()),
  )
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const days = monthMatrix(viewMonth)
  const currentMonth = viewMonth.getMonth()
  const label = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setViewMonth(startOfMonth(value ? new Date(value + 'T00:00:00') : new Date()))
          setOpen((o) => !o)
        }}
        className={`flex items-center gap-1.5 rounded-md border border-slate-300 px-2 py-1 text-sm hover:border-accent ${triggerClassName}`}
      >
        <span className={label ? 'text-slate-700' : 'text-slate-400'}>{label ?? placeholder}</span>
        <svg viewBox="0 0 12 8" className="ml-auto h-2 w-2.5 shrink-0 text-slate-400" fill="none">
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-60 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <div className="mb-1.5 flex items-center justify-between px-0.5">
            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
              aria-label="Previous month"
              className="rounded px-1.5 py-0.5 text-sm text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              ‹
            </button>
            <span className="text-xs font-semibold text-slate-700">{MONTH_LABEL(viewMonth)}</span>
            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              aria-label="Next month"
              className="rounded px-1.5 py-0.5 text-sm text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium text-slate-400">
            {WEEKDAY_LABELS.map((d) => (
              <div key={d} className="py-0.5">
                {d[0]}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day) => {
              const iso = toISODate(day)
              const inMonth = day.getMonth() === currentMonth
              const isSelected = iso === value
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => {
                    onChange(iso)
                    setOpen(false)
                  }}
                  className={`rounded-md py-1 text-xs transition-colors ${
                    isSelected
                      ? 'bg-accent font-semibold text-white'
                      : inMonth
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>

          {clearable && value && (
            <button
              type="button"
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
              className="mt-1.5 w-full rounded-md py-1 text-center text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            >
              Clear date
            </button>
          )}
        </div>
      )}
    </div>
  )
}
