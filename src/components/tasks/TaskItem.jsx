import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ConfirmModal from '../elements/ConfirmModal'
import { isRecurring } from '../../utils/recurring'
import Checkbox from '../elements/Checkbox'
import SimpleTag from '../elements/SimpleTag'
import { formatClockTime } from '../../utils/formatTime'
import PlayBtn from '../elements/PlayBtn'
import TimeFlag from '../elements/TimeFlag'
import { BACKLOG, DONE, NEXTUP } from '../../utils/constants'
import { CompactCheckboxCount } from '../CheckboxCount'

// wraps a row in dnd-kit's sortable. Only rows that are actually sortable render through
// this — the pinned running task renders TaskItem directly, so it never receives a transform
export function SortableTaskItem({ task, ...props }) {
   // the task rides along in data so a list that can't take a live move can still
   // render a placeholder with the real label on it
   const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
      useSortable({ id: task.id, data: { task } })

   const dragProps = {
      ref: setNodeRef,
      style: { transform: CSS.Translate.toString(transform), transition, touchAction: 'none' },
      ...attributes,
      ...listeners,
   }

   return <TaskItem task={task} dragProps={dragProps} isDragging={isDragging} {...props} />
}

// TODO add right click menu for actions, including keyboard shortcut information
// TODO add context menu for backlog actions
export default function TaskItem({ index, task, toggleDone, onDelete, moveTaskToList, startTracking, stopTracking, runningTaskId, trackedSeconds, showEstimate, setEditingTaskId, dragProps, isDragging }) {
   const { id, label, notes, trackedTime, time, estimate, finishedTimestamp, possibleEstimate } = task
   const done = task.list === DONE
   const isTracking = id === runningTaskId
   const isActive = estimate

   const handleTimeTracking = () => {
      const nowTracking = !isTracking
      if (nowTracking) {
         startTracking(id)
      } else {
         stopTracking()
      }
   }

   // confirm delete for special tasks (recurring) — otherwise delete immediately
   const [confirmingDelete, setConfirmingDelete] = useState(false)
   const needsConfirm = isRecurring(task) && !done

   const handleDelete = (e) => {
      e.stopPropagation()
      if (needsConfirm) return setConfirmingDelete(true)
      onDelete(id)
   }

   return (
      <div {...dragProps}
         className={`${showEstimate && 'grid-cols-[80%_20%]'} group task-wrapper hover:bg-accent-soft/30 rounded-md py-1 px-2 grid  gap-2 items-center
        ${isDragging ? 'bg-gradient-mutewarm' : ''}
        ${isTracking ? 'bg-gradient-softer' : ''}`}>
         <div className='group task-item task-border task-hover flex justify-between'
            data-task-id={id}
            data-task-context='tasks'
            onClick={() => setEditingTaskId(id)}>
            <Checkbox id={id} onToggle={toggleDone} checked={done} />
            {notes && notes?.length > 0 && <CompactCheckboxCount text={notes} />}
            {/* Recurring */}
            {task.recurring?.active && <SimpleTag value="↻" />}
            {/* label */}
            <span className={(done ? 'line-through text-text-muted' : 'text-text-primary')
               + ' select-none w-full'}>
               {label}
            </span>
            <div className='flex gap-2 items-center'>
               {/* Time */}
               {!finishedTimestamp &&
                  <PlayBtn id={'toggleTracking_' + id}
                     onClick={handleTimeTracking}
                     showAlways={isActive && index === 0}
                     active={isTracking} />}
               <TimeFlag tracked={(trackedTime || 0) + (isTracking ? trackedSeconds : 0)}
                  time={time} isTracking={isTracking}
                  isFinished={!!finishedTimestamp} />
               {/* Delete */}
               <span className='opacity-0 group-hover:opacity-100 transition-opacity duration-(--dur-fast) ease-bounce text-text-muted
                                    hover:text-text-primary'
                  onClick={handleDelete}>
                  ✕
               </span>
            </div>
         </div>
         {possibleEstimate &&
            <div className='w-20 flex items-center justify-center text-center'>{formatClockTime(possibleEstimate)}</div>}
         {estimate &&
            <div className='w-20 flex items-center justify-center text-center'>{formatClockTime(estimate)}</div>}
         {finishedTimestamp &&
            <div className='w-20 text-text-muted/70 group-hover:text-text-secondary flex items-center justify-center text-center'>{formatClockTime(finishedTimestamp)}</div>}
         {confirmingDelete &&
            <ConfirmModal
               title='delete a habit?'
               message={`"${label}" is recurring. Deleting it here ends the recurrence — its settings and its ${task.recurring?.count ?? 0} completions go with it.`}
               confirmLabel='Delete habit'
               altLabel='Park for tomorrow'
               onConfirm={() => { setConfirmingDelete(false); onDelete(id) }}
               onAlt={() => { setConfirmingDelete(false); moveTaskToList(id, BACKLOG, { bucket: NEXTUP }) }}
               onCancel={() => setConfirmingDelete(false)} />}
      </div>
   )
}

export function TaskItemViewOnly({ task, isTracking, trackedSeconds, onToggleTracking, toggleDone }) {
   const { label, trackedTime, time, id, done, } = task
   return (
      <div className="task-item flex justify-between items-center gap-2">
         <Checkbox id={id} onToggle={toggleDone} checked={done} />
         <span className="select-none">{label}</span>
         <div className="flex gap-2 items-center">
            <PlayBtn onClick={onToggleTracking} active={isTracking} showAlways />
            <TimeFlag tracked={(trackedTime || 0) + (isTracking ? trackedSeconds : 0)} time={time} isTracking={isTracking} />
         </div>
      </div>
   )
}