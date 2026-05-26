import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'
import { useStorage } from './hooks/useStorage.js'
import { useCloudData } from './hooks/useCloudData.js'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './components/Dashboard.jsx'
import PhaseView from './components/PhaseView.jsx'
import JournalView from './components/JournalView.jsx'
import ResourcesView from './components/ResourcesView.jsx'
import LandingPage from './components/LandingPage.jsx'
import AuthGate from './components/AuthGate.jsx'
import { PHASES } from './data/phases.js'

const PHASE_IDS = PHASES.map(p => p.id)

export default function App() {
  const [showLanding, setShowLanding] = useState(false)
  const [activeView, setActiveView] = useStorage('os_active_view', 'dashboard')

  // ── Auth state ─────────────────────────────────────────────────
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
    })

    // Listen for auth changes (magic link click, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Cloud data (syncs across devices) ─────────────────────────
  const userId = session?.user?.id
  const {
    tasks, setTasks,
    notes, setNotes,
    journal, setJournal,
    loading: dataLoading,
  } = useCloudData(userId)

  // ── Landing ────────────────────────────────────────────────────
  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />
  }

  // ── Auth gate ──────────────────────────────────────────────────
  // Wraps everything — shows login screen if not signed in
  function renderApp() {
    if (dataLoading && userId) {
      return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
          Loading your data…
        </div>
      )
    }

    if (activeView === 'dashboard') return <Dashboard tasks={tasks} setActiveView={setActiveView} />
    if (activeView === 'journal') return <JournalView entries={journal} setEntries={setJournal} />
    if (activeView === 'resources') return <ResourcesView />
    if (PHASE_IDS.includes(activeView)) {
      return (
        <PhaseView
          phaseId={activeView}
          tasks={tasks}
          setTasks={setTasks}
          notes={notes}
          setNotes={setNotes}
        />
      )
    }
    return <Dashboard tasks={tasks} setActiveView={setActiveView} />
  }

  return (
    <AuthGate session={session} loading={authLoading}>
      <div className="app">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          tasks={tasks}
          onHome={() => setShowLanding(true)}
          session={session}
        />
        <main className="main">
          {renderApp()}
        </main>
      </div>
    </AuthGate>
  )
}
