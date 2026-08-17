export type TaskStatus = 'backlog' | 'daily' | 'done'
export type TaskWeight = 1 | 2 | 3

export interface Profile {
  id: string
  name: string
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
  created_at: string
}

export interface Task {
  id: string
  objective_id: string
  title: string
  weight: TaskWeight
  assignee_id: string | null
  status: TaskStatus
  scheduled_date: string | null
  completed_by: string | null
  completed_date: string | null
  created_by: string | null
  created_at: string
}

export interface ImportantDate {
  id: string
  title: string
  date: string
  note: string | null
  created_by: string | null
  created_at: string
}

export const WEIGHT_LABELS: Record<TaskWeight, string> = {
  1: 'Small',
  2: 'Medium',
  3: 'Large',
}

export const PROFILE_PRESETS = [
  { name: 'Founder', initials: 'F1', color: '#4f46e5' },
  { name: 'Member 2', initials: 'M2', color: '#0d9488' },
  { name: 'Member 3', initials: 'M3', color: '#d97706' },
  { name: 'Member 4', initials: 'M4', color: '#e11d48' },
] as const
