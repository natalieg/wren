import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TasksContext from './TasksContext'
import TrackingContext from './TrackingContext'
import useTasks from '../hooks/useTasks'
import { getOpenCopies } from '../hooks/useTaskCopy'
import useBreaksContext from '../hooks/useBreaksContext'
import useTaskKeyboardShortcuts from '../hooks/useTaskKeyboardShortcuts'
import useTabTitle from '../hooks/useTabTitle'
import { buildActivityActions } from '../utils/activityTracking'
import Modal from '../components/elements/Modal'
import TaskEditModalBody from '../components/tasks/TaskEditModalBody'

function TasksProvider({ children }) {
   const tasks = useTasks()
   const breaks = useBreaksContext()
   const { taskList, editingTaskId, runningTaskId, trackedSeconds, setNewActionTime } = tasks
   const { startTracking, stopTracking, startBreak, stopBreak } = buildActivityActions({
      runningTaskId,
      runningBreakId: breaks.runningBreakId,
      taskActions: tasks.taskActions,
      breakActions: breaks,
      setNewActionTime,
   })
   const taskActions = { ...tasks.taskActions, startTracking, stopTracking }
   const TasksContextValue = { ...tasks, taskActions }
   const [modalBig, setModalBig] = useState(false)

   useTaskKeyboardShortcuts(taskList, {
      ...taskActions,
      runningTaskId,
   })

   const runningTask = taskList.find(t => t.id === runningTaskId)
   useTabTitle((runningTask?.trackedTime || 0) + trackedSeconds, runningTask?.label || '',)

   // Modal survives route changes, unlike floating panels
   const location = useLocation()
   useEffect(() => {
      taskActions.setEditingTaskId(null)
      // eslint-disable-next-line react-hooks/exhaustive-deps -- pathname change only
   }, [location.pathname])

   // Find editing task by ID from full taskList
   const editingTask = taskList.find(t => t.id === editingTaskId)
   // true when this task opted out of synching but a sibling in its family is still synching
   const notesOutOfSync = editingTask && !editingTask.noteSynch &&
      getOpenCopies(editingTask.label, taskList).some(t => t.noteSynch)

   return <TasksContext.Provider value={TasksContextValue}>
      <TrackingContext.Provider value={{ startTracking, stopTracking, startBreak, stopBreak }}>
         {children}
         {editingTask &&
            <Modal title={editingTask.label} width={modalBig ? 'w-[90%] h-[80%]' : 'w-120'}
               onMaximize={modalBig ? undefined : () => setModalBig(true)}
               onMinimize={!modalBig ? undefined :() => setModalBig(false)}
               onClose={() => taskActions.setEditingTaskId(null)}>
               <TaskEditModalBody
                  isRunning={editingTask.id === runningTaskId}
                  trackedSeconds={trackedSeconds}
                  task={editingTask}
                  taskActions={taskActions}
                  focusMode={modalBig}
                  notesOutOfSync={notesOutOfSync}
                  closeModal={() => taskActions.setEditingTaskId(null)} />
            </Modal>}
      </TrackingContext.Provider>
   </TasksContext.Provider>
}

export default TasksProvider
