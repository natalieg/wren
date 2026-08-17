import { GlyphBorder } from '../../components/elements/GlyphBorder'
import Header from '../../components/elements/Header'
import { formatTime, formatDatePlusName, effectiveMinutes, secondsToMinutes } from '../../utils/formatTime'
import { breakTimeByType } from '../../utils/breaks'
import { MultiProgressbar } from '../../assets/Progressbar'


export default function DayEntry({ entry }) {

   const allTime = entry.tasks.reduce((total, task) => total + effectiveMinutes(task.trackedTime, task.time), 0)


   // TODO workaround with the colors, need to normalize old entries in settings to give them colors to use them here 
   const timeArray = () => {
      let timeEntries = []
      let breakColors = [{ label: 'gaming', color: 'bg-pink-600' }, { label: 'social', color: 'bg-yellow-500' }, { label: 'break', color: 'bg-blue-500' }, { label: 'pause', color: 'bg-indigo-400' }]
      timeEntries.push({ label: 'Tasks', color: 'bg-emerald-500', value: allTime })
      breakTimeByType(entry.breaks).forEach(b => {
         timeEntries.push({
            label: b.name,
            color: breakColors.filter(c => c.label === b.type)[0]?.color || 'bg-gray-500',
            value: secondsToMinutes(b.duration)
         })
      })
      return timeEntries
   }

   const taskStyle = 'flex justify-between w-full max-w-[300px] px-4'
   const badgeStyle = 'bg-text-primary/10 text-text-primary px-2 py-1 rounded-full text-sm font-semibold text-center'

   return (
      <GlyphBorder key={entry.date} variant='corners' glyph='⊡'
         color='color-mix(in srgb, var(--color-text-secondary) 30%, transparent)'
         className='min-w-[80%] max-w-[90%]'>
         <div className='flex flex-col items-center p-2'>
            <Header label={formatDatePlusName(entry.date)} fontSize='text-xl' className='pb-2'
               glyphs='․⁘' glyphSize='text-md' />
            <MultiProgressbar objectArray={timeArray()} />
            <p id={'historyEntrySummary_' + entry.date}
               className={`${taskStyle} pb-2`}>
               <span className={badgeStyle}>Tasks: {entry.tasks.length}</span>
               {/* <span className={badgeStyle}>Breaks: {entry.breaks?.length || 0}</span> */}
               <span className={badgeStyle}>🍵 {formatTime(secondsToMinutes(entry.breakTime || 0))}</span>
               <span className={badgeStyle}>Time: {formatTime(allTime)}</span>
            </p>
            {entry.tasks.map(task => (
               <p key={task.id}
                  className={taskStyle}>
                  <span>{task.label} </span>
                  <span>{formatTime(effectiveMinutes(task.trackedTime, task.time))} </span>
               </p>
            ))}
         </div>
      </GlyphBorder>
   )
}
