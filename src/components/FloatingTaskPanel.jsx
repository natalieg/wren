import { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import TasksContext from '../context/TasksContext'
import { TaskItemViewOnly } from './tasks/TaskItem'
import FloatingPanel from './elements/FloatingPanel'

//rough panel size, can be changed for a ref + getBoundingClientRect() if size changes a lot
const PANEL_WIDTH = 300
const PANEL_HEIGHT = 70

export default function FloatingTaskPanel() {
    const { pathname } = useLocation()
    const { taskList, runningTaskId, trackedSeconds, taskActions } = useContext(TasksContext)
    const visible = pathname !== '/' && runningTaskId !== null
    const runningTask = taskList.find(t => t.id === runningTaskId)

    return (
        <FloatingPanel storageKey='floatingTaskPanelPosition' width={PANEL_WIDTH} height={PANEL_HEIGHT} visible={visible}>
            <TaskItemViewOnly
                task={runningTask}
                isTracking={true}
                trackedSeconds={trackedSeconds}
                onToggleTracking={taskActions.stopTracking}
            />
        </FloatingPanel>
    )
}
