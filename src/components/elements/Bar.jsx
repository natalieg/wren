import PropTypes from 'prop-types'

const BAR_COLORS = {
    accent: 'var(--background-image-gradient-main)',
    success: 'var(--background-image-gradient-success)',
    muted: 'var(--color-text-muted)',
}

export default function Bar({ percent, color = 'accent', freestyle, overflowEffect = false }) {
    // callers divide by a task's planned time, which is NaN while the field is
    // being cleared and Infinity at 0 — both would emit an invalid CSS width
    const safePercent = Number.isFinite(percent) ? Math.max(percent, 0) : 0
    return (
        <div className={`bar ${safePercent > 100 && overflowEffect ? 'shadow-glow-intense' : ''}`}>
            <span className='bar-fill' style={{ width: `${safePercent}%`, background: freestyle || BAR_COLORS[color] }}></span>
        </div>
    )
}

Bar.propTypes = {
    percent: PropTypes.number.isRequired,
    color: PropTypes.oneOf(Object.keys(BAR_COLORS)),
    freestyle: PropTypes.string,
}
