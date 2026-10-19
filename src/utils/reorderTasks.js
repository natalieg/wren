import { ACTIVE, BACKLOG, NEXTUP, DONE } from './constants.js'
import { arrayMove } from '@dnd-kit/sortable'
import { isBlock, blockGroupKey, canJoinBlock, BLOCK_PREFIX } from './blocks.js'

const BUCKET_PREFIX = `${BACKLOG}:`

// which rendered list a task belongs to — dnd only reorders within one of them.
// backlog needs the bucket too: each bucket is its own list on the Backlog page,
// and every time block is its own list inside the active one
export function groupKey(task) {
   if (task.list === BACKLOG) return `${BACKLOG}:${task.backlog?.bucket ?? NEXTUP}`
   if (task.list === ACTIVE && task.blockId && !isBlock(task)) return blockGroupKey(task.blockId)
   return task.list
}

// a drop lands either on a row or on a whole list: an empty or collapsed list has no row
// to hit, so each TaskGroup registers its group key as a droppable in its own right
export function isGroupKey(id) {
   return id === ACTIVE || id === DONE ||
      (typeof id === 'string' && (id.startsWith(BUCKET_PREFIX) || id.startsWith(BLOCK_PREFIX)))
}

// rewrites the list/bucket fields so a dragged task belongs where it was dropped.
// activationDate rides along, it belongs to the task and not to the bucket
function withGroup(task, key) {
   if (key.startsWith(BLOCK_PREFIX)) {
      return { ...task, list: ACTIVE, backlog: undefined, blockId: key.slice(BLOCK_PREFIX.length) }
   }
   if (!key.startsWith(BUCKET_PREFIX)) return { ...task, list: key, backlog: undefined, blockId: undefined }
   return {
      ...task,
      blockId: undefined,
      list: BACKLOG,
      backlog: {
         bucket: key.slice(BUCKET_PREFIX.length),
         activationDate: task.backlog?.activationDate ?? null,
      },
   }
}

function lastIndexOfGroup(list, key) {
   let last = -1
   list.forEach((task, i) => { if (groupKey(task) === key) last = i })
   return last
}

// dnd-kit reports "A over B" in the filtered slice a page renders, but the order lives in
// the full taskList — so only the slots the dragged group occupies get rewritten.
export default function reorderTasks(taskList, activeId, overId) {
   if (activeId === overId) return taskList // dropped on itself
   if (activeId == null || overId == null) return taskList // unknown id

   const activeTask = taskList.find((t) => t.id === activeId)
   if (!activeTask) return taskList

   // a block moves only among the active list — hitting a block's inside means its header
   if (isBlock(activeTask)) {
      const hit = taskList.find((t) => t.id === overId)
      const zoneBlock = typeof overId === 'string' && overId.startsWith(BLOCK_PREFIX) && overId.slice(BLOCK_PREFIX.length)
      const target = zoneBlock || (hit?.list === ACTIVE && !isBlock(hit) && hit.blockId) || overId
      if (target !== overId) return reorderTasks(taskList, activeId, target)
      if (overId !== ACTIVE && hit?.list !== ACTIVE) return taskList
   }

   // overId is a task id when a row was hit, and a group key when the list itself was
   const overTask = taskList.find((t) => t.id === overId)
   const overGroup = overTask ? groupKey(overTask) : (isGroupKey(overId) ? overId : null)
   if (!overGroup) return taskList

   const activeGroup = groupKey(activeTask)

   // a project block refuses tasks of other projects; a task without one takes the block's
   let joining = activeTask
   if (overGroup.startsWith(BLOCK_PREFIX) && overGroup !== activeGroup) {
      const block = taskList.find((t) => t.id === overGroup.slice(BLOCK_PREFIX.length))
      if (!block || !canJoinBlock(activeTask, block)) return taskList
      if (block.project && !activeTask.project) joining = { ...activeTask, project: block.project }
   }

   // finishing is more than a move — it needs a timestamp and a history entry, so
   // toggleDone owns that transition and a drop onto the finished list routes there
   if (activeGroup === DONE || overGroup === DONE) return taskList

   // dropped on a different list: the task takes that list's fields and lands at the
   // drop position. On a row it goes right before it, which also guarantees it ends up
   // inside the target group's slots; on the bare list it goes to the end of that list
   if (activeGroup !== overGroup) {
      const without = taskList.filter((t) => t.id !== activeId)
      const lastOfGroup = lastIndexOfGroup(without, overGroup)
      const insertAt = overTask
         ? without.findIndex((t) => t.id === overId)
         : (lastOfGroup === -1 ? without.length : lastOfGroup + 1)
      return [
         ...without.slice(0, insertAt),
         withGroup(joining, overGroup),
         ...without.slice(insertAt),
      ]
   }

   const groupSlots = taskList.reduce((slots, task, i) => {
      if (groupKey(task) === activeGroup) slots.push(i)
      return slots
   }, [])
   const groupTasks = groupSlots.map((i) => taskList[i])

   const from = groupTasks.findIndex((t) => t.id === activeId)
   // dropping on the list itself, below every row, reads as "put it at the end"
   const to = overTask ? groupTasks.findIndex((t) => t.id === overId) : groupTasks.length - 1

   const reorderedGroup = arrayMove(groupTasks, from, to)

   return taskList.map((task, i) => {
      const groupIndex = groupSlots.indexOf(i)
      return groupIndex === -1 ? task : reorderedGroup[groupIndex]
   })
}
