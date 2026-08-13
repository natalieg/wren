import useTracker from './useTracker'

// Owns everything about the running task timer on top of the generic useTracker:
// where flushed seconds land (trackedTime on the task) and the "running task stays
// on top" reorder. It takes setTaskList because trackedTime lives on the task, but
// it never touches `list` — list changes belong to useTasks/taskTransitions.
function useTimeTracking(setTaskList) {
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
