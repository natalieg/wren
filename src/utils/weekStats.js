import { effectiveMinutes, secondsToMinutes } from './formatTime'

const DAY_LABELS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']

// Monday 00:00 of the week containing `date` — getDay() is 0=Sun..6=Sat,
// so this maps it to 0=Mon..6=Sun before subtracting back to Monday.
function weekStart(date) {
   const offset = (date.getDay() + 6) % 7
   const start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - offset)
   return start
}

// Groups history (newest-first) into weeks, newest week first. Each entry
// keeps its place in a Mon..Sun bucket so weeks with gaps (no tasks logged
// that day) still line up.
export function groupHistoryByWeek(history) {
   const weeks = []
   let currentKey = null

   for (const entry of history) {
      const start = weekStart(new Date(entry.date))
      const key = start.toDateString()
      if (key !== currentKey) {
         weeks.push({ weekStart: start, entries: [] })
         currentKey = key
      }
      weeks[weeks.length - 1].entries.push(entry)
   }
   return weeks
}

function dayStats(entry) {
   if (!entry) return { focusedMinutes: 0, breakMinutes: 0, taskCount: 0 }
   const focusedMinutes = entry.tasks.reduce((total, task) => total + effectiveMinutes(task.trackedTime, task.time), 0)
   const breakSeconds = (entry.breaks || []).reduce((total, b) => total + b.trackedTime, 0)
   return { focusedMinutes, breakMinutes: secondsToMinutes(breakSeconds), taskCount: entry.tasks.length }
}

// gives ratio in percentage
function formatRatio(focusedMinutes, breakMinutes) {
   if (breakMinutes <= 0) return focusedMinutes > 0 ? '100%' : '–/–'
   const sum = focusedMinutes + breakMinutes
   return `${focusedMinutes / sum * 100 | 0} ⊹ ${breakMinutes / sum * 100 | 0}`
}

// Stats for one week's worth of history entries, always 7 days (Mon..Sun)
// even if some days have no entry.
export function computeWeekStats(weekStart, entries) {
   const days = DAY_LABELS.map((label, i) => {
      const date = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i)
      const entry = entries.find(e => e.date === date.toDateString())
      return { label, date, ...dayStats(entry) }
   })

   const totalFocusedMinutes = days.reduce((total, d) => total + d.focusedMinutes, 0)
   const totalBreakMinutes = days.reduce((total, d) => total + d.breakMinutes, 0)

   return {
      days,
      totalFocusedMinutes,
      totalBreakMinutes,
      ratioText: formatRatio(totalFocusedMinutes, totalBreakMinutes),
   }
}
