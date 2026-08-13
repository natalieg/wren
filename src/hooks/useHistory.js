import { useState, useEffect } from 'react'
import { logicalDayString } from '../utils/rollover'
import { loadSettings } from '../utils/settings'

// Grouped by day, newest day first:
// [
//   { date: '2026-08-03', tasks: [{ id, label, trackedTime, finishedTimestamp }, ...],
//     breaks: [{ id, type, name, emoji, trackedTime, finishedTimestamp }, ...] },
//   { date: '2026-08-02', tasks: [...], breaks: [...] },
// ]
// backfills breakTime for entries saved before that field existed — otherwise their
// breaks[] sessions are silently excluded from every breakTime read, once, forever
function normalizeBreakTime(entry) {
  if (entry.breakTime !== undefined) return entry
  const breakTime = (entry.breaks || []).reduce((total, b) => total + b.trackedTime, 0)
  return { ...entry, breakTime }
}

function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem('history')
      return savedHistory ? JSON.parse(savedHistory).map(normalizeBreakTime) : []
    } catch (e) {
      console.error('Failed to load history from localStorage:', e)
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history))
  }, [history])

  const addToHistory = (task) => {
    const settings = loadSettings()
    const dayKey = logicalDayString(new Date(task.finishedTimestamp), settings.rolloverHour)
    setHistory(currentHistory => {
      const existingEntryIndex = currentHistory.findIndex(entry => entry.date === dayKey)
      if (existingEntryIndex !== -1) {
        // Day already exists, update its tasks
        const updatedTasks = [...currentHistory[existingEntryIndex].tasks]
        const taskIndex = updatedTasks.findIndex(t => t.id === task.id)
        if (taskIndex !== -1) {
          updatedTasks[taskIndex] = task // Replace existing task
        } else {
          updatedTasks.push(task) // Add new task
        }
        const updatedEntry = { ...currentHistory[existingEntryIndex], tasks: updatedTasks }
        return [
          ...currentHistory.slice(0, existingEntryIndex),
          updatedEntry,
          ...currentHistory.slice(existingEntryIndex + 1)
        ]
      } else {
        // New day, create a new entry
        return [{ date: dayKey, tasks: [task] }, ...currentHistory]
      }
    })
  }

  // breakTime is a running total in seconds, kept alongside breaks[] on the day's
  // entry so a day's overall break time is a field read, not a reduce over sessions
  // every consumer has to redo — tasks don't have this (allTime in History.jsx
  // still reduces tasks[] itself), this is deliberately just for breaks for now
  const addBreakToHistory = (breakEntry) => {
   console.log('Adding break to history:', breakEntry)
    const settings = loadSettings()
    const dayKey = logicalDayString(new Date(breakEntry.finishedTimestamp), settings.rolloverHour)
    setHistory(currentHistory => {
      const existingEntryIndex = currentHistory.findIndex(entry => entry.date === dayKey)
      if (existingEntryIndex !== -1) {
        const existingEntry = currentHistory[existingEntryIndex]
        const updatedEntry = {
          ...existingEntry,
          breaks: [...(existingEntry.breaks || []), breakEntry],
          breakTime: (existingEntry.breakTime || 0) + breakEntry.trackedTime,
        }
        return [
          ...currentHistory.slice(0, existingEntryIndex),
          updatedEntry,
          ...currentHistory.slice(existingEntryIndex + 1)
        ]
      } else {
        return [{ date: dayKey, tasks: [], breaks: [breakEntry], breakTime: breakEntry.trackedTime }, ...currentHistory]
      }
    })
  }

  // today's accumulated breakTime, seconds — 0 once nothing's been logged yet today
  const todayBreakTime = (() => {
    const dayKey = logicalDayString(new Date(), loadSettings().rolloverHour)
    return history.find(entry => entry.date === dayKey)?.breakTime || 0
  })()

  const removeFromHistory = (taskId) => {
    setHistory(currentHistory => {
      const updatedHistory = currentHistory.map(entry => {
        const updatedTasks = entry.tasks.filter(t => t.id !== taskId)
        return { ...entry, tasks: updatedTasks }
      }).filter(entry => entry.tasks.length > 0) // Remove empty days
      return updatedHistory
    })
  }

  return { history, addToHistory, removeFromHistory, addBreakToHistory, todayBreakTime }
}

export default useHistory
