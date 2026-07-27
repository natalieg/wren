
export default function Textarea({ placeholder = '...', value, onChange, onKeyDown, width = 'w-full', rows = 2 }) {
    return (
        <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            rows={rows}
            className={`input resize-none ${width}`}
            style={{ fieldSizing: 'content' }}
        />
    )
}
