import { useState, useEffect, useRef } from 'react'

/** Generic single-timer core: ticking, visibility recovery, and a 5-min flush safety
 * net, tracking one running id at a time. Knows nothing about what it's timing — it
 * hands the elapsed seconds to onFlush and lets the caller decide where they go
 * (a task's trackedTime, a break session accumulator, ...). Shared by
 * useTimeTracking and useBreakTracking so both track the same way. */
function useTracker(onFlush) {
  const [runningId, setRunningId] = useState(null)
  const [trackedSeconds, setTrackedSeconds] = useState(0)
  const trackingStartTime = useRef(null)

  // ticks aligned to the second boundary, not every 1000ms — avoids drift
  useEffect(() => {
    if (!runningId) return
    trackingStartTime.current = Date.now()
    let timeout
    const tick = () => {
      const elapsedMs = Date.now() - trackingStartTime.current
      setTrackedSeconds(Math.floor(elapsedMs / 1000))
      timeout = setTimeout(tick, 1000 - (elapsedMs % 1000))
    }
    timeout = setTimeout(tick, 1000)
    return () => clearTimeout(timeout)
  }, [runningId])

  // Visibility Listener
  useEffect(() => {
    if (!runningId) return
    const onVisible = () => {
      if (document.visibilityState === 'visible' && trackingStartTime.current) {
        setTrackedSeconds(Math.floor((Date.now() - trackingStartTime.current) / 1000))
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [runningId])

  // TODO 2 (Phase 1): decide before implementing — does the 5min failsafe interval
  // below count as its own session boundary (one continuous run = several short
  // sessions, one per flush), or should a session span from real start() to real
  // stop() regardless of how many failsafe flushes happened in between (one
  // continuous run = one session, just flushed piecemeal)? Open question, also
  // flagged in design/unified-activity-model.md — this changes what `onFlush` needs
  // to receive (just seconds, like now, or a started/stopped pair per call).
  const flush = () => {
    if (!runningId || !trackingStartTime.current) return
    const elapsedMs = Date.now() - trackingStartTime.current
    const secondsToFlush = Math.floor(elapsedMs / 1000)
    // TODO 3 (Phase 1): once TODO 2 is decided, this call likely needs to also pass
    // along the session's started/stopped timestamps (not just secondsToFlush) so
    // useTimeTracking/useBreakTracking can append to sessions[] here.
    onFlush(runningId, secondsToFlush)
    // Session-Reset: neue Baseline, um die angefangene Sekunde zurückversetzt —
    // sonst verfällt der Rest bei jedem Flush und die Uhr geht pro 5min bis zu 1s nach
    trackingStartTime.current = Date.now() - (elapsedMs % 1000)
    setTrackedSeconds(0)
  }

  // 'saves' tracked time all 5min to avoid losses
  useEffect(() => {
    if (!runningId) return
    const interval = setInterval(flush, 5 * 60 * 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runningId])

  // TODO 1 (Phase 1 — unified-activity-model.md): capture this session's start
  // timestamp (`new Date()`) somewhere callers can read it back — trackingStartTime
  // is currently just an internal ref for tick math, not exposed. Needed so a
  // { started, stopped } pair can be built once the session ends.
  const start = (id) => setRunningId(id)

  const stop = () => {
    if (!runningId) return
    flush()
    setRunningId(null)
  }

  // stops and flushes only if the given id is the one currently running — no-op
  // otherwise, so callers can fire it unconditionally instead of checking first
  const stopIfRunning = (id) => {
    if (id !== runningId) return
    setRunningId(null)
    flush()
  }

  return { runningId, trackedSeconds, start, stop, flush, stopIfRunning }
}

export default useTracker
