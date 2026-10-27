import { useContext, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { useDndContext } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import TasksContext from '../../../context/TasksContext'
import TaskGroup from '../../../components/tasks/TaskGroup'
import TaskDropZone from '../../../components/tasks/TaskDropZone'
import TaskInput from '../../../components/tasks/TaskInput'
import BlockHeader from './BlockHeader'
import BlockGeneralRow from './BlockGeneralRow'
import { blockLane } from './blockLayout'
import { blockStats, blockGroupKey, fittingCandidates, canJoinBlock } from '../../../utils/blocks'
import { formatClockTime } from '../../../utils/formatTime'
import useProjectsContext from '../../../hooks/useProjectsContext'

const smallBtn = 'text-xs px-2 py-0.5 rounded-pill text-text-muted hover:text-text-primary hover:bg-accent-soft/60 cursor-pointer disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent'

// a time block on the day list: the header drags the whole block, the tasks inside are their own list.
// The frame only spans the task column, estimates stay outside like on any row
export default function TimeBlock({ block, members, taskActionBundle }) {
   const { taskList } = useContext(TasksContext)
   const { projects } = useProjectsContext()
   const { runningTaskId, trackedSeconds, startTracking, stopTracking, toggleDone, onDelete,
      handleAddTask, handleFieldChange, fillBlock } = taskActionBundle
   const [adding, setAdding] = useState(false)
   const stats = blockStats(block, taskList, { runningTaskId, trackedSeconds })
   const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
      useSortable({ id: block.id, data: { task: block }, disabled: stats.isBusy })
   // a running block never hides what's running
   const generalRunning = runningTaskId === block.id
   const open = !block.collapsed || stats.isBusy
   const generalOpen = !!block.showGeneral || generalRunning
   const fillCount = fittingCandidates(taskList, block, { fromNextUp: true }).length
   const groupId = blockGroupKey(block.id)
   const projectName = projects.find(p => p.id === block.project)?.name ?? block.label

   // a task dragged over the inside: the frame itself says whether it may land here
   const { active, over } = useDndContext()
   const dragged = active?.data?.current?.task
   const overInside = !!over && (over.id === groupId || members.some(t => t.id === over.id))
   const incoming = overInside && !!dragged && !members.some(t => t.id === dragged.id)
   const refused = incoming && !canJoinBlock(dragged, block)
   const frameStyle = refused ? 'border-failure bg-failure-light/30'
      : incoming ? 'border-accent-primary bg-accent-soft/30'
         : 'border-accent-muted bg-surface'

   return (
      <div style={{ transform: CSS.Translate.toString(transform), transition }}
         className={`relative my-2 py-1 ${isDragging ? 'opacity-40' : ''}`}>
         <div className={`absolute inset-y-0 left-0 w-[calc(80%+4px)] rounded-lg border-2 pointer-events-none
            transition-colors duration-(--dur-fast) ${frameStyle}`} />
         {refused &&
            <div className='absolute -top-2 left-4 z-10 px-2 rounded-pill bg-failure text-surface text-xs select-none'>
               only {projectName} tasks
            </div>}
         <div className='relative flex flex-col gap-1 pt-1'>
            <BlockHeader block={block} stats={stats}
               nodeRef={setNodeRef} handleProps={{ ...attributes, ...listeners, style: { touchAction: 'none' } }}
               open={open} onToggleOpen={() => handleFieldChange(block.id, 'collapsed', open)}
               generalOpen={generalOpen} onToggleGeneral={() => handleFieldChange(block.id, 'showGeneral', !block.showGeneral)}
               onFinish={() => toggleDone(block.id)} onDelete={() => onDelete(block.id)} />
            {open && <>
               <TaskDropZone groupId={groupId} tasks={members} frame={false}>
                  {members.length === 0 &&
                     <p className='text-xs text-text-muted text-center py-3 mr-[20%] select-none'>drop tasks here</p>}
                  <TaskGroup tasks={members} groupId={groupId} {...taskActionBundle} showEstimate={true} showProjectName={!block.project}
                     accepts={(task) => canJoinBlock(task, block)} />
               </TaskDropZone>
               {generalOpen &&
                  <div className={blockLane}>
                     <BlockGeneralRow blockId={block.id} seconds={stats.generalSeconds} isTracking={generalRunning}
                        startTracking={startTracking} stopTracking={stopTracking}
                        onSetSeconds={(seconds) => handleFieldChange(block.id, 'trackedTime', seconds)} />
                  </div>}
               {adding &&
                  <div className={blockLane}>
                     <TaskInput id={`block_${block.id}`} width='w-full'
                        onSubmit={(label, time) => handleAddTask(label, time, { project: block.project, blockId: block.id })} />
                  </div>}
               {/* the block's end sits at its bottom, in the estimate column like any row */}
               <div className={blockLane}>
                  <div className='flex justify-end gap-1 pb-1'>
                     <button type='button' className={smallBtn} onClick={() => setAdding(!adding)}
                        title={adding ? 'Hide task input' : 'Add a task to this block'}>
                        {adding ? '− add' : '+ add'}
                     </button>
                     <button type='button' className={smallBtn} disabled={fillCount === 0}
                        title={block.project
                           ? `Pull ${fillCount} loose today / next-up task(s) of this project into the block`
                           : 'Topic blocks have no project to fill from — drag tasks in instead'}
                        onClick={() => fillBlock(block.id)}>
                        ✦ fill{fillCount > 0 && ` ${fillCount}`}
                     </button>
                  </div>
                  {block.estimate &&
                     <div className='w-20 flex items-end justify-center text-center text-text-secondary' title='Block ends around'>
                        {formatClockTime(block.estimate)}
                     </div>}
               </div>
            </>}
         </div>
      </div>
   )
}
