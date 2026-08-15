import { useEffect } from 'react'
import { formatTimeWithSeconds } from '../utils/formatTime'

// matches index.html, so stopping the timer puts the tab back exactly as it was
const BASE_TITLE = '🐦 Wren'
// long labels eat the whole tab, and the time is the part you actually want to read
const MAX_LABEL = 24

// shows running time of tasks or breaks
export default function useTabTitle(trackedSeconds, label, symbol = '▴' ) {
   useEffect(() => {
      if (!label) {
         document.title = BASE_TITLE
         return
      }
      const elapsed = formatTimeWithSeconds(trackedSeconds || 0)
      const labelText = label?.length > MAX_LABEL
         ? `${label.slice(0, MAX_LABEL).trimEnd()}…`
         : label
      document.title = `${symbol} ${elapsed} · ${labelText}`
      return () => { document.title = BASE_TITLE }
   }, [trackedSeconds, label, symbol])
}
