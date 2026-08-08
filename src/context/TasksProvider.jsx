import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import TasksContext from './TasksContext'
import useTasks from '../hooks/useTasks'
import useTaskKeyboardShortcuts from '../hooks/useTaskKeyboardShortcuts'
import useTabTitle from '../hooks/useTabTitle'
import Modal from '../components/elements/Modal'
import TaskEditModalBody from '../components/tasks/TaskEditModalBody'

function TasksProvider({ children }) {

    const TasksContextValue = useTasks()
    const { taskList, editingTaskId, taskActions, runningTaskId, trackedSeconds } = TasksContextValue
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
    </TasksContext.Provider>
}

export default TasksProvider

