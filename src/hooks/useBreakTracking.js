import { useRef, useState, useEffect } from 'react'
import useTracker from './useTracker'
import { newTaskId } from '../utils/taskId'
import { logicalDayString } from '../utils/rollover'
import { loadSettings } from '../utils/settings'

const DURATIONS_STORAGE_KEY = 'breakDurations'

// load break duration for today only from localStorage, breaktype shouldnt accumulate
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

// Tracks a single break session, and accumulates the total time spent on each break type
function useBreakTracking({ onBreakFinished }) {
   // sessionSecondsRef is used to keep track of the total seconds for the current break session
   const sessionSecondsRef = useRef(0)
   const [sessionSeconds, setSessionSeconds] = useState(0)
   const runningBreakType = useRef(null)
   const [breakDurations, setBreakDurations] = useState(loadTodayDurations)
   const [emoji, setEmoji] = useState(null)
   const [label, setLabel] = useState(null)
   const [maxBreakTime, setMaxBreakTime] = useState(0)

   useEffect(() => {
      const today = logicalDayString(new Date(), loadSettings().rolloverHour)
      localStorage.setItem(DURATIONS_STORAGE_KEY, JSON.stringify({ day: today, durations: breakDurations }))
   }, [breakDurations])

   // TODO 5 (Phase 1 — unified-activity-model.md): once useTracker exposes session
   // timestamps (TODO 1-3), also collect { started, stopped } here alongside
   // breakDurations — same additive pattern as TODO 4 on the task side. Note this
   // accumulator is per breakType.id, not per Activity — sessions need to end up
   // wherever the break-type's own Activity record lives once Phase 3 merges storage.
   const handleFlush = (typeId, secondsToFlush) => {
      sessionSecondsRef.current += secondsToFlush
      setSessionSeconds(sessionSecondsRef.current)
      setBreakDurations(current => ({ ...current, [typeId]: (current[typeId] || 0) + secondsToFlush }))
   }

   const { runningId: runningBreakId, trackedSeconds: breakTrackedSeconds, start, stop } = useTracker(handleFlush)

   // runningSessionSeconds is the total time spent on the current break session, including any time that has been flushed to breakDurations
   const runningSessionSeconds = sessionSeconds + breakTrackedSeconds

   // breakType: { id, name, emoji } — name/emoji are snapshotted onto the history at stop time
   const startBreak = (breakType) => {
      sessionSecondsRef.current = 0
      setSessionSeconds(0)
      runningBreakType.current = breakType
      start(breakType.id)
      setEmoji(breakType.emoji)
      setLabel(breakType.name)
   }

   const stopBreak = () => {
      if (!runningBreakId) return
      const breakType = runningBreakType.current
      stop()
      // TODO 6 (Phase 1): this is the one place a finished break session currently
      // gets logged (one object per completed break, pushed to history's breaks[]
      // by BreaksProvider). Once sessions[] exists, decide whether this payload
      // also carries the session list for that break, or whether history reads
      // sessions straight off the break-type's own Activity instead (this ties into
      // Phase 4's "history becomes a derived filter" — don't build both).
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
      setEmoji(null)
      setLabel(null)
   }

   return { maxBreakTime, setMaxBreakTime, runningBreakId, breakTrackedSeconds, runningSessionSeconds, breakDurations, startBreak, stopBreak, emoji, label }
}

export default useBreakTracking
