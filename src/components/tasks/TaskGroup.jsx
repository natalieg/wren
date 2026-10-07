import { Fragment } from 'react'
import TaskItem, { SortableTaskItem } from './TaskItem'
import { useDndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { formatTime } from '../../utils/formatTime'

// Placeholder for tasks being dragged to lists that can't accept live moves
function DropPlaceholder({ label }) {
   return (
      <div className='rounded-md py-1 px-2 mb-1 border-2 border-dashed border-accent-muted
         text-text-muted select-none truncate'>
         {label}
      </div>
   )
}

// free time before a pinned task, so there's room to squeeze something in
function FreeGap({ minutes }) {
   return (
      <div className='text-xs text-text-muted select-none text-center py-1'>
         ┈ {formatTime(minutes)} free ┈
      </div>
   )
}

// SortableContext for drag-and-drop positioning (DndContext is in TaskDndArea)
export default function TaskGroup({ tasks, groupId, toggleDone, onDelete, moveTaskToList, startTracking, stopTracking, runningTaskId, trackedSeconds, showEstimate, setEditingTaskId, showProjectName }) {
   // Drop target and frame live in TaskDropZone
   const { active, over } = useDndContext()
   const holdsDragged = !!active && tasks.some(t => t.id === active.id)
   const overIndex = over ? tasks.findIndex(t => t.id === over.id) : -1
   const overList = !!over && over.id === groupId
   // Show placeholder only if dragged task isn't already in this list
   const placeholderAt = holdsDragged ? -1
      : overIndex !== -1 ? overIndex
         : overList ? tasks.length : -1

   // Running and time-pinned tasks are fixed in place: not draggable, not droppable
   const isFixed = (t) => t.id === runningTaskId || t.pinned
   return (
      <SortableContext items={tasks.filter(t => !isFixed(t)).map(t => t.id)}
         strategy={verticalListSortingStrategy}>
         <div className='flex flex-col'>
            {tasks.map((t, index) => {
               const Row = isFixed(t) ? TaskItem : SortableTaskItem
               return (
               <Fragment key={t.id}>
               {placeholderAt === index &&
                  <DropPlaceholder label={active?.data?.current?.task?.label} />}
               {t.freeMinutesBefore > 0 && <FreeGap minutes={t.freeMinutesBefore} />}
               <Row
                  index={index}
                  task={t}
                  // task actions
                  toggleDone={toggleDone}
                  onDelete={onDelete}
                  moveTaskToList={moveTaskToList}
                  startTracking={startTracking}
                  stopTracking={stopTracking}
                  // states from useTasks through Tasklist
                  runningTaskId={runningTaskId}
                  trackedSeconds={trackedSeconds}
                  setEditingTaskId={setEditingTaskId}
                  // from Tasklist
                  showEstimate={showEstimate}
                  showProjectName={showProjectName}
               />
               </Fragment>
               )
            })}
            {placeholderAt === tasks.length &&
               <DropPlaceholder label={active?.data?.current?.task?.label} />}
         </div>
      </SortableContext>
   )
}
