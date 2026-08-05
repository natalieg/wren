import { useState, useEffect, useRef } from 'react'
import useHistory from './useHistory'

// migrates legacy active/done booleans to the single 'list' enum, once, on load
// later remove at some point when all legacy tasks are gone
function normalizeTask(t) {
    if (t.list) return t
    const list = t.done ? 'done' : t.active === false ? 'backlog' : 'active'
    const { active: _active, done: _done, ...rest } = t
    return {
        ...rest,
        list,
        ...(list === 'backlog' ? { backlog: { bucket: 'nextUp', activationDate: null } } : {})
    }
}

function useTasks() {
    const { addToHistory, removeFromHistory } = useHistory()
    // lives here, not as local state on TaskItem — a task can move between different
    // TaskGroup instances (active/backlog, bucket A/B) while its modal is open, which
    // unmounts/remounts the TaskItem and would wipe locally-held "am I editing" state
    const [editingTaskId, setEditingTaskId] = useState(null)
    const [taskList, setTaskList] = useState(() => {
        try {
            const savedTasks = localStorage.getItem('tasks')
            return savedTasks ? JSON.parse(savedTasks).map(normalizeTask) : []
        } catch (e) {
            console.error('Failed to load tasks from localStorage:', e)
            return []
        }
    })
    const [newActionTime, setNewActionTime] = useState(null)
    const activeTasks = taskList.filter(t => t.list === 'active')
    const [runningTaskId, setRunningTaskId] = useState(null)
    const [trackedSeconds, setTrackedSeconds] = useState(0)
    const trackedSecondsRef = useRef(0)
    const trackingStartTime = useRef(null)

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
        trackingStartTime.current = Date.now()
        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - trackingStartTime.current) / 1000)
            setTrackedSeconds(elapsed)
        }, 1000)
        return () => clearInterval(interval)
    }, [runningTaskId])

    // Visibility Listener
    useEffect(() => {
        if (!runningTaskId) return
        const onVisible = () => {
            if (document.visibilityState === 'visible' && trackingStartTime.current) {
                setTrackedSeconds(Math.floor((Date.now() - trackingStartTime.current) / 1000))
            }
        }
        document.addEventListener('visibilitychange', onVisible)
        return () => document.removeEventListener('visibilitychange', onVisible)
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

    //toggles done and add/remove from history
    const toggleDone = (id) => {
        const task = taskList.find(t => t.id === id)
        const isNowDone = task.list !== 'done'
        const updatedTask = isNowDone
            ? { ...task, list: 'done', previousList: task.list, finishedTimestamp: new Date() }
            : { ...task, list: task.previousList || 'active', previousList: undefined, finishedTimestamp: null }
        if (isNowDone) {
            addToHistory(updatedTask)
        } else {
            removeFromHistory(id)
        }
        setTaskList(taskList.map(t => t.id === id ? updatedTask : t))
        if (id === runningTaskId) {
            setRunningTaskId(null)
            flushTrackedTime()
        }
    }

    // parks a task to the backlog (default 'nextUp' bucket) or pulls it back to active
    const toggleActive = (id) => {
        setTaskList(taskList.map(t => {
            if (t.id !== id) return t
            return t.list === 'active'
                ? { ...t, list: 'backlog', backlog: { bucket: 'nextUp', activationDate: null } }
                : { ...t, list: 'active', backlog: undefined }
        }))
        if (id === runningTaskId) {
            setRunningTaskId(null)
            flushTrackedTime()
        }
    }

    const flushTrackedTime = () => {
        if (!runningTaskId || !trackingStartTime.current) return
        const secondsToFlush = Math.floor((Date.now() - trackingStartTime.current) / 1000)
        setTaskList(currentTaskList => currentTaskList.map(task => {
            if (task.id !== runningTaskId) return task
            return { ...task, trackedTime: (task.trackedTime || 0) + secondsToFlush }
        }))
        // Session-Reset: neue Baseline
        trackingStartTime.current = Date.now()
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
        if (runningTaskId) {
            flushTrackedTime()
            // sortedActiveTasks() always pulls whichever task is running to top
            setTaskList(currentTaskList => {
                const outgoingTask = currentTaskList.find(t => t.id === runningTaskId)
                const rest = currentTaskList.filter(t => t.id !== runningTaskId)
                return [outgoingTask, ...rest]
            })
        }
        setTaskList(currentTaskList => currentTaskList.map(t => t.id === id ?
            {
                ...t,
                list: 'active',
                backlog: undefined,
                startedAt: t.startedAt || new Date(),
            }
            : t))
        setNewActionTime(new Date())
        setRunningTaskId(id)
    }

    const stopTracking = () => {
        flushTrackedTime()
        // keep the just-stopped task at the top instead of letting it fall
        setTaskList(currentTaskList => {
            const stoppedTask = currentTaskList.find(t => t.id === runningTaskId)
            const rest = currentTaskList.filter(t => t.id !== runningTaskId)
            return [stoppedTask, ...rest]
        })
        setRunningTaskId(null)
    }

    // options: { list, bucket } — used by Backlog to add tasks straight into 'backlog'/a bucket
    const handleAddTask = (label, time, { list = 'active', bucket } = {}) => {
        if (!label?.trim()) return
        const newId = taskList.length > 0 ? Math.max(...taskList.map(t => t.id)) + 1 : 1
        const newTask = { id: newId, label, time, list }
        if (list === 'backlog') {
            newTask.backlog = { bucket: bucket || 'nextUp', activationDate: null }
        }
        setTaskList([...taskList, newTask])
        updateActionTime()
    }

    const handleFieldChange = (id, field, value) => {
        setTaskList(taskList.map(t => t.id === id ? { ...t, [field]: value } : t))
        updateActionTime()
    }

    const handleDeleteTask = (id) => {
        if (id === runningTaskId) {
            setRunningTaskId(null)
            flushTrackedTime()
        }
        setTaskList(taskList.filter(t => t.id !== id))
        updateActionTime()
    }

    const deleteAllFinishedTasks = () => {
        setTaskList(taskList.filter(t => t.list !== 'done'))
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
        setEditingTaskId,
    }

    const finishedTasks = taskList.filter(t => t.list === 'done')

    //baseTime is either [startedAt], [last finished task], or [new task created time] if no tasks are active
    // guard against legacy finished tasks with no/invalid finishedTimestamp — one
    // NaN here would poison the whole Math.max, breaking every estimate
    const validFinishedTimestamps = finishedTasks
        .map(t => new Date(t.finishedTimestamp).getTime())
        .filter(time => !isNaN(time))
    const baseTime = Math.max(
        startedAt.getTime(),
        ...validFinishedTimestamps,
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
        // eslint-disable-next-line react-hooks/purity -- display-only
        return (isRunning ? Date.now() : runningTime) + remaining * 1000
    }

    // sorts running task to the front LATER should be changable in user settings
    const sortedActiveTasks = () => {
        const runningTask = activeTasks.find(t => t.id === runningTaskId)
        if (!runningTask) return activeTasks
        const otherActiveTasks = activeTasks.filter(t => t.id !== runningTaskId)
        return [runningTask, ...otherActiveTasks]
    }

    const openTasksResult = sortedActiveTasks()?.reduce((acc, task) => {
        const estimateTime = calculateEstimateFinishTime(task, acc.runningTime)
        const taskWithEstimate = { ...task, estimate: new Date(estimateTime) }
        return { runningTime: estimateTime, list: [...acc.list, taskWithEstimate] }
    }, { runningTime: baseTime, list: [] })


    // add 'possibleEstimate' timestamp to each task, anchored after the last
    // active task's estimate or baseTime if no task is active
    // 'nextUp' bucket only — mirrors the old parked-tasks list shown inline on the Tasklist page
    const nextUpTasks = taskList.filter(t => t.list === 'backlog' && (t.backlog?.bucket ?? 'nextUp') === 'nextUp').map((task) => {
        const remaining = Math.max(task.time * 60 - (task.trackedTime || 0), 0)
        // eslint-disable-next-line react-hooks/purity -- display-only, never written to state
        const sourceTime = Math.max(openTasksResult.runningTime, Date.now())
        return { ...task, possibleEstimate: new Date(sourceTime + remaining * 1000) }
    })

    // full backlog, ungrouped and without time estimates — Backlog page groups by .backlog.bucket itself
    const backlogTasks = taskList.filter(t => t.list === 'backlog')

    return { taskList, openTasks: openTasksResult.list, nextUpTasks, backlogTasks, finishedTasks, taskActions, startedAt, updateActionTime, runningTaskId, trackedSeconds, editingTaskId }
}

export default useTasks