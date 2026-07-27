export default function Checkbox({ id, onToggle, checked }) {
    return (
        <span
            role='checkbox'
            onClick={(e) => {
                e.stopPropagation()
                onToggle(id)
            }}
            aria-checked={checked}
            className={
                'size-5.5 shrink-0 rounded-sm flex items-center justify-center text-white text-[13px] cursor-pointer border-(length:--border-w-thick) transition-all duration-(--dur-fast) ease-bounce ' +
                (checked ? 'border-accent-muted bg-accent-muted' : 'border-border-soft bg-surface')
            }
        >{checked ? '✦' : ''}
        </span>
    )
}
