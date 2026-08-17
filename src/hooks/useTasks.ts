import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Task, TaskWeight } from '../types'

function todayISO() {
  return new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    setTasks(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    const channel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, load)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function addTask(input: {
    objectiveId: string
    title: string
    weight: TaskWeight
    assigneeId: string | null
    createdBy: string
  }) {
    const { error } = await supabase.from('tasks').insert({
      objective_id: input.objectiveId,
      title: input.title,
      weight: input.weight,
      assignee_id: input.assigneeId,
      created_by: input.createdBy,
    })
    if (error) throw error
    await load()
  }

  async function updateTask(
    id: string,
    fields: Partial<Pick<Task, 'title' | 'weight' | 'assignee_id'>>,
  ) {
    const { error } = await supabase.from('tasks').update(fields).eq('id', id)
    if (error) throw error
    await load()
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) throw error
    await load()
  }

  async function pushToDaily(id: string, assigneeId: string | null) {
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'daily', scheduled_date: todayISO(), assignee_id: assigneeId })
      .eq('id', id)
    if (error) throw error
    await load()
  }

  async function returnToBacklog(id: string) {
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'backlog', scheduled_date: null })
      .eq('id', id)
    if (error) throw error
    await load()
  }

  async function completeTask(id: string, completedBy: string) {
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'done', completed_by: completedBy, completed_date: todayISO() })
      .eq('id', id)
    if (error) throw error
    await load()
  }

  async function reopenTask(task: Task) {
    const { error } = await supabase
      .from('tasks')
      .update({
        status: task.scheduled_date ? 'daily' : 'backlog',
        completed_by: null,
        completed_date: null,
      })
      .eq('id', task.id)
    if (error) throw error
    await load()
  }

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    pushToDaily,
    returnToBacklog,
    completeTask,
    reopenTask,
    refresh: load,
  }
}

export { todayISO }
