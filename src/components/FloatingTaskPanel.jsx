import { useContext, useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import TasksContext from '../context/TasksContext'
import { TaskItemViewOnly } from './tasks/TaskItem'

export default function FloatingTaskPanel() {
    const { pathname } = useLocation()
    const { taskList, runningTaskId, trackedSeconds, taskActions } = useContext(TasksContext)
    const visible = pathname !== '/' && runningTaskId !== null
    const runningTask = taskList.find(t => t.id === runningTaskId)
    const [position, setPosition] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('floatingTaskPanelPosition')) ||
                { x: window.innerWidth - 300, y: window.innerHeight - 100 }
        } catch (e) {
            return { x: window.innerWidth - 300, y: window.innerHeight - 100 }
        }
    }) //default corner

    useEffect(() => {
        localStorage.setItem('floatingTaskPanelPosition', JSON.stringify(position))
    }, [position])

    //rough panel size, can be changed for a ref + getBoundingClientRect() if size changes a lot
    const PANEL_WIDTH = 300
    const PANEL_HEIGHT = 70

    const isDragging = useRef(false)

    // tracks offset of the pointer relative to the panel's top-left corner
    const dragOffset = useRef({ x: 0, y: 0 })

    const clamp = (x, y) => ({
        x: Math.max(0, Math.min(x, window.innerWidth - PANEL_WIDTH)),
        y: Math.max(0, Math.min(y, window.innerHeight - PANEL_HEIGHT)),
    })

    const handlePointerDown = (e) => {
        isDragging.current = true
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        }
        // keeps sending pointermove/up to this element even once the cursor leaves it 
        e.target.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e) => {
        if (!isDragging.current) return
        // reverse of the offset math above: subtract it back 
        setPosition(clamp(e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y))
    }

    const handlePointerUp = (e) => {
        isDragging.current = false
        e.target.releasePointerCapture(e.pointerId)
    }

    if (!visible) return null
    return (
        <div className={`bg-white rounded-md overflow-hidden shadow-lg`}
            style={{ position: 'fixed', left: position.x, top: position.y }}>
            <div className='bg-gradient-softer px-2 w-full cursor-pointer border-b border-dark'
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >⠿</div>
            <div>
                <TaskItemViewOnly
                    task={runningTask}
                    isTracking={true}
                    trackedSeconds={trackedSeconds}
                    onToggleTracking={taskActions.stopTracking}
                />
            </div>
        </div>
    )
}
