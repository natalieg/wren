import React from 'react'
import PropTypes from 'prop-types'

const BAR_COLORS = {
    accent: 'var(--color-accent-primary)',
    success: 'var(--color-success)',
    muted: 'var(--color-text-muted)',
}

export default function Bar({ percent, color = 'accent', freestyle }) {
    return (
        <div className='bar'>
            <span className='bar-fill' style={{ width: `${percent}%`, background: freestyle || BAR_COLORS[color] }}></span>
        </div>
    )
}

Bar.propTypes = {
    percent: PropTypes.number.isRequired,
    color: PropTypes.oneOf(Object.keys(BAR_COLORS)),
    freestyle: PropTypes.string,
}
