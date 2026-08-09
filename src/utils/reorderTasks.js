import { BACKLOG, NEXTUP, DONE } from './constants.js'
import { arrayMove } from '@dnd-kit/sortable'

// which rendered list a task belongs to — dnd only reorders within one of them.
// backlog needs the bucket too: each bucket is its own list on the Backlog page.
export function groupKey(task) {
   if (task.list === BACKLOG) return `${BACKLOG}:${task.backlog?.bucket ?? NEXTUP}`
   return task.list
}

// rewrites the list/bucket fields so a dragged task belongs where it was dropped.
// activationDate rides along, it belongs to the task and not to the bucket
function withGroupOf(task, target) {
   if (target.list !== BACKLOG) return { ...task, list: target.list, backlog: undefined }
   return {
      ...task,
      list: BACKLOG,
      backlog: {
         bucket: target.backlog?.bucket ?? NEXTUP,
         activationDate: task.backlog?.activationDate ?? null,
      },
   }
}

// dnd-kit reports "A over B" in the filtered slice a page renders, but the order lives in
// the full taskList — so only the slots the dragged group occupies get rewritten.
export default function reorderTasks(taskList, activeId, overId) {
   if (activeId === overId) return taskList // dropped on itself
   if (activeId == null || overId == null) return taskList // unknown id

   const activeTask = taskList.find((t) => t.id === activeId)
   const overTask = taskList.find((t) => t.id === overId)
   if (!activeTask || !overTask) return taskList    
   const activeGroup = groupKey(activeTask)
   const overGroup = groupKey(overTask)

   // finishing is more than a move — it needs a timestamp and a history entry, so
   // toggleDone owns that transition and a drop onto the finished list routes there
   if (activeGroup === DONE || overGroup === DONE) return taskList

   // dropped on a different list: the task takes that list's fields and lands at the
   // drop position. Insert before the task it was dropped on, which also guarantees
   // it ends up inside the target group's slots
   if (activeGroup !== overGroup) {
      const without = taskList.filter((t) => t.id !== activeId)
      const insertAt = without.findIndex((t) => t.id === overId)
      return [
         ...without.slice(0, insertAt),
         withGroupOf(activeTask, overTask),
         ...without.slice(insertAt),
      ]
   }

   const groupSlots = taskList.reduce((slots, task, i) => {
      if (groupKey(task) === activeGroup) slots.push(i)
      return slots
   }, [])
   const groupTasks = groupSlots.map((i) => taskList[i])

   const from = groupTasks.findIndex((t) => t.id === activeId)
   const to = groupTasks.findIndex((t) => t.id === overId)

   const reorderedGroup = arrayMove(groupTasks, from, to)

   return taskList.map((task, i) => {
      const groupIndex = groupSlots.indexOf(i)
      return groupIndex === -1 ? task : reorderedGroup[groupIndex]
   })
}
