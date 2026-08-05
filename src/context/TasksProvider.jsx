// Bridge to fix the 'time stops tracking' issue when switching to another page
import { } from 'react'
import TasksContext from './TasksContext'
import useTasks from '../hooks/useTasks'
import useTaskKeyboardShortcuts from '../hooks/useTaskKeyboardShortcuts'

function TasksProvider({ children }) {

    const TasksContextValue = useTasks()
    useTaskKeyboardShortcuts(TasksContextValue.taskList, {
        ...TasksContextValue.taskActions,
        runningTaskId: TasksContextValue.runningTaskId,
    })

    return <TasksContext.Provider value={TasksContextValue}>
        {children}
    </TasksContext.Provider>
}

export default TasksProvider

