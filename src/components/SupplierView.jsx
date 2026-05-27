import { useState } from 'react'

const STAGES = ['Cold', 'Contacted', 'Sampled', 'Negotiating', 'Signed', 'Active']

const STAGE_COLORS = {
  Cold:        'var(--text-tertiary)',
  Contacted:   '#8B84E8',
  Sampled:     'var(--warn)',
  Negotiating: '#FF9F0A',
  Signed:      'var(--accent)',
  Active:      'var(--green)',
}

const EMPTY_DRAFT = {
  name: '', region: '', contact: '', pricePerKg: '', moqKg: '', notes: '', stage: 'Cold', cuppings: []
}

function SupplierCard({ sup, onUpdate, onDelete }) {
  const [open, setOpen]     = useState(false)
  const [cup, setCup]       = useState({ batch: '', score: '', notes: '' })

  const avgScore = sup.cuppings?.length
    ? (sup.cuppings.reduce((s, c) => s + (parseFloat(c.score) || 0), 0) / sup.cuppings.length).toFixed(1)
    : null

  function addCupping() {
    if (!cup.batch.trim()) return
    onUpdate({ cuppings: [...(sup.cuppings || []), { ...cup, id: `cup-${Date.now()}`, date: new Date().toISOString() }] })
    setCup({ batch: '', score: '', notes: '' })
  }

  function removeCupping(id) {
    onUpdate({ cuppings: sup.cuppings.filter(c => c.id !== id) })
  }

  return (
    <div className="supplier-card">
      <div className="supplier-card-header" onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: STAGE_COLORS[sup.stage] || 'var(--text-tertiary)'
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{sup.name}</div>
            {sup.region && <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{sup.region}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {avgScore && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, color: 'var(--accent)', lineHeight: 1 }}>{avgScore}</div>
              <div style={{ fontSize: 9, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>avg cup</div>
            </div>
          )}
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{open ? '↑' : '↓'}</span>
        </div>
      </div>

      {open && (
        <div className="supplier-card-body">

          {/* Stage pills */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8 }}>Pipeline stage</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {STAGES.map(s => (
                <button key={s} className={`stage-pill ${sup.stage === s ? 'active' : ''}`}
                  onClick={() => onUpdate({ stage: s })}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            {[
              { label: 'Contact (email / WhatsApp)', key: 'contact', span: true },
              { label: 'Price / kg (AUD)',            key: 'pricePerKg', type: 'number' },
              { label: 'MOQ (kg)',                    key: 'moqKg',     type: 'number' },
            ].map(f => (
              <div key={f.key} style={f.span ? { gridColumn: '1 / -1' } : {}}>
                <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 5 }}>{f.label}</div>
                <input
                  type={f.type || 'text'}
                  value={sup[f.key] || ''}
                  onChange={e => onUpdate({ [f.key]: e.target.value })}
                  className="fin-input"
                  style={{ width: '100%', textAlign: 'left' }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 5 }}>Notes</div>
            <textarea
              value={sup.notes || ''}
              onChange={e => onUpdate({ notes: e.target.value })}
              placeholder="Relationship notes, sample quality, terms discussed…"
              style={{
                width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '8px 10px',
                fontSize: 12, color: 'var(--text-primary)', resize: 'vertical',
                outline: 'none', lineHeight: 1.6, minHeight: 60,
              }}
            />
          </div>

          {/* Cupping log */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>
              Cupping log · {sup.cuppings?.length || 0} session{sup.cuppings?.length !== 1 ? 's' : ''}
            </div>

            {sup.cuppings?.map(c => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '9px 0', borderBottom: '1px solid var(--border)',
              }}>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, color: 'var(--accent)', minWidth: 44, lineHeight: 1 }}>{c.score}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{c.batch}</div>
                  {c.notes && <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{c.notes}</div>}
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {new Date(c.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeCupping(c.id)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 14, cursor: 'pointer', padding: '0 2px' }}>×</button>
              </div>
            ))}

            {/* Add cupping */}
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
                <input
                  value={cup.batch}
                  onChange={e => setCup(c => ({ ...c, batch: e.target.value }))}
                  placeholder="Batch name / lot ID"
                  className="fin-input" style={{ width: '100%', textAlign: 'left' }}
                />
                <input
                  type="number" min="0" max="100"
                  value={cup.score}
                  onChange={e => setCup(c => ({ ...c, score: e.target.value }))}
                  placeholder="/100"
                  className="fin-input" style={{ width: 72 }}
                />
              </div>
              <input
                value={cup.notes}
                onChange={e => setCup(c => ({ ...c, notes: e.target.value }))}
                placeholder="Tasting notes — chocolate, citrus, body, finish…"
                className="fin-input" style={{ width: '100%', textAlign: 'left' }}
              />
              <button onClick={addCupping} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                Log cupping session
              </button>
            </div>
          </div>

          <button className="btn-danger-ghost" onClick={onDelete}>Remove farm</button>
        </div>
      )}
    </div>
  )
}

