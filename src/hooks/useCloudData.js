import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase.js'

const DEFAULT_FINANCIAL = {
  costs: {
    fobPerKg: 4.50, freightPerKg: 0.85, brokerPerShipment: 400, avgShipmentKg: 200,
    dutyPct: 0, gstPct: 10, threePlPerKg: 1.20, packagingPerKg: 2.50,
    shopifyFeePct: 2, shippingPerOrder: 9.00, avgOrderGrams: 500, avgOrderValue: 45,
  },
  budget: [
    { id: 'setup',       label: 'Company registration + legal',  budgeted: 2000,  spent: 0 },
    { id: 'inventory',   label: 'First inventory order',          budgeted: 15000, spent: 0 },
    { id: 'brand',       label: 'Branding + packaging design',    budgeted: 4000,  spent: 0 },
    { id: 'photo',       label: 'Vietnam photography trip',       budgeted: 3500,  spent: 0 },
    { id: 'shopify',     label: 'Shopify setup + apps',           budgeted: 1200,  spent: 0 },
    { id: 'marketing',   label: 'Marketing — first 3 months',     budgeted: 4500,  spent: 0 },
    { id: 'contingency', label: 'Contingency buffer',             budgeted: 3000,  spent: 0 },
  ],
  forecast: {
    startOrders: 20, growthPct: 15, avgOrderValue: 45, fixedMonthly: 500,
  },
}

export function useCloudData(userId) {
  const [tasks,     setTasksState]     = useState({})
  const [notes,     setNotesState]     = useState({})
  const [journal,   setJournalState]   = useState([])
  const [financial, setFinancialState] = useState(DEFAULT_FINANCIAL)
  const [suppliers, setSuppliersState] = useState([])
  const [loading,   setLoading]        = useState(true)

  const notesDebounce     = useRef(null)
  const financialDebounce = useRef(null)
  const suppliersDebounce = useRef(null)
  const prevNotes         = useRef({})

  // ── Load all data on mount ────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) { setLoading(false); return }

    async function loadAll() {
      setLoading(true)
      const [tasksRes, notesRes, journalRes] = await Promise.all([
        supabase.from('tasks').select('task_key, completed').eq('user_id', userId),
        supabase.from('notes').select('phase_id, content').eq('user_id', userId),
        supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      ])

      if (tasksRes.data) {
        const t = {}
        tasksRes.data.forEach(r => { if (r.completed) t[r.task_key] = true })
        setTasksState(t)
      }

      if (notesRes.data) {
        const n = {}
        notesRes.data.forEach(r => {
          if (r.phase_id === '__financial__') {
            try { setFinancialState(prev => ({ ...DEFAULT_FINANCIAL, ...JSON.parse(r.content) })) } catch {}
          } else if (r.phase_id === '__suppliers__') {
            try { setSuppliersState(JSON.parse(r.content) || []) } catch {}
          } else {
            n[r.phase_id] = r.content
          }
        })
        setNotesState(n)
        prevNotes.current = n
      }

      if (journalRes.data) {
        setJournalState(journalRes.data.map(r => ({
          id: r.id, text: r.content, tag: r.tag, createdAt: r.created_at,
        })))
      }

      setLoading(false)
    }

    loadAll()
  }, [userId])

  // ── Tasks — immediate UPSERT on toggle ───────────────────────────────────
  function setTasks(updater) {
    setTasksState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)])
      allKeys.forEach(key => {
        if (!!prev[key] !== !!next[key]) {
          supabase.from('tasks').upsert({
            user_id: userId, task_key: key,
            completed: !!next[key], updated_at: new Date().toISOString(),
          }).then(({ error }) => { if (error) console.error('Task sync error:', error.message) })
        }
      })
      return next
    })
  }

  // ── Notes — debounced UPSERT (600ms) ────────────────────────────────────
  function setNotes(updater) {
    setNotesState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (notesDebounce.current) clearTimeout(notesDebounce.current)
      notesDebounce.current = setTimeout(() => {
        Object.entries(next).forEach(([phaseId, content]) => {
          if (prevNotes.current[phaseId] !== content) {
            supabase.from('notes').upsert({
              user_id: userId, phase_id: phaseId, content, updated_at: new Date().toISOString(),
            }).then(({ error }) => { if (error) console.error('Notes sync error:', error.message) })
          }
        })
        prevNotes.current = next
      }, 600)
      return next
    })
  }

  // ── Journal — INSERT on add, DELETE on remove ────────────────────────────
  function setJournal(updater) {
    setJournalState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (next.length > prev.length) {
        const added = next.find(e => !prev.some(p => p.id === e.id))
        if (added) {
          supabase.from('journal_entries').insert({
            id: added.id, user_id: userId, content: added.text,
            tag: added.tag, created_at: added.createdAt,
          }).then(({ error }) => { if (error) console.error('Journal insert error:', error.message) })
        }
      } else if (next.length < prev.length) {
        const deleted = prev.find(e => !next.some(n => n.id === e.id))
        if (deleted) {
          supabase.from('journal_entries').delete().eq('id', deleted.id)
            .then(({ error }) => { if (error) console.error('Journal delete error:', error.message) })
        }
      }
      return next
    })
  }

  // ── Financial — debounced UPSERT (800ms) ─────────────────────────────────
  function setFinancial(updater) {
    setFinancialState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (financialDebounce.current) clearTimeout(financialDebounce.current)
      financialDebounce.current = setTimeout(() => {
        supabase.from('notes').upsert({
          user_id: userId, phase_id: '__financial__',
          content: JSON.stringify(next), updated_at: new Date().toISOString(),
        }).then(({ error }) => { if (error) console.error('Financial sync error:', error.message) })
      }, 800)
      return next
    })
  }

  // ── Suppliers — debounced UPSERT (800ms) ─────────────────────────────────
  function setSuppliers(updater) {
    setSuppliersState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (suppliersDebounce.current) clearTimeout(suppliersDebounce.current)
      suppliersDebounce.current = setTimeout(() => {
        supabase.from('notes').upsert({
          user_id: userId, phase_id: '__suppliers__',
          content: JSON.stringify(next), updated_at: new Date().toISOString(),
        }).then(({ error }) => { if (error) console.error('Suppliers sync error:', error.message) })
      }, 800)
      return next
    })
  }

  return {
    tasks,     setTasks,
    notes,     setNotes,
    journal,   setJournal,
    financial, setFinancial,
    suppliers, setSuppliers,
    loading,
  }
}
