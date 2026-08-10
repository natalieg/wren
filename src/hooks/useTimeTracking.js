import { useState, useEffect, useRef } from 'react'

// Owns everything about the running timer: the tick, the failsafe flush, and the
// trackedTime writes. It takes setTaskList because trackedTime lives on the task,
// but it never touches `list` — list changes belong to useTasks/taskTransitions.
function useTimeTracking(setTaskList) {
  const [runningTaskId, setRunningTaskId] = useState(null)
  const [trackedSeconds, setTrackedSeconds] = useState(0)
  const trackingStartTime = useRef(null)

  // ticks aligned to the second boundary, not every 1000ms — avoids drift
  useEffect(() => {
    if (!runningTaskId) return
    trackingStartTime.current = Date.now()
    let timeout
    const tick = () => {
      const elapsedMs = Date.now() - trackingStartTime.current
      setTrackedSeconds(Math.floor(elapsedMs / 1000))
      timeout = setTimeout(tick, 1000 - (elapsedMs % 1000))
    }
    timeout = setTimeout(tick, 1000)
    return () => clearTimeout(timeout)
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

  // functional update on purpose — callers may queue a task rewrite in the same
  // handler, and a snapshot-based write here would silently drop the banked seconds
  const flushTrackedTime = () => {
    if (!runningTaskId || !trackingStartTime.current) return
    const elapsedMs = Date.now() - trackingStartTime.current
    const secondsToFlush = Math.floor(elapsedMs / 1000)
    setTaskList(currentTaskList => currentTaskList.map(task => {
      if (task.id !== runningTaskId) return task
      return { ...task, trackedTime: (task.trackedTime || 0) + secondsToFlush }
    }))
    // Session-Reset: neue Baseline, um die angefangene Sekunde zurückversetzt —
    // sonst verfällt der Rest bei jedem Flush und die Uhr geht pro 5min bis zu 1s nach
    trackingStartTime.current = Date.now() - (elapsedMs % 1000)
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
    setTaskList(currentTaskList => currentTaskList.map(t => t.id === id
      ? { ...t, startedAt: t.startedAt || new Date() }
      : t))
    setRunningTaskId(id)
  }

  const stopTracking = () => {
    if (!runningTaskId) return
    flushTrackedTime()
    // keep the just-stopped task at the top instead of letting it fall
    setTaskList(currentTaskList => {
      const stoppedTask = currentTaskList.find(t => t.id === runningTaskId)
      const rest = currentTaskList.filter(t => t.id !== runningTaskId)
      return [stoppedTask, ...rest]
    })
    setRunningTaskId(null)
  }

  // banks the time and clears the timer when a task stops being trackable for a reason
  // other than the user hitting stop — finished, parked, deleted. No-op otherwise, so
  // callers can fire it unconditionally instead of repeating the runningTaskId check
  const stopIfRunning = (id) => {
    if (id !== runningTaskId) return
    setRunningTaskId(null)
    flushTrackedTime()
  }

  return { runningTaskId, trackedSeconds, startTracking, stopTracking, flushTrackedTime, stopIfRunning }
}

export default useTimeTracking
