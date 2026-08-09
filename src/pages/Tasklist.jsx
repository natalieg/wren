import { useContext } from 'react'
import TaskGroup from '../components/tasks/TaskGroup'
import TaskDndArea from '../components/tasks/TaskDndArea'
import CollapsableDiv from '../components/CollapsableDiv'
import TimeProgress from '../components/TimeProgress'
import TasksContext from '../context/TasksContext'
import TaskInput from '../components/tasks/TaskInput'

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

   const { handleAddTask, deleteAllFinishedTasks, reorderTaskList } = taskActions

   const taskActionBundle = {
      ...taskActions,
      runningTaskId,
      trackedSeconds,
   }

   const runningTask = openTasks.find((t) => t.id === runningTaskId)
   const openTasksWithoutRunning = openTasks.filter((t) => t.id !== runningTaskId)


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
            <TaskDndArea onReorder={reorderTaskList}>
               {/* 💤 Next up (backlog, 'nextUp' bucket) */}
               {/* Todo move to side component when implemented */}
               {nextUpTasks.length > 0 && (
                  <CollapsableDiv
                     label={`Next up (${nextUpTasks.length})`}
                     collapseAction={updateActionTime}>
                     <TaskGroup tasks={nextUpTasks} {...taskActionBundle} showEstimate={true} />
                  </CollapsableDiv>
               )}
               {/* ⚡ Active Tasks */}
               <TaskGroup tasks={openTasksWithoutRunning} {...taskActionBundle} showEstimate={true} />
               {/* ✅ Finished Tasks */}
               {finishedTasks.length > 0 && (
                  <CollapsableDiv
                     label={`Finished tasks (${finishedTasks.length})`}>
                     <TaskGroup tasks={finishedTasks} {...taskActionBundle} showEstimate={true} />
                     <button id='deleteAllFinishedBtn'
                        className={`softButton mt-4 min-w-40 w-1/2 mx-auto block`}
                        disabled={finishedTasks.length === 0}
                        onClick={deleteAllFinishedTasks}>
                        Delete all finished tasks
                     </button>
                  </CollapsableDiv>
               )}
            </TaskDndArea>
         </div>
      </div>
   )
}
