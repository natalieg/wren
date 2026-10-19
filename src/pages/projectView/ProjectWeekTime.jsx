import { useContext } from 'react'
import TasksContext from '../../context/TasksContext'
import useHistoryContext from '../../hooks/useHistoryContext'
import { projectWeekMinutes } from '../../utils/projectTime'
import { formatTime } from '../../utils/formatTime'

// time tracked on this project since Monday, live while one of its tasks runs
export default function ProjectWeekTime({ projectId }) {
   const { taskList, runningTaskId, trackedSeconds } = useContext(TasksContext)
   const { history } = useHistoryContext()
   const minutes = projectWeekMinutes(projectId, {
      history, taskList, runningTaskId, trackedSeconds,
      // eslint-disable-next-line react-hooks/purity -- display-only, re-renders with the timer anyway
      now: Date.now(),
   })

   return (
      <span className='shrink-0 font-retro text-lg px-2 rounded-sm bg-accent-soft text-text-primary select-none'
         title='Tracked on this project this week (Mon–Sun)'>
         {formatTime(minutes)} <span className='text-text-muted'>this week</span>
      </span>
   )
}
