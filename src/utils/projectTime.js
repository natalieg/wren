import { DONE } from './constants'
import { secondsToMinutes } from './formatTime'
import { weekStart } from './weekStats'
import { logicalDayString } from './rollover'
import { isBlock } from './blocks'

/** Where a project's minutes this week (Mon–Sun) come from, one entry per task, counted from the
 * per-day split (trackedByDay). Time from before the split is undated and never counts; a task
 * finished this week without any tracking counts its estimate, like in History. */
export function projectWeekLog(projectId, { history, taskList, runningTaskId, trackedSeconds, now, rolloverHour = 0 }) {
   const start = weekStart(new Date(logicalDayString(new Date(now), rolloverHour))).getTime()
   const inWeek = (day) => new Date(day).getTime() >= start

   // newest version of every project task — history is newest first, the live list wins over it
   const tasks = new Map()
   history.forEach(entry => entry.tasks.forEach(t => {
      if (t.project === projectId && !tasks.has(t.id)) tasks.set(t.id, t)
   }))
   taskList.forEach(t => { if (t.project === projectId) tasks.set(t.id, t) })

   return [...tasks.values()].map(t => {
      const running = t.id === runningTaskId ? trackedSeconds : 0
      const day = t.list === DONE && t.finishedTimestamp ? logicalDayString(new Date(t.finishedTimestamp), rolloverHour) : null
      const finishedThisWeek = !!day && inWeek(day)
      // finished without any tracking counts its estimate, same rule as History
      const untracked = secondsToMinutes(t.trackedTime || 0) === 0
      const entry = { id: t.id, label: t.label, isBlock: isBlock(t), finished: !!day, day, estimated: false, undatedMinutes: 0 }

      if (finishedThisWeek && untracked) return { ...entry, minutes: parseInt(t.time) || 0, estimated: true }
      if (t.trackedByDay) {
         const seconds = Object.entries(t.trackedByDay).reduce((sum, [d, s]) => inWeek(d) ? sum + s : sum, running)
         return { ...entry, minutes: secondsToMinutes(seconds) }
      }
      // undated time never counts, finished or not — only listed while the task is still this week's business
      const relevant = !day || finishedThisWeek
      return { ...entry, minutes: secondsToMinutes(running), undatedMinutes: relevant ? secondsToMinutes(t.trackedTime || 0) : 0 }
   }).filter(e => e.minutes > 0 || e.undatedMinutes > 0)
}

export const projectWeekMinutes = (projectId, ctx) =>
   projectWeekLog(projectId, ctx).reduce((sum, e) => sum + e.minutes, 0)
