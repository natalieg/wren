import { Fragment } from 'react'
import TaskItem, { SortableTaskItem } from './TaskItem'
import { useDndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

// stands in for a task a list is about to receive. Lists that accept a live move never
// show one — the real row is already sitting there — so this only fills the gap for
// lists a task can't be moved into mid-drag, like finished
function DropPlaceholder({ label }) {
   return (
      <div className='rounded-md py-1 px-2 mb-1 border-2 border-dashed border-accent-muted
         text-text-muted select-none truncate'>
         {label}
      </div>
   )
}

// one SortableContext per rendered list — its ids are what dnd-kit reports
// positions against. The DndContext around it lives on the page (TaskDndArea).
export default function TaskGroup({ tasks, toggleDone, onDelete, startTracking, stopTracking, runningTaskId, trackedSeconds, showEstimate, setEditingTaskId }) {
   // outlines the list a drag can actually land in, so a refused drop reads as "no
   // outline here" instead of an unexplained snap back. Today only the list the task
   // came from qualifies — once drops across lists work, every valid target lights up.
   const { active, over } = useDndContext()
   const holdsDragged = !!active && tasks.some(t => t.id === active.id)
   const overIndex = over ? tasks.findIndex(t => t.id === over.id) : -1
   const isDropZone = holdsDragged || overIndex !== -1
   // only lists that haven't already received the dragged row need one
   const placeholderAt = !holdsDragged && overIndex !== -1 ? overIndex : -1

   // the running task is left out on purpose — it is pinned and non-droppable, and a
   // non-droppable id inside items desyncs the row-shift math from the drop target
   return (
      <SortableContext items={tasks.filter(t => t.id !== runningTaskId).map(t => t.id)}
         strategy={verticalListSortingStrategy}>
         <div className={`flex flex-col rounded-md transition-[outline-color] duration-(--dur-fast)
            outline-2 outline-offset-4 ${isDropZone ? 'outline-accent-muted bg-accent-soft/30' : 'outline-transparent'}`}>
            {tasks.map((t, index) => {
               // the running task renders unsortable, so no leftover drag transform can
               // displace it once tracking stops and it moves back into the flow
               const Row = t.id === runningTaskId ? TaskItem : SortableTaskItem
               return (
               <Fragment key={t.id}>
               {placeholderAt === index &&
                  <DropPlaceholder label={active?.data?.current?.task?.label} />}
               <Row
                  index={index}
                  task={t}
                  // task actions
                  toggleDone={toggleDone}
                  onDelete={onDelete}
                  startTracking={startTracking}
                  stopTracking={stopTracking}
                  // states from useTasks through Tasklist
                  runningTaskId={runningTaskId}
                  trackedSeconds={trackedSeconds}
                  setEditingTaskId={setEditingTaskId}
                  // from Tasklist
                  showEstimate={showEstimate}
               />
               </Fragment>
               )
            })}
         </div>
      </SortableContext>
   )
}
