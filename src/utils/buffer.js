export const BUFFER_STEP = 5
export const BUFFER_MAX = 30
const MINUTE = 60 * 1000

// buffer minutes the estimates should use, 0 while the setting is off
export const activeBufferMinutes = (settings) =>
   settings.bufferEnabled ? Math.max(parseInt(settings.bufferMinutes) || 0, 0) : 0

export const stepBuffer = (minutes, direction) =>
   Math.min(Math.max((parseInt(minutes) || 0) + direction * BUFFER_STEP, 0), BUFFER_MAX)

// when the breather after the last finished task ends, null if there is none
export function breatherEndsAt(finishedTasks, bufferMinutes) {
   if (!(bufferMinutes > 0)) return null
   const times = finishedTasks
      .map(t => new Date(t.finishedTimestamp).getTime())
      .filter(time => time > 0)
   if (!times.length) return null
   return Math.max(...times) + bufferMinutes * MINUTE
}
