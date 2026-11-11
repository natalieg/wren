import { useEffect, useState } from 'react'
import { formatTimeWithSeconds } from '../../utils/formatTime'

// countdown between a finished task and the next one, derived from endsAt so background tabs stay correct
export default function Breather({ endsAt, nextTask, onStart }) {
   const [now, setNow] = useState(() => Date.now())

   useEffect(() => {
      const id = setInterval(() => {
         const t = Date.now()
         setNow(t)
         if (t >= endsAt) clearInterval(id)
      }, 1000)
      return () => clearInterval(id)
   }, [endsAt])

   const secondsLeft = Math.ceil((endsAt - now) / 1000)
   if (secondsLeft <= 0) return null

   return (
      <div role='status' className='flex items-center gap-3 rounded-lg border-2 border-gold bg-gold/15 px-3 py-2'>
         <span>☕</span>
         <span className='font-semibold tabular-nums'>{formatTimeWithSeconds(secondsLeft)}</span>
         <span className='flex-1 min-w-0 truncate text-sm text-text-secondary'>Breather · next: {nextTask.label}</span>
         <button type='button' className='softButton' onClick={onStart}>Start now</button>
      </div>
   )
}
