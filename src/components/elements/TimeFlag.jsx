import { formatTimeWithSeconds } from '../../utils/formatTime.js'

const style = 'w-20 bg-border-soft text-text-primary px-1 rounded-sm select-none text-center leading-none py-1 flex items-center justify-center'

export default function TimeFlag({ tracked, time, isTracking, isFinished }) {
  const show = isTracking || tracked > 0
  const formatedTime = formatTimeWithSeconds(tracked)
  const formatedTracked = show ? <span>{formatedTime} ▴ </span> : ""

  // if tracked < 1min, it shows the estimate time LATER evaluate if user can change this behaviour in settings [also in TimeProgress]
  const finishedFormat = formatedTime
    ? <span className='font-bold text-text-secondary'>{formatedTime}</span>
    : <span className='text-text-muted'>{time}</span>

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
