import { BACKLOG, NEXTUP, } from './constants.js'
import { arrayMove } from '@dnd-kit/sortable'

// which rendered list a task belongs to — dnd only reorders within one of them.
// backlog needs the bucket too: each bucket is its own list on the Backlog page.
function groupKey(task) {
   if (task.list === BACKLOG) return `${BACKLOG}:${task.backlog?.bucket ?? NEXTUP}`
   return task.list
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
   if (activeGroup !== overGroup) return taskList // different groups, not a reorder

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
