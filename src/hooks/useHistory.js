import { useState, useEffect } from 'react'
//
// Suggested shape — grouped by day, newest day first:
// [
//   { date: '2026-08-03', tasks: [{ id, label, trackedTime, finishedTimestamp }, ...] },
//   { date: '2026-08-02', tasks: [...] },
// ]
//
// OPEN QUESTION before you start (you flagged this yourself as "vielleicht"):
// there's no per-task "start time" anywhere in useTasks, only finishedTimestamp.
// useTasks.js *does* track a day-level `startedAt`, but it's stored under its own
// 'startedAt' key and gets overwritten every day — so it won't be there anymore
// once a day is history. If you want start/end per entry, decide now:
//   - i added a new 'startedAt' timestamp to the task, we need to pull out the first of the day

function useHistory() {
    // TODO 1: load 'history' from localStorage on init.
    // Mirror the pattern useTasks.js uses for loading 'tasks' (see useTasks.js:5-13):
    // useState(() => { try { ...JSON.parse(localStorage.getItem('history'))... } catch {...} })
    const [history, setHistory] = useState(() => {
        try {
            const savedHistory = localStorage.getItem('history')
            return savedHistory ? JSON.parse(savedHistory) : []
        } catch (e) {
            console.error('Failed to load history from localStorage:', e)
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem('history', JSON.stringify(history))
    }, [history])

    // TODO 3: addToHistory(task) — called from toggleDone when isNowDone === true.
    //   - figure out the day key from task.finishedTimestamp (formatDate() or
    //     toDateString())
    //   - if that day already has an entry, push/replace this task inside its
    //     `tasks` array (replace-by-id, so a done -> undone -> done cycle doesn't
    //     create a duplicate)
    //   - if it's a new day, create a new entry and put it at the front (history
    //     should stay newest-first)
    const addToHistory = (task) => {
        const dayKey = new Date(task.finishedTimestamp).toDateString()
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

    const removeFromHistory = (taskId) => {
        setHistory(currentHistory => {
            const updatedHistory = currentHistory.map(entry => {
                const updatedTasks = entry.tasks.filter(t => t.id !== taskId)
                return { ...entry, tasks: updatedTasks }
            }).filter(entry => entry.tasks.length > 0) // Remove empty days
            return updatedHistory
        })
    }

    return { history, addToHistory, removeFromHistory }
}

export default useHistory
