import { PHASES } from '../data/phases.js'
import { supabase } from '../lib/supabase.js'

const NAV_OVERVIEW  = [{ id: 'dashboard', label: 'Dashboard' }, { id: 'journal', label: 'Journal' }]
const NAV_BUSINESS  = [{ id: 'financial', label: 'Financial' }, { id: 'suppliers', label: 'Suppliers' }]

const btnStyle = {
  marginTop: 5,
  background: 'transparent',
  border: '1px solid var(--border)',
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
  const doneTasks  = allTaskIds.filter(id => tasks[id]).length
  const globalPct  = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0

  function phaseProgress(phase) {
    const ids  = phase.sections.flatMap(s => s.tasks.map(t => phase.id + '|' + t.id))
    const done = ids.filter(id => tasks[id]).length
    return { done, total: ids.length }
  }

  function signOut() { supabase.auth.signOut() }

  const hoverOn  = e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }
  const hoverOff = e => { e.currentTarget.style.color = 'var(--text-tertiary)';  e.currentTarget.style.borderColor = 'var(--border)' }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">Startup OS</div>
        <div className="sidebar-logo-name">Dak Lak Coffee</div>
        <div className="sidebar-logo-sub">Minh &amp; Father · Melbourne</div>
      </div>

      <nav className="sidebar-nav">

        <div className="sidebar-section-label">Overview</div>
        {NAV_OVERVIEW.map(item => (
          <button key={item.id}
            className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >{item.label}</button>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: 6 }}>Phases</div>
        {PHASES.map(phase => {
          const { done, total } = phaseProgress(phase)
          const isComplete = done === total && total > 0
          return (
            <button key={phase.id}
              className={`sidebar-item ${activeView === phase.id ? 'active' : ''}`}
              onClick={() => setActiveView(phase.id)}
            >
              <span className="sidebar-dot"
                style={{ background: phase.color, boxShadow: isComplete ? `0 0 6px ${phase.color}55` : 'none' }} />
              <span style={{ flex: 1, textAlign: 'left', lineHeight: 1.3 }}>{phase.title}</span>
              <span className="sidebar-progress" style={{ color: isComplete ? 'var(--green)' : undefined }}>
                {isComplete ? '✓' : `${done}/${total}`}
              </span>
            </button>
          )
        })}

        <div className="sidebar-section-label" style={{ marginTop: 6 }}>Business</div>
        {NAV_BUSINESS.map(item => (
          <button key={item.id}
            className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >{item.label}</button>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: 6 }}>Resources</div>
        <button
          className={`sidebar-item ${activeView === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveView('resources')}
        >Tool stack</button>

      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-label">Overall progress</div>
        <div className="global-progress-bar">
          <div className="global-progress-fill" style={{ width: globalPct + '%' }} />
        </div>
        <div className="global-progress-pct">{globalPct}% · {doneTasks}/{totalTasks} tasks</div>

        {session?.user?.email && (
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 10, letterSpacing: '0.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            ✦ {session.user.email}
          </div>
        )}

        <button style={btnStyle} onClick={onHome} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>← Landing page</button>
        <button style={btnStyle} onClick={signOut} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Sign out</button>
      </div>
    </aside>
  )
}
