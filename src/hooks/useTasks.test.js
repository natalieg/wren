import { describe, it, expect, beforeEach } from 'vitest'
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
})
