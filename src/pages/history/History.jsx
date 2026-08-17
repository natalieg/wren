import DocWrapper from '../../components/DocWrapper'
import useHistoryContext from '../../hooks/useHistoryContext'
import DayEntry from './DayEntry'
import WeekOverview from './WeekOverview'
import { groupHistoryByWeek } from '../../utils/weekStats'

export default function History() {
   const { history } = useHistoryContext()
   const weeks = groupHistoryByWeek(history)

   return (
      <DocWrapper header='History'>
         <div className='w-full flex flex-col justify-center items-center gap-4'>
            {weeks.map(week => (
               <div key={week.weekStart.toDateString()} className='w-full flex flex-col items-center gap-4'>
                  <WeekOverview weekStart={week.weekStart} entries={week.entries} />
                  {week.entries.map(entry => (
                     <DayEntry key={entry.date} entry={entry} />
                  ))}
               </div>
            ))}
         </div>
      </DocWrapper>
   )
}
