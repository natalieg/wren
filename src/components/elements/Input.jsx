
export default function Input({ placeholder = '...', value, type = 'text', onChange, onKeyDown, width = 'w-full',
    onFocus, onBlur
 }) {
    return (
        <input
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
}
