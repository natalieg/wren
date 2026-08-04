// Bridge to fix the 'time stops tracking' issue when switching to another page
import { } from 'react'
import TasksContext from './TasksContext'
import useTasks from '../hooks/useTasks'

function TasksProvider({ children }) {

    const TasksContextValue = useTasks()

    return <TasksContext.Provider value={TasksContextValue}>
        {children}
    </TasksContext.Provider>
}

export default TasksProvider

