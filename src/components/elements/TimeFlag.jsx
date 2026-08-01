export default function TimeFlag({ tracked, time, isTracking }) {
    const show = isTracking || tracked > 0
    const trackedMinutes = show ? Math.floor(tracked / 60) : null
    const leftSeconds = show ? tracked % 60 : 0
    const formatedTracked = show ? <span>{trackedMinutes}:{String(leftSeconds).padStart(2, '0')} ▴ </span> : ""

    return (
        <div className='w-20 bg-border-soft text-text-primary px-1 rounded-sm text-sm select-none text-center leading-none py-1'>
            {formatedTracked}{time}
        </div>
    )
}
