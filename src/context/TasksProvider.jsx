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

    useTaskKeyboardShortcuts(taskList, {
        ...taskActions,
        runningTaskId,
    })

    const runningTask = taskList.find(t => t.id === runningTaskId)
    useTabTitle((runningTask?.trackedTime || 0) + trackedSeconds, runningTask?.label || '', )

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
