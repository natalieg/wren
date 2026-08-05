import { useEffect, useState } from 'react'
import Checkbox from '../elements/Checkbox'
import { formatClockTime } from '../../utils/formatTime'
import PlayBtn from '../elements/PlayBtn'
import TimeFlag from '../elements/TimeFlag'
import Modal from '../elements/Modal'
import TaskEditModalBody from './TaskEditModalBody'

// TODO add right click menu for actions, including keyboard shortcut information
export default function TaskItem({ index, task, toggleDone, toggleActive, handleFieldChange, blockKeys, onDelete, startTracking, stopTracking, runningTaskId, trackedSeconds, showEstimate, editingTaskId, setEditingTaskId }) {
    const { id, label, trackedTime, time, estimate, finishedTimestamp, possibleEstimate } = task
    const done = task.list === 'done'
    const isTracking = id === runningTaskId
    const [mouseOver, setMouseOver] = useState(false)
    // lives above this component (see useTasks.js) — a task can move to a different
    // TaskGroup (active/backlog, bucket A/B) while its modal is open, which would
    // unmount/remount TaskItem and wipe out any locally-held "am I editing" state
    const isEditing = editingTaskId === id
    const isActive = estimate

    useEffect(() => {
        if (!mouseOver || blockKeys) return
        const handleKeyDown = (e) => {
            if (e.key === 'c' && task.list !== 'done') toggleDone(id) // marks task done
            if (e.key === 'a' && task.list !== 'active') toggleActive(id) // marks task active
            if (e.key === 'p' && task.list === 'active') toggleActive(id) // marks task inactive
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [mouseOver, task, id, toggleDone, toggleActive, blockKeys])

    const handleTimeTracking = () => {
        const nowTracking = !isTracking
        if (nowTracking) {
            startTracking(id)
        } else {
            stopTracking()
        }
    }

    return (
        <div className={`${showEstimate && 'grid-cols-[80%_20%]'} group task-wrapper hover:bg-accent-soft/30 rounded-md py-1 px-2 grid  gap-2 items-center
        ${isTracking ? 'bg-gradient-softer' : ''}`}>
            <div className='group task-item task-border task-hover flex justify-between'
                onMouseEnter={() => setMouseOver(true)}
                onMouseLeave={() => setMouseOver(false)}
                onClick={() => setEditingTaskId(id)}>
                <Checkbox id={id} onToggle={toggleDone} checked={done} />
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
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete(id)
                        }}>
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
            {isEditing &&
                <Modal title='edit task' width='w-120' onClose={() => setEditingTaskId(null)}>
                    <TaskEditModalBody
                        task={task}
                        handleChange={handleFieldChange}
                        toggleDone={toggleDone}
                        toggleActive={toggleActive}
                        closeModal={() => setEditingTaskId(null)} />
                </Modal>}
        </div>
    )
}

export function TaskItemViewOnly({ task, isTracking, trackedSeconds, onToggleTracking }) {
    const { label, trackedTime, time } = task
    return (
        <div className="task-item flex justify-between items-center gap-2">
            <span className="select-none">{label}</span>
            <div className="flex gap-2 items-center">
                <PlayBtn onClick={onToggleTracking} active={isTracking} showAlways />
                <TimeFlag tracked={(trackedTime || 0) + (isTracking ? trackedSeconds : 0)} time={time} isTracking={isTracking} />
            </div>
        </div>
    )
}