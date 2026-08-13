import { useRef, useState, useEffect } from 'react'
import useTracker from './useTracker'
import { newTaskId } from '../utils/taskId'
import { logicalDayString } from '../utils/rollover'
import { loadSettings } from '../utils/settings'

const DURATIONS_STORAGE_KEY = 'breakDurations'

// Stamped with the logical day it was saved for, so a stale save from yesterday
// reads as empty instead of carrying seconds into a new day — same day-boundary
// math useHistory uses to group entries, checked once on load like useDayActions
// checks startedAt once per mount. Only resets on the next load after the
// boundary, not live while the app stays open across it — matches that.
function loadTodayDurations() {
  try {
    const saved = JSON.parse(localStorage.getItem(DURATIONS_STORAGE_KEY))
    const today = logicalDayString(new Date(), loadSettings().rolloverHour)
    return saved?.day === today ? saved.durations : {}
  } catch (e) {
    console.error('Failed to load break durations from localStorage:', e)
    return {}
  }
}

// Same ticking/flush mechanics as useTimeTracking, via the shared useTracker core.
// Breaks aren't a persisted list like tasks though, so a finished session is
// bundled into one history entry on stop (sessionSeconds), while each type's
// running total for today (breakDurations) accumulates across sessions the same
// way a task's trackedTime does — in seconds, written on every flush — and resets
// at the next day boundary instead of living forever on a task.
function useBreakTracking({ onBreakFinished }) {
  // ref: read synchronously right after stop() for the history entry, before the
  // state update below has committed. state: safe to read during render (refs
  // aren't) for the live runningSessionSeconds value. Both updated together.
  const sessionSecondsRef = useRef(0)
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const runningBreakType = useRef(null)
  const [breakDurations, setBreakDurations] = useState(loadTodayDurations)

  useEffect(() => {
    const today = logicalDayString(new Date(), loadSettings().rolloverHour)
    localStorage.setItem(DURATIONS_STORAGE_KEY, JSON.stringify({ day: today, durations: breakDurations }))
  }, [breakDurations])

  const handleFlush = (typeId, secondsToFlush) => {
    sessionSecondsRef.current += secondsToFlush
    setSessionSeconds(sessionSecondsRef.current)
    setBreakDurations(current => ({ ...current, [typeId]: (current[typeId] || 0) + secondsToFlush }))
  }

  const { runningId: runningBreakId, trackedSeconds: breakTrackedSeconds, start, stop } = useTracker(handleFlush)

  // breakTrackedSeconds alone resets to 0 on every flush (including the 5-min safety
  // net), so a running stopwatch built on it visibly jumps backward past 5 minutes.
  // sessionSeconds already banks each flushed chunk without resetting until stop, so
  // adding the still-ticking remainder on top gives the session's true elapsed time.
  const runningSessionSeconds = sessionSeconds + breakTrackedSeconds

  // breakType: { id, name, emoji } — name/emoji are snapshotted onto the history
  // entry at stop time, so a later rename/removal in settings doesn't reach back
  // and change how past sessions read
  const startBreak = (breakType) => {
    sessionSecondsRef.current = 0
    setSessionSeconds(0)
    runningBreakType.current = breakType
    start(breakType.id)
  }

  const stopBreak = () => {
    if (!runningBreakId) return
    const breakType = runningBreakType.current
    stop()
    if (sessionSecondsRef.current > 0) {
      onBreakFinished({
        id: newTaskId(),
        type: breakType.id,
        name: breakType.name,
        emoji: breakType.emoji,
        trackedTime: sessionSecondsRef.current,
        finishedTimestamp: new Date(),
      })
    }
    sessionSecondsRef.current = 0
    setSessionSeconds(0)
    runningBreakType.current = null
  }

  return { runningBreakId, breakTrackedSeconds, runningSessionSeconds, breakDurations, startBreak, stopBreak }
}

export default useBreakTracking
