import { useMemo } from 'react'
import { PHASES } from '../data/phases.js'

function ProgressRing({ pct, size = 110, stroke = 7, color = '#C8A86B' }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.7s ease' }} />
    </svg>
  )
}

export default function Dashboard({ tasks, setActiveView }) {
  const allTasks = PHASES.flatMap(p =>
    p.sections.flatMap(s => s.tasks.map(t => ({ ...t, phaseId: p.id, phaseTitle: p.title, phaseColor: p.color })))
  )
  const total = allTasks.length
  const done = allTasks.filter(t => tasks[t.phaseId + '|' + t.id]).length
  const pct = total ? Math.round((done / total) * 100) : 0
  const blockers = allTasks.filter(t => t.blocker && !tasks[t.phaseId + '|' + t.id]).length
  const gaps = allTasks.filter(t => t.gap && !tasks[t.phaseId + '|' + t.id]).length

  function phaseProgress(phase) {
    const ids = phase.sections.flatMap(s => s.tasks.map(t => phase.id + '|' + t.id))
    const d = ids.filter(id => tasks[id]).length
    return { done: d, total: ids.length, pct: ids.length ? Math.round((d / ids.length) * 100) : 0 }
  }

  // 3 next urgent tasks (blockers first, then gaps, then any)
  const todayTasks = useMemo(() => {
    const urgent = allTasks.filter(t => !tasks[t.phaseId + '|' + t.id] && (t.blocker || t.gap))
    const rest = allTasks.filter(t => !tasks[t.phaseId + '|' + t.id] && !t.blocker && !t.gap)
    return [...urgent, ...rest].slice(0, 3)
  }, [allTasks, tasks])

  return (
    <div>
      <div className="page-header">
        <div className="page-header-eyebrow">Overview</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <div className="page-header-title">Dashboard</div>
        </div>
        <div className="page-header-sub">Dak Lak → Melbourne · your launch command centre</div>
      </div>

      <div className="page-content">

        {/* Hero — progress ring + stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 32 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <ProgressRing pct={pct} />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="display" style={{ fontSize: 22, fontWeight: 300, color: 'var(--text-primary)', lineHeight: 1 }}>{pct}</span>
              <span style={{ fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>%</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="display-i" style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
              {pct === 0 && 'Every great journey starts with a single task.'}
              {pct > 0 && pct < 25 && 'Foundation work in progress — building the base.'}
              {pct >= 25 && pct < 50 && 'Good momentum. Keep the streak going.'}
              {pct >= 50 && pct < 75 && 'More than halfway there. The hard part is behind you.'}
              {pct >= 75 && pct < 100 && 'Almost. Final stretch — don\'t slow down now.'}
              {pct === 100 && 'Every task done. Time to focus on growth.'}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 16px', flex: 1 }}>
                <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 5 }}>Complete</div>
                <div className="display" style={{ fontSize: 20, fontWeight: 300 }}>{done}<span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>/{total}</span></div>
              </div>
              <div style={{ background: 'var(--bg-surface)', border: `1px solid ${blockers > 0 ? 'rgba(255,69,58,0.2)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', padding: '10px 16px', flex: 1 }}>
                <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 5 }}>Blockers</div>
                <div className="display" style={{ fontSize: 20, fontWeight: 300, color: blockers > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>{blockers}</div>
              </div>
              <div style={{ background: 'var(--bg-surface)', border: `1px solid ${gaps > 0 ? 'rgba(255,159,10,0.2)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', padding: '10px 16px', flex: 1 }}>
                <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 5 }}>Gaps</div>
                <div className="display" style={{ fontSize: 20, fontWeight: 300, color: gaps > 0 ? 'var(--warn)' : 'var(--text-primary)' }}>{gaps}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's focus */}
        {todayTasks.length > 0 && (
          <>
            <div className="section-label" style={{ paddingTop: 0 }}>Today's focus</div>
            <div className="today-card">
              <div className="today-card-header">
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>Next 3 actions to move forward</span>
                <button
                  onClick={() => setActiveView(todayTasks[0]?.phaseId)}
                  style={{ fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  go to phase →
                </button>
              </div>
              {todayTasks.map((t, i) => (
                <div
                  key={t.phaseId + '|' + t.id}
                  className="today-task-item"
                  onClick={() => setActiveView(t.phaseId)}
                >
                  <span className="today-task-num">{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3 }}>
                      {t.phaseTitle}
                      {t.blocker && <span style={{ marginLeft: 8, color: 'var(--danger)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>blocker</span>}
                      {t.gap && !t.blocker && <span style={{ marginLeft: 8, color: 'var(--warn)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>gap</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0 }}>→</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Phase progress */}
        <div className="section-label">Phase progress</div>
        <div className="phase-overview-grid">
          {PHASES.map(phase => {
            const { done: pd, total: pt, pct: ppct } = phaseProgress(phase)
            return (
              <div
                key={phase.id}
                className="phase-card"
                style={{ '--phase-accent': phase.color }}
                onClick={() => setActiveView(phase.id)}
                role="button" tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setActiveView(phase.id)}
              >
                <div className="phase-card-top">
                  <div>
                    <div className="phase-card-title">{phase.title}</div>
                    <div className="phase-card-timeline">{phase.timeline}</div>
                  </div>
                  <div className="phase-card-pct" style={{ color: ppct === 100 ? 'var(--green)' : 'var(--text-secondary)' }}>
                    {ppct === 100 ? '✓' : `${ppct}%`}
                  </div>
                </div>
                <div className="phase-bar">
                  <div className="phase-bar-fill" style={{ width: ppct + '%', background: phase.color }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 7 }}>
                  {pd} of {pt} tasks · <span style={{ color: phase.color, opacity: 0.8 }}>{phase.subtitle}</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
