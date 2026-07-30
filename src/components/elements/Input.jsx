import { forwardRef } from 'react'

const Input = forwardRef(function Input({ placeholder = '...', value, type = 'text', onChange, onKeyDown, width = 'w-full',
    onFocus, onBlur
 }, ref) {
    return (
        <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className={`input ${width}`}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    )
})

export default Input
