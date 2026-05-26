import { useState } from 'react'
import { PHASES } from '../data/phases.js'

const TAGS = ['general', 'brand', 'supply chain', 'digital', 'marketing', 'operations', 'milestone', 'decision']

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-AU', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function getTodayStr() {
  return new Date().toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

export default function JournalView({ entries, setEntries }) {
  const [draft, setDraft] = useState('')
  const [tag, setTag] = useState('general')

  function addEntry() {
    if (!draft.trim()) return
    const entry = {
      id: Date.now().toString(),
      text: draft.trim(),
      tag,
      createdAt: new Date().toISOString(),
    }
    setEntries(prev => [entry, ...prev])
    setDraft('')
    setTag('general')
  }

  function deleteEntry(id) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') addEntry()
  }

  return (
    <div className="journal-view">
      <div className="page-header">
        <div className="page-header-eyebrow">Daily log</div>
        <div className="page-header-title">Journal</div>
        <div className="page-header-sub">Decisions, progress, blockers — your startup diary</div>
      </div>
      <div className="page-content">

        <div className="journal-input-area">
          <div className="journal-input-header">
            <span className="journal-date">{getTodayStr()}</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>⌘+Enter to save</span>
          </div>
          <textarea
            className="journal-textarea"
            placeholder="What happened today? Any decisions made, blockers hit, progress notes..."
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="journal-actions">
            <select
              className="journal-tag-select"
              value={tag}
              onChange={e => setTag(e.target.value)}
            >
              {TAGS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button
              className="btn-primary"
              onClick={addEntry}
              disabled={!draft.trim()}
            >
              Save entry
            </button>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="empty-state">
            No entries yet. Start logging your progress — even small notes compound into a useful history.
          </div>
        ) : (
          <div className="journal-entries">
            {entries.map(entry => (
              <div key={entry.id} className="journal-entry">
                <div className="journal-entry-header">
                  <span className="journal-entry-date">{formatDate(entry.createdAt)}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="journal-entry-tag">{entry.tag}</span>
                    <button
                      className="btn-danger-ghost"
                      onClick={() => deleteEntry(entry.id)}
                      title="Delete entry"
                    >
                      delete
                    </button>
                  </div>
                </div>
                <div className="journal-entry-body">{entry.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
