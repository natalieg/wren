import { useState, useEffect, useRef } from 'react'

// HINT (background timer fix): this hook currently only gets called inside
// Tasklist.jsx, which only renders on the '/' route — so react-router
// unmounts it (killing runningTaskId, the interval, trackingStartTime) every
// time you navigate to another page. Fix: call this hook exactly ONCE, above
// <Routes> (see App.jsx), so it never unmounts on route change. See
// TasksContext.jsx for the wiring.
//
// That move means `newTask`/`taskTime` can no longer be closed-over hook
// params — they're Tasklist's local input-field state, and App.jsx doesn't
// have them. See the handleAddTask HINT below for the required signature change.
// (left as-is for now so the file keeps compiling until you do that refactor)
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
        // HINT: this is the ONE place done/undone flips, so it's the right spot
        // for history too:
        //   - isNowDone === true  -> addToHistory(...) (useHistory)
        //   - isNowDone === false -> removeFromHistory(id)
        // Grab the updated task from newTaskList (not the stale `task` above) so
        // history gets the fresh finishedTimestamp/trackedTime.
        // Watch out: if a task gets toggled done -> undone -> done again, you'll
        // add it to history twice unless addToHistory dedupes by task id.
    }

    const toggleActive = (id) => {
        setTaskList(taskList.map(t => t.id === id ? { ...t, active: !t.active } : t))
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
        setTaskList(currentTaskList => currentTaskList.map(t => t.id === id ? { ...t, active: true } : t))
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


    // HINT (background timer fix, part 2): once useTasks() moves above <Routes>,
    // this needs to become handleAddTask(label, time) — real params instead of
    // closing over the `newTask`/`taskTime` hook args above (which go away).
    // Update the call site in Tasklist.jsx accordingly (it already passes both
    // as args today, they're just currently ignored — see Tasklist.jsx HINT).
    const handleAddTask = () => {
        if (newTask?.trim() === '') return
        const newId = taskList.length > 0 ? Math.max(...taskList.map(t => t.id)) + 1 : 1
        setTaskList([...taskList, { id: newId, label: newTask, time: taskTime, active: true, done: false }])
        updateActionTime()
    }

    const handleFieldChange = (id, field, value) => {
        setTaskList(taskList.map(t => t.id === id ? { ...t, [field]: value } : t))
        // parking the currently-tracked task via the edit modal should stop tracking too
        if (field === 'active' && value === false && id === runningTaskId) {
            setRunningTaskId(null)
            flushTrackedTime()
        }
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
        // return runningTime + remaining * 1000
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
    const inactiveTasks = taskList.filter(t => !t.done && !t.active).map((task) => {
        const remaining = Math.max(task.time * 60 - (task.trackedTime || 0), 0)
        // eslint-disable-next-line react-hooks/purity -- display-only, never written to state
        const sourceTime = Math.max(openTasksResult.runningTime, Date.now())
        return { ...task, possibleEstimate: new Date(sourceTime + remaining * 1000) }
    })


    // TODO: return runningTaskId, trackedSeconds so components can show the running state
    return { taskList, openTasks: openTasksResult.list, inactiveTasks, finishedTasks, taskActions, startedAt, updateActionTime, runningTaskId, trackedSeconds }
}

export default useTasks