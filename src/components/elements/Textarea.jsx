
export default function Textarea({ placeholder = '...', value, onChange, onKeyDown, width = 'w-full', padding = 'px-2 py-2', backgroundColor = 'bg-surface', rows = 2 }) {
   return (
      <textarea
         placeholder={placeholder}
         value={value}
         onChange={onChange}
         onKeyDown={onKeyDown}
         rows={rows}
         className={`input resize-none ${width} ${padding} ${backgroundColor}`}
         style={{ fieldSizing: 'content' }}
      />
   )
}
