import { useEffect, useRef } from 'react'
import { minutesToSeconds } from '../utils/formatTime'
import { playTimerSound } from '../utils/playSound'

export default function useTimeAlert(taskList, runningId, trackedSeconds) {
   const alertedRef = useRef(null)
   useEffect(() => {
      const task = taskList.find(t => t.id === runningId)
      if (!task) { alertedRef.current = null; return }
      const elapsed = (task.trackedTime || 0) + trackedSeconds
      const isOver = elapsed > minutesToSeconds(task.time)
      if (isOver && alertedRef.current !== runningId) {
         // playTimerSound reads settings fresh each time 
         playTimerSound()
         alertedRef.current = runningId
      }
      if (!isOver) alertedRef.current = null
   }, [taskList, runningId, trackedSeconds])
}
