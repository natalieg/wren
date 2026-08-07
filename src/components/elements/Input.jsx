import { forwardRef } from 'react'

const Input = forwardRef(function Input({ id, placeholder = '...', value, type = 'text', onChange, onKeyDown, width = 'w-full', onFocus, onBlur, minValue = 0, step, padding='px-2 py-2', className = '',
}, ref) {
  return (
    <input
      id={id}
      ref={ref}
      type={type}
      min={type === 'number' ? minValue : undefined}
      step={step}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={`input ${width} ${padding} ${className}`}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
})

export default Input
