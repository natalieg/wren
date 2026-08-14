export default function Checkbox({ id, onToggle, checked, disabled = false }) {
    return (
        <span
            id={id}
            role='checkbox'
            onClick={(e) => {
                if (disabled) return
                e.stopPropagation()
                onToggle(id)
            }}
            aria-checked={checked}
            aria-disabled={disabled}
            className={
                'size-5.5 shrink-0 rounded-sm flex items-center justify-center text-white text-[13px] border-(length:--border-w-thick) transition-all duration-(--dur-fast) ease-bounce ' +
                (disabled ? 'cursor-default opacity-60 ' : 'cursor-pointer ') +
                (checked ? 'border-accent-muted bg-accent-muted' : 'border-border-soft bg-surface')
            }
        >{checked ? '✦' : ''}
        </span>
    )
}
