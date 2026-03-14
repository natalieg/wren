import React from 'react'

export default function Panel({ className, style, children }) {
    return (
        <div className={`${className}
            panel
            backdrop-blur-sm 
            shadow-lg 
            rounded-sm p-4
        `}
            style={style}>
            {children}
        </div>
    )
}
