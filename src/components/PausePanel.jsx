import { useContext, useState } from 'react'
import TasksContext from '../context/TasksContext'
import SettingsContext from '../context/SettingsContext'
import FloatingPanel from './elements/FloatingPanel'
import EmojiMiniCard from './elements/EmojiMiniCard'
import { formatTime, formatTimeWithSeconds, secondsToMinutes } from '../utils/formatTime'

export default function PausePanel({ className }) {
   const [miniState, setMiniState] = useState(false)
   const { settings } = useContext(SettingsContext)
   const { runningBreakId, breakTrackedSeconds, runningSessionSeconds, breakDurations, breakActions, todayBreakTime } = useContext(TasksContext)

   // durations are flushed periodically, not every tick — top up with only the
   // remainder since the last flush, breakDurations already has everything before it
   const breakTypes = settings.breakTypes
      .filter(b => b.enabled)
      .map(b => ({
         ...b,
         duration: (breakDurations[b.id] || 0) + (b.id === runningBreakId ? breakTrackedSeconds : 0),
      }))
   const runningBreakType = breakTypes.find(b => b.id === runningBreakId)
   // todayBreakTime comes from history (breakTime on today's entry), only written
   // when a session stops — top up with the whole running session (not just the
   // since-last-flush remainder) since history has none of it yet
   const liveTodayBreakTime = todayBreakTime + (runningBreakId ? runningSessionSeconds : 0)

   const toggleBreak = (breakType) =>
      breakType.id === runningBreakId ? breakActions.stopBreak() : breakActions.startBreak(breakType)

   // runningSessionSeconds, not breakTrackedSeconds — this needs to keep counting up
   // past a 5-min flush instead of dropping back to 0
   const runningTracker = <p className='text-center font-retro text-2xl'>{formatTimeWithSeconds(runningSessionSeconds)}</p>

   return (
      <FloatingPanel storageKey='floatingPausePanelPosition' width={100} height={70} padding='p-2'
         visible={true} className={className} minimizable={true} handleMinimize={() => setMiniState(!miniState)}>
         {miniState ? <div onClick={() => setMiniState(false)} className={`${runningBreakType && 'bg-success-light'} cursor-pointer p-1 rounded-md`}>
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
