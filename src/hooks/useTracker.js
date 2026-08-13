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

  const flush = () => {
    if (!runningId || !trackingStartTime.current) return
    const elapsedMs = Date.now() - trackingStartTime.current
    const secondsToFlush = Math.floor(elapsedMs / 1000)
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
