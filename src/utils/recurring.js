import { ACTIVE, BACKLOG, DONE, NEXTUP } from './constants'
import { newTaskId } from './taskId'

/** Habit exists only as its tasks. `recurring.id` is the habit id; losing the last task loses recurrence settings. */

export function isRecurring(task) {
   return !!task?.recurring?.active
}

/** Next occurrence of a habit: new task with only the habit's core properties, excluding time tracking and previous state. */
export function nextOccurrence(task, { list = ACTIVE, bucket = NEXTUP } = {}) {
   const next = {
      id: newTaskId(),
      label: task.label,
      time: task.time,
      list,
      recurring: { ...task.recurring },
   }
   if (list === BACKLOG) next.backlog = { bucket, activationDate: null }
   return next
}

// True if another task carries this habit (safe to remove this one)
export function hasOtherOccurrence(taskList, task) {
   const habitId = task?.recurring?.id
   if (!habitId) return false
   return taskList.some(t => t.id !== task.id && t.recurring?.id === habitId)
}

// True if habit already has an open task (prevents duplicate rollover)
export function hasOpenOccurrence(taskList, habitId) {
   if (!habitId) return false
   return taskList.some(t => t.list !== DONE && t.recurring?.id === habitId)
}

/** Returns replacement tasks for habits whose last task was removed. Prevents accidental recurrence deletion. */
export function reviveOrphanedHabits(remaining, removed, opts) {
   const alive = new Set(remaining.filter(t => t.recurring?.id).map(t => t.recurring.id))
   const revived = []
   for (const task of removed) {
      const habitId = task.recurring?.id
      if (!isRecurring(task) || alive.has(habitId)) continue
      alive.add(habitId) // several finished days of one habit produce one replacement
      revived.push(nextOccurrence(task, opts))
   }
   return revived
}
