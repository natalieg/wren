import { useState, useEffect } from 'react'


function useTasks(newTask = "", taskTime = 20) {
    const [taskList, setTaskList] = useState(() => {
        try {
            const savedTasks = localStorage.getItem('tasks')
            return savedTasks ? JSON.parse(savedTasks) : []
        } catch (e) {
            console.error('Failed to load tasks from localStorage:', e)
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(taskList))
    }, [taskList])

    // Resets the 'startedAt' timestamp if it's the next day
    // TODO add manual reset
    // TODO add user configurable reset hour
    const [startedAt] = useState(() => {
        try {
            const saved = localStorage.getItem('startedAt')
            if (saved) {
                const savedDate = new Date(saved)
                if (savedDate.toDateString() === new Date().toDateString()) {
                    return savedDate
                }
            }
        } catch (e) {
            console.error('Failed to load startedAt from localStorage:', e)
        }
        const fresh = new Date()
        localStorage.setItem('startedAt', fresh.toISOString())
        return fresh
    })

    const toggleDone = (id) => {
        setTaskList(taskList.map(t => t.id === id ? { ...t, done: !t.done } : t))
    }

    const toggleActive = (id) => {
        setTaskList(taskList.map(t => t.id === id ? { ...t, active: !t.active } : t))
    }

    const handleAddTask = () => {
        if (newTask?.trim() === '') return
        const newId = taskList.length > 0 ? Math.max(...taskList.map(t => t.id)) + 1 : 1
        setTaskList([...taskList, { id: newId, label: newTask, time: taskTime, active: true, done: false }])
    }

    const handleFieldChange = (id, field, value) => {
        setTaskList(taskList.map(t => t.id === id ? { ...t, [field]: value } : t))
    }

    const handleDeleteTask = (id) => {
        setTaskList(taskList.filter(t => t.id !== id))
    }

    const deleteAllFinishedTasks = () => {
        setTaskList(taskList.filter(t => !t.done))
    }

    const taskActions = {
        toggleDone,
        toggleActive,
        handleAddTask,
        onDelete: handleDeleteTask,
        handleFieldChange,
        deleteAllFinishedTasks,
        setTaskList
    }

    const openTasks = taskList.filter(t => !t.done && t.active)
    const inactiveTasks = taskList.filter(t => !t.done && !t.active)
    const finishedTasks = taskList.filter(t => t.done)


    return { taskList, openTasks, inactiveTasks, finishedTasks, taskActions, startedAt }
}

export default useTasks