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


    return { taskList, openTasks, inactiveTasks, finishedTasks, taskActions }
}

export default useTasks