import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useTasks from './useTasks'

describe('useTasks', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('adds a task', () => {
        const { result } = renderHook(() => useTasks('Write tests', 15))

        act(() => {
            result.current.taskActions.handleAddTask()
        })

        expect(result.current.taskList).toHaveLength(1)
        expect(result.current.taskList[0]).toMatchObject({
            label: 'Write tests',
            time: 15,
            done: false,
            active: true,
        })
    })

    it('marks a task done', () => {
        const { result } = renderHook(() => useTasks('Write tests', 15))

        act(() => {
            result.current.taskActions.handleAddTask()
        })
        const id = result.current.taskList[0].id

        act(() => {
            result.current.taskActions.toggleDone(id)
        })

        expect(result.current.taskList[0].done).toBe(true)
        expect(result.current.finishedTasks).toHaveLength(1)
        expect(result.current.openTasks).toHaveLength(0)
    })

    describe('time tracking', () => {
        beforeEach(() => {
            vi.useFakeTimers()
        })

        afterEach(() => {
            vi.useRealTimers()
        })

        it('ticks trackedSeconds once per second while a task is running', () => {
            const { result } = renderHook(() => useTasks('Write tests', 10))
            act(() => { result.current.taskActions.handleAddTask() })
            const id = result.current.taskList[0].id

            act(() => { result.current.taskActions.startTracking(id) })
            act(() => { vi.advanceTimersByTime(5000) })

            expect(result.current.runningTaskId).toBe(id)
            expect(result.current.trackedSeconds).toBe(5)
        })

        it('flushes tracked time into the task on stop, exactly once', () => {
            const { result } = renderHook(() => useTasks('Write tests', 10))
            act(() => { result.current.taskActions.handleAddTask() })
            const id = result.current.taskList[0].id

            act(() => { result.current.taskActions.startTracking(id) })
            act(() => { vi.advanceTimersByTime(5000) })
            act(() => { result.current.taskActions.stopTracking() })

            expect(result.current.runningTaskId).toBe(null)
            expect(result.current.trackedSeconds).toBe(0)
            expect(result.current.taskList.find(t => t.id === id).trackedTime).toBe(5)
        })

        it('flushes the previous task before switching to a new one', () => {
            const { result, rerender } = renderHook(
                ({ newTask, taskTime }) => useTasks(newTask, taskTime),
                { initialProps: { newTask: 'Task A', taskTime: 10 } }
            )
            act(() => { result.current.taskActions.handleAddTask() })
            const idA = result.current.taskList[0].id

            rerender({ newTask: 'Task B', taskTime: 10 })
            act(() => { result.current.taskActions.handleAddTask() })
            const idB = result.current.taskList.find(t => t.id !== idA).id

            act(() => { result.current.taskActions.startTracking(idA) })
            act(() => { vi.advanceTimersByTime(7000) })
            act(() => { result.current.taskActions.startTracking(idB) })

            expect(result.current.runningTaskId).toBe(idB)
            expect(result.current.trackedSeconds).toBe(0)
            expect(result.current.taskList.find(t => t.id === idA).trackedTime).toBe(7)
        })

        // Note: the 5-minute failsafe interval itself isn't covered here — simulating
        // 5+ real minutes via fake timers hits a known rough edge where React's effect
        // commits don't interleave with a fully fake-timer-driven clock the way real
        // setInterval firings would. Its actual flush math is the same flushTrackedTime
        // exercised by the stop/switch tests above; verified manually by shortening the
        // interval during dev (see conversation 2026-08-01).

        it("anchors the running task's estimate to now once it goes over its own time budget", () => {
            vi.setSystemTime(new Date('2026-08-01T12:00:00Z'))

            const { result } = renderHook(() => useTasks('Write tests', 1)) // 1-minute task
            act(() => { result.current.taskActions.handleAddTask() })
            const id = result.current.taskList[0].id

            act(() => { result.current.taskActions.startTracking(id) })
            act(() => { vi.advanceTimersByTime(90 * 1000) }) // 90s tracked, over the 60s estimate

            expect(result.current.openTasks[0].estimate.getTime()).toBe(Date.now())
        })
    })
})
