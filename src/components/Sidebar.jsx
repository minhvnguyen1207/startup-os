import { PHASES } from '../data/phases.js'
import { supabase } from '../lib/supabase.js'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'journal', label: 'Journal' },
  { id: 'resources', label: 'Tool stack' },
]

const btnStyle = {
  marginTop: 6,
  background: 'transparent',
  border: '0.5px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-tertiary)',
  fontSize: 11,
  padding: '5px 10px',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
  letterSpacing: '0.04em',
  fontFamily: 'inherit',
  transition: 'color 0.1s, border-color 0.1s',
}

export default function Sidebar({ activeView, setActiveView, tasks, onHome, session }) {
  const allTaskIds = PHASES.flatMap(p => p.sections.flatMap(s => s.tasks.map(t => p.id + '|' + t.id)))
  const totalTasks = allTaskIds.length
  const doneTasks = allTaskIds.filter(id => tasks[id]).length
  const globalPct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0

  function phaseProgress(phase) {
    const ids = phase.sections.flatMap(s => s.tasks.map(t => phase.id + '|' + t.id))
    const done = ids.filter(id => tasks[id]).length
    return { done, total: ids.length }
  }

  function signOut() {
    supabase.auth.signOut()
  }

  function hoverOn(e) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }
  function hoverOff(e) { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border)' }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">Startup OS</div>
        <div className="sidebar-logo-name">Dak Lak Coffee</div>
        <div className="sidebar-logo-sub">Minh &amp; Father · Melbourne</div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Overview</div>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            {item.label}
          </button>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: 8 }}>Phases</div>
        {PHASES.map(phase => {
          const { done, total } = phaseProgress(phase)
          return (
            <button
              key={phase.id}
              className={`sidebar-item ${activeView === phase.id ? 'active' : ''}`}
              onClick={() => setActiveView(phase.id)}
            >
              <span className="sidebar-dot" style={{ background: phase.color }} />
              <span style={{ flex: 1, textAlign: 'left', lineHeight: 1.3 }}>{phase.title}</span>
              <span className="sidebar-progress">{done}/{total}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-label">Overall progress</div>
        <div className="global-progress-bar">
          <div className="global-progress-fill" style={{ width: globalPct + '%' }} />
        </div>
        <div className="global-progress-pct">{globalPct}% complete · {doneTasks}/{totalTasks} tasks</div>

        {/* Signed-in user */}
        {session?.user?.email && (
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 10, letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            ✦ {session.user.email}
          </div>
        )}

        <button style={btnStyle} onClick={onHome} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
          ← View landing
        </button>
        <button style={btnStyle} onClick={signOut} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
          Sign out
        </button>
      </div>
    </aside>
  )
}
