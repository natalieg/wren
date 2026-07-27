
const lineStyle = { background: 'linear-gradient(90deg, transparent, var(--border-strong) 30%, var(--border-strong) 70%, transparent)' }

export function Divider({ label, glyph = '✦' }) {
    return (
        <div className='flex items-center gap-3 text-text-secondary font-body'>
            <div className='flex-1 h-(--border-w)' style={lineStyle} />
            <span className='text-sm whitespace-nowrap'>{label ? `${glyph} ${label} ${glyph}` : glyph}</span>
            <div className='flex-1 h-(--border-w)' style={lineStyle} />
        </div>
    )
}
