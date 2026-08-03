import { forwardRef } from 'react'

const Input = forwardRef(function Input({ placeholder = '...', value, type = 'text', onChange, onKeyDown, width = 'w-full', onFocus, onBlur, minValue = 0,
 }, ref) {
    return (
        <input
            ref={ref}
            type={type}
            min={type === 'number' ? minValue : undefined}
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
