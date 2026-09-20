import React from 'react'

// Character Base Card component with optional title and children
export default function Card({ title, className = '', children }) {
    return (
        <div className={`${className} bg-surface border border-border-soft rounded-md shadow-lg p-4`}>
            {title && (
                <div className="mb-3">
                    <div className="flex items-center justify-center gap-2 text-accent-primary font-semibold text-sm tracking-wide">
                        <span>✦</span>
                        <span>{title}</span>
                        <span>✦</span>
                    </div>
                    <div className="mt-2 border-t border-border-soft" />
                </div>
            )}
            {children}
        </div>
    )
}
