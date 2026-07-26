import React from 'react'

export default function TaskItem({ task, onToggle, onDelete }) {

    return (
        <div className='group task-item flex justify-between' onClick={() => onToggle(task.id)}>
            <span
                role='checkbox'
                aria-checked={task.done}
                className={
                    'size-5.5 rounded-sm flex items-center justify-center text-white text-[13px] ' +
                    'border-(length:--border-w-thick) transition-all duration-(--dur-fast) ease-bounce ' +
                    (task.done ? 'border-accent-muted bg-accent-muted' : 'border-border-soft bg-surface')
                }
            >{task.done ? '✦' : ''}</span>
            <span className={(task.done ? 'line-through text-text-muted' : 'text-text-primary') + ' select-none'}>
                {task.label}
            </span>
            <span className='opacity-0 group-hover:opacity-100 transition-opacity duration-(--dur-fast) ease-bounce text-text-muted
            hover:text-text-primary'
                onClick={(e) => {
                    e.stopPropagation()
                    onDelete(task.id)
                }}>
                ✕
            </span>
        </div>
    )
}
