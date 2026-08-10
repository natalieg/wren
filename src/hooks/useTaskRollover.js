import useDayActions from './useDayActions'
import { loadSettings } from '../utils/settings'
import { ACTIVE, BACKLOG, DONE, NEXTUP } from '../utils/constants'
import { applyListChange } from '../utils/taskTransitions'
import { isRecurring, nextOccurrence, hasOpenOccurrence, reviveOrphanedHabits } from '../utils/recurring'

// Applies day rollover effects to tasks, gated by their own settings
function useTaskRollover(setTaskList) {
  // Promote nextUp to active, gated by rolloverActive setting
  const promoteNextUpTasks = () => {
    if (!loadSettings().rolloverActive) return
    setTaskList(currentTaskList => {
      const toPromote = currentTaskList.filter(t =>
        t.list === BACKLOG && (t.backlog?.bucket ?? NEXTUP) === NEXTUP)
      if (toPromote.length === 0) return currentTaskList
      const rest = currentTaskList.filter(t => !toPromote.includes(t))
      const promoted = toPromote.map(t => applyListChange(t, ACTIVE))
      return [...rest, ...promoted]
    })
  }
  // Copy finished recurring tasks to new active tasks (gated by recurring.active)
  const copyRecurringTasks = () => {
    setTaskList(currentTaskList => {
      const claimed = new Set()
      const copies = []
      for (const task of currentTaskList) {
        if (task.list !== DONE || !isRecurring(task)) continue
        const habitId = task.recurring.id
        // Skip if habit has unfinished task or already copied this day
        if (claimed.has(habitId) || hasOpenOccurrence(currentTaskList, habitId)) continue
        claimed.add(habitId)
        copies.push(nextOccurrence(task, { list: ACTIVE }))
      }

      if (copies.length === 0) return currentTaskList
      return [...currentTaskList, ...copies]
    })
  }

  // Delete finished tasks if autoDeleteFinished is enabled, revive orphaned habits
  const deleteFinishedTasksOnRollover = () => {
    if (!loadSettings().autoDeleteFinished) return
    setTaskList(currentTaskList => {
      const kept = currentTaskList.filter(t => t.list !== DONE)
      const removed = currentTaskList.filter(t => t.list === DONE)
      return [...kept, ...reviveOrphanedHabits(kept, removed, { list: BACKLOG, bucket: NEXTUP })]
    })
  }

  return useDayActions({
    // Order matters: copy before delete so source tasks exist for copying
    onRollover: () => { promoteNextUpTasks(); copyRecurringTasks(); deleteFinishedTasksOnRollover(); }
  })
}

export default useTaskRollover
