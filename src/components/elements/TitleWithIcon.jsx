import React from 'react'
import PropTypes from 'prop-types'

export default function TitleWithIcon({ item, index }) {
    return (
        <div className='flex items-center gap-3'>
            <span id={`icon-${index}`}
                className='glow flex items-center justify-center w-2 transform -translate-y-0.5 pl-4'
                style={{ fontSize: item.depth === 0 ? '1.5rem' : '1.1rem' }}>
                {item.icon ?? '◦'}
            </span>
            <span id={`title-${index}`} className="text-gold"
                style={{
                    fontFamily: 'Cinzel',
                    fontSize: item.depth === 0 ? '1.3rem' : '0.9rem',
                    lineHeight: '0',
                }}>
                {item.title}
            </span>
        </div>
    )
}

TitleWithIcon.propTypes = {
    item: PropTypes.shape({
        title: PropTypes.string.isRequired, 
        icon: PropTypes.string,
        depth: PropTypes.number.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
}