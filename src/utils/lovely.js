import { ACTIVE, DONE } from './constants'
import { minutesToSeconds } from './formatTime'
import { isBlock, activeBlockIds, blockIdOf } from './blocks'
import { pinStartToday } from './pins'
import { logicalDayString } from './rollover'

export const MAX_FLOWERS = 5
export const SPRINKLE_MINUTES = 30
export const WEAVE_EVERY_MINUTES = 90
// LATER a lovely list setting
export const DAY_END_HOUR = 23

const HOUR = 60 * 60 * 1000

// the day end of the logical day `now` belongs to — at 01:00 it's still last night's 23:00
export function dayEndOf(now, rolloverHour = 0, hour = DAY_END_HOUR) {
   const day = new Date(now - rolloverHour * HOUR)
   day.setHours(hour, 0, 0, 0)
   return day.getTime()
}

// scheduled items that would only start after the day end move to `later`; the running one always stays
export function splitAtDayEnd(items, dayEnd, { now, runningTopId = null }) {
   const visible = []
   const later = []
   let start = now
   for (const t of items) {
      const begins = t.pinnedAt ? new Date(t.pinnedAt).getTime() : start
      const isLater = begins >= dayEnd && t.id !== runningTopId
      ;(isLater ? later : visible).push(t)
      if (t.estimate) start = new Date(t.estimate).getTime()
   }
   return { visible, later }
}

// legacy tasks have no flag, a block is never lovely
export const isLovely = (task) => !!task?.lovely && !isBlock(task)

// finished on today's logical day — yesterday's done tasks stay until rollover cleans them up
export const finishedToday = (finishedTasks, { now, rolloverHour = 0 }) => {
   const today = logicalDayString(new Date(now), rolloverHour)
   return finishedTasks.filter(t => t.finishedTimestamp
      && logicalDayString(new Date(t.finishedTimestamp), rolloverHour) === today)
}

// one flower per finished lovely task, the vase holds five
export const bloomCount = (finishedTasks) => Math.min(finishedTasks.filter(isLovely).length, MAX_FLOWERS)

// today's work on anything not lovely: tracked seconds plus the running timer; a task finished
// today without a minute tracked counts its estimate, like in History
export function otherSecondsToday(taskList, { runningTaskId, trackedSeconds = 0, now, rolloverHour = 0 }) {
   const day = logicalDayString(new Date(now), rolloverHour)
   const doneTodayIds = new Set(finishedToday(taskList.filter(t => t.list === DONE), { now, rolloverHour }).map(t => t.id))
   return taskList.reduce((sum, t) => {
      if (isLovely(t)) return sum
      const tracked = (t.trackedByDay?.[day] || 0) + (t.id === runningTaskId ? trackedSeconds : 0)
      const untrackedDone = doneTodayIds.has(t.id) && !isBlock(t) && tracked < 60
      return sum + (untrackedDone ? minutesToSeconds(parseInt(t.time) || 0) : tracked)
   }, 0)
}

export const sprinkleCount = (seconds) => Math.floor(seconds / (SPRINKLE_MINUTES * 60))

/** Spreads open lovely tasks through the day instead of leaving them as leftovers at the end:
 * one opens the day, then one after each block or ~90 min of loose work. Running, pinned and
 * in-block lovely tasks stay where they are; whatever doesn't find a gap stays at the end. */
export function weaveLovely(taskList, { runningTaskId = null, now = Date.now(), rolloverHour = 0 } = {}) {
   const blockIds = activeBlockIds(taskList)
   const movable = taskList.filter(t => isLovely(t) && t.list === ACTIVE && t.id !== runningTaskId
      && !blockIdOf(t, blockIds) && pinStartToday(t, now) === null)
   if (movable.length === 0) return taskList

   const movableIds = new Set(movable.map(t => t.id))
   const queue = [...movable]
   const woven = []
   let workMinutes = 0
   // a running lovely task, or one already done today, has opened the day
   let dayOpened = isLovely(taskList.find(t => t.id === runningTaskId))
      || finishedToday(taskList.filter(t => t.list === DONE), { now, rolloverHour }).some(isLovely)
   for (const t of taskList) {
      if (movableIds.has(t.id)) continue
      const isTopLevel = t.list === ACTIVE && !blockIdOf(t, blockIds)
      const isDayWork = isTopLevel && !isLovely(t)
      if (isTopLevel && !dayOpened) {
         dayOpened = true
         if (isDayWork) woven.push(queue.shift())
      }
      woven.push(t)
      if (!isDayWork || queue.length === 0) continue
      workMinutes += parseInt(t.time) || 0
      if (isBlock(t) || workMinutes >= WEAVE_EVERY_MINUTES) {
         woven.push(queue.shift())
         workMinutes = 0
      }
   }
   return [...woven, ...queue]
}

/** "Done in place": today's done things in the order they were finished, then what's still open.
 * Tasks inside a block show in their block, so only loose tasks and finished blocks get a line. */
export function doneInPlace(doneToday, openItems, blockIds) {
   const doneBlockIds = new Set(doneToday.filter(isBlock).map(t => t.id))
   const done = doneToday
      .filter(t => isBlock(t) || (!blockIds.has(t.blockId) && !doneBlockIds.has(t.blockId)))
      .sort((a, b) => new Date(a.finishedTimestamp) - new Date(b.finishedTimestamp))
   return [...done, ...openItems]
}

// true when weaving would actually move something
export const canWeave = (taskList, opts) =>
   weaveLovely(taskList, opts).some((t, i) => t.id !== taskList[i].id)
