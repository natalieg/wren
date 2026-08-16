import { formatTimeWithSeconds } from '../../utils/formatTime'
import { useEffect, useRef } from 'react'

// display for countdown timers, optional sound 
export default function CountdownTimer({ current, max, playSound }) {
   const overFlow = max && current > max
   const wasOverflowingRef = useRef(false)

   const displaySeconds = () => {
      if (overFlow) return current - max
      if (max) return max - current
      return current
   }

   useEffect(() => {
      if (overFlow && !wasOverflowingRef.current) playSound && playSound()
      wasOverflowingRef.current = overFlow
   }, [overFlow, playSound])

   return (
      <div className={`${overFlow ? 'bg-failure/50 rounded-md' : ''} px-1`}>
         {overFlow && '+'}{formatTimeWithSeconds(displaySeconds())}</div>
   )
}