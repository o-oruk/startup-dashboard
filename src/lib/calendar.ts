import type { DateType } from '../types'

export interface AgendaEvent {
  id: string
  date: string
  time: string | null
  title: string
  type: DateType
  note: string | null
}

/** Formats a Postgres time string ("14:30:00") as "2:30 PM". */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`
}

export function toISODate(d: Date): string {
  return d.toLocaleDateString('en-CA')
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function addMonths(d: Date, delta: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1)
}

/** 42 dates (6 weeks x 7 days, Sun-Sat) covering the month that contains `d`, padded with adjacent-month days. */
export function monthMatrix(d: Date): Date[] {
  const first = startOfMonth(d)
  const gridStart = new Date(first)
  gridStart.setDate(first.getDate() - first.getDay())

  const days: Date[] = []
  for (let i = 0; i < 42; i++) {
    const day = new Date(gridStart)
    day.setDate(gridStart.getDate() + i)
    days.push(day)
  }
  return days
}

export const MONTH_LABEL = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
