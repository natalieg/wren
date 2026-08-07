// "20m" / "1h" / "1h 30m" — the space only appears when there are leftover minutes
export const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const leftoverMinutes = minutes % 60
    return leftoverMinutes ? `${hours}h ${leftoverMinutes}m` : `${hours}h`
}

// German 24h clock, e.g. 14:05 — no AM/PM, colon separator.
// Accepts a Date or an ISO string (localStorage round-trips Dates as strings).
export const formatClockTime = (date) =>
    new Date(date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false })

export const formatDate = (date) =>
    new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })