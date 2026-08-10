import { useContext } from 'react'
import TaskGroup from '../components/tasks/TaskGroup'
import TaskItem from '../components/tasks/TaskItem'
import TaskDndArea from '../components/tasks/TaskDndArea'
import TaskSection from '../components/tasks/TaskSection'
import TaskDropZone from '../components/tasks/TaskDropZone'
import TimeProgress from '../components/TimeProgress'
import TasksContext from '../context/TasksContext'
import TaskInput from '../components/tasks/TaskInput'
import { ACTIVE, BACKLOG, DONE, NEXTUP } from '../utils/constants'

export default function Tasklist() {
   const {
      openTasks,
      nextUpTasks,
      finishedTasks,
      taskActions,
      startedAt,
      updateActionTime,
      runningTaskId,
      trackedSeconds,
      resetStartedAt,
   } = useContext(TasksContext)

   const { handleAddTask, deleteAllFinishedTasks, reorderTaskList, moveTaskAcrossLists } = taskActions

   const taskActionBundle = {
      ...taskActions,
      runningTaskId,
      trackedSeconds,
   }

   const runningTask = openTasks.find((t) => t.id === runningTaskId)
   const openTasksWithoutRunning = openTasks.filter((t) => t.id !== runningTaskId)

   // the floating copy under the cursor while dragging — same row component, so it can't
   // drift from how a task actually looks
   const renderDragOverlay = (id) => {
      const task = [...openTasks, ...nextUpTasks, ...finishedTasks].find((t) => t.id === id)
      return task ? <TaskItem task={task} {...taskActionBundle} showEstimate={true} /> : null
   }


   return (
      <div id='taskList' className='w-full lg:w-1/2 xl:w-[40%] min-w-150'>
         <p className='headerDark'>Tasks</p>
         <div className='flex flex-col gap-2 max-w-[95%] mx-auto'>
            <TaskInput
               id='main'
               onSubmit={handleAddTask}
            />
            {/* Time display + Bar */}
            <TimeProgress openTasks={openTasks} finishedTasks={finishedTasks} startedAt={startedAt} resetStartedAt={resetStartedAt} />
            {/* Running Task Only */}
            {runningTask && (
               <TaskGroup tasks={[runningTask]} {...taskActionBundle} showEstimate={true} />
            )}

            {/* every group on the page shares one DndContext — a drag can only cross
            lists inside the same context, which is what buckets/habits will need */}
            {/* TEST  onMoveAcrossLists={moveTaskAcrossLists} comment out to test visual preference*/}
            <TaskDndArea onReorder={reorderTaskList} 
               renderDragOverlay={renderDragOverlay}
               className='flex flex-col gap-6'>
               {/* 💤 Next up (backlog, 'nextUp' bucket) */}
               {/* Todo move to side component when implemented */}
               <TaskSection label='Next up'
                  tasks={nextUpTasks}
                  groupId={`${BACKLOG}:${NEXTUP}`}
                  collapseAction={updateActionTime}
                  taskActions={taskActionBundle}
                  showEstimate={true} />
               {/* ⚡ Active Tasks */}
               <TaskDropZone groupId={ACTIVE} tasks={openTasksWithoutRunning}>
                  <TaskGroup tasks={openTasksWithoutRunning} groupId={ACTIVE} {...taskActionBundle} showEstimate={true} />
               </TaskDropZone>
               {/* ✅ Finished Tasks */}
               <TaskSection label='Finished tasks'
                  tasks={finishedTasks}
                  groupId={DONE}
                  taskActions={taskActionBundle}
                  showEstimate={true}>
                  <button id='deleteAllFinishedBtn'
                     className={`softButton mt-4 min-w-40 w-1/2 mx-auto block`}
                     disabled={finishedTasks.length === 0}
                     onClick={deleteAllFinishedTasks}>
                     Delete all finished tasks
                  </button>
               </TaskSection>
            </TaskDndArea>
         </div>
      </div>
   )
}
