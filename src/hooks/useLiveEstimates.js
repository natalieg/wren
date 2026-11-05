import { useEffect } from 'react'

export const LIVE_REFRESH_MS = 5 * 60 * 1000

// while enabled, moves the estimate anchor to "now" every 5 min and when the tab comes back
// (background tabs throttle timers, so the interval alone isn't enough)
function useLiveEstimates(enabled, setNewActionTime) {
   useEffect(() => {
      if (!enabled) return
      const refresh = () => setNewActionTime(new Date())
      const onVisible = () => { if (document.visibilityState === 'visible') refresh() }
      refresh()
      const id = setInterval(refresh, LIVE_REFRESH_MS)
      document.addEventListener('visibilitychange', onVisible)
      return () => {
         clearInterval(id)
         document.removeEventListener('visibilitychange', onVisible)
      }
   }, [enabled, setNewActionTime])
}

export default useLiveEstimates
