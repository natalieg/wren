import React, { useState } from 'react'
import Modal from './elements/Modal'

export default function TaskItem({ task, onToggle, onDelete }) {
    const { id, label, time, done } = task
    const [modalActive, setModalActive] = useState(false)

    return (
        <>
            {modalActive &&
                <Modal title={'edit task'} onClose={() => setModalActive(false)}>
                    hi
                </Modal>
            }
            <div className='group task-item flex justify-between'
                onClick={() => setModalActive(true)}>
                <span
                    role='checkbox'
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggle(id)
                    }}
                    aria-checked={done}
                    className={
                        'size-5.5 shrink-0 rounded-sm flex items-center justify-center text-white text-[13px] ' +
                        'border-(length:--border-w-thick) transition-all duration-(--dur-fast) ease-bounce ' +
                        (done ? 'border-accent-muted bg-accent-muted' : 'border-border-soft bg-surface')
                    }
                >{done ? '✦' : ''}
                </span>
                <span className={(done ? 'line-through text-text-muted' : 'text-text-primary')
                    + ' select-none'}>
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
        </>
    )
}
