import { useState, useEffect } from 'react'

// Grouped by day, newest day first:
// [
//   { date: '2026-08-03', tasks: [{ id, label, trackedTime, finishedTimestamp }, ...] },
//   { date: '2026-08-02', tasks: [...] },
// ]
function useHistory() {
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
