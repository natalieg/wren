import { DONE } from './constants'
import { secondsToMinutes } from './formatTime'
import { weekStart } from './weekStats'

/** Minutes tracked on a project this week (Mon–Sun): finished work from history, plus what
 * open tasks and blocks carry right now. Stand-in until per-session tracking exists — an open
 * task counts its whole trackedTime, so time from last week on a still-open task lands here too. */
export function projectWeekMinutes(projectId, { history, taskList, runningTaskId, trackedSeconds, now }) {
   const start = weekStart(new Date(now)).getTime()
   const finished = history
      .filter(entry => new Date(entry.date).getTime() >= start)
      .flatMap(entry => entry.tasks)
      .filter(t => t.project === projectId)
      .reduce((sum, t) => sum + (t.trackedTime || 0), 0)
   // finished tasks still on the list are already in history
   const open = taskList
      .filter(t => t.project === projectId && t.list !== DONE)
      .reduce((sum, t) => sum + (t.trackedTime || 0) + (t.id === runningTaskId ? trackedSeconds : 0), 0)
   return secondsToMinutes(finished + open)
}
