import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { ChatMessage } from '../types'

const MESSAGE_LIMIT = 200

function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioContextClass()
    const now = ctx.currentTime

    function chime(startAt: number, frequency: number) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, startAt)
      gain.gain.exponentialRampToValueAtTime(0.18, startAt + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.22)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(startAt)
      osc.stop(startAt + 0.25)
    }

    chime(now, 880)
    chime(now + 0.12, 660)
    setTimeout(() => void ctx.close(), 500)
  } catch {
    // Audio unavailable or blocked by the browser — fail silently.
  }
}

interface ChatContextValue {
  messages: ChatMessage[]
  unreadCount: number
  loading: boolean
  sendMessage: (body: string) => Promise<void>
  markRead: () => Promise<void>
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [lastReadAt, setLastReadAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) {
      setMessages([])
      setLastReadAt(null)
      setLoading(false)
      return
    }

    let ready = false

    async function loadMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(MESSAGE_LIMIT)
      setMessages(data ?? [])
    }

    async function init() {
      await loadMessages()
      const { data: read } = await supabase
        .from('message_reads')
        .select('last_read_at')
        .eq('profile_id', profile!.id)
        .maybeSingle()
      setLastReadAt(read?.last_read_at ?? null)
      setLoading(false)
      ready = true
    }
    init()

    const channel = supabase
      .channel(`messages-changes-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const message = payload.new as ChatMessage
        if (ready && message.sender_id !== profile!.id) playNotificationSound()
        void loadMessages()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [profile])

  const unreadCount = profile
    ? messages.filter((m) => m.sender_id !== profile.id && (!lastReadAt || m.created_at > lastReadAt)).length
    : 0

  async function sendMessage(body: string) {
    if (!profile) return
    const trimmed = body.trim()
    if (!trimmed) return
    const { error } = await supabase.from('messages').insert({ sender_id: profile.id, body: trimmed })
    if (error) throw error
  }

  async function markRead() {
    if (!profile) return
    const now = new Date().toISOString()
    setLastReadAt(now)
    const { error } = await supabase
      .from('message_reads')
      .upsert({ profile_id: profile.id, last_read_at: now }, { onConflict: 'profile_id' })
    if (error) throw error
  }

  return (
    <ChatContext.Provider value={{ messages, unreadCount, loading, sendMessage, markRead }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within a ChatProvider')
  return ctx
}
