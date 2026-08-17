export function dueCountdown(dueDate: string, today: string) {
  const diffDays = Math.round(
    (new Date(dueDate + 'T00:00:00').getTime() - new Date(today + 'T00:00:00').getTime()) / 86_400_000,
  )
  if (diffDays === 0) return 'Due today!'
  if (diffDays > 0) return `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`
  const overdueDays = Math.abs(diffDays)
  return `${overdueDays} day${overdueDays === 1 ? '' : 's'} overdue`
}

export function isUrgentDue(dueDate: string | null, done: boolean, today: string) {
  return !!dueDate && !done && dueDate <= today
}
