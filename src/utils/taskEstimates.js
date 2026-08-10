import { ACTIVE, BACKLOG, DONE, NEXTUP } from './constants'
import { minutesToSeconds } from './formatTime'

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

/** The cascading finish times: each active task starts where the one above it ends.
 * Pure — `now` is passed in rather than read, so this is testable without fake timers
 * and the render-purity lint only has to be answered once, at the call site. */
// active + nextUp tasks with their estimate timestamps attached
export default function calculateEstimates({ taskList, startedAt, newActionTime, runningTaskId, trackedSeconds, now }) {
   const baseTime = baseTimeOf(taskList, startedAt, newActionTime)
   const activeTasks = taskList.filter(t => t.list === ACTIVE)

   const openTasksResult = sortActiveTasks(activeTasks, runningTaskId).reduce((acc, task) => {
      const estimateTime = estimateFinishTime(task, acc.runningTime, { runningTaskId, trackedSeconds, now })
      return { runningTime: estimateTime, list: [...acc.list, { ...task, estimate: new Date(estimateTime) }] }
   }, { runningTime: baseTime, list: [] })

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
