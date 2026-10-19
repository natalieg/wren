import { formatTime } from '../../utils/formatTime'

const sourceLabel = (e) => {
   if (!e.finished) return e.isBlock ? 'open block · general time' : 'open · tracked this week'
   const day = new Date(e.day).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
   return `${e.isBlock ? 'finished block' : 'done'} · ${day}${e.estimated ? ' · est.' : ''}`
}

// one line per task that adds to the week's time, so the total can be checked by eye
export default function ProjectWeekLog({ log, minutes }) {
   if (log.length === 0) return <p className='text-xs text-text-muted px-1'>Nothing tracked on this project this week yet.</p>

   return (
      <div className='flex flex-col text-sm bg-accent-soft/30 rounded-sm px-2 py-1'>
         {log.map(e =>
            <div key={e.id} className='flex items-baseline gap-2 py-0.5 border-b border-border-soft last:border-0'>
               <span className='truncate flex-1' title={e.label}>{e.isBlock ? '▦ ' : ''}{e.label}</span>
               <span className='text-xs text-text-muted whitespace-nowrap'>
                  {sourceLabel(e)}
                  {/* time from before the per-day split — no date, so it can't be placed in a week */}
                  {e.undatedMinutes > 0 &&
                     <span title='Tracked before Wren logged time per day — not counted'> · +{formatTime(e.undatedMinutes)} undated</span>}
               </span>
               <span className={`w-14 text-right tabular-nums ${e.estimated ? 'text-text-muted italic' : ''}`}>{formatTime(e.minutes)}</span>
            </div>)}
         <div className='flex justify-end gap-2 pt-1 font-semibold'>
            <span className='text-text-muted font-normal'>sum</span>
            <span className='w-14 text-right'>{formatTime(minutes)}</span>
         </div>
      </div>
   )
}
