import React from 'react'

export default function Panel({ className, style, children }) {
    return (
        <div className={`${className}
            backdrop-blur-sm bg-orange-100/50 border border-orange-300/70
            shadow-lg 
            rounded-lg p-4
        `}
            style={style}>
            {children}
        </div>
    )
}
