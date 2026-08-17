import { useEffect, useState } from 'react'
import { SPRINT_END } from '../../lib/progress'

const TARGET = new Date(SPRINT_END + 'T00:00:00').getTime()

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

export function Countdown() {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = TARGET - now

  if (diff <= 0) {
    return (
      <div className="border-b border-slate-200 bg-white px-4 py-2 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-500">
          🎤 Pitch day is here
        </span>
      </div>
    )
  }

  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86_400)
  const hours = Math.floor((totalSeconds % 86_400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-2 text-center">
      <span className="inline-flex flex-wrap items-baseline justify-center gap-x-2 rounded-full bg-red-50 px-4 py-1.5 text-sm text-red-500">
        <span className="font-medium text-red-400">Investor pitch in</span>
        <span className="font-mono text-base font-semibold tabular-nums">
          {days} {days === 1 ? 'day' : 'days'}, {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </span>
      </span>
    </div>
  )
}
