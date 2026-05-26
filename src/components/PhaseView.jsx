import { PHASES } from '../data/phases.js'

export default function PhaseView({ phaseId, tasks, setTasks, notes, setNotes }) {
  const phase = PHASES.find(p => p.id === phaseId)
  if (!phase) return null

  const allIds = phase.sections.flatMap(s => s.tasks.map(t => phase.id + '|' + t.id))
  const done = allIds.filter(id => tasks[id]).length
  const total = allIds.length
  const pct = total ? Math.round((done / total) * 100) : 0

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
        <div className="page-header-eyebrow" style={{ color: phase.color }}>
          {phase.timeline}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <div className="page-header-title">{phase.title}</div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 400 }}>
            {pct}% · {done}/{total}
          </div>
        </div>
        <div className="page-header-sub">{phase.subtitle}</div>
        <div style={{ marginTop: 12 }}>
          <div className="phase-bar" style={{ width: 240 }}>
            <div className="phase-bar-fill" style={{ width: pct + '%', background: phase.color }} />
          </div>
        </div>
      </div>

      <div className="page-content">
        {phase.sections.map((section, si) => (
          <div key={si} className="section-group">
            <div className="section-label">{section.label}</div>
            <div className="task-list">
              {section.tasks.map(task => {
                const key = phase.id + '|' + task.id
                const isDone = !!tasks[key]
                return (
                  <div
                    key={task.id}
                    className="task-item"
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className={`task-checkbox ${isDone ? 'checked' : task.blocker ? 'blocker' : ''}`} />
                    <div className="task-body">
                      <div className="task-meta-row">
                        <div className={`task-name ${isDone ? 'done' : ''}`}>{task.name}</div>
                      </div>
                      {!isDone && (
                        <div className="task-detail">{task.detail}</div>
                      )}
                      {!isDone && (
                        <div className="task-tags">
                          {task.blocker && <span className="tag tag-blocker">blocker</span>}
                          {task.gap && <span className="tag tag-gap">gap — not yet planned</span>}
                          <span className="tag tag-tool">{task.tool}</span>
                          {task.link && (
                            <a
                              href={task.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="task-link"
                              onClick={e => e.stopPropagation()}
                            >
                              open ↗
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div className="divider" />

        <div className="section-label">Phase notes</div>
        <div className="notes-pad">
          <div className="notes-pad-header">Saved automatically</div>
          <textarea
            className="notes-pad-textarea"
            placeholder={`Add notes for ${phase.title} — decisions made, contacts, questions, next steps...`}
            value={notes[phase.id] || ''}
            onChange={e => updateNote(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
