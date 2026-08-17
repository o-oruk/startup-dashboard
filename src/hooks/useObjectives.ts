import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Objective } from '../types'

export function useObjectives() {
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase.from('objectives').select('*').order('position')
    setObjectives(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    const channel = supabase
      .channel('objectives-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'objectives' }, load)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function addObjective(title: string) {
    const position = objectives.length
    const { error } = await supabase.from('objectives').insert({ title, position })
    if (error) throw error
    await load()
  }

  async function deleteObjective(id: string) {
    const { error } = await supabase.from('objectives').delete().eq('id', id)
    if (error) throw error
    await load()
  }

  return { objectives, loading, addObjective, deleteObjective, refresh: load }
}
