import React from 'react'

export default function DocWrapper({ className, style, background, children }) {
    return (
        <div className={`${className} h-full p-4 flex flex-col items-center`}
            style={{ background: background || '#694159', ...style }}>
            {children}
        </div>
    )
}
