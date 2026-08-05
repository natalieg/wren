// options: [{ value, label }, ...] — value is what gets stored/compared, label is what's shown
export default function MultiSwitchFlag({ options, value, onChange, width = 'w-30', rounded = 'rounded-pill' }) {
    const index = options.findIndex(o => o.value === value)
    const current = options[index] ?? options[0]

    const step = (direction) => {
        const nextIndex = (index + direction + options.length) % options.length
        onChange(options[nextIndex].value)
    }

    return (
        <div className={`${width} ${rounded} flex justify-center items-center bg-border-soft 
        px-2 py-1 text-sm cursor-pointer select-none
        hover:bg-gradient-mutewarm 
        `}
            onClick={() => step(1)}
            onContextMenu={(e) => { e.preventDefault(); step(-1) }}>
            {current.label}
        </div>
    )
}
