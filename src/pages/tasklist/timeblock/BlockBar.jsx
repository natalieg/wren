// tracked fill (gold past the duration), dotted line = planned, solid tick = duration when something runs past it
export default function BlockBar({ durationMinutes, plannedMinutes, trackedMinutes }) {
   const scale = Math.max(durationMinutes, plannedMinutes, trackedMinutes, 1)
   const pct = (minutes) => `${(minutes / scale) * 100}%`

   return (
      <div className='relative h-2 rounded-pill bg-border-soft overflow-hidden flex'
         role='img' aria-label={`${trackedMinutes} of ${durationMinutes} minutes tracked`}>
         <i className='block h-full bg-accent-primary' style={{ width: pct(Math.min(trackedMinutes, durationMinutes)) }} />
         <i className='block h-full bg-gold' style={{ width: pct(Math.max(trackedMinutes - durationMinutes, 0)) }} />
         <span className='absolute inset-y-0 left-0 border-r-2 border-dotted border-text-primary/50'
            style={{ width: pct(plannedMinutes) }} />
         {scale > durationMinutes &&
            <span className='absolute inset-y-0 w-0.5 bg-text-primary/60' style={{ left: pct(durationMinutes) }} />}
      </div>
   )
}
