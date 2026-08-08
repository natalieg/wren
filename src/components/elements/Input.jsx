import { forwardRef } from 'react'
import { inputPadding } from './inputStyles'

const Input = forwardRef(function Input({ id, placeholder = '...', value, type = 'text', onChange, onKeyDown, onFocus,  onBlur, minValue = 0, step,
  width = 'w-full', padding, backgroundColor = 'bg-surface', slim = false, className = '',
}, ref) {
  const resolvedPadding = inputPadding(slim, padding)
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
      className={`input ${slim ? 'input-slim' : ''} ${width} ${resolvedPadding} ${backgroundColor} ${className}`}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
})

export default Input
