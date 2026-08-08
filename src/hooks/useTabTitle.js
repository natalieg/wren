import { useEffect } from 'react'
import { formatTimeWithSeconds } from '../utils/formatTime'

// matches index.html, so stopping the timer puts the tab back exactly as it was
const BASE_TITLE = '🐦 Wren'
// long labels eat the whole tab, and the time is the part you actually want to read
const MAX_LABEL = 24

// Shows the running task's time in the browser tab, so a backgrounded Wren still
// tells you a timer is going. No timer of its own — trackedSeconds already
// re-renders once a second, this just rides along.
export default function useTabTitle(runningTask, trackedSeconds) {
   useEffect(() => {
      if (!runningTask) {
         document.title = BASE_TITLE
         return
      }
      const elapsed = formatTimeWithSeconds((runningTask.trackedTime || 0) + trackedSeconds)
      const label = runningTask.label.length > MAX_LABEL
         ? `${runningTask.label.slice(0, MAX_LABEL).trimEnd()}…`
         : runningTask.label
      document.title = `▴ ${elapsed} · ${label}`
      return () => { document.title = BASE_TITLE }
   }, [runningTask, trackedSeconds])
}
