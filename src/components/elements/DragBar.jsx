// bar for settings between 0 and 1
export default function DragBar({ value, onChange }) {
   return (
      <div className='flex items-center gap-2'>
         <input id='soundVolume' type='range' min={0} max={1} step={0.05}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className='accent-accent-primary' />
         <span className='text-xs text-text-muted w-9 text-right font-num'>
            {Math.round(value * 100)}%
         </span>
      </div>
   )
}
