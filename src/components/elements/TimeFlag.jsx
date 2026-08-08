import { formatTimeWithSeconds, secondsToMinutes, formatTime, effectiveMinutes } from '../../utils/formatTime.js'

// w-24 rather than w-20: tracking past an hour reaches three-digit minutes ("105:23 ▴ 120")
// tabular-nums is a no-op in Quicksand (no tabular figures) — see index.css .tnum
const style = 'w-24 bg-border-soft text-text-primary px-1 rounded-sm select-none text-center leading-none py-1 flex items-center justify-center tabular-nums tnum '

export default function TimeFlag({ tracked, time, isTracking, isFinished }) {
   const show = isTracking || tracked > 0
   const formatedTime = formatTimeWithSeconds(tracked)
   const formatedTracked = show ? <span className='pr-0.5'>{formatedTime} ▴ </span> : ""

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
// LATER decide if this is needed / we have the new comp 'LabeledField' [09.08.2026]
export function TimeFlagTracking({ tracked, onClick }) {
   const formatedTime = formatTimeWithSeconds(tracked)
   return (
      <div className={`${style} h-6.5`} onClick={onClick}>
         {formatedTime}
      </div>
   )
}
