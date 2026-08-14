import { useEffect, useRef, useState } from 'react'
import { minutesToSeconds } from '../utils/formatTime'
import shortBellUrl from '../assets/sounds/shortBell.wav'

export default function useTimeAlert(taskList, runningId, trackedSeconds) {
   const [audio] = useState(() => new Audio(shortBellUrl))
   const alertedRef = useRef(null)
   useEffect(() => {
      const task = taskList.find(t => t.id === runningId)
      if (!task) { alertedRef.current = null; return }
      const elapsed = (task.trackedTime || 0) + trackedSeconds
      const isOver = elapsed > minutesToSeconds(task.time)
      if (isOver && alertedRef.current !== runningId) {
         audio.play()
         alertedRef.current = runningId
      }
      if (!isOver) alertedRef.current = null
   }, [taskList, runningId, trackedSeconds, audio])
}
