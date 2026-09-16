import { useContext, useState, useRef } from 'react'
import TasksContext from '../../context/TasksContext'
import TaskInput from '../../components/tasks/TaskInput'
import MultiSwitchFlag from '../../components/elements/MultiSwitchFlag'
import TaskSection from '../../components/tasks/TaskSection'
import TaskItem from '../../components/tasks/TaskItem'
import TaskDndArea from '../../components/tasks/TaskDndArea'
import { bucketOptions } from '../../utils/buckets'
import { ACTIVE, BACKLOG, NEXTUP } from '../../utils/constants'

// project-only — 'Today' picks the ACTIVE list, not a backlog bucket, so it doesn't
// belong in the shared bucketOptions (Backlog.jsx's shift-arrows depend on that array's
// exact index bounds — see buckets.js)
const placementOptions = [{ value: ACTIVE, label: 'Today', emoji: '⚡' }, ...bucketOptions]

// tasks tagged with this project, grouped the same way the day list and Backlog already
// are (Active + backlog buckets) — same groupKey shape, so drag/drop needs no new logic
export default function ProjectTasks({ project }) {
   const { taskList, taskActions, runningTaskId, trackedSeconds } = useContext(TasksContext)
   const { handleAddTask, reorderTaskList, moveTaskAcrossLists } = taskActions
   const [placement, setPlacement] = useState(NEXTUP)
   const taskInputRef = useRef(null)

   const taskActionBundle = { ...taskActions, runningTaskId, trackedSeconds }
   const projectTasks = taskList.filter(t => t.project === project.id)
   const activeTasks = projectTasks.filter(t => t.list === ACTIVE)

   const handleSubmit = (name, time) => {
      const opts = placement === ACTIVE
         ? { list: ACTIVE, project: project.id }
         : { list: BACKLOG, bucket: placement, project: project.id }
      handleAddTask(name, time, opts)
   }

   const renderDragOverlay = (id) => {
      const task = projectTasks.find(t => t.id === id)
      return task ? <TaskItem task={task} {...taskActionBundle} showEstimate={false} /> : null
   }

   const renderBucketSection = ({ value, label }) => {
      const tasks = projectTasks.filter(t => t.list === BACKLOG && (t.backlog?.bucket ?? NEXTUP) === value)
      return (
         <TaskSection key={value} label={label} tasks={tasks} groupId={`${BACKLOG}:${value}`}
            taskActions={taskActionBundle} showEstimate={false} showProjectName={false} />
      )
   }

   return (
      <div className='flex flex-col gap-3'>
         <div className='flex gap-2 w-full'>
            <MultiSwitchFlag options={placementOptions} value={placement} onChange={setPlacement}
               onSubmit={() => taskInputRef.current?.submit()} rounded='rounded-md' width='w-26' />
            <TaskInput id={`project-${project.id}`} ref={taskInputRef} onSubmit={handleSubmit} width='w-full' />
         </div>
         <TaskDndArea onReorder={reorderTaskList} onMoveAcrossLists={moveTaskAcrossLists}
            renderDragOverlay={renderDragOverlay} className='flex flex-col gap-3'>
            <TaskSection label='Today' tasks={activeTasks} groupId={ACTIVE}
               taskActions={taskActionBundle} showEstimate={false} showProjectName={false} defaultOpen />
            {bucketOptions.map(renderBucketSection)}
         </TaskDndArea>
      </div>
   )
}
