import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types'

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase.from('profiles').select('*').order('created_at')
    setProfiles(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    const channel = supabase
      .channel(`profiles-changes-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, load)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function updateName(id: string, name: string) {
    const { error } = await supabase.from('profiles').update({ name }).eq('id', id)
    if (error) throw error
    await load()
  }

  return { profiles, loading, updateName, refresh: load }
}

export function profileById(profiles: Profile[], id: string | null): Profile | undefined {
  if (!id) return undefined
  return profiles.find((p) => p.id === id)
}
