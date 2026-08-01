import { useState, useEffect, useRef } from 'react'


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
    const [runningTaskId, setRunningTaskId] = useState(null)
    const [trackedSeconds, setTrackedSeconds] = useState(0)
    const trackedSecondsRef = useRef(0)

    // keeps a live, always-current mirror of trackedSeconds for code that
    // can't rely on the render-scoped closure (flushTrackedTime, called from intervals)
    useEffect(() => {
        trackedSecondsRef.current = trackedSeconds
    }, [trackedSeconds])

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(taskList))
    }, [taskList])

    useEffect(() => {
        if (!runningTaskId) return
        const interval = setInterval(() => {
            setTrackedSeconds(prevTrackedSeconds => prevTrackedSeconds + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [runningTaskId])

    // Resets the 'startedAt' timestamp if it's the next day
    // LATER add manual reset
    // LATER add user configurable reset hour
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
        if (id === runningTaskId) {
            setRunningTaskId(null)
            flushTrackedTime()
        }
    }

    const toggleActive = (id) => {
        setTaskList(taskList.map(t => t.id === id ? { ...t, active: !t.active } : t))
        if (id === runningTaskId) {
            setRunningTaskId(null)
            flushTrackedTime()
        }
    }

    const flushTrackedTime = () => {
        if (!runningTaskId) return
        const secondsToFlush = trackedSecondsRef.current
        setTaskList(currentTaskList => currentTaskList.map(task => {
            if (task.id !== runningTaskId) return task
            const newTrackedTime = (task.trackedTime || 0) + secondsToFlush
            return { ...task, trackedTime: newTrackedTime }
        }))
        setTrackedSeconds(0)
    }

    // 'saves' tracked time all 5min to avoid losses
    useEffect(() => {
        if (!runningTaskId) return
        const interval = setInterval(() => {
            flushTrackedTime()
        }, 5 * 60 * 1000) // every 5 minutes 
        return () => clearInterval(interval)
    }, [runningTaskId])

    const startTracking = (id) => {
        if (runningTaskId) { flushTrackedTime() }
        setNewActionTime(new Date())
        setRunningTaskId(id)
    }

    const stopTracking = () => {
        flushTrackedTime()
        setRunningTaskId(null)
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
        startTracking,
        stopTracking,

    }

    const finishedTasks = taskList.filter(t => t.done)

    //baseTime is either [startedAt], [last finished task], or [new task created time] if no tasks are active
    const baseTime = Math.max(
        startedAt.getTime(),
        ...finishedTasks.map(t => new Date(t.finishedTimestamp).getTime()),
        newActionTime)

    const calculateEstimateFinishTime = (task, runningTime) => {
        const isRunning = task.id === runningTaskId
        const trackedOrElapsed = (task.trackedTime || 0) + (isRunning ? trackedSeconds : 0)
        const isOverEstimate = trackedOrElapsed > task.time * 60
        // if the task is running and over estimate, return current time
        if (isOverEstimate && isRunning) {
            // eslint-disable-next-line react-hooks/purity -- display-only, never written to state
            return Date.now()
        }
        const remaining = isOverEstimate ? 0 : task.time * 60 - trackedOrElapsed
        return runningTime + remaining * 1000
    }

    // sorts running task to the front LATER should be changable in user settings
    const sortedActiveTasks = () => {
        if (!runningTaskId) return activeTasks
        const runningTask = activeTasks.find(t => t.id === runningTaskId)
        const otherActiveTasks = activeTasks.filter(t => t.id !== runningTaskId)
        return [runningTask, ...otherActiveTasks]
    }

    const openTasksResult = sortedActiveTasks()?.reduce((acc, task) => {
        const estimateTime = calculateEstimateFinishTime(task, acc.runningTime)
        const taskWithEstimate = { ...task, estimate: new Date(estimateTime) }
        return { runningTime: estimateTime, list: [...acc.list, taskWithEstimate] }
    }, { runningTime: baseTime, list: [] })


    // add 'possibleEstimate' timestamp to each task, anchored after the last
    // active task's estimate (or baseTime, when nothing's active — the reduce
    // above leaves runningTime unchanged in that case)
    const inactiveTasks = taskList.filter(t => !t.done && !t.active).map((task) => {
        return { ...task, possibleEstimate: new Date(openTasksResult.runningTime + task.time * 60000) }
    })

    // TODO: return runningTaskId, trackedSeconds so components can show the running state
    return { taskList, openTasks: openTasksResult.list, inactiveTasks, finishedTasks, taskActions, startedAt, updateActionTime, runningTaskId, trackedSeconds }
}

export default useTasks