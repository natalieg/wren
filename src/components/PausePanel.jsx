import { useState } from 'react'
import useSettingsContext from '../hooks/useSettingsContext'
import useBreaksContext from '../hooks/useBreaksContext'
import useTrackingContext from '../hooks/useTrackingContext'
import useHistoryContext from '../hooks/useHistoryContext'
import FloatingPanel from './elements/FloatingPanel'
import EmojiMiniCard from './elements/EmojiMiniCard'
import { formatTime, formatTimeWithSeconds, secondsToMinutes } from '../utils/formatTime'

export default function PausePanel({ className }) {
   const [miniState, setMiniState] = useState(false)
   const { settings } = useSettingsContext()
   // display values from the break state, start/stop from the coordinated layer
   const { runningBreakId, breakTrackedSeconds, runningSessionSeconds, breakDurations } = useBreaksContext()
   const { startBreak, stopBreak } = useTrackingContext()
   const { todayBreakTime } = useHistoryContext()
   const [lastActiveType, setLastActiveType] = useState(null)

   // durations are flushed periodically, not every tick — top up with only the
   // remainder since the last flush, breakDurations already has everything before it
   const breakTypes = settings.breakTypes
      .filter(b => b.enabled)
      .map(b => ({
         ...b,
         duration: (breakDurations[b.id] || 0) + (b.id === runningBreakId ? breakTrackedSeconds : 0),
      }))
   const runningBreakType = breakTypes.find(b => b.id === runningBreakId)
   // todayBreakTime from history, plus potential running break timer 
   const liveTodayBreakTime = todayBreakTime + (runningBreakId ? runningSessionSeconds : 0)

   const toggleBreak = (breakType) => {
      if (breakType.id === runningBreakId) {
         stopBreak()
      } else {
         setLastActiveType(breakType)
         startBreak(breakType)
      }
   }

   // runningSessionSeconds, not breakTrackedSeconds — this needs to keep counting up
   // past a 5-min flush instead of dropping back to 0
   const runningTracker = <p className='text-center font-retro text-2xl'>{formatTimeWithSeconds(runningSessionSeconds)}</p>

   return (
      <FloatingPanel storageKey='floatingPausePanelPosition' width={100} height={70} padding='p-2'
         visible={true} className={className} minimizable={true} handleMinimize={() => setMiniState(!miniState)} label={`${miniState ? '': 'Break Time'}`}>
         {miniState ? <div onClick={() => toggleBreak(runningBreakType || lastActiveType || breakTypes[0])} className={`${runningBreakType && 'bg-success-light'} cursor-pointer p-1 rounded-md`}>
            {runningTracker}
            <p className='text-2xl'>{runningBreakType?.emoji || '🍵'}</p>
         </div>
            :
            <div className='flex flex-col'>
               {runningBreakType &&
                  runningTracker}
               <p id='todayBreakTime' className='text-center text-gray-500'>{formatTime(secondsToMinutes(liveTodayBreakTime))}</p>
               <div className='flex flex-wrap justify-center gap-2 mt-2'>
                  {breakTypes.map(breakType => (
                     <EmojiMiniCard
                        key={breakType.id}
                        id={breakType.id}
                        title={breakType.name}
                        subtitle={formatTime(secondsToMinutes(breakType.duration))}
                        emoji={breakType.emoji}
                        active={breakType.id === runningBreakId}
                        onClick={() => toggleBreak(breakType)} />
                  ))}
               </div>
            </div>}
      </FloatingPanel>
   )
}
