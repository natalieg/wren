import { useState, useEffect } from 'react'
import { loadSettings } from '../utils/settings'
import { logicalDayString } from '../utils/rollover'

/** '09:30' -> a Date for today at 09:30. The only place the stored 'HH:mm' string
 * gets turned into a real timestamp, so nothing outside this hook has to do time math. */
// 'HH:mm' -> today at that time
function startOfTodayAt(timeString) {
    const [hours, minutes] = String(timeString).split(':').map(Number)
    const date = new Date()
    date.setHours(hours || 0, minutes || 0, 0, 0)
    return date
}

/** Owns everything about "when did today start": the persisted startedAt, the manual
 * reset, and the once-per-mount check for whether the logical day has moved on.
 * Deliberately knows nothing about tasks — what should happen to them on a rollover
 * is passed in as onRollover, so task logic stays in useTasks. */
// day boundary + startedAt; task side effects come in via onRollover
function useDayActions({ onRollover } = {}) {
  const [startedAt, setStartedAt] = useState(() => {
    try {
      const saved = localStorage.getItem('startedAt')
      return saved ? new Date(saved) : new Date()
    } catch (e) {
      console.error('Failed to load startedAt from localStorage:', e)
      return new Date()
    }
  })

  const persistStartedAt = (date) => {
    setStartedAt(date)
    localStorage.setItem('startedAt', date.toISOString())
  }

  /** Always literally now, never the configured start time — this is the "no, I'm
   * actually starting right now" button, including when starting earlier than planned. */
  // manual reset: always now
  const resetStartedAt = () => persistStartedAt(new Date())

  useEffect(() => {
    const { rolloverHour, defaultStartTime } = loadSettings()
    const saved = localStorage.getItem('startedAt')
    const savedDate = saved ? new Date(saved) : null

    if (savedDate && logicalDayString(savedDate, rolloverHour) === logicalDayString(new Date(), rolloverHour)) {
      return // still the same logical day, nothing to do
    }

    /** On a new day the planned start wins as long as it's still ahead — so planning at
     * 08:00 cascades estimates from 09:00 instead of pretending work began at 08:00.
     * Once that time has passed, "now" wins, otherwise every estimate would sit in the past. */
    // new day starts at the later of now / the configured start time
    const now = new Date()
    const plannedStart = startOfTodayAt(defaultStartTime)
    persistStartedAt(now > plannedStart ? now : plannedStart)

    // first-ever load: a fresh startedAt is right, but there's no previous day
    // to roll over from, so nothing should be handed to onRollover
    if (!savedDate) return
    onRollover?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- day rollover is checked once per mount, not whenever the callback identity changes
  }, [])

  return { startedAt, resetStartedAt }
}

export default useDayActions
