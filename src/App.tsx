import { Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { AuthScreen } from './components/auth/AuthScreen'
import { ClaimProfile } from './components/auth/ClaimProfile'
import { AppShell } from './components/layout/AppShell'
import { Board } from './pages/Board'
import { Daily } from './pages/Daily'
import { Progress } from './pages/Progress'
import { Calendar } from './pages/Calendar'

function Gate() {
  const { session, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">
        Loading…
      </div>
    )
  }

  if (!session) return <AuthScreen />
  if (!profile?.claimed) return <ClaimProfile />

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </AppShell>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
