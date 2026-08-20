import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useChat } from '../hooks/useChat'
import { useProfiles } from '../hooks/useProfiles'
import { Avatar } from '../components/layout/Avatar'

function formatTimestamp(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  if (date.toDateString() === now.toDateString()) return time
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${time}`
}

export function Chat() {
  const { profile } = useAuth()
  const { messages, loading, sendMessage, markRead } = useChat()
  const { profiles } = useProfiles()
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void markRead()
  }, [messages.length, markRead])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  function profileFor(id: string) {
    return profiles.find((p) => p.id === id)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    setSending(true)
    try {
      await sendMessage(trimmed)
      setDraft('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-160px)] flex-col rounded-xl border border-slate-200 bg-white">
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-slate-400">No messages yet. Say hi!</p>
        ) : (
          messages.map((message) => {
            const sender = profileFor(message.sender_id)
            const isMine = message.sender_id === profile?.id
            return (
              <div key={message.id} className={`flex items-start gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                <Avatar profile={sender} size="sm" />
                <div className={`flex max-w-[70%] flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-baseline gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs font-semibold" style={{ color: sender?.color ?? '#64748b' }}>
                      {sender?.name ?? 'Unknown'}
                    </span>
                    <span className="text-[10px] text-slate-400">{formatTimestamp(message.created_at)}</span>
                  </div>
                  <div
                    className={`mt-0.5 whitespace-pre-wrap break-words rounded-2xl px-3 py-1.5 text-sm ${
                      isMine ? 'bg-accent text-white' : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {message.body}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message the team…"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-accent"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
