import { formatTime } from '../../utils/formatTime'

export default function DotItem({ label, value, color, percentage, special = false }) {
   return (
      <div className={`text-sm flex gap-0.5 items-center${special ? ' bg-accent-muted/50 rounded-md px-0.5' : ''}`}>
         <span className={`${color} w-3 h-3 inline-block rounded-[4px]`}></span>
         <span>{label}</span>
         <span className='font-retro mx-1'>{formatTime(value)}</span>
         {percentage && <span className='font-retro px-0.5 bg-accent-muted rounded-sm'>
            {Math.round(percentage)}%
         </span>}
      </div>
   )
}
