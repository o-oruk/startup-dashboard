import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export type PresenceStatus = 'online' | 'away'

const IDLE_TIMEOUT_MS = 5 * 60 * 1000

const PresenceContext = createContext<Record<string, PresenceStatus>>({})

export function PresenceProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth()
  const [statuses, setStatuses] = useState<Record<string, PresenceStatus>>({})

  useEffect(() => {
    if (!profile) {
      setStatuses({})
      return
    }

    const channel = supabase.channel('presence-team', {
      config: { presence: { key: profile.id } },
    })

    function syncState() {
      const state = channel.presenceState<{ status: PresenceStatus }>()
      const next: Record<string, PresenceStatus> = {}
      for (const key of Object.keys(state)) {
        const entries = state[key]
        next[key] = entries.some((e) => e.status === 'online') ? 'online' : 'away'
      }
      setStatuses(next)
    }

    let lastSent: PresenceStatus = 'online'
    function setStatus(next: PresenceStatus) {
      if (lastSent === next) return
      lastSent = next
      void channel.track({ status: next })
    }

    let idleTimer: ReturnType<typeof setTimeout>
    function markOnline() {
      clearTimeout(idleTimer)
      setStatus('online')
      idleTimer = setTimeout(() => setStatus('away'), IDLE_TIMEOUT_MS)
    }
    function markAway() {
      clearTimeout(idleTimer)
      setStatus('away')
    }
    function handleVisibility() {
      if (document.visibilityState === 'hidden') markAway()
      else markOnline()
    }

    channel.on('presence', { event: 'sync' }, syncState).subscribe((subscribeStatus) => {
      if (subscribeStatus === 'SUBSCRIBED') markOnline()
    })

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('mousemove', markOnline)
    window.addEventListener('keydown', markOnline)

    return () => {
      clearTimeout(idleTimer)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('mousemove', markOnline)
      window.removeEventListener('keydown', markOnline)
      supabase.removeChannel(channel)
    }
  }, [profile])

  return <PresenceContext.Provider value={statuses}>{children}</PresenceContext.Provider>
}

export function usePresence() {
  return useContext(PresenceContext)
}
