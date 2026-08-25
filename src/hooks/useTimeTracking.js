import useTracker from './useTracker'

// Owns everything about the running task timer on top of the generic useTracker:
// where flushed seconds land (trackedTime on the task) and the "running task stays
// on top" reorder. It takes setTaskList because trackedTime lives on the task, but
// it never touches `list` — list changes belong to useTasks/taskTransitions.
function useTimeTracking(setTaskList) {
  // TODO 4 (Phase 1 — unified-activity-model.md): once useTracker exposes session
  // timestamps (TODO 1-3), also append { started, stopped } to task.sessions[] here,
  // alongside the existing trackedTime accumulation — don't replace trackedTime yet,
  // this phase is purely additive. Existing tasks won't have a `sessions` field yet
  // (`task.sessions || []` style guard, same pattern as normalizeTask in useTasks.js).
  const handleFlush = (taskId, secondsToFlush) => {
    setTaskList(currentTaskList => currentTaskList.map(task => {
      if (task.id !== taskId) return task
      return { ...task, trackedTime: (task.trackedTime || 0) + secondsToFlush }
    }))
  }

  const {
    runningId: runningTaskId,
    trackedSeconds,
    start,
    stop,
    flush: flushTrackedTime,
    stopIfRunning,
  } = useTracker(handleFlush)

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
    start(id)
  }

  const stopTracking = () => {
    if (!runningTaskId) return
    // keep the just-stopped task at the top instead of letting it fall
    setTaskList(currentTaskList => {
      const stoppedTask = currentTaskList.find(t => t.id === runningTaskId)
      const rest = currentTaskList.filter(t => t.id !== runningTaskId)
      return [stoppedTask, ...rest]
    })
    stop()
  }

  return { runningTaskId, trackedSeconds, startTracking, stopTracking, flushTrackedTime, stopIfRunning }
}

export default useTimeTracking
