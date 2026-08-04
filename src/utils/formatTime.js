export const formatTime = (minutes) =>
    minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60 ? minutes % 60 + 'm' : ''}` : `${minutes}m`

// German 24h clock, e.g. 14:05 — no AM/PM, colon separator.
// Accepts a Date or an ISO string (localStorage round-trips Dates as strings).
export const formatClockTime = (date) =>
    new Date(date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false })

export const formatDate = (date) =>
    new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })