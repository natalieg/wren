import { useContext, useState, useRef } from 'react'
import DocWrapper from '../components/DocWrapper'
import TasksContext from '../context/TasksContext'
import TaskInput from '../components/tasks/TaskInput'
import MultiSwitchFlag from '../components/elements/MultiSwitchFlag'
import TaskGroup from '../components/tasks/TaskGroup'
import { Divider } from '../components/elements/Divider'
import { bucketOptions } from '../utils/buckets'
/**
 * current Buckets: 'nextUp', 'nextWeek', 'someday'
 * later: 'nextMonth', 'nextQuarter',
 * @returns
 */
// TODO add shortcuts eg numbers for buckets 
export default function Backlog() {
  // backlogTasks: flat list of list==='backlog' tasks, no time/estimate calc (not needed here)
  const { backlogTasks, taskActions } = useContext(TasksContext)
  const { handleAddTask, handleFieldChange } = taskActions
  const [bucket, setBucket] = useState('nextUp')
  const taskInputRef = useRef(null)

  const handleSubmit = (name, time) => {
    handleAddTask(name, time, { list: 'backlog', bucket })
  }

  // LATER change once DND is implemented
  const shiftBucket = (task, direction) => {
    const index = bucketOptions.findIndex(o => o.value === task.backlog.bucket)
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= bucketOptions.length) return
    handleFieldChange(task.id, 'backlog', { ...task.backlog, bucket: bucketOptions[nextIndex].value })
  }

  const renderBucketSection = (bucketValue, showDivider) => {
    const tasks = backlogTasks.filter(t => t.backlog?.bucket === bucketValue)
    if (tasks.length === 0) return null
    const index = bucketOptions.findIndex(o => o.value === bucketValue)
    return (
      <>
        {showDivider && <Divider label={bucketOptions[index]?.label} />}
        {tasks.map(t => (
          <div key={t.id} className='flex items-center gap-1'>
            <div className='flex-1 min-w-0'>
              <TaskGroup tasks={[t]} {...taskActions} showEstimate={false} />
            </div>
            {/* LATEr remove when dnd is integrated */}
            {index > 0 &&
              <button type='button' onClick={() => shiftBucket(t, -1)}
                className='px-1 text-text-muted hover:text-text-primary cursor-pointer'>▲</button>}
            {index < bucketOptions.length - 1 &&
              <button type='button' onClick={() => shiftBucket(t, 1)}
                className='px-1 text-text-muted hover:text-text-primary cursor-pointer'>▼</button>}
          </div>
        ))}
      </>
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
      <div className='flex flex-col mx-auto w-full'>
        {renderBucketSection('nextUp', true)}
        {renderBucketSection('nextWeek', true)}
        {renderBucketSection('someday', true)}
      </div>
    </DocWrapper>
  )
}
