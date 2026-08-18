export type TaskStatus = 'backlog' | 'daily' | 'done'
export type TaskWeight = 1 | 2 | 3

export interface Profile {
  id: string
  name: string
  email: string | null
  initials: string
  color: string
  role: string
  claimed: boolean
  created_at: string
}

export interface Objective {
  id: string
  title: string
  position: number
  hue: number
  created_at: string
}

export interface Task {
  id: string
  objective_id: string
  title: string
  weight: TaskWeight
  assignee_ids: string[]
  status: TaskStatus
  scheduled_date: string | null
  due_date: string | null
  completed_by: string | null
  completed_date: string | null
  created_by: string | null
  created_at: string
}

export type DateType = 'meeting' | 'deadline' | 'event'

export interface ImportantDate {
  id: string
  title: string
  date: string
  type: DateType
  note: string | null
  created_by: string | null
  created_at: string
}

export const DATE_TYPE_COLOR: Record<DateType, string> = {
  meeting: '#2563eb',
  deadline: '#dc2626',
  event: '#16a34a',
}

export const DATE_TYPE_LABEL: Record<DateType, string> = {
  meeting: 'Meeting',
  deadline: 'Deadline',
  event: 'Event',
}

export const WEIGHT_LABELS: Record<TaskWeight, string> = {
  1: 'Small',
  2: 'Medium',
  3: 'Large',
}

export const PROFILE_COLORS = ['#4f46e5', '#0d9488', '#d97706', '#e11d48'] as const
