import React from 'react'

export default function Input({ placeholder = '...', value, onChange, onKeyDown, width = 'w-full' }) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className={`input ${width}`}
        />
    )
}
