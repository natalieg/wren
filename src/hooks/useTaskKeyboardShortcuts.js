import { useEffect, useRef } from 'react'
import taskShortcuts from '../config/taskShortcuts'

// Resolves the hovered task via elementFromPoint at keydown time instead of
// onMouseEnter/onMouseLeave state — those don't refire when a shortcut moves a task
// to a different list and the DOM shifts under a stationary cursor, which silently
// dropped every shortcut after the first in a rapid sequence (design/_Today.md bug).
export default function useTaskKeyboardShortcuts(taskList, actions) {
    const mousePos = useRef({ x: -1, y: -1 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY }
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useEffect(() => {
        const handleKeyDown = (e) => {
            const active = document.activeElement
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return

            const { x, y } = mousePos.current
            const hovered = document.elementFromPoint(x, y)?.closest('[data-task-id]')
            if (!hovered) return

            const task = taskList.find(t => t.id === Number(hovered.dataset.taskId))
            if (!task) return

            const shortcut = taskShortcuts.find(s =>
                s.context === hovered.dataset.taskContext && s.key === e.key && (!s.condition || s.condition(task)))
            if (!shortcut) return
            e.preventDefault() // e.g. stops space from scrolling the page
            shortcut.action(task, actions)
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [taskList, actions])
}
