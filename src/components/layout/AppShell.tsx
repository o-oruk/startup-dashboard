import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Avatar } from './Avatar'
import { Countdown } from './Countdown'
import { Logo } from './Logo'

const NAV_ITEMS = [
  { to: '/', label: 'Roadmap', end: true },
  { to: '/daily', label: 'Tasks' },
  { to: '/progress', label: 'Progress' },
  { to: '/calendar', label: 'Calendar' },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-10">
        <Countdown />
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Logo size={24} />
                Team Ops
              </span>
              <nav className="flex gap-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-accent-light text-accent'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Avatar profile={profile} size="sm" />
              <span className="hidden text-sm text-slate-600 sm:inline">{profile?.name}</span>
              <button
                onClick={signOut}
                className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                Log out
              </button>
            </div>
          </div>
        </header>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  )
}
