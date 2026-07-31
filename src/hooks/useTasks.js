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
    const [newActionTime, setNewActionTime] = useState(null)
    const activeTasks = taskList.filter(t => t.active && !t.done)

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

    const updateActionTime = () => {
        if (activeTasks.length === 0) {
            setNewActionTime(new Date())
        }
    }

    const toggleDone = (id) => {
        const newTaskList = taskList.map((task) => {
            if (task.id !== id) return task
            const isNowDone = !task.done
            return { ...task, done: isNowDone, finishedTimestamp: isNowDone ? new Date() : null }
        })
        setTaskList(newTaskList)
    }

    const toggleActive = (id) => {
        setTaskList(taskList.map(t => t.id === id ? { ...t, active: !t.active } : t))
    }

    const handleAddTask = () => {
        if (newTask?.trim() === '') return
        const newId = taskList.length > 0 ? Math.max(...taskList.map(t => t.id)) + 1 : 1
        setTaskList([...taskList, { id: newId, label: newTask, time: taskTime, active: true, done: false }])
        updateActionTime()
    }

    const handleFieldChange = (id, field, value) => {
        setTaskList(taskList.map(t => t.id === id ? { ...t, [field]: value } : t))
        updateActionTime()
    }

    const handleDeleteTask = (id) => {
        setTaskList(taskList.filter(t => t.id !== id))
        updateActionTime()
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
        setTaskList,
    }

    const finishedTasks = taskList.filter(t => t.done)

    //baseTime is either [startedAt], [last finished task], or [new task created time] if no tasks are active
    const baseTime = Math.max(
        startedAt.getTime(),
        ...finishedTasks.map(t => new Date(t.finishedTimestamp).getTime()),
        newActionTime)

    const openTasksResult = activeTasks?.reduce((acc, task) => {
        const estimateTime = acc.runningTime + task.time * 60000 // in ms
        const taskWithEstimate = { ...task, estimate: new Date(estimateTime) }
        return { runningTime: estimateTime, list: [...acc.list, taskWithEstimate] }
    }, { runningTime: baseTime, list: [] })

    const openTasks = openTasksResult.list

    // add 'possibleEstimate' timestamp to each task, anchored after the last
    // active task's estimate (or baseTime, when nothing's active — the reduce
    // above leaves runningTime unchanged in that case)
    const inactiveTasks = taskList.filter(t => !t.done && !t.active).map((task) => {
        return { ...task, possibleEstimate: new Date(openTasksResult.runningTime + task.time * 60000) }
    })

    return { taskList, openTasks, inactiveTasks, finishedTasks, taskActions, startedAt, updateActionTime }
}

export default useTasks