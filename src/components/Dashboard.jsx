import { PHASES } from '../data/phases.js'

export default function Dashboard({ tasks, setActiveView }) {
  const allTasks = PHASES.flatMap(p =>
    p.sections.flatMap(s => s.tasks.map(t => ({ ...t, phaseId: p.id })))
  )
  const total = allTasks.length
  const done = allTasks.filter(t => tasks[t.phaseId + '|' + t.id]).length
  const blockers = allTasks.filter(t => t.blocker && !tasks[t.phaseId + '|' + t.id]).length
  const gaps = allTasks.filter(t => t.gap && !tasks[t.phaseId + '|' + t.id]).length

  function phaseProgress(phase) {
    const ids = phase.sections.flatMap(s => s.tasks.map(t => phase.id + '|' + t.id))
    const d = ids.filter(id => tasks[id]).length
    return { done: d, total: ids.length, pct: ids.length ? Math.round((d / ids.length) * 100) : 0 }
  }

  const nextUp = allTasks
    .filter(t => !tasks[t.phaseId + '|' + t.id] && (t.blocker || t.gap))
    .slice(0, 4)

  return (
    <div>
      <div className="page-header">
        <div className="page-header-eyebrow">Overview</div>
        <div className="page-header-title">Dashboard</div>
        <div className="page-header-sub">Your launch roadmap — Dak Lak → Australia</div>
      </div>
      <div className="page-content">

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total tasks</div>
            <div className="stat-value">{total}</div>
            <div className="stat-sub">across 5 phases</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Complete</div>
            <div className="stat-value">{done}</div>
            <div className="stat-sub">{total ? Math.round((done/total)*100) : 0}% done</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Blockers</div>
            <div className="stat-value danger">{blockers}</div>
            <div className="stat-sub">need resolution first</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Gaps</div>
            <div className="stat-value warn">{gaps}</div>
            <div className="stat-sub">flagged missing items</div>
          </div>
        </div>

        <div className="section-label">Phase progress</div>
        <div className="phase-overview-grid" style={{ marginBottom: 28 }}>
          {PHASES.map(phase => {
            const { done: pd, total: pt, pct } = phaseProgress(phase)
            return (
              <div
                key={phase.id}
                className="phase-card"
                onClick={() => setActiveView(phase.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setActiveView(phase.id)}
              >
                <div className="phase-card-top">
                  <div>
                    <div className="phase-card-title">{phase.title}</div>
                    <div className="phase-card-timeline">{phase.timeline}</div>
                  </div>
                  <div className="phase-card-pct">{pct}%</div>
                </div>
                <div className="phase-bar">
                  <div className="phase-bar-fill" style={{ width: pct + '%', background: phase.color }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>
                  {pd} of {pt} tasks done
                </div>
              </div>
            )
          })}
        </div>

        {nextUp.length > 0 && (
          <>
            <div className="section-label">Priority items</div>
            <div className="task-list">
              {nextUp.map(t => {
                const phase = PHASES.find(p => p.id === t.phaseId)
                return (
                  <div
                    key={t.phaseId + '|' + t.id}
                    className="task-item"
                    onClick={() => setActiveView(t.phaseId)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={`task-checkbox blocker`} />
                    <div className="task-body">
                      <div className="task-meta-row">
                        <div className="task-name">{t.name}</div>
                      </div>
                      <div className="task-detail">{t.detail}</div>
                      <div className="task-tags">
                        {t.blocker && <span className="tag tag-blocker">blocker</span>}
                        {t.gap && <span className="tag tag-gap">gap</span>}
                        <span className="tag tag-tool">{phase?.title}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
