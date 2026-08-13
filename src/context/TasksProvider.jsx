import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import TasksContext from './TasksContext'
import TrackingContext from './TrackingContext'
import useTasks from '../hooks/useTasks'
import useBreaksContext from '../hooks/useBreaksContext'
import useTaskKeyboardShortcuts from '../hooks/useTaskKeyboardShortcuts'
import useTabTitle from '../hooks/useTabTitle'
import { buildActivityActions } from '../utils/activityTracking'
import Modal from '../components/elements/Modal'
import TaskEditModalBody from '../components/tasks/TaskEditModalBody'

function TasksProvider({ children }) {

    const tasks = useTasks()
    const breaks = useBreaksContext()
    const { taskList, editingTaskId, runningTaskId, trackedSeconds } = tasks

    const { startTracking, stopTracking, startBreak, stopBreak } = buildActivityActions({
        runningTaskId,
        runningBreakId: breaks.runningBreakId,
        taskActions: tasks.taskActions,
        breakActions: breaks,
    })

    const taskActions = { ...tasks.taskActions, startTracking, stopTracking }
    const TasksContextValue = { ...tasks, taskActions }

    useTaskKeyboardShortcuts(taskList, {
        ...taskActions,
        runningTaskId,
    })

    // lives here, not on a page — the tab title has to keep ticking on every route
    useTabTitle(taskList.find(t => t.id === runningTaskId), trackedSeconds)

    // Modal survives route changes, unlike floating panels
    const location = useLocation()
    useEffect(() => {
        taskActions.setEditingTaskId(null)
        // eslint-disable-next-line react-hooks/exhaustive-deps -- pathname change only
    }, [location.pathname])

    // Find editing task by ID from full taskList
    const editingTask = taskList.find(t => t.id === editingTaskId)

    return <TasksContext.Provider value={TasksContextValue}>
       <TrackingContext.Provider value={{ startTracking, stopTracking, startBreak, stopBreak }}>
          {children}
          {editingTask &&
             <Modal title='edit task' width='w-120' onClose={() => taskActions.setEditingTaskId(null)}>
                <TaskEditModalBody
                   isRunning={editingTask.id === runningTaskId}
                   trackedSeconds={trackedSeconds}
                   task={editingTask}
                   taskActions={taskActions}
                   closeModal={() => taskActions.setEditingTaskId(null)} />
             </Modal>}
       </TrackingContext.Provider>
    </TasksContext.Provider>
}

export default TasksProvider
