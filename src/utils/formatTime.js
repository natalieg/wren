// "20m" / "1h" / "1h 30m" — the space only appears when there are leftover minutes
export const formatTime = (minutes) => {
   if (minutes < 60) return `${minutes}m`
   const hours = Math.floor(minutes / 60)
   const leftoverMinutes = minutes % 60
   return leftoverMinutes ? `${hours}h ${leftoverMinutes}m` : `${hours}h`
}

// stopwatch shape, always "m:ss" — the three cases you had all produced the same
// thing, padStart already covers 0:05 and 0:45
export const formatTimeWithSeconds = (seconds) => {
   const minutes = Math.floor(seconds / 60)
   const leftoverSeconds = seconds % 60
   return `${minutes}:${String(leftoverSeconds).padStart(2, '0')}`
}

export const secondsToMinutes = (seconds) => Math.floor(seconds / 60)
export const minutesToSeconds = (minutes) => minutes * 60

// What a task actually cost, in minutes: real tracked time once there's at least
// a full minute of it, otherwise the estimate. 
// LATER this could be changed in user settings - maybe user wants to track short tasks
export const effectiveMinutes = (trackedSeconds, estimateMinutes) =>
   secondsToMinutes(trackedSeconds || 0) || estimateMinutes

// German 24h clock, e.g. 14:05 — no AM/PM, colon separator.
// Accepts a Date or an ISO string (localStorage round-trips Dates as strings).
export const formatClockTime = (date) =>
   new Date(date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false })

export const formatDate = (date) =>
   new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const formatDayMonth = (date) =>
   new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })

export const formatDatePlusName = (date) => {
   const d = new Date(date)
   const options = { weekday: 'long', month: 'long', day: 'numeric' }
   return d.toLocaleDateString('en-GB', options) // rest of application is in english, day names should match
}