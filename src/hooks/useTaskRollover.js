import useDayActions from './useDayActions'
import { loadSettings } from '../utils/settings'
import { ACTIVE, BACKLOG, DONE, NEXTUP } from '../utils/constants'
import { applyListChange } from '../utils/taskTransitions'
import { newTaskId } from '../utils/taskId'

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
// recurring tasks: copy finished ones to a new active task, gated by the rolloverRecurring setting
  const nextOccurrence = (task) => ({
    id: newTaskId(),
    label: task.label,
    time: task.time,
    list: ACTIVE,
    recurring: { ...task.recurring },
  })

  // a new copy of every finished recurring task. The finished one is left exactly as it is
  const copyRecurringTasks = () => {
    setTaskList(currentTaskList => {
      // a habit that already has an unfinished task needs no copy
      const openHabitIds = new Set(currentTaskList
        .filter(t => t.list !== DONE && t.recurring?.id)
        .map(t => t.recurring.id))

      const copies = []
      for (const task of currentTaskList) {
        if (task.list !== DONE || !task.recurring?.active) continue
        if (openHabitIds.has(task.recurring.id)) continue
        openHabitIds.add(task.recurring.id) // also dedupes several finished days at once
        copies.push(nextOccurrence(task))
      }

      if (copies.length === 0) return currentTaskList
      return [...currentTaskList, ...copies]
    })
  }

  // deletes finished tasks on rollOver if the autoDeleteFinished setting is enabled
  const deleteFinishedTasksOnRollover = () => {
    if (!loadSettings().autoDeleteFinished) return
    setTaskList(currentTaskList => currentTaskList.filter(t => t.list !== DONE))
  }

  return useDayActions({
    // the copy has to be made before the delete — not so the task survives, but so
    // there is still something to copy from
    onRollover: () => { promoteNextUpTasks(); copyRecurringTasks(); deleteFinishedTasksOnRollover(); }
  })
}

export default useTaskRollover
