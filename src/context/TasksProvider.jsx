import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import TasksContext from './TasksContext'
import useTasks from '../hooks/useTasks'
import useTaskKeyboardShortcuts from '../hooks/useTaskKeyboardShortcuts'
import Modal from '../components/elements/Modal'
import TaskEditModalBody from '../components/tasks/TaskEditModalBody'

function TasksProvider({ children }) {

    const TasksContextValue = useTasks()
    const { taskList, editingTaskId, taskActions } = TasksContextValue
    useTaskKeyboardShortcuts(taskList, {
        ...taskActions,
        runningTaskId: TasksContextValue.runningTaskId,
    })

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
                    task={editingTask}
                    handleChange={taskActions.handleFieldChange}
                    toggleDone={taskActions.toggleDone}
                    toggleActive={taskActions.toggleActive}
                    closeModal={() => taskActions.setEditingTaskId(null)} />
            </Modal>}
    </TasksContext.Provider>
}

export default TasksProvider

