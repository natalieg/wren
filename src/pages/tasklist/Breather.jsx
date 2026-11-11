import { useEffect, useRef, useState } from 'react'
import { formatTimeWithSeconds } from '../../utils/formatTime'
import { playBreakSound } from '../../utils/playSound'

// countdown between a finished task and the next one, derived from endsAt so background tabs stay correct
// green while running, gold with +overflow once over (sound plays once, never for an already-expired breather)
export default function Breather({ endsAt, nextTask, onStart }) {
   const [now, setNow] = useState(() => Date.now())
   const armedRef = useRef(endsAt > Date.now())

   useEffect(() => {
      const id = setInterval(() => setNow(Date.now()), 1000)
      return () => clearInterval(id)
   }, [])

   const secondsLeft = Math.ceil((endsAt - now) / 1000)
   const isOver = secondsLeft <= 0

   useEffect(() => {
      if (isOver && armedRef.current) {
         armedRef.current = false
         playBreakSound()
      }
   }, [isOver])

   const tone = isOver ? 'border-gold bg-gold/15' : 'border-success bg-success-light'

   return (
      <div role='status' className={`flex items-center gap-3 rounded-lg border-2 px-3 py-2 ${tone}`}>
         <span>☕</span>
         <span className='font-semibold tabular-nums'>
            {isOver && '+'}{formatTimeWithSeconds(Math.abs(secondsLeft))}
         </span>
         <span className='flex-1 min-w-0 truncate text-sm text-text-secondary'>Breather · next: {nextTask.label}</span>
         <button type='button' className='softButton' onClick={onStart}>Start now</button>
      </div>
   )
}
