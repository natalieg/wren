import CollapsableDiv from '../../components/CollapsableDiv'
import { computeWeekStats } from '../../utils/weekStats'
import { formatTime, formatDayMonth } from '../../utils/formatTime'
import StatTile from '../../components/elements/StatTile'
import VerticalBar from '../../components/elements/VerticalBar'

export default function WeekOverview({ weekStart, entries }) {
   const stats = computeWeekStats(weekStart, entries)
   const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6)
   // highest minutes of any day of this week
   const maxMinutes = Math.max(1, ...stats.days.flatMap(d => [d.focusedMinutes, d.breakMinutes]))
   const maxFocusDay = stats.days.reduce((max, d) => d.focusedMinutes > max.focusedMinutes ? d : max, stats.days[0])

   return (
      <CollapsableDiv label={`${formatDayMonth(weekStart)} – ${formatDayMonth(weekEnd)}`} defaultOpen={true}>
         <div className='flex gap-2 px-2 pt-2'>
            {stats.days.map(day => (
               <VerticalBar key={day.label} value1={day.focusedMinutes} value2={day.breakMinutes}
                  hover1={formatTime(day.focusedMinutes)} hover2={formatTime(day.breakMinutes)} 
                  maxValue={maxMinutes} label={day.label} subLabel={day.taskCount || ''} 
                  markSpecial={day === maxFocusDay} />
            ))}
         </div>
         <div className='flex gap-2 px-2 pt-3'>
            <StatTile value={formatTime(stats.totalFocusedMinutes)} label='focused this week' valueClassName='text-success' />
            <StatTile value={formatTime(stats.totalBreakMinutes)} label='off the clock' valueClassName='text-pink-600' />
            <StatTile value={stats.ratioText} label='focus to break' valueClassName='text-text-primary text-md' />
         </div>
      </CollapsableDiv>
   )
}
