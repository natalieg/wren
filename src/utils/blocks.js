import { ACTIVE, BACKLOG, NEXTUP, DONE } from './constants'
import { secondsToMinutes, minutesToSeconds, effectiveMinutes } from './formatTime'

export const BLOCK = 'block'
export const BLOCK_PREFIX = `${BLOCK}:`
// planned within ±10m of the duration still counts as a full block
export const GRACE_MINUTES = 10

export const isBlock = (task) => task?.kind === BLOCK
export const blockGroupKey = (blockId) => `${BLOCK_PREFIX}${blockId}`

// only an active block holds tasks — a finished or deleted one leaves a stale blockId behind
export function activeBlockIds(taskList) {
   return new Set(taskList.filter(t => isBlock(t) && t.list === ACTIVE).map(t => t.id))
}

// the block a task sits in, or null when it's a plain task
export function blockIdOf(task, blockIds) {
   return !isBlock(task) && task.blockId && blockIds.has(task.blockId) ? task.blockId : null
}

export const membersOf = (blockId, taskList) => taskList.filter(t => !isBlock(t) && t.blockId === blockId)

const liveSeconds = (task, { runningTaskId, trackedSeconds }) =>
   (task.trackedTime || 0) + (task.id === runningTaskId ? trackedSeconds : 0)

// a finished task counts like in History: tracked time, or its estimate when under a minute was tracked
const doneOrLiveSeconds = (task, ctx) => task.list === DONE
   ? minutesToSeconds(effectiveMinutes(task.trackedTime, parseInt(task.time) || 0)) || (task.trackedTime || 0)
   : liveSeconds(task, ctx)

// header numbers for a block; members include its finished tasks
export function blockStats(block, taskList, ctx) {
   const members = membersOf(block.id, taskList)
   const durationMinutes = parseInt(block.time) || 0
   const plannedMinutes = members.reduce((sum, t) => sum + (parseInt(t.time) || 0), 0)
   const generalSeconds = liveSeconds(block, ctx)
   const trackedSeconds = members.reduce((sum, t) => sum + doneOrLiveSeconds(t, ctx), generalSeconds)
   const diffMinutes = plannedMinutes - durationMinutes
   const state = diffMinutes > GRACE_MINUTES ? 'over' : diffMinutes >= -GRACE_MINUTES ? 'full' : 'buffer'
   const isBusy = block.id === ctx.runningTaskId || members.some(t => t.id === ctx.runningTaskId)
   return { durationMinutes, plannedMinutes, generalSeconds, trackedSeconds, diffMinutes, state, isBusy }
}

// a finished block hands its open tasks back to the plain day list
export function releaseOpenMembers(taskList, blockId) {
   return taskList.map(t => t.blockId === blockId && !isBlock(t) && t.list === ACTIVE ? { ...t, blockId: undefined } : t)
}

// a project block refuses only tasks of another project; a block without project takes anything
export const canJoinBlock = (task, block) =>
   !isBlock(task) && (!block.project || !task.project || task.project === block.project)

// the project's loose day tasks (and its next-up ones, if asked) — a block without project has none
export function fillCandidates(taskList, block, { fromNextUp }) {
   if (!block.project) return []
   const blockIds = activeBlockIds(taskList)
   blockIds.add(block.id)
   return taskList.filter(t => {
      if (isBlock(t) || t.project !== block.project) return false
      const loose = t.list === ACTIVE && !blockIdOf(t, blockIds)
      const nextUp = fromNextUp && t.list === BACKLOG && (t.backlog?.bucket ?? NEXTUP) === NEXTUP
      return loose || nextUp
   })
}

export function adoptIntoBlock(taskList, block, opts) {
   const adopted = new Set(fillCandidates(taskList, block, opts))
   return taskList.map(t => adopted.has(t) ? { ...t, list: ACTIVE, backlog: undefined, blockId: block.id } : t)
}

// TimeProgress "left": a block counts as its open tasks or its remaining duration, whichever is bigger
export function minutesLeft(openTasks, finishedTasks) {
   const blockIds = activeBlockIds(openTasks)
   return openTasks.reduce((sum, t) => {
      if (blockIdOf(t, blockIds)) return sum
      if (!isBlock(t)) return sum + (parseInt(t.time) || 0)
      const open = membersOf(t.id, openTasks).reduce((s, m) => s + (parseInt(m.time) || 0), 0)
      const done = membersOf(t.id, finishedTasks).reduce((s, m) => s + effectiveMinutes(m.trackedTime, parseInt(m.time) || 0), 0)
      const rest = (parseInt(t.time) || 0) - done - secondsToMinutes(t.trackedTime || 0)
      return sum + Math.max(open, rest, 0)
   }, 0)
}

// TimeProgress "done": a finished block only counts its real general time, never its duration
export function minutesDone(finishedTasks) {
   return finishedTasks.reduce((sum, t) => sum + (isBlock(t)
      ? secondsToMinutes(t.trackedTime || 0)
      : effectiveMinutes(t.trackedTime, parseInt(t.time) || 0) || 0), 0)
}
