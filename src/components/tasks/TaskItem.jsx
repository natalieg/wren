import Checkbox from '../elements/Checkbox'

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
    const { id, label, time, done } = task

    return (
        <>
            <div className='group task-item flex justify-between'
                onClick={() => onEdit(id)}>
                <Checkbox id={id} onToggle={onToggle} checked={done} />
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
