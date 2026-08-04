export default function TimeFlag({ tracked, time, isTracking, isFinished }) {
    const show = isTracking || tracked > 0
    const trackedMinutes = show ? Math.floor(tracked / 60) : null
    const leftSeconds = show ? tracked % 60 : 0
    const formatedTracked = show ? <span>{trackedMinutes}:{String(leftSeconds).padStart(2, '0')} ▴ </span> : ""

    // if tracked < 1min, it shows the estimate time LATER evaluate if user can change this behaviour in settings [also in TimeProgress]
    const finishedFormat = trackedMinutes
        ? <span className='font-bold text-text-secondary'>{trackedMinutes}</span>
        : <span className='text-text-muted'>{time}</span>

    return (
        <div className='w-20 bg-border-soft text-text-primary px-1 rounded-sm text-sm select-none text-center leading-none py-1'>
            {!isFinished && formatedTracked}{!isFinished && time}
            {isFinished && finishedFormat}
        </div>
    )
}
