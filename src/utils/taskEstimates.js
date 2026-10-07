import { ACTIVE, BACKLOG, DONE, NEXTUP } from './constants'
import { minutesToSeconds, timeValueToToday } from './formatTime'
import { isRecurring } from './recurring'

// baseTime is either [startedAt], [last finished task], or [new task created time]
// if no tasks are active.
// guard against legacy finished tasks with no/invalid finishedTimestamp — one NaN
// here would poison the whole Math.max, breaking every estimate
function baseTimeOf(taskList, startedAt, newActionTime) {
   const validFinishedTimestamps = taskList
      .filter(t => t.list === DONE)
      .map(t => new Date(t.finishedTimestamp).getTime())
      .filter(time => !isNaN(time))
   return Math.max(startedAt.getTime(), ...validFinishedTimestamps, newActionTime)
}

function estimateFinishTime(task, runningTime, { runningTaskId, trackedSeconds, now }) {
   const isRunning = task.id === runningTaskId
   const trackedOrElapsed = (task.trackedTime || 0) + (isRunning ? trackedSeconds : 0)
   const estimateSeconds = minutesToSeconds(task.time)
   const isOverEstimate = trackedOrElapsed > estimateSeconds
   // a running task that already blew its budget can only finish now, never in the past
   if (isOverEstimate && isRunning) return now
   const remaining = isOverEstimate ? 0 : estimateSeconds - trackedOrElapsed
   return (isRunning ? now : runningTime) + remaining * 1000
}

// sorts running task to the front LATER should be changable in user settings
function sortActiveTasks(activeTasks, runningTaskId) {
   const runningTask = activeTasks.find(t => t.id === runningTaskId)
   if (!runningTask) return activeTasks
   return [runningTask, ...activeTasks.filter(t => t.id !== runningTaskId)]
}

const MINUTE = 60 * 1000

// pinned start for today, or null. A habit's daily time wins; a dated pin only counts on its own day
export function pinStartToday(task, now) {
   if (isRecurring(task) && task.recurring.fixedTime) {
      return new Date(timeValueToToday(task.recurring.fixedTime, now)).getTime()
   }
   if (task.fixedStart && new Date(task.fixedStart).toDateString() === new Date(now).toDateString()) {
      return new Date(task.fixedStart).getTime()
   }
   return null
}

/** Flexible tasks keep their order and cascade; pinned tasks sit at their fixed time.
 * A flexible task that would run past the next pin goes behind it. The running task
 * is never bumped, so a pin it overruns gets flagged as a conflict instead. */
function scheduleActiveTasks(activeTasks, baseTime, ctx) {
   const sorted = sortActiveTasks(activeTasks, ctx.runningTaskId)
   const starts = new Map(sorted.map(t => [t.id, pinStartToday(t, ctx.now)]))
   const startOf = (task) => starts.get(task.id)
   // a running pin is already happening, it schedules like any running task
   const isPin = (t) => t.id !== ctx.runningTaskId && startOf(t) !== null
   const pins = sorted.filter(isPin).sort((a, b) => startOf(a) - startOf(b))
   const flexible = sorted.filter(t => !isPin(t))

   let cursor = baseTime
   const list = []
   const placePin = (pin) => {
      const start = startOf(pin)
      const estimate = estimateFinishTime(pin, Math.max(cursor, start), ctx)
      list.push({
         ...pin, pinned: true, pinnedAt: new Date(start), estimate: new Date(estimate),
         freeMinutesBefore: Math.max(Math.floor((start - cursor) / MINUTE), 0),
         pinConflict: cursor > start,
      })
      cursor = estimate
   }

   for (const task of flexible) {
      const isRunning = task.id === ctx.runningTaskId
      while (pins.length && !isRunning && estimateFinishTime(task, cursor, ctx) > startOf(pins[0])) {
         placePin(pins.shift())
      }
      const estimate = estimateFinishTime(task, cursor, ctx)
      list.push({ ...task, estimate: new Date(estimate) })
      cursor = estimate
   }
   pins.forEach(placePin)

   return { runningTime: cursor, list }
}

/** The cascading finish times: each active task starts where the one above it ends.
 * Pure — `now` is passed in rather than read, so this is testable without fake timers
 * and the render-purity lint only has to be answered once, at the call site. */
// active + nextUp tasks with their estimate timestamps attached
export default function calculateEstimates({ taskList, startedAt, newActionTime, runningTaskId, trackedSeconds, now }) {
   const baseTime = baseTimeOf(taskList, startedAt, newActionTime)
   const activeTasks = taskList.filter(t => t.list === ACTIVE)

   const openTasksResult = scheduleActiveTasks(activeTasks, baseTime, { runningTaskId, trackedSeconds, now })

   // 'possibleEstimate' anchors after the last active task's estimate, or after now if
   // that already passed. 'nextUp' bucket only — mirrors the old parked-tasks list
   // shown inline on the Tasklist page
   const nextUpTasks = taskList
      .filter(t => t.list === BACKLOG && (t.backlog?.bucket ?? NEXTUP) === NEXTUP)
      .map(task => {
         const remaining = Math.max(minutesToSeconds(task.time) - (task.trackedTime || 0), 0)
         const sourceTime = Math.max(openTasksResult.runningTime, now)
         return { ...task, possibleEstimate: new Date(sourceTime + remaining * 1000) }
      })

   return { openTasks: openTasksResult.list, nextUpTasks }
}
