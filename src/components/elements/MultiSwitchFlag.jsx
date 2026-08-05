// options: [{ value, label }, ...] — value is what gets stored/compared, label is what's shown
export default function MultiSwitchFlag({ options, value, onChange, onSubmit, width = 'w-30', rounded = 'rounded-pill' }) {
  const index = options.findIndex(o => o.value === value)
  const current = options[index] ?? options[0]

  const step = (direction) => {
    const nextIndex = (index + direction + options.length) % options.length
    onChange(options[nextIndex].value)
  }

  // Enter submits when an onSubmit is wired up (e.g. Backlog's input row), otherwise
  // just cycles like a click. Space always cycles, never submits.
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit()
      return
    }
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault() // stop Space from scrolling the page
    step(1)
  }

  return (
    <div className={`${width} ${rounded} flex justify-center items-center bg-border-soft
        px-2 py-1 text-sm cursor-pointer select-none
        hover:bg-gradient-mutewarm
        focus-visible:outline-accent-soft focus-visible:shadow-glow-accent
        `}
      role='button'
      tabIndex={0}
      onClick={() => step(1)}
      onContextMenu={(e) => { e.preventDefault(); step(-1) }}
      onKeyDown={handleKeyDown}>
      {current.emoji}
      {current.label}
    </div>
  )
}
