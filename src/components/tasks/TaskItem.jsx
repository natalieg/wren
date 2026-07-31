import { useEffect, useState } from 'react'
import Checkbox from '../elements/Checkbox'
import { formatClockTime } from '../../utils/formatTime'

// TODO add right click menu for actions, including keyboard shortcut information
export default function TaskItem({ task, toggleDone, toggleActive, blockKeys, onDelete, onEdit }) {
    const { id, label, time, done, estimate, finishedTimestamp, possibleEstimate } = task
    const [mouseOver, setMouseOver] = useState(false)

    useEffect(() => {
        if (!mouseOver || blockKeys) return
        const handleKeyDown = (e) => {
            if (e.key === 'c' && !task.done) toggleDone(id) // marks task done
            if (e.key === 'a' && !task.active) toggleActive(id) // marks task active
            if (e.key === 'p' && task.active) toggleActive(id) // marks task inactive
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [mouseOver, task, id, toggleDone, toggleActive, blockKeys])

    return (
        <div className='group task-wrapper hover:bg-accent-soft/30 rounded-md py-1 px-2 grid grid-cols-[80%_20%] gap-2 items-center'>
            <div className='group task-item flex justify-between'
                onMouseEnter={() => setMouseOver(true)}
                onMouseLeave={() => setMouseOver(false)}
                onClick={() => onEdit(id)}>
                <Checkbox id={id} onToggle={toggleDone} checked={done} />
                <span className={(done ? 'line-through text-text-muted' : 'text-text-primary')
                    + ' select-none w-full'}>
                    {label}
                </span>
                <div className='flex gap-2 items-center'>
                    <span className='w-14 bg-border-soft text-text-primary px-1 rounded-sm text-sm select-none'>{time} min</span>
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
        </div>
    )
}
