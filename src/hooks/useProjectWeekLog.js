import { useContext } from 'react'
import TasksContext from '../context/TasksContext'
import useHistoryContext from './useHistoryContext'
import { projectWeekLog } from '../utils/projectTime'
import { loadSettings } from '../utils/settings'

// this week's time entries for one project, live while one of its tasks runs
export default function useProjectWeekLog(projectId) {
   const { taskList, runningTaskId, trackedSeconds } = useContext(TasksContext)
   const { history } = useHistoryContext()
   const log = projectWeekLog(projectId, {
      history, taskList, runningTaskId, trackedSeconds,
      rolloverHour: loadSettings().rolloverHour,
      // eslint-disable-next-line react-hooks/purity -- display-only, re-renders with the timer anyway
      now: Date.now(),
   })
   return { log, minutes: log.reduce((sum, e) => sum + e.minutes, 0) }
}
