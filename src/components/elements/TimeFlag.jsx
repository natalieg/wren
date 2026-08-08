import { formatTimeWithSeconds, secondsToMinutes, formatTime, effectiveMinutes } from '../../utils/formatTime.js'

const style = 'w-20 bg-border-soft text-text-primary px-1 rounded-sm select-none text-center leading-none py-1 flex items-center justify-center'

export default function TimeFlag({ tracked, time, isTracking, isFinished }) {
   const show = isTracking || tracked > 0
   const formatedTime = formatTimeWithSeconds(tracked)
   const formatedTracked = show ? <span>{formatedTime} ▴ </span> : ""

   // effectiveMinutes picks the number (tracked, or the estimate below 1min) —
   // this only decides how it's styled. LATER evaluate if user can change this in settings
   const hasTrackedMinutes = secondsToMinutes(tracked) > 0
   const finishedFormat = (
      <span className={hasTrackedMinutes ? 'font-bold text-text-secondary' : 'text-text-muted'}>
         {formatTime(effectiveMinutes(tracked, time))}
      </span>
   )

   return (
      <div className={`${style} text-sm `}>
         {!isFinished && formatedTracked}{!isFinished && time}
         {isFinished && finishedFormat}
      </div>
   )
}

// only renders tracked time
export function TimeFlagTracking({ tracked, onClick }) {
   const formatedTime = formatTimeWithSeconds(tracked)
   return (
      <div className={`${style} h-8`} onClick={onClick}>
         {formatedTime}
      </div>
   )
}
