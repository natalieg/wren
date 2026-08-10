import useDayActions from './useDayActions'
import { loadSettings } from '../utils/settings'
import { ACTIVE, BACKLOG, DONE, NEXTUP } from '../utils/constants'
import { applyListChange } from '../utils/taskTransitions'

/** What a new logical day does to the task list. useDayActions owns *when* a day
 * rolls over and knows nothing about tasks — this is the tasks half of that split,
 * with each of the two effects gated by its own setting. */
// day rollover, applied to the task list
function useTaskRollover(setTaskList) {
  // nextUp -> active on a new day, gated by the rolloverActive setting
  const promoteNextUpTasks = () => {
    if (!loadSettings().rolloverActive) return
    setTaskList(currentTaskList => {
      const toPromote = currentTaskList.filter(t =>
        t.list === BACKLOG && (t.backlog?.bucket ?? NEXTUP) === NEXTUP)
      if (toPromote.length === 0) return currentTaskList
      const rest = currentTaskList.filter(t => !toPromote.includes(t))
      const promoted = toPromote.map(t => applyListChange(t, ACTIVE))
      return [...rest, ...promoted]
    })
  }

  // deletes finished tasks on rollOver if the autoDeleteFinished setting is enabled
  const deleteFinishedTasksOnRollover = () => {
    if (!loadSettings().autoDeleteFinished) return
    setTaskList(currentTaskList => currentTaskList.filter(t => t.list !== DONE))
  }

  return useDayActions({
    onRollover: () => { promoteNextUpTasks(); deleteFinishedTasksOnRollover(); }
  })
}

export default useTaskRollover
