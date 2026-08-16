import { useState, useEffect } from 'react'
import useSettingsContext from '../hooks/useSettingsContext'
import useBreaksContext from '../hooks/useBreaksContext'
import useTrackingContext from '../hooks/useTrackingContext'
import useHistoryContext from '../hooks/useHistoryContext'
import FloatingPanel from './elements/FloatingPanel'
import EmojiMiniCard from './elements/EmojiMiniCard'
import { formatTime, secondsToMinutes } from '../utils/formatTime'
import SwitchRow from './SwitchRow'
import CountdownTimer from './elements/CountdownTimer'
import { playBreakSound } from '../utils/playSound'


export default function PausePanel({ className }) {
   const [miniState, setMiniState] = useState(false)
   const { settings } = useSettingsContext()
   // display values from the break state, start/stop from the coordinated layer
   const { runningBreakId, breakTrackedSeconds, runningSessionSeconds, breakDurations, maxBreakTime, setMaxBreakTime } = useBreaksContext()
   const { startBreak, stopBreak } = useTrackingContext()
   const { todayBreakTime } = useHistoryContext()
   const [lastActiveType, setLastActiveType] = useState(null)
   //TODO make last timeslot editable from here
   const breakTimes = settings.breakTimes
   const overFlow = maxBreakTime && runningSessionSeconds > maxBreakTime

   // durations are flushed periodically, not every tick — top up with only the
   // remainder since the last flush, breakDurations already has everything before it
   const breakTypes = settings.breakTypes
      .filter(b => b.enabled)
      .map(b => ({
         ...b,
         duration: (breakDurations[b.id] || 0) + (b.id === runningBreakId ? breakTrackedSeconds : 0),
      }))
   // disabling the type a break is currently running under shouldn't leave it
   // ticking away unseen — follow the setting and stop it
   useEffect(() => {
      const runningTypeStillEnabled = settings.breakTypes.some(b => b.id === runningBreakId && b.enabled)
      if (runningBreakId && !runningTypeStillEnabled) stopBreak()
   }, [runningBreakId, settings.breakTypes, stopBreak])

   // no break types on: the whole panel (and its timer) has nothing to offer
   if (breakTypes.length === 0) return null

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

   const toggleBreakTime = (time) => {
      console.log('max', maxBreakTime, 'time', time)
      if (maxBreakTime === time) {
         setMaxBreakTime(false)
      } else {
         setMaxBreakTime(time)
      }
   }

   // runningSessionSeconds, not breakTrackedSeconds — this needs to keep counting up
   // past a 5-min flush instead of dropping back to 0
   const runningTracker = <div className='text-center font-retro text-2xl'>
      <CountdownTimer current={runningSessionSeconds} max={maxBreakTime} playSound={playBreakSound} />
   </div>

   return (
      <FloatingPanel storageKey='floatingPausePanelPosition' width={100} height={70}
         padding={miniState ? 'p-0.5' : 'p-2'}
         visible={true} className={className} minimizable={true} handleMinimize={() => setMiniState(!miniState)} label={`${miniState ? '' : 'Break Time'}`}>
         {miniState ? <div onClick={() => toggleBreak(runningBreakType || lastActiveType || breakTypes[0])} className={`${runningBreakType && (overFlow ? 'bg-failure-light' : 'bg-success-light')} cursor-pointer p-1 rounded-md`}>
            {runningTracker}
            <p className='text-2xl text-center text-shadow-md text-shadow-black/40 -mt-1 mb-0.5'>
               {runningBreakType?.emoji || '🍵'}</p>
         </div>
            :
            <div className='flex flex-col'>
               {runningBreakType &&
                  runningTracker}
               <p id='todayBreakTime' className='text-center text-gray-500'>{formatTime(secondsToMinutes(liveTodayBreakTime))}</p>

               {/* pre defined break times */}
               <SwitchRow array={breakTimes} onChange={(item) => toggleBreakTime(item * 60)} onEdit={() => { }} className='mt-2' />
               <div className='flex flex-wrap justify-center gap-2 mt-2'>
                  {breakTypes.map(breakType => (
                     <EmojiMiniCard
                        key={breakType.id}
                        id={breakType.id}
                        title={breakType.name}
                        subtitle={formatTime(secondsToMinutes(breakType.duration))}
                        emoji={breakType.emoji}
                        active={breakType.id === runningBreakId}
                        otherActive={runningBreakId && breakType.id !== runningBreakId}
                        onClick={() => toggleBreak(breakType)}
                        success={!overFlow}/>
                  ))}
               </div>
            </div>}
      </FloatingPanel>
   )
}
