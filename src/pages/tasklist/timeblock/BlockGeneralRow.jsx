import { useState } from 'react'
import PlayBtn from '../../../components/elements/PlayBtn'
import TimeFlag from '../../../components/elements/TimeFlag'
import Input from '../../../components/elements/Input'
import { secondsToMinutes, minutesToSeconds } from '../../../utils/formatTime'

// tracks the block itself — time on the project that belongs to no task. Editable while
// stopped (same rule as the task modal), so untracked time can be added afterwards
export default function BlockGeneralRow({ blockId, seconds, isTracking, startTracking, stopTracking, onSetSeconds }) {
   const [draft, setDraft] = useState(null)

   const save = () => {
      onSetSeconds(minutesToSeconds(parseInt(draft) || 0))
      setDraft(null)
   }

   return (
      <div className={`group flex items-center justify-between gap-2 rounded-md border-2 border-dashed border-border-soft
         px-2 py-1 ${isTracking ? 'bg-gradient-softer' : ''}`}>
         <span className='select-none text-sm text-text-secondary'>
            General <span className='text-xs text-text-muted'>· block time without a task</span>
         </span>
         <div className='flex gap-2 items-center'>
            <PlayBtn id={'toggleTracking_' + blockId} showAlways active={isTracking}
               onClick={() => isTracking ? stopTracking() : startTracking(blockId)} />
            {draft !== null
               ? <Input type='number' width='w-24' slim value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setDraft(null) }}
                  onBlur={save} />
               : <div className={isTracking ? '' : 'cursor-pointer'}
                  title={isTracking ? 'Stop the timer to edit' : 'Click to edit (minutes)'}
                  onClick={() => !isTracking && setDraft(String(secondsToMinutes(seconds)))}>
                  <TimeFlag tracked={seconds} isTracking={isTracking} />
               </div>}
         </div>
      </div>
   )
}