export default function SupplierView({ suppliers, setSuppliers }) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft]   = useState(EMPTY_DRAFT)

  function addSupplier() {
    if (!draft.name.trim()) return
    setSuppliers(s => [...s, { ...draft, id: `sup-${Date.now()}`, cuppings: [] }])
    setDraft(EMPTY_DRAFT)
    setAdding(false)
  }

  function updateSupplier(id, updates) {
    setSuppliers(s => s.map(sup => sup.id === id ? { ...sup, ...updates } : sup))
  }

  function deleteSupplier(id) {
    setSuppliers(s => s.filter(sup => sup.id !== id))
  }

  // Group by stage
  const grouped = STAGES.reduce((acc, stage) => {
    const inStage = suppliers.filter(s => s.stage === stage)
    if (inStage.length) acc[stage] = inStage
    return acc
  }, {})

  return (
    <div>
      <div className="page-header">
        <div className="page-header-eyebrow">Business</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="page-header-title">Suppliers</div>
          <button className="btn-primary" style={{ fontSize: 12, padding: '7px 16px' }} onClick={() => setAdding(true)}>
            + Add farm
          </button>
        </div>
        <div className="page-header-sub">Track farms from cold contact through to active supplier</div>
      </div>

      <div className="page-content">

        {/* Pipeline summary bar */}
        {suppliers.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
            {STAGES.map(stage => {
              const count = suppliers.filter(s => s.stage === stage).length
              if (!count) return null
              return (
                <div key={stage} style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '8px 14px',
                  display: 'flex', alignItems: 'center', gap: 7,
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: STAGE_COLORS[stage] }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{stage}</span>
                  <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 16, color: 'var(--text-primary)', lineHeight: 1 }}>{count}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Add form */}
        {adding && (
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 20,
          }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 14 }}>New farm / supplier</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {[
                { label: 'Farm or supplier name', key: 'name', span: true },
                { label: 'Region',   key: 'region',   placeholder: 'Dak Lak, Lam Dong…' },
                { label: 'Contact',  key: 'contact',  placeholder: 'Email, WhatsApp, phone' },
                { label: 'Price / kg (AUD)', key: 'pricePerKg', type: 'number' },
                { label: 'MOQ (kg)',         key: 'moqKg',      type: 'number' },
              ].map(f => (
                <div key={f.key} style={f.span ? { gridColumn: '1 / -1' } : {}}>
                  <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 5 }}>{f.label}</div>
                  <input
                    type={f.type || 'text'}
                    placeholder={f.placeholder || ''}
                    value={draft[f.key] || ''}
                    onChange={e => setDraft(d => ({ ...d, [f.key]: e.target.value }))}
                    className="fin-input" style={{ width: '100%', textAlign: 'left' }}
                    autoFocus={f.key === 'name'}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" onClick={addSupplier}>Save farm</button>
              <button className="btn-ghost" onClick={() => { setAdding(false); setDraft(EMPTY_DRAFT) }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {suppliers.length === 0 && !adding && (
          <div className="empty-state">
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: 'italic', fontSize: 16, marginBottom: 8 }}>
              No farms in the pipeline yet.
            </div>
            <div style={{ fontSize: 12, marginBottom: 16 }}>
              Start with farms your father already knows in Dak Lak — they're your warmest leads.
            </div>
            <button className="btn-primary" onClick={() => setAdding(true)}>Add your first farm</button>
          </div>
        )}

        {/* Grouped by stage */}
        {Object.entries(grouped).map(([stage, farms]) => (
          <div key={stage} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: STAGE_COLORS[stage] }} />
              <span style={{ fontSize: 9, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                {stage} · {farms.length}
              </span>
            </div>
            {farms.map(sup => (
              <SupplierCard
                key={sup.id}
                sup={sup}
                onUpdate={u => updateSupplier(sup.id, u)}
                onDelete={() => deleteSupplier(sup.id)}
              />
            ))}
          </div>
        ))}

      </div>
    </div>
  )
}
