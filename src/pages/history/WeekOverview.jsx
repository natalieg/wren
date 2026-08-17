import CollapsableDiv from '../../components/CollapsableDiv'
import { computeWeekStats } from '../../utils/weekStats'
import { formatTime } from '../../utils/formatTime'


//TODO REVIEW, extract reusable components, clean up styling 

//TODO move to the general time formating file
function formatDayMonth(date) {
   return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
}

function WeekDayBar({ day, maxMinutes }) {
   const focusPct = (day.focusedMinutes / maxMinutes) * 100
   const breakPct = (day.breakMinutes / maxMinutes) * 100

   return (
      <div className='flex flex-col items-center gap-1 flex-1'>
         <div className='h-32 w-full flex flex-col-reverse items-center'>
            <div className='w-4/5 rounded-b-sm bg-gradient-success' style={{ height: `${focusPct}%` }} />
            <div className='w-4/5 rounded-t-sm bg-gradient-main' style={{ height: `${breakPct}%` }} />
         </div>
         <span className='text-xs text-text-secondary'>{day.label}</span>
         <span className='text-[10px] text-text-muted'>{day.taskCount || ''}</span>
      </div>
   )
}

//TODO extract
function StatTile({ value, label, valueClassName }) {
   return (
      <div className='flex-1 rounded-xl bg-accent-soft/20 px-3 py-2'>
         <div className={`text-lg font-semibold ${valueClassName}`}>{value}</div>
         <div className='text-xs text-text-muted'>{label}</div>
      </div>
   )
}

export default function WeekOverview({ weekStart, entries }) {
   const stats = computeWeekStats(weekStart, entries)
   const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6)
   const maxMinutes = Math.max(1, ...stats.days.flatMap(d => [d.focusedMinutes, d.breakMinutes]))

   return (
      <CollapsableDiv label={`${formatDayMonth(weekStart)} – ${formatDayMonth(weekEnd)}`} defaultOpen={true}>
         <div className='flex gap-2 px-2 pt-2'>
            {stats.days.map(day => (
               <WeekDayBar key={day.label} day={day} maxMinutes={maxMinutes} />
            ))}
         </div>
         <div className='flex gap-2 px-2 pt-3'>
            <StatTile value={formatTime(stats.totalFocusedMinutes)} label='focused this week' valueClassName='text-success' />
            <StatTile value={formatTime(stats.totalBreakMinutes)} label='off the clock' valueClassName='text-pink-600' />
            <StatTile value={stats.ratioText} label='break to focus' valueClassName='text-text-primary' />
         </div>
      </CollapsableDiv>
   )
}
