import { DONE } from './constants'
import { formatClockTime, formatDate, timeValueToToday } from './formatTime'
import { isRecurring } from './recurring'

const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString()
const hasDailyTime = (task) => isRecurring(task) && !!task.recurring.fixedTime

// pinned start for today, or null. A habit's daily time wins; a dated pin only counts on its own day
export function pinStartToday(task, now) {
   if (hasDailyTime(task)) return new Date(timeValueToToday(task.recurring.fixedTime, now)).getTime()
   if (task.fixedStart && sameDay(task.fixedStart, now)) return new Date(task.fixedStart).getTime()
   return null
}

// on rollover: an expired pin is removed for good, its time is kept as a line in the notes
export function clearStalePins(taskList, now) {
   return taskList.map(task => {
      if (!task.fixedStart || task.list === DONE || sameDay(task.fixedStart, now)) return task
      const { fixedStart, ...rest } = task
      if (hasDailyTime(task)) return rest
      const line = `📌 was pinned to ${formatClockTime(fixedStart)} on ${formatDate(fixedStart)}`
      return { ...rest, notes: task.notes ? `${task.notes}\n${line}` : line }
   })
}
