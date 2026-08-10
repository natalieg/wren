import { useContext, useState, useRef } from 'react'
import DocWrapper from '../components/DocWrapper'
import TasksContext from '../context/TasksContext'
import TaskInput from '../components/tasks/TaskInput'
import MultiSwitchFlag from '../components/elements/MultiSwitchFlag'
import TaskGroup from '../components/tasks/TaskGroup'
import TaskItem from '../components/tasks/TaskItem'
import TaskDndArea from '../components/tasks/TaskDndArea'
import TaskDropZone from '../components/tasks/TaskDropZone'
import { Divider } from '../components/elements/Divider'
import { bucketOptions } from '../utils/buckets'
import { BACKLOG, NEXTUP } from '../utils/constants'

/**
 * current Buckets: NEXTUP, NEXTWEEK, SOMEDAY
 * later: 'nextMonth', 'nextQuarter',
 * @returns
 */
// TODO add shortcuts eg numbers for buckets
export default function Backlog() {
  // backlogTasks: flat list of list==='backlog' tasks, no time/estimate calc (not needed here)
  const { backlogTasks, taskActions } = useContext(TasksContext)
  const { handleAddTask, reorderTaskList, moveTaskAcrossLists } = taskActions
  const [bucket, setBucket] = useState(NEXTUP)
  const taskInputRef = useRef(null)

  const handleSubmit = (name, time) => {
    handleAddTask(name, time, { list: BACKLOG, bucket })
  }

  const renderDragOverlay = (id) => {
    const task = backlogTasks.find((t) => t.id === id)
    return task ? <TaskItem task={task} {...taskActions} showEstimate={false} /> : null
  }

  // every bucket renders whether or not it holds anything — an empty bucket still has to
  // be a drop target, and a section that only appears once a drag starts would shift the
  // row dnd-kit just measured (see TaskDropZone)
  const renderBucketSection = ({ value, label }) => {
    const tasks = backlogTasks.filter(t => (t.backlog?.bucket ?? NEXTUP) === value)
    return (
      <div key={value} className='flex flex-col gap-4'>
        <Divider label={label} />
        <TaskDropZone groupId={`${BACKLOG}:${value}`} tasks={tasks}>
          <TaskGroup tasks={tasks} groupId={`${BACKLOG}:${value}`} {...taskActions} showEstimate={false} />
        </TaskDropZone>
      </div>
    )
  }

  return (
    <DocWrapper header='Backlog' className='w-full lg:w-1/2 xl:w-[40%] min-w-150 mx-auto'>
      <div className='flex w-full gap-2 mx-auto mb-4 '>
        <MultiSwitchFlag options={bucketOptions} value={bucket} onChange={setBucket}
          onSubmit={() => taskInputRef.current?.submit()} rounded='rounded-md' width='w-26' />
        <TaskInput id='backlog'
          ref={taskInputRef}
          onSubmit={handleSubmit}
        />
      </div>
      {/* one DndContext for the whole page — dragging between buckets is only possible
          inside a shared context, and each bucket is its own list */}
      <TaskDndArea onReorder={reorderTaskList} onMoveAcrossLists={moveTaskAcrossLists}
        renderDragOverlay={renderDragOverlay}
        className='flex flex-col mx-auto w-full gap-6'>
        {bucketOptions.map(renderBucketSection)}
      </TaskDndArea>
    </DocWrapper>
  )
}
