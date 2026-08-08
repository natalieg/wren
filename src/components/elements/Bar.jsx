import PropTypes from 'prop-types'

const BAR_COLORS = {
    accent: 'var(--background-image-gradient-main)',
    success: 'var(--background-image-gradient-success)',
    muted: 'var(--color-text-muted)',
}

export default function Bar({ percent, color = 'accent', freestyle, overflowEffect = false }) {
    return (
        <div className={`bar ${percent > 100 && overflowEffect ? 'shadow-glow-intense' : ''}`}>
            <span className='bar-fill' style={{ width: `${percent}%`, background: freestyle || BAR_COLORS[color] }}></span>
        </div>
    )
}

Bar.propTypes = {
    percent: PropTypes.number.isRequired,
    color: PropTypes.oneOf(Object.keys(BAR_COLORS)),
    freestyle: PropTypes.string,
}
