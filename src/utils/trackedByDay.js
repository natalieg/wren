import { logicalDayString } from './rollover'

/** trackedTime split by day, keyed like history days: { 'Mon Oct 20 2026': seconds }.
 * Only knows time tracked since it exists — older trackedTime stays undated. */
// adds a change of trackedTime to today; a manual correction downwards takes it from today, never below 0
export function addTrackedToday(task, deltaSeconds, now, rolloverHour) {
   if (!deltaSeconds) return task
   const day = logicalDayString(new Date(now), rolloverHour)
   const trackedByDay = { ...(task.trackedByDay || {}) }
   trackedByDay[day] = Math.max((trackedByDay[day] || 0) + deltaSeconds, 0)
   return { ...task, trackedByDay }
}
