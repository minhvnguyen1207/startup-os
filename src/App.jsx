import { useState } from 'react'
import { useStorage } from './hooks/useStorage.js'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './components/Dashboard.jsx'
import PhaseView from './components/PhaseView.jsx'
import JournalView from './components/JournalView.jsx'
import ResourcesView from './components/ResourcesView.jsx'
import LandingPage from './components/LandingPage.jsx'
import { PHASES } from './data/phases.js'

const PHASE_IDS = PHASES.map(p => p.id)

export default function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [activeView, setActiveView] = useStorage('os_active_view', 'dashboard')
  const [tasks, setTasks] = useStorage('os_tasks_v1', {})
  const [notes, setNotes] = useStorage('os_notes_v1', {})
  const [journalEntries, setJournalEntries] = useStorage('os_journal_v1', [])

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />
  }

  function renderMain() {
    if (activeView === 'dashboard') {
      return <Dashboard tasks={tasks} setActiveView={setActiveView} />
    }
    if (activeView === 'journal') {
      return <JournalView entries={journalEntries} setEntries={setJournalEntries} />
    }
    if (activeView === 'resources') {
      return <ResourcesView />
    }
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
    <div className="app">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        tasks={tasks}
        onHome={() => setShowLanding(true)}
      />
      <main className="main">
        {renderMain()}
      </main>
    </div>
  )
}
