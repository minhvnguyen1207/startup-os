import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase.js'

export function useCloudData(userId) {
  const [tasks, setTasksState] = useState({})
  const [notes, setNotesState] = useState({})
  const [journal, setJournalState] = useState([])
  const [loading, setLoading] = useState(true)
  const notesDebounce = useRef(null)
  const prevNotes = useRef({})

  // ── Load all data once on mount ────────────────────────────────
  useEffect(() => {
    if (!userId) return

    async function loadAll() {
      setLoading(true)
      const [tasksRes, notesRes, journalRes] = await Promise.all([
        supabase
          .from('tasks')
          .select('task_key, completed')
          .eq('user_id', userId),
        supabase
          .from('notes')
          .select('phase_id, content')
          .eq('user_id', userId),
        supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
      ])

      if (tasksRes.data) {
        const t = {}
        tasksRes.data.forEach(r => { if (r.completed) t[r.task_key] = true })
        setTasksState(t)
      }

      if (notesRes.data) {
        const n = {}
        notesRes.data.forEach(r => { n[r.phase_id] = r.content })
        setNotesState(n)
        prevNotes.current = n
      }

      if (journalRes.data) {
        setJournalState(journalRes.data.map(r => ({
          id: r.id,
          text: r.content,
          tag: r.tag,
          createdAt: r.created_at,
        })))
      }

      setLoading(false)
    }

    loadAll()
  }, [userId])

  // ── Tasks — immediate UPSERT on toggle ─────────────────────────
  function setTasks(updater) {
    setTasksState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater

      // Find changed keys and sync each
      const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)])
      allKeys.forEach(key => {
        const wasOn = !!prev[key]
        const isOn = !!next[key]
        if (wasOn !== isOn) {
          supabase.from('tasks').upsert({
            user_id: userId,
            task_key: key,
            completed: isOn,
            updated_at: new Date().toISOString(),
          }).then(({ error }) => {
            if (error) console.error('Task sync error:', error.message)
          })
        }
      })

      return next
    })
  }

  // ── Notes — debounced UPSERT (600ms after last keystroke) ──────
  function setNotes(updater) {
    setNotesState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater

      if (notesDebounce.current) clearTimeout(notesDebounce.current)
      notesDebounce.current = setTimeout(() => {
        Object.entries(next).forEach(([phaseId, content]) => {
          if (prevNotes.current[phaseId] !== content) {
            supabase.from('notes').upsert({
              user_id: userId,
              phase_id: phaseId,
              content,
              updated_at: new Date().toISOString(),
            }).then(({ error }) => {
              if (error) console.error('Notes sync error:', error.message)
            })
          }
        })
        prevNotes.current = next
      }, 600)

      return next
    })
  }

  // ── Journal — INSERT on add, DELETE on remove ──────────────────
  function setJournal(updater) {
    setJournalState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater

      if (next.length > prev.length) {
        // Entry added — find and INSERT it
        const added = next.find(e => !prev.some(p => p.id === e.id))
        if (added) {
          supabase.from('journal_entries').insert({
            id: added.id,
            user_id: userId,
            content: added.text,
            tag: added.tag,
            created_at: added.createdAt,
          }).then(({ error }) => {
            if (error) console.error('Journal insert error:', error.message)
          })
        }
      } else if (next.length < prev.length) {
        // Entry deleted — find and DELETE it
        const deleted = prev.find(e => !next.some(n => n.id === e.id))
        if (deleted) {
          supabase.from('journal_entries')
            .delete()
            .eq('id', deleted.id)
            .then(({ error }) => {
              if (error) console.error('Journal delete error:', error.message)
            })
        }
      }

      return next
    })
  }

  return { tasks, setTasks, notes, setNotes, journal, setJournal, loading }
}
