import TaskItem, { SortableTaskItem } from './TaskItem'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

// one SortableContext per rendered list — its ids are what dnd-kit reports
// positions against. The DndContext around it lives on the page (TaskDndArea).
export default function TaskGroup({ tasks, toggleDone, onDelete, startTracking, stopTracking, runningTaskId, trackedSeconds, showEstimate, setEditingTaskId }) {
   // the running task is left out on purpose — it is pinned and non-droppable, and a
   // non-droppable id inside items desyncs the row-shift math from the drop target
   return (
      <SortableContext items={tasks.filter(t => t.id !== runningTaskId).map(t => t.id)}
         strategy={verticalListSortingStrategy}>
         <div className='flex flex-col'>
            {tasks.map((t, index) => {
               // the running task renders unsortable, so no leftover drag transform can
               // displace it once tracking stops and it moves back into the flow
               const Row = t.id === runningTaskId ? TaskItem : SortableTaskItem
               return (
               <Row key={t.id}
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
               )
            })}
         </div>
      </SortableContext>
   )
}
