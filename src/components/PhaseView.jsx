import { useState } from 'react'
import { PHASES } from '../data/phases.js'

export default function PhaseView({ phaseId, tasks, setTasks, notes, setNotes }) {
  const phase = PHASES.find(p => p.id === phaseId)
  if (!phase) return null

  const allIds = phase.sections.flatMap(s => s.tasks.map(t => phase.id + '|' + t.id))
  const done = allIds.filter(id => tasks[id]).length
  const total = allIds.length
  const pct = total ? Math.round((done / total) * 100) : 0
  const isComplete = pct === 100

  function toggleTask(taskId) {
    const key = phase.id + '|' + taskId
    setTasks(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function updateNote(value) {
    setNotes(prev => ({ ...prev, [phase.id]: value }))
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-eyebrow" style={{ color: phase.color }}>{phase.timeline}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <div className="page-header-title">{phase.title}</div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 400 }}>
            {pct}% · {done}/{total}
          </div>
        </div>
        <div className="page-header-sub">{phase.subtitle}</div>
        <div style={{ marginTop: 14 }}>
          <div className="phase-bar" style={{ width: 260 }}>
            <div className="phase-bar-fill" style={{ width: pct + '%', background: phase.color }} />
          </div>
        </div>
      </div>

      <div className="page-content">

        {isComplete && (
          <div className="phase-complete-banner">
            <span style={{ fontSize: 20 }}>✦</span>
            <span className="phase-complete-banner-text">
              {phase.title} complete — every task done. On to the next chapter.
            </span>
          </div>
        )}

        {phase.sections.map((section, si) => (
          <div key={si} className="section-group">
            <div className="section-label">{section.label}</div>
            <div className="task-list">
              {section.tasks.map(task => {
                const key = phase.id + '|' + task.id
                const isDone = !!tasks[key]
                return (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isDone={isDone}
                    phaseColor={phase.color}
                    onToggle={() => toggleTask(task.id)}
                  />
                )
              })}
            </div>
          </div>
        ))}

        <div className="divider" />

        <div className="section-label">Phase notes</div>
        <div className="notes-pad">
          <div className="notes-pad-header">Autosaved · synced across devices</div>
          <textarea
            className="notes-pad-textarea"
            placeholder={`Decisions, contacts, blockers, next steps for ${phase.title}…`}
            value={notes[phase.id] || ''}
            onChange={e => updateNote(e.target.value)}
          />
        </div>

      </div>
    </div>
  )
}

function TaskItem({ task, isDone, phaseColor, onToggle }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="task-item" style={{ flexDirection: 'column', gap: 0, padding: 0 }}>
      <div
        style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px', width: '100%' }}
        onClick={() => { if (!isDone) setExpanded(e => !e) }}
      >
        <button
          className={`task-checkbox ${isDone ? 'checked' : task.blocker ? 'blocker' : ''}`}
          onClick={e => { e.stopPropagation(); onToggle() }}
          aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
        />
        <div className="task-body">
          <div className="task-meta-row">
            <div className={`task-name ${isDone ? 'done' : ''}`}>{task.name}</div>
            {!isDone && task.detail && (
              <button
                style={{ fontSize: 11, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 8px', flexShrink: 0 }}
                onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
              >
                {expanded ? '↑' : '↓'}
              </button>
            )}
          </div>

          {/* Tags always visible */}
          {!isDone && (
            <div className="task-tags">
              {task.blocker && <span className="tag tag-blocker">blocker</span>}
              {task.gap && <span className="tag tag-gap">gap</span>}
              <span className="tag tag-tool">{task.tool}</span>
              {task.link && (
                <a href={task.link} target="_blank" rel="noopener noreferrer"
                  className="task-link" onClick={e => e.stopPropagation()}>
                  open ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expandable detail */}
      {expanded && !isDone && (
        <div style={{
          padding: '0 18px 14px 48px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-raised)',
        }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65, paddingTop: 12 }}>
            {task.detail}
          </p>
        </div>
      )}
    </div>
  )
}
